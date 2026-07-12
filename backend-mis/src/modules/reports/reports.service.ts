import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import {
  productionBatches,
  sales,
  procurementOrders,
  expenses,
  users,
} from '../../db/schema';
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

// Aggregate items by date for chart series
function aggregateByDate(
  items: Record<string, any>[],
  keyMap: Record<string, string>,
  dateKey = 'date',
): Array<{ period: string; [key: string]: any }> {
  const map: Record<string, Record<string, number>> = {};
  items.forEach((item) => {
    const dateObj = new Date(item[dateKey] || item.created_at);
    const localDate = new Date(
      dateObj.getTime() - dateObj.getTimezoneOffset() * 60000,
    );
    const date = localDate.toISOString().split('T')[0];

    if (!map[date]) map[date] = {};
    Object.keys(keyMap).forEach((k) => {
      map[date][k] = (map[date][k] || 0) + parseFloat(item[keyMap[k]] || 0);
    });
  });
  return Object.entries(map).map(([period, values]) => ({ period, ...values }));
}

@Injectable()
export class ReportsService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  // ---------- CSV report: Production ----------
  private async generateProductionReport(userId: string) {
    const batches = await this.db.query.productionBatches.findMany({
      where: eq(productionBatches.user_id, userId),
    });

    if (batches.length === 0) {
      return {
        csv: 'No production data available',
        summary: {
          totalBatches: 0,
          totalMaizeProcessed: 0,
          totalFlourProduced: 0,
          totalBranProduced: 0,
          totalWaterUsed: 0,
          totalElectricityUsed: 0,
          totalSacksUsed: 0,
          averageEfficiency: '0%',
        },
      };
    }

    const summary: Record<string, any> = {
      totalBatches: batches.length,
      totalMaizeProcessed: batches.reduce((s, b) => s + Number(b.maize_quantity || 0), 0),
      totalFlourProduced: batches.reduce((s, b) => s + Number(b.flour_output || 0), 0),
      totalBranProduced: batches.reduce((s, b) => s + Number(b.bran_output || 0), 0),
      totalWaterUsed: batches.reduce((s, b) => s + Number(b.water_usage || 0), 0),
      totalElectricityUsed: batches.reduce((s, b) => s + Number(b.electricity_usage || 0), 0),
      totalSacksUsed: batches.reduce((s, b) => s + Number(b.sacks_used || 0), 0),
    };

    const totalEfficiency = batches.reduce((sum, b) => {
      if (b.maize_quantity > 0) {
        return sum + (b.flour_output / b.maize_quantity) * 100;
      }
      return sum;
    }, 0);
    summary.averageEfficiency = `${(totalEfficiency / batches.length).toFixed(2)}%`;

    const csvData = batches.map((batch) => ({
      'Batch ID': batch.id,
      Date: batch.date,
      'Maize Quantity (kg)': batch.maize_quantity,
      'Flour Output (kg)': batch.flour_output,
      'Bran Output (kg)': batch.bran_output,
      'Water Usage (L)': batch.water_usage,
      'Electricity Usage (kWh)': batch.electricity_usage,
      'Sacks Used': batch.sacks_used,
      'Efficiency (%)':
        batch.maize_quantity > 0
          ? ((batch.flour_output / batch.maize_quantity) * 100).toFixed(2)
          : '0',
      Notes: batch.notes || '',
    }));

    const headers = [
      'Batch ID', 'Date', 'Maize Quantity (kg)', 'Flour Output (kg)', 'Bran Output (kg)',
      'Water Usage (L)', 'Electricity Usage (kWh)', 'Sacks Used', 'Efficiency (%)', 'Notes',
    ];
    const csv = convertToCSV(csvData, headers);

    const summaryCSV = `\n\n=== SUMMARY ===\nTotal Batches,${summary.totalBatches}\nTotal Maize Processed (kg),${summary.totalMaizeProcessed}\nTotal Flour Produced (kg),${summary.totalFlourProduced}\nTotal Bran Produced (kg),${summary.totalBranProduced}\nTotal Water Used (L),${summary.totalWaterUsed}\nTotal Electricity Used (kWh),${summary.totalElectricityUsed}\nTotal Sacks Used,${summary.totalSacksUsed}\nAverage Efficiency,${summary.averageEfficiency}`;

    return { csv: csv + summaryCSV, summary };
  }

  // ---------- CSV report: Sales ----------
  private async generateSalesReport(userId: string) {
    const salesRows = await this.db.query.sales.findMany({
      where: eq(sales.user_id, userId),
    });

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
        .reduce((s, r) => s + Number(r.quantity || 0), 0),
      totalBranSales: salesRows
        .filter((r) => r.product_type === 'bran')
        .reduce((s, r) => s + Number(r.quantity || 0), 0),
    };
    summary.averageOrderValue = (summary.totalRevenue / salesRows.length).toFixed(2);

    const customerMap: Record<string, { count: number; total: number }> = {};
    salesRows.forEach((sale) => {
      if (!customerMap[sale.customer_name]) {
        customerMap[sale.customer_name] = { count: 0, total: 0 };
      }
      customerMap[sale.customer_name].count++;
      customerMap[sale.customer_name].total += Number(sale.total_amount || 0);
    });
    const topCustomers = Object.entries(customerMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const csvData = salesRows.map((sale) => ({
      'Sale ID': sale.id,
      Date: sale.date,
      'Customer Name': sale.customer_name,
      'Customer Contact': sale.customer_contact,
      'Product Type': sale.product_type,
      'Quantity (kg)': sale.quantity,
      'Price per kg': sale.price_per_kg,
      'Delivery Cost': sale.delivery_cost,
      'Total Amount': sale.total_amount,
      'Payment Method': sale.payment_method,
      'Delivery Address': sale.delivery_address,
      Notes: sale.notes || '',
    }));

    const headers = [
      'Sale ID', 'Date', 'Customer Name', 'Customer Contact', 'Product Type',
      'Quantity (kg)', 'Price per kg', 'Delivery Cost', 'Total Amount',
      'Payment Method', 'Delivery Address', 'Notes',
    ];
    const csv = convertToCSV(csvData, headers);

    const summaryCSV = `\n\n=== SUMMARY ===\nTotal Orders,${summary.totalOrders}\nTotal Revenue,${summary.totalRevenue}\nTotal Flour Sales (kg),${summary.totalFlourSales}\nTotal Bran Sales (kg),${summary.totalBranSales}\nAverage Order Value,${summary.averageOrderValue}\n\n=== TOP 5 CUSTOMERS ===\nCustomer Name,Orders,Total Spent\n${topCustomers.map((c) => `${c.name},${c.count},${c.total}`).join('\n')}`;

    return { csv: csv + summaryCSV, summary: { ...summary, topCustomers } };
  }

  // ---------- CSV report: Procurement ----------
  private async generateProcurementReport(userId: string) {
    const orders = await this.db.query.procurementOrders.findMany({
      where: eq(procurementOrders.user_id, userId),
    });

    if (orders.length === 0) {
      return {
        csv: 'No procurement data available',
        summary: { totalOrders: 0, totalQuantity: 0, totalCost: 0, averagePricePerKg: 0 },
      };
    }

    const summary: Record<string, any> = {
      totalOrders: orders.length,
      totalQuantity: orders.reduce((s, o) => s + Number(o.quantity || 0), 0),
      totalCost: orders.reduce((s, o) => s + Number(o.total_cost || 0), 0),
      totalTransportCost: orders.reduce((s, o) => s + Number(o.transport_cost || 0), 0),
    };
    summary.averagePricePerKg = (
      orders.reduce((s, o) => s + Number(o.price_per_kg || 0), 0) / orders.length
    ).toFixed(2);

    const supplierMap: Record<string, { orders: number; totalQuantity: number; totalCost: number }> = {};
    orders.forEach((order) => {
      if (!supplierMap[order.supplier]) {
        supplierMap[order.supplier] = { orders: 0, totalQuantity: 0, totalCost: 0 };
      }
      supplierMap[order.supplier].orders++;
      supplierMap[order.supplier].totalQuantity += Number(order.quantity || 0);
      supplierMap[order.supplier].totalCost += Number(order.total_cost || 0);
    });
    const supplierStats = Object.entries(supplierMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalCost - a.totalCost);

    const csvData = orders.map((order) => ({
      'Order ID': order.id,
      Supplier: order.supplier,
      'Quantity (kg)': order.quantity,
      'Price per kg': order.price_per_kg,
      'Transport Cost': order.transport_cost,
      'Total Cost': order.total_cost,
      'Delivery Date': order.delivery_date,
      Notes: order.notes || '',
    }));

    const headers = [
      'Order ID', 'Supplier', 'Quantity (kg)', 'Price per kg',
      'Transport Cost', 'Total Cost', 'Delivery Date', 'Notes',
    ];
    const csv = convertToCSV(csvData, headers);

    const summaryCSV = `\n\n=== SUMMARY ===\nTotal Orders,${summary.totalOrders}\nTotal Quantity (kg),${summary.totalQuantity}\nTotal Cost,${summary.totalCost}\nTotal Transport Cost,${summary.totalTransportCost}\nAverage Price per kg,${summary.averagePricePerKg}\n\n=== SUPPLIER STATISTICS ===\nSupplier,Orders,Total Quantity (kg),Total Cost\n${supplierStats.map((s) => `${s.name},${s.orders},${s.totalQuantity},${s.totalCost}`).join('\n')}`;

    return { csv: csv + summaryCSV, summary: { ...summary, supplierStats } };
  }

  // ---------- CSV report: Financial ----------
  private async generateFinancialReport(userId: string) {
    const [salesRows, expenseRows, orders] = await Promise.all([
      this.db.query.sales.findMany({ where: eq(sales.user_id, userId) }),
      this.db.query.expenses.findMany({ where: eq(expenses.user_id, userId) }),
      this.db.query.procurementOrders.findMany({ where: eq(procurementOrders.user_id, userId) }),
    ]);

    const totalRevenue = salesRows.reduce((s, r) => s + Number(r.total_amount || 0), 0);
    const totalExpenses = expenseRows.reduce((s, e) => s + Number(e.amount || 0), 0);
    const totalProcurementCost = orders.reduce((s, o) => s + Number(o.total_cost || 0), 0);
    const totalCosts = totalExpenses + totalProcurementCost;
    const profit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(2) : '0';

    const expenseByCategory: Record<string, number> = {};
    expenseRows.forEach((exp) => {
      expenseByCategory[exp.category] = (expenseByCategory[exp.category] || 0) + Number(exp.amount || 0);
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
    const headerCSV = `=== ${reportTitle.toUpperCase()} ===\nGenerated on: ${new Date().toLocaleString()}\n\n`;

    return { filename, csv: headerCSV + reportData.csv };
  }

  // ---------- Comprehensive report data (JSON) ----------
  async getComprehensiveReportData(userId: string) {
    const [batches, salesRows, orders, expenseRows] = await Promise.all([
      this.db.query.productionBatches.findMany({ where: eq(productionBatches.user_id, userId) }),
      this.db.query.sales.findMany({ where: eq(sales.user_id, userId) }),
      this.db.query.procurementOrders.findMany({ where: eq(procurementOrders.user_id, userId) }),
      this.db.query.expenses.findMany({ where: eq(expenses.user_id, userId) }),
    ]);

    const productionSummary: Record<string, any> = {
      totalBatches: batches.length,
      totalMaizeProcessed: batches.reduce((s, b) => s + Number(b.maize_quantity || 0), 0),
      totalFlourProduced: batches.reduce((s, b) => s + Number(b.flour_output || 0), 0),
      totalBranProduced: batches.reduce((s, b) => s + Number(b.bran_output || 0), 0),
      totalWaterUsed: batches.reduce((s, b) => s + Number(b.water_usage || 0), 0),
      totalElectricityUsed: batches.reduce((s, b) => s + Number(b.electricity_usage || 0), 0),
      totalSacksUsed: batches.reduce((s, b) => s + Number(b.sacks_used || 0), 0),
    };
    const totalEfficiency = batches.reduce((sum, b) => {
      if (b.maize_quantity > 0) return sum + (b.flour_output / b.maize_quantity) * 100;
      return sum;
    }, 0);
    productionSummary.averageEfficiency =
      batches.length > 0 ? (totalEfficiency / batches.length).toFixed(2) : 0;

    const salesSummary: Record<string, any> = {
      totalOrders: salesRows.length,
      totalRevenue: salesRows.reduce((s, r) => s + Number(r.total_amount || 0), 0),
      totalFlourSales: salesRows
        .filter((r) => r.product_type === 'flour')
        .reduce((s, r) => s + Number(r.quantity || 0), 0),
      totalBranSales: salesRows
        .filter((r) => r.product_type === 'bran')
        .reduce((s, r) => s + Number(r.quantity || 0), 0),
    };
    salesSummary.averageOrderValue =
      salesRows.length > 0 ? (salesSummary.totalRevenue / salesRows.length).toFixed(2) : 0;

    const customerMap: Record<string, { count: number; total: number }> = {};
    salesRows.forEach((sale) => {
      if (!customerMap[sale.customer_name]) customerMap[sale.customer_name] = { count: 0, total: 0 };
      customerMap[sale.customer_name].count++;
      customerMap[sale.customer_name].total += Number(sale.total_amount || 0);
    });
    const topCustomers = Object.entries(customerMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const procurementSummary: Record<string, any> = {
      totalOrders: orders.length,
      totalQuantity: orders.reduce((s, o) => s + Number(o.quantity || 0), 0),
      totalCost: orders.reduce((s, o) => s + Number(o.total_cost || 0), 0),
      totalTransportCost: orders.reduce((s, o) => s + Number(o.transport_cost || 0), 0),
    };
    procurementSummary.averagePricePerKg =
      orders.length > 0
        ? (orders.reduce((s, o) => s + Number(o.price_per_kg || 0), 0) / orders.length).toFixed(2)
        : 0;

    const supplierMap: Record<string, { orders: number; totalQuantity: number; totalCost: number }> = {};
    orders.forEach((order) => {
      if (!supplierMap[order.supplier]) {
        supplierMap[order.supplier] = { orders: 0, totalQuantity: 0, totalCost: 0 };
      }
      supplierMap[order.supplier].orders++;
      supplierMap[order.supplier].totalQuantity += Number(order.quantity || 0);
      supplierMap[order.supplier].totalCost += Number(order.total_cost || 0);
    });
    const supplierStats = Object.entries(supplierMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalCost - a.totalCost);

    const expensesSummary = {
      totalExpenses: expenseRows.reduce((s, e) => s + Number(e.amount || 0), 0),
      totalCount: expenseRows.length,
    };
    const expenseByCategory: Record<string, number> = {};
    expenseRows.forEach((exp) => {
      expenseByCategory[exp.category] = (expenseByCategory[exp.category] || 0) + Number(exp.amount || 0);
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

    const revenueData = aggregateByDate(salesRows, { revenue: 'total_amount' });
    const expensesData = aggregateByDate(expenseRows, { expenses: 'amount' });
    const revenueExpensesData = revenueData.map((d) => ({
      ...d,
      expenses: expensesData.find((e) => e.period === d.period)?.expenses || 0,
    }));
    const productionData = aggregateByDate(batches, {
      maizeProcessed: 'maize_quantity',
      flourProduced: 'flour_output',
      branProduced: 'bran_output',
    });
    const procurementData = aggregateByDate(orders, { procurementCost: 'total_cost' }, 'delivery_date');

    const notes: { type: string; date: any; note: string }[] = [];
    batches.forEach((b) => {
      if (b.notes && b.notes.trim()) notes.push({ type: 'Production', date: b.date, note: b.notes });
    });
    salesRows.forEach((s) => {
      if (s.notes && s.notes.trim()) notes.push({ type: 'Sales', date: s.date, note: s.notes });
    });
    orders.forEach((o) => {
      if (o.notes && o.notes.trim()) notes.push({ type: 'Procurement', date: o.delivery_date, note: o.notes });
    });
    expenseRows.forEach((e) => {
      if (e.description && e.description.trim()) notes.push({ type: 'Expense', date: e.date, note: e.description });
    });

    return {
      production: {
        summary: productionSummary,
        batches: batches.slice(0, 10),
        chartData: productionData,
      },
      sales: {
        summary: salesSummary,
        topCustomers,
        revenueByProduct,
        chartData: revenueExpensesData,
      },
      procurement: {
        summary: procurementSummary,
        supplierStats,
        chartData: procurementData,
      },
      expenses: {
        summary: expensesSummary,
        byCategory: expenseByCategory,
      },
      financial: {
        totalRevenue,
        totalExpenses,
        totalProcurementCost,
        totalCosts,
        profit,
        profitMargin,
      },
      notes: notes
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 20),
    };
  }

  async getComprehensiveReport(userId: string) {
    const user = await this.db.query.users.findFirst({ where: eq(users.id, userId) });
    const userName = user?.name || user?.username || 'User';
    const data = await this.getComprehensiveReportData(userId);
    return { userName, generatedAt: new Date().toISOString(), ...data };
  }
}
