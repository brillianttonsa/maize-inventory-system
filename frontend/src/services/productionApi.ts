import api from './api';
import type { ProductionBatch } from '../types';
import type { PaginatedResponse } from './salesService';

export interface ProductionPayload {
  maize_tons: number;
  flour_sacks_5kg?: number;
  flour_sacks_10kg?: number;
  flour_sacks_25kg?: number;
  bran_quantity?: number;
  date: string;
}

export interface ProductionChartDay {
  date: string;
  flour: number;
  bran: number;
}
export interface PackagingBreakdown { packageSize: 5 | 10 | 25; sacks: number; totalWeight: number; }

export const productionService = {
  getAll: async (): Promise<ProductionBatch[]> =>
    (await api.get<ProductionBatch[]>('/production')).data,
  getPage: async (page: number, limit: number): Promise<PaginatedResponse<ProductionBatch>> =>
    (await api.get<PaginatedResponse<ProductionBatch>>('/production', {
      params: { page, limit },
    })).data,
  getChartData: async (from: string, to: string): Promise<ProductionChartDay[]> =>
    (
      await api.get<ProductionChartDay[]>('/production/chart-data', {
        params: { from, to },
      })
    ).data,
  getPackagingBreakdown: async (): Promise<PackagingBreakdown[]> => (await api.get<PackagingBreakdown[]>('/production/packaging-breakdown')).data,
  create: async (payload: ProductionPayload): Promise<ProductionBatch> =>
    (await api.post<ProductionBatch>('/production', payload)).data,
  update: async (id: string, payload: Partial<ProductionPayload>): Promise<ProductionBatch> =>
    (await api.put<ProductionBatch>(`/production/${id}`, payload)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/production/${id}`);
  },
};
