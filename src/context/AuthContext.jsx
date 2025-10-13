import { createContext, useState, useContext, useEffect } from "react"

const AuthContext = createContext()

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        if (storedToken.trim() && parsedUser?.username) {
          setToken(storedToken)
          setCurrentUser(parsedUser)
        } else {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }
      } catch (error) {
        console.error("Invalid user data in localStorage:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    } else {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }

    setLoading(false)
  }, [])

  const login = (newToken, user) => {
    localStorage.setItem("token", newToken)
    localStorage.setItem("user", JSON.stringify(user))
    setToken(newToken)
    setCurrentUser(user)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setCurrentUser(null)
  }

  const isAuthenticated = () => !!token && currentUser !== null

  const value = { currentUser, token, login, logout, isAuthenticated, loading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { useAuth, AuthProvider }
