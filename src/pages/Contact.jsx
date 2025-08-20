import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Navbar from "../components/Navbar";
import axios from "axios";
import { useState } from "react";
import FeaturesContact from "../components/utils/FeaturesContact";


function Contact(){
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null}
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus((prevStatus) => ({...prevStatus, submitting:true}));

    try {
      const API = import.meta.env.VITE_API_URL
      const response = await axios.post(`${API}/contact`, formData)
      
      if (response.data.success) {
        setStatus({
          submitted: true,
          submitting: false,
          info: {error: false, msg: "Message sent successfully!"}
        })
      

        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        })


        // Reset status after 5 seconds
        setTimeout(() => {
          setStatus({
            submitted: false,
            submitting: false,
            info: { error: false, msg: null },
          })
        }, 3000)
      }
    } catch (err) {
      setStatus({
        submitted: false,
        submitting: false,
        info: {error: true, msg: err.response?.data?.message || "Failed to send message. Please try again."}
      })
    }
  }
  
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl max-w-3xl mx-auto">
                Have questions about MaizeTrackAI? Am here to help.Reach me out.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Information and Form */}
        <section className="py-16 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
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

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Us a Message</h2>

                {status.info.error && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                    <p>{status.info.msg}</p>
                  </div>
                )}

                {status.submitted && !status.info.error && (
                  <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
                    <p>{status.info.msg}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Brilliant tonsa"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="brillianttonsa@example.com"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Your message here..."
                    ></textarea>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={status.submitting}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                      status.submitting ? "bg-yellow-400" : "bg-yellow-600 hover:bg-yellow-700"
                    } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
                  >
                    {status.submitting ? "Sending..." : "Send Message"}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </section>  
      </div>
    </>
  )
}

export default Contact
