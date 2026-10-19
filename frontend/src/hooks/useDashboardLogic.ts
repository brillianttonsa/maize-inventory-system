import { useQuery } from '@tanstack/react-query';
import { getTodayDate } from '../components/utils/todaydate';
import { inventoryService } from '../services/inventoryService';
import { queryKeys } from '../services/queryKeys';

export interface DashboardStats {
  totalMaize: number;
  totalFlour: number;
  totalBran: number;
  efficiency: number | string;
  totalRevenue: number;
}

export function useDashboardLogic() {
  const summaryQuery = useQuery({
    queryKey: queryKeys.dashboard.summary(getTodayDate()),
    queryFn: () => inventoryService.getDashboardSummary(getTodayDate()),
  });
  const stats = summaryQuery.data?.stats ?? {
    totalMaize: 0,
    totalFlour: 0,
    totalBran: 0,
    efficiency: 0,
    totalRevenue: 0,
  };
  const stocks = summaryQuery.data?.stocks ?? null;
  const loading = summaryQuery.isPending;
  const error = summaryQuery.isError;

  return { stats, stocks, loading, error };
}
