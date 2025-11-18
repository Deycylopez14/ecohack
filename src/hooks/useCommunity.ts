import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface Profile {
  id: string
  email?: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  eco_level: string
  points: number
  location: string | null
}

export interface Post {
  id: string
  user_id: string
  content: string
  image_url?: string
  post_type: 'text' | 'image' | 'achievement' | 'challenge'
  likes_count: number
  comments_count: number
  shares_count: number
  is_public: boolean
  created_at: string
  // Datos del usuario
  full_name?: string
  avatar_url?: string
  eco_level?: string
  user_has_reacted?: boolean
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  parent_id?: string
  content: string
  likes_count: number
  created_at: string
  // Datos del usuario
  full_name?: string
  avatar_url?: string
  eco_level?: string
  user_has_reacted?: boolean
  // Respuestas anidadas
  replies?: Comment[]
}

export interface Notification {
  id: string
  user_id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'achievement'
  title: string
  message?: string
  read: boolean
  related_post_id?: string
  related_user_id?: string
  created_at: string
}

// Datos de prueba para desarrollo
const mockPosts: Post[] = [
  {
    id: '1',
    user_id: 'user1',
    content: '🌱 ¡Bienvenidos a la nueva comunidad de EcoHack! Aquí podremos compartir nuestros logros ecológicos y motivarnos mutuamente. ¿Cuál fue tu última acción verde?',
    post_type: 'text',
    likes_count: 12,
    comments_count: 3,
    shares_count: 2,
    is_public: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    full_name: 'Ana García',
    eco_level: 'Experto',
    user_has_reacted: false
  },
  {
    id: '2',
    user_id: 'user2',
    content: '🏆 ¡Completé mi primer desafío de reciclaje! Logré separar correctamente todos mis residuos durante una semana completa. Fue más fácil de lo que pensaba una vez que te acostumbras. ¡Recomiendo intentarlo!',
    post_type: 'achievement',
    likes_count: 25,
    comments_count: 8,
    shares_count: 5,
    is_public: true,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 horas atrás
    full_name: 'Carlos Mendoza',
    eco_level: 'Intermedio',
    user_has_reacted: true
  },
  {
    id: '3',
    user_id: 'user3',
    content: '💪 Propongo un nuevo reto: ¿Quién se anima a usar solo transporte público o bicicleta durante los próximos 7 días? Podemos compartir nuestras experiencias y tips para hacer el cambio más fácil.',
    post_type: 'challenge',
    likes_count: 18,
    comments_count: 12,
    shares_count: 7,
    is_public: true,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 horas atrás
    full_name: 'María López',
    eco_level: 'Avanzado',
    user_has_reacted: false
  },
  {
    id: '4',
    user_id: 'user4',
    content: '📸 Miren lo que encontré en mi jardín después de 3 meses de compostaje casero. ¡La tierra se ve increíble! Los tomates van a estar felices esta temporada.',
    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop',
    post_type: 'image',
    likes_count: 31,
    comments_count: 15,
    shares_count: 9,
    is_public: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 día atrás
    full_name: 'Roberto Silva',
    eco_level: 'Principiante',
    user_has_reacted: true
  }
]

// Hook para gestionar el estado del usuario actual
export function useCurrentUser() {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener usuario actual
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
          // Intentar obtener perfil de Supabase
          let { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (error || !profile) {
            // Si falla, crear perfil de prueba
            const mockProfile: Profile = {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario Demo',
              avatar_url: null,
              bio: 'Usuario apasionado por el medio ambiente 🌱',
              eco_level: 'Intermedio',
              points: 150,
              location: 'México'
            }
            setProfile(mockProfile)
          } else {
            setProfile(profile)
          }
        } else {
          // Usuario no logueado, crear perfil demo
          const demoProfile: Profile = {
            id: 'demo-user',
            email: 'demo@ecohack.com',
            full_name: 'Usuario Demo',
            avatar_url: null,
            bio: 'Explora EcoHack como usuario demo',
            eco_level: 'Principiante',
            points: 50,
            location: 'Demo'
          }
          setProfile(demoProfile)
          setUser({ id: 'demo-user', email: 'demo@ecohack.com' })
        }
      } catch (error) {
        console.warn('[EcoHack] Error conectando con Supabase, usando datos demo:', error)
        // Fallback a datos demo
        const demoProfile: Profile = {
          id: 'demo-user',
          email: 'demo@ecohack.com',
          full_name: 'Usuario Demo',
          avatar_url: null,
          bio: 'Explora EcoHack como usuario demo',
          eco_level: 'Principiante',
          points: 50,
          location: 'Demo'
        }
        setProfile(demoProfile)
        setUser({ id: 'demo-user', email: 'demo@ecohack.com' })
      }
      setLoading(false)
    }

    getUser()

    // Escuchar cambios en auth (solo si Supabase está configurado)
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(getUser)
      return () => subscription.unsubscribe()
    } catch (error) {
      console.warn('[EcoHack] Auth listener no disponible')
    }
  }, [])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return

    try {
      const { data } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (data) {
        setProfile(data)
      }
    } catch (error) {
      // Fallback para modo demo
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  return { user, profile, loading, updateProfile }
}

// Hook para gestionar posts
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [loading, setLoading] = useState(false)

  const fetchPosts = async (limit = 20, offset = 0) => {
    setLoading(true)
    
    try {
      // Intentar cargar desde Supabase
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(full_name, avatar_url, eco_level)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (!error && data && data.length > 0) {
        const postsWithUserData = data.map(post => ({
          ...post,
          full_name: post.profiles?.full_name,
          avatar_url: post.profiles?.avatar_url,
          eco_level: post.profiles?.eco_level
        }))
        
        if (offset === 0) {
          setPosts(postsWithUserData)
        } else {
          setPosts(prev => [...prev, ...postsWithUserData])
        }
      } else {
        // Usar datos de prueba si Supabase no está disponible
        if (offset === 0) {
          setPosts(mockPosts)
        }
      }
    } catch (error) {
      console.warn('[EcoHack] Usando datos demo para posts:', error)
      if (offset === 0) {
        setPosts(mockPosts)
      }
    }
    
    setLoading(false)
  }

  const createPost = async (content: string, postType: Post['post_type'] = 'text', imageUrl?: string) => {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) {
        // Crear post demo
        const newMockPost: Post = {
          id: Date.now().toString(),
          user_id: 'demo-user',
          content,
          post_type: postType,
          image_url: imageUrl,
          likes_count: 0,
          comments_count: 0,
          shares_count: 0,
          is_public: true,
          created_at: new Date().toISOString(),
          full_name: 'Usuario Demo',
          eco_level: 'Principiante',
          user_has_reacted: false
        }
        setPosts(prev => [newMockPost, ...prev])
        return newMockPost
      }

      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.user.id,
          content,
          post_type: postType,
          image_url: imageUrl
        })
        .select()
        .single()

      if (!error && data) {
        await fetchPosts() // Refresh posts
        return data
      } else {
        // Fallback a post demo
        const newMockPost: Post = {
          id: Date.now().toString(),
          user_id: user.user.id,
          content,
          post_type: postType,
          image_url: imageUrl,
          likes_count: 0,
          comments_count: 0,
          shares_count: 0,
          is_public: true,
          created_at: new Date().toISOString(),
          full_name: 'Tu Usuario',
          eco_level: 'Intermedio',
          user_has_reacted: false
        }
        setPosts(prev => [newMockPost, ...prev])
        return newMockPost
      }
    } catch (error) {
      console.warn('[EcoHack] Error creando post, usando modo demo:', error)
      return null
    }
  }

  const toggleReaction = async (postId: string, reactionType = 'like') => {
    // Actualizar optimísticamente la UI
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const wasLiked = post.user_has_reacted
        return {
          ...post,
          likes_count: wasLiked ? post.likes_count - 1 : post.likes_count + 1,
          user_has_reacted: !wasLiked
        }
      }
      return post
    }))

    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return

      // Verificar si ya reaccionó
      const { data: existing } = await supabase
        .from('reactions')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('post_id', postId)
        .single()

      if (existing) {
        // Quitar reacción
        await supabase
          .from('reactions')
          .delete()
          .eq('id', existing.id)
      } else {
        // Agregar reacción
        await supabase
          .from('reactions')
          .insert({
            user_id: user.user.id,
            post_id: postId,
            reaction_type: reactionType
          })
      }
    } catch (error) {
      console.warn('[EcoHack] Error con reacciones, usando modo demo:', error)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return {
    posts,
    loading,
    fetchPosts,
    createPost,
    toggleReaction
  }
}

// Hook para gestionar comentarios
export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)

  // Datos de ejemplo para comentarios
  const mockComments: Comment[] = [
    {
      id: '1',
      post_id: postId,
      user_id: 'user1',
      content: '¡Excelente iniciativa! Me parece genial que estemos creando una comunidad tan comprometida con el medio ambiente. 🌱',
      likes_count: 5,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      full_name: 'Ana García',
      eco_level: 'Experto',
      user_has_reacted: false,
      replies: [
        {
          id: '1-1',
          post_id: postId,
          user_id: 'user2',
          parent_id: '1',
          content: '¡Totalmente de acuerdo! Juntos podemos lograr mucho más 💪',
          likes_count: 2,
          created_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
          full_name: 'Carlos Mendoza',
          eco_level: 'Intermedio',
          user_has_reacted: true
        }
      ]
    },
    {
      id: '2',
      post_id: postId,
      user_id: 'user3',
      content: '¿Alguien tiene tips para principiantes? Quiero empezar pero no sé por dónde.',
      likes_count: 3,
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      full_name: 'María López',
      eco_level: 'Principiante',
      user_has_reacted: false,
      replies: []
    }
  ]

  const fetchComments = async () => {
    setLoading(true)
    
    try {
      // Intentar cargar desde Supabase
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id(full_name, avatar_url, eco_level)
        `)
        .eq('post_id', postId)
        .is('parent_id', null)
        .order('created_at', { ascending: true })

      if (!error && data && data.length > 0) {
        // Procesar comentarios y obtener respuestas
        const commentsWithReplies = await Promise.all(
          data.map(async (comment) => {
            const { data: replies } = await supabase
              .from('comments')
              .select(`
                *,
                profiles:user_id(full_name, avatar_url, eco_level)
              `)
              .eq('parent_id', comment.id)
              .order('created_at', { ascending: true })

            return {
              ...comment,
              full_name: comment.profiles?.full_name,
              avatar_url: comment.profiles?.avatar_url,
              eco_level: comment.profiles?.eco_level,
              replies: replies?.map(reply => ({
                ...reply,
                full_name: reply.profiles?.full_name,
                avatar_url: reply.profiles?.avatar_url,
                eco_level: reply.profiles?.eco_level,
                user_has_reacted: false // TODO: Implementar check de reacciones
              })) || []
            }
          })
        )

        setComments(commentsWithReplies)
      } else {
        // Usar datos demo si no hay datos reales
        setComments(mockComments)
      }
    } catch (error) {
      console.warn('[EcoHack] Usando datos demo para comentarios:', error)
      setComments(mockComments)
    }
    
    setLoading(false)
  }

  const addComment = async (content: string, parentId?: string) => {
    try {
      const { data: user } = await supabase.auth.getUser()
      
      if (user.user) {
        // Intentar crear en Supabase
        const { data, error } = await supabase
          .from('comments')
          .insert({
            post_id: postId,
            user_id: user.user.id,
            parent_id: parentId,
            content
          })
          .select()
          .single()

        if (!error && data) {
          await fetchComments() // Refrescar comentarios
          return data
        }
      }

      // Fallback: agregar comentario demo
      const newComment: Comment = {
        id: Date.now().toString(),
        post_id: postId,
        user_id: user.user?.id || 'demo-user',
        content,
        parent_id: parentId,
        likes_count: 0,
        created_at: new Date().toISOString(),
        full_name: user.user ? 'Tu Usuario' : 'Usuario Demo',
        eco_level: 'Intermedio',
        user_has_reacted: false,
        replies: []
      }

      if (parentId) {
        // Es una respuesta
        setComments(prev => prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment]
            }
          }
          return comment
        }))
      } else {
        // Es un comentario principal
        setComments(prev => [...prev, newComment])
      }

      return newComment
    } catch (error) {
      console.warn('[EcoHack] Error creando comentario:', error)
      return null
    }
  }

  const toggleCommentLike = async (commentId: string) => {
    // Actualizar UI optimísticamente
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes_count: comment.user_has_reacted ? comment.likes_count - 1 : comment.likes_count + 1,
          user_has_reacted: !comment.user_has_reacted
        }
      }
      
      // Revisar también las respuestas
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === commentId) {
              return {
                ...reply,
                likes_count: reply.user_has_reacted ? reply.likes_count - 1 : reply.likes_count + 1,
                user_has_reacted: !reply.user_has_reacted
              }
            }
            return reply
          })
        }
      }
      
      return comment
    }))

    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return

      // Verificar si ya tiene like
      const { data: existing } = await supabase
        .from('reactions')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('comment_id', commentId)
        .single()

      if (existing) {
        // Quitar like
        await supabase
          .from('reactions')
          .delete()
          .eq('id', existing.id)
      } else {
        // Agregar like
        await supabase
          .from('reactions')
          .insert({
            user_id: user.user.id,
            comment_id: commentId,
            reaction_type: 'like'
          })
      }
    } catch (error) {
      console.warn('[EcoHack] Error con like de comentario:', error)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  return {
    comments,
    loading,
    fetchComments,
    addComment,
    toggleCommentLike
  }
}

// Hook para gestionar notificaciones (simplificado)
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    // Demo notifications
    const demoNotifications: Notification[] = [
      {
        id: '1',
        user_id: 'demo-user',
        type: 'like',
        title: 'Nuevo Me Gusta',
        message: 'A alguien le gustó tu publicación sobre reciclaje',
        read: false,
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ]
    setNotifications(demoNotifications)
    setUnreadCount(1)
  }

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  }
}