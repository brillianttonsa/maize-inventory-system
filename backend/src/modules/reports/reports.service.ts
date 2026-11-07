import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import {
  productionBatches,
  sales,
  procurementOrders,
  expenses,
  operationalCosts,
  roundSackOpeningBalances,
  type ProductionBatch,
  type Sale,
} from '../../db/schema';
import { getActiveRoundId } from '../../common/rounds';
import { ReportType } from './dto/generate-report.dto';

function convertToCSV(data: Record<string, any>[], headers: string[]): string {
  const csvHeaders = headers.join(',');
  const csvRows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header] ?? '';
        if (
          typeof value === 'string' &&
          (value.includes(',') || value.includes('"') || value.includes('\n'))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(','),
  );
  return [csvHeaders, ...csvRows].join('\n');
}

function formatReportDate(value: string | Date | null | undefined): string {
  if (!value) return '';
  const date = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00Z`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(date);
}

function calculateSackProductionBalances(
  batches: ProductionBatch[],
  salesRows: Sale[],
) {
  return ([5, 10, 25] as const).map((size) => {
    const produced = batches.reduce(
      (sum, batch) => sum + Number(batch[`flour_sacks_${size}kg`] || 0),
      0,
    );
    const sold = salesRows
      .filter(
        (sale) =>
          sale.product_type.toLowerCase() === 'flour' && sale.sack_size === size,
      )
      .reduce((sum, sale) => sum + Number(sale.sack_count || 0), 0);
    return { size, produced, sold, remaining: produced - sold };
  });
}

@Injectable()
export class ReportsService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  // ---------- CSV report: Production ----------
  private async generateProductionReport(userId: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const batches = await this.db.query.productionBatches.findMany({
      where: and(eq(productionBatches.user_id, userId), eq(productionBatches.round_id, roundId)),
    });

    if (batches.length === 0) {
      return {
        csv: 'No production data available',
        summary: {
          totalBatches: 0,
          totalMaizeProcessed: 0,
          totalFlourProduced: 0,
          totalBranProduced: 0,
          averageEfficiency: '0%',
        },
      };
    }

    const summary: Record<string, any> = {
      totalBatches: batches.length,
      totalMaizeProcessed: batches.reduce((s, b) => s + Number(b.maize_quantity || 0), 0),
      totalFlourProduced: batches.reduce((s, b) => s + Number(b.flour_output || 0), 0),
      totalBranProduced: batches.reduce((s, b) => s + Number(b.bran_quantity || 0), 0),
    };

    const totalEfficiency = batches.reduce((sum, b) => {
      const maizeQuantity = Number(b.maize_quantity);
      if (maizeQuantity > 0) {
        return sum + (b.flour_output / maizeQuantity) * 100;
      }
      return sum;
    }, 0);
    summary.averageEfficiency = `${(totalEfficiency / batches.length).toFixed(2)}%`;

    const csvData = batches.map((batch) => ({
      Date: formatReportDate(batch.date),
      'Maize Quantity (kg)': batch.maize_quantity,
      'Flour Output (kg)': batch.flour_output,
      'Bran Output (sacks)': batch.bran_quantity,
      'Efficiency (%)':
        Number(batch.maize_quantity) > 0
          ? ((batch.flour_output / Number(batch.maize_quantity)) * 100).toFixed(2)
          : '0',
    }));

    const headers = [
      'Date', 'Maize Quantity (kg)', 'Flour Output (kg)', 'Bran Output (sacks)',
      'Efficiency (%)',
    ];
    const csv = convertToCSV(csvData, headers);

    const summaryCSV = `\n\n=== SUMMARY ===\nTotal Batches,${summary.totalBatches}\nTotal Maize Processed (kg),${summary.totalMaizeProcessed}\nTotal Flour Produced (kg),${summary.totalFlourProduced}\nTotal Bran Produced (sacks),${summary.totalBranProduced}\nAverage Efficiency,${summary.averageEfficiency}`;

    return { csv: csv + summaryCSV, summary };
  }

  // ---------- CSV report: Sales ----------
  private async generateSalesReport(userId: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const [salesRows, batches] = await Promise.all([
      this.db.query.sales.findMany({ where: and(eq(sales.user_id, userId), eq(sales.round_id, roundId)) }),
      this.db.query.productionBatches.findMany({
        where: and(eq(productionBatches.user_id, userId), eq(productionBatches.round_id, roundId)),
      }),
    ]);

    if (salesRows.length === 0) {
      return {
        csv: 'No sales data available',
        summary: {
          totalOrders: 0,
          totalRevenue: 0,
          totalFlourSales: 0,
          totalBranSales: 0,
          averageOrderValue: 0,
        },
      };
    }

    const summary: Record<string, any> = {
      totalOrders: salesRows.length,
      totalRevenue: salesRows.reduce((s, r) => s + Number(r.total_amount || 0), 0),
      totalFlourSales: salesRows
        .filter((r) => r.product_type === 'flour')
        .reduce((s, r) => s + r.sack_count * Number(r.sack_size || 0), 0),
      totalBranSales: salesRows
        .filter((r) => r.product_type === 'bran')
        .reduce((s, r) => s + r.sack_count, 0),
    };
    summary.averageOrderValue = (summary.totalRevenue / salesRows.length).toFixed(2);

    const sackBalances = calculateSackProductionBalances(batches, salesRows);

    const csvData = salesRows.map((sale) => ({
      Date: formatReportDate(sale.date),
      'Customer Name': sale.customer_name,
      'Customer Contact': sale.customer_contact,
      'Product Type': sale.product_type,
      'Sack Count': sale.sack_count,
      'Sack Size (kg)': sale.sack_size,
      'Price per Sack': sale.price_per_sack,
      'Delivery Cost': sale.delivery_cost,
      'Total Amount': sale.total_amount,
      'Delivery Address': sale.delivery_address,
    }));

    const headers = [
      'Date', 'Customer Name', 'Customer Contact', 'Product Type',
      'Sack Count', 'Sack Size (kg)', 'Price per Sack', 'Delivery Cost', 'Total Amount',
      'Delivery Address',
    ];
    const csv = convertToCSV(csvData, headers);

    const summaryCSV = `\n\n=== SUMMARY ===\nTotal Orders,${summary.totalOrders}\nTotal Revenue,${summary.totalRevenue}\nTotal Flour Sales (kg),${summary.totalFlourSales}\nTotal Bran Sales (sacks),${summary.totalBranSales}\nAverage Order Value,${summary.averageOrderValue}\n\n=== SACK PRODUCTION VS SALES ===\nSack Size,Produced,Sold,Remaining\n${sackBalances.map((sack) => `${sack.size} kg,${sack.produced},${sack.sold},${sack.remaining}`).join('\n')}`;

    return { csv: csv + summaryCSV, summary: { ...summary, sackBalances } };
  }

  // ---------- CSV report: Procurement ----------
  private async generateProcurementReport(userId: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const orders = await this.db.query.procurementOrders.findMany({
      where: and(eq(procurementOrders.user_id, userId), eq(procurementOrders.round_id, roundId)),
    });

    if (orders.length === 0) {
      return {
        csv: 'No procurement data available',
        summary: { totalOrders: 0, totalQuantityTons: 0, totalCost: 0, averageTotalCostPerKg: 0 },
      };
    }

    const summary: Record<string, any> = {
      totalOrders: orders.length,
      totalQuantityTons: orders.reduce((s, order) => s + Number(order.quantity_of_maize || 0), 0),
      totalCost: orders.reduce((s, o) => s + Number(o.total_cost || 0), 0),
      totalTransportCost: orders.reduce((s, o) => s + Number(o.transport_cost || 0), 0),
    };
    summary.averageTotalCostPerKg = summary.totalQuantityTons
      ? (summary.totalCost / (summary.totalQuantityTons * 1000)).toFixed(2)
      : '0.00';

    const supplierMap: Record<string, { orders: number; totalQuantity: number; totalCost: number }> = {};
    orders.forEach((order) => {
      if (!supplierMap[order.supplier]) {
        supplierMap[order.supplier] = { orders: 0, totalQuantity: 0, totalCost: 0 };
      }
      supplierMap[order.supplier].orders++;
      supplierMap[order.supplier].totalQuantity += Number(order.quantity_of_maize || 0);
      supplierMap[order.supplier].totalCost += Number(order.total_cost || 0);
    });
    const supplierStats = Object.entries(supplierMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalCost - a.totalCost);

    const csvData = orders.map((order) => ({
      Supplier: order.supplier,
      'Quantity (tons)': order.quantity_of_maize,
      'Actual Maize Purchase': order.maize_purchase_cost,
      'Transport Cost': order.transport_cost,
      'Total Cost': order.total_cost,
      'Average Cost per kg': order.average_cost_per_kg,
      'Delivery Date': formatReportDate(order.delivery_date),
    }));

    const headers = [
      'Supplier', 'Quantity (tons)', 'Actual Maize Purchase',
      'Transport Cost', 'Total Cost', 'Average Cost per kg', 'Delivery Date',
    ];
    const csv = convertToCSV(csvData, headers);

    const summaryCSV = `\n\n=== SUMMARY ===\nTotal Orders,${summary.totalOrders}\nTotal Quantity (tons),${summary.totalQuantityTons}\nTotal Cost,${summary.totalCost}\nTotal Transport Cost,${summary.totalTransportCost}\nAverage Total Cost per kg,${summary.averageTotalCostPerKg}\n\n=== SUPPLIER STATISTICS ===\nSupplier,Orders,Total Quantity (tons),Total Cost\n${supplierStats.map((s) => `${s.name},${s.orders},${s.totalQuantity},${s.totalCost}`).join('\n')}`;

    return { csv: csv + summaryCSV, summary: { ...summary, supplierStats } };
  }

  // ---------- CSV report: Financial ----------
  private async generateFinancialReport(userId: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const [salesRows, expenseRows, orders, costRows] = await Promise.all([
      this.db.query.sales.findMany({ where: and(eq(sales.user_id, userId), eq(sales.round_id, roundId)) }),
      this.db.query.expenses.findMany({ where: and(eq(expenses.user_id, userId), eq(expenses.round_id, roundId)) }),
      this.db.query.procurementOrders.findMany({ where: and(eq(procurementOrders.user_id, userId), eq(procurementOrders.round_id, roundId)) }),
      this.db.query.operationalCosts.findMany({ where: and(eq(operationalCosts.user_id, userId), eq(operationalCosts.round_id, roundId)) }),
    ]);

    const totalRevenue = salesRows.reduce((s, r) => s + Number(r.total_amount || 0), 0);
    const totalExpenses = expenseRows.reduce((s, e) => s + Number(e.total_amount || 0), 0);
    const totalProcurementCost = orders.reduce((s, o) => s + Number(o.total_cost || 0), 0);
    const totalCosts = totalExpenses + totalProcurementCost;
    const totalActualOperationalCost = costRows.reduce((sum, item) => sum + Number(item.total_amount), 0);
    const profit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(2) : '0';

    const expenseByCategory: Record<string, number> = {};
    expenseRows.forEach((exp) => {
      expenseByCategory[exp.category] = (expenseByCategory[exp.category] || 0) + Number(exp.total_amount || 0);
    });

    const revenueByProduct: Record<string, number> = {};
    salesRows.forEach((sale) => {
      revenueByProduct[sale.product_type] =
        (revenueByProduct[sale.product_type] || 0) + Number(sale.total_amount || 0);
    });

    const summary = {
      totalRevenue,
      totalExpenses,
      totalProcurementCost,
      totalCosts,
      totalActualOperationalCost,
      profit,
      profitMargin: `${profitMargin}%`,
      expenseByCategory,
      revenueByProduct,
    };

    const csvLines = [
      '=== FINANCIAL SUMMARY REPORT ===',
      '',
      'REVENUE',
      'Source,Amount',
      `Total Sales Revenue,${totalRevenue}`,
      ...Object.entries(revenueByProduct).map(
        ([product, amount]) => `${product.charAt(0).toUpperCase() + product.slice(1)} Sales,${amount}`,
      ),
      '',
      'EXPENSES',
      'Category,Amount',
      ...Object.entries(expenseByCategory).map(([cat, amount]) => `${cat},${amount}`),
      `Total Operating Expenses,${totalExpenses}`,
      `Separately Recorded Operational Costs,${totalActualOperationalCost}`,
      '',
      'PROCUREMENT',
      `Total Procurement Cost,${totalProcurementCost}`,
      '',
      'SUMMARY',
      'Item,Amount',
      `Total Revenue,${totalRevenue}`,
      `Total Costs,${totalCosts}`,
      `Profit,${profit}`,
      `Profit Margin,${profitMargin}%`,
    ];

    return { csv: csvLines.join('\n'), summary };
  }

  // ---------- Dispatcher used by POST /reports/generate ----------
  async generateReport(userId: string, type: ReportType) {
    const titles: Record<ReportType, string> = {
      production: 'Production Report',
      sales: 'Sales Report',
      procurement: 'Procurement Report',
      financial: 'Financial Summary',
    };

    const generators: Record<ReportType, () => Promise<{ csv: string; summary: any }>> = {
      production: () => this.generateProductionReport(userId),
      sales: () => this.generateSalesReport(userId),
      procurement: () => this.generateProcurementReport(userId),
      financial: () => this.generateFinancialReport(userId),
    };

    const reportData = await generators[type]();
    const reportTitle = titles[type];
    const filename = `${type}_report_${new Date().toISOString().split('T')[0]}.csv`;
    const headerCSV = `=== ${reportTitle.toUpperCase()} ===\nGenerated on: ${formatReportDate(new Date())}\n\n`;

    return { filename, csv: headerCSV + reportData.csv };
  }

  // ---------- Comprehensive CSV: all transactions and summary reviews ----------
  async generateComprehensiveReport(userId: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const [batches, salesRows, orders, expenseRows, costRows, openingSacks] = await Promise.all([
      this.db.query.productionBatches.findMany({ where: and(eq(productionBatches.user_id, userId), eq(productionBatches.round_id, roundId)) }),
      this.db.query.sales.findMany({ where: and(eq(sales.user_id, userId), eq(sales.round_id, roundId)) }),
      this.db.query.procurementOrders.findMany({ where: and(eq(procurementOrders.user_id, userId), eq(procurementOrders.round_id, roundId)) }),
      this.db.query.expenses.findMany({ where: and(eq(expenses.user_id, userId), eq(expenses.round_id, roundId)) }),
      this.db.query.operationalCosts.findMany({ where: and(eq(operationalCosts.user_id, userId), eq(operationalCosts.round_id, roundId)) }),
      this.db.query.roundSackOpeningBalances.findMany({ where: and(eq(roundSackOpeningBalances.user_id, userId), eq(roundSackOpeningBalances.round_id, roundId)) }),
    ]);

    const productionSummary: Record<string, any> = {
      totalBatches: batches.length,
      totalMaizeProcessed: batches.reduce((s, b) => s + Number(b.maize_quantity || 0), 0),
      totalFlourProduced: batches.reduce((s, b) => s + Number(b.flour_output || 0), 0),
      totalBranProduced: batches.reduce((s, b) => s + Number(b.bran_quantity || 0), 0),
    };
    const totalEfficiency = batches.reduce((sum, b) => {
      const maizeQuantity = Number(b.maize_quantity);
      if (maizeQuantity > 0) return sum + (b.flour_output / maizeQuantity) * 100;
      return sum;
    }, 0);
    productionSummary.averageEfficiency =
      batches.length > 0 ? (totalEfficiency / batches.length).toFixed(2) : 0;

    const salesSummary: Record<string, any> = {
      totalOrders: salesRows.length,
      totalRevenue: salesRows.reduce((s, r) => s + Number(r.total_amount || 0), 0),
      totalFlourSales: salesRows
        .filter((r) => r.product_type === 'flour')
        .reduce((s, r) => s + r.sack_count * Number(r.sack_size || 0), 0),
      totalBranSales: salesRows
        .filter((r) => r.product_type === 'bran')
        .reduce((s, r) => s + r.sack_count, 0),
    };
    salesSummary.averageOrderValue =
      salesRows.length > 0 ? (salesSummary.totalRevenue / salesRows.length).toFixed(2) : 0;

    const sackBalances = calculateSackProductionBalances(batches, salesRows);

    const procurementSummary: Record<string, any> = {
      totalOrders: orders.length,
      totalQuantityTons: orders.reduce((s, o) => s + Number(o.quantity_of_maize || 0), 0),
      totalCost: orders.reduce((s, o) => s + Number(o.total_cost || 0), 0),
      totalTransportCost: orders.reduce((s, o) => s + Number(o.transport_cost || 0), 0),
    };
    procurementSummary.averageTotalCostPerKg = procurementSummary.totalQuantityTons
      ? (procurementSummary.totalCost / (procurementSummary.totalQuantityTons * 1000)).toFixed(2)
      : '0.00';

    const supplierMap: Record<string, { orders: number; totalQuantity: number; totalCost: number }> = {};
    orders.forEach((order) => {
      if (!supplierMap[order.supplier]) {
        supplierMap[order.supplier] = { orders: 0, totalQuantity: 0, totalCost: 0 };
      }
      supplierMap[order.supplier].orders++;
      supplierMap[order.supplier].totalQuantity += Number(order.quantity_of_maize || 0);
      supplierMap[order.supplier].totalCost += Number(order.total_cost || 0);
    });
    const supplierStats = Object.entries(supplierMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalCost - a.totalCost);

    const expensesSummary = {
      totalExpenses: expenseRows.reduce((s, e) => s + Number(e.total_amount || 0), 0),
      totalCount: expenseRows.length,
    };
    const operationalCostSummary = {
      unitsUsed: costRows.reduce((sum, item) => sum + Number(item.units_used), 0),
      totalAmount: costRows.reduce((sum, item) => sum + Number(item.total_amount), 0),
    };
    const expenseByCategory: Record<string, number> = {};
    expenseRows.forEach((exp) => {
      expenseByCategory[exp.category] = (expenseByCategory[exp.category] || 0) + Number(exp.total_amount || 0);
    });

    const totalRevenue = salesSummary.totalRevenue;
    const totalExpenses = expensesSummary.totalExpenses;
    const totalProcurementCost = procurementSummary.totalCost;
    const totalCosts = totalExpenses + totalProcurementCost;
    const profit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(2) : '0';

    const revenueByProduct: Record<string, number> = {};
    salesRows.forEach((sale) => {
      revenueByProduct[sale.product_type] =
        (revenueByProduct[sale.product_type] || 0) + Number(sale.total_amount || 0);
    });

    const section = (title: string, rows: Record<string, any>[], headers: string[]) =>
      [`=== ${title} ===`, rows.length ? convertToCSV(rows, headers) : 'No transactions recorded'].join('\n');

    const summaryRows = [
      { Category: 'Financial', Metric: 'Total Revenue (TSh)', Value: totalRevenue },
      { Category: 'Financial', Metric: 'Operating Expenses (TSh)', Value: totalExpenses },
      { Category: 'Financial', Metric: 'Procurement Cost (TSh)', Value: totalProcurementCost },
      { Category: 'Financial', Metric: 'Total Costs (TSh)', Value: totalCosts },
      { Category: 'Financial', Metric: 'Profit (TSh)', Value: profit },
      { Category: 'Financial', Metric: 'Profit Margin (%)', Value: profitMargin },
      { Category: 'Production', Metric: 'Total Batches', Value: productionSummary.totalBatches },
      { Category: 'Production', Metric: 'Maize Processed (kg)', Value: productionSummary.totalMaizeProcessed },
      { Category: 'Production', Metric: 'Flour Produced (kg)', Value: productionSummary.totalFlourProduced },
      { Category: 'Production', Metric: 'Bran Produced (sacks)', Value: productionSummary.totalBranProduced },
      { Category: 'Production', Metric: 'Average Efficiency (%)', Value: productionSummary.averageEfficiency },
      { Category: 'Sales', Metric: 'Total Orders', Value: salesSummary.totalOrders },
      { Category: 'Sales', Metric: 'Flour Sold (kg)', Value: salesSummary.totalFlourSales },
      { Category: 'Sales', Metric: 'Bran Sold (sacks)', Value: salesSummary.totalBranSales },
      { Category: 'Procurement', Metric: 'Total Orders', Value: procurementSummary.totalOrders },
      { Category: 'Procurement', Metric: 'Maize Purchased (tons)', Value: procurementSummary.totalQuantityTons },
      { Category: 'Expenses', Metric: 'Number of Transactions', Value: expensesSummary.totalCount },
      { Category: 'Operational Costs', Metric: 'Electricity Units Used', Value: operationalCostSummary.unitsUsed },
      { Category: 'Operational Costs', Metric: 'Actual Electricity Operational Cost (TSh)', Value: operationalCostSummary.totalAmount },
    ];

    const csv = [
      '=== COMPREHENSIVE BUSINESS REPORT ===',
      `Generated On,${formatReportDate(new Date())}`,
      '',
      section('SUMMARY REVIEW', summaryRows, ['Category', 'Metric', 'Value']),
      '',
      section('PRODUCTION TRANSACTIONS', batches.map((batch) => ({
        Date: formatReportDate(batch.date), 'Maize Quantity (kg)': batch.maize_quantity,
        'Flour 5 kg Sacks': batch.flour_sacks_5kg, 'Flour 10 kg Sacks': batch.flour_sacks_10kg,
        'Flour 25 kg Sacks': batch.flour_sacks_25kg, 'Flour Output (kg)': batch.flour_output,
        'Bran Quantity (sacks)': batch.bran_quantity,
      })), ['Date', 'Maize Quantity (kg)', 'Flour 5 kg Sacks', 'Flour 10 kg Sacks', 'Flour 25 kg Sacks', 'Flour Output (kg)', 'Bran Quantity (sacks)']),
      '',
      section('SALES TRANSACTIONS', salesRows.map((sale) => ({
        Date: formatReportDate(sale.date), Customer: sale.customer_name, Contact: sale.customer_contact,
        Product: sale.product_type, 'Sack Count': sale.sack_count,
        'Sack Size (kg)': sale.sack_size, 'Price per Sack (TSh)': sale.price_per_sack,
        'Delivery Cost (TSh)': sale.delivery_cost, 'Total Amount (TSh)': sale.total_amount,
        'Delivery Address': sale.delivery_address,
      })), ['Date', 'Customer', 'Contact', 'Product', 'Sack Count', 'Sack Size (kg)', 'Price per Sack (TSh)', 'Delivery Cost (TSh)', 'Total Amount (TSh)', 'Delivery Address']),
      '',
      section('PROCUREMENT TRANSACTIONS', orders.map((order) => ({
        Supplier: order.supplier, 'Quantity (tons)': order.quantity_of_maize,
        'Actual Maize Purchase (TSh)': order.maize_purchase_cost, 'Transport Cost (TSh)': order.transport_cost,
        'Total Cost (TSh)': order.total_cost, 'Average Cost per kg (TSh)': order.average_cost_per_kg,
        'Delivery Date': formatReportDate(order.delivery_date),
      })), ['Supplier', 'Quantity (tons)', 'Actual Maize Purchase (TSh)', 'Transport Cost (TSh)', 'Total Cost (TSh)', 'Average Cost per kg (TSh)', 'Delivery Date']),
      '',
      section('EXPENSE TRANSACTIONS', expenseRows.map((expense) => ({
        Date: formatReportDate(expense.date), Category: expense.category, 'Quantity / Units': expense.unit_value,
        'Unit Cost (TSh)': expense.unit_cost, 'Sack Size (kg)': expense.sack_size, 'Total Amount (TSh)': expense.total_amount,
        Notes: expense.notes,
      })), ['Date', 'Category', 'Quantity / Units', 'Unit Cost (TSh)', 'Sack Size (kg)', 'Total Amount (TSh)', 'Notes']),
      '',
      section('ROUND OPENING SACK BALANCES', openingSacks.map((opening) => ({
        'Sack Size (kg)': opening.sack_size,
        'Quantity Carried': opening.quantity,
        'Source Round': opening.source_round_name,
      })), ['Sack Size (kg)', 'Quantity Carried', 'Source Round']),
      '',
      section('ELECTRICITY OPERATIONAL COSTS', costRows.map((cost) => ({
        Date: formatReportDate(cost.date),
        Operation: cost.operation,
        'Units at Start': cost.starting_units,
        'Units Used': cost.units_used,
        'Units Remaining': cost.remaining_units,
        'Actual Cost (TSh)': cost.total_amount,
        Notes: cost.notes,
      })), ['Date', 'Operation', 'Units at Start', 'Units Used', 'Units Remaining', 'Actual Cost (TSh)', 'Notes']),
      '',
      section('SACK PRODUCTION VS SALES', sackBalances.map((sack) => ({
        'Sack Size': `${sack.size} kg`, Produced: sack.produced, Sold: sack.sold, Remaining: sack.remaining,
      })), ['Sack Size', 'Produced', 'Sold', 'Remaining']),
      '',
      section('SUPPLIER REVIEW', supplierStats.map((supplier) => ({ Supplier: supplier.name, Orders: supplier.orders, 'Total Quantity (tons)': supplier.totalQuantity, 'Total Cost (TSh)': supplier.totalCost })), ['Supplier', 'Orders', 'Total Quantity (tons)', 'Total Cost (TSh)']),
      '',
      section('EXPENSES BY CATEGORY REVIEW', Object.entries(expenseByCategory).map(([category, amount]) => ({ Category: category, 'Amount (TSh)': amount })), ['Category', 'Amount (TSh)']),
      '',
      section('REVENUE BY PRODUCT REVIEW', Object.entries(revenueByProduct).map(([product, amount]) => ({ Product: product, 'Revenue (TSh)': amount })), ['Product', 'Revenue (TSh)']),
    ].join('\n');

    return {
      filename: `comprehensive_report_${new Date().toISOString().split('T')[0]}.csv`,
      csv,
    };
  }

  /** Downloads a full archive, then permanently clears this user's operations. */
  async archiveAndReset(userId: string) {
    const roundId = await getActiveRoundId(this.db, userId);
    const archive = await this.generateComprehensiveReport(userId);

    await this.db.transaction(async (tx) => {
      await tx.delete(sales).where(and(eq(sales.user_id, userId), eq(sales.round_id, roundId)));
      await tx.delete(operationalCosts).where(and(eq(operationalCosts.user_id, userId), eq(operationalCosts.round_id, roundId)));
      await tx.delete(expenses).where(and(eq(expenses.user_id, userId), eq(expenses.round_id, roundId)));
      await tx.delete(roundSackOpeningBalances).where(and(eq(roundSackOpeningBalances.user_id, userId), eq(roundSackOpeningBalances.round_id, roundId)));
      await tx.delete(productionBatches).where(and(eq(productionBatches.user_id, userId), eq(productionBatches.round_id, roundId)));
      await tx.delete(procurementOrders).where(and(eq(procurementOrders.user_id, userId), eq(procurementOrders.round_id, roundId)));
    });

    return {
      filename: `maize_inventory_archive_${new Date().toISOString().slice(0, 10)}.csv`,
      csv: archive.csv,
    };
  }
}
