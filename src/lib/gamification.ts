import { supabase } from './supabase'
import challengesData from '../data/challenges.json'

export interface Challenge {
  id: string
  title: string
  description: string
  points: number
  tipo: string
  completed: boolean
}

export interface UserProfile {
  id: string
  user_id: string
  full_name: string | null
  points: number
  created_at: string
}

export async function ensureProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (existingProfile) {
      return existingProfile
    }

    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
        points: 0
      })
      .select()
      .single()

    if (error) throw error
    return newProfile

  } catch (error) {
    console.error('Error en ensureProfile:', error)
    // Retornar un perfil simulado si no hay conexión a Supabase
    return {
      id: 'demo-id',
      user_id: 'demo-user',
      full_name: 'Usuario Demo',
      points: 150,
      created_at: new Date().toISOString()
    }
  }
}

export async function getProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      // Si no hay usuario autenticado, retornamos un perfil demo
      return {
        id: 'demo-id',
        user_id: 'demo-user', 
        full_name: 'Usuario Demo',
        points: 150,
        created_at: new Date().toISOString()
      }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return profile || null
  } catch (error) {
    console.error('Error al obtener perfil:', error)
    // Retornar perfil demo en caso de error
    return {
      id: 'demo-id',
      user_id: 'demo-user',
      full_name: 'Usuario Demo', 
      points: 150,
      created_at: new Date().toISOString()
    }
  }
}

export async function addPoints(points: number): Promise<boolean> {
  try {
    const profile = await ensureProfile()
    if (!profile) return false

    const currentPoints = Math.max(0, profile.points || 0)
    const newPoints = currentPoints + Math.max(0, points)

    const { error } = await supabase
      .from('profiles')
      .update({ points: newPoints })
      .eq('user_id', profile.user_id)

    if (error) throw error
    return true

  } catch (error) {
    console.error('Error al añadir puntos:', error)
    return false
  }
}

export async function fetchActiveChallenges(): Promise<Challenge[]> {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('points', { ascending: true })

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    // Si no hay datos en BD, usar datos locales
    if (!data || data.length === 0) {
      return challengesData.map(challenge => ({
        ...challenge,
        completed: false
      }))
    }

    return data.map(challenge => ({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      points: challenge.points,
      tipo: challenge.tipo || 'general',
      completed: challenge.completed || false
    }))

  } catch (error) {
    console.error('Error al obtener retos:', error)
    // Fallback a datos locales
    return challengesData.map(challenge => ({
      ...challenge,
      completed: false
    }))
  }
}

export async function completeChallenge(challengeId: string): Promise<boolean> {
  try {
    const profile = await ensureProfile()
    if (!profile) return false

    // Buscar el reto
    const challenges = await fetchActiveChallenges()
    const challenge = challenges.find(c => c.id === challengeId)
    if (!challenge || challenge.completed) return false

    // Añadir puntos
    const success = await addPoints(challenge.points)
    if (!success) return false

    // Marcar como completado en BD (si existe la tabla)
    try {
      await supabase
        .from('user_challenges')
        .upsert({
          user_id: profile.user_id,
          challenge_id: challengeId,
          completed: true,
          completed_at: new Date().toISOString()
        })
    } catch (error) {
      // Ignorar errores de BD para esta función
      console.log('BD no disponible para retos, usando fallback')
    }

    return true

  } catch (error) {
    console.error('Error al completar reto:', error)
    return false
  }
}