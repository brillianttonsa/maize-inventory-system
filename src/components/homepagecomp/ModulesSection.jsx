import { modules } from "./Features"
import { motion } from "framer-motion"
import { staggerContainer } from "../animations/Animations"
import { ModuleCard } from "./components/ModuleCard"

export const ModulesSection = () => {
    
    return (
      <section className="relative py-20 bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/30 to-yellow-200/50 z-10"></div>
        <div className="relative container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl mb-4 font-bold">
              Three Powerful Modules, One Integrated System
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              MaizeTrackAI covers the entire value chain of your maize processing business with three specialized modules
              that work seamlessly together to provide complete visibility and control.
            </p>
          </motion.div>
  
          <motion.div
            className="space-y-12"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {modules.map((module, index) => (
              <ModuleCard key={index} module={module} index={index} />
            ))}
          </motion.div>
        </div>
      </section>
    )
  }