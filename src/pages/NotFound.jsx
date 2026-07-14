import { Link } from 'react-router-dom'
import '../styles/Home.css'

function NotFound() {
  return (
    <main className="page home-page">
      <section className="hero-section">
        <div className="hero-section__content">
          <p className="hero-section__eyebrow">404 Error</p>
          <h2>Page not found</h2>
          <p>The page you are looking for does not exist or may have been moved.</p>
          <div className="hero-section__actions">
            <Link className="btn btn-primary" to="/">
              Return to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default NotFound
