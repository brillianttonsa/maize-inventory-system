import { motion } from "framer-motion"
import { getKPIData } from "./kpis"

const OverviewKPI = ({ totals, maize, flour, bran }) => {
  // Pass the daily arrays to getKPIData
  const kpiData = getKPIData({ totals, maize, flour, bran })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
      {kpiData.map((kpi, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-6 rounded-xl shadow-xl bg-white`}
        >
            <div className={`p-3 rounded-lg ${kpi.color} w-fit mb-3`}>
              <kpi.icon className="h-6 w-6 text-white" />
            </div>
            
          <div>
            <p className={`text-2xl font-bold text-gray-900 mb-1`}>{kpi.value}</p>
            <p className={`text-sm text-gray-600`}>{kpi.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default OverviewKPI
