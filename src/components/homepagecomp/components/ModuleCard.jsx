import {motion} from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle } from "lucide-react"
import { fadeIn } from "../../animations/Animations"


export const ModuleCard = ({ module, index }) => {
    const isEven = index % 2 === 0
  
    return (
      <motion.div
        className={`flex flex-col items-center gap-12`}
        variants={fadeIn}
      >
        <div>
          <div className={`bg-gradient-to-r ${module.color} p-8 rounded-xl text-white font-bold`}>
            <div className="flex items-center mb-6">
              <div className="bg-white/20 rounded-lg p-4">{module.icon}</div>
              <h3 className="text-3xl font-bold ml-4">{module.title}</h3>
            </div>
            <p className="text-lg mb-6">{module.description}</p>
            
          </div>
        </div>
      </motion.div>
    )
}