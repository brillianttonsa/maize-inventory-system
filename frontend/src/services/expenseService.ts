import api from './api';
import type { Expense } from '../types';
import type { PaginatedResponse } from './salesService';

export interface ExpenseSummary {
  category: string;
  amount: number;
}

export interface ExpensePayload {
  date: string;
  category: string;
  amount: number;
  unit_value?: number;
  unit_cost?: number;
  sack_size?: 5 | 10 | 25;
  paid_by?: string;
  method?: string;
  notes?: string;
}

export const expenseService = {
  getAll: async (): Promise<Expense[]> => (await api.get<Expense[]>('/expenses')).data,
  getPage: async (page: number, limit: number, category: string): Promise<PaginatedResponse<Expense>> =>
    (await api.get<PaginatedResponse<Expense>>('/expenses', {
      params: { page, limit, category },
    })).data,
  getSummary: async (): Promise<ExpenseSummary[]> =>
    (await api.get<ExpenseSummary[]>('/expenses/summary')).data,
  create: async (payload: ExpensePayload): Promise<Expense> =>
    (await api.post<Expense>('/expenses', payload)).data,
  update: async (id: string, payload: Partial<ExpensePayload>): Promise<Expense> =>
    (await api.put<Expense>(`/expenses/${id}`, payload)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },
};
