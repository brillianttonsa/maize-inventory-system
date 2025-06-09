import { motion } from "framer-motion"
import FeaturesAbout from "../components/utils/FeaturesAbout"
import Navbar from "../components/Navbar"

function About(){
  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
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

        {/* System Overview */}
        <section className="py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">The System</h2>
              <p className="text-lg text-gray-600 mb-6">
                MaizeTrackAI is a system designed to revolutionize how maize flour production is managed and tracked.
                It was created in response to common challenges faced in the industry, such as tracking inventory accurately,
                and optimizing production processes.
              </p>
              <p className="text-lg text-gray-600">
                I, as a software developer came to create a comprehensive solution that
                addresses these challenges, helping maize flour producers increase efficiency, reduce waste, and maintain
                consistent quality.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Mission</h2>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-600">
                <p className="text-lg italic text-gray-700">
                  "To empower maize flour producers with cutting-edge technology that enhances production efficiency,
                  ensures product quality, and drives business growth."
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl sm:text-3xl font-bold mb-6 text-gray-800">Why Choose MaizeTrackAISystem?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {FeaturesAbout.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>


        {/* Call to Action */}
        <section className="py-16 bg-yellow-600 text-white">
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
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/signup"
                  className="bg-white text-yellow-600 px-8 py-3 rounded-lg font-medium shadow-md hover:bg-gray-100 transition-colors"
                >
                  Sign Up Now
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/contact"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default About
