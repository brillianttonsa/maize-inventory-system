import api from './api';

export interface OperationalCost {
  id: string;
  date: string;
  operation: string;
  starting_units: string;
  remaining_units: string;
  units_used: string;
  total_amount: string;
  notes: string | null;
  created_at: string;
}

export interface OperationalCostPayload {
  date: string;
  operation: string;
  starting_units: number;
  remaining_units: number;
  total_amount: number;
  notes?: string;
}

export interface OperationalCostSummary {
  purchasedUnits: number;
  usedUnits: number;
  remainingUnits: number;
  totalOperationalCost: number;
}

export const operationalCostsService = {
  getAll: async (): Promise<OperationalCost[]> =>
    (await api.get<OperationalCost[]>('/operational-costs')).data,
  getSummary: async (): Promise<OperationalCostSummary> =>
    (await api.get<OperationalCostSummary>('/operational-costs/summary')).data,
  create: async (payload: OperationalCostPayload): Promise<OperationalCost> =>
    (await api.post<OperationalCost>('/operational-costs', payload)).data,
  update: async (id: string, payload: Partial<OperationalCostPayload>): Promise<OperationalCost> =>
    (await api.put<OperationalCost>(`/operational-costs/${id}`, payload)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/operational-costs/${id}`);
  },
};
