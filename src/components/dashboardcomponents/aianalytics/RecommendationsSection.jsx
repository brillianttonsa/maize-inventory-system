"use client"

import { Lightbulb, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

const RecommendationsSection = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border border-yellow-200"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-500 rounded-lg">
          <Lightbulb className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
          <p className="text-sm text-gray-600">Actionable insights to improve operations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + idx * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      rec.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : rec.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {rec.priority || "medium"}
                  </span>
                  <h4 className="font-semibold text-gray-900 text-sm">{rec.title}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                {rec.impact && (
                  <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                    <ChevronRight className="h-3 w-3" />
                    <span>Impact: {rec.impact}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default RecommendationsSection
