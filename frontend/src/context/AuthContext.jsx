import { createContext, useContext, useEffect, useState } from 'react'
import { getMe } from '../services/api'

const TOKEN_KEY = 'placement-jwt-token'
const AUTH_STORAGE_KEY = 'placement-auth-user'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))
  const [activeUser, setActiveUser] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null')
    } catch {
      return null
    }
  })
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem('placement-theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('placement-theme', theme)
  }, [theme])

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY)
      if (!token) {
        setIsLoggedIn(false)
        setActiveUser(null)
        return
      }

      try {
        const response = await getMe()
        if (response && response.user) {
          const user = response.user
          const mappedUser = {
            id: user.id,
            displayName: user.name,
            name: user.name,
            email: user.email,
            role: user.role,
            mobile: user.mobile,
            college: user.college,
            branch: user.branch,
            graduationYear: user.graduationYear,
            skills: user.skills,
            profileImage: user.profileImage,
          }
          setIsLoggedIn(true)
          setActiveUser(mappedUser)
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mappedUser))
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(AUTH_STORAGE_KEY)
        setIsLoggedIn(false)
        setActiveUser(null)
      }
    }

    restoreSession()
  }, [])

  const handleLogin = (userPayload) => {
    const token = userPayload.token
    const user = userPayload.user || {}
    const mappedUser = {
      id: user.id,
      displayName: user.name || userPayload.email,
      name: user.name,
      email: user.email || userPayload.email,
      role: user.role || 'student',
      mobile: user.mobile,
      college: user.college,
      branch: user.branch,
      graduationYear: user.graduationYear,
      skills: user.skills,
      profileImage: user.profileImage,
    }

    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mappedUser))
    setIsLoggedIn(true)
    setActiveUser(mappedUser)
  }

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setIsLoggedIn(false)
    setActiveUser(null)
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const value = {
    isLoggedIn,
    activeUser,
    theme,
    login: handleLogin,
    logout: handleLogout,
    toggleTheme,
    setActiveUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
