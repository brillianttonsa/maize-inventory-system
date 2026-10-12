import useInventoryHook from '../hooks/useinventoryLogic';
import OverviewGrid from '../components/dashboard/inventory/OverviewGrid';
import StockCharts from '../components/dashboard/inventory/StockCharts';
import StockMovementTable from '../components/dashboard/inventory/StockMovementTable';
import SackProductionBalance from '../components/dashboard/inventory/SackProductionBalance';

export default function Inventory() {
  const { currentStocks, stockLevels, sackProductionBalances, movements } = useInventoryHook();

  return (
    <div className="p-8 min-h-screen space-y-8 bg-gray-50">
      <h1 className={'text-3xl font-bold mb-6 text-yellow-700'}>Inventory & Stock Management</h1>
      <OverviewGrid currentStock={currentStocks} />

      <SackProductionBalance balances={sackProductionBalances} />

      <StockCharts stockLevels={stockLevels} />

      <StockMovementTable movements={movements} />
    </div>
  );
}
