import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useDashboardLogic } from '../hooks/useDashboardLogic';

import QuickActions from '../components/dashboard/dashboard/QuickActions';
import AlertsSection from '../components/dashboard/dashboard/AlertsSection';
import StatCard from '../components/dashboard/dashboard/Statcard';
import ProductionChart from '../components/dashboard/dashboard/ProductionChart';
import RecentActivity from '../components/dashboard/dashboard/RecentActivity';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { stats, stocks, loading, error } = useDashboardLogic();

  return (
    <div className="p-8 min-h-screen space-y-8">
      <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome back,
            <span className="text-yellow-700"> {currentUser?.name || 'User'}! 👋</span>
          </h2>
          <p className="mt-1 text-gray-600">Here's what's happening with your production today</p>
        </div>
      </motion.div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          Some dashboard data could not be loaded. Please refresh to try again.
        </p>
      )}

      {!loading && stocks && <AlertsSection stocks={stocks} />}

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Maize Processed" value={stats.totalMaize} unit="kg" borderColor="border-red-300" />
        <StatCard title="Flour Produced" value={stats.totalFlour} unit="kg" borderColor="border-yellow-500" />
        <StatCard title="Sales Revenue Today" value={stats.totalRevenue} unit="/=" borderColor="border-green-500" />
      </motion.div>

      <QuickActions />

      <motion.div className="grid grid-cols-1 gap-4">
        <ProductionChart />
        <RecentActivity />
      </motion.div>
    </div>
  );
}
