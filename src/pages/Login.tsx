import React from 'react'
import Button from '../components/Button'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    if (data.session) {
      navigate('/perfil')
    }
  }

  const onResetPassword = async () => {
    if (!email) {
      setError('Ingresa tu correo para recuperar tu contraseña')
      return
    }
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login'
    })
    setLoading(false)
    if (error) setError(error.message)
    else alert('Si el correo existe, recibirás un enlace para restablecer tu contraseña.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }} role="main">
      <div className="w-full max-w-md p-6 rounded-3xl border shadow-lg flex flex-col gap-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }} aria-label="Formulario de inicio de sesión">
        <div className="flex flex-col items-center gap-2">
          <img src="/icons/ecohack.png" alt="Logo EcoHack" className="w-20 h-20 mb-2" />
          <h1 className="text-2xl font-bold tracking-wide" style={{ color: 'var(--color-primary)' }}>¡BIENVENIDO!</h1>
          <p className="text-center text-base" style={{ color: 'var(--color-text-secondary)' }}>Inicia sesión para continuar</p>
        </div>
        <form className="flex flex-col gap-4" aria-label="Login" autoComplete="on" onSubmit={onSubmit}>
          <div className="rounded-full border-2 flex items-center px-4 py-2 focus-within:ring" tabIndex={0} style={{ borderColor: 'var(--color-primary)' }}>
            <span className="material-icons mr-2" aria-hidden="true" style={{ color: 'var(--color-primary)' }}>person_outline</span>
            <input
              type="email"
              placeholder="Correo electrónico"
              className="flex-1 bg-transparent outline-none"
              style={{ color: 'var(--color-primary)' }}
              aria-label="Correo electrónico"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </div>
          <div className="rounded-full border-2 flex items-center px-4 py-2 focus-within:ring" tabIndex={0} style={{ borderColor: 'var(--color-border)' }}>
            <span className="material-icons mr-2" aria-hidden="true" style={{ color: 'var(--color-text-secondary)' }}>lock_outline</span>
            <input
              type="password"
              placeholder="Contraseña"
              className="flex-1 bg-transparent outline-none"
              style={{ color: 'var(--color-text-secondary)' }}
              aria-label="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </div>
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            <button type="button" onClick={onResetPassword} className="underline focus:outline-none focus:ring">¿Olvidaste tu contraseña?</button>
            {error && <span role="alert" className="text-red-600">{error}</span>}
          </div>
          <Button type="submit" size="lg" className="mt-2" tabIndex={0} disabled={loading}>{loading ? 'Entrando…' : 'INICIAR'}</Button>
        </form>
        <div className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          ¿No tienes cuenta? <a href="/register" style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: 'bold' }} tabIndex={0}>Crea una rápido</a>
        </div>
      </div>
    </div>
  )
}
