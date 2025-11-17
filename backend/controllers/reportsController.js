import { getBatchesByUser } from "../services/productionService.js";
import { getAllSales } from "../services/salesService.js";
import { getOrdersByUser } from "../services/procurementService.js";
import { getExpensesByUser } from "../services/expenseService.js";

// Helper function to convert data to CSV
const convertToCSV = (data, headers) => {
  const csvHeaders = headers.join(",");
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header] ?? "";
      // Escape commas and quotes in CSV
      if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(",")
  );
  return [csvHeaders, ...csvRows].join("\n");
};

// Generate Production Report
const generateProductionReport = async (userId) => {
  const batches = await getBatchesByUser(userId);
  
  if (batches.length === 0) {
    return {
      csv: "No production data available",
      summary: {
        totalBatches: 0,
        totalMaizeProcessed: 0,
        totalFlourProduced: 0,
        totalBranProduced: 0,
        totalWaterUsed: 0,
        totalElectricityUsed: 0,
        totalSacksUsed: 0,
        averageEfficiency: "0%"
      }
    };
  }

  const summary = {
    totalBatches: batches.length,
    totalMaizeProcessed: batches.reduce((sum, b) => sum + Number(b.maize_quantity || 0), 0),
    totalFlourProduced: batches.reduce((sum, b) => sum + Number(b.flour_output || 0), 0),
    totalBranProduced: batches.reduce((sum, b) => sum + Number(b.bran_output || 0), 0),
    totalWaterUsed: batches.reduce((sum, b) => sum + Number(b.water_usage || 0), 0),
    totalElectricityUsed: batches.reduce((sum, b) => sum + Number(b.electricity_usage || 0), 0),
    totalSacksUsed: batches.reduce((sum, b) => sum + Number(b.sacks_used || 0), 0),
  };

  // Calculate efficiency (flour output / maize input * 100)
  const totalEfficiency = batches.reduce((sum, b) => {
    if (b.maize_quantity > 0) {
      return sum + ((b.flour_output / b.maize_quantity) * 100);
    }
    return sum;
  }, 0);
  summary.averageEfficiency = batches.length > 0 
    ? `${(totalEfficiency / batches.length).toFixed(2)}%` 
    : "0%";

  // Prepare CSV data
  const csvData = batches.map(batch => ({
    "Batch ID": batch.id,
    "Date": batch.date,
    "Maize Quantity (kg)": batch.maize_quantity,
    "Flour Output (kg)": batch.flour_output,
    "Bran Output (kg)": batch.bran_output,
    "Water Usage (L)": batch.water_usage,
    "Electricity Usage (kWh)": batch.electricity_usage,
    "Sacks Used": batch.sacks_used,
    "Efficiency (%)": batch.maize_quantity > 0 
      ? ((batch.flour_output / batch.maize_quantity) * 100).toFixed(2) 
      : "0",
    "Notes": batch.notes || ""
  }));

  const headers = ["Batch ID", "Date", "Maize Quantity (kg)", "Flour Output (kg)", "Bran Output (kg)", 
                   "Water Usage (L)", "Electricity Usage (kWh)", "Sacks Used", "Efficiency (%)", "Notes"];
  
  const csv = convertToCSV(csvData, headers);
  
  // Add summary to CSV
  const summaryCSV = `\n\n=== SUMMARY ===\nTotal Batches,${summary.totalBatches}\nTotal Maize Processed (kg),${summary.totalMaizeProcessed}\nTotal Flour Produced (kg),${summary.totalFlourProduced}\nTotal Bran Produced (kg),${summary.totalBranProduced}\nTotal Water Used (L),${summary.totalWaterUsed}\nTotal Electricity Used (kWh),${summary.totalElectricityUsed}\nTotal Sacks Used,${summary.totalSacksUsed}\nAverage Efficiency,${summary.averageEfficiency}`;

  return {
    csv: csv + summaryCSV,
    summary
  };
};

// Generate Sales Report
const generateSalesReport = async (userId) => {
  const sales = await getAllSales(userId);
  
  if (sales.length === 0) {
    return {
      csv: "No sales data available",
      summary: {
        totalOrders: 0,
        totalRevenue: 0,
        totalFlourSales: 0,
        totalBranSales: 0,
        averageOrderValue: 0
      }
    };
  }

  const summary = {
    totalOrders: sales.length,
    totalRevenue: sales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0),
    totalFlourSales: sales
      .filter(s => s.product_type === "flour")
      .reduce((sum, s) => sum + Number(s.quantity || 0), 0),
    totalBranSales: sales
      .filter(s => s.product_type === "bran")
      .reduce((sum, s) => sum + Number(s.quantity || 0), 0),
  };
  summary.averageOrderValue = sales.length > 0 
    ? (summary.totalRevenue / sales.length).toFixed(2) 
    : 0;

  // Get top customers
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

  const csvData = sales.map(sale => ({
    "Sale ID": sale.id,
    "Date": sale.date,
    "Customer Name": sale.customer_name,
    "Customer Contact": sale.customer_contact,
    "Product Type": sale.product_type,
    "Quantity (kg)": sale.quantity,
    "Price per kg": sale.price_per_kg,
    "Delivery Cost": sale.delivery_cost,
    "Total Amount": sale.total_amount,
    "Payment Method": sale.payment_method,
    "Delivery Address": sale.delivery_address,
    "Notes": sale.notes || ""
  }));

  const headers = ["Sale ID", "Date", "Customer Name", "Customer Contact", "Product Type", 
                   "Quantity (kg)", "Price per kg", "Delivery Cost", "Total Amount", 
                   "Payment Method", "Delivery Address", "Notes"];
  
  const csv = convertToCSV(csvData, headers);
  
  const summaryCSV = `\n\n=== SUMMARY ===\nTotal Orders,${summary.totalOrders}\nTotal Revenue,${summary.totalRevenue}\nTotal Flour Sales (kg),${summary.totalFlourSales}\nTotal Bran Sales (kg),${summary.totalBranSales}\nAverage Order Value,${summary.averageOrderValue}\n\n=== TOP 5 CUSTOMERS ===\nCustomer Name,Orders,Total Spent\n${topCustomers.map(c => `${c.name},${c.count},${c.total}`).join("\n")}`;

  return {
    csv: csv + summaryCSV,
    summary: { ...summary, topCustomers }
  };
};

// Generate Procurement Report
const generateProcurementReport = async (userId) => {
  const orders = await getOrdersByUser(userId);
  
  if (orders.length === 0) {
    return {
      csv: "No procurement data available",
      summary: {
        totalOrders: 0,
        totalQuantity: 0,
        totalCost: 0,
        averagePricePerKg: 0
      }
    };
  }

  const summary = {
    totalOrders: orders.length,
    totalQuantity: orders.reduce((sum, o) => sum + Number(o.quantity || 0), 0),
    totalCost: orders.reduce((sum, o) => sum + Number(o.total_cost || 0), 0),
    totalTransportCost: orders.reduce((sum, o) => sum + Number(o.transport_cost || 0), 0),
  };
  summary.averagePricePerKg = orders.length > 0 
    ? (orders.reduce((sum, o) => sum + Number(o.price_per_kg || 0), 0) / orders.length).toFixed(2) 
    : 0;

  // Get supplier statistics
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

  const csvData = orders.map(order => ({
    "Order ID": order.id,
    "Supplier": order.supplier,
    "Quantity (kg)": order.quantity,
    "Price per kg": order.price_per_kg,
    "Transport Cost": order.transport_cost,
    "Total Cost": order.total_cost,
    "Delivery Date": order.delivery_date,
    "Notes": order.notes || ""
  }));

  const headers = ["Order ID", "Supplier", "Quantity (kg)", "Price per kg", 
                   "Transport Cost", "Total Cost", "Delivery Date", "Notes"];
  
  const csv = convertToCSV(csvData, headers);
  
  const summaryCSV = `\n\n=== SUMMARY ===\nTotal Orders,${summary.totalOrders}\nTotal Quantity (kg),${summary.totalQuantity}\nTotal Cost,${summary.totalCost}\nTotal Transport Cost,${summary.totalTransportCost}\nAverage Price per kg,${summary.averagePricePerKg}\n\n=== SUPPLIER STATISTICS ===\nSupplier,Orders,Total Quantity (kg),Total Cost\n${supplierStats.map(s => `${s.name},${s.orders},${s.totalQuantity},${s.totalCost}`).join("\n")}`;

  return {
    csv: csv + summaryCSV,
    summary: { ...summary, supplierStats }
  };
};

// Generate Financial Summary Report
const generateFinancialReport = async (userId) => {
  const [sales, expenses, orders] = await Promise.all([
    getAllSales(userId),
    getExpensesByUser(userId),
    getOrdersByUser(userId)
  ]);

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalProcurementCost = orders.reduce((sum, o) => sum + Number(o.total_cost || 0), 0);
  const totalCosts = totalExpenses + totalProcurementCost;
  const profit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(2) : "0";

  // Expense breakdown by category
  const expenseByCategory = {};
  expenses.forEach(exp => {
    if (!expenseByCategory[exp.category]) {
      expenseByCategory[exp.category] = 0;
    }
    expenseByCategory[exp.category] += Number(exp.amount || 0);
  });

  // Revenue breakdown by product
  const revenueByProduct = {};
  sales.forEach(sale => {
    if (!revenueByProduct[sale.product_type]) {
      revenueByProduct[sale.product_type] = 0;
    }
    revenueByProduct[sale.product_type] += Number(sale.total_amount || 0);
  });

  const summary = {
    totalRevenue,
    totalExpenses,
    totalProcurementCost,
    totalCosts,
    profit,
    profitMargin: `${profitMargin}%`,
    expenseByCategory,
    revenueByProduct
  };

  // Create comprehensive CSV
  const csvLines = [
    "=== FINANCIAL SUMMARY REPORT ===",
    "",
    "REVENUE",
    "Source,Amount",
    `Total Sales Revenue,${totalRevenue}`,
    ...Object.entries(revenueByProduct).map(([product, amount]) => `${product.charAt(0).toUpperCase() + product.slice(1)} Sales,${amount}`),
    "",
    "EXPENSES",
    "Category,Amount",
    ...Object.entries(expenseByCategory).map(([cat, amount]) => `${cat},${amount}`),
    `Total Operating Expenses,${totalExpenses}`,
    "",
    "PROCUREMENT",
    `Total Procurement Cost,${totalProcurementCost}`,
    "",
    "SUMMARY",
    "Item,Amount",
    `Total Revenue,${totalRevenue}`,
    `Total Costs,${totalCosts}`,
    `Profit,${profit}`,
    `Profit Margin,${profitMargin}%`
  ];

  return {
    csv: csvLines.join("\n"),
    summary
  };
};

// 🧾 Generate report
export const generateReport = async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user.id;

    if (!type) {
      return res.status(400).json({ message: "Report type is required" });
    }

    let reportData;
    let reportTitle;

    switch (type) {
      case "production":
        reportTitle = "Production Report";
        reportData = await generateProductionReport(userId);
        break;
      case "sales":
        reportTitle = "Sales Report";
        reportData = await generateSalesReport(userId);
        break;
      case "procurement":
        reportTitle = "Procurement Report";
        reportData = await generateProcurementReport(userId);
        break;
      case "financial":
        reportTitle = "Financial Summary";
        reportData = await generateFinancialReport(userId);
        break;
      default:
        return res.status(400).json({ message: "Invalid report type" });
    }

    // Set headers for CSV download
    const filename = `${type}_report_${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Add header to CSV
    const headerCSV = `=== ${reportTitle.toUpperCase()} ===\nGenerated on: ${new Date().toLocaleString()}\n\n`;
    
    res.send(headerCSV + reportData.csv);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Failed to generate report", error: error.message });
  }
};


