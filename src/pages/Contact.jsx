import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock } from 'lucide-react';


function Contact(){
  
  return (
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Have questions about MaizeTrack? Am here to help. Reach me to out.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information and Form */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Get in Touch</h2>
            <p className="text-lg text-gray-600 mb-8">
              I love to hear from you. Whether you have a question about features, pricing, or anything else, 
              Am ready to answer all your questions.
            </p>

            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b transition duration-300 ease-in-out hover:bg-yellow-50 hover:scale-[1.01]">
                  <td className="p-3 align-top">
                    <div className="bg-yellow-100 p-3 rounded-full inline-block transition duration-300 hover:rotate-6">
                      <MapPin className="h-6 w-6 text-yellow-600" />
                    </div>
                  </td>
                  <td className="p-3">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">Address</h3>
                    <p className="text-gray-600">Mbezi-Luis</p>
                  </td>
                </tr>

                <tr className="border-b transition duration-300 ease-in-out hover:bg-yellow-50 hover:scale-[1.01]">
                  <td className="p-3 align-top">
                    <div className="bg-yellow-100 p-3 rounded-full inline-block transition duration-300 hover:rotate-6">
                      <Phone className="h-6 w-6 text-yellow-600" />
                    </div>
                  </td>
                  <td className="p-3">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">Phone</h3>
                    <p className="text-gray-600">+255 683 208 698</p>
                  </td>
                </tr>

                <tr className="border-b transition duration-300 ease-in-out hover:bg-yellow-50 hover:scale-[1.01]">
                  <td className="p-3 align-top">
                    <div className="bg-yellow-100 p-3 rounded-full inline-block transition duration-300 hover:rotate-6">
                      <Mail className="h-6 w-6 text-yellow-600" />
                    </div>
                  </td>
                  <td className="p-3">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">abdullatifmnyamis@gmail.com</p>
                  </td>
                </tr>

                <tr className="transition duration-300 ease-in-out hover:bg-yellow-50 hover:scale-[1.01]">
                  <td className="p-3 align-top">
                    <div className="bg-yellow-100 p-3 rounded-full inline-block transition duration-300 hover:rotate-6">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </td>
                  <td className="p-3">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">Time</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-gray-600">Saturday and Sunday: Closed</p>
                  </td>
                </tr>
              </tbody>
            </table>


          </motion.div>

          
        </div>
      </section>

      
    </div>
  )
}

export default Contact
