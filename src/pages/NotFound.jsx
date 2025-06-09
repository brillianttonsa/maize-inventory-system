import { Link } from "react-router-dom"
import { motion } from "framer-motion"

function NotFound(){
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-yellow-600">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h2>
        <p className="mt-2 text-lg text-gray-600">The page you are looking for doesn't exist or has been moved.</p>
        <div className="mt-6">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-yellow-700 transition-colors"
            >
              Go Back Home
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound
