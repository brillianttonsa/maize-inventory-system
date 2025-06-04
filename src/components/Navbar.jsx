import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {Menu, X  } from "lucide-react"
import { useAuth } from "../context/AuthContext"

function Navbar (){
  const [isOpen, setIsOpen] = useState(false)
  // const { isAuthenticated, logout, currentUser } = useAuth()
  const navigate = useNavigate()
  const currentUser = "Tonsa"
  function isAuthenticated(){
    return true
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-yellow-600">
                MaizeTrack
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-yellow-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              {isAuthenticated() && (
                <Link
                  to="/dashboard"
                  className="border-transparent text-gray-500 hover:border-yellow-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/about"
                className="border-transparent text-gray-500 hover:border-yellow-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="border-transparent text-gray-500 hover:border-yellow-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated() ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, <span className="font-medium">{currentUser?.username}</span>
                  {currentUser?.role === "admin" && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">Admin</span>
                  )}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 cursor-pointer"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent border border-yellow-600 text-yellow-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500"
            >
              {!isOpen ? (
                <Menu className="h-6 w-6" />
              ) : (
                <X className="h-6 w-6"/>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="sm:hidden"
          >
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block pl-3 pr-4 py-2 border-l-4 text-center border-transparent font-medium text-gray-600 hover:bg-gray-50 hover:border-yellow-500 hover:text-gray-800"
              >
                Home
              </Link>
              {isAuthenticated() && (
                <Link
                  to="/dashboard"
                  className="block pl-3 pr-4 py-2 text-center border-l-4 border-transparent font-medium text-gray-600 hover:bg-gray-50 hover:border-yellow-500 hover:text-gray-800"
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/about"
                className="block pl-3 pr-4 py-2 text-center border-l-4 border-transparent font-medium text-gray-600 hover:bg-gray-50 hover:border-yellow-500 hover:text-gray-800"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block pl-3 pr-4 py-2 text-center border-l-4 border-transparent font-medium text-gray-600 hover:bg-gray-50 hover:border-yellow-500 hover:text-gray-800"
              >
                Contact
              </Link>
              {isAuthenticated() ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-center pl-3 pr-4 py-2 border-l-4 border-transparent font-medium text-gray-600 hover:bg-gray-50 cursor-pointer hover:border-yellow-500 hover:text-gray-800"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block pl-3 pr-4 py-2 border-l-4 text-center border-transparent font-medium text-gray-600 hover:bg-gray-50 hover:border-yellow-500 hover:text-gray-800"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block pl-3 pr-4 py-2 text-center border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-yellow-500 hover:text-gray-800"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
