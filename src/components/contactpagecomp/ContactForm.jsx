import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";


export const ContactForm = () => {
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
    )
}