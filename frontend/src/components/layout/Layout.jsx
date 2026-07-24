import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import Breadcrumbs from '../common/Breadcrumbs'

function Layout({ isLoggedIn, onLogout, theme, onToggleTheme, activeUser }) {
  const location = useLocation()

  useEffect(() => {
    const titleMap = {
      '/': 'Home | Placement Eligibility Predictor',
      '/about': 'About | Placement Eligibility Predictor',
      '/register': 'Register | Placement Eligibility Predictor',
      '/login': 'Login | Placement Eligibility Predictor',
      '/registered-details': 'Registered Details | Placement Eligibility Predictor',
      '/dashboard': 'Dashboard | Placement Eligibility Predictor',
      '/not-found': 'Page Not Found | Placement Eligibility Predictor',
    }

    const routeTitle = titleMap[location.pathname] || 'Placement Eligibility Predictor'
    document.title = routeTitle
  }, [location.pathname])

  useEffect(() => {
    sessionStorage.setItem('placement-last-page', location.pathname)
  }, [location.pathname])

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
        theme={theme}
        onToggleTheme={onToggleTheme}
        activeUser={activeUser}
      />
      <div className="app-content">
        <Sidebar isLoggedIn={isLoggedIn} activeUser={activeUser} />
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
