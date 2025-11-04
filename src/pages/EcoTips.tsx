import React from 'react'
import tipsData from '../data/ecotips-expanded.json'
import { useGamification } from '../contexts/GamificationContext'

export default function EcoTips() {
  const { addPoints } = useGamification()
  const [query, setQuery] = React.useState('')
  const [category, setCategory] = React.useState<'todas' | string>('todas')
  const [readTips, setReadTips] = React.useState<Set<number>>(new Set())
  
  // Función para marcar tip como leído y dar puntos
  const markTipAsRead = async (tipId: number) => {
    if (!readTips.has(tipId)) {
      setReadTips(prev => new Set([...prev, tipId]))
      await addPoints(5) // 5 puntos por leer un eco-tip
    }
  }

  const categories = React.useMemo(() => ['todas', ...Array.from(new Set((tipsData as any[]).map(t => t.category)))], [])
  const tips = (tipsData as any[]).filter(t => {
    const matchesQuery = (t.title + ' ' + t.body).toLowerCase().includes(query.toLowerCase())
    const matchesCat = category === 'todas' || t.category === category
    return matchesQuery && matchesCat
  })
  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }} role="main">
      <header className="flex items-center gap-2 p-4 border-b" role="banner" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
  <img src="/icons/ecohack.png" alt="Logo EcoHack" className="w-10 h-10" />
        <span className="font-bold text-xl" style={{letterSpacing: '1px'}}>EcoHack</span>
      </header>
      <main className="p-4" tabIndex={0} aria-label="Eco-Tips">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Eco-Tips</h1>
        <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>Encuentra la mejor información para ayudarte a reciclar mejor.</p>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="search"
            placeholder="Buscar tips..."
            className="px-3 py-2 rounded border"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={query}
            onChange={(e)=>setQuery(e.currentTarget.value)}
            aria-label="Buscar eco-tips"
          />
          <select
            className="px-3 py-2 rounded border"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            aria-label="Filtrar por categoría"
            value={category}
            onChange={(e)=>setCategory(e.currentTarget.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="space-y-4">
          {tips.map(t => (
            <article 
              key={t.id} 
              className={`rounded-xl p-4 shadow cursor-pointer transition-all hover:scale-[1.02] ${readTips.has(t.id) ? 'ring-2 ring-green-500' : ''}`}
              tabIndex={0} 
              aria-label={t.title} 
              style={{ background: 'var(--color-surface)' }}
              onClick={() => markTipAsRead(t.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  markTipAsRead(t.id)
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="font-bold text-lg mb-1">{t.title}</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full mr-2" style={{ background: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }}>{t.category}</span>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{t.body}</p>
                </div>
                {readTips.has(t.id) && (
                  <div className="ml-2 text-green-500 flex items-center gap-1">
                    <span className="text-sm">+5 pts</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                )}
              </div>
            </article>
          ))}
          {tips.length === 0 && (
            <div className="rounded-xl p-4 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>No hay resultados para tu búsqueda.</div>
          )}
        </div>
      </main>
    </div>
  )
}
