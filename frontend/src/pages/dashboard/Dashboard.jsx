import { NavLink, Outlet } from 'react-router-dom'
import DashboardOverview from './DashboardOverview'
import DashboardProfile from './DashboardProfile'
import DashboardSettings from './DashboardSettings'

function Dashboard({ activeUser }) {
  return (
    <main className="page dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-hero__eyebrow">Placement Dashboard</p>
          <h2>Track your readiness at a glance</h2>
        </div>
        <p>Use the dashboard to review performance insights and preparation milestones before the next placement drive.</p>
      </section>

      <nav className="dashboard-subnav" aria-label="Dashboard sections">
        <NavLink to="/dashboard/overview" className={({ isActive }) => `dashboard-tab${isActive ? ' active' : ''}`}>
          Overview
        </NavLink>
        <NavLink to="/dashboard/profile" className={({ isActive }) => `dashboard-tab${isActive ? ' active' : ''}`}>
          Profile
        </NavLink>
        <NavLink to="/dashboard/settings" className={({ isActive }) => `dashboard-tab${isActive ? ' active' : ''}`}>
          Settings
        </NavLink>
      </nav>

      <Outlet context={{ activeUser }} />
    </main>
  )
}

export { DashboardOverview, DashboardProfile, DashboardSettings }
export default Dashboard
