import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, count, eq, gte, lte, sql } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import { expenses, procurementOrders, productionBatches } from '../../db/schema';
import { getActiveRoundId } from '../../common/rounds';
import {
  getPagination,
  type PaginatedResult,
  type PaginationQueryDto,
} from '../../common/dto/pagination-query.dto';
import { CreateProductionDto } from './dto/create-production.dto';
import { UpdateProductionDto } from './dto/update-production.dto';

const KG_PER_TON = 1000;

@Injectable()
export class ProductionService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  async getChartData(userId: string, from: string, to: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const rows = await this.db
      .select({
        date: productionBatches.date,
        flour: sql<string>`coalesce(sum(${productionBatches.flour_output}), 0)::text`,
        bran: sql<string>`coalesce(sum(${productionBatches.bran_quantity}), 0)::text`,
      })
      .from(productionBatches)
      .where(
        and(
          eq(productionBatches.user_id, userId),
          eq(productionBatches.round_id, roundId),
          gte(productionBatches.date, from),
          lte(productionBatches.date, to),
        ),
      )
      .groupBy(productionBatches.date)
      .orderBy(asc(productionBatches.date));

    return rows.map((row) => ({
      date: row.date,
      flour: Number(row.flour),
      bran: Number(row.bran),
    }));
  }

  async findAll(
    userId: string,
    paginationQuery: PaginationQueryDto = {},
  ) {
    const roundId = await getActiveRoundId(this.db, userId);
    const where = and(eq(productionBatches.user_id, userId), eq(productionBatches.round_id, roundId));
    const pagination = getPagination(paginationQuery);
    if (!pagination) {
      // old app ordered by numeric id; ids are uuids now so we order by created_at instead
      return this.db.query.productionBatches.findMany({
        where,
        orderBy: asc(productionBatches.created_at),
      });
    }

    const [items, [{ total }]] = await Promise.all([
      this.db.query.productionBatches.findMany({
        where,
        orderBy: asc(productionBatches.created_at),
        limit: pagination.limit,
        offset: pagination.offset,
      }),
      this.db
        .select({ total: count() })
        .from(productionBatches)
        .where(where),
    ]);

    const result: PaginatedResult<(typeof items)[number]> = {
      items,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
    return result;
  }

  async create(userId: string, dto: CreateProductionDto) {
    const roundId = await getActiveRoundId(this.db, userId);
    const flour5 = dto.flour_sacks_5kg ?? 0;
    const flour10 = dto.flour_sacks_10kg ?? 0;
    const flour25 = dto.flour_sacks_25kg ?? 0;
    const flourOutput = flour5 * 5 + flour10 * 10 + flour25 * 25;
    if (dto.maize_tons <= 0) {
      throw new BadRequestException('Maize input must be greater than zero.');
    }
    if (flourOutput <= 0) {
      throw new BadRequestException('Record at least one flour sack in 5 kg, 10 kg, or 25 kg packaging');
    }
    await this.assertStockAvailable(userId, roundId, dto.maize_tons * KG_PER_TON, { 5: flour5, 10: flour10, 25: flour25 });
    const [newBatch] = await this.db
      .insert(productionBatches)
      .values({
        user_id: userId,
        round_id: roundId,
        maize_quantity: String(Math.round(dto.maize_tons * KG_PER_TON)),
        flour_output: flourOutput,
        flour_sacks_5kg: flour5,
        flour_sacks_10kg: flour10,
        flour_sacks_25kg: flour25,
        bran_quantity: String(dto.bran_quantity ?? 0),
        date: dto.date,
      })
      .returning();
    return newBatch;
  }

  async update(userId: string, id: string, dto: UpdateProductionDto) {
    const roundId = await getActiveRoundId(this.db, userId);
    const existing = await this.db.query.productionBatches.findFirst({ where: and(eq(productionBatches.id, id), eq(productionBatches.user_id, userId), eq(productionBatches.round_id, roundId)) });
    if (!existing) throw new NotFoundException('Batch not found');
    const flour5 = dto.flour_sacks_5kg ?? existing.flour_sacks_5kg;
    const flour10 = dto.flour_sacks_10kg ?? existing.flour_sacks_10kg;
    const flour25 = dto.flour_sacks_25kg ?? existing.flour_sacks_25kg;
    if (flour5 * 5 + flour10 * 10 + flour25 * 25 <= 0) {
      throw new BadRequestException('Record at least one flour sack in 5 kg, 10 kg, or 25 kg packaging.');
    }
    const maizeTons = dto.maize_tons ?? Number(existing.maize_quantity) / KG_PER_TON;
    if (maizeTons <= 0) {
      throw new BadRequestException('Maize input must be greater than zero.');
    }
    await this.assertStockAvailable(userId, roundId, maizeTons * KG_PER_TON, { 5: flour5, 10: flour10, 25: flour25 }, id);
    const flourOutput = flour5 * 5 + flour10 * 10 + flour25 * 25;
    const [updatedBatch] = await this.db
      .update(productionBatches)
      .set({
        ...(dto.maize_tons !== undefined && {
          maize_quantity: String(Math.round(dto.maize_tons * KG_PER_TON)),
        }),
        ...((dto.flour_sacks_5kg !== undefined || dto.flour_sacks_10kg !== undefined || dto.flour_sacks_25kg !== undefined) && {
          flour_sacks_5kg: flour5,
          flour_sacks_10kg: flour10,
          flour_sacks_25kg: flour25,
          flour_output: flourOutput,
        }),
        ...(dto.bran_quantity !== undefined && { bran_quantity: String(dto.bran_quantity) }),
        ...(dto.date !== undefined && { date: dto.date }),
      })
      .where(
        and(
          eq(productionBatches.id, id),
          eq(productionBatches.user_id, userId),
          eq(productionBatches.round_id, roundId),
        ),
      )
      .returning();

    if (!updatedBatch) {
      throw new NotFoundException('Batch not found or nothing to update');
    }
    return updatedBatch;
  }

  async getPackagingBreakdown(userId: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const [row] = await this.db.select({
      sacks5: sql<string>`coalesce(sum(${productionBatches.flour_sacks_5kg}), 0)::text`,
      sacks10: sql<string>`coalesce(sum(${productionBatches.flour_sacks_10kg}), 0)::text`,
      sacks25: sql<string>`coalesce(sum(${productionBatches.flour_sacks_25kg}), 0)::text`,
    }).from(productionBatches).where(and(eq(productionBatches.user_id, userId), eq(productionBatches.round_id, roundId)));
    return ([5, 10, 25] as const).map(size => {
      const sacks = Number(row[`sacks${size}`]);
      return { packageSize: size, sacks, totalWeight: sacks * size };
    });
  }

  private async assertStockAvailable(userId: string, roundId: string, requestedMaizeKg: number, requestedSacks: Record<5 | 10 | 25, number>, excludeId?: string) {
    const batches = await this.db.query.productionBatches.findMany({ where: and(eq(productionBatches.user_id, userId), eq(productionBatches.round_id, roundId)) });
    const relevant = excludeId ? batches.filter(batch => batch.id !== excludeId) : batches;
    const procurement = await this.db.select({ quantityTons: sql<string>`coalesce(sum(${procurementOrders.quantity_of_maize}), 0)::text` }).from(procurementOrders).where(and(eq(procurementOrders.user_id, userId), eq(procurementOrders.round_id, roundId)));
    const procuredKg = Number(procurement[0].quantityTons) * KG_PER_TON;
    if (procuredKg <= 0) throw new BadRequestException('Record a maize procurement before recording production.');
    const usedKg = relevant.reduce((sum, batch) => sum + Number(batch.maize_quantity), 0);
    if (requestedMaizeKg > procuredKg - usedKg) throw new BadRequestException(`Only ${Math.max(0, procuredKg - usedKg).toLocaleString()} kg of maize is available for production.`);
    const sackPurchases = await this.db.select({ size: expenses.sack_size, quantity: sql<string>`coalesce(sum(${expenses.unit_value}), 0)::text` }).from(expenses).where(and(eq(expenses.user_id, userId), eq(expenses.round_id, roundId), sql`lower(${expenses.category}) = 'sacks'`)).groupBy(expenses.sack_size);
    for (const size of [5, 10, 25] as const) {
      const purchased = Number(sackPurchases.find(item => item.size === size)?.quantity ?? 0);
      const used = relevant.reduce((sum, batch) => sum + Number(batch[`flour_sacks_${size}kg`]), 0);
      if (requestedSacks[size] > purchased - used) throw new BadRequestException(`Only ${Math.max(0, purchased - used)} unused ${size} kg sacks are available. Record the sack purchase in Expenses first.`);
    }
  }

  async remove(userId: string, id: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const [deleted] = await this.db
      .delete(productionBatches)
      .where(
        and(eq(productionBatches.id, id), eq(productionBatches.user_id, userId), eq(productionBatches.round_id, roundId)),
      )
      .returning({ id: productionBatches.id });

    if (!deleted) {
      throw new NotFoundException('Batch not found');
    }
    return { message: 'Batch deleted successfully.' };
  }
}
