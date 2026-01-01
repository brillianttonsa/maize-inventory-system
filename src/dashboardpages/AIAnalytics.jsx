"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Brain, AlertTriangle, BarChart3, Loader2 } from "lucide-react"
import axios from "axios"

import SalesForecastSection from "../components/dashboardcomponents/aianalytics/SalesForecastSection"
import InventoryPredictionSection from "../components/dashboardcomponents/aianalytics/InventoryPredictionSection"
import YieldPredictionSection from "../components/dashboardcomponents/aianalytics/YieldPredictionSection"
import ProfitPredictionSection from "../components/dashboardcomponents/aianalytics/ProfitPredictionSection"
import AlertsSection from "../components/dashboardcomponents/aianalytics/AlertsSection"
import RecommendationsSection from "../components/dashboardcomponents/aianalytics/RecommendationsSection"
import SummaryReport from "../components/dashboardcomponents/aianalytics/SummaryReport"

const AIAnalytics = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [salesForecast, setSalesForecast] = useState(null)
  const [inventoryPrediction, setInventoryPrediction] = useState(null)
  const [yieldPrediction, setYieldPrediction] = useState(null)
  const [profitPrediction, setProfitPrediction] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [recommendations, setRecommendations] = useState([])

  const API_BASE = "http://localhost:5000/api"

  useEffect(() => {
    fetchAIAnalytics()
  }, [])

  const fetchAIAnalytics = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      }

      // Fetch all AI predictions in parallel
      const [salesRes, inventoryRes, yieldRes, profitRes, alertsRes, recRes] = await Promise.all([
        axios.get(`${API_BASE}/ai/predict-sales`, config),
        axios.get(`${API_BASE}/ai/predict-inventory`, config),
        axios.get(`${API_BASE}/ai/predict-yield`, config),
        axios.get(`${API_BASE}/ai/predict-profit`, config),
        axios.get(`${API_BASE}/ai/alerts`, config),
        axios.get(`${API_BASE}/ai/recommendations`, config),
      ])

      setSalesForecast(salesRes.data)
      setInventoryPrediction(inventoryRes.data)
      setYieldPrediction(yieldRes.data)
      setProfitPrediction(profitRes.data)
      setAlerts(alertsRes.data.alerts || [])
      setRecommendations(recRes.data.recommendations || [])
    } catch (err) {
      console.error("[v0] AI Analytics fetch error:", err)
      setError(err.response?.data?.message || "Failed to load AI analytics. Please ensure the AI service is running.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-600 mx-auto" />
          <p className="text-gray-600">Analyzing data with AI...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">AI Service Error</h3>
              <p className="text-red-700 text-sm mb-4">{error}</p>
              <button
                onClick={fetchAIAnalytics}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 min-h-screen space-y-8 bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">AI Analytics</h2>
            <p className="text-gray-600 mt-1">Predictive insights powered by machine learning</p>
          </div>
        </div>

        <button
          onClick={fetchAIAnalytics}
          className="mt-4 sm:mt-0 px-6 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium shadow-md flex items-center gap-2"
        >
          <BarChart3 className="h-5 w-5" />
          Refresh Analysis
        </button>
      </motion.div>

      {/* Alerts Section */}
      {alerts.length > 0 && <AlertsSection alerts={alerts} />}

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {salesForecast && <SalesForecastSection data={salesForecast} />}
        {inventoryPrediction && <InventoryPredictionSection data={inventoryPrediction} />}
        {yieldPrediction && <YieldPredictionSection data={yieldPrediction} />}
        {profitPrediction && <ProfitPredictionSection data={profitPrediction} />}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && <RecommendationsSection recommendations={recommendations} />}

      {/* Summary Report */}
      <SummaryReport
        salesForecast={salesForecast}
        inventoryPrediction={inventoryPrediction}
        yieldPrediction={yieldPrediction}
        profitPrediction={profitPrediction}
        alerts={alerts}
        recommendations={recommendations}
      />
    </div>
  )
}

export default AIAnalytics
