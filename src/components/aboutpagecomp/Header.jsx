import { motion } from "framer-motion"

export const Header = () => {
    return (
        <section className="bg-yellow-600 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-white"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About MaizeTrackAI</h1>
              <p className="text-xl max-w-3xl mx-auto">
                The complete solution for maize flour production tracking and management
              </p>
            </motion.div>
          </div>
        </section>
    )
}