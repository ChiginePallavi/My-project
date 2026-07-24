import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, allowedRoles }) {
  const { isLoggedIn, activeUser } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = activeUser?.role || 'student'
    if (!allowedRoles.includes(userRole)) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ color: '#ef4444' }}>403 - Access Forbidden</h2>
          <p>Your role ({userRole}) does not have permission to view this section.</p>
        </div>
      )
    }
  }

  return children
}

export default ProtectedRoute
