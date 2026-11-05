import { Inject, Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import {
  getPagination,
  type PaginatedResult,
  type PaginationQueryDto,
} from '../../common/dto/pagination-query.dto';
import {
  procurementOrders,
  productionBatches,
  sales,
  expenses,
} from '../../db/schema';
import { getActiveRoundId } from '../../common/rounds';

interface MovementPageRow {
  date: string;
  item: string;
  quantityIn: string | number;
  quantityOut: string | number;
  source: string;
  remarks: string;
  balance: string | number;
}

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

  private async getMovementPage(
    userId: string,
    roundId: string,
    paginationQuery: PaginationQueryDto,
    page: NonNullable<ReturnType<typeof getPagination>>,
    newestFirst = false,
  ): Promise<PaginatedResult<InventoryMovement>> {
    const itemFilter = !paginationQuery.item || paginationQuery.item === 'All'
      ? sql`TRUE`
      : paginationQuery.item === 'Bran'
        ? sql`lower(item) LIKE 'bran%'`
        : sql`lower(item) = lower(${paginationQuery.item})`;
    const sourceFilter = !paginationQuery.source || paginationQuery.source === 'All'
      ? sql`TRUE`
      : sql`lower(source) = lower(${paginationQuery.source})`;
    const order = newestFirst ? sql`DESC` : sql`ASC`;

    const movements = sql`
      WITH all_movements AS (
        SELECT delivery_date::text AS date, 'Maize'::text AS item,
          (quantity_of_maize * 1000)::numeric AS quantity_in, 0::numeric AS quantity_out,
          'Procurement'::text AS source,
          concat('Procured ', quantity_of_maize, ' tons (',
            quantity_of_maize * 1000, ' kg) from ', supplier) AS remarks,
          concat('procurement:', id::text) AS event_id
        FROM procurement_orders WHERE user_id = ${userId} AND round_id = ${roundId}
        UNION ALL
        SELECT date::text, CASE WHEN sack_size IS NULL THEN 'Unspecified Sacks'
          ELSE concat(sack_size, ' kg Sacks') END,
          coalesce(unit_value, 0)::numeric, 0::numeric, 'Expense'::text,
          concat('Purchased ', coalesce(unit_value, '0'), ' ',
            coalesce(sack_size::text, 'unspecified'), ' kg sacks'),
          concat('expense:', id::text)
        FROM expenses
        WHERE user_id = ${userId} AND round_id = ${roundId} AND lower(category) = 'sacks'
        UNION ALL
        SELECT date::text, 'Maize'::text, 0::numeric, maize_quantity::numeric,
          'Production'::text,
          concat('Used ', maize_quantity, ' kg of Maize for production'),
          concat('production-maize:', id::text)
        FROM production_batches WHERE user_id = ${userId} AND round_id = ${roundId}
        UNION ALL
        SELECT date::text, 'Flour'::text, flour_output::numeric, 0::numeric,
          'Production'::text, concat('Produced ', flour_output, ' kg of Flour'),
          concat('production-flour:', id::text)
        FROM production_batches WHERE user_id = ${userId} AND round_id = ${roundId}
        UNION ALL
        SELECT date::text, 'Bran (sacks)'::text,
          coalesce(bran_quantity, 0)::numeric, 0::numeric,
          'Production'::text,
          concat('Produced ', coalesce(bran_quantity::text, '0'), ' bran sacks'),
          concat('production-bran:', id::text)
        FROM production_batches WHERE user_id = ${userId} AND round_id = ${roundId}
        UNION ALL
        SELECT date::text, concat(sack_size, ' kg Sacks'),
          0::numeric, sack_count::numeric, 'Production'::text,
          concat('Packaged flour in ', sack_count, ' ', sack_size, ' kg sacks'),
          concat('production-sacks-', sack_size, ':', id::text)
        FROM production_batches
        CROSS JOIN LATERAL (VALUES
          (5, flour_sacks_5kg), (10, flour_sacks_10kg), (25, flour_sacks_25kg)
        ) AS packaged(sack_size, sack_count)
        WHERE user_id = ${userId} AND round_id = ${roundId} AND sack_count > 0
        UNION ALL
        SELECT date::text,
          CASE WHEN lower(product_type) = 'bran' THEN 'Bran (sacks)'
            ELSE 'Flour' END,
          0::numeric,
          CASE WHEN lower(product_type) = 'bran' THEN sack_count::numeric
            ELSE (sack_count * coalesce(sack_size, 0))::numeric END,
          'Sales'::text,
          CASE WHEN lower(product_type) = 'bran'
            THEN concat('Sold ', sack_count, ' bran sacks to ',
              coalesce(customer_name, 'Customer'))
            ELSE concat('Sold ', sack_count, ' ', sack_size,
              ' kg flour sacks (', sack_count * sack_size, ' kg) to ',
              coalesce(customer_name, 'Customer')) END,
          concat('sale:', id::text)
        FROM sales WHERE user_id = ${userId} AND round_id = ${roundId}
      ),
      with_balances AS (
        SELECT *, sum(quantity_in - quantity_out) OVER (
          PARTITION BY item ORDER BY date, source, item, remarks, event_id
          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS balance
        FROM all_movements
      ),
      filtered AS (
        SELECT * FROM with_balances WHERE ${itemFilter} AND ${sourceFilter}
      )
    `;
    const pageResult = await this.db.execute(sql`
      ${movements}
      SELECT date, item, quantity_in AS "quantityIn",
        quantity_out AS "quantityOut", source, remarks, balance,
        count(*) OVER()::int AS total
      FROM filtered
      ORDER BY date ${order}, source ${order}, item ${order}, remarks ${order}, event_id ${order}
      LIMIT ${page.limit} OFFSET ${page.offset}
    `);
    const countResult = pageResult.rows.length === 0
      ? await this.db.execute(sql`${movements} SELECT count(*)::int AS total FROM filtered`)
      : undefined;
    const total = Number(pageResult.rows[0]?.total ?? countResult?.rows[0]?.total);
    if (!Number.isFinite(total)) {
      throw new Error('Inventory movement count query returned an invalid total');
    }
    const items = pageResult.rows.map((row) => {
      const values = row as Record<string, unknown>;
      const requiredString = (key: keyof Pick<MovementPageRow, 'date' | 'item' | 'source' | 'remarks'>) => {
        const value = values[key];
        if (typeof value !== 'string') {
          throw new Error(`Invalid ${key} returned for inventory movement`);
        }
        return value;
      };
      const requiredNumber = (key: keyof Pick<MovementPageRow, 'quantityIn' | 'quantityOut' | 'balance'>) => {
        const value = Number(values[key]);
        if (!Number.isFinite(value)) {
          throw new Error(`Invalid ${key} returned for inventory movement`);
        }
        return value;
      };
      return {
        date: requiredString('date'),
        item: requiredString('item'),
        quantityIn: requiredNumber('quantityIn'),
        quantityOut: requiredNumber('quantityOut'),
        source: requiredString('source'),
        remarks: requiredString('remarks'),
        balance: requiredNumber('balance'),
      };
    });
    return {
      items,
      total,
      page: page.page,
      limit: page.limit,
      totalPages: Math.ceil(total / page.limit),
    };
  }

  async getMovements(
    userId: string,
    paginationQuery: PaginationQueryDto = {},
  ): Promise<InventoryMovement[] | PaginatedResult<InventoryMovement>> {
    const roundId = await getActiveRoundId(this.db, userId);
    const pagination = getPagination(paginationQuery);
    if (pagination) {
      return this.getMovementPage(userId, roundId, paginationQuery, pagination);
    }

    const [proc, prod, sal, exp] = await Promise.all([
      this.db.query.procurementOrders.findMany({
        where: and(eq(procurementOrders.user_id, userId), eq(procurementOrders.round_id, roundId)),
      }),
      this.db.query.productionBatches.findMany({
        where: and(eq(productionBatches.user_id, userId), eq(productionBatches.round_id, roundId)),
      }),
      this.db.query.sales.findMany({ where: and(eq(sales.user_id, userId), eq(sales.round_id, roundId)) }),
      this.db.query.expenses.findMany({ where: and(eq(expenses.user_id, userId), eq(expenses.round_id, roundId)) }),
    ]);

    const movements: InventoryMovement[] = [];

    // Maize from Procurement
    proc.forEach((p) =>
      movements.push({
        date: toLocalDateString(p.delivery_date),
        item: 'Maize',
        quantityIn: Number(p.quantity_of_maize) * 1000,
        quantityOut: 0,
        source: 'Procurement',
        remarks: `Procured ${p.quantity_of_maize} tons (${Number(p.quantity_of_maize) * 1000} kg) from ${p.supplier}`,
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
      const branQuantity = Number(p.bran_quantity || 0);
      movements.push({
        date: localDate,
        item: 'Bran (sacks)',
        quantityIn: branQuantity,
        quantityOut: 0,
        source: 'Production',
        remarks: `Produced ${branQuantity} bran sacks`,
      });
      ([5, 10, 25] as const).forEach((size) => {
        const count = p[`flour_sacks_${size}kg`];
        if (!count) return;
        movements.push({
          date: localDate,
          item: sackItem(size),
          quantityIn: 0,
          quantityOut: Number(count),
          source: 'Production',
          remarks: `Packaged flour in ${count} ${size} kg sacks`,
        });
      });
    });

    // Sales
    sal.forEach((s) => {
      const isBran = s.product_type.toLowerCase() === 'bran';
      const quantity = isBran ? s.sack_count : s.sack_count * (s.sack_size ?? 0);
      movements.push({
        date: toLocalDateString(s.date),
        item: isBran ? 'Bran (sacks)' : 'Flour',
        quantityIn: 0,
        quantityOut: quantity,
        source: 'Sales',
        remarks: isBran
          ? `Sold ${s.sack_count} bran sacks to ${s.customer_name}`
          : `Sold ${s.sack_count} ${s.sack_size} kg flour sacks (${quantity} kg) to ${s.customer_name}`,
      });
    });

    movements.sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        a.source.localeCompare(b.source) ||
        a.item.localeCompare(b.item) ||
        a.remarks.localeCompare(b.remarks),
    );

    // Running balance per item
    const balances: Record<string, number> = {};
    movements.forEach((m) => {
      balances[m.item] = (balances[m.item] || 0) + (m.quantityIn - m.quantityOut);
      m.balance = balances[m.item];
    });

    const filtered = movements.filter((movement) => {
      const itemMatches =
        !paginationQuery.item ||
        paginationQuery.item === 'All' ||
        (paginationQuery.item === 'Bran'
          ? movement.item.toLowerCase().startsWith('bran')
          : movement.item.toLowerCase() === paginationQuery.item.toLowerCase());
      const sourceMatches =
        !paginationQuery.source ||
        paginationQuery.source === 'All' ||
        movement.source.toLowerCase() === paginationQuery.source.toLowerCase();
      return itemMatches && sourceMatches;
    });
    return filtered;
  }

  async getDashboardSummary(userId: string, today: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const [productionTotals] = await this.db
      .select({
        maize: sql<string>`coalesce(sum(${productionBatches.maize_quantity}), 0)::text`,
        flour: sql<string>`coalesce(sum(${productionBatches.flour_output}), 0)::text`,
        bran: sql<string>`coalesce(sum(${productionBatches.bran_quantity}), 0)::text`,
        sacks5: sql<string>`coalesce(sum(${productionBatches.flour_sacks_5kg}), 0)::text`,
        sacks10: sql<string>`coalesce(sum(${productionBatches.flour_sacks_10kg}), 0)::text`,
        sacks25: sql<string>`coalesce(sum(${productionBatches.flour_sacks_25kg}), 0)::text`,
      })
      .from(productionBatches)
      .where(and(eq(productionBatches.user_id, userId), eq(productionBatches.round_id, roundId)));

    const [procurementTotals] = await this.db
      .select({
        maize: sql<string>`coalesce(sum(${procurementOrders.quantity_of_maize} * 1000), 0)::text`,
      })
      .from(procurementOrders)
      .where(and(eq(procurementOrders.user_id, userId), eq(procurementOrders.round_id, roundId)));

    const [salesTotals] = await this.db
      .select({
        flour: sql<string>`coalesce(sum(case when lower(${sales.product_type}) = 'flour' then ${sales.sack_count} * ${sales.sack_size} else 0 end), 0)::text`,
        bran: sql<string>`coalesce(sum(case when lower(${sales.product_type}) = 'bran' then ${sales.sack_count} else 0 end), 0)::text`,
        revenueToday: sql<string>`coalesce(sum(case when ${sales.date} = ${today} then ${sales.total_amount} else 0 end), 0)::text`,
        flourSacks5: sql<string>`coalesce(sum(case when lower(${sales.product_type}) = 'flour' and ${sales.sack_size} = 5 then ${sales.sack_count} else 0 end), 0)::text`,
        flourSacks10: sql<string>`coalesce(sum(case when lower(${sales.product_type}) = 'flour' and ${sales.sack_size} = 10 then ${sales.sack_count} else 0 end), 0)::text`,
        flourSacks25: sql<string>`coalesce(sum(case when lower(${sales.product_type}) = 'flour' and ${sales.sack_size} = 25 then ${sales.sack_count} else 0 end), 0)::text`,
      })
      .from(sales)
      .where(and(eq(sales.user_id, userId), eq(sales.round_id, roundId)));

    const sackPurchases = await this.db
      .select({
        size: expenses.sack_size,
        quantity: sql<string>`coalesce(sum(${expenses.unit_value}), 0)::text`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.user_id, userId),
          eq(expenses.round_id, roundId),
          sql`lower(${expenses.category}) = 'sacks'`,
        ),
      )
      .groupBy(expenses.sack_size);
    const purchasedBySize = new Map(
      sackPurchases.map((row) => [row.size, Number(row.quantity)]),
    );

    const totalMaize = Number(productionTotals.maize);
    const totalFlour = Number(productionTotals.flour);
    const totalBran = Number(productionTotals.bran);
    const sacks5 = Number(productionTotals.sacks5);
    const sacks10 = Number(productionTotals.sacks10);
    const sacks25 = Number(productionTotals.sacks25);
    const branSold = Number(salesTotals.bran);
    const sackProductionBalances = [
      {
        size: 5,
        produced: sacks5,
        sold: Number(salesTotals.flourSacks5),
        remaining: sacks5 - Number(salesTotals.flourSacks5),
      },
      {
        size: 10,
        produced: sacks10,
        sold: Number(salesTotals.flourSacks10),
        remaining: sacks10 - Number(salesTotals.flourSacks10),
      },
      {
        size: 25,
        produced: sacks25,
        sold: Number(salesTotals.flourSacks25),
        remaining: sacks25 - Number(salesTotals.flourSacks25),
      },
    ] as const;

    return {
      stats: {
        totalMaize,
        totalFlour,
        totalBran,
        efficiency: totalMaize > 0 ? ((totalFlour / totalMaize) * 100).toFixed(2) : 0,
        totalRevenue: Number(salesTotals.revenueToday),
      },
      stocks: {
        maize: Number(procurementTotals.maize) - totalMaize,
        flour: totalFlour - Number(salesTotals.flour),
        bran: totalBran - branSold,
        sacks5kg: (purchasedBySize.get(5) ?? 0) - sacks5,
        sacks10kg: (purchasedBySize.get(10) ?? 0) - sacks10,
        sacks25kg: (purchasedBySize.get(25) ?? 0) - sacks25,
      },
      sackProductionBalances,
    };
  }

  async getRecentActivities(userId: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const page = await this.getMovementPage(
      userId,
      roundId,
      { page: 1, limit: 6 },
      { page: 1, limit: 6, offset: 0 },
      true,
    );
    return page.items.map(({ date, remarks, source }) => ({ date, remarks, source }));
  }
}
