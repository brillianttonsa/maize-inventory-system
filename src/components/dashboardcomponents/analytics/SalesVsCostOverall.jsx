import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const SalesVsCostOverall = ({ totals }) => {
  const profit = totals.totalSales - totals.totalCosts
  const margin = totals.totalCosts > 0 ? ((profit / totals.totalCosts) * 100).toFixed(1) : 0

  const data = [
    { name: "Overall", totalSales: totals.totalSales, totalCost: totals.totalCosts },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl shadow-lg mt-6 bg-white  border-yellow-200"`}
    >
        <h3 className={`text-lg font-semibold mb-6 text-gray-900"}`}>
            Sales vs Total Costs (Overall)
        </h3>

        {/* KPI Summary */}
        <div className={`p-4 mb-6 ${profit > 0? "bg-green-100": "bg-red-100"} rounded-lg`}>
            <p className="text-sm text-gray-600 font-semibold">Profit Margin</p>
            <h4 className="text-sm sm:text-lg lg:text-xl font-semibold">{margin}%</h4>
        </div>

      {/* Chart */}
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={"#E5E7EB"} />
            <XAxis dataKey="name" stroke={"#6B7280"} />
            <YAxis stroke={"#6B7280"} />
            <Tooltip
                contentStyle={{
                backgroundColor: "#FFF",
                border: "1px solid #ccc",
                borderRadius: 8,
                }}
            />
            <Legend />
            <Bar dataKey="totalSales" name="Sales" fill="#3B82F6" />
            <Bar dataKey="totalCost" name="Total Cost" fill="#EF4444" />
            </BarChart>
        </ResponsiveContainer>
    </motion.div>
  )
}

export default SalesVsCostOverall
