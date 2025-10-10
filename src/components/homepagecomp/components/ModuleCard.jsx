import {motion} from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle } from "lucide-react"
import { fadeIn } from "../../animations/Animations"


export const ModuleCard = ({ module, index }) => {
    const isEven = index % 2 === 0
  
    return (
      <motion.div
        className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12`}
        variants={fadeIn}
      >
        <div className="lg:w-1/2">
          <div className={`bg-gradient-to-r ${module.color} p-8 rounded-xl text-white font-bold`}>
            <div className="flex items-center mb-6">
              <div className="bg-white/20 rounded-lg p-4">{module.icon}</div>
              <h3 className="text-3xl font-bold ml-4">{module.title}</h3>
            </div>
            <p className="text-lg mb-6">{module.description}</p>
            
          </div>
        </div>
  
        <div className="lg:w-1/2">
          <div className="bg-gray-300 rounded-xl p-8">
            <h4 className="text-xl font-bold mb-6 ">Key Features:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-bold">
              {module.features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900 text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    )
}