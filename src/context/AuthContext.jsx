import { createContext, useState, useCallback, useEffect } from 'react'

const AUTH_KEY = 'pathfinder-auth'

const VALID_EMAIL = 'hsarosh569@gmail.com'
const VALID_PASSWORD = '12345678'
const USER_NAME = 'Sarosh Hussain'

export const AuthContext = createContext(null)

function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data && data.isAuthenticated) return data
    }
  } catch {}
  return null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadAuth)

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_KEY)
    }
  }, [user])

  const login = useCallback((email, password) => {
    if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
      return { success: false, error: 'Invalid email or password.' }
    }
    const userData = {
      isAuthenticated: true,
      email: VALID_EMAIL,
      name: USER_NAME,
    }
    setUser(userData)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(AUTH_KEY)
  }, [])

  const value = { user, isAuthenticated: !!user, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
