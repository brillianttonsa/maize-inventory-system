import api from './api';
import type { InventoryMovement } from '../types';

export const inventoryService = {
  // NOTE: old code called GET /inventory, which doesn't exist on the backend
  // (the route is /inventory-movements) — fixed here.
  getAllMovements: async (): Promise<InventoryMovement[]> =>
    (await api.get<InventoryMovement[]>('/inventory-movements')).data,
};
