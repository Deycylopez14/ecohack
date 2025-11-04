import React from 'react'
import Button from '../components/Button'
import { ensureProfile, fetchActiveChallenges, completeChallenge, getProfile, type Challenge } from '../lib/gamification'

export default function Gamificacion() {
  const [challenges, setChallenges] = React.useState<Challenge[]>([])
  const [points, setPoints] = React.useState<number | null>(null)
  const [completingId, setCompletingId] = React.useState<string | null>(null)
  const [completedIds, setCompletedIds] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    (async () => {
      await ensureProfile()
      const [chs, prof] = await Promise.all([fetchActiveChallenges(), getProfile()])
      setChallenges(chs)
      if (prof) setPoints(prof.points)
    })()
  }, [])

  const onComplete = async (c: Challenge) => {
    if (completedIds.has(c.id)) return
    setCompletingId(c.id)
    const ok = await completeChallenge(c.id)
    setCompletingId(null)
    if (ok) {
      setCompletedIds(new Set([...Array.from(completedIds), c.id]))
      const prof = await getProfile()
      if (prof) setPoints(prof.points)
    }
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }} role="main">
      <header className="flex items-center gap-2 p-4 border-b" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }} role="banner">
  <img src="/icons/ecohack.png" alt="Logo EcoHack" className="w-10 h-10" />
        <span className="font-bold text-xl" style={{letterSpacing: '1px'}}>EcoHack</span>
      </header>
      <main className="p-4" tabIndex={0} aria-label="Gamificación">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Gamificación</h1>
        <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>Retos, insignias y puntos para motivar tu participación y hábitos responsables.</p>
        <div className="rounded-xl p-4 shadow mb-4" style={{ background: 'var(--color-surface)' }}>
          <span className="font-bold">Tus puntos:</span> <span>{points ?? '—'}</span>
        </div>
        <section className="mb-6" aria-label="Retos semanales">
          <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>Retos de la semana</h2>
          <ul className="space-y-2">
            {challenges.map((c) => {
              const done = completedIds.has(c.id)
              return (
                <li key={c.id} className="flex items-center justify-between gap-2 rounded-lg p-3" tabIndex={0} style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>
                  <div className="flex items-center gap-2">
                    <span className="material-icons" aria-hidden="true" style={{ color: done ? 'var(--color-success)' : 'var(--color-primary)' }}>{done ? 'check_circle' : 'radio_button_unchecked'}</span>
                    <div>
                      <div className="font-bold">{c.title}</div>
                      {c.description && <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{c.description}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>{c.points} pts</span>
                    <Button size="sm" variant={done ? 'surface' : 'primary'} disabled={done || completingId === c.id} onClick={() => onComplete(c)}>
                      {done ? 'Completado' : completingId === c.id ? 'Guardando…' : 'Completar'}
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
        <section className="mb-6" aria-label="Insignias">
          <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>Tus insignias</h2>
          <div className="flex gap-4">
            <div className="rounded-full p-4 shadow flex flex-col items-center" tabIndex={0} aria-label="Insignia reciclador" style={{ background: 'var(--color-surface)' }}>
              <span className="material-icons text-3xl mb-1" aria-hidden="true" style={{ color: 'var(--color-primary)' }}>emoji_events</span>
              <span className="font-bold">Reciclador</span>
            </div>
            <div className="rounded-full p-4 shadow flex flex-col items-center" tabIndex={0} aria-label="Insignia eco-amigo" style={{ background: 'var(--color-surface)' }}>
              <span className="material-icons text-3xl mb-1" aria-hidden="true" style={{ color: 'var(--color-primary)' }}>eco</span>
              <span className="font-bold">Eco-Amigo</span>
            </div>
          </div>
        </section>
        <section className="mb-6" aria-label="Ranking comunitario">
          <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>Ranking comunitario</h2>
          <div className="rounded-xl p-4 shadow" tabIndex={0} style={{ background: 'var(--color-surface)' }}>
            <ol className="list-decimal ml-4">
              <li><span className="font-bold">Milestic</span> - 12,450 pts</li>
              <li><span className="font-bold">Ana Castillo</span> - 10,200 pts</li>
              <li><span className="font-bold">Carlos Molina</span> - 9,800 pts</li>
            </ol>
          </div>
        </section>
      </main>
    </div>
  )
}
