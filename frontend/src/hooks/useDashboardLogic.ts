import { useState, useEffect } from 'react';
import { getProductionStats, getRevenueStats } from '../services/dashboardServices';
import { calculateCurrentStocksFromMovements } from '../components/dashboard/inventory/inventoryUtils';
import { inventoryService } from '../services/inventoryService';
import type { InventoryMovement } from '../types';

export interface DashboardStats {
  totalMaize: number;
  totalFlour: number;
  totalBran: number;
  efficiency: number | string;
  totalRevenue: number;
}

export function useDashboardLogic() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMaize: 0,
    totalFlour: 0,
    totalBran: 0,
    efficiency: 0,
    totalRevenue: 0,
  });

  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [stocks, setStocks] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await inventoryService.getAllMovements();
        setMovements(data);

        const currentStocks = calculateCurrentStocksFromMovements(data);
        setStocks(currentStocks);

        const production = await getProductionStats();
        const revenue = await getRevenueStats();

        setStats({
          ...production,
          totalRevenue: revenue.totalRevenue,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { stats, stocks, movements, loading };
}
