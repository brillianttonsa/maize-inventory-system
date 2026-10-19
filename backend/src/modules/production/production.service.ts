import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, count, eq, gte, lte, sql } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import { productionBatches } from '../../db/schema';
import {
  getPagination,
  type PaginatedResult,
  type PaginationQueryDto,
} from '../../common/dto/pagination-query.dto';
import { CreateProductionDto } from './dto/create-production.dto';
import { UpdateProductionDto } from './dto/update-production.dto';

const KG_PER_TON = 1000;
const DEBE_PER_GUNIA = 7;

@Injectable()
export class ProductionService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  async getChartData(userId: string, from: string, to: string) {
    const rows = await this.db
      .select({
        date: productionBatches.date,
        flour: sql<string>`coalesce(sum(${productionBatches.flour_output}), 0)::text`,
        bran: sql<string>`coalesce(sum(${productionBatches.bran_debe_quantity}), 0)::text`,
      })
      .from(productionBatches)
      .where(
        and(
          eq(productionBatches.user_id, userId),
          gte(productionBatches.date, from),
          lte(productionBatches.date, to),
        ),
      )
      .groupBy(productionBatches.date)
      .orderBy(asc(productionBatches.date));

    return rows.map((row) => ({
      date: row.date,
      flour: Number(row.flour),
      bran: Number(row.bran) / DEBE_PER_GUNIA,
    }));
  }

  async findAll(
    userId: string,
    paginationQuery: PaginationQueryDto = {},
  ) {
    const where = eq(productionBatches.user_id, userId);
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
    const flour5 = dto.flour_sacks_5kg ?? 0;
    const flour10 = dto.flour_sacks_10kg ?? 0;
    const flour25 = dto.flour_sacks_25kg ?? 0;
    const flourOutput = flour5 * 5 + flour10 * 10 + flour25 * 25;
    if (flourOutput <= 0) {
      throw new BadRequestException('Record at least one flour sack in 5 kg, 10 kg, or 25 kg packaging');
    }
    const branGunia = dto.bran_unit_count ?? 0;
    const [newBatch] = await this.db
      .insert(productionBatches)
      .values({
        user_id: userId,
        maize_quantity: Math.round(dto.maize_tons * KG_PER_TON),
        flour_output: flourOutput,
        flour_sacks_5kg: flour5,
        flour_sacks_10kg: flour10,
        flour_sacks_25kg: flour25,
        bran_debe_quantity: String(branGunia * DEBE_PER_GUNIA),
        bran_unit: 'gunia',
        date: dto.date,
      })
      .returning();
    return newBatch;
  }

  async update(userId: string, id: string, dto: UpdateProductionDto) {
    const [updatedBatch] = await this.db
      .update(productionBatches)
      .set({
        ...(dto.maize_tons !== undefined && {
          maize_quantity: Math.round(dto.maize_tons * KG_PER_TON),
        }),
        ...((dto.flour_sacks_5kg !== undefined || dto.flour_sacks_10kg !== undefined || dto.flour_sacks_25kg !== undefined) && {
          flour_sacks_5kg: dto.flour_sacks_5kg ?? 0,
          flour_sacks_10kg: dto.flour_sacks_10kg ?? 0,
          flour_sacks_25kg: dto.flour_sacks_25kg ?? 0,
          flour_output: (dto.flour_sacks_5kg ?? 0) * 5 + (dto.flour_sacks_10kg ?? 0) * 10 + (dto.flour_sacks_25kg ?? 0) * 25,
        }),
        ...(dto.bran_unit_count !== undefined && {
          bran_debe_quantity: String(dto.bran_unit_count * DEBE_PER_GUNIA),
          bran_unit: 'gunia',
        }),
        ...(dto.date !== undefined && { date: dto.date }),
      })
      .where(
        and(eq(productionBatches.id, id), eq(productionBatches.user_id, userId)),
      )
      .returning();

    if (!updatedBatch) {
      throw new NotFoundException('Batch not found or nothing to update');
    }
    return updatedBatch;
  }

  async remove(userId: string, id: string) {
    const [deleted] = await this.db
      .delete(productionBatches)
      .where(
        and(eq(productionBatches.id, id), eq(productionBatches.user_id, userId)),
      )
      .returning({ id: productionBatches.id });

    if (!deleted) {
      throw new NotFoundException('Batch not found');
    }
    return { message: 'Batch deleted successfully.' };
  }
}
