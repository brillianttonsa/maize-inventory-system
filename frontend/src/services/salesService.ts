import api from './api';
import type { Sale } from '../types';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SalePayload {
  customer_name: string;
  customer_contact: string;
  product_type: string;
  quantity: number;
  sack_count?: number;
  sack_size?: 5 | 10 | 25;
  bran_unit_count?: number;
  bran_unit?: 'gunia';
  price_per_kg: number;
  delivery_cost: number;
  delivery_address: string;
  payment_method: string;
  total_amount: number;
  date: string;
}

export const salesService = {
  getAll: async (): Promise<Sale[]> => (await api.get<Sale[]>('/sales')).data,
  getPage: async (page: number, limit: number): Promise<PaginatedResponse<Sale>> =>
    (await api.get<PaginatedResponse<Sale>>('/sales', { params: { page, limit } })).data,
  create: async (payload: SalePayload): Promise<Sale> =>
    (await api.post<Sale>('/sales', payload)).data,
  update: async (id: string, payload: Partial<SalePayload>): Promise<Sale> =>
    (await api.put<Sale>(`/sales/${id}`, payload)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/sales/${id}`);
  },
};
