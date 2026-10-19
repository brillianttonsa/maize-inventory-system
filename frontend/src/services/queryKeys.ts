import type { QueryClient } from '@tanstack/react-query';

export const queryKeys = {
  sales: {
    all: ['sales'] as const,
    list: ['sales', 'list'] as const,
    page: (page: number, limit: number) => ['sales', 'page', page, limit] as const,
  },
  expenses: {
    all: ['expenses'] as const,
    list: (page: number, limit: number, category: string) =>
      ['expenses', 'list', page, limit, category] as const,
    summary: ['expenses', 'summary'] as const,
  },
  procurement: {
    all: ['procurement'] as const,
    list: ['procurement', 'list'] as const,
    page: (page: number, limit: number) => ['procurement', 'page', page, limit] as const,
  },
  production: {
    all: ['production'] as const,
    list: ['production', 'list'] as const,
    page: (page: number, limit: number) => ['production', 'page', page, limit] as const,
    chart: (from: string, to: string) => ['production', 'chart', from, to] as const,
  },
  inventory: {
    all: ['inventory'] as const,
    movements: ['inventory', 'movements'] as const,
    movementPage: (page: number, limit: number, item: string, source: string) =>
      ['inventory', 'movements', page, limit, item, source] as const,
    summary: (date: string) => ['inventory', 'summary', date] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    summary: (date: string) => ['dashboard', 'summary', date] as const,
  },
  activities: {
    all: ['activities'] as const,
    recent: ['activities', 'recent'] as const,
  },
} as const;

export const invalidateRecordQueries = (
  queryClient: QueryClient,
  recordKey: readonly string[],
) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: recordKey }),
    queryClient.invalidateQueries({ queryKey: queryKeys.inventory.movements }),
    queryClient.invalidateQueries({ queryKey: ['inventory', 'summary'] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.activities.recent }),
  ]);
