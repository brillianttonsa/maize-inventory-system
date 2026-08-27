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

function sackItem(sackSize: number | null): string {
  return sackSize ? `${sackSize} kg Sacks` : 'Unspecified Sacks';
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
          item: sackItem(e.sack_size),
          quantityIn: Number(e.unit_value || 0),
          quantityOut: 0,
          source: 'Expense',
          remarks: `Purchased ${e.unit_value || 0} ${e.sack_size ?? 'unspecified'} kg sacks`,
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
      const branQuantity = p.bran_debe_quantity !== null ? Number(p.bran_debe_quantity) : Number(p.bran_output);
      movements.push({
        date: localDate,
        item: p.bran_debe_quantity !== null ? 'Bran (debe)' : 'Bran (legacy kg)',
        quantityIn: branQuantity,
        quantityOut: 0,
        source: 'Production',
        remarks: p.bran_debe_quantity !== null
          ? `Produced ${p.bran_debe_quantity} debe of Bran (${p.bran_unit})`
          : `Produced ${p.bran_output} kg of Bran (legacy)`,
      });
      movements.push({
        date: localDate,
        item: sackItem(p.sack_size),
        quantityIn: 0,
        quantityOut: Number(p.sacks_used || 0),
        source: 'Production',
        remarks: `Used ${p.sacks_used} ${p.sack_size ?? 'unspecified'} kg sacks`,
      });
    });

    // Sales
    sal.forEach((s) => {
      const isBran = s.product_type.toLowerCase() === 'bran';
      const quantity = isBran && s.bran_debe_quantity !== null ? Number(s.bran_debe_quantity) : Number(s.quantity || 0);
      movements.push({
        date: toLocalDateString(s.date),
        item: isBran ? (s.bran_debe_quantity !== null ? 'Bran (debe)' : 'Bran (legacy kg)') : 'Flour',
        quantityIn: 0,
        quantityOut: quantity,
        source: 'Sales',
        // old app referenced a non-existent `s.customer` field here; fixed to customer_name
        remarks: isBran && s.bran_debe_quantity !== null
          ? `Sold ${s.bran_unit_count} ${s.bran_unit} (${s.bran_debe_quantity} debe) to ${s.customer_name || 'Customer'}`
          : `Sold ${s.quantity || 0} kg to ${s.customer_name || 'Customer'}`,
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
