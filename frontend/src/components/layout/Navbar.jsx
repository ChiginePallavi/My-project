import { NavLink, useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import { authNavLinks, guestNavLinks } from '../../config/navigation'
import './Navbar.css'

function Navbar({ isLoggedIn, onLogout, theme, onToggleTheme, activeUser }) {
  const navigate = useNavigate()
  const links = isLoggedIn ? authNavLinks : guestNavLinks

  return (
    <header className="navbar">
      <div>
        <p className="navbar__eyebrow">Placement Intelligence</p>
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
        {activeUser ? (
          <div className="navbar__user">
            <img
              src={activeUser.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeUser.displayName || 'User')}`}
              alt="Profile Avatar"
              className="navbar__avatar"
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeUser.displayName || 'User')}`
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span>Hi, {activeUser.displayName}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                {activeUser.role === 'admin' ? '🛡️ Admin' : '🎓 Student'}
              </span>
            </div>
          </div>
        ) : null}
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
