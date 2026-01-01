"use client"

import { AlertTriangle, AlertCircle, Info } from "lucide-react"
import { motion } from "framer-motion"

const AlertsSection = ({ alerts }) => {
  const getAlertIcon = (severity) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getAlertStyles = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-300 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-300 text-yellow-800"
      default:
        return "bg-blue-50 border-blue-300 text-blue-800"
    }
  }

  if (!alerts || alerts.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <h3 className="text-lg font-semibold text-gray-900">Alerts & Warnings</h3>
        <span className="ml-auto bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
          {alerts.length} Active
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex items-start gap-3 p-4 rounded-lg border ${getAlertStyles(alert.severity)}`}
          >
            <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.severity)}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
              <p className="text-sm opacity-90">{alert.message}</p>
              {alert.action && <p className="text-xs mt-2 font-medium">Recommended: {alert.action}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default AlertsSection
