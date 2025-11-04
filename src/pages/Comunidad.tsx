import React from 'react'
import Button from '../components/Button'
import { supabase } from '../lib/supabase'
import { ensureProfile } from '../lib/gamification'

export default function Comunidad() {
  const [posts, setPosts] = React.useState<Array<{ id: string; content: string; likes: number; created_at: string; user_id: string | null }>>([])
  const [content, setContent] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [uid, setUid] = React.useState<string | null>(null)

  React.useEffect(() => {
    (async () => {
      await ensureProfile()
    const { data: { user } } = await supabase.auth.getUser()
    const id = user?.id || null
    setUid(id)
      await refresh()
    })()
  }, [])

  async function refresh() {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(20)
    if (error) {
      console.warn('[EcoHack] No se pudieron cargar posts (¿creaste la tabla?):', error.message)
      setPosts([])
    } else {
      setPosts(data as any)
    }
  }

  async function submitPost(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    const { error } = await supabase.from('posts').insert({ content: content.trim() })
    setLoading(false)
    if (!error) {
      setContent('')
      await refresh()
    }
  }

  async function likePost(id: string) {
    await supabase.from('posts').update({ likes: (posts.find(p => p.id === id)?.likes ?? 0) + 1 }).eq('id', id)
    await refresh()
  }
  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }} role="main">
      <header className="flex items-center gap-2 p-4 border-b" role="banner" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
  <img src="/icons/ecohack.png" alt="Logo EcoHack" className="w-10 h-10" />
        <span className="font-bold text-xl" style={{letterSpacing: '1px'}}>EcoHack</span>
      </header>
      <main className="p-4" tabIndex={0} aria-label="Comunidad">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Comunidad</h1>
        <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>Comparte tus logros y ve el progreso de otros.</p>
        <form onSubmit={submitPost} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder={uid ? 'Comparte algo...' : 'Inicia sesión para publicar'}
            className="flex-1 px-3 py-2 rounded border"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={content}
            onChange={(e)=>setContent(e.currentTarget.value)}
            disabled={!uid || loading}
            aria-label="Nuevo post"
          />
          <Button type="submit" disabled={!uid || loading}>{loading ? 'Publicando…' : 'Publicar'}</Button>
        </form>
        <div className="space-y-4">
          {posts.map(p => (
            <div key={p.id} className="rounded-xl p-4 shadow flex items-start justify-between gap-4" tabIndex={0} style={{ background: 'var(--color-surface)' }}>
              <div>
                <p style={{ color: 'var(--color-text)' }}>{p.content}</p>
                <span className="text-xs" style={{ color: 'var(--color-border)' }}>{new Date(p.created_at).toLocaleString()}</span>
              </div>
              <button className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }} onClick={()=>likePost(p.id)} aria-label="Me gusta">
                <span className="material-icons" aria-hidden="true">thumb_up</span>
                <span>{p.likes}</span>
              </button>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="rounded-xl p-4 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>Sé el primero en publicar.</div>
          )}
        </div>
      </main>
    </div>
  )
}
