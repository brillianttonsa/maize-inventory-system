import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTodayDate } from '../components/utils/todaydate';
import { inventoryService } from '../services/inventoryService';
import { COLORS } from '../components/dashboard/inventory/constants';
import { queryKeys } from '../services/queryKeys';

export interface StockLevel {
  name: string;
  value: number;
  color: string;
}

export default function useInventoryHook() {
  const summaryQuery = useQuery({
    queryKey: queryKeys.dashboard.summary(getTodayDate()),
    queryFn: () => inventoryService.getDashboardSummary(getTodayDate()),
  });
  const currentStocks = summaryQuery.data?.stocks ?? {
    maize: 0,
    flour: 0,
    bran: 0,
    sacks5kg: 0,
    sacks10kg: 0,
    sacks25kg: 0,
  };

  const stockLevels: StockLevel[] = useMemo(
    () =>
      Object.keys(currentStocks).map((k) => ({
        name: k === 'sacks5kg' ? '5 kg Sacks' : k === 'sacks10kg' ? '10 kg Sacks' : k === 'sacks25kg' ? '25 kg Sacks' : k.charAt(0).toUpperCase() + k.slice(1),
        value: currentStocks[k as keyof typeof currentStocks],
        color: COLORS[k],
      })),
    [currentStocks],
  );

  const sackProductionBalances = useMemo(
    () => summaryQuery.data?.sackProductionBalances ?? [],
    [summaryQuery.data?.sackProductionBalances],
  );

  return {
    currentStocks,
    stockLevels,
    sackProductionBalances,
    loading: summaryQuery.isPending,
    error: summaryQuery.error,
  };
}
