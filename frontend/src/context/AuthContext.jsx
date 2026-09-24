import { createContext, useContext, useState, useCallback } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('csx_user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('csx_token'))

  const persist = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('csx_user', JSON.stringify(userData))
    localStorage.setItem('csx_token', authToken)
  }

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password)
    persist(data.user, data.token)
    return data
  }, [])

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload)
    persist(data.user, data.token)
    return data
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('csx_user')
    localStorage.removeItem('csx_token')
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
