import React from 'react'
import Button from '../components/Button'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [info, setInfo] = React.useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone }
      }
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setInfo('Registro exitoso. Revisa tu correo para confirmar la cuenta.')
    setTimeout(() => navigate('/login'), 1200)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }} role="main">
      <div className="w-full max-w-md p-6 rounded-3xl border shadow-lg flex flex-col gap-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }} aria-label="Formulario de registro">
        <div className="flex flex-col items-center gap-2">
          <img src="/icons/ecohack.png" alt="Logo EcoHack" className="w-20 h-20 mb-2" />
          <h1 className="text-2xl font-bold tracking-wide" style={{ color: 'var(--color-primary)' }}>¡Eco empieza contigo!</h1>
          <p className="text-center text-base" style={{ color: 'var(--color-text-secondary)' }}>Crea una cuenta para obtener todas las funciones</p>
        </div>
        <form className="flex flex-col gap-4" aria-label="Registro" autoComplete="on" onSubmit={onSubmit}>
          <div className="rounded-full border-2 flex items-center px-4 py-2 focus-within:ring" tabIndex={0} style={{ borderColor: 'var(--color-primary)' }}>
            <span className="material-icons mr-2" aria-hidden="true" style={{ color: 'var(--color-primary)' }}>person_outline</span>
            <input type="text" placeholder="Nombre" className="flex-1 bg-transparent outline-none" style={{ color: 'var(--color-primary)' }} aria-label="Nombre" required autoFocus value={name} onChange={(e)=>setName(e.currentTarget.value)} />
          </div>
          <div className="rounded-full border-2 flex items-center px-4 py-2 focus-within:ring" tabIndex={0} style={{ borderColor: 'var(--color-border)' }}>
            <span className="material-icons mr-2" aria-hidden="true" style={{ color: 'var(--color-text-secondary)' }}>email</span>
            <input type="email" placeholder="Correo electrónico" className="flex-1 bg-transparent outline-none" style={{ color: 'var(--color-text-secondary)' }} aria-label="Correo electrónico" required value={email} onChange={(e)=>setEmail(e.currentTarget.value)} />
          </div>
          <div className="rounded-full border-2 flex items-center px-4 py-2 focus-within:ring" tabIndex={0} style={{ borderColor: 'var(--color-border)' }}>
            <span className="material-icons mr-2" aria-hidden="true" style={{ color: 'var(--color-text-secondary)' }}>phone</span>
            <input type="tel" placeholder="Número telefónico" className="flex-1 bg-transparent outline-none" style={{ color: 'var(--color-text-secondary)' }} aria-label="Número telefónico" value={phone} onChange={(e)=>setPhone(e.currentTarget.value)} />
          </div>
          <div className="rounded-full border-2 flex items-center px-4 py-2 focus-within:ring" tabIndex={0} style={{ borderColor: 'var(--color-border)' }}>
            <span className="material-icons mr-2" aria-hidden="true" style={{ color: 'var(--color-text-secondary)' }}>lock_outline</span>
            <input type="password" placeholder="Contraseña" className="flex-1 bg-transparent outline-none" style={{ color: 'var(--color-text-secondary)' }} aria-label="Contraseña" required value={password} onChange={(e)=>setPassword(e.currentTarget.value)} />
          </div>
          <div className="rounded-full border-2 flex items-center px-4 py-2 focus-within:ring" tabIndex={0} style={{ borderColor: 'var(--color-border)' }}>
            <span className="material-icons mr-2" aria-hidden="true" style={{ color: 'var(--color-text-secondary)' }}>lock_outline</span>
            <input type="password" placeholder="Confirmar contraseña" className="flex-1 bg-transparent outline-none" style={{ color: 'var(--color-text-secondary)' }} aria-label="Confirmar contraseña" required value={confirm} onChange={(e)=>setConfirm(e.currentTarget.value)} />
          </div>
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {error && <span role="alert" className="text-red-600">{error}</span>}
            {info && <span role="status" className="text-green-600">{info}</span>}
          </div>
          <Button type="submit" size="lg" className="mt-2" tabIndex={0} disabled={loading}>{loading ? 'Creando…' : 'CREAR'}</Button>
        </form>
        <div className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          ¿Ya tienes cuenta? <a href="/login" style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: 'bold' }} tabIndex={0}>Iniciar sesión</a>
        </div>
      </div>
    </div>
  )
}