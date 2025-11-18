import React, { useEffect } from 'react'
import PostCard from '../components/PostCard'
import CreatePost from '../components/CreatePost'
import { usePosts, useCurrentUser } from '../hooks/useCommunity'
import { useGamification } from '../contexts/GamificationContext'

export default function Comunidad() {
  const { posts, loading, fetchPosts, createPost, toggleReaction } = usePosts()
  const { user, profile } = useCurrentUser()
  const { addPoints } = useGamification()

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleCreatePost = async (content: string, type: 'text' | 'image' | 'achievement' | 'challenge', imageUrl?: string) => {
    const newPost = await createPost(content, type, imageUrl)
    if (newPost) {
      // Dar puntos según el tipo de post
      const points = type === 'achievement' ? 15 : type === 'challenge' ? 10 : 5
      await addPoints(points)
    }
  }

  const handleLike = async (postId: string) => {
    await toggleReaction(postId, 'like')
    // Dar 1 punto por interactuar
    await addPoints(1)
  }

  const handleComment = (postId: string) => {
    // La funcionalidad de comentarios se maneja directamente en PostCard
    // Este handler se mantiene para compatibilidad
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }} role="main">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-2 p-4 border-b backdrop-blur-sm" role="banner" style={{ background: 'var(--color-surface)95', borderColor: 'var(--color-border)' }}>
        <img src="/icons/ecohack.png" alt="Logo EcoHack" className="w-10 h-10" />
        <div className="flex-1">
          <span className="font-bold text-xl" style={{letterSpacing: '1px'}}>EcoHack</span>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Comunidad</p>
        </div>
        
        {/* Contador de usuarios online */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'var(--color-primary)20', color: 'var(--color-primary)' }}>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium">Online</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6" tabIndex={0} aria-label="Feed de la comunidad">
        {/* Bienvenida y estadísticas */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            🌱 Comunidad EcoHack - ACTUALIZADA ✅
          </h1>
          <p className="text-lg mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Comparte tus logros ecológicos y conecta con otros eco-warriors
          </p>
          
          {profile && (
            <div 
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <span className="text-sm">
                <strong>{profile.full_name}</strong> • {profile.eco_level}
              </span>
              <div className="flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                <span className="material-icons text-sm">eco</span>
                <span className="font-bold">{profile.points}</span>
              </div>
            </div>
          )}
        </div>



        {/* Formulario para crear post */}
        <CreatePost 
          onCreatePost={handleCreatePost}
          loading={loading}
        />

        {/* Separador */}
        <div className="text-center">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}
          >
            <span className="material-icons text-sm">dynamic_feed</span>
            Feed de la comunidad
          </div>
        </div>

        {/* Lista de posts */}
        <div className="space-y-4">
          {loading && posts.length === 0 ? (
            // Loading skeleton
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="rounded-xl p-4 animate-pulse"
                  style={{ background: 'var(--color-surface)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded mb-1 w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))
          ) : (
            // Estado vacío
            <div 
              className="text-center py-12 rounded-xl"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <div className="text-6xl mb-4">🌱</div>
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: 'var(--color-text)' }}
              >
                ¡Sé el primero en publicar!
              </h3>
              <p 
                className="text-sm max-w-md mx-auto"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Comparte tu primer logro ecológico, propón un desafío o simplemente saluda a la comunidad. 
                ¡Cada acción cuenta! 🌍
              </p>
            </div>
          )}
        </div>

        {/* Botón para cargar más posts */}
        {posts.length > 0 && (
          <div className="text-center pt-6">
            <button
              onClick={() => fetchPosts(20, posts.length)}
              disabled={loading}
              className="px-6 py-3 rounded-lg transition-all hover:shadow-md disabled:opacity-50"
              style={{ 
                background: 'var(--color-surface)', 
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)'
              }}
            >
              {loading ? (
                <>
                  <span className="material-icons animate-spin text-sm mr-2">refresh</span>
                  Cargando...
                </>
              ) : (
                <>
                  <span className="material-icons text-sm mr-2">expand_more</span>
                  Cargar más posts
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer de comunidad */}
        <div 
          className="text-center text-xs p-4 rounded-lg mt-8"
          style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}
        >
          <p>💚 Unidos por un planeta más verde</p>
          <p>Recuerda: cada pequeña acción suma para un gran cambio</p>
        </div>
      </main>
    </div>
  )
}
