import { motion } from "framer-motion"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts"
export const ChartWithPagination = ({ title, data, page, setPage, darkMode, lines = [], bars = [], formatNumber }) => {
    const itemsPerPage = 7
    const totalPages = Math.ceil(data.length / itemsPerPage) || 1
    const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  
    // Custom tooltip formatter
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
  
    // Format Y-axis tick
    const formatYAxisTick = (value) => {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
      return value.toLocaleString()
    }
  
    if (data.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl shadow-lg mt-8 ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <h3 className={`text-lg font-semibold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>{title}</h3>
          <p className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No data available</p>
        </motion.div>
      )
    }
  
    return (
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl shadow-lg mt-8 ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{title}</h3>
            {data.length > itemsPerPage && (
              <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Showing {((page - 1) * itemsPerPage) + 1}-{Math.min(page * itemsPerPage, data.length)} of {data.length} days
              </span>
            )}
          </div>
  
          <ResponsiveContainer width="100%" height={400}>
            {bars.length ? (
              <BarChart data={paginatedData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} />
                <XAxis 
                  dataKey="periodFormatted" 
                  stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={Math.floor(paginatedData.length / 10)}
                />
                <YAxis 
                  stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                  tickFormatter={formatYAxisTick}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {bars.map((b, idx) => {
                  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]
                  const names = {
                    maizeProcured: "Maize Procured (kg)",
                    maizeFlourProduced: "Flour Produced (kg)",
                    maizeCost: "Maize Cost (Tsh)",
                    flourBranRevenue: "Flour & Bran Revenue (Tsh)"
                  }
                  return (
                    <Bar 
                      key={idx} 
                      dataKey={b} 
                      fill={colors[idx % colors.length]}
                      name={names[b] || b}
                      radius={[4, 4, 0, 0]}
                    />
                  )
                })}
              </BarChart>
            ) : (
              <LineChart data={paginatedData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} />
                <XAxis 
                  dataKey="periodFormatted" 
                  stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={Math.floor(paginatedData.length / 10)}
                />
                <YAxis 
                  stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                  tickFormatter={formatYAxisTick}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {lines.map((l, idx) => {
                  const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B"]
                  const names = {
                    revenue: "Revenue (Tsh)",
                    expenses: "Expenses (Tsh)"
                  }
                  return (
                    <Line 
                      key={idx} 
                      type="monotone" 
                      dataKey={l} 
                      stroke={colors[idx % colors.length]} 
                      strokeWidth={3}
                      name={names[l] || l}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  )
                })}
              </LineChart>
            )}
          </ResponsiveContainer>
  
          {data.length > itemsPerPage && (
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
      </div>
    )
  }