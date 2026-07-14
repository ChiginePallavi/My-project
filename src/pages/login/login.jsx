import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'

function Login({ onLogin, isLoggedIn }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const validEmail = 'student@example.com'
  const validPassword = 'Password123'

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true })
    }
  }, [isLoggedIn, navigate])

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }

    if (email !== validEmail || password !== validPassword) {
      setError('Invalid email or password.')
      return
    }

    setIsSubmitting(true)
    setStatusMessage('Signing you in and saving your session...')

    setTimeout(() => {
      setIsSubmitting(false)
      if (typeof onLogin === 'function') {
        onLogin({ email, displayName: email.split('@')[0] })
      }
      sessionStorage.setItem('placement-last-page', '/dashboard')
      navigate('/dashboard')
    }, 600)
  }

  return (
    <main className="page login-page">
      <section className="login-card">
        <div className="login-card__header">
          <p className="eyebrow">Welcome Back</p>
          <h2>Login to your account</h2>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="student@example.com"
            />
          </label>

          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </label>

          {error && <p className="field-error">{error}</p>}
          {statusMessage && !error ? <p className="field-success">{statusMessage}</p> : null}

          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default Login

