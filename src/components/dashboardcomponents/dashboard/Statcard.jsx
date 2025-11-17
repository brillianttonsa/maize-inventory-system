import { motion } from "framer-motion"

const StatCard = ({ title, value, unit, borderColor  }) => {

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`p-6 rounded-xl shadow-md border-l-4 ${borderColor}  "bg-white border-gray-200 transition-all duration-200`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <p className={`text-sm font-medium text-gray-500`}>
            {title}
          </p>

          <div className="flex items-baseline mt-2">
            <h4 className={`text-3xl font-semibold $text-gray-900`}>
              {value.toLocaleString()} {unit}
            </h4>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard
