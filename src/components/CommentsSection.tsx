import React, { useState, useEffect } from 'react'
import { Comment, useComments } from '../hooks/useCommunity'
import { useCurrentUser } from '../hooks/useCommunity'

interface CommentsSectionProps {
  postId: string
  onClose?: () => void
}

interface CommentItemProps {
  comment: Comment
  onReply: (commentId: string, content: string) => void
  onLike: (commentId: string) => void
  showReplyForm: string | null
  setShowReplyForm: (id: string | null) => void
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  onReply, 
  onLike, 
  showReplyForm, 
  setShowReplyForm 
}) => {
  const [replyContent, setReplyContent] = useState('')
  const { profile } = useCurrentUser()

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Ahora'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    return `${Math.floor(diffInSeconds / 86400)}d`
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

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent.trim())
      setReplyContent('')
      setShowReplyForm(null)
    }
  }

  return (
    <div className="space-y-3">
      {/* Comentario principal */}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
          {comment.avatar_url ? (
            <img 
              src={comment.avatar_url} 
              alt={comment.full_name || 'Usuario'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-white font-bold text-xs"
              style={{ background: 'var(--color-primary)' }}
            >
              {(comment.full_name || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Contenido del comentario */}
        <div className="flex-1 min-w-0">
          <div 
            className="rounded-lg p-3 text-sm"
            style={{ background: 'var(--color-surface)' }}
          >
            {/* Header del comentario */}
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="font-medium text-xs"
                style={{ color: 'var(--color-text)' }}
              >
                {comment.full_name || 'Usuario Anónimo'}
              </span>
              
              <span 
                className="text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1"
                style={{ 
                  background: `${getEcoLevelColor(comment.eco_level || 'Principiante')}20`,
                  color: getEcoLevelColor(comment.eco_level || 'Principiante')
                }}
              >
                {getEcoLevelIcon(comment.eco_level || 'Principiante')}
                {comment.eco_level || 'Principiante'}
              </span>

              <span 
                className="text-xs"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {formatTimeAgo(comment.created_at)}
              </span>
            </div>

            {/* Contenido */}
            <p 
              className="text-sm"
              style={{ color: 'var(--color-text)' }}
            >
              {comment.content}
            </p>
          </div>

          {/* Acciones del comentario */}
          <div className="flex items-center gap-4 mt-2 ml-3">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                comment.user_has_reacted 
                  ? 'text-red-500' 
                  : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <span className={`material-icons text-sm ${comment.user_has_reacted ? 'text-red-500' : ''}`}>
                {comment.user_has_reacted ? 'favorite' : 'favorite_border'}
              </span>
              {comment.likes_count > 0 && comment.likes_count}
            </button>

            <button
              onClick={() => setShowReplyForm(showReplyForm === comment.id ? null : comment.id)}
              className="text-xs font-medium transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Responder
            </button>
          </div>

          {/* Formulario de respuesta */}
          {showReplyForm === comment.id && (
            <div className="mt-3 ml-3">
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.full_name || 'Tu'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center text-white font-bold text-xs"
                      style={{ background: 'var(--color-primary)' }}
                    >
                      {(profile?.full_name || 'T')[0].toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Escribe una respuesta..."
                    className="w-full p-2 text-sm border rounded-lg resize-none"
                    style={{ 
                      background: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                    rows={2}
                  />
                  
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setShowReplyForm(null)}
                      className="px-3 py-1 text-xs rounded transition-colors"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Cancelar
                    </button>
                    
                    <button
                      onClick={handleSubmitReply}
                      disabled={!replyContent.trim()}
                      className="px-3 py-1 text-xs rounded transition-all disabled:opacity-50"
                      style={{ 
                        background: 'var(--color-primary)',
                        color: 'white'
                      }}
                    >
                      Responder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Respuestas anidadas */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 ml-6 space-y-3 border-l pl-3" style={{ borderColor: 'var(--color-border)' }}>
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onLike={onLike}
                  showReplyForm={showReplyForm}
                  setShowReplyForm={setShowReplyForm}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CommentsSection({ postId, onClose }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('')
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null)
  const { comments, loading, addComment, toggleCommentLike } = useComments(postId)
  const { profile } = useCurrentUser()

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      addComment(newComment.trim())
      setNewComment('')
    }
  }

  const handleReply = (commentId: string, content: string) => {
    addComment(content, commentId)
  }

  const handleLike = (commentId: string) => {
    toggleCommentLike(commentId)
  }

  return (
    <div 
      className="border-t pt-4 mt-4"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 
          className="font-medium"
          style={{ color: 'var(--color-text)' }}
        >
          💬 Comentarios {comments.length > 0 && `(${comments.length})`}
        </h4>
        
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <span className="material-icons text-sm">close</span>
          </button>
        )}
      </div>

      {/* Formulario para nuevo comentario */}
      <div className="mb-4">
        <div className="flex gap-3">
          {/* Avatar del usuario actual */}
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name || 'Tu'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-white font-bold text-xs"
                style={{ background: 'var(--color-primary)' }}
              >
                {(profile?.full_name || 'T')[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Campo de texto */}
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="w-full p-3 border rounded-lg resize-none"
              style={{ 
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)'
              }}
              rows={2}
            />
            
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || loading}
                className="px-4 py-2 text-sm rounded-lg transition-all disabled:opacity-50"
                style={{ 
                  background: 'var(--color-primary)',
                  color: 'white'
                }}
              >
                {loading ? 'Enviando...' : 'Comentar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div 
            className="text-center py-8 text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <div className="text-2xl mb-2">💬</div>
            <p>¡Sé el primero en comentar!</p>
            <p className="text-xs mt-1">Comparte tu opinión o haz una pregunta</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onLike={handleLike}
              showReplyForm={showReplyForm}
              setShowReplyForm={setShowReplyForm}
            />
          ))
        )}
      </div>
    </div>
  )
}