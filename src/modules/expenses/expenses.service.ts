import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import { expenses } from '../../db/schema';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  findAll(userId: string) {
    return this.db.query.expenses.findMany({
      where: eq(expenses.user_id, userId),
      orderBy: asc(expenses.date),
    });
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
    const [newExpense] = await this.db
      .insert(expenses)
      .values({
        user_id: userId,
        date: dto.date,
        category: dto.category,
        amount: dto.amount,
        unit_value:
          dto.unit_value !== undefined ? String(dto.unit_value) : undefined,
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
