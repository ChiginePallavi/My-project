import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import Breadcrumbs from './Breadcrumbs'

function Layout({ isLoggedIn, onLogout }) {
  const location = useLocation()

  useEffect(() => {
    const titleMap = {
      '/': 'Home | Placement Eligibility Predictor',
      '/about': 'About | Placement Eligibility Predictor',
      '/register': 'Register | Placement Eligibility Predictor',
      '/login': 'Login | Placement Eligibility Predictor',
      '/dashboard': 'Dashboard | Placement Eligibility Predictor',
      '/not-found': 'Page Not Found | Placement Eligibility Predictor',
    }

    const routeTitle = titleMap[location.pathname] || 'Placement Eligibility Predictor'
    document.title = routeTitle
  }, [location.pathname])

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <div className="app-content">
        <Sidebar />
        <div className="main-panel">
          <Breadcrumbs location={location} />
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Layout
