import React, { useState } from 'react'
import Button from './Button'
import { useCurrentUser } from '../hooks/useCommunity'

interface CreatePostProps {
  onCreatePost: (content: string, type: 'text' | 'image' | 'achievement' | 'challenge', imageUrl?: string) => void
  loading?: boolean
}

export default function CreatePost({ onCreatePost, loading = false }: CreatePostProps) {
  const { user, profile } = useCurrentUser()
  const [content, setContent] = useState('')
  const [postType, setPostType] = useState<'text' | 'image' | 'achievement' | 'challenge'>('text')
  const [imageUrl, setImageUrl] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    onCreatePost(content.trim(), postType, imageUrl.trim() || undefined)
    setContent('')
    setImageUrl('')
    setPostType('text')
    setShowAdvanced(false)
  }

  const getPlaceholderText = () => {
    switch (postType) {
      case 'achievement':
        return '¡Comparte tu logro ecológico! Ej: "¡Completé mi primer día sin plástico!"'
      case 'challenge':
        return 'Propón un desafío ecológico... Ej: "¿Quién se anima a usar solo transporte público esta semana?"'
      case 'image':
        return 'Describe tu imagen... ¿Qué ves? ¿Dónde fue tomada?'
      default:
        return '¿Qué está pasando en tu mundo ecológico?'
    }
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return '🏆'
      case 'challenge': return '💪'
      case 'image': return '📸'
      default: return '💭'
    }
  }

  if (!user) {
    return (
      <div 
        className="rounded-xl p-4 shadow-sm border text-center"
        style={{ 
          background: 'var(--color-surface)', 
          borderColor: 'var(--color-border)' 
        }}
      >
        <p style={{ color: 'var(--color-text-secondary)' }}>
          🌱 Inicia sesión para compartir con la comunidad ecológica
        </p>
      </div>
    )
  }

  return (
    <div 
      className="rounded-xl p-4 shadow-sm border"
      style={{ 
        background: 'var(--color-surface)', 
        borderColor: 'var(--color-border)' 
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Header con avatar y tipo de post */}
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar del usuario */}
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name || 'Tu avatar'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-white font-bold"
                style={{ background: 'var(--color-primary)' }}
              >
                {(profile?.full_name || 'U')[0].toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1">
            <p 
              className="font-medium text-sm"
              style={{ color: 'var(--color-text)' }}
            >
              {profile?.full_name || 'Usuario'}
            </p>
            
            {/* Selector de tipo de post */}
            <div className="flex items-center gap-2 mt-1">
              {(['text', 'achievement', 'challenge', 'image'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPostType(type)}
                  className={`text-xs px-2 py-1 rounded-full transition-all ${
                    postType === type 
                      ? 'bg-green-100 text-green-700 ring-1 ring-green-300' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {getPostTypeIcon(type)} {type === 'text' ? 'Post' : type === 'achievement' ? 'Logro' : type === 'challenge' ? 'Reto' : 'Imagen'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Textarea para contenido */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={getPlaceholderText()}
          className="w-full p-3 rounded-lg border resize-none transition-all focus:ring-2 focus:ring-green-500 focus:border-green-500"
          style={{ 
            background: 'var(--color-bg)', 
            borderColor: 'var(--color-border)', 
            color: 'var(--color-text)',
            minHeight: '80px'
          }}
          rows={3}
          maxLength={500}
          disabled={loading}
        />

        {/* URL de imagen (si es tipo imagen) */}
        {postType === 'image' && (
          <div className="mt-3">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL de la imagen (opcional)"
              className="w-full p-2 rounded-lg border text-sm"
              style={{ 
                background: 'var(--color-bg)', 
                borderColor: 'var(--color-border)', 
                color: 'var(--color-text)'
              }}
              disabled={loading}
            />
            {imageUrl && (
              <div className="mt-2">
                <img 
                  src={imageUrl} 
                  alt="Vista previa" 
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Footer con contador de caracteres y botones */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span 
              className={`text-xs ${content.length > 450 ? 'text-red-500' : 'text-gray-500'}`}
            >
              {content.length}/500
            </span>
            
            {postType !== 'text' && (
              <span 
                className="text-xs px-2 py-1 rounded-full"
                style={{ 
                  background: 'var(--color-primary)20',
                  color: 'var(--color-primary)'
                }}
              >
                {getPostTypeIcon(postType)} {postType === 'achievement' ? 'Logro' : postType === 'challenge' ? 'Reto' : 'Imagen'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Botón para opciones avanzadas */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs px-3 py-1 rounded-lg transition-all hover:bg-gray-100"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <span className="material-icons text-sm mr-1">settings</span>
              Opciones
            </button>

            {/* Botón publicar */}
            <Button
              type="submit"
              disabled={!content.trim() || loading || content.length > 500}
              className="px-6"
            >
              {loading ? (
                <>
                  <span className="material-icons animate-spin text-sm mr-1">refresh</span>
                  Publicando...
                </>
              ) : (
                <>
                  <span className="material-icons text-sm mr-1">send</span>
                  Publicar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Opciones avanzadas */}
        {showAdvanced && (
          <div 
            className="mt-3 p-3 rounded-lg border-t"
            style={{ 
              background: 'var(--color-bg)',
              borderColor: 'var(--color-border)'
            }}
          >
            <p 
              className="text-xs mb-2 font-medium"
              style={{ color: 'var(--color-text)' }}
            >
              🎯 Tips para tu post:
            </p>
            <ul 
              className="text-xs space-y-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <li>• Sé específico sobre tus acciones ecológicas</li>
              <li>• Incluye números o datos cuando sea posible</li>
              <li>• Inspira a otros con tu ejemplo</li>
              {postType === 'achievement' && <li>• Cuenta cómo te sientes con tu logro</li>}
              {postType === 'challenge' && <li>• Haz que sea alcanzable para todos</li>}
            </ul>
          </div>
        )}
      </form>
    </div>
  )
}