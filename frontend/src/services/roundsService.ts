import api from './api';

export const operationRoundsQueryKey = ['operation-rounds'] as const;

export interface OperationRound {
  id: string;
  name: string;
  is_active: boolean;
}

export interface RoundCreateResponse extends OperationRound {
  carried_sacks: Array<{ sack_size: 5 | 10 | 25; quantity: number }>;
}

export const roundsService = {
  getAll: async (): Promise<OperationRound[]> =>
    (await api.get<OperationRound[]>('/rounds')).data,
  create: async (name: string): Promise<RoundCreateResponse> =>
    (await api.post<RoundCreateResponse>('/rounds', { name })).data,
  activate: async (id: string): Promise<OperationRound> =>
    (await api.post<OperationRound>(`/rounds/${id}/activate`)).data,
  downloadReport: async (round: OperationRound): Promise<void> => {
    const response = await api.get<Blob>(`/rounds/${round.id}/report`, {
      responseType: 'blob',
    });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${round.name.replace(/[^a-z0-9_-]+/gi, '_')}_report.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
  remove: async (id: string, confirmName: string): Promise<void> => {
    await api.delete(`/rounds/${id}`, { data: { confirmName } });
  },
};
