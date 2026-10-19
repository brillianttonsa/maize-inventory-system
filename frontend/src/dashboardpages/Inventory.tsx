import useInventoryHook from '../hooks/useinventoryLogic';
import OverviewGrid from '../components/dashboard/inventory/OverviewGrid';
import StockCharts from '../components/dashboard/inventory/StockCharts';
import StockMovementTable from '../components/dashboard/inventory/StockMovementTable';
import SackProductionBalance from '../components/dashboard/inventory/SackProductionBalance';

export default function Inventory() {
  const { currentStocks, stockLevels, sackProductionBalances, loading, error } = useInventoryHook();

  if (loading) return <div className="p-6 text-gray-500">Loading inventory...</div>;
  if (error) return <div className="p-6 text-red-600" role="alert">Failed to load inventory data.</div>;

  return (
    <div className="p-8 min-h-screen space-y-8 bg-gray-50">
      <h1 className={'text-3xl font-bold mb-6 text-yellow-700'}>Inventory & Stock Management</h1>
      <OverviewGrid currentStock={currentStocks} />

      <SackProductionBalance balances={sackProductionBalances} />

      <StockCharts stockLevels={stockLevels} />

      <StockMovementTable />
    </div>
  );
}
