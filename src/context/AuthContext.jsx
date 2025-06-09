import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if there's a token in localStorage
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setCurrentUser(JSON.parse(storedUser))

      // Setting default Authorization header for all axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`
    }

    setLoading(false)
  }, [])

  const login = (newToken, user) => {
    localStorage.setItem("token", newToken)
    localStorage.setItem("user", JSON.stringify(user))
    setToken(newToken)
    setCurrentUser(user)

    // Setting default Authorization header for all axios requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setCurrentUser(null)

    // Removing Authorization header
    delete axios.defaults.headers.common["Authorization"]
  }

  const isAuthenticated = () => {
    return !!token
  }

  const isAdmin = () => {
    return currentUser?.role === "admin"
  }

  const value = {
    currentUser,
    token,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
