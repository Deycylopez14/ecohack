import React from 'react'
import Button from '../components/Button'
import { useGamification } from '../contexts/GamificationContext'

type Question = { id: string; text: string; options: string[]; correct: string }

const QUESTIONS: Question[] = [
  { id: 'q1', text: '¿Dónde debes tirar una botella de plástico?', options: ['Papel', 'Orgánico', 'Plástico', 'Vidrio'], correct: 'Plástico' },
  { id: 'q2', text: '¿Qué contenedor corresponde al vidrio?', options: ['Azul', 'Verde', 'Amarillo', 'Gris'], correct: 'Verde' },
  { id: 'q3', text: 'Las cáscaras de frutas son...', options: ['Orgánico', 'Papel', 'Plástico', 'Peligroso'], correct: 'Orgánico' }
]

export default function Educacion() {
  const { addPoints } = useGamification()
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [result, setResult] = React.useState<{ correct: number; points: number } | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const correct = QUESTIONS.reduce((acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0), 0)
    const points = correct * 10
    if (points > 0) {
      await addPoints(points) // Usar el contexto
    }
    setResult({ correct, points })
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }} role="main">
      <header className="flex items-center gap-2 p-4 border-b" role="banner" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
  <img src="/icons/ecohack.png" alt="Logo EcoHack" className="w-10 h-10" />
        <span className="font-bold text-xl" style={{letterSpacing: '1px'}}>EcoHack</span>
      </header>
      <main className="p-4" tabIndex={0} aria-label="Educación ambiental">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Módulo educativo</h1>
        <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>Infografías, videos y quizzes interactivos para aprender a clasificar residuos.</p>
        <section className="mb-6" aria-label="Quiz de clasificación">
          <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>Quiz: ¿Dónde va cada residuo?</h2>
          <form className="flex flex-col gap-4" aria-label="Quiz de residuos" onSubmit={onSubmit}>
            {QUESTIONS.map((q) => (
              <div key={q.id} className="rounded-xl p-4 shadow" tabIndex={0} style={{ background: 'var(--color-surface)' }}>
                <label htmlFor={q.id} className="font-bold">{q.text}</label>
                <select
                  id={q.id}
                  className="mt-2 p-2 rounded focus:outline-none focus:ring"
                  aria-label={`Respuesta ${q.id}`}
                  value={answers[q.id] ?? ''}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.currentTarget.value }))}
                  required
                >
                  <option value="" disabled>Selecciona…</option>
                  {q.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
            <div className="flex items-center justify-between">
              {result && (
                <span role="status" style={{ color: 'var(--color-text-secondary)' }}>
                  Correctas: <strong>{result.correct}/{QUESTIONS.length}</strong> — Puntos ganados: <strong>{result.points}</strong>
                </span>
              )}
              <Button type="submit" size="md" className="mt-2" tabIndex={0} disabled={submitting}>
                {submitting ? 'Enviando…' : 'Enviar respuestas'}
              </Button>
            </div>
          </form>
        </section>
        <section className="mb-6" aria-label="Infografía">
          <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>Infografía: Separación de residuos</h2>
          <div className="rounded-xl p-4 shadow" tabIndex={0} style={{ background: 'var(--color-surface)' }}>
            <img src="/infografia.jpg" alt="Infografía sobre separación de residuos" className="w-full h-auto rounded" />
          </div>
        </section>
        
        {/* Espaciado adicional para evitar que el contenido se pegue con la navegación */}
        <div className="h-20"></div>
      </main>
    </div>
  )
}
