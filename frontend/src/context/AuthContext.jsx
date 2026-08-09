import { createContext, useState, useCallback, useEffect } from 'react'
import { loginUser, registerUser, fetchCurrentUser } from '../services/api'

const AUTH_KEY = 'pathfinder-auth'

function readStoredAuth() {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(AUTH_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data && data.token) return data
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

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredAuth)
  // True while we validate an existing token against the server on mount.
  const [loading, setLoading] = useState(true)

  // On first load, verify any stored token still works. If it doesn't
  // (expired / revoked), drop the session so protected routes redirect.
  useEffect(() => {
    let mounted = true

    const stored = readStoredAuth()
    if (!stored) {
      setLoading(false)
      return
    }

    fetchCurrentUser()
      .then((data) => {
        if (!mounted) return
        const userData = {
          isAuthenticated: true,
          token: stored.token,
          ...data.user,
        }
        setUser(userData)
        persistAuth(userData)
      })
      .catch(() => {
        if (!mounted) return
        setUser(null)
        persistAuth(null)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    persistAuth(user)
  }, [user])

  const login = useCallback(async (email, password) => {
    try {
      const data = await loginUser({ email, password })
      const userData = { isAuthenticated: true, token: data.token, ...data.user }
      setUser(userData)
      persistAuth(userData)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message || 'Unable to sign in.' }
    }
  }, [])

  const register = useCallback(async (name, email, password) => {
    try {
      const data = await registerUser({ name, email, password })
      const userData = { isAuthenticated: true, token: data.token, ...data.user }
      setUser(userData)
      persistAuth(userData)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message || 'Unable to create account.' }
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    persistAuth(null)
  }, [])

  const value = { user, isAuthenticated: !!user, loading, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
