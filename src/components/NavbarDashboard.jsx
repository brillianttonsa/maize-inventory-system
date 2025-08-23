import { useAuth } from "../context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

function NavbarDashboard() {
    const [isOpen, setIsOpen] = useState(false)
    const { isAuthenticated, logout, currentUser } = useAuth()
    const handleLogout = () => {
        logout()
        navigate("/")
    }
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-12 m-2">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold text-yellow-600">
                                Dashboard
                            </h1> 
                            {/* link */}
                        </div>
                    </div>
            
                    <div className="sm:flex items-center space-x-4 hidden ">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 cursor-pointer"
                        >
                            Logout
                        </motion.button>
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
                        <button
                        onClick={handleLogout}
                        className="block w-full text-center pl-3 pr-4 py-2 border-l-4 border-transparent font-medium text-gray-600 hover:bg-gray-50 cursor-pointer hover:border-yellow-500 hover:text-gray-800"
                        >
                            Logout
                        </button>
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
export default NavbarDashboard;