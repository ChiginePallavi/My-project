import Button from './Button'
import './Navbar.css'

function Navbar({ currentPage, onNavigate }) {
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'register', label: 'Register' },
    { id: 'login', label: 'Login' },
  ]

  return (
    <header className="navbar">
      <div>
        <p className="navbar__eyebrow">React Fundamentals</p>
        <h1>Placement Eligibility Predictor</h1>
      </div>

      <nav className="navbar__links" aria-label="Primary navigation">
        {links.map((link) => (
          <button
            key={link.id}
            className={`nav-link ${currentPage === link.id ? 'active' : ''}`}
            onClick={() => onNavigate(link.id)}
            type="button"
          >
            {link.label}
          </button>
        ))}
      </nav>

      <Button label="Get Started" variant="secondary" />
    </header>
  )
}

export default Navbar
