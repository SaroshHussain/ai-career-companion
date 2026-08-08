import { createContext, useState, useCallback, useEffect } from 'react'

const AUTH_KEY = 'pathfinder-auth'

const VALID_EMAIL = 'hsarosh569@gmail.com'
const VALID_PASSWORD = '12345678'
const USER_NAME = 'Sarosh Hussain'

export const AuthContext = createContext(null)

function readStoredAuth() {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(AUTH_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data && data.isAuthenticated) return data
    }
  } catch (error) {
    console.warn('Unable to read auth storage.', error)
  }

  return null
}

function persistAuth(userData) {
  if (typeof window === 'undefined') return

  try {
    if (userData) {
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(userData))
    } else {
      window.localStorage.removeItem(AUTH_KEY)
    }
  } catch (error) {
    console.warn('Unable to persist auth state.', error)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredAuth)

  useEffect(() => {
    persistAuth(user)
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
    persistAuth(userData)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    persistAuth(null)
  }, [])

  const value = { user, isAuthenticated: !!user, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
