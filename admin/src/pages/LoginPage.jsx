import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

const FEATURES = [
  {
    title: 'User management',
    text: 'Create, edit, and remove mobile app users from one place.',
  },
  {
    title: 'Lead tracking',
    text: 'Monitor lead status, follow-ups, and loan pipeline updates.',
  },
  {
    title: 'Excel imports',
    text: 'Upload spreadsheets and sync lead data across the platform.',
  },
]

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@leadlist.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await api.login(email, password)
      login(result.token, result.admin)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-split">
      <section className="login-split-left">
        <div className="login-split-left-inner">
          <div className="login-brand-badge">LL</div>
          <h1>Lead List Admin</h1>
          <p className="login-tagline">
            Central control panel for your mobile sales team, leads, and imports.
          </p>

          <ul className="login-feature-list">
            {FEATURES.map((item) => (
              <li key={item.title}>
                <span className="login-feature-dot" />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="login-split-right">
        <form className="login-form-card" onSubmit={handleSubmit}>
          <p className="login-form-eyebrow">Admin access</p>
          <h2>Sign in</h2>
          <p className="login-form-subtitle">Enter your credentials to open the dashboard</p>

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@leadlist.com"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="btn btn-primary login-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="login-hint">Default: admin@leadlist.com / admin123</p>
        </form>
      </section>
    </div>
  )
}
