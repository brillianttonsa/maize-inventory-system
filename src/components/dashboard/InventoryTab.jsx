import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import api from "../../services/api"

const InventoryTab = () => {
  const [activeSection, setActiveSection] = useState("current")
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0], // Default to 1 month ago
    endDate: new Date().toISOString().split("T")[0], // Default to today
  })
  const [reportType, setReportType] = useState("detailed")
  const [exportFormat, setExportFormat] = useState("excel")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [inventoryData, setInventoryData] = useState({
    rawMaterials: [],
    finishedProducts: [],
    lowStockItems: [],
    valuation: {
      rawMaterialsValue: 0,
      finishedProductsValue: 0,
      totalInventoryValue: 0,
    },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchInventoryData()
  }, [])

  const fetchInventoryData = async () => {
    try {
      setError(null)
      const response = await api.get("/inventory/current")
      setInventoryData((prev) => ({ ...prev, ...response.data.data }))
      setLoading(false)
    } catch (error) {
      console.error("Error fetching inventory data:", error)
      setError(error.response?.data?.message || "Failed to fetch inventory data")
      setLoading(false)
    }
  }

  const handleDateChange = (e) => {
    const { name, value } = e.target
    setDateRange({
      ...dateRange,
      [name]: value,
    })
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)

    try {
      const response = await api.get("/inventory/report", {
        params: {
          reportType,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      })

      setIsGenerating(false)
      alert(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully!`)
    } catch (error) {
      console.error("Error generating inventory report:", error)
      setIsGenerating(false)
      alert(error.response?.data?.message || "Failed to generate report. Please try again.")
    }
  }

  const handleExportReport = async () => {
    try {
      const response = await api.get(`/inventory/export/${exportFormat.toLowerCase()}`, {
        responseType: "blob",
      })

      // Create a download link and trigger the download
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const filename = `inventory-report-${timestamp}.${exportFormat.toLowerCase()}`

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)

      alert(`${exportFormat.toUpperCase()} report downloaded successfully!`)
    } catch (error) {
      console.error("Error exporting inventory report:", error)
      alert(error.response?.data?.message || `Failed to export report as ${exportFormat}. Please try again.`)
    }
  }

  const handleDirectExport = async (format) => {
    try {
      const response = await api.get(`/inventory/export/${format.toLowerCase()}`, {
        responseType: "blob",
      })

      // Create a download link and trigger the download
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const filename = `inventory-report-${timestamp}.${format.toLowerCase()}`

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)

      alert(`${format.toUpperCase()} report downloaded successfully!`)
    } catch (error) {
      console.error(`Error exporting inventory report as ${format}:`, error)
      alert(error.response?.data?.message || `Failed to export report as ${format}. Please try again.`)
    }
  }

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true)
    try {
      const response = await api.post("/inventory/backup")
      setIsCreatingBackup(false)
      alert("Database backup created successfully!")
    } catch (error) {
      console.error("Error creating backup:", error)
      setIsCreatingBackup(false)
      alert(error.response?.data?.message || "Failed to create backup. Please try again.")
    }
  }

  const handleRestoreBackup = async (backupId) => {
    setIsRestoring(true)
    try {
      const response = await api.post(`/inventory/restore/${backupId}`)
      setIsRestoring(false)
      alert(`Backup #${backupId} restored successfully!`)
    } catch (error) {
      console.error("Error restoring backup:", error)
      setIsRestoring(false)
      alert(error.response?.data?.message || "Failed to restore backup. Please try again.")
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Inventory Tracking</h2>

      {/* Section Navigation */}
      <div className="flex flex-wrap mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: "current", label: "Current Inventory", icon: "📦" },
          { id: "reports", label: "Detailed Reports", icon: "📊" },
          { id: "backup", label: "Backup & Restore", icon: "💾" },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeSection === section.id
                ? "bg-white text-yellow-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
            }`}
          >
            <span className="mr-2">{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Current Inventory Section */}
      {activeSection === "current" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">Error: {error}</p>
              <button
                onClick={fetchInventoryData}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Raw Materials */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Raw Materials</h3>
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-600"></div>
                </div>
              ) : inventoryData.rawMaterials.length > 0 ? (
                <div className="space-y-3">
                  {inventoryData.rawMaterials.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                      <span>{item.item_name}</span>
                      <span className="font-semibold">
                        {item.quantity} {item.unit}
                      </span>
                      {item.is_low_stock && <span className="text-red-600 text-sm font-medium">LOW STOCK</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No raw materials data</p>
                  <p className="text-sm text-gray-400">Add raw materials through the Data Entry tab.</p>
                </div>
              )}
              <button
                onClick={fetchInventoryData}
                className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors w-full"
              >
                Refresh Inventory
              </button>
            </div>

            {/* Finished Products */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Finished Products</h3>
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-600"></div>
                </div>
              ) : inventoryData.finishedProducts.length > 0 ? (
                <div className="space-y-3">
                  {inventoryData.finishedProducts.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                      <span>{item.item_name}</span>
                      <span className="font-semibold">
                        {item.quantity} {item.unit}
                      </span>
                      {item.is_low_stock && <span className="text-red-600 text-sm font-medium">LOW STOCK</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No finished products data</p>
                  <p className="text-sm text-gray-400">Products will appear here after production entries.</p>
                </div>
              )}
              <button
                onClick={fetchInventoryData}
                className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors w-full"
              >
                Refresh Stock
              </button>
            </div>
          </div>

          {/* Low Stock Alerts */}
          {inventoryData.lowStockItems.length > 0 ? (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <h4 className="text-lg font-semibold text-red-800 mb-2">Low Stock Alerts</h4>
              <div className="space-y-2">
                {inventoryData.lowStockItems.map((item) => (
                  <p key={item.id} className="text-red-700">
                    ⚠️ {item.item_name}: Only {item.quantity} {item.unit} remaining (below threshold of{" "}
                    {item.threshold_level})
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h4 className="text-lg font-semibold text-green-800 mb-2">Inventory Status</h4>
              <p className="text-green-700">
                {inventoryData.rawMaterials.length > 0 || inventoryData.finishedProducts.length > 0
                  ? "All items are above minimum stock levels"
                  : "No inventory data available yet"}
              </p>
            </div>
          )}

          {/* Export Buttons */}
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={() => handleDirectExport("excel")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export Excel
            </button>
            <button
              onClick={() => handleDirectExport("pdf")}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export PDF
            </button>
          </div>

          {/* Inventory Valuation */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Inventory Valuation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Raw Materials Value</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {inventoryData.valuation.rawMaterialsValue.toLocaleString()}/=
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-1">Finished Products Value</h4>
                <p className="text-2xl font-bold text-green-600">
                  {inventoryData.valuation.finishedProductsValue.toLocaleString()}/=
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-purple-800 mb-1">Total Inventory Value</h4>
                <p className="text-2xl font-bold text-purple-600">
                  {inventoryData.valuation.totalInventoryValue.toLocaleString()}/=
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Detailed Reports Section */}
      {activeSection === "reports" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Generate Inventory Reports</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <select
                id="reportType"
                name="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="detailed">Detailed Inventory</option>
                <option value="valuation">Inventory Valuation</option>
                <option value="trend">Trend Analysis</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="exportFormat" className="block text-sm font-medium text-gray-700 mb-1">
                Export Format
              </label>
              <select
                id="exportFormat"
                name="exportFormat"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="excel">Excel (.xlsx)</option>
                <option value="csv">CSV (.csv)</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleExportReport}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Export Report
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className={`px-6 py-3 rounded-md text-white font-medium ${
                isGenerating ? "bg-gray-400" : "bg-yellow-600 hover:bg-yellow-700"
              } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
            >
              {isGenerating ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating Report...
                </span>
              ) : (
                "Generate Report"
              )}
            </button>
          </div>

          {/* Report Preview */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">Report Preview</h4>
            <div className="bg-white p-4 rounded border border-gray-200 h-64 flex items-center justify-center">
              <p className="text-gray-500">Report preview will appear here after generation</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Backup & Restore Section */}
      {activeSection === "backup" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Database Backup & Restore</h3>

          <div className="mb-8">
            <h4 className="text-lg font-medium mb-4 text-gray-800">Create New Backup</h4>
            <p className="text-gray-600 mb-4">
              Create a backup of your current database. This will save all your inventory data, sales records, and
              production information.
            </p>
            <button
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
              className={`px-6 py-3 rounded-md text-white font-medium ${
                isCreatingBackup ? "bg-gray-400" : "bg-yellow-600 hover:bg-yellow-700"
              } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
            >
              {isCreatingBackup ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Backup...
                </span>
              ) : (
                "Create Backup"
              )}
            </button>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-800">Backup History</h4>
            <div className="bg-gray-50 rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Backup ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { id: 1, date: "2023-05-15 14:30:22", size: "4.2 MB" },
                      { id: 2, date: "2023-05-10 09:15:47", size: "4.0 MB" },
                      { id: 3, date: "2023-05-05 16:45:33", size: "3.8 MB" },
                    ].map((backup) => (
                      <tr key={backup.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{backup.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{backup.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{backup.size}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleRestoreBackup(backup.id)}
                            disabled={isRestoring}
                            className="text-yellow-600 hover:text-yellow-900 mr-3"
                          >
                            {isRestoring ? "Restoring..." : "Restore"}
                          </button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <h4 className="text-lg font-semibold text-yellow-800 mb-2">Important Note</h4>
            <p className="text-yellow-700">
              Restoring a backup will replace all current data with the data from the backup. This action cannot be
              undone. Make sure to create a new backup before restoring an old one.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default InventoryTab
