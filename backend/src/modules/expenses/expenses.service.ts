import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, count, desc, eq, sql } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import { expenses } from '../../db/schema';
import {
  getPagination,
  type PaginatedResult,
  type PaginationQueryDto,
} from '../../common/dto/pagination-query.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  async findAll(
    userId: string,
    paginationQuery: PaginationQueryDto = {},
  ) {
    const where = paginationQuery.category && paginationQuery.category !== 'All'
      ? and(eq(expenses.user_id, userId), eq(expenses.category, paginationQuery.category))
      : eq(expenses.user_id, userId);
    const pagination = getPagination(paginationQuery);
    if (!pagination) {
      return this.db.query.expenses.findMany({
        where,
        orderBy: asc(expenses.date),
      });
    }

    const [items, [{ total }]] = await Promise.all([
      this.db.query.expenses.findMany({
        where,
        orderBy: desc(expenses.date),
        limit: pagination.limit,
        offset: pagination.offset,
      }),
      this.db.select({ total: count() }).from(expenses).where(where),
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
    const grouped = await this.db
      .select({
        category: expenses.category,
        amount: sql<string>`coalesce(sum(${expenses.amount}), 0)::text`,
      })
      .from(expenses)
      .where(eq(expenses.user_id, userId))
      .groupBy(expenses.category);

    return grouped.map((row) => ({
      category: row.category,
      amount: Number(row.amount),
    }));
  }

  async findOne(id: string, userId: string) {
    const expense = await this.db.query.expenses.findFirst({
      where: and(eq(expenses.id, id), eq(expenses.user_id, userId)),
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async create(userId: string, dto: CreateExpenseDto) {
    if (dto.category.toLowerCase() === 'sacks' && dto.sack_size === undefined) {
      throw new BadRequestException('Sack size is required when recording a sack purchase');
    }
    const usesUnitCost = ['sacks', 'water'].includes(dto.category.toLowerCase());
    if (usesUnitCost && (dto.unit_value === undefined || dto.unit_cost === undefined)) {
      throw new BadRequestException('Quantity and cost per unit are required for sacks and water');
    }
    const amount = usesUnitCost ? Math.round(dto.unit_value! * dto.unit_cost!) : dto.amount;
    const [newExpense] = await this.db
      .insert(expenses)
      .values({
        user_id: userId,
        date: dto.date,
        category: dto.category,
        amount,
        unit_value:
          dto.unit_value !== undefined ? String(dto.unit_value) : undefined,
        unit_cost: dto.unit_cost !== undefined ? String(dto.unit_cost) : undefined,
        sack_size: dto.sack_size,
        paid_by: dto.paid_by,
        method: dto.method,
        notes: dto.notes,
      })
      .returning();
    return newExpense;
  }

  async update(id: string, userId: string, dto: UpdateExpenseDto) {
    const [updatedExpense] = await this.db
      .update(expenses)
      .set({
        ...(dto.date !== undefined && { date: dto.date }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.unit_value !== undefined && {
          unit_value: String(dto.unit_value),
        }),
        ...(dto.unit_cost !== undefined && { unit_cost: String(dto.unit_cost) }),
        ...(dto.sack_size !== undefined && { sack_size: dto.sack_size }),
        ...(dto.paid_by !== undefined && { paid_by: dto.paid_by }),
        ...(dto.method !== undefined && { method: dto.method }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        updated_at: new Date(),
      })
      .where(and(eq(expenses.id, id), eq(expenses.user_id, userId)))
      .returning();

    if (!updatedExpense) {
      throw new NotFoundException('Expense not found or nothing to update');
    }
    return updatedExpense;
  }

  async remove(id: string, userId: string) {
    const [deleted] = await this.db
      .delete(expenses)
      .where(and(eq(expenses.id, id), eq(expenses.user_id, userId)))
      .returning({ id: expenses.id });

    if (!deleted) {
      throw new NotFoundException('Expense not found');
    }
    return { message: 'Expense deleted successfully' };
  }
}
