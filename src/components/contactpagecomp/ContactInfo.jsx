import FeaturesContact from "./FeaturesContact"
import { motion } from "framer-motion"

export const ContactInfo = () => {
    return (
        <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Get in Touch</h2>
              <p className="text-lg text-gray-600 mb-8">
                I would love to hear from you. Whether you have a question about features, pricing, or anything else, 
                I am ready to answer all your questions.
              </p>

              <div className="space-y-6">
                {FeaturesContact.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start"
                  >
                    <div className="bg-yellow-100 p-3 rounded-full mr-4">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
        </motion.div>
    )
}