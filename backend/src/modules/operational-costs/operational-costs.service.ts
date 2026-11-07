import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { getActiveRoundId } from '../../common/rounds';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import { expenses, operationalCosts } from '../../db/schema';
import { CreateOperationalCostDto } from './dto/create-operational-cost.dto';
import { UpdateOperationalCostDto } from './dto/update-operational-cost.dto';
import { validateElectricityLedger } from './electricity-ledger';

@Injectable()
export class OperationalCostsService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  async findAll(userId: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    return this.db.query.operationalCosts.findMany({
      where: and(eq(operationalCosts.user_id, userId), eq(operationalCosts.round_id, roundId)),
      orderBy: [desc(operationalCosts.created_at)],
    });
  }

  async getSummary(userId: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const [purchaseTotals] = await this.db
      .select({
        units: sql<string>`coalesce(sum(${expenses.unit_value}), 0)::text`,
      })
      .from(expenses)
      .where(and(
        eq(expenses.user_id, userId),
        eq(expenses.round_id, roundId),
        sql`lower(${expenses.category}) = 'electricity'`,
      ));
    const [operationTotals] = await this.db
      .select({
        units: sql<string>`coalesce(sum(${operationalCosts.units_used}), 0)::text`,
        amount: sql<string>`coalesce(sum(${operationalCosts.total_amount}), 0)::text`,
      })
      .from(operationalCosts)
      .where(and(eq(operationalCosts.user_id, userId), eq(operationalCosts.round_id, roundId)));

    const purchasedUnits = Number(purchaseTotals.units);
    const usedUnits = Number(operationTotals.units);
    return {
      purchasedUnits,
      usedUnits,
      remainingUnits: Math.max(0, purchasedUnits - usedUnits),
      totalOperationalCost: Number(operationTotals.amount),
    };
  }

  async create(userId: string, dto: CreateOperationalCostDto) {
    const roundId = await getActiveRoundId(this.db, userId);
    const unitsUsed = this.getUnitsUsed(dto.starting_units, dto.remaining_units);
    const createdAt = new Date();
    const proposed = {
      id: 'new-operation',
      starting_units: dto.starting_units,
      remaining_units: dto.remaining_units,
      units_used: unitsUsed,
      created_at: createdAt,
    };
    await validateElectricityLedger(this.db, userId, roundId, {
      kind: 'operation',
      id: proposed.id,
      replacement: proposed,
    });

    const [record] = await this.db
      .insert(operationalCosts)
      .values({
        user_id: userId,
        round_id: roundId,
        date: dto.date,
        operation: dto.operation,
        starting_units: String(dto.starting_units),
        remaining_units: String(dto.remaining_units),
        units_used: String(unitsUsed),
        total_amount: String(dto.total_amount),
        notes: dto.notes,
        created_at: createdAt,
      })
      .returning();
    return record;
  }

  async update(userId: string, id: string, dto: UpdateOperationalCostDto) {
    const roundId = await getActiveRoundId(this.db, userId);
    const existing = await this.db.query.operationalCosts.findFirst({
      where: and(eq(operationalCosts.id, id), eq(operationalCosts.user_id, userId), eq(operationalCosts.round_id, roundId)),
    });
    if (!existing) throw new NotFoundException('Operational cost record not found.');

    const startingUnits = dto.starting_units ?? Number(existing.starting_units);
    const remainingUnits = dto.remaining_units ?? Number(existing.remaining_units);
    const unitsUsed = this.getUnitsUsed(startingUnits, remainingUnits);
    await validateElectricityLedger(this.db, userId, roundId, {
      kind: 'operation',
      id,
      replacement: {
        id,
        starting_units: startingUnits,
        remaining_units: remainingUnits,
        units_used: unitsUsed,
        created_at: existing.created_at,
      },
    });

    const [updated] = await this.db
      .update(operationalCosts)
      .set({
        ...(dto.date !== undefined && { date: dto.date }),
        ...(dto.operation !== undefined && { operation: dto.operation }),
        ...(dto.starting_units !== undefined && { starting_units: String(startingUnits) }),
        ...(dto.remaining_units !== undefined && { remaining_units: String(remainingUnits) }),
        ...((dto.starting_units !== undefined || dto.remaining_units !== undefined) && {
          units_used: String(unitsUsed),
        }),
        ...(dto.total_amount !== undefined && { total_amount: String(dto.total_amount) }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        updated_at: new Date(),
      })
      .where(and(eq(operationalCosts.id, id), eq(operationalCosts.user_id, userId), eq(operationalCosts.round_id, roundId)))
      .returning();
    if (!updated) throw new NotFoundException('Operational cost record not found.');
    return updated;
  }

  async remove(userId: string, id: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const existing = await this.db.query.operationalCosts.findFirst({
      where: and(eq(operationalCosts.id, id), eq(operationalCosts.user_id, userId), eq(operationalCosts.round_id, roundId)),
    });
    if (!existing) throw new NotFoundException('Operational cost record not found.');

    await validateElectricityLedger(this.db, userId, roundId, {
      kind: 'operation',
      id,
      replacement: null,
    });
    await this.db
      .delete(operationalCosts)
      .where(and(eq(operationalCosts.id, id), eq(operationalCosts.user_id, userId), eq(operationalCosts.round_id, roundId)));
    return { message: 'Operational cost record deleted.' };
  }

  private getUnitsUsed(startingUnits: number, remainingUnits: number) {
    const unitsUsed = startingUnits - remainingUnits;
    if (unitsUsed <= 0) {
      throw new BadRequestException('Remaining electricity units must be lower than the starting balance.');
    }
    return unitsUsed;
  }
}
