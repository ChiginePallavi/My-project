import { useState } from 'react'
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
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="app-shell">
      <Routes>
        <Route element={<Layout isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
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
