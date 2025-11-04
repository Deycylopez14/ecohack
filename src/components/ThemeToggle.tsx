import React from 'react'

export default function ThemeToggle() {
  // Estado para modo oscuro, persistente en localStorage
  const [dark, setDark] = React.useState(() => {
    const saved = localStorage.getItem('eco-theme-dark')
    return saved === 'true' ? true : false
  })

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('eco-theme-dark', dark ? 'true' : 'false')
  }, [dark])

  return (
    <button
      aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
      className="fixed top-4 right-4 z-50 rounded-full w-12 h-12 flex items-center justify-center shadow focus:outline-none focus:ring"
      style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)', touchAction: 'manipulation' as any }}
      onClick={() => setDark(d => !d)}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
