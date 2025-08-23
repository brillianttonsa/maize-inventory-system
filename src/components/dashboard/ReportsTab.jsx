import { useState } from "react"
import { motion } from "framer-motion"
import api from "../../services/api"

const ReportsTab = () => {
  const [activeSection, setActiveSection] = useState("generate")
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })
  const [reportType, setReportType] = useState("comprehensive")
  const [exportFormat, setExportFormat] = useState("excel")
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [error, setError] = useState(null)

  const handleDateChange = (e) => {
    const { name, value } = e.target
    setDateRange({
      ...dateRange,
      [name]: value,
    })
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await api.get("/reports/generate", {
        params: {
          reportType,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      })

      setReportData(response.data)
      setIsGenerating(false)
      alert(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully!`)
    } catch (error) {
      console.error("Error generating report:", error)
      setError(error.response?.data?.message || "Failed to generate report")
      setIsGenerating(false)
    }
  }

  const handleExportReport = async () => {
    try {
      const response = await api.get(`/reports/export/${exportFormat.toLowerCase()}`, {
        params: {
          reportType,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
        responseType: "blob",
      })

      // Create a download link and trigger the download
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const filename = `${reportType}-report-${timestamp}.${exportFormat.toLowerCase()}`

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
      console.error("Error exporting report:", error)
      alert(error.response?.data?.message || `Failed to export report as ${exportFormat}. Please try again.`)
    }
  }

  const handleDirectExport = async (format) => {
    try {
      const response = await api.get(`/reports/export/${format.toLowerCase()}`, {
        params: {
          reportType,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
        responseType: "blob",
      })

      // Create a download link and trigger the download
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const filename = `${reportType}-report-${timestamp}.${format.toLowerCase()}`

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
      console.error(`Error exporting report as ${format}:`, error)
      alert(error.response?.data?.message || `Failed to export report as ${format}. Please try again.`)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Reports & Analytics</h2>

      {/* Section Navigation */}
      <div className="flex flex-wrap mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: "generate", label: "Generate Reports", icon: "📊" },
          { id: "scheduled", label: "Scheduled Reports", icon: "⏰" },
          { id: "templates", label: "Report Templates", icon: "📋" },
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

      {/* Generate Reports Section */}
      {activeSection === "generate" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Generate Custom Reports</h3>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">Error: {error}</p>
            </div>
          )}

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
                <option value="comprehensive">Comprehensive Report</option>
                <option value="financial">Financial Summary</option>
                <option value="production">Production Analysis</option>
                <option value="sales">Sales Performance</option>
                <option value="inventory">Inventory Status</option>
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
                <option value="pdf">PDF (.pdf)</option>
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

          <div className="flex justify-center mb-6">
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

          {/* Quick Export Buttons */}
          <div className="flex justify-center space-x-2 mb-6">
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
              Quick Excel Export
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
              Quick PDF Export
            </button>
          </div>

          {/* Report Preview */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">Report Preview</h4>
            <div className="bg-white p-4 rounded border border-gray-200 h-64 flex items-center justify-center">
              {reportData ? (
                <div className="text-center">
                  <p className="text-green-600 mb-2">✓ Report generated successfully</p>
                  <p className="text-sm text-gray-600">Report data is ready for export</p>
                </div>
              ) : (
                <p className="text-gray-500">Report preview will appear here after generation</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Scheduled Reports Section */}
      {activeSection === "scheduled" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Scheduled Reports</h3>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Scheduled reports feature coming soon</p>
            <p className="text-sm text-gray-400">
              Set up automatic report generation and email delivery on a schedule.
            </p>
          </div>
        </motion.div>
      )}

      {/* Report Templates Section */}
      {activeSection === "templates" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Report Templates</h3>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Custom report templates feature coming soon</p>
            <p className="text-sm text-gray-400">Create and save custom report templates for repeated use.</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ReportsTab
