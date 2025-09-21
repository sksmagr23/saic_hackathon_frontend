import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

// Configure axios base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000"
axios.defaults.withCredentials = true

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  useEffect(() => {
    
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("/auth/status")

      if (response.data.isAuthenticated) {
        setUser(response.data.user)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = () => {
    window.location.href = `${axios.defaults.baseURL}/auth/google`
  }

  const logout = async () => {
    try {
      await axios.post("/auth/logout")
      setUser(null)
      setIsAuthenticated(false)
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const UserInfo = () => {
      return user
    }