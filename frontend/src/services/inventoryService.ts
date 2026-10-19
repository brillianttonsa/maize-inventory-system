import api from './api';
import type { InventoryMovement } from '../types';
import type { PaginatedResponse } from './salesService';

export interface DashboardSummary {
  stats: {
    totalMaize: number;
    totalFlour: number;
    totalBran: number;
    efficiency: number | string;
    totalRevenue: number;
  };
  stocks: {
    maize: number;
    flour: number;
    bran: number;
    sacks5kg: number;
    sacks10kg: number;
    sacks25kg: number;
  };
  sackProductionBalances: Array<{
    size: 5 | 10 | 25;
    produced: number;
    sold: number;
    remaining: number;
  }>;
}

export const inventoryService = {
  // NOTE: old code called GET /inventory, which doesn't exist on the backend
  // (the route is /inventory-movements) — fixed here.
  getAllMovements: async (): Promise<InventoryMovement[]> =>
    (await api.get<InventoryMovement[]>('/inventory-movements')).data,
  getMovementPage: async (
    page: number,
    limit: number,
    item: string,
    source: string,
  ): Promise<PaginatedResponse<InventoryMovement>> =>
    (
      await api.get<PaginatedResponse<InventoryMovement>>('/inventory-movements', {
        params: { page, limit, item, source },
      })
    ).data,
  getDashboardSummary: async (date: string): Promise<DashboardSummary> =>
    (await api.get<DashboardSummary>('/dashboard-summary', { params: { date } })).data,
};
