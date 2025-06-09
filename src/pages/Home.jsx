import Navbar from "../components/Navbar"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import FeaturesHome from "../components/utils/FeaturesHome"

function Home(){
  

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/80 to-yellow-800/80 z-10"></div>
          
          <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-white"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Effortless Maize Flour Production and Inventory Management</h1>
              <p className="text-xl mb-8">
                Efficiently manage and monitor your maize flour production process from start to finish.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-yellow-700 px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-all"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 text-gray-800"
          >
            Key Features
          </motion.h2>

          <div className="grid  md:grid-cols-3 gap-8">
            {FeaturesHome.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-yellow-500 py-16">
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
                  className="bg-yellow-600 cursor-pointer text-white px-8 py-3 rounded-lg font-medium shadow-md hover:bg-yellow-700 transition-colors"
                >
                  Get Started
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home
