import FeaturesAbout from "./FeaturesAbout"
import { motion } from "framer-motion"

export const SystemOverview = ()=> {
    return (
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
              <h2 className="text-xl sm:text-3xl font-bold mb-6 text-gray-800">Why Choose MaizeTrackAI System?</h2>
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
    )
}