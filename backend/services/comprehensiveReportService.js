import { getBatchesByUser } from "./productionService.js";
import { getAllSales } from "./salesService.js";
import { getOrdersByUser } from "./procurementService.js";
import { getExpensesByUser } from "./expenseService.js";

// Aggregate data by date for charts
const aggregateByDate = (items, keyMap, dateKey = "date") => {
  const map = {};
  items.forEach(item => {
    const dateObj = new Date(item[dateKey] || item.created_at);
    const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000);
    const date = localDate.toISOString().split("T")[0];

    if (!map[date]) map[date] = {};
    Object.keys(keyMap).forEach(k => {
      map[date][k] = (map[date][k] || 0) + parseFloat(item[keyMap[k]] || 0);
    });
  });
  return Object.entries(map).map(([date, values]) => ({ period: date, ...values }));
};

// Get comprehensive report data
export const getComprehensiveReportData = async (userId) => {
  // Fetch all data
  const [batches, sales, orders, expenses] = await Promise.all([
    getBatchesByUser(userId),
    getAllSales(userId),
    getOrdersByUser(userId),
    getExpensesByUser(userId)
  ]);

  // Production Summary
  const productionSummary = {
    totalBatches: batches.length,
    totalMaizeProcessed: batches.reduce((sum, b) => sum + Number(b.maize_quantity || 0), 0),
    totalFlourProduced: batches.reduce((sum, b) => sum + Number(b.flour_output || 0), 0),
    totalBranProduced: batches.reduce((sum, b) => sum + Number(b.bran_output || 0), 0),
    totalWaterUsed: batches.reduce((sum, b) => sum + Number(b.water_usage || 0), 0),
    totalElectricityUsed: batches.reduce((sum, b) => sum + Number(b.electricity_usage || 0), 0),
    totalSacksUsed: batches.reduce((sum, b) => sum + Number(b.sacks_used || 0), 0),
  };
  
  const totalEfficiency = batches.reduce((sum, b) => {
    if (b.maize_quantity > 0) {
      return sum + ((b.flour_output / b.maize_quantity) * 100);
    }
    return sum;
  }, 0);
  productionSummary.averageEfficiency = batches.length > 0 
    ? (totalEfficiency / batches.length).toFixed(2) 
    : 0;

  // Sales Summary
  const salesSummary = {
    totalOrders: sales.length,
    totalRevenue: sales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0),
    totalFlourSales: sales
      .filter(s => s.product_type === "flour")
      .reduce((sum, s) => sum + Number(s.quantity || 0), 0),
    totalBranSales: sales
      .filter(s => s.product_type === "bran")
      .reduce((sum, s) => sum + Number(s.quantity || 0), 0),
  };
  salesSummary.averageOrderValue = sales.length > 0 
    ? (salesSummary.totalRevenue / sales.length).toFixed(2) 
    : 0;

  // Top customers
  const customerMap = {};
  sales.forEach(sale => {
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

  // Procurement Summary
  const procurementSummary = {
    totalOrders: orders.length,
    totalQuantity: orders.reduce((sum, o) => sum + Number(o.quantity || 0), 0),
    totalCost: orders.reduce((sum, o) => sum + Number(o.total_cost || 0), 0),
    totalTransportCost: orders.reduce((sum, o) => sum + Number(o.transport_cost || 0), 0),
  };
  procurementSummary.averagePricePerKg = orders.length > 0 
    ? (orders.reduce((sum, o) => sum + Number(o.price_per_kg || 0), 0) / orders.length).toFixed(2) 
    : 0;

  // Supplier statistics
  const supplierMap = {};
  orders.forEach(order => {
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

  // Expenses Summary
  const expensesSummary = {
    totalExpenses: expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    totalCount: expenses.length,
  };

  // Expense breakdown by category
  const expenseByCategory = {};
  expenses.forEach(exp => {
    if (!expenseByCategory[exp.category]) {
      expenseByCategory[exp.category] = 0;
    }
    expenseByCategory[exp.category] += Number(exp.amount || 0);
  });

  // Financial Summary
  const totalRevenue = salesSummary.totalRevenue;
  const totalExpenses = expensesSummary.totalExpenses;
  const totalProcurementCost = procurementSummary.totalCost;
  const totalCosts = totalExpenses + totalProcurementCost;
  const profit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(2) : "0";

  // Revenue breakdown by product
  const revenueByProduct = {};
  sales.forEach(sale => {
    if (!revenueByProduct[sale.product_type]) {
      revenueByProduct[sale.product_type] = 0;
    }
    revenueByProduct[sale.product_type] += Number(sale.total_amount || 0);
  });

  // Chart data
  const revenueData = aggregateByDate(sales, { revenue: "total_amount" });
  const expensesData = aggregateByDate(expenses, { expenses: "amount" });
  const revenueExpensesData = revenueData.map(d => ({
    ...d,
    expenses: expensesData.find(e => e.period === d.period)?.expenses || 0,
  }));

  const productionData = aggregateByDate(batches, {
    maizeProcessed: "maize_quantity",
    flourProduced: "flour_output",
    branProduced: "bran_output",
  });

  const procurementData = aggregateByDate(orders, { 
    procurementCost: "total_cost" 
  }, "delivery_date");

  // Collect all notes/comments
  const notes = [];
  batches.forEach(b => {
    if (b.notes && b.notes.trim()) {
      notes.push({ type: "Production", date: b.date, note: b.notes });
    }
  });
  sales.forEach(s => {
    if (s.notes && s.notes.trim()) {
      notes.push({ type: "Sales", date: s.date, note: s.notes });
    }
  });
  orders.forEach(o => {
    if (o.notes && o.notes.trim()) {
      notes.push({ type: "Procurement", date: o.delivery_date, note: o.notes });
    }
  });
  expenses.forEach(e => {
    if (e.description && e.description.trim()) {
      notes.push({ type: "Expense", date: e.date, note: e.description });
    }
  });

  return {
    production: {
      summary: productionSummary,
      batches: batches.slice(0, 10), // Top 10 recent batches
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
    notes: notes.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20), // Top 20 recent notes
  };
};


