import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useDashboardLogic } from "../hooks/useDashboardLogic";

import QuickActions from "../components/dashboardcomponents/dashboard/QuickActions";
import AlertsSection from "../components/dashboardcomponents/dashboard/AlertsSection";
import StatCard from "../components/dashboardcomponents/dashboard/Statcard";
import ProductionChart from "../components/dashboardcomponents/dashboard/ProductionChart";
import RecentActivity from "../components/dashboardcomponents/dashboard/RecentActivity";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { stats, stocks, loading } = useDashboardLogic();

  return (
    <div className="p-8 min-h-screen space-y-8">
      {/* Header */}
      <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome back,
            <span className="text-yellow-700">{currentUser?.name || "User"}! 👋</span> 
          </h2>
          <p className="mt-1 text-gray-600">
            Here's what's happening with your production today
          </p>
        </div>
      </motion.div>

      {/* Alerts */}
      {!loading && stocks && <AlertsSection stocks={stocks} />}

      {/* Stat cards */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Maize Processed" value={stats.totalMaize} unit="kg" borderColor="border-red-300" />
        <StatCard title="Flour Produced" value={stats.totalFlour} unit="kg" borderColor="border-yellow-500" />
        <StatCard title="Revenue Today" value={stats.totalRevenue} unit="/=" borderColor="border-green-500" />
      </motion.div>

      {/* Quick actions */}
      <QuickActions />

      {/* Charts and recent activity */}
      <motion.div className="grid grid-cols-1 gap-4">
        <ProductionChart />
        <RecentActivity />
      </motion.div>
    </div>
  );
}
