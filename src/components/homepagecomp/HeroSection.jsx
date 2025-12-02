import { pulseAnimation } from "../animations/Animations"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export const HeroSection = () => {
    return (
        <section className="relative sm:py-24 px-4 py-20 overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.jpg')" }}
            >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/80 to-yellow-800/80 z-10"></div>
                
            <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl text-white"
                >
                <motion.div
                    className="inline-block mb-4 px-2 sm:px-4 py-2 bg-yellow-200 text-green-800 rounded-full text-sm font-medium"
                    animate={pulseAnimation}
                >
                    🌽 Complete Maize Processing Solution
                </motion.div>
                <motion.h1
                    className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    Transform Your <span className=" text-green-400">Maize Processing</span> Business with our all-in-one management system
                </motion.h1>
                
                <div className="flex flex-wrap gap-4">
                    <Link to="/login">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-yellow-700 px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                        Login
                    </motion.button>
                    </Link>
                    <Link to="/about">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-transparent border-2 border-white text-white px-4 py-3 rounded-lg font-medium hover:bg-white/10 transition-all"
                    >
                        Learn More
                    </motion.button>
                    </Link>
                </div>
                </motion.div>
            </div>
        </section>
    )
}