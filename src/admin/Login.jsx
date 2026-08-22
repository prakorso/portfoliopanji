import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider.jsx'
import { isSupabaseConfigured } from '../lib/supabase.js'
import { Monogram } from '../components/Icons.jsx'

export default function Login() {
  const { session, signIn } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  if (session) {
    const to = location.state?.from ?? '/admin/homepage'
    return <Navigate to={to} replace />
  }

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="alogin">
      <form className="alogin__card" onSubmit={submit}>
        <Monogram size={40} />
        <h1 className="alogin__title">Portfolio admin</h1>
        <p className="alogin__desc">Sign in to edit your site content.</p>

        {!isSupabaseConfigured && (
          <p className="astatus astatus--error">
            Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then reload.
          </p>
        )}

        <label className="af__label" htmlFor="admin-email">
          Email
        </label>
        <input
          id="admin-email"
          className="af__input"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="af__label" htmlFor="admin-password">
          Password
        </label>
        <input
          id="admin-password"
          className="af__input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="astatus astatus--error">{error}</p>}

        <button className="abtn abtn--block" type="submit" disabled={busy || !isSupabaseConfigured}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>

        <a className="alogin__back" href="/">
          ← Back to the site
        </a>
      </form>
    </div>
  )
}
