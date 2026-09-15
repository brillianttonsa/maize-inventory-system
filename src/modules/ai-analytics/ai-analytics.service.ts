import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import { sales, expenses, procurementOrders, productionBatches } from '../../db/schema';
import { InventoryService } from '../inventory/inventory.service';
import {
  buildDailySeries,
  fitLinearRegression,
  predictNext,
  toISODate,
  addDays,
  MIN_DATA_POINTS,
} from './lib/regression';

const FORECAST_DAYS = 30;
const LOW_STOCK_THRESHOLD_KG = 100; // flags an item as "low" below this level

@Injectable()
export class AiAnalyticsService {
  constructor(
    @Inject(DB_PROVIDER) private readonly db: DbClient,
    private readonly inventoryService: InventoryService,
  ) {}

  // ---------- Sales forecast ----------

  async predictSales(userId: string) {
    const salesRows = await this.db.query.sales.findMany({ where: eq(sales.user_id, userId) });

    const series = buildDailySeries(
      salesRows.map((s) => ({ date: s.date, value: Number(s.total_amount) })),
    );
    const actual_total_sales = salesRows.reduce((sum, sale) => sum + Number(sale.total_amount), 0);

    if (series.length < MIN_DATA_POINTS) {
      return this.insufficientData({
        predicted_total_sales: 0,
        actual_total_sales,
        data_points: series.length,
        growth_rate: 0,
        forecast: [],
        product_breakdown: {},
      });
    }

    const regression = fitLinearRegression(series.map((p) => p.value));
    const forecast = Array.from({ length: FORECAST_DAYS }, (_, i) => {
      const day = addDays(new Date(), i + 1);
      return {
        date: toISODate(day),
        predicted_sales: Math.round(predictNext(regression, series.length + i)),
      };
    });

    const predicted_total_sales = forecast.reduce((sum, f) => sum + f.predicted_sales, 0);

    // Growth rate: compare the trend's projected next-30-days average to the actual last-30-days average
    const recentActual = series.slice(-FORECAST_DAYS);
    const recentAvg =
      recentActual.reduce((sum, p) => sum + p.value, 0) / (recentActual.length || 1);
    const projectedAvg = predicted_total_sales / FORECAST_DAYS;
    const growth_rate = recentAvg > 0 ? ((projectedAvg - recentAvg) / recentAvg) * 100 : 0;

    // Product breakdown: split the forecast by each product's historical share of revenue
    const totalsByProduct: Record<string, number> = {};
    salesRows.forEach((s) => {
      totalsByProduct[s.product_type] =
        (totalsByProduct[s.product_type] || 0) + Number(s.total_amount);
    });
    const totalRevenue = Object.values(totalsByProduct).reduce((a, b) => a + b, 0) || 1;
    const product_breakdown: Record<string, number> = {};
    Object.entries(totalsByProduct).forEach(([product, amount]) => {
      product_breakdown[product] = Math.round((amount / totalRevenue) * predicted_total_sales);
    });

    return { predicted_total_sales, actual_total_sales, data_points: series.length, growth_rate, forecast, product_breakdown };
  }

  // ---------- Inventory prediction ----------

  async predictInventory(userId: string) {
    const movements = await this.inventoryService.getMovements(userId);

    const datedMovements = [...movements].sort(
      (a, b) => a.date.localeCompare(b.date),
    );

    const items = Array.from(new Set(datedMovements.map((m) => m.item)));
    const earliestDate = datedMovements.length > 0 ? new Date(datedMovements[0].date) : new Date();
    const daysSpan = Math.max(
      1,
      Math.ceil((Date.now() - earliestDate.getTime()) / (1000 * 60 * 60 * 24)),
    );

    const stock_forecast = items.map((item) => {
      const itemMovements = datedMovements.filter((m) => m.item === item);
      const current = itemMovements.reduce(
        (balance, movement) => balance + movement.quantityIn - movement.quantityOut,
        0,
      );
      const netTotal = itemMovements.reduce(
        (sum, m) => sum + (m.quantityIn - m.quantityOut),
        0,
      );
      const dailyNetRate = itemMovements.length > 1 ? netTotal / daysSpan : 0;
      const predicted = Math.max(0, Math.round(current + dailyNetRate * FORECAST_DAYS));

      return { item, current: Math.round(current), predicted };
    });

    const current_total_stock = stock_forecast.reduce((sum, s) => sum + s.current, 0);
    const predicted_stock_level = stock_forecast.reduce((sum, s) => sum + s.predicted, 0);

    const low_stock_items = stock_forecast
      .filter((s) => s.predicted < LOW_STOCK_THRESHOLD_KG)
      .map((s) => ({ name: s.item, quantity: s.predicted }));

    const result = { current_total_stock, predicted_stock_level, stock_forecast, low_stock_items, data_points: datedMovements.length };
    return datedMovements.length < MIN_DATA_POINTS ? this.insufficientData(result) : result;
  }

  // ---------- Yield prediction ----------

  async predictYield(userId: string) {
    const batches = await this.db.query.productionBatches.findMany({
      where: eq(productionBatches.user_id, userId),
      orderBy: (t, { asc }) => asc(t.date),
    });

    const yield_history = batches.map((b) => ({
      date: b.date,
      flour_yield: b.maize_quantity > 0 ? (b.flour_output / b.maize_quantity) * 100 : 0,
      bran_yield: b.maize_quantity > 0 ? (b.bran_output / b.maize_quantity) * 100 : 0,
    }));

    // Weight recent batches more heavily by just averaging the last 30 (or all, if fewer)
    const recent = yield_history.slice(-30);
    const avg = (key: 'flour_yield' | 'bran_yield') =>
      recent.reduce((sum, r) => sum + r[key], 0) / (recent.length || 1);

    const predicted_flour_yield = avg('flour_yield');
    const predicted_bran_yield = avg('bran_yield');
    const production_efficiency = predicted_flour_yield + predicted_bran_yield;

    const efficiency_tips: string[] = [];
    const half = Math.floor(recent.length / 2);
    const earlierAvg =
      recent.slice(0, half).reduce((s, r) => s + r.flour_yield + r.bran_yield, 0) /
      (half || 1);
    const laterAvg =
      recent.slice(half).reduce((s, r) => s + r.flour_yield + r.bran_yield, 0) /
      (recent.length - half || 1);

    if (recent.length >= 4 && laterAvg < earlierAvg - 2) {
      efficiency_tips.push(
        'Overall yield has been trending down recently — worth checking milling equipment calibration.',
      );
    }
    if (production_efficiency < 85) {
      efficiency_tips.push(
        'Combined flour + bran yield is below 85% of input maize — some loss may be avoidable in the milling process.',
      );
    }
    if (efficiency_tips.length === 0) {
      efficiency_tips.push(
        batches.length < MIN_DATA_POINTS
          ? 'Record at least seven production batches for a stronger yield trend.'
          : 'Yield is stable — no action needed based on recent batches.',
      );
    }

    const result = { predicted_flour_yield, predicted_bran_yield, production_efficiency, yield_history, efficiency_tips, data_points: batches.length };
    return batches.length < MIN_DATA_POINTS ? this.insufficientData(result) : result;
  }

  // ---------- Profit prediction ----------

  async predictProfit(userId: string) {
    const [salesRows, procurementRows, expenseRows] = await Promise.all([
      this.db.query.sales.findMany({ where: eq(sales.user_id, userId) }),
      this.db.query.procurementOrders.findMany({ where: eq(procurementOrders.user_id, userId) }),
      this.db.query.expenses.findMany({ where: eq(expenses.user_id, userId) }),
    ]);

    const revenueSeries = buildDailySeries(
      salesRows.map((s) => ({ date: s.date, value: Number(s.total_amount) })),
    );
    const costSeries = buildDailySeries([
      ...procurementRows.map((p) => ({ date: p.delivery_date, value: Number(p.total_cost) })),
      ...expenseRows.map((e) => ({ date: e.date, value: Number(e.amount) })),
    ]);
    const actual_revenue = salesRows.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
    const actual_costs = [...procurementRows, ...expenseRows].reduce(
      (sum, row) => sum + Number('total_cost' in row ? row.total_cost : row.amount),
      0,
    );

    if (revenueSeries.length < MIN_DATA_POINTS || costSeries.length < MIN_DATA_POINTS) {
      return this.insufficientData({
        predicted_revenue: 0,
        predicted_costs: 0,
        predicted_profit: 0,
        actual_revenue,
        actual_costs,
        data_points: Math.min(revenueSeries.length, costSeries.length),
        profit_trend: [],
      });
    }

    const revenueRegression = fitLinearRegression(revenueSeries.map((p) => p.value));
    const costRegression = fitLinearRegression(costSeries.map((p) => p.value));

    const profit_trend = Array.from({ length: FORECAST_DAYS }, (_, i) => {
      const day = addDays(new Date(), i + 1);
      const revenue = Math.round(predictNext(revenueRegression, revenueSeries.length + i));
      const costs = Math.round(predictNext(costRegression, costSeries.length + i));
      return { date: toISODate(day), revenue, costs, profit: revenue - costs };
    });

    const predicted_revenue = profit_trend.reduce((sum, p) => sum + p.revenue, 0);
    const predicted_costs = profit_trend.reduce((sum, p) => sum + p.costs, 0);
    const predicted_profit = predicted_revenue - predicted_costs;

    return { predicted_revenue, predicted_costs, predicted_profit, actual_revenue, actual_costs, data_points: Math.min(revenueSeries.length, costSeries.length), profit_trend };
  }

  // ---------- Alerts (rule-based, not statistical) ----------

  async getAlerts(userId: string) {
    const alerts: Array<{ severity: 'critical' | 'warning' | 'info'; title: string; message: string; action?: string }> = [];

    const [inventory, profit] = await Promise.all([
      this.predictInventory(userId),
      this.predictProfit(userId),
    ]);

    inventory.low_stock_items?.forEach((item: { name: string; quantity: number }) => {
      alerts.push({
        severity: item.quantity <= 0 ? 'critical' : 'warning',
        title: `${item.name} Running Low`,
        message:
          item.quantity <= 0
            ? `${item.name} is projected to run out within 30 days at the current usage rate.`
            : `${item.name} is projected to drop to ${item.quantity} within 30 days.`,
        action: `Consider restocking ${item.name} soon.`,
      });
    });

    if ('insufficient_data' in profit) {
      alerts.push({
        severity: 'info',
        title: 'More financial history needed',
        message: 'Record at least seven days of sales and costs to generate a reliable profit forecast.',
        action: 'Keep recording sales, procurement, and expenses.',
      });
    } else if (profit.predicted_profit < 0) {
      alerts.push({
        severity: 'warning',
        title: 'Projected Loss Ahead',
        message: `Based on current trends, costs are projected to exceed revenue by ${Math.abs(
          Math.round(profit.predicted_profit),
        ).toLocaleString()} over the next 30 days.`,
        action: 'Review expenses and procurement costs, or adjust pricing.',
      });
    }

    return { alerts };
  }

  // ---------- Recommendations (rule-based) ----------

  async getRecommendations(userId: string) {
    const recommendations: Array<{
      priority: 'high' | 'medium' | 'low';
      title: string;
      description: string;
      impact?: string;
    }> = [];

    const procurementRows = await this.db.query.procurementOrders.findMany({
      where: eq(procurementOrders.user_id, userId),
      orderBy: (t, { asc }) => asc(t.delivery_date),
    });

    // Supplier price trend: flag suppliers whose last 3 orders show a rising price per kg
    const bySupplier = new Map<string, typeof procurementRows>();
    procurementRows.forEach((p) => {
      const list = bySupplier.get(p.supplier) || [];
      list.push(p);
      bySupplier.set(p.supplier, list);
    });

    bySupplier.forEach((orders, supplier) => {
      if (orders.length < 3) return;
      const lastThree = orders.slice(-3).map((o) => Number(o.price_per_kg));
      const isRising = lastThree[0] < lastThree[1] && lastThree[1] < lastThree[2];
      if (isRising) {
        recommendations.push({
          priority: 'medium',
          title: `${supplier}'s prices are rising`,
          description: `Price per kg from ${supplier} increased over your last 3 orders (${lastThree
            .map((p) => p.toLocaleString())
            .join(' → ')}). Worth comparing quotes from other suppliers.`,
          impact: 'Potential cost savings on procurement',
        });
      }
    });

    const yieldData = await this.predictYield(userId);
    if (yieldData.production_efficiency && yieldData.production_efficiency < 80) {
      recommendations.push({
        priority: 'high',
        title: 'Production efficiency below target',
        description: `Combined flour and bran yield is averaging ${yieldData.production_efficiency.toFixed(
          1,
        )}% of input maize. Inspecting milling equipment could recover some of that loss.`,
        impact: 'Higher output from the same maize input',
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'low',
        title: 'Operations look steady',
        description: 'No notable cost, supplier, or efficiency issues detected in recent data.',
      });
    }

    return { recommendations };
  }

  private insufficientData<T extends Record<string, any>>(shape: T): T & { insufficient_data: true } {
    return { ...shape, insufficient_data: true };
  }
}
