import api from './api';
import type { ProductionBatch } from '../types';

export interface ProductionPayload {
  maize_tons: number;
  flour_sacks_5kg?: number;
  flour_sacks_10kg?: number;
  flour_sacks_25kg?: number;
  bran_unit_count?: number;
  bran_unit?: 'gunia';
  date: string;
}

export const productionService = {
  getAll: async (): Promise<ProductionBatch[]> =>
    (await api.get<ProductionBatch[]>('/production')).data,
  create: async (payload: ProductionPayload): Promise<ProductionBatch> =>
    (await api.post<ProductionBatch>('/production', payload)).data,
  update: async (id: string, payload: Partial<ProductionPayload>): Promise<ProductionBatch> =>
    (await api.put<ProductionBatch>(`/production/${id}`, payload)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/production/${id}`);
  },
};
