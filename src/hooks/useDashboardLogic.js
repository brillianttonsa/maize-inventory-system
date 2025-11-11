import { useState, useEffect } from "react";
import { getProductionStats, getRevenueStats } from "../services/dashboardServices";
import { calculateCurrentStocksFromMovements } from "../components/dashboardcomponents/inventory/inventoryUtils";
import { inventoryService } from "../services/inventoryService";

export function useDashboardLogic() {
  const [stats, setStats] = useState({
    totalMaize: 0,
    totalFlour: 0,
    totalBran: 0,
    efficiency: 0,
    totalRevenue: 0,
  });

  const [movements, setMovements] = useState([]);
  const [stocks, setStocks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch inventory movements
        const data = await inventoryService.getAllMovements();
        setMovements(data);

        // Compute current stocks
        const currentStocks = calculateCurrentStocksFromMovements(data);
        setStocks(currentStocks);

        // Fetch production and revenue stats
        const production = await getProductionStats();
        const revenue = await getRevenueStats();

        setStats({
          ...production,
          totalRevenue: revenue.totalRevenue,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { stats, stocks, movements, loading };
}
