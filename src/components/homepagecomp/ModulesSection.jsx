import { modules } from "./components/Features"
import { motion } from "framer-motion"
import { staggerContainer } from "../animations/Animations"
import { ModuleCard } from "./components/ModuleCard"

export const ModulesSection = () => {
    
    return (
      <section className="relative py-20 bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 to-yellow-300/50 z-10"></div>
        <div className="relative container mx-auto px-4">
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl mb-4 font-bold">
              Three Powerful Modules, One Integrated System
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              MaizeTrack AI covers the entire value chain of your maize processing business with three specialized modules
              that work seamlessly together to provide complete visibility and control.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
          {modules.map((module, index) => (
              <ModuleCard key={index} module={module} index={index} />
              ))}
          </motion.div>
  
        </div>
      </section>
    )
  }