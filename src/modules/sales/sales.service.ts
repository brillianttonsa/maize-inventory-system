import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import { sales } from '../../db/schema';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  findAll(userId: string) {
    // old app ordered by numeric id; ids are uuids now so we order by created_at instead
    return this.db.query.sales.findMany({
      where: eq(sales.user_id, userId),
      orderBy: asc(sales.created_at),
    });
  }

  async create(userId: string, dto: CreateSaleDto) {
    if (dto.sack_count === undefined || dto.sack_size === undefined) {
      throw new BadRequestException('Sack count and sack size are required for a sale');
    }
    const quantityInKg = dto.sack_count * dto.sack_size;
    const [newSale] = await this.db
      .insert(sales)
      .values({
        user_id: userId,
        customer_name: dto.customer_name,
        customer_contact: dto.customer_contact,
        product_type: dto.product_type,
        quantity: String(quantityInKg),
        sack_count: dto.sack_count,
        sack_size: dto.sack_size,
        price_per_kg: String(dto.price_per_kg),
        delivery_cost: String(dto.delivery_cost),
        delivery_address: dto.delivery_address,
        payment_method: dto.payment_method,
        total_amount: String(dto.total_amount),
        notes: dto.notes,
        date: dto.date,
      })
      .returning();
    return newSale;
  }

  async update(userId: string, id: string, dto: UpdateSaleDto) {
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
        ...(dto.quantity !== undefined && { quantity: String(dto.quantity) }),
        ...(dto.sack_count !== undefined && { sack_count: dto.sack_count }),
        ...(dto.sack_size !== undefined && { sack_size: dto.sack_size }),
        ...(dto.price_per_kg !== undefined && {
          price_per_kg: String(dto.price_per_kg),
        }),
        ...(dto.delivery_cost !== undefined && {
          delivery_cost: String(dto.delivery_cost),
        }),
        ...(dto.delivery_address !== undefined && {
          delivery_address: dto.delivery_address,
        }),
        ...(dto.payment_method !== undefined && {
          payment_method: dto.payment_method,
        }),
        ...(dto.total_amount !== undefined && {
          total_amount: String(dto.total_amount),
        }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.date !== undefined && { date: dto.date }),
        updated_at: new Date(),
      })
      .where(and(eq(sales.id, id), eq(sales.user_id, userId)))
      .returning();

    if (!updatedSale) {
      throw new NotFoundException('Sale not found or unauthorized');
    }
    return updatedSale;
  }

  async remove(userId: string, id: string) {
    const [deleted] = await this.db
      .delete(sales)
      .where(and(eq(sales.id, id), eq(sales.user_id, userId)))
      .returning({ id: sales.id });

    if (!deleted) {
      throw new NotFoundException('Sale not found or unauthorized');
    }
    return { message: 'Sale deleted successfully' };
  }
}
