import { useState, useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

const CostVsSales = ({ data, totals, darkMode, formatNumber }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1) // 1-12
  const [page, setPage] = useState(1)
  const itemsPerPage = 7

  // --- Filter data by selected month/year ---
  const filteredData = useMemo(() => {
    return data
      .filter(d => {
        const date = new Date(d.period)
        return date.getMonth() + 1 === selectedMonth
      })
      .sort((a, b) => new Date(a.period) - new Date(b.period)) // sort ascending
  }, [data, selectedMonth])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1
  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  // Format Y-axis tick
  const formatYAxisTick = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toLocaleString()
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
          <p className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className={`text-sm`} style={{ color: entry.color }}>
              {`${entry.name}: ${formatNumber ? formatNumber(entry.value) : entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // --- Month Options ---
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  if (filteredData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"} mt-6`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Maize Cost vs Flour & Bran Sales
          </h3>
          <select
            value={selectedMonth}
            onChange={e => { setSelectedMonth(parseInt(e.target.value)); setPage(1) }}
            className={`border px-3 py-2 rounded ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
          >
            {months.map((m, idx) => (
              <option key={idx} value={idx + 1}>{m}</option>
            ))}
          </select>
        </div>
        <p className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No data available for selected month</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"} mt-6`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Maize Cost vs Flour & Bran Sales
        </h3>
        <div className="flex gap-2 items-center">
          <select
            value={selectedMonth}
            onChange={e => { setSelectedMonth(parseInt(e.target.value)); setPage(1) }}
            className={`border px-3 py-2 rounded ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
          >
            {months.map((m, idx) => (
              <option key={idx} value={idx + 1}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={paginatedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} />
          <XAxis 
            dataKey="periodFormatted" 
            stroke={darkMode ? "#9CA3AF" : "#6B7280"}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke={darkMode ? "#9CA3AF" : "#6B7280"}
            tickFormatter={formatYAxisTick}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="maizeCost" fill="#EF4444" name="Maize Cost (Tsh)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="flourBranRevenue" fill="#3B82F6" name="Flour & Bran Revenue (Tsh)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Pagination Controls */}
      {filteredData.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)} 
            className={`px-4 py-2 rounded-lg transition-colors ${
              page === 1 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
          >
            Previous
          </button>
          <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Page {page} of {totalPages}
          </span>
          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(page + 1)} 
            className={`px-4 py-2 rounded-lg transition-colors ${
              page === totalPages 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default CostVsSales
