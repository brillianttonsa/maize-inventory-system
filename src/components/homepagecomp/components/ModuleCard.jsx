import {motion} from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle } from "lucide-react"
import { fadeIn } from "../../animations/Animations"


export const ModuleCard = ({ module, index }) => {
  
    return (
      <motion.div
        className={`flex flex-col items-center gap-12`}
        variants={fadeIn}
      >
          <div className={` p-8 rounded-xl `}>
            <div className="flex flex-col items-cnter ">
                <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  {module.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{module.title}</h3>
                <p className="text-yellow-900">{module.description}</p>
            </div>
            
          </div>
      </motion.div>
    )
}