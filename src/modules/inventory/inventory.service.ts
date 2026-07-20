import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import {
  procurementOrders,
  productionBatches,
  sales,
  expenses,
} from '../../db/schema';

export interface InventoryMovement {
  date: string;
  item: string;
  quantityIn: number;
  quantityOut: number;
  source: string;
  remarks: string;
  balance?: number;
}

function toLocalDateString(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-CA'); // YYYY-MM-DD
}

@Injectable()
export class InventoryService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  async getMovements(userId: string): Promise<InventoryMovement[]> {
    const [proc, prod, sal, exp] = await Promise.all([
      this.db.query.procurementOrders.findMany({
        where: eq(procurementOrders.user_id, userId),
      }),
      this.db.query.productionBatches.findMany({
        where: eq(productionBatches.user_id, userId),
      }),
      this.db.query.sales.findMany({ where: eq(sales.user_id, userId) }),
      this.db.query.expenses.findMany({ where: eq(expenses.user_id, userId) }),
    ]);

    const movements: InventoryMovement[] = [];

    // Maize from Procurement
    proc.forEach((p) =>
      movements.push({
        date: toLocalDateString(p.delivery_date),
        item: 'Maize',
        quantityIn: Number(p.quantity),
        quantityOut: 0,
        source: 'Procurement',
        remarks: `Procured ${p.quantity} kg from ${p.supplier}`,
      }),
    );

    // Sacks from Expenses
    exp
      .filter((e) => e.category && e.category.toLowerCase() === 'sacks')
      .forEach((e) =>
        movements.push({
          date: toLocalDateString(e.date),
          item: 'Sacks',
          quantityIn: Number(e.unit_value || 0),
          quantityOut: 0,
          source: 'Expense',
          remarks: `Purchased ${e.amount || 0} sacks`,
        }),
      );

    // Production
    prod.forEach((p) => {
      const localDate = toLocalDateString(p.date);
      movements.push({
        date: localDate,
        item: 'Maize',
        quantityIn: 0,
        quantityOut: Number(p.maize_quantity),
        source: 'Production',
        remarks: `Used ${p.maize_quantity} kg of Maize for production`,
      });
      movements.push({
        date: localDate,
        item: 'Flour',
        quantityIn: Number(p.flour_output),
        quantityOut: 0,
        source: 'Production',
        remarks: `Produced ${p.flour_output} kg of Flour`,
      });
      movements.push({
        date: localDate,
        item: 'Bran',
        quantityIn: Number(p.bran_output),
        quantityOut: 0,
        source: 'Production',
        remarks: `Produced ${p.bran_output} kg of Bran`,
      });
      movements.push({
        date: localDate,
        item: 'Sacks',
        quantityIn: 0,
        quantityOut: Number(p.sacks_used || 0),
        source: 'Production',
        remarks: `Used ${p.sacks_used} units of sacks`,
      });
    });

    // Sales
    sal.forEach((s) => {
      movements.push({
        date: toLocalDateString(s.date),
        item: s.product_type.charAt(0).toUpperCase() + s.product_type.slice(1),
        quantityIn: 0,
        quantityOut: Number(s.quantity || 0),
        source: 'Sales',
        // old app referenced a non-existent `s.customer` field here; fixed to customer_name
        remarks: `Sold ${s.quantity || 0} kg to ${s.customer_name || 'Customer'}`,
      });
    });

    // Running balance per item
    const balances: Record<string, number> = {};
    movements.forEach((m) => {
      balances[m.item] = (balances[m.item] || 0) + (m.quantityIn - m.quantityOut);
      m.balance = balances[m.item];
    });

    return movements;
  }

  async getRecentActivities(userId: string) {
    const movements = await this.getMovements(userId);
    return movements
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
      .map((m) => ({ date: m.date, remarks: m.remarks, source: m.source }));
  }
}
