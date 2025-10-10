import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader } from "lucide-react"
import axios from "axios"
import Navbar from "../components/common/Navbar"

function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const { token } = useParams()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setLoading(true)

    try {
      const API = import.meta.env.VITE_API_URL
      const res = await axios.post(`${API}/auth/reset-password/${token}`, {
        password,
      })

      if (res.data.success) {
        setSuccess("Password reset successfully. Redirecting to login...")
        setTimeout(() => navigate("/login"), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Try again.")
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
            <p className="mt-2 text-center text-sm text-gray-600">Enter a new password below.</p>
          </div>

          {error && (
            <motion.div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div className="bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="password"
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
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
              {loading ? "Resetting..." : "Reset Password"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  )
}

export default ResetPassword
