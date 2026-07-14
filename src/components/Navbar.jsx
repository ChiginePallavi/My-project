import { NavLink, useNavigate } from 'react-router-dom'
import Button from './Button'
import './Navbar.css'

function Navbar({ isLoggedIn, onLogout, theme, onToggleTheme, activeUser }) {
  const navigate = useNavigate()
  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/about', label: 'About' },
    { to: '/register', label: 'Register' },
    { to: '/login', label: 'Login' },
  ]

  return (
    <header className="navbar">
      <div>
        <p className="navbar__eyebrow">React Router Practice</p>
        <h1>Placement Eligibility Predictor</h1>
      </div>

      <nav className="navbar__links" aria-label="Primary navigation">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar__actions">
        {activeUser ? <span className="navbar__user">Hi, {activeUser.displayName}</span> : null}
        <button className="theme-toggle" type="button" onClick={onToggleTheme}>
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
        {isLoggedIn ? (
          <Button
            label="Logout"
            variant="secondary"
            onClick={() => {
              onLogout()
              navigate('/login')
            }}
          />
        ) : (
          <Button label="Get Started" variant="secondary" onClick={() => navigate('/register')} />
        )}
      </div>
    </header>
  )
}

export default Navbar
