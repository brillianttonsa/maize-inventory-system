import { getComprehensiveReportData } from "../services/comprehensiveReportService.js";
import pool from "../config/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate HTML template for comprehensive report
const generateHTMLReport = (data, userName) => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

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
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #eab308;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary-card h3 {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        .summary-card .value {
            color: #333;
            font-size: 1.8em;
            font-weight: bold;
        }
        .chart-container {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            height: 400px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
        }
        table th, table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        table th {
            background: #eab308;
            color: white;
            font-weight: bold;
        }
        table tr:hover {
            background: #f9fafb;
        }
        .notes-section {
            background: #fff9e6;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #eab308;
            margin-top: 20px;
        }
        .note-item {
            padding: 10px;
            margin-bottom: 10px;
            background: white;
            border-radius: 4px;
            border-left: 3px solid #eab308;
        }
        .note-item .note-type {
            font-weight: bold;
            color: #eab308;
            margin-right: 10px;
        }
        .note-item .note-date {
            color: #666;
            font-size: 0.9em;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #eab308;
            color: #666;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .container {
                box-shadow: none;
                padding: 20px;
            }
            .section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Comprehensive Business Report</h1>
            <p>Generated for: ${userName || 'User'}</p>
            <p>Date: ${currentDate}</p>
        </div>

        <!-- Financial Summary -->
        <div class="section">
            <h2 class="section-title">Financial Overview</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Total Revenue</h3>
                    <div class="value">${formatNumber(data.financial.totalRevenue)} Tsh</div>
                </div>
                <div class="summary-card">
                    <h3>Total Costs</h3>
                    <div class="value">${formatNumber(data.financial.totalCosts)} Tsh</div>
                </div>
                <div class="summary-card">
                    <h3>Profit</h3>
                    <div class="value" style="color: ${data.financial.profit >= 0 ? '#10b981' : '#ef4444'}">
                        ${formatNumber(data.financial.profit)} Tsh
                    </div>
                </div>
                <div class="summary-card">
                    <h3>Profit Margin</h3>
                    <div class="value">${data.financial.profitMargin}%</div>
                </div>
            </div>
        </div>

        <!-- Production Section -->
        <div class="section">
            <h2 class="section-title">Production Summary</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Total Batches</h3>
                    <div class="value">${data.production.summary.totalBatches}</div>
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
                    <div class="value">${data.production.summary.averageEfficiency}%</div>
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
                    <div class="value">${data.sales.summary.totalOrders}</div>
                </div>
                <div class="summary-card">
                    <h3>Total Revenue</h3>
                    <div class="value">${formatNumber(data.sales.summary.totalRevenue)} Tsh</div>
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

            <h3 style="margin-top: 30px; margin-bottom: 15px;">Top 5 Customers</h3>
            <table>
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Orders</th>
                        <th>Total Spent</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.sales.topCustomers.map(c => `
                        <tr>
                            <td>${c.name}</td>
                            <td>${c.count}</td>
                            <td>${formatNumber(c.total)} Tsh</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Procurement Section -->
        <div class="section">
            <h2 class="section-title">Procurement Summary</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Total Orders</h3>
                    <div class="value">${data.procurement.summary.totalOrders}</div>
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

            <h3 style="margin-top: 30px; margin-bottom: 15px;">Supplier Performance</h3>
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
                    ${data.procurement.supplierStats.map(s => `
                        <tr>
                            <td>${s.name}</td>
                            <td>${s.orders}</td>
                            <td>${formatNumber(s.totalQuantity)}</td>
                            <td>${formatNumber(s.totalCost)} Tsh</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Expenses Section -->
        <div class="section">
            <h2 class="section-title">Expenses Summary</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Total Expenses</h3>
                    <div class="value">${formatNumber(data.expenses.summary.totalExpenses)} Tsh</div>
                </div>
                <div class="summary-card">
                    <h3>Total Records</h3>
                    <div class="value">${data.expenses.summary.totalCount}</div>
                </div>
            </div>

            <h3 style="margin-top: 30px; margin-bottom: 15px;">Expenses by Category</h3>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(data.expenses.byCategory).map(([cat, amount]) => `
                        <tr>
                            <td>${cat}</td>
                            <td>${formatNumber(amount)} Tsh</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        

        <div class="footer">
            <p>Report generated on ${currentDate}</p>
            <p>MaizeTrack Inventory Management System</p>
        </div>
    </div>

    <script>
        // Production Chart
        const productionCtx = document.getElementById('productionChart').getContext('2d');
        new Chart(productionCtx, {
            type: 'line',
            data: {
                labels: ${JSON.stringify(data.production.chartData.map(d => d.period))},
                datasets: [
                    {
                        label: 'Maize Processed (kg)',
                        data: ${JSON.stringify(data.production.chartData.map(d => d.maizeProcessed || 0))},
                        borderColor: '#eab308',
                        backgroundColor: 'rgba(234, 179, 8, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Flour Produced (kg)',
                        data: ${JSON.stringify(data.production.chartData.map(d => d.flourProduced || 0))},
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Bran Produced (kg)',
                        data: ${JSON.stringify(data.production.chartData.map(d => d.branProduced || 0))},
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Production Trends Over Time'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Revenue vs Expenses Chart
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ${JSON.stringify(data.sales.chartData.map(d => d.period))},
                datasets: [
                    {
                        label: 'Revenue (Tsh)',
                        data: ${JSON.stringify(data.sales.chartData.map(d => d.revenue || 0))},
                        backgroundColor: 'rgba(16, 185, 129, 0.8)',
                        borderColor: '#10b981',
                        borderWidth: 1
                    },
                    {
                        label: 'Expenses (Tsh)',
                        data: ${JSON.stringify(data.sales.chartData.map(d => d.expenses || 0))},
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
                        text: 'Revenue vs Expenses Over Time'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Auto-print or download as PDF when loaded
        window.onload = function() {
            setTimeout(() => {
                window.print();
            }, 1000);
        };
    </script>
</body>
</html>`;
};

// Helper functions
const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(Number(num).toFixed(2));
};

const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

// Generate comprehensive PDF report
export const generateComprehensiveReport = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user name from database
    const userResult = await pool.query("SELECT name, username FROM users WHERE id = $1", [userId]);
    const userName = userResult.rows[0]?.name || userResult.rows[0]?.username || "User";

    // Get comprehensive data
    const data = await getComprehensiveReportData(userId);

    // Generate HTML
    const html = generateHTMLReport(data, userName);

    // Set headers for HTML response (can be printed as PDF from browser)
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `inline; filename="comprehensive_report_${new Date().toISOString().split('T')[0]}.html"`);
    
    res.send(html);
  } catch (error) {
    console.error("Error generating comprehensive report:", error);
    res.status(500).json({ message: "Failed to generate comprehensive report", error: error.message });
  }
};

