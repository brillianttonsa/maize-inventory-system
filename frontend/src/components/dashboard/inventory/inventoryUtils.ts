import type { Expense, InventoryMovement, ProcurementOrder, ProductionBatch, Sale } from '../../../../../maize-inventory-system/frontend/src/types';

export interface CurrentStocks {
  maize: number;
  flour: number;
  bran: number;
  sacks5kg: number;
  sacks10kg: number;
  sacks25kg: number;
}

export interface SackProductionBalance {
  size: 5 | 10 | 25;
  produced: number;
  sold: number;
  remaining: number;
}

/** Compares flour sacks packaged in production with flour sacks sold. */
export function calculateSackProductionBalances(
  productions: ProductionBatch[] = [],
  sales: Sale[] = [],
): SackProductionBalance[] {
  return ([5, 10, 25] as const).map((size) => {
    const produced = productions.reduce(
      (sum, batch) => sum + Number(batch[`flour_sacks_${size}kg`] || 0),
      0,
    );
    const sold = sales
      .filter(
        (sale) =>
          sale.product_type?.toLowerCase() === 'flour' &&
          Number(sale.sack_size) === size,
      )
      .reduce((sum, sale) => sum + Number(sale.sack_count || 0), 0);

    return { size, produced, sold, remaining: produced - sold };
  });
}

export function calculateCurrentStocks({
  procurements = [],
  productions = [],
  sales = [],
  expenses = [],
}: {
  procurements?: ProcurementOrder[];
  productions?: ProductionBatch[];
  sales?: Sale[];
  expenses?: Expense[];
}): CurrentStocks {
  const totalMaizeProcured = procurements.reduce((sum, p) => sum + Number(p.quantity), 0);
  const totalMaizeUsed = productions.reduce((sum, p) => sum + Number(p.maize_quantity || 0), 0);

  const totalFlourProduced = productions.reduce((sum, p) => sum + Number(p.flour_output || 0), 0);
  const totalFlourSold = sales
    .filter((s) => s.product_type.toLowerCase() === 'flour')
    .reduce((sum, s) => sum + Number(s.quantity || 0), 0);

  const totalBranProduced = productions.reduce(
    (sum, p) => sum + (p.bran_debe_quantity ? Number(p.bran_debe_quantity) / 7 : 0),
    0,
  );
  const totalBranSold = sales
    .filter((s) => s.product_type.toLowerCase() === 'bran')
    .reduce((sum, s) => sum + (s.bran_debe_quantity ? Number(s.bran_debe_quantity) / 7 : 0), 0);

  const sackBalance = (size: 5 | 10 | 25) => {
    const purchased = expenses
      .filter((e) => e.category?.toLowerCase() === 'sacks' && e.sack_size === size)
      .reduce((sum, e) => sum + Number(e.unit_value || 0), 0);
    const used = productions.reduce(
      (sum, p) => sum + Number(p[`flour_sacks_${size}kg` as const] || 0),
      0,
    );
    return purchased - used;
  };

  return {
    maize: totalMaizeProcured - totalMaizeUsed,
    flour: totalFlourProduced - totalFlourSold,
    bran: totalBranProduced - totalBranSold,
    sacks5kg: sackBalance(5),
    sacks10kg: sackBalance(10),
    sacks25kg: sackBalance(25),
  };
}

export function calculateCurrentStocksFromMovements(
  movements: InventoryMovement[],
): Record<string, number> {
  const items = ['Maize', 'Flour', 'Bran', '5 kg Sacks', '10 kg Sacks', '25 kg Sacks'];
  const stocks: Record<string, number> = {};

  items.forEach((item) => {
    const relevant = movements.filter((m) => m.item === item);
    const total = relevant.reduce(
      (sum, m) => sum + Number(m.quantityIn || 0) - Number(m.quantityOut || 0),
      0,
    );
    stocks[item.toLowerCase()] = total;
  });

  return stocks;
}
