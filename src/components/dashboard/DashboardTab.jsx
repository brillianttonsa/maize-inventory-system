import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { Loader2 } from "lucide-react"



const DashboardTab = () => {
  const [stats, setStats] = useState({
    totalProduction: 0,
    pendingOrders: 0,
    inventory: 0,
    totalSales: 0,
    totalCosts: 0,
    profit: 0,
    profitMargin: 0,
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
        const API = import.meta.env.VITE_API_URL
        const response = await axios(`${API}/dashboard`, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.status !== 200) {
        throw new Error("Failed to fetch dashboard data")
      }

      const data = response.data

      setStats({
        totalProduction: data.totalProduction || 0,
        pendingOrders: data.pendingOrders || 0,
        inventory: data.inventory || 0,
        totalSales: data.totalSales || 0,
        totalCosts: data.totalCosts || 0,
        profit: data.profit || 0,
        profitMargin: data.profitMargin || 0,
      })
      setLoading(false)
      setRefreshing(false)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchDashboardData()
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`flex items-center px-4 py-2 rounded-md text-white ${
            refreshing ? "bg-gray-400" : "bg-yellow-600 hover:bg-yellow-700"
          } transition-colors`}
        >
          {refreshing ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
              Refreshing...
            </>
          ) : (
            "Refresh Data"
          )}
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 bg-green-100 text-green-800">
            <h3 className="font-medium">Total Sales</h3>
          </div>
          <div className="p-4">
            <p className="text-2xl font-bold">{stats.totalSales.toLocaleString()}/=</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 bg-red-100 text-red-800">
            <h3 className="font-medium">Total Costs</h3>
          </div>
          <div className="p-4">
            <p className="text-2xl font-bold">{stats.totalCosts.toLocaleString()}/=</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 bg-yellow-100 text-yellow-800">
            <h3 className="font-medium">Profit</h3>
          </div>
          <div className="p-4">
            <p className="text-2xl font-bold">{stats.profit.toLocaleString()}/=</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 bg-blue-100 text-blue-800">
            <h3 className="font-medium">Profit Margin</h3>
          </div>
          <div className="p-4">
            <p className="text-2xl font-bold">{stats.profitMargin}%</p>
          </div>
        </motion.div>
      </div>

      {/* Interactive Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Business Trends</h3>
        <div className="bg-gray-100 rounded-lg p-4 h-80 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Interactive trend graph would be displayed here</p>
            <p className="text-sm text-gray-400">Showing sales, costs, and profit trends over time</p>
          </div>
        </div>
      </motion.div>

    </div>
  )
}

export default DashboardTab
