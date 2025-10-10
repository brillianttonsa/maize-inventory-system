import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export const CallForAction = () => {
    return (
        <section className="py-16 bg-yellow-200 ">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Ready to transform your production process?</h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Join for better optimization of your operations ith MaizeTrackAI.
              </p>
              <div className="flex justify-center space-x-4">
                
                <Link to="/signup" className=" text-yellow-900 px-8 py-3 rounded-lg font-medium shadow-md hover:bg-gray-100 transition-colors">
                  Sign Up Now  
                </Link>
                <Link to="/contact" className="bg-transparent border-2 border-yellow-600  px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
    )
}