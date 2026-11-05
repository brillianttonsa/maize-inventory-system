import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, count, desc, eq, sql } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import { expenses } from '../../db/schema';
import { getActiveRoundId } from '../../common/rounds';
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
    const roundId = await getActiveRoundId(this.db, userId);
    const where = paginationQuery.category && paginationQuery.category !== 'All'
      ? and(eq(expenses.user_id, userId), eq(expenses.round_id, roundId), eq(expenses.category, paginationQuery.category))
      : and(eq(expenses.user_id, userId), eq(expenses.round_id, roundId));
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
    const roundId = await getActiveRoundId(this.db, userId);
    const grouped = await this.db
      .select({
        category: expenses.category,
        amount: sql<string>`coalesce(sum(${expenses.total_amount}), 0)::text`,
      })
      .from(expenses)
      .where(and(eq(expenses.user_id, userId), eq(expenses.round_id, roundId)))
      .groupBy(expenses.category);

    return grouped.map((row) => ({
      category: row.category,
      amount: Number(row.amount),
    }));
  }

  async findOne(id: string, userId: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const expense = await this.db.query.expenses.findFirst({
      where: and(eq(expenses.id, id), eq(expenses.user_id, userId), eq(expenses.round_id, roundId)),
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async create(userId: string, dto: CreateExpenseDto) {
    const roundId = await getActiveRoundId(this.db, userId);
    if (dto.category.toLowerCase() === 'sacks' && dto.sack_size === undefined) {
      throw new BadRequestException('Sack size is required when recording a sack purchase');
    }
    const usesUnitCost = this.usesUnitCost(dto.category);
    if (usesUnitCost && (dto.unit_value === undefined || dto.unit_cost === undefined)) {
      throw new BadRequestException('Quantity and cost per unit are required for sacks and water');
    }
    const totalAmount = usesUnitCost
      ? Math.round(dto.unit_value! * dto.unit_cost!)
      : dto.total_amount;
    if (totalAmount === undefined) {
      throw new BadRequestException('Total amount is required for this expense category.');
    }
    const [newExpense] = await this.db
      .insert(expenses)
      .values({
        user_id: userId,
        round_id: roundId,
        date: dto.date,
        category: dto.category,
        total_amount: String(totalAmount),
        unit_value:
          dto.unit_value !== undefined ? String(dto.unit_value) : undefined,
        unit_cost: dto.unit_cost !== undefined ? String(dto.unit_cost) : undefined,
        sack_size: dto.sack_size,
        notes: dto.notes,
      })
      .returning();
    return newExpense;
  }

  async update(id: string, userId: string, dto: UpdateExpenseDto) {
    const roundId = await getActiveRoundId(this.db, userId);
    const current = await this.db.query.expenses.findFirst({
      where: and(eq(expenses.id, id), eq(expenses.user_id, userId), eq(expenses.round_id, roundId)),
    });
    if (!current) throw new NotFoundException('Expense not found');
    const category = dto.category ?? current.category;
    const unitValue = dto.unit_value ?? Number(current.unit_value ?? 0);
    const unitCost = dto.unit_cost ?? Number(current.unit_cost ?? 0);
    const usesUnitCost = this.usesUnitCost(category);
    if (category.toLowerCase() === 'sacks' && (dto.sack_size ?? current.sack_size) === null) {
      throw new BadRequestException('Sack size is required when recording a sack purchase');
    }
    if (
      usesUnitCost &&
      ((dto.unit_value === undefined && current.unit_value === null) ||
        (dto.unit_cost === undefined && current.unit_cost === null))
    ) {
      throw new BadRequestException('Quantity and cost per unit are required for sacks and water');
    }
    const totalAmount = usesUnitCost
      ? Math.round(unitValue * unitCost)
      : dto.total_amount ?? Number(current.total_amount);
    const [updatedExpense] = await this.db
      .update(expenses)
      .set({
        ...(dto.date !== undefined && { date: dto.date }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...((dto.total_amount !== undefined || usesUnitCost) && {
          total_amount: String(totalAmount),
        }),
        ...(dto.unit_value !== undefined && {
          unit_value: String(dto.unit_value),
        }),
        ...(dto.unit_cost !== undefined && { unit_cost: String(dto.unit_cost) }),
        ...(dto.sack_size !== undefined && { sack_size: dto.sack_size }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        updated_at: new Date(),
      })
      .where(and(eq(expenses.id, id), eq(expenses.user_id, userId), eq(expenses.round_id, roundId)))
      .returning();

    if (!updatedExpense) {
      throw new NotFoundException('Expense not found or nothing to update');
    }
    return updatedExpense;
  }

  private usesUnitCost(category: string) {
    return ['sacks', 'water'].includes(category.toLowerCase());
  }

  async remove(id: string, userId: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const [deleted] = await this.db
      .delete(expenses)
      .where(and(eq(expenses.id, id), eq(expenses.user_id, userId), eq(expenses.round_id, roundId)))
      .returning({ id: expenses.id });

    if (!deleted) {
      throw new NotFoundException('Expense not found');
    }
    return { message: 'Expense deleted successfully' };
  }
}
