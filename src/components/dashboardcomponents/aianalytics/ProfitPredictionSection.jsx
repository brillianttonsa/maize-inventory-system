"use client"

import { DollarSign, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const ProfitPredictionSection = ({ data }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const profitMargin =
    data.predicted_revenue && data.predicted_costs
      ? ((data.predicted_revenue - data.predicted_costs) / data.predicted_revenue) * 100
      : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <DollarSign className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Profit Prediction</h3>
            <p className="text-sm text-gray-600">Financial forecast (30 days)</p>
          </div>
        </div>
        <TrendingUp className="h-5 w-5 text-gray-400" />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Revenue</p>
          <p className="text-lg font-bold text-green-600">{formatCurrency(data.predicted_revenue || 0)}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Costs</p>
          <p className="text-lg font-bold text-red-600">{formatCurrency(data.predicted_costs || 0)}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Profit</p>
          <p className="text-lg font-bold text-blue-600">{formatCurrency(data.predicted_profit || 0)}</p>
        </div>
      </div>

      {/* Profit Margin */}
      <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Profit Margin</span>
          <span className="text-2xl font-bold text-yellow-600">{profitMargin.toFixed(1)}%</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(profitMargin, 100)}%` }}
          />
        </div>
      </div>

      {/* Chart */}
      {data.profit_trend && data.profit_trend.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.profit_trend}>
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
              <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[8, 8, 0, 0]} />
              <Bar dataKey="costs" fill="#ef4444" name="Costs" radius={[8, 8, 0, 0]} />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 4 }}
                name="Profit"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  )
}

export default ProfitPredictionSection
