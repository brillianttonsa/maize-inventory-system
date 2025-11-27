import { getComprehensiveReportData } from "../services/comprehensiveReportService.js"
import pool from "../config/db.js"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "0"
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(num))
}

const escapeHtml = (text) => {
  if (!text) return ""
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return String(text).replace(/[&<>"']/g, (m) => map[m])
}

// Generate HTML template for comprehensive report
const generateHTMLReport = (data, userName) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprehensive Business Report - ${currentDate}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @media print {
            @page {
                size: A4;
                margin: 1.5cm;
            }
            body {
                background: white !important;
                padding: 0;
            }
            .container {
                box-shadow: none !important;
                padding: 0 !important;
            }
            .no-print {
                display: none !important;
            }
            .section {
                page-break-inside: avoid;
            }
            .chart-container {
                page-break-inside: avoid;
            }
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 8px;
        }
        
        .header {
            text-align: center;
            border-bottom: 4px solid #eab308;
            padding-bottom: 20px;
            margin-bottom: 40px;
        }
        
        .header h1 {
            color: #eab308;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #666;
            font-size: 1.1em;
        }
        
        .section {
            margin-bottom: 50px;
            page-break-inside: avoid;
        }
        
        .section-title {
            color: #eab308;
            font-size: 1.8em;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #eab308;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .summary-card {
            background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
            padding: 20px;
            border-radius: 12px;
            border-left: 5px solid #eab308;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        
        .summary-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        
        .summary-card h3 {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .summary-card .value {
            color: #333;
            font-size: 1.8em;
            font-weight: bold;
        }
        
        .chart-container {
            background: white;
            padding: 30px;
            margin: 20px 0;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            height: 450px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        table th, table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        
        table th {
            background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 0.5px;
        }
        
        table tr:hover {
            background: #fef3c7;
        }
        
        table tr:last-child td {
            border-bottom: none;
        }
        
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #eab308;
            color: #666;
        }
        
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #eab308;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            z-index: 1000;
        }
        
        .print-button:hover {
            background: #ca8a04;
        }
        
        .positive {
            color: #10b981 !important;
        }
        
        .negative {
            color: #ef4444 !important;
        }
    </style>
</head>
<body>
    <button class="print-button no-print" onclick="window.print()">Print / Save as PDF</button>
    
    <div class="container">
        <div class="header">
            <h1>Comprehensive Business Report</h1>
            <p>Generated for: ${escapeHtml(userName)}</p>
            <p>Date: ${currentDate}</p>
        </div>

        <!-- Financial Summary -->
        <div class="section">
            <h2 class="section-title">Financial Overview</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Total Revenue</h3>
                    <div class="value positive">${formatNumber(data.financial.totalRevenue)} Tsh</div>
                </div>
                <div class="summary-card">
                    <h3>Total Costs</h3>
                    <div class="value">${formatNumber(data.financial.totalCosts)} Tsh</div>
                </div>
                <div class="summary-card">
                    <h3>Net Profit</h3>
                    <div class="value ${data.financial.profit >= 0 ? "positive" : "negative"}">
                        ${formatNumber(data.financial.profit)} Tsh
                    </div>
                </div>
                <div class="summary-card">
                    <h3>Profit Margin</h3>
                    <div class="value ${data.financial.profitMargin >= 0 ? "positive" : "negative"}">${data.financial.profitMargin}%</div>
                </div>
            </div>
        </div>

        <!-- Production Section -->
        <div class="section">
            <h2 class="section-title">Production Summary</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Total Batches</h3>
                    <div class="value">${data.production.summary.totalBatches || 0}</div>
                </div>
                <div class="summary-card">
                    <h3>Maize Processed</h3>
                    <div class="value">${formatNumber(data.production.summary.totalMaizeProcessed)} kg</div>
                </div>
                <div class="summary-card">
                    <h3>Flour Produced</h3>
                    <div class="value">${formatNumber(data.production.summary.totalFlourProduced)} kg</div>
                </div>
                <div class="summary-card">
                    <h3>Bran Produced</h3>
                    <div class="value">${formatNumber(data.production.summary.totalBranProduced)} kg</div>
                </div>
                <div class="summary-card">
                    <h3>Average Efficiency</h3>
                    <div class="value">${data.production.summary.averageEfficiency || 0}%</div>
                </div>
            </div>
            
            <div class="chart-container">
                <canvas id="productionChart"></canvas>
            </div>
        </div>

        <!-- Sales Section -->
        <div class="section">
            <h2 class="section-title">Sales Summary</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Total Orders</h3>
                    <div class="value">${data.sales.summary.totalOrders || 0}</div>
                </div>
                <div class="summary-card">
                    <h3>Total Revenue</h3>
                    <div class="value positive">${formatNumber(data.sales.summary.totalRevenue)} Tsh</div>
                </div>
                <div class="summary-card">
                    <h3>Flour Sales</h3>
                    <div class="value">${formatNumber(data.sales.summary.totalFlourSales)} kg</div>
                </div>
                <div class="summary-card">
                    <h3>Bran Sales</h3>
                    <div class="value">${formatNumber(data.sales.summary.totalBranSales)} kg</div>
                </div>
                <div class="summary-card">
                    <h3>Avg Order Value</h3>
                    <div class="value">${formatNumber(data.sales.summary.averageOrderValue)} Tsh</div>
                </div>
            </div>

            <div class="chart-container">
                <canvas id="revenueChart"></canvas>
            </div>

            ${
              data.sales.topCustomers && data.sales.topCustomers.length > 0
                ? `
            <h3 style="margin-top: 30px; margin-bottom: 15px; color: #333;">Top 5 Customers</h3>
            <table>
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Orders</th>
                        <th>Total Spent</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.sales.topCustomers
                      .map(
                        (c) => `
                        <tr>
                            <td>${escapeHtml(c.name || "Unknown")}</td>
                            <td>${c.count || 0}</td>
                            <td>${formatNumber(c.total)} Tsh</td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
            `
                : '<p style="color: #666;">No customer data available</p>'
            }
        </div>

        <!-- Procurement Section -->
        <div class="section">
            <h2 class="section-title">Procurement Summary</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Total Orders</h3>
                    <div class="value">${data.procurement.summary.totalOrders || 0}</div>
                </div>
                <div class="summary-card">
                    <h3>Total Quantity</h3>
                    <div class="value">${formatNumber(data.procurement.summary.totalQuantity)} kg</div>
                </div>
                <div class="summary-card">
                    <h3>Total Cost</h3>
                    <div class="value">${formatNumber(data.procurement.summary.totalCost)} Tsh</div>
                </div>
                <div class="summary-card">
                    <h3>Avg Price/kg</h3>
                    <div class="value">${formatNumber(data.procurement.summary.averagePricePerKg)} Tsh</div>
                </div>
            </div>

            ${
              data.procurement.supplierStats && data.procurement.supplierStats.length > 0
                ? `
            <h3 style="margin-top: 30px; margin-bottom: 15px; color: #333;">Supplier Performance</h3>
            <table>
                <thead>
                    <tr>
                        <th>Supplier</th>
                        <th>Orders</th>
                        <th>Total Quantity (kg)</th>
                        <th>Total Cost</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.procurement.supplierStats
                      .map(
                        (s) => `
                        <tr>
                            <td>${escapeHtml(s.name || "Unknown")}</td>
                            <td>${s.orders || 0}</td>
                            <td>${formatNumber(s.totalQuantity)}</td>
                            <td>${formatNumber(s.totalCost)} Tsh</td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
            `
                : '<p style="color: #666;">No supplier data available</p>'
            }
        </div>

        <!-- Expenses Section -->
        <div class="section">
            <h2 class="section-title">Expenses Summary</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Total Expenses</h3>
                    <div class="value negative">${formatNumber(data.expenses.summary.totalExpenses)} Tsh</div>
                </div>
                <div class="summary-card">
                    <h3>Total Records</h3>
                    <div class="value">${data.expenses.summary.totalCount || 0}</div>
                </div>
            </div>

            ${
              Object.keys(data.expenses.byCategory).length > 0
                ? `
            <h3 style="margin-top: 30px; margin-bottom: 15px; color: #333;">Expenses by Category</h3>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(data.expenses.byCategory)
                      .map(
                        ([cat, amount]) => `
                        <tr>
                            <td>${escapeHtml(cat) || "Uncategorized"}</td>
                            <td>${formatNumber(amount)} Tsh</td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
            `
                : '<p style="color: #666;">No expense data available</p>'
            }
        </div>

        <div class="footer">
            <p><strong>Report generated on ${currentDate}</strong></p>
            <p>MaizeTrack Inventory Management System</p>
            <p style="margin-top: 10px; font-size: 0.9em;">This is a comprehensive overview of your business operations. For detailed analysis, please refer to individual module reports.</p>
        </div>
    </div>

    <script>
        // Production Chart
        const productionCtx = document.getElementById('productionChart');
        if (productionCtx) {
            new Chart(productionCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ${JSON.stringify(data.production.chartData.map((d) => d.period))},
                    datasets: [
                        {
                            label: 'Maize Processed (kg)',
                            data: ${JSON.stringify(data.production.chartData.map((d) => Number.parseFloat(d.maizeProcessed) || 0))},
                            borderColor: '#eab308',
                            backgroundColor: 'rgba(234, 179, 8, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Flour Produced (kg)',
                            data: ${JSON.stringify(data.production.chartData.map((d) => Number.parseFloat(d.flourProduced) || 0))},
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Bran Produced (kg)',
                            data: ${JSON.stringify(data.production.chartData.map((d) => Number.parseFloat(d.branProduced) || 0))},
                            borderColor: '#f59e0b',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Production Trends Over Time',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        legend: {
                            display: true,
                            position: 'bottom'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString() + ' kg';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Revenue vs Expenses Chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            new Chart(revenueCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ${JSON.stringify(data.sales.chartData.map((d) => d.period))},
                    datasets: [
                        {
                            label: 'Revenue (Tsh)',
                            data: ${JSON.stringify(data.sales.chartData.map((d) => Number.parseFloat(d.revenue) || 0))},
                            backgroundColor: 'rgba(16, 185, 129, 0.8)',
                            borderColor: '#10b981',
                            borderWidth: 1
                        },
                        {
                            label: 'Expenses (Tsh)',
                            data: ${JSON.stringify(data.sales.chartData.map((d) => Number.parseFloat(d.expenses) || 0))},
                            backgroundColor: 'rgba(239, 68, 68, 0.8)',
                            borderColor: '#ef4444',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Revenue vs Expenses Over Time',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        legend: {
                            display: true,
                            position: 'bottom'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString() + ' Tsh';
                                }
                            }
                        }
                    }
                }
            });
        }
    </script>
</body>
</html>`
}

// Generate comprehensive PDF report
export const generateComprehensiveReport = async (req, res) => {
  try {
    const userId = req.user.id

    // Get user name from database
    const userResult = await pool.query("SELECT name, username FROM users WHERE id = $1", [userId])
    const userName = userResult.rows[0]?.name || userResult.rows[0]?.username || "User"

    // Get comprehensive data
    const data = await getComprehensiveReportData(userId)

    // Generate HTML
    const html = generateHTMLReport(data, userName)

    // Set headers for HTML response (can be printed as PDF from browser)
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader(
      "Content-Disposition",
      `inline; filename="comprehensive_report_${new Date().toISOString().split("T")[0]}.html"`,
    )

    res.send(html)
  } catch (error) {
    console.error("Error generating comprehensive report:", error)
    res.status(500).json({ message: "Failed to generate comprehensive report", error: error.message })
  }
}
