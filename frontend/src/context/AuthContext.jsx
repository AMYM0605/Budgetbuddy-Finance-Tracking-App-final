import { createContext, useContext, useState, useCallback } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('bb_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const res = await authAPI.login({ email, password })
      const { token, user: userData } = res.data.data
      localStorage.setItem('bb_token', token)
      localStorage.setItem('bb_user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (fullName, email, password) => {
    setLoading(true)
    try {
      const res = await authAPI.register({ fullName, email, password })
      const { token, user: userData } = res.data.data
      localStorage.setItem('bb_token', token)
      localStorage.setItem('bb_user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('bb_token')
    localStorage.removeItem('bb_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
