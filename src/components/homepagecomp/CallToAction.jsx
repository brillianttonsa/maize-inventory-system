import {motion} from "framer-motion"
import { Link } from "react-router-dom"

export const CallToAction = () => {
    return (
        <section className="bg-yellow-200 py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Ready to optimize your production?</h2>
              <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
                This system helps you track every aspect of your maize flour production, from raw material intake to
                finished product distribution.
              </p>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-400 cursor-pointer text-white px-8 py-3 rounded-lg font-medium shadow-md hover:bg-yellow-600 transition-colors"
                >
                  Get Started
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
    )
}