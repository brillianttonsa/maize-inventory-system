"use client"

import { Wheat, Activity } from "lucide-react"
import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const YieldPredictionSection = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Wheat className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Yield Prediction</h3>
            <p className="text-sm text-gray-600">Production efficiency forecast</p>
          </div>
        </div>
        <Activity className="h-5 w-5 text-gray-400" />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Flour Yield</p>
          <p className="text-xl font-bold text-green-600">{(data.predicted_flour_yield || 0).toFixed(1)}%</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Bran Yield</p>
          <p className="text-xl font-bold text-yellow-600">{(data.predicted_bran_yield || 0).toFixed(1)}%</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Efficiency</p>
          <p className="text-xl font-bold text-blue-600">{(data.production_efficiency || 0).toFixed(1)}%</p>
        </div>
      </div>

      {/* Chart */}
      {data.yield_history && data.yield_history.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.yield_history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" tickFormatter={(value) => `${value}%`} />
              <Tooltip
                formatter={(value) => `${value.toFixed(1)}%`}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="flour_yield"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Flour Yield"
              />
              <Area
                type="monotone"
                dataKey="bran_yield"
                stackId="1"
                stroke="#eab308"
                fill="#eab308"
                fillOpacity={0.6}
                name="Bran Yield"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recommendations */}
      {data.efficiency_tips && data.efficiency_tips.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Efficiency Tips</h4>
          <ul className="space-y-2">
            {data.efficiency_tips.map((tip, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}

export default YieldPredictionSection
