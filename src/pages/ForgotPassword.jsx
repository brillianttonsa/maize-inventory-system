"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader, Mail } from "lucide-react"
import axios from "axios"
import Navbar from "../components/common/Navbar"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email) {
      setError("Email is required.")
      return
    }

    setLoading(true)

    try {
      const API = import.meta.env.VITE_API_URL
      const res = await axios.post(`${API}/auth/forgot-password`, { email })

      if (res.data.success) {
        setSuccess(res.data.message)
        setEmail("")

        // Show token in development (remove in production)
        if (res.data.resetToken) {
          console.log("Reset token:", res.data.resetToken)
          console.log("Reset link:", `${window.location.origin}/reset-password/${res.data.resetToken}`)
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-lg"
        >
          <div>
            <h2 className="text-center text-2xl font-bold text-gray-900">Reset Your Password</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          {error && <motion.div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">{error}</motion.div>}

          {success && (
            <motion.div className="bg-green-50 border-l-4 border-green-500 p-4 text-green-700">{success}</motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? "bg-yellow-400" : "bg-yellow-600 hover:bg-yellow-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
            >
              {loading && <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
              {loading ? "Sending..." : "Send Reset Link"}
            </motion.button>
          </form>

          <div className="text-center">
            <Link to="/login" className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default ForgotPassword
