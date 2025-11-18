import React, { useState } from 'react'
import { Post } from '../hooks/useCommunity'

interface PostCardProps {
  post: Post
  onLike: (postId: string) => void
  onComment: (postId: string) => void
  onShare?: (postId: string) => void
}

export default function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Ahora'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  const getEcoLevelColor = (level: string) => {
    switch (level) {
      case 'Principiante': return '#6B7280'
      case 'Intermedio': return '#059669'
      case 'Avanzado': return '#047857'
      case 'Experto': return '#065F46'
      default: return '#6B7280'
    }
  }

  const getEcoLevelIcon = (level: string) => {
    switch (level) {
      case 'Principiante': return '🌱'
      case 'Intermedio': return '🌿'
      case 'Avanzado': return '🌳'
      case 'Experto': return '🏆'
      default: return '🌱'
    }
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return '🏆'
      case 'challenge': return '💪'
      case 'image': return '📸'
      default: return ''
    }
  }

  return (
    <div 
      className="rounded-xl p-4 shadow-sm border transition-all hover:shadow-md" 
      style={{ 
        background: 'var(--color-surface)', 
        borderColor: 'var(--color-border)' 
      }}
    >
      {/* Header del post - Usuario */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
          {post.avatar_url ? (
            <img 
              src={post.avatar_url} 
              alt={post.full_name || 'Usuario'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-white font-bold"
              style={{ background: 'var(--color-primary)' }}
            >
              {(post.full_name || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Info del usuario */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 
              className="font-semibold text-sm truncate"
              style={{ color: 'var(--color-text)' }}
            >
              {post.full_name || 'Usuario Anónimo'}
            </h3>
            
            {/* Nivel ecológico */}
            <span 
              className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
              style={{ 
                background: `${getEcoLevelColor(post.eco_level || 'Principiante')}20`,
                color: getEcoLevelColor(post.eco_level || 'Principiante')
              }}
            >
              {getEcoLevelIcon(post.eco_level || 'Principiante')}
              {post.eco_level || 'Principiante'}
            </span>

            {/* Tipo de post */}
            {post.post_type !== 'text' && (
              <span className="text-xs">
                {getPostTypeIcon(post.post_type)}
              </span>
            )}
          </div>
          
          <p 
            className="text-xs mt-1"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {formatTimeAgo(post.created_at)}
          </p>
        </div>

        {/* Menú de opciones */}
        <button 
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <span className="material-icons text-sm">more_horiz</span>
        </button>
      </div>

      {/* Contenido del post */}
      <div className="mb-3">
        <p 
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: 'var(--color-text)' }}
        >
          {post.content}
        </p>

        {/* Imagen si existe */}
        {post.image_url && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img 
              src={post.image_url} 
              alt="Imagen del post" 
              className="w-full h-auto max-h-80 object-cover"
            />
          </div>
        )}
      </div>

      {/* Estadísticas (likes, comentarios) */}
      {(post.likes_count > 0 || post.comments_count > 0) && (
        <div 
          className="flex items-center justify-between py-2 mb-2 border-b text-xs"
          style={{ 
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-secondary)'
          }}
        >
          <div className="flex items-center gap-4">
            {post.likes_count > 0 && (
              <span className="flex items-center gap-1">
                <span className="text-red-500">❤️</span>
                {post.likes_count}
              </span>
            )}
          </div>
          
          {post.comments_count > 0 && (
            <button 
              onClick={() => setShowComments(!showComments)}
              className="hover:underline"
            >
              {post.comments_count} comentario{post.comments_count !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* Botón Like */}
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
              post.user_has_reacted 
                ? 'text-red-500 bg-red-50' 
                : 'hover:bg-gray-100'
            }`}
            style={{ 
              color: post.user_has_reacted ? '#EF4444' : 'var(--color-text-secondary)',
              background: post.user_has_reacted ? '#FEF2F2' : 'transparent'
            }}
          >
            <span className={`material-icons text-lg ${post.user_has_reacted ? 'text-red-500' : ''}`}>
              {post.user_has_reacted ? 'favorite' : 'favorite_border'}
            </span>
            Me gusta
          </button>

          {/* Botón Comentar */}
          <button
            onClick={() => {
              setShowComments(!showComments)
              onComment(post.id)
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium hover:bg-gray-100"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <span className="material-icons text-lg">chat_bubble_outline</span>
            Comentar
          </button>

          {/* Botón Compartir */}
          {onShare && (
            <button
              onClick={() => onShare(post.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium hover:bg-gray-100"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <span className="material-icons text-lg">share</span>
              Compartir
            </button>
          )}
        </div>
      </div>

      {/* Sección de comentarios */}
      {showComments && (
        <div 
          className="mt-3 pt-3 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <p 
            className="text-sm text-center"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            💬 Sección de comentarios próximamente...
          </p>
        </div>
      )}
    </div>
  )
}