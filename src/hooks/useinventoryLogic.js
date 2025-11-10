import { useState, useEffect, useMemo } from "react";
import { calculateCurrentStocks } from "../components/dashboardcomponents/inventory/inventoryUtils.js";
import { productionService } from "../services/productionApi.js";
import { procurementService } from "../services/procurementApi.js";
import { salesService } from "../services/salesService.js";
import { expenseService } from "../services/expenseService.js";
import { inventoryService } from "../services/inventoryService.js";
import { COLORS } from "../components/dashboardcomponents/inventory/constants.js";

export default function useInventoryHook() {
  const [expenses, setExpenses] = useState([]);
  const [procurements, setProcurements] = useState([]);
  const [productions, setProductions] = useState([]);
  const [sales, setSales] = useState([]);
  const [movements, setMovements] = useState([]);

  //  Fetching main data
  useEffect(() => {
    async function fetchData() {
      const [exp, proc, prod, sal] = await Promise.all([
        expenseService.getAll(),
        procurementService.getAll(),
        productionService.getAll(),
        salesService.getAll(),
      ]);

      setExpenses(exp);
      setProcurements(proc);
      setProductions(prod);
      setSales(sal);
    }

    fetchData();
  }, []);

  //  Fetching inventory movements
  useEffect(() => {
    async function fetchMovements() {
      const data = await inventoryService.getAllMovements();
      setMovements(data);
    }
    fetchMovements();
  }, []);

  //  Calculate current stocks
  const currentStocks = useMemo(() => {
    return calculateCurrentStocks({
      procurements,
      productions,
      sales,
      expenses,
    });
  }, [procurements, productions, sales, expenses]);

  //  Build stock levels for chart
  const stockLevels = useMemo(() =>
    Object.keys(currentStocks).map(k => ({
      name: k.charAt(0).toUpperCase() + k.slice(1),
      value: currentStocks[k],
      color: COLORS[k],
    }))
  , [currentStocks]);

  return {
    currentStocks,
    stockLevels,
    movements
  };
}
