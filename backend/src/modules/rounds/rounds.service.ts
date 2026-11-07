import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, eq, ne, sql } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import {
  expenses,
  operationalCosts,
  operationRounds,
  procurementOrders,
  productionBatches,
  roundSackOpeningBalances,
  sales,
} from '../../db/schema';
import { calculateSackCarryover } from './sack-carryover';

function csvCell(value: unknown): string {
  const text = value instanceof Date ? value.toISOString() : String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function csvSection<T extends object>(title: string, rows: T[]): string {
  const publicRows = rows.map((row) => {
    const record = row as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(record).filter(([key]) => key !== 'user_id' && key !== 'round_id'),
    );
  });
  if (publicRows.length === 0) return `\n${title}\nNo records`;
  const headers = Object.keys(publicRows[0]);
  return `\n${title}\n${headers.map(csvCell).join(',')}\n${publicRows
    .map((row) => headers.map((header) => csvCell(row[header])).join(','))
    .join('\n')}`;
}

@Injectable()
export class RoundsService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  async findAll(userId: string) {
    return this.db.query.operationRounds.findMany({
      where: eq(operationRounds.user_id, userId),
      orderBy: asc(operationRounds.created_at),
    });
  }

  async create(userId: string, name: string) {
    const cleanName = name.trim();
    if (!cleanName) throw new BadRequestException('Round name is required.');
    try {
      return await this.db.transaction(async (tx) => {
        const sourceRound = await tx.query.operationRounds.findFirst({
          where: and(eq(operationRounds.user_id, userId), eq(operationRounds.is_active, true)),
        });
        const [round] = await tx
          .insert(operationRounds)
          .values({ user_id: userId, name: cleanName })
          .returning();

        let carriedSacks: Array<{ sack_size: number; quantity: number }> = [];
        if (sourceRound) {
          const [openingRows, purchaseRows, productionRows] = await Promise.all([
            tx
              .select({
                size: roundSackOpeningBalances.sack_size,
                quantity: sql<string>`coalesce(sum(${roundSackOpeningBalances.quantity}), 0)::text`,
              })
              .from(roundSackOpeningBalances)
              .where(and(
                eq(roundSackOpeningBalances.user_id, userId),
                eq(roundSackOpeningBalances.round_id, sourceRound.id),
              ))
              .groupBy(roundSackOpeningBalances.sack_size),
            tx
              .select({
                size: expenses.sack_size,
                quantity: sql<string>`coalesce(sum(${expenses.unit_value}), 0)::text`,
              })
              .from(expenses)
              .where(and(
                eq(expenses.user_id, userId),
                eq(expenses.round_id, sourceRound.id),
                sql`lower(${expenses.category}) = 'sacks'`,
              ))
              .groupBy(expenses.sack_size),
            tx
              .select({
                sacks5: sql<string>`coalesce(sum(${productionBatches.flour_sacks_5kg}), 0)::text`,
                sacks10: sql<string>`coalesce(sum(${productionBatches.flour_sacks_10kg}), 0)::text`,
                sacks25: sql<string>`coalesce(sum(${productionBatches.flour_sacks_25kg}), 0)::text`,
              })
              .from(productionBatches)
              .where(and(
                eq(productionBatches.user_id, userId),
                eq(productionBatches.round_id, sourceRound.id),
              )),
          ]);
          const openingMap = new Map(openingRows.map((row) => [row.size, Number(row.quantity)]));
          const purchasedMap = new Map(purchaseRows.map((row) => [row.size, Number(row.quantity)]));
          carriedSacks = calculateSackCarryover(
            {
              5: openingMap.get(5) ?? 0,
              10: openingMap.get(10) ?? 0,
              25: openingMap.get(25) ?? 0,
            },
            {
              5: purchasedMap.get(5) ?? 0,
              10: purchasedMap.get(10) ?? 0,
              25: purchasedMap.get(25) ?? 0,
            },
            { 5: Number(productionRows[0].sacks5), 10: Number(productionRows[0].sacks10), 25: Number(productionRows[0].sacks25) },
          );

          if (carriedSacks.length > 0) {
            await tx.insert(roundSackOpeningBalances).values(
              carriedSacks.map((item) => ({
                ...item,
                round_id: round.id,
                user_id: userId,
                source_round_name: sourceRound.name,
              })),
            );
          }
        }

        return { ...round, carried_sacks: carriedSacks };
      });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException('A round with this name already exists.');
      }
      throw error;
    }
  }

  async activate(userId: string, roundId: string) {
    const round = await this.findRound(userId, roundId);
    await this.db.transaction(async (tx) => {
      await tx
        .update(operationRounds)
        .set({ is_active: false })
        .where(eq(operationRounds.user_id, userId));
      await tx
        .update(operationRounds)
        .set({ is_active: true })
        .where(and(eq(operationRounds.id, round.id), eq(operationRounds.user_id, userId)));
    });
    return { ...round, is_active: true };
  }

  async getReport(userId: string, roundId: string) {
    const round = await this.findRound(userId, roundId);
    const [procurements, production, saleRows, expenseRows, openingSacks, costRows] = await Promise.all([
      this.db.query.procurementOrders.findMany({
        where: and(eq(procurementOrders.user_id, userId), eq(procurementOrders.round_id, roundId)),
        orderBy: asc(procurementOrders.delivery_date),
      }),
      this.db.query.productionBatches.findMany({
        where: and(eq(productionBatches.user_id, userId), eq(productionBatches.round_id, roundId)),
        orderBy: asc(productionBatches.date),
      }),
      this.db.query.sales.findMany({
        where: and(eq(sales.user_id, userId), eq(sales.round_id, roundId)),
        orderBy: asc(sales.date),
      }),
      this.db.query.expenses.findMany({
        where: and(eq(expenses.user_id, userId), eq(expenses.round_id, roundId)),
        orderBy: asc(expenses.date),
      }),
      this.db.query.roundSackOpeningBalances.findMany({
        where: and(eq(roundSackOpeningBalances.user_id, userId), eq(roundSackOpeningBalances.round_id, roundId)),
        orderBy: asc(roundSackOpeningBalances.sack_size),
      }),
      this.db.query.operationalCosts.findMany({
        where: and(eq(operationalCosts.user_id, userId), eq(operationalCosts.round_id, roundId)),
        orderBy: asc(operationalCosts.date),
      }),
    ]);

    return {
      filename: `${round.name.replace(/[^a-z0-9_-]+/gi, '_')}_report.csv`,
      csv: [
        `Round,${csvCell(round.name)}`,
        csvSection('Procurement', procurements),
        csvSection('Production', production),
        csvSection('Sales', saleRows),
        csvSection('Expenses', expenseRows),
        csvSection('Opening Sack Balances', openingSacks),
        csvSection('Operational Costs', costRows),
      ].join('\n'),
    };
  }

  async remove(userId: string, roundId: string, confirmName: string) {
    const round = await this.findRound(userId, roundId);
    if (confirmName !== round.name) {
      throw new BadRequestException('Confirmation must exactly match the round name.');
    }

    let nextActiveRound: typeof round | undefined;
    if (round.is_active) {
      nextActiveRound = await this.db.query.operationRounds.findFirst({
        where: and(
          eq(operationRounds.user_id, userId),
          ne(operationRounds.id, roundId),
        ),
        orderBy: asc(operationRounds.created_at),
      });
      if (!nextActiveRound) {
        throw new BadRequestException('Create another round before deleting the only round.');
      }
    }

    await this.db.transaction(async (tx) => {
      if (round.is_active && nextActiveRound) {
        await tx
          .update(operationRounds)
          .set({ is_active: false })
          .where(eq(operationRounds.user_id, userId));
        await tx
          .update(operationRounds)
          .set({ is_active: true })
          .where(eq(operationRounds.id, nextActiveRound.id));
      }
      await tx
        .delete(sales)
        .where(and(eq(sales.round_id, roundId), eq(sales.user_id, userId)));
      await tx
        .delete(productionBatches)
        .where(and(eq(productionBatches.round_id, roundId), eq(productionBatches.user_id, userId)));
      await tx
        .delete(procurementOrders)
        .where(and(eq(procurementOrders.round_id, roundId), eq(procurementOrders.user_id, userId)));
      await tx
        .delete(expenses)
        .where(and(eq(expenses.round_id, roundId), eq(expenses.user_id, userId)));
      await tx
        .delete(operationalCosts)
        .where(and(eq(operationalCosts.round_id, roundId), eq(operationalCosts.user_id, userId)));
      await tx
        .delete(roundSackOpeningBalances)
        .where(and(eq(roundSackOpeningBalances.round_id, roundId), eq(roundSackOpeningBalances.user_id, userId)));
      await tx
        .delete(operationRounds)
        .where(and(eq(operationRounds.id, roundId), eq(operationRounds.user_id, userId)));
    });
    return { message: 'Round and its records were deleted.' };
  }

  private async findRound(userId: string, roundId: string) {
    const round = await this.db.query.operationRounds.findFirst({
      where: and(eq(operationRounds.id, roundId), eq(operationRounds.user_id, userId)),
    });
    if (!round) throw new NotFoundException('Round not found.');
    return round;
  }
}
