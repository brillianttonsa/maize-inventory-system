"use client"

import { Package, TrendingDown } from "lucide-react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const InventoryPredictionSection = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Package className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Inventory Prediction</h3>
            <p className="text-sm text-gray-600">Stock levels forecast</p>
          </div>
        </div>
        <TrendingDown className="h-5 w-5 text-gray-400" />
      </div>

      {/* Current vs Predicted */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Current Stock</p>
          <p className="text-2xl font-bold text-purple-600">{(data.current_total_stock || 0).toLocaleString()} kg</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Predicted (30d)</p>
          <p className="text-2xl font-bold text-orange-600">{(data.predicted_stock_level || 0).toLocaleString()} kg</p>
        </div>
      </div>

      {/* Chart */}
      {data.stock_forecast && data.stock_forecast.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.stock_forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="item" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="current" fill="#a855f7" name="Current Stock" radius={[8, 8, 0, 0]} />
              <Bar dataKey="predicted" fill="#fb923c" name="Predicted Stock" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Low Stock Warning */}
      {data.low_stock_items && data.low_stock_items.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Low Stock Alert
          </h4>
          <div className="space-y-2">
            {data.low_stock_items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200"
              >
                <span className="text-sm text-gray-700 capitalize">{item.name}</span>
                <span className="text-sm font-semibold text-red-600">{item.quantity} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default InventoryPredictionSection
