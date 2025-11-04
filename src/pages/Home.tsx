import React from 'react'
import FeatureCarousel from '../components/FeatureCarousel'
import { ensureProfile, getProfile } from '../lib/gamification'

export default function Home() {
  const [points, setPoints] = React.useState<number | null>(null)

  React.useEffect(() => {
    (async () => {
      await ensureProfile()
      const profile = await getProfile()
      if (profile) setPoints(profile.points)
    })()
  }, [])

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }} role="main">
      <header className="flex items-center gap-2 p-4 border-b" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }} role="banner">
  <img src="/icons/ecohack.png" alt="Logo EcoHack" className="w-10 h-10" />
        <span className="font-bold text-xl" style={{ letterSpacing: '1px' }}>EcoHack</span>
      </header>
  <main className="flex-1 p-4" tabIndex={0} aria-label="Página Principal" style={{ background: 'var(--color-surface)', borderRadius: '16px', paddingBottom: '96px' }}>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Página Principal</h1>
        <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>Tus estadísticas de un vistazo</p>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
          <div className="rounded-xl p-4 shadow-lg border-2 flex flex-col items-center justify-center transition-all hover:scale-105" aria-label="Logros" tabIndex={0} style={{ background: 'linear-gradient(135deg, var(--color-success) 0%, #16a34a 100%)', color: 'white', aspectRatio: '1 / 1', borderColor: '#166534' }}>
            <span className="material-icons text-4xl mb-2" aria-hidden="true" style={{ color: 'white' }}>emoji_events</span>
            <span className="font-bold text-lg text-white">Logros</span>
            <span className="text-2xl font-extrabold text-white">5</span>
          </div>
          <div className="rounded-xl p-4 shadow-lg border-2 flex flex-col items-center justify-center transition-all hover:scale-105" aria-label="Puntos" tabIndex={0} style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, #0369a1 100%)', color: 'white', aspectRatio: '1 / 1', borderColor: '#0c4a6e' }}>
            <span className="material-icons text-4xl mb-2" aria-hidden="true" style={{ color: 'white' }}>trending_up</span>
            <span className="font-bold text-lg text-white">Puntos</span>
            <span className="text-2xl font-extrabold text-white">{points ?? '—'}</span>
          </div>
          <div className="rounded-xl p-4 shadow-lg border-2 flex flex-col items-center justify-center transition-all hover:scale-105" aria-label="Impacto" tabIndex={0} style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, #0369a1 100%)', color: 'white', aspectRatio: '1 / 1', borderColor: '#0c4a6e' }}>
            <span className="material-icons text-4xl mb-2" aria-hidden="true" style={{ color: 'white' }}>water_drop</span>
            <span className="font-bold text-lg text-white">Impacto</span>
            <span className="text-2xl font-extrabold text-white">10k L</span>
          </div>
          <div className="rounded-xl p-4 shadow-lg border-2 flex flex-col items-center justify-center transition-all hover:scale-105" aria-label="CO2 Ahorrado" tabIndex={0} style={{ background: 'linear-gradient(135deg, var(--color-success) 0%, #16a34a 100%)', color: 'white', aspectRatio: '1 / 1', borderColor: '#166534' }}>
            <span className="material-icons text-4xl mb-2" aria-hidden="true" style={{ color: 'white' }}>eco</span>
            <span className="font-bold text-lg text-white">CO2 Ahorrado</span>
            <span className="text-2xl font-extrabold text-white">2.3 t</span>
          </div>
  </div>
  <FeatureCarousel />
  <section className="mb-28" aria-label="Retos de la semana">
          <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>Retos de la semana</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 rounded-lg p-2" tabIndex={0} style={{ background: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }}>
              <span className="material-icons" aria-hidden="true" style={{ color: 'inherit' }}>check_circle</span>
              <span>Recicla 5 botellas de plástico</span>
            </li>
            <li className="flex items-center gap-2 rounded-lg p-2" tabIndex={0} style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}>
              <span className="material-icons" aria-hidden="true" style={{ color: 'var(--color-border)' }}>radio_button_unchecked</span>
              <span>Visita un punto de reciclaje</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}