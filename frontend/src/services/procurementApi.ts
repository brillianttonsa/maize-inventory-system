import api from './api';
import type { ProcurementOrder } from '../types';
import type { PaginatedResponse } from './salesService';

export interface ProcurementPayload {
  supplier: string;
  supplier_location: string;
  supplier_phone: string;
  quantity_tons: number;
  maize_purchase_cost: number;
  transport_cost: number;
  collection_labour: number;
  loading_labour: number;
  unloading_labour: number;
  transport_tax: number;
  rural_tax: number;
  delivery_date: string;
}

export interface ProcurementSummary {
  totalQuantityKg: number;
  totalCost: number;
  actualMaizePurchase: number;
  averageTotalCostPerKg: number;
}

export const procurementService = {
  getAll: async (): Promise<ProcurementOrder[]> =>
    (await api.get<ProcurementOrder[]>('/procurement')).data,
  getPage: async (page: number, limit: number): Promise<PaginatedResponse<ProcurementOrder>> =>
    (await api.get<PaginatedResponse<ProcurementOrder>>('/procurement', {
      params: { page, limit },
    })).data,
  getSummary: async (): Promise<ProcurementSummary> => (await api.get<ProcurementSummary>('/procurement/summary')).data,
  create: async (payload: ProcurementPayload): Promise<ProcurementOrder> =>
    (await api.post<ProcurementOrder>('/procurement', payload)).data,
  update: async (id: string, payload: Partial<ProcurementPayload>): Promise<ProcurementOrder> =>
    (await api.put<ProcurementOrder>(`/procurement/${id}`, payload)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/procurement/${id}`);
  },
};
