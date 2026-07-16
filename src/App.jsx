import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard, { DashboardOverview, DashboardProfile, DashboardSettings } from './pages/Dashboard'
import Register from './pages/Register'
import Login from './pages/login/login.jsx'
import About from './pages/About'
import Details from './pages/Details'
import NotFound from './pages/NotFound'
import './App.css'

const AUTH_STORAGE_KEY = 'placement-auth-user'
const THEME_STORAGE_KEY = 'placement-theme'

export const appHighlights = [
  'Component-based structure',
  'Reusable props and buttons',
  'Vite-powered React app shell',
]

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return Boolean(localStorage.getItem(AUTH_STORAGE_KEY))
  })
  const [activeUser, setActiveUser] = useState(() => {
    if (typeof window === 'undefined') {
      return null
    }

    try {
      return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null')
    } catch {
      return null
    }
  })
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'dark'
    }

    return localStorage.getItem(THEME_STORAGE_KEY) || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const handleLogin = (user) => {
    const nextUser = {
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      loginAt: new Date().toISOString(),
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser))
    setActiveUser(nextUser)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setActiveUser(null)
    setIsLoggedIn(false)
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <Routes>
        <Route
          element={
            <Layout
              isLoggedIn={isLoggedIn}
              onLogout={handleLogout}
              theme={theme}
              onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              activeUser={activeUser}
            />
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} isLoggedIn={isLoggedIn} />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="profile" element={<DashboardProfile />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>
          <Route
            path="/details/:id"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Details />
              </ProtectedRoute>
            }
          />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Route>
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
