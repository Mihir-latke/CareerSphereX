import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      // Give a clear message if backend is offline
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('⚠️ Cannot reach the server. Please make sure the backend is running on port 8080.')
      } else {
        setError(err.message || 'Invalid email or password. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to CareerSphereX"
      subtitle="Pick up where you left off."
      footer={
        <>
          New to CareerSphereX? <Link to="/register">Create account</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@email.com"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />

        {error && (
          <div style={{
            background: '#FFF0F2',
            border: '1px solid #FECDD3',
            borderRadius: 12,
            padding: '10px 14px',
            marginBottom: 16,
            fontSize: '0.85rem',
            color: '#B91C1C',
            fontWeight: 600,
          }}>
            {error}
          </div>
        )}

        <div style={{ textAlign: 'right', marginBottom: 20 }}>
          <Link to="/forgot-password" style={{ fontSize: 'var(--fs-caption)' }}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" block disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>

        {/* Backend status hint */}
        <div style={{
          marginTop: 14,
          padding: '8px 12px',
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 10,
          fontSize: '0.75rem',
          color: '#166534',
          textAlign: 'center',
        }}>
          💡 Make sure backend is running: <code style={{ background: '#DCFCE7', padding: '1px 5px', borderRadius: 4 }}>mvn spring-boot:run</code>
        </div>
      </form>
    </AuthLayout>
  )
}
