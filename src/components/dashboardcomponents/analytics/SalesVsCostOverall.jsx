import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const SalesVsCostOverall = ({ totals }) => {
  const profit = totals.totalSales - totals.totalCosts
  const margin = totals.totalSales > 0 ? ((profit / totals.totalSales) * 100).toFixed(1) : 0

  const data = [
    { name: "Overall", totalSales: totals.totalSales, totalCosts: totals.totalCosts },
  ]

  // Format Y-axis tick
  const formatYAxisTick = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toLocaleString()
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-lg shadow-lg bg-white border border-gray-200">
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString()} Tsh`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Format numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Number(num).toFixed(2))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl shadow-lg mt-6 bg-white border border-yellow-200"
    >
      <h3 className="text-lg font-semibold mb-6 text-yellow-700">
        Sales vs Total Costs (Overall)
      </h3>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Total Sales</p>
          <h4 className="text-xl font-semibold text-blue-700">{formatNumber(totals.totalSales)} Tsh</h4>
        </div>
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-gray-600 mb-1">Total Costs</p>
          <h4 className="text-xl font-semibold text-red-700">Tsh {formatNumber(totals.totalCosts)} </h4>
        </div>
        <div className={`p-4 rounded-lg border ${profit >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <p className="text-sm text-gray-600 mb-1">Net Profit</p>
          <h4 className={`text-xl font-semibold ${profit >= 0 ? "text-green-700" : "text-red-700"}`}>
            Tsh {formatNumber(profit)} 
          </h4>
          <p className="text-xs text-gray-500 mt-1">Margin: {margin}%</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" stroke="#6B7280" />
          <YAxis 
            stroke="#6B7280"
            tickFormatter={formatYAxisTick}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="totalSales" name="Total Sales (Tsh)" fill="#10B981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="totalCosts" name="Total Costs (Tsh)" fill="#EF4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default SalesVsCostOverall
