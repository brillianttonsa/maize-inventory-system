import { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import NavbarDashboard from "../components/NavbarDashboard"
import DashboardTab from "../components/dashboard/DashboardTab"
import DataEntryTab from "../components/dashboard/DataEntryTab"
import ReportsTab from "../components/dashboard/ReportsTab"
import InventoryTab from "../components/dashboard/InventoryTab"
import tabs from "../components/utils/DashBoardTabs"

function Dashboard(){
  // const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const currentUser = "tonsa"

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />
      case "dataEntry":
        return <DataEntryTab />
      case "reports":
        return <ReportsTab />
      case "inventory":
        return <InventoryTab />
      default:
        return <DashboardTab />
    }
  }

  return (
    <>
      <NavbarDashboard/>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Maize Flour Production System</h1>
            <p className="text-gray-600">
              Welcome back, <span className="font-medium">{currentUser?.username}</span>
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md mb-6"
          >
            <div className="flex flex-wrap border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-yellow-600 border-b-2 border-yellow-600 bg-yellow-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="mr-2 text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
