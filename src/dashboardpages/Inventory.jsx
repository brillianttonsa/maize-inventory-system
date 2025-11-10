import useInventoryHook from "../hooks/useinventoryLogic.js";
import OverviewGrid from "../components/dashboardcomponents/inventory/OverviewGrid";
import StockCharts from "../components/dashboardcomponents/inventory/StockCharts";
import StockMovementTable from "../components/dashboardcomponents/inventory/StockMovementTable";



export default function Inventory() {


  const { currentStocks, stockLevels, movements } = useInventoryHook();

  return (
    <div className="p-8 min-h-screen space-y-8 bg-gray-50">
      <h1 className={"text-3xl font-bold mb-6 text-yellow-700"}>Inventory & Stock Management</h1>
      <OverviewGrid currentStock={currentStocks} />
    
      <StockCharts
        stockLevels={stockLevels}
      />

      <StockMovementTable movements={movements} />
    </div>
  );
}
