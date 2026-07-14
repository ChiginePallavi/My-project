import { NavLink } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {
  const items = [
    {
      to: '/',
      title: 'Overview',
      description: 'Welcome to the predictor experience.',
    },
    {
      to: '/dashboard',
      title: 'Scoreboard',
      description: 'Track progress and eligibility insights.',
    },
    {
      to: '/register',
      title: 'Register',
      description: 'Complete your application with validation.',
    },
    {
      to: '/login',
      title: 'Login',
      description: 'Sign in to access your eligibility details.',
    },
  ]

  return (
    <aside className="sidebar">
      <h2>Project Sections</h2>
      <ul>
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `sidebar__item${isActive ? ' active' : ''}`}
            >
              <span>{item.title}</span>
              <small>{item.description}</small>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
