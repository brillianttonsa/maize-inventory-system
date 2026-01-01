"use client"

import { TrendingUp, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const SalesForecastSection = ({ data }) => {
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
      transition={{ delay: 0.1 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sales Forecast</h3>
            <p className="text-sm text-gray-600">Next 30 days prediction</p>
          </div>
        </div>
        <Calendar className="h-5 w-5 text-gray-400" />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Predicted Sales</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(data.predicted_total_sales || 0)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
          <p className="text-2xl font-bold text-green-600">{(data.growth_rate || 0).toFixed(1)}%</p>
        </div>
      </div>

      {/* Chart */}
      {data.forecast && data.forecast.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" tickFormatter={(value) => `$${value}`} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="predicted_sales"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 3 }}
                name="Predicted Sales"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Product Breakdown */}
      {data.product_breakdown && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Product Forecast</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(data.product_breakdown).map(([product, value]) => (
              <div key={product} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700 capitalize">{product}</span>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default SalesForecastSection
