import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, count, eq } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import { procurementOrders } from '../../db/schema';
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
    const where = eq(procurementOrders.user_id, userId);
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

  async create(userId: string, dto: CreateProcurementDto) {
    const [newOrder] = await this.db
      .insert(procurementOrders)
      .values({
        user_id: userId,
        supplier: dto.supplier,
        quantity: String(dto.quantity_tons * 1000),
        price_per_kg: String(dto.price_per_kg),
        transport_cost: String(dto.transport_cost),
        total_cost: String(dto.total_cost),
        delivery_date: dto.delivery_date,
      })
      .returning();
    return newOrder;
  }

  async update(userId: string, id: string, dto: UpdateProcurementDto) {
    const [updatedOrder] = await this.db
      .update(procurementOrders)
      .set({
        ...(dto.supplier !== undefined && { supplier: dto.supplier }),
        ...(dto.quantity_tons !== undefined && { quantity: String(dto.quantity_tons * 1000) }),
        ...(dto.price_per_kg !== undefined && {
          price_per_kg: String(dto.price_per_kg),
        }),
        ...(dto.transport_cost !== undefined && {
          transport_cost: String(dto.transport_cost),
        }),
        ...(dto.total_cost !== undefined && {
          total_cost: String(dto.total_cost),
        }),
        ...(dto.delivery_date !== undefined && {
          delivery_date: dto.delivery_date,
        }),
        updated_at: new Date(),
      })
      .where(
        and(eq(procurementOrders.id, id), eq(procurementOrders.user_id, userId)),
      )
      .returning();

    if (!updatedOrder) {
      throw new NotFoundException('Order not found or nothing to update');
    }
    return updatedOrder;
  }

  async remove(userId: string, id: string) {
    const [deleted] = await this.db
      .delete(procurementOrders)
      .where(
        and(eq(procurementOrders.id, id), eq(procurementOrders.user_id, userId)),
      )
      .returning({ id: procurementOrders.id });

    if (!deleted) {
      throw new NotFoundException('Order not found');
    }
    return { message: 'Order deleted successfully' };
  }
}
