import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/api'
import '../../styles/Login.css'

function Login({ onLogin }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleQuickFill = (targetEmail, targetPassword) => {
    setEmail(targetEmail)
    setPassword(targetPassword)
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email || !password) {
      setError('Please provide both email and password.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setStatusMessage('Authenticating credentials with backend...')

    try {
      const response = await loginUser({ email, password })

      if (response && response.token) {
        onLogin(response)

        const intendedPath = location.state?.from || '/dashboard'
        navigate(intendedPath, {
          replace: true,
          state: { success: response.message || 'Login successful.' }
        })
      } else {
        setError('Login failed. Invalid token received from server.')
      }
    } catch (loginError) {
      setError(loginError.message || 'Invalid email or password.')
    } finally {
      setIsSubmitting(false)
      setStatusMessage('')
    }
  }

  return (
    <main className="page login-page">
      <section className="login-card">
        <div className="login-card__header">
          <p className="eyebrow">Welcome Back</p>
          <h2>Sign in to your account</h2>
          <p>Enter your credentials to receive a secure JWT token.</p>
        </div>

        <div className="quick-login-row" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary compact"
            onClick={() => handleQuickFill('admin@placement.com', 'Admin@123')}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
          >
            🔑 Fill Admin Credentials
          </button>
          <button
            type="button"
            className="btn btn-secondary compact"
            onClick={() => handleQuickFill('student@placement.com', 'Student@123')}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
          >
            🎓 Fill Student Credentials
          </button>
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
            <div className="password-row" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                style={{ flex: 1 }}
              />
              <button
                className="toggle-password"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                style={{
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {error && <p className="field-error">{error}</p>}
          {statusMessage && !error ? <p className="field-success">{statusMessage}</p> : null}

          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default Login
