import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import {
  productionBatches,
  sales,
  procurementOrders,
  expenses,
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
          averageEfficiency: '0%',
        },
      };
    }

    const summary: Record<string, any> = {
      totalBatches: batches.length,
      totalMaizeProcessed: batches.reduce((s, b) => s + Number(b.maize_quantity || 0), 0),
      totalFlourProduced: batches.reduce((s, b) => s + Number(b.flour_output || 0), 0),
      totalBranProduced: batches.reduce((s, b) => s + Number(b.bran_debe_quantity || 0), 0),
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
      'Bran Output (debe)': batch.bran_debe_quantity,
      'Efficiency (%)':
        batch.maize_quantity > 0
          ? ((batch.flour_output / batch.maize_quantity) * 100).toFixed(2)
          : '0',
    }));

    const headers = [
      'Batch ID', 'Date', 'Maize Quantity (kg)', 'Flour Output (kg)', 'Bran Output (debe)',
      'Efficiency (%)',
    ];
    const csv = convertToCSV(csvData, headers);

    const summaryCSV = `\n\n=== SUMMARY ===\nTotal Batches,${summary.totalBatches}\nTotal Maize Processed (kg),${summary.totalMaizeProcessed}\nTotal Flour Produced (kg),${summary.totalFlourProduced}\nTotal Bran Produced (debe),${summary.totalBranProduced}\nAverage Efficiency,${summary.averageEfficiency}`;

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
    }));

    const headers = [
      'Sale ID', 'Date', 'Customer Name', 'Customer Contact', 'Product Type',
      'Quantity (kg)', 'Price per kg', 'Delivery Cost', 'Total Amount',
      'Payment Method', 'Delivery Address',
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
    }));

    const headers = [
      'Order ID', 'Supplier', 'Quantity (kg)', 'Price per kg',
      'Transport Cost', 'Total Cost', 'Delivery Date',
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

  // ---------- Comprehensive CSV: all transactions and summary reviews ----------
  async generateComprehensiveReport(userId: string) {
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
      totalBranProduced: batches.reduce((s, b) => s + Number(b.bran_debe_quantity || 0), 0),
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
      { Category: 'Production', Metric: 'Bran Produced (debe)', Value: productionSummary.totalBranProduced },
      { Category: 'Production', Metric: 'Average Efficiency (%)', Value: productionSummary.averageEfficiency },
      { Category: 'Sales', Metric: 'Total Orders', Value: salesSummary.totalOrders },
      { Category: 'Sales', Metric: 'Flour Sold (kg)', Value: salesSummary.totalFlourSales },
      { Category: 'Sales', Metric: 'Bran Sold (kg)', Value: salesSummary.totalBranSales },
      { Category: 'Procurement', Metric: 'Total Orders', Value: procurementSummary.totalOrders },
      { Category: 'Procurement', Metric: 'Maize Purchased (kg)', Value: procurementSummary.totalQuantity },
      { Category: 'Expenses', Metric: 'Number of Transactions', Value: expensesSummary.totalCount },
    ];

    const csv = [
      '=== COMPREHENSIVE BUSINESS REPORT ===',
      `Generated At,${new Date().toISOString()}`,
      '',
      section('SUMMARY REVIEW', summaryRows, ['Category', 'Metric', 'Value']),
      '',
      section('PRODUCTION TRANSACTIONS', batches.map((batch) => ({
        'Batch ID': batch.id, Date: batch.date, 'Maize Quantity (kg)': batch.maize_quantity,
        'Flour 5 kg Sacks': batch.flour_sacks_5kg, 'Flour 10 kg Sacks': batch.flour_sacks_10kg,
        'Flour 25 kg Sacks': batch.flour_sacks_25kg, 'Flour Output (kg)': batch.flour_output,
        'Bran Quantity (debe)': batch.bran_debe_quantity, 'Bran Unit': batch.bran_unit, 'Created At': batch.created_at,
      })), ['Batch ID', 'Date', 'Maize Quantity (kg)', 'Flour 5 kg Sacks', 'Flour 10 kg Sacks', 'Flour 25 kg Sacks', 'Flour Output (kg)', 'Bran Quantity (debe)', 'Bran Unit', 'Created At']),
      '',
      section('SALES TRANSACTIONS', salesRows.map((sale) => ({
        'Sale ID': sale.id, Date: sale.date, Customer: sale.customer_name, Contact: sale.customer_contact,
        Product: sale.product_type, 'Quantity (kg)': sale.quantity, 'Flour Sack Count': sale.sack_count,
        'Flour Sack Size (kg)': sale.sack_size, 'Bran Quantity (debe)': sale.bran_debe_quantity,
        'Bran Unit Count': sale.bran_unit_count, 'Bran Unit': sale.bran_unit, 'Price per Unit (TSh)': sale.price_per_kg,
        'Delivery Cost (TSh)': sale.delivery_cost, 'Total Amount (TSh)': sale.total_amount,
        'Payment Method': sale.payment_method, 'Delivery Address': sale.delivery_address, 'Created At': sale.created_at,
      })), ['Sale ID', 'Date', 'Customer', 'Contact', 'Product', 'Quantity (kg)', 'Flour Sack Count', 'Flour Sack Size (kg)', 'Bran Quantity (debe)', 'Bran Unit Count', 'Bran Unit', 'Price per Unit (TSh)', 'Delivery Cost (TSh)', 'Total Amount (TSh)', 'Payment Method', 'Delivery Address', 'Created At']),
      '',
      section('PROCUREMENT TRANSACTIONS', orders.map((order) => ({
        'Order ID': order.id, Supplier: order.supplier, 'Quantity (kg)': order.quantity,
        'Price per kg (TSh)': order.price_per_kg, 'Transport Cost (TSh)': order.transport_cost,
        'Total Cost (TSh)': order.total_cost, 'Delivery Date': order.delivery_date, 'Created At': order.created_at,
      })), ['Order ID', 'Supplier', 'Quantity (kg)', 'Price per kg (TSh)', 'Transport Cost (TSh)', 'Total Cost (TSh)', 'Delivery Date', 'Created At']),
      '',
      section('EXPENSE TRANSACTIONS', expenseRows.map((expense) => ({
        'Expense ID': expense.id, Date: expense.date, Category: expense.category, 'Quantity / Units': expense.unit_value,
        'Unit Cost (TSh)': expense.unit_cost, 'Sack Size (kg)': expense.sack_size, 'Amount (TSh)': expense.amount,
        'Paid By': expense.paid_by, Method: expense.method, Notes: expense.notes, 'Created At': expense.created_at,
      })), ['Expense ID', 'Date', 'Category', 'Quantity / Units', 'Unit Cost (TSh)', 'Sack Size (kg)', 'Amount (TSh)', 'Paid By', 'Method', 'Notes', 'Created At']),
      '',
      section('TOP CUSTOMERS REVIEW', topCustomers.map((customer) => ({ Customer: customer.name, Orders: customer.count, 'Total Spent (TSh)': customer.total })), ['Customer', 'Orders', 'Total Spent (TSh)']),
      '',
      section('SUPPLIER REVIEW', supplierStats.map((supplier) => ({ Supplier: supplier.name, Orders: supplier.orders, 'Total Quantity (kg)': supplier.totalQuantity, 'Total Cost (TSh)': supplier.totalCost })), ['Supplier', 'Orders', 'Total Quantity (kg)', 'Total Cost (TSh)']),
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
}
