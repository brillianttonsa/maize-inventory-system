import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, count, eq, sql } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import { productionBatches, sales } from '../../db/schema';
import { getActiveRoundId } from '../../common/rounds';
import {
  getPagination,
  type PaginatedResult,
  type PaginationQueryDto,
} from '../../common/dto/pagination-query.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  async findAll(
    userId: string,
    paginationQuery: PaginationQueryDto = {},
  ) {
    const roundId = await getActiveRoundId(this.db, userId);
    const conditions = [eq(sales.user_id, userId), eq(sales.round_id, roundId)];
    if (paginationQuery.product_type && paginationQuery.product_type !== 'All') conditions.push(eq(sales.product_type, paginationQuery.product_type));
    if (paginationQuery.sack_size) conditions.push(eq(sales.sack_size, paginationQuery.sack_size));
    const where = and(...conditions);
    const pagination = getPagination(paginationQuery);
    if (!pagination) {
      // old app ordered by numeric id; ids are uuids now so we order by created_at instead
      return this.db.query.sales.findMany({
        where,
        orderBy: asc(sales.created_at),
      });
    }

    const [items, [{ total }]] = await Promise.all([
      this.db.query.sales.findMany({
        where,
        orderBy: asc(sales.created_at),
        limit: pagination.limit,
        offset: pagination.offset,
      }),
      this.db.select({ total: count() }).from(sales).where(where),
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

  async getSummary(userId: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const [row] = await this.db.select({
      flour5: sql<string>`coalesce(sum(case when lower(${sales.product_type}) = 'flour' and ${sales.sack_size} = 5 then ${sales.total_amount} else 0 end), 0)::text`,
      flour10: sql<string>`coalesce(sum(case when lower(${sales.product_type}) = 'flour' and ${sales.sack_size} = 10 then ${sales.total_amount} else 0 end), 0)::text`,
      flour25: sql<string>`coalesce(sum(case when lower(${sales.product_type}) = 'flour' and ${sales.sack_size} = 25 then ${sales.total_amount} else 0 end), 0)::text`,
      bran: sql<string>`coalesce(sum(case when lower(${sales.product_type}) = 'bran' then ${sales.total_amount} else 0 end), 0)::text`,
    }).from(sales).where(and(eq(sales.user_id, userId), eq(sales.round_id, roundId)));
    return { flour5kg: Number(row.flour5), flour10kg: Number(row.flour10), flour25kg: Number(row.flour25), bran: Number(row.bran) };
  }

  async create(userId: string, dto: CreateSaleDto) {
    const roundId = await getActiveRoundId(this.db, userId);
    const isBran = dto.product_type.toLowerCase() === 'bran';
    if (!isBran && dto.sack_size === undefined) {
      throw new BadRequestException('Sack count and sack size are required for a flour sale');
    }
    await this.assertSaleStock(userId, roundId, dto);
    const totalAmount = dto.sack_count * dto.price_per_sack;
    const [newSale] = await this.db
      .insert(sales)
      .values({
        user_id: userId,
        round_id: roundId,
        customer_name: dto.customer_name,
        customer_contact: dto.customer_contact,
        product_type: dto.product_type,
        sack_count: dto.sack_count,
        sack_size: isBran ? undefined : dto.sack_size,
        price_per_sack: String(dto.price_per_sack),
        delivery_cost: String(dto.delivery_cost),
        delivery_address: dto.delivery_address,
        total_amount: String(totalAmount),
        date: dto.date,
      })
      .returning();
    return newSale;
  }

  async update(userId: string, id: string, dto: UpdateSaleDto) {
    const roundId = await getActiveRoundId(this.db, userId);
    const existing = await this.db.query.sales.findFirst({ where: and(eq(sales.id, id), eq(sales.user_id, userId), eq(sales.round_id, roundId)) });
    if (!existing) throw new NotFoundException('Sale not found or unauthorized');
    const merged: CreateSaleDto = {
      customer_name: dto.customer_name ?? existing.customer_name,
      customer_contact: dto.customer_contact ?? existing.customer_contact,
      product_type: dto.product_type ?? existing.product_type,
      sack_count: dto.sack_count ?? existing.sack_count,
      sack_size: dto.sack_size ?? existing.sack_size ?? undefined,
      price_per_sack: dto.price_per_sack ?? Number(existing.price_per_sack),
      delivery_cost: dto.delivery_cost ?? Number(existing.delivery_cost),
      delivery_address: dto.delivery_address ?? existing.delivery_address,
      date: dto.date ?? existing.date,
    };
    const isBran = merged.product_type.toLowerCase() === 'bran';
    if (!isBran && merged.sack_size === undefined) {
      throw new BadRequestException('Sack size is required for a flour sale.');
    }
    await this.assertSaleStock(userId, roundId, merged, id);
    const [updatedSale] = await this.db
      .update(sales)
      .set({
        ...(dto.customer_name !== undefined && {
          customer_name: dto.customer_name,
        }),
        ...(dto.customer_contact !== undefined && {
          customer_contact: dto.customer_contact,
        }),
        ...(dto.product_type !== undefined && {
          product_type: dto.product_type,
        }),
        sack_count: merged.sack_count,
        sack_size: isBran ? null : merged.sack_size ?? null,
        ...(dto.price_per_sack !== undefined && {
          price_per_sack: String(dto.price_per_sack),
        }),
        ...(dto.delivery_cost !== undefined && {
          delivery_cost: String(dto.delivery_cost),
        }),
        ...(dto.delivery_address !== undefined && {
          delivery_address: dto.delivery_address,
        }),
        total_amount: String(merged.sack_count * merged.price_per_sack),
        ...(dto.date !== undefined && { date: dto.date }),
        updated_at: new Date(),
      })
      .where(and(eq(sales.id, id), eq(sales.user_id, userId), eq(sales.round_id, roundId)))
      .returning();

    if (!updatedSale) {
      throw new NotFoundException('Sale not found or unauthorized');
    }
    return updatedSale;
  }

  private async assertSaleStock(
    userId: string,
    roundId: string,
    dto: Pick<CreateSaleDto, 'product_type' | 'sack_count' | 'sack_size'>,
    excludeId?: string,
  ) {
    const existingSales = await this.db.query.sales.findMany({ where: and(eq(sales.user_id, userId), eq(sales.round_id, roundId)) });
    const otherSales = excludeId ? existingSales.filter(sale => sale.id !== excludeId) : existingSales;
    if (dto.product_type.toLowerCase() === 'bran') {
      const batches = await this.db.query.productionBatches.findMany({ where: and(eq(productionBatches.user_id, userId), eq(productionBatches.round_id, roundId)) });
      const produced = batches.reduce((sum, batch) => sum + Number(batch.bran_quantity ?? 0), 0);
      const sold = otherSales
        .filter((sale) => sale.product_type.toLowerCase() === 'bran')
        .reduce((sum, sale) => sum + sale.sack_count, 0);
      if (dto.sack_count > produced - sold) {
        throw new BadRequestException(
          `Only ${Math.max(0, produced - sold)} bran sacks are in stock. Record production before selling bran.`,
        );
      }
      return;
    }
    const size = dto.sack_size;
    if (!size) throw new BadRequestException('Sack size is required for a flour sale.');
    const batches = await this.db.query.productionBatches.findMany({ where: and(eq(productionBatches.user_id, userId), eq(productionBatches.round_id, roundId)) });
    const field = `flour_sacks_${size}kg` as 'flour_sacks_5kg' | 'flour_sacks_10kg' | 'flour_sacks_25kg';
    const produced = batches.reduce((sum, batch) => sum + Number(batch[field]), 0);
    const sold = otherSales.filter(sale => sale.product_type.toLowerCase() === 'flour' && sale.sack_size === size).reduce((sum, sale) => sum + Number(sale.sack_count ?? 0), 0);
    if (dto.sack_count > produced - sold) {
      throw new BadRequestException(
        `Only ${Math.max(0, produced - sold)} ${size} kg flour sacks are in stock. Record production before selling them.`,
      );
    }
  }

  async remove(userId: string, id: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const [deleted] = await this.db
      .delete(sales)
      .where(and(eq(sales.id, id), eq(sales.user_id, userId), eq(sales.round_id, roundId)))
      .returning({ id: sales.id });

    if (!deleted) {
      throw new NotFoundException('Sale not found or unauthorized');
    }
    return { message: 'Sale deleted successfully' };
  }
}
