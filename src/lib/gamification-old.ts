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

export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

export async function ensureProfile(): Promise<Profile | null> {
  const { data: auth } = await supabase.auth.getUser()
  const user = auth.user
  if (!user) return null
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  if (error) {
    console.warn('[EcoHack] Tabla profiles no disponible o error:', error.message)
    return null
  }
  if (profile) return profile as Profile
  const { data: created, error: insertError } = await supabase
    .from('profiles')
    .insert({ id: user.id, email: user.email, full_name: (user.user_metadata as any)?.full_name ?? null, points: 0 })
    .select()
    .single()
  if (insertError) {
    console.warn('[EcoHack] No se pudo crear profile:', insertError.message)
    return null
  }
  return created as Profile
}

export async function getProfile(): Promise<Profile | null> {
  const uid = await getCurrentUserId()
  if (!uid) return null
  const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).single()
  if (error) {
    console.warn('[EcoHack] Error al obtener profile:', error.message)
    return null
  }
  return data as Profile
}

export async function addPoints(points: number, reason?: string): Promise<Profile | null> {
  const uid = await getCurrentUserId()
  if (!uid) return null
  const { data, error } = await supabase
    .rpc('increment_points', { p_user_id: uid, p_delta: points })
  if (error) {
    // Fallback si la función no existe: actualizar directo
    // Asegurar que el perfil exista y evitar NaN
    await ensureProfile()
    const current = (await getProfile())?.points ?? 0
    const next = Math.max(0, current + points)
    const { data: updated, error: err2 } = await supabase
      .from('profiles')
      .update({ points: next })
      .eq('id', uid)
      .select()
      .single()
    if (err2) {
      console.warn('[EcoHack] No se pudieron sumar puntos:', err2.message)
      return null
    }
    return updated as Profile
  }
  return (data as any)?.[0] ?? (await getProfile())
}

export async function fetchActiveChallenges(): Promise<Challenge[]> {
  const { data, error } = await supabase.from('challenges').select('*').eq('active', true).order('created_at', { ascending: true })
  if (error) {
    console.warn('[EcoHack] Error al obtener retos:', error.message)
    // Fallback a retos locales básicos
    return [
      { id: 'local-1', title: 'Recicla 5 botellas', description: 'Junta y recicla 5 botellas de plástico', points: 50, active: true, created_at: new Date().toISOString() },
      { id: 'local-2', title: 'Visita un punto de reciclaje', description: 'Ve a tu punto más cercano', points: 30, active: true, created_at: new Date().toISOString() }
    ]
  }
  return (data as Challenge[]) ?? []
}

export async function completeChallenge(challenge: Challenge): Promise<boolean> {
  const uid = await getCurrentUserId()
  if (!uid) return false
  // Registrar finalización
  const { error: insertErr } = await supabase.from('user_challenges').insert({ user_id: uid, challenge_id: challenge.id, completed_at: new Date().toISOString() })
  if (insertErr) {
    console.warn('[EcoHack] No se pudo registrar el reto, se intentará sumar puntos igualmente:', insertErr.message)
  }
  const updated = await addPoints(challenge.points, `challenge:${challenge.id}`)
  return !!updated
}
