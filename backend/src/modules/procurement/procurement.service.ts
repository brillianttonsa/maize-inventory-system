import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, count, eq, sql } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import { procurementOrders } from '../../db/schema';
import { getActiveRoundId } from '../../common/rounds';
import {
  getPagination,
  type PaginatedResult,
  type PaginationQueryDto,
} from '../../common/dto/pagination-query.dto';
import { CreateProcurementDto } from './dto/create-procurement.dto';
import { UpdateProcurementDto } from './dto/update-procurement.dto';

@Injectable()
export class ProcurementService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  async findAll(
    userId: string,
    paginationQuery: PaginationQueryDto = {},
  ) {
    const roundId = await getActiveRoundId(this.db, userId);
    const where = and(eq(procurementOrders.user_id, userId), eq(procurementOrders.round_id, roundId));
    const pagination = getPagination(paginationQuery);
    if (!pagination) {
      // old app ordered by numeric id; ids are uuids now so we order by created_at instead
      return this.db.query.procurementOrders.findMany({
        where,
        orderBy: asc(procurementOrders.created_at),
      });
    }

    const [items, [{ total }]] = await Promise.all([
      this.db.query.procurementOrders.findMany({
        where,
        orderBy: asc(procurementOrders.created_at),
        limit: pagination.limit,
        offset: pagination.offset,
      }),
      this.db
        .select({ total: count() })
        .from(procurementOrders)
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

  async getSummary(userId: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const [row] = await this.db.select({
      quantityKg: sql<string>`coalesce(sum(${procurementOrders.quantity_of_maize} * 1000), 0)::text`,
      totalCost: sql<string>`coalesce(sum(${procurementOrders.total_cost}), 0)::text`,
      maizePurchase: sql<string>`coalesce(sum(${procurementOrders.maize_purchase_cost}), 0)::text`,
    }).from(procurementOrders).where(and(eq(procurementOrders.user_id, userId), eq(procurementOrders.round_id, roundId)));
    const quantityKg = Number(row.quantityKg);
    const totalCost = Number(row.totalCost);
    return {
      totalQuantityKg: quantityKg,
      totalCost,
      actualMaizePurchase: Number(row.maizePurchase),
      averageTotalCostPerKg: quantityKg ? totalCost / quantityKg : 0,
    };
  }

  async create(userId: string, dto: CreateProcurementDto) {
    const roundId = await getActiveRoundId(this.db, userId);
    const totalCost = this.calculateTotal(dto);
    const averageCostPerKg = this.calculateAverageCostPerKg(totalCost, dto.quantity_tons);
    const [newOrder] = await this.db
      .insert(procurementOrders)
      .values({
        user_id: userId,
        round_id: roundId,
        supplier: dto.supplier,
        supplier_location: dto.supplier_location,
        supplier_phone: dto.supplier_phone,
        quantity_of_maize: String(dto.quantity_tons),
        maize_purchase_cost: String(dto.maize_purchase_cost),
        transport_cost: String(dto.transport_cost),
        collection_labour: String(dto.collection_labour),
        loading_labour: String(dto.loading_labour),
        unloading_labour: String(dto.unloading_labour),
        transport_tax: String(dto.transport_tax),
        rural_tax: String(dto.rural_tax),
        total_cost: String(totalCost),
        average_cost_per_kg: String(averageCostPerKg),
        delivery_date: dto.delivery_date,
      })
      .returning();
    return newOrder;
  }

  async update(userId: string, id: string, dto: UpdateProcurementDto) {
    const roundId = await getActiveRoundId(this.db, userId);
    const current = await this.db.query.procurementOrders.findFirst({ where: and(eq(procurementOrders.id, id), eq(procurementOrders.user_id, userId), eq(procurementOrders.round_id, roundId)) });
    if (!current) throw new NotFoundException('Order not found');
    const merged = {
      quantity_tons: dto.quantity_tons ?? Number(current.quantity_of_maize),
      maize_purchase_cost: dto.maize_purchase_cost ?? Number(current.maize_purchase_cost),
      transport_cost: dto.transport_cost ?? Number(current.transport_cost),
      collection_labour: dto.collection_labour ?? Number(current.collection_labour),
      loading_labour: dto.loading_labour ?? Number(current.loading_labour),
      unloading_labour: dto.unloading_labour ?? Number(current.unloading_labour),
      transport_tax: dto.transport_tax ?? Number(current.transport_tax),
      rural_tax: dto.rural_tax ?? Number(current.rural_tax),
    };
    const totalCost = this.calculateTotal(merged);
    const [updatedOrder] = await this.db
      .update(procurementOrders)
      .set({
        ...(dto.supplier !== undefined && { supplier: dto.supplier }),
        ...(dto.supplier_location !== undefined && { supplier_location: dto.supplier_location }),
        ...(dto.supplier_phone !== undefined && { supplier_phone: dto.supplier_phone }),
        ...(dto.quantity_tons !== undefined && { quantity_of_maize: String(dto.quantity_tons) }),
        ...(dto.maize_purchase_cost !== undefined && {
          maize_purchase_cost: String(dto.maize_purchase_cost),
        }),
        ...(dto.transport_cost !== undefined && {
          transport_cost: String(dto.transport_cost),
        }),
        ...(dto.collection_labour !== undefined && { collection_labour: String(dto.collection_labour) }),
        ...(dto.loading_labour !== undefined && { loading_labour: String(dto.loading_labour) }),
        ...(dto.unloading_labour !== undefined && { unloading_labour: String(dto.unloading_labour) }),
        ...(dto.transport_tax !== undefined && { transport_tax: String(dto.transport_tax) }),
        ...(dto.rural_tax !== undefined && { rural_tax: String(dto.rural_tax) }),
        total_cost: String(totalCost),
        average_cost_per_kg: String(this.calculateAverageCostPerKg(totalCost, merged.quantity_tons)),
        ...(dto.delivery_date !== undefined && {
          delivery_date: dto.delivery_date,
        }),
        updated_at: new Date(),
      })
      .where(
        and(
          eq(procurementOrders.id, id),
          eq(procurementOrders.user_id, userId),
          eq(procurementOrders.round_id, roundId),
        ),
      )
      .returning();

    if (!updatedOrder) {
      throw new NotFoundException('Order not found or nothing to update');
    }
    return updatedOrder;
  }

  private calculateTotal(dto: Pick<CreateProcurementDto, 'maize_purchase_cost' | 'transport_cost' | 'collection_labour' | 'loading_labour' | 'unloading_labour' | 'transport_tax' | 'rural_tax'>) {
    return dto.maize_purchase_cost + dto.transport_cost + dto.collection_labour + dto.loading_labour + dto.unloading_labour + dto.transport_tax + dto.rural_tax;
  }

  private calculateAverageCostPerKg(totalCost: number, quantityTons: number) {
    const quantityKg = quantityTons * 1000;
    return quantityKg > 0 ? Number((totalCost / quantityKg).toFixed(2)) : 0;
  }

  async remove(userId: string, id: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const [deleted] = await this.db
      .delete(procurementOrders)
      .where(
        and(
          eq(procurementOrders.id, id),
          eq(procurementOrders.user_id, userId),
          eq(procurementOrders.round_id, roundId),
        ),
      )
      .returning({ id: procurementOrders.id });

    if (!deleted) {
      throw new NotFoundException('Order not found');
    }
    return { message: 'Order deleted successfully' };
  }
}
