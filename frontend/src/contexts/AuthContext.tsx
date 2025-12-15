/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'
import { api, setAccessToken, refreshAccessToken } from '../lib/api'

type User = {
  id?: number
  username?: string
  email?: string
  name?: string
  role?: string
  phone?: string
} | null

interface AuthContextType {
  user: User
  accessToken: string | null
  login: (identifier: string, password: string) => Promise<User | null>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [accessToken, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    // try refresh on mount to load session (backend should set HttpOnly refresh cookie)
    let mounted = true
    const init = async () => {
      try {
        const res = await refreshAccessToken()
        const data = res.data
        if (!mounted) return
        if (data?.access_token) {
          setToken(data.access_token)
          setAccessToken(data.access_token)
        }
        if (data?.user) setUser(data.user)
      } catch {
        // no session
      } finally {
        if (mounted) setLoading(false)
      }
    }
    init()
    return () => {
      mounted = false
    }
  }, [])

  const login = async (email: string, password: string) => {
    // local mock users (for demo / offline use)
    const mockUsers = [
      { id: 1, username: 'admin1', password: 'admin123', role: 'admin', email: 'admin@zmooth.local', phone: '+254712345678', name: 'Admin One' },
      { id: 2, username: 'super', password: 'super123', role: 'super', email: 'root@zmooth.local', phone: '+254787654321', name: 'Super User' },
    ]

    // allow login by email or username
    const localMatch = mockUsers.find(
      (u) => (u.email === email || u.username === email) && u.password === password
    )
    if (localMatch) {
      const { id, username, role, email: userEmail, phone, name } = localMatch
      const userObj: User = {
        id,
        username,
        role,
        email: userEmail,
        phone,
        name,
      }
      setToken('mock-access-token')
      setAccessToken('mock-access-token')
      setUser(userObj)
      return userObj
    }

    try {
      const res = await api.post('/auth/login', { email, password })
      const data = res.data
      if (data?.access_token) {
        setToken(data.access_token)
        setAccessToken(data.access_token)
      }
      if (data?.user) setUser(data.user)
      return data?.user ?? null
    } catch {
      return null
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // ignore
    }
    setToken(null)
    setAccessToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
