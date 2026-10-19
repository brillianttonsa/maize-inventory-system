import api from './api';
import type { ProcurementOrder } from '../types';
import type { PaginatedResponse } from './salesService';

export interface ProcurementPayload {
  supplier: string;
  quantity_tons: number;
  price_per_kg: number;
  transport_cost: number;
  total_cost: number;
  delivery_date: string;
}

export const procurementService = {
  getAll: async (): Promise<ProcurementOrder[]> =>
    (await api.get<ProcurementOrder[]>('/procurement')).data,
  getPage: async (page: number, limit: number): Promise<PaginatedResponse<ProcurementOrder>> =>
    (await api.get<PaginatedResponse<ProcurementOrder>>('/procurement', {
      params: { page, limit },
    })).data,
  create: async (payload: ProcurementPayload): Promise<ProcurementOrder> =>
    (await api.post<ProcurementOrder>('/procurement', payload)).data,
  update: async (id: string, payload: Partial<ProcurementPayload>): Promise<ProcurementOrder> =>
    (await api.put<ProcurementOrder>(`/procurement/${id}`, payload)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/procurement/${id}`);
  },
};
