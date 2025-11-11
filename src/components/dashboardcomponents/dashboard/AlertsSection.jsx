import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, Bell } from "lucide-react";

export default function AlertsSection({ stocks }) {
  const [alerts, setAlerts] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const newAlerts = Object.entries(stocks).map(([stockName, qty], index) => {
      let type, title, message;

      if (qty < 100) {
        type = "warning";
        title = `${stockName.toUpperCase()} Stock Depleted`;
        message = `${stockName} stock is 0. Immediate action required!`;
      } else if (qty < 300) {
        type = "info";
        title = `${stockName.toUpperCase()} Running Low`;
        message = `Current ${stockName} stock is ${qty}kg. Consider placing a new order soon.`;
      } else {
        type = "success";
        title = `${stockName.toUpperCase()} Stock Sufficient`;
        message = `Current ${stockName} stock is ${qty}kg. No action needed.`;
      }

      return {
        id: index + 1,
        type,
        title,
        message,
      };
    });

    setAlerts(newAlerts);
  }, [stocks]);

  const getAlertIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "info":
        return <Info className="h-5 w-5 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertBg = (type) => {
    switch (type) {
      case "warning":
        return "bg-red-100 border-red-400";
      case "info":
        return "bg-yellow-100 border-yellow-300";
      case "success":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const visibleAlerts = showAll ? alerts : alerts.slice(0, 2);

  if (!alerts.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl border bg-white border-gray-200 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center mb-3">
        <Bell className="h-5 w-5 mr-2 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Stock Alerts</h3>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {visibleAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`p-2 rounded-lg border ${getAlertBg(
              alert.type
            )} flex items-start justify-between mb-2`}
          >
            <div className="flex items-start space-x-3">
              {getAlertIcon(alert.type)}
              <div>
                <p className="text-xs font-medium text-gray-900">
                  {alert.title}
                </p>
                <p className="text-xs mt-0.5 text-gray-600">{alert.message}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Show More / Show Less */}
      {alerts.length > 2 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-sm font-small text-blue-600 hover:underline"
        >
          {showAll ? "Show Less" : `View Other (${alerts.length - 2})`}
        </button>
      )}
    </motion.div>
  );
}
