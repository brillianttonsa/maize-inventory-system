import { useState, useEffect, useMemo } from 'react';
import {
  calculateCurrentStocks,
  calculateSackProductionBalances,
} from '../components/dashboard/inventory/inventoryUtils';
import { productionService } from '../services/productionApi';
import { procurementService } from '../services/procurementApi';
import { salesService } from '../services/salesService';
import { expenseService } from '../services/expenseService';
import { inventoryService } from '../services/inventoryService';
import { COLORS } from '../components/dashboard/inventory/constants';
import type { Expense, InventoryMovement, ProcurementOrder, ProductionBatch, Sale } from '../types';

export interface StockLevel {
  name: string;
  value: number;
  color: string;
}

export default function useInventoryHook() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [procurements, setProcurements] = useState<ProcurementOrder[]>([]);
  const [productions, setProductions] = useState<ProductionBatch[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);

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

  useEffect(() => {
    async function fetchMovements() {
      try {
        const data = await inventoryService.getAllMovements();
        setMovements(data);
      } catch (err) {
        console.error('Failed to fetch inventory movements:', err);
        setMovements([]);
      }
    }
    fetchMovements();
  }, []);

  const currentStocks = useMemo(() => {
    return calculateCurrentStocks({
      procurements,
      productions,
      sales,
      expenses,
    });
  }, [procurements, productions, sales, expenses]);

  const stockLevels: StockLevel[] = useMemo(
    () =>
      Object.keys(currentStocks).map((k) => ({
        name: k === 'sacks5kg' ? '5 kg Sacks' : k === 'sacks10kg' ? '10 kg Sacks' : k === 'sacks25kg' ? '25 kg Sacks' : k.charAt(0).toUpperCase() + k.slice(1),
        value: (currentStocks as any)[k],
        color: COLORS[k],
      })),
    [currentStocks],
  );

  const sackProductionBalances = useMemo(
    () => calculateSackProductionBalances(productions, sales),
    [productions, sales],
  );

  return {
    currentStocks,
    stockLevels,
    sackProductionBalances,
    movements,
  };
}
