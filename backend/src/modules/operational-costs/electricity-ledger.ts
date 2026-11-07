import { BadRequestException } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import type { DbClient } from '../../db/db.module';
import { expenses, operationalCosts } from '../../db/schema';

export type PurchaseEvent = {
  id: string;
  units: number;
  created_at: Date;
};

export type OperationEvent = {
  id: string;
  starting_units: number;
  remaining_units: number;
  units_used: number;
  created_at: Date;
};

type ElectricityLedgerChange =
  | { kind: 'purchase'; id: string; replacement: PurchaseEvent | null }
  | { kind: 'operation'; id: string; replacement: OperationEvent | null };

export async function validateElectricityLedger(
  db: DbClient,
  userId: string,
  roundId: string,
  change?: ElectricityLedgerChange,
): Promise<number> {
  const [purchaseRows, operationRows] = await Promise.all([
    db
      .select({
        id: expenses.id,
        units: expenses.unit_value,
        created_at: expenses.created_at,
      })
      .from(expenses)
      .where(and(
        eq(expenses.user_id, userId),
        eq(expenses.round_id, roundId),
        sql`lower(${expenses.category}) = 'electricity'`,
      )),
    db.query.operationalCosts.findMany({
      where: and(eq(operationalCosts.user_id, userId), eq(operationalCosts.round_id, roundId)),
    }),
  ]);

  const purchases: PurchaseEvent[] = purchaseRows
    .filter((row): row is typeof row & { units: string } => row.units !== null)
    .map((row) => ({ id: row.id, units: Number(row.units), created_at: row.created_at }));
  const operations: OperationEvent[] = operationRows.map((row) => ({
    id: row.id,
    starting_units: Number(row.starting_units),
    remaining_units: Number(row.remaining_units),
    units_used: Number(row.units_used),
    created_at: row.created_at,
  }));

  if (change?.kind === 'purchase') {
    const index = purchases.findIndex((event) => event.id === change.id);
    if (index >= 0) purchases.splice(index, 1);
    if (change.replacement) purchases.push(change.replacement);
  } else if (change?.kind === 'operation') {
    const index = operations.findIndex((event) => event.id === change.id);
    if (index >= 0) operations.splice(index, 1);
    if (change.replacement) operations.push(change.replacement);
  }

  return validateElectricityEvents(purchases, operations);
}

export function validateElectricityEvents(
  purchases: PurchaseEvent[],
  operations: OperationEvent[],
): number {
  const events = [
    ...purchases.map((event) => ({ kind: 'purchase' as const, event })),
    ...operations.map((event) => ({ kind: 'operation' as const, event })),
  ].sort((a, b) => {
    const timeDifference = a.event.created_at.getTime() - b.event.created_at.getTime();
    if (timeDifference !== 0) return timeDifference;
    return a.kind === b.kind ? 0 : a.kind === 'purchase' ? -1 : 1;
  });

  let balance = 0;
  for (const entry of events) {
    if (entry.kind === 'purchase') {
      if (!Number.isFinite(entry.event.units) || entry.event.units < 0) {
        throw new BadRequestException('Electricity purchase units must be zero or more.');
      }
      balance += entry.event.units;
      continue;
    }

    const operation = entry.event;
    if (
      Math.abs(operation.starting_units - balance) > 0.01 ||
      operation.remaining_units < 0 ||
      operation.remaining_units > operation.starting_units ||
      Math.abs(operation.units_used - (operation.starting_units - operation.remaining_units)) > 0.01
    ) {
      throw new BadRequestException(
        `Electricity readings do not reconcile. The starting balance for this operation must be ${balance.toLocaleString()} units, matching the prior recorded balance.`,
      );
    }
    balance = operation.remaining_units;
  }

  return balance;
}
