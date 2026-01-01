"use client"

import { FileText, Download, Calendar } from "lucide-react"
import { motion } from "framer-motion"

const SummaryReport = ({
  salesForecast,
  inventoryPrediction,
  yieldPrediction,
  profitPrediction,
  alerts,
  recommendations,
}) => {
  const generateReport = () => {
    const reportData = {
      generated_at: new Date().toISOString(),
      summary: {
        sales_forecast: salesForecast?.predicted_total_sales || 0,
        inventory_status: inventoryPrediction?.predicted_stock_level || 0,
        yield_efficiency: yieldPrediction?.production_efficiency || 0,
        predicted_profit: profitPrediction?.predicted_profit || 0,
      },
      alerts_count: alerts?.length || 0,
      recommendations_count: recommendations?.length || 0,
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ai-analytics-report-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <FileText className="h-6 w-6 text-gray-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Summary Report</h3>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              Generated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          onClick={generateReport}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Sales Forecast</p>
          <p className="text-lg font-bold text-blue-600">{formatCurrency(salesForecast?.predicted_total_sales || 0)}</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Stock Level</p>
          <p className="text-lg font-bold text-purple-600">
            {(inventoryPrediction?.predicted_stock_level || 0).toLocaleString()} kg
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Efficiency</p>
          <p className="text-lg font-bold text-green-600">
            {(yieldPrediction?.production_efficiency || 0).toFixed(1)}%
          </p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Profit</p>
          <p className="text-lg font-bold text-yellow-600">{formatCurrency(profitPrediction?.predicted_profit || 0)}</p>
        </div>
      </div>

      {/* Summary Text */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Executive Summary</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            Based on historical data analysis, the system predicts{" "}
            <span className="font-semibold text-blue-600">
              {formatCurrency(salesForecast?.predicted_total_sales || 0)}
            </span>{" "}
            in sales over the next 30 days with a growth rate of{" "}
            <span className="font-semibold">{(salesForecast?.growth_rate || 0).toFixed(1)}%</span>.
          </p>
          <p>
            Production efficiency is forecasted at{" "}
            <span className="font-semibold text-green-600">
              {(yieldPrediction?.production_efficiency || 0).toFixed(1)}%
            </span>
            , with inventory levels expected to reach{" "}
            <span className="font-semibold">
              {(inventoryPrediction?.predicted_stock_level || 0).toLocaleString()} kg
            </span>
            .
          </p>
          <p>
            Financial outlook shows a projected profit of{" "}
            <span className="font-semibold text-yellow-600">
              {formatCurrency(profitPrediction?.predicted_profit || 0)}
            </span>{" "}
            with {alerts?.length || 0} active alerts requiring attention and {recommendations?.length || 0} AI-generated
            recommendations to optimize operations.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default SummaryReport
