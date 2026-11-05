import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, eq, ne } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import {
  expenses,
  operationRounds,
  procurementOrders,
  productionBatches,
  sales,
} from '../../db/schema';

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
      const [round] = await this.db
        .insert(operationRounds)
        .values({ user_id: userId, name: cleanName })
        .returning();
      return round;
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
    const [procurements, production, saleRows, expenseRows] = await Promise.all([
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
    ]);

    return {
      filename: `${round.name.replace(/[^a-z0-9_-]+/gi, '_')}_report.csv`,
      csv: [
        `Round,${csvCell(round.name)}`,
        csvSection('Procurement', procurements),
        csvSection('Production', production),
        csvSection('Sales', saleRows),
        csvSection('Expenses', expenseRows),
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
