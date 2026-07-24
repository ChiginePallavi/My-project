import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/layout/Layout'
import ProtectedRoute from './ProtectedRoute'
import Home from '../pages/public/Home'
import About from '../pages/public/About'
import NotFound from '../pages/public/NotFound'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import RegisteredDetails from '../pages/auth/RegisteredDetails'
import Details from '../pages/opportunities/Details'
import EditOpportunity from '../pages/opportunities/EditOpportunity'
import Dashboard, { DashboardOverview, DashboardProfile, DashboardSettings } from '../pages/dashboard/Dashboard'

function AppRoutes() {
  const { isLoggedIn, activeUser, theme, toggleTheme, logout, login } = useAuth()

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            isLoggedIn={isLoggedIn}
            onLogout={logout}
            theme={theme}
            onToggleTheme={toggleTheme}
            activeUser={activeUser}
          />
        }
      >
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login onLogin={login} />} />
        <Route path="registered-details" element={<RegisteredDetails />} />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard activeUser={activeUser} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="overview" element={<DashboardOverview activeUser={activeUser} />} />
          <Route path="profile" element={<DashboardProfile activeUser={activeUser} />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>

        <Route
          path="details/:id"
          element={
            <ProtectedRoute>
              <Details />
            </ProtectedRoute>
          }
        />

        <Route
          path="edit/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditOpportunity />
            </ProtectedRoute>
          }
        />

        <Route path="not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
