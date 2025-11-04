import React, { createContext, useContext, useEffect, useState } from 'react'
import { getProfile, addPoints as addPointsToDb, ensureProfile, UserProfile } from '../lib/gamification'

interface GamificationContextType {
  profile: UserProfile | null
  totalPoints: number
  addPoints: (points: number) => Promise<boolean>
  refreshProfile: () => Promise<void>
  loading: boolean
  recentPointsGained: { points: number; timestamp: number; source: string }[]
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined)

export function useGamification() {
  const context = useContext(GamificationContext)
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider')
  }
  return context
}

interface GamificationProviderProps {
  children: React.ReactNode
}

export function GamificationProvider({ children }: GamificationProviderProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [totalPoints, setTotalPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [recentPointsGained, setRecentPointsGained] = useState<{ points: number; timestamp: number; source: string }[]>([])

  // Función para refrescar el perfil con fallback local
  const refreshProfile = async () => {
    try {
      setLoading(true)
      console.log('🔄 Refrescando perfil...')
      
      // Intentar cargar desde la base de datos
      await ensureProfile()
      const userProfile = await getProfile()
      
      if (userProfile) {
        console.log('✅ Perfil cargado desde BD:', userProfile.points, 'puntos')
        setProfile(userProfile)
        setTotalPoints(userProfile.points)
        
        // Sincronizar con localStorage
        const userId = userProfile.user_id || 'default'
        localStorage.setItem(`totalPoints_${userId}`, userProfile.points.toString())
      } else {
        // Fallback a localStorage si no hay conexión
        console.log('⚠️ No se pudo cargar desde BD, usando localStorage')
        await loadFromLocalStorage()
      }
    } catch (error) {
      console.error('❌ Error refreshing profile, usando localStorage:', error)
      await loadFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  // Función auxiliar para cargar desde localStorage
  const loadFromLocalStorage = async () => {
    try {
      // Intentar obtener userId desde auth
      let userId = 'default'
      try {
        const { supabase } = await import('../lib/supabase')
        const { data } = await supabase.auth.getUser()
        if (data.user?.email) {
          userId = data.user.email
        } else if (data.user?.id) {
          userId = data.user.id
        }
      } catch (authError) {
        console.log('No se pudo obtener usuario, usando default')
      }

      const localKey = `totalPoints_${userId}`
      const savedPoints = localStorage.getItem(localKey)
      
      if (savedPoints) {
        const points = parseInt(savedPoints, 10)
        console.log(`📱 Cargando ${points} puntos desde localStorage`)
        setTotalPoints(points)
        setProfile({
          id: userId,
          user_id: userId,
          full_name: `Usuario EcoHack`,
          points: points,
          created_at: new Date().toISOString()
        })
      } else {
        console.log('📱 No hay puntos guardados localmente, iniciando en 0')
        setTotalPoints(0)
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      setTotalPoints(0)
    }
  }

  // Función para agregar puntos con notificación y guardado local
  const addPoints = async (points: number, source: string = 'juego') => {
    try {
      console.log(`🎮 Agregando ${points} puntos desde: ${source}`)
      
      // SIEMPRE actualizar el estado local PRIMERO para respuesta inmediata
      const newTotalPoints = totalPoints + points
      setTotalPoints(newTotalPoints)
      setProfile(prev => prev ? { ...prev, points: prev.points + points } : null)
      
      // Guardar en localStorage como respaldo
      const userId = profile?.user_id || 'default'
      const localKey = `totalPoints_${userId}`
      localStorage.setItem(localKey, newTotalPoints.toString())
      localStorage.setItem(`pointsLastUpdated_${userId}`, Date.now().toString())
      console.log(`💾 Puntos guardados localmente: ${newTotalPoints}`)
      
      // Agregar notificación de puntos ganados
      const newPointsNotification = {
        points,
        timestamp: Date.now(),
        source
      }
      setRecentPointsGained(prev => [...prev.slice(-4), newPointsNotification])
      
      // Intentar guardar en la base de datos (en segundo plano)
      try {
        const success = await addPointsToDb(points)
        if (success) {
          console.log('✅ Puntos guardados en base de datos')
          // Sincronizar después de un momento
          setTimeout(() => {
            refreshProfile()
          }, 2000)
        } else {
          console.log('⚠️ No se pudo guardar en BD, pero se mantienen localmente')
        }
      } catch (dbError) {
        console.error('❌ Error en BD, puntos mantenidos localmente:', dbError)
      }
      
      // Limpiar la notificación después de 5 segundos
      setTimeout(() => {
        setRecentPointsGained(prev => prev.filter(p => p.timestamp !== newPointsNotification.timestamp))
      }, 5000)
      
      return true
    } catch (error) {
      console.error('Error adding points:', error)
      return false
    }
  }

  // Cargar perfil inicial
  useEffect(() => {
    refreshProfile()
  }, [])

  // Actualizar automáticamente cada 30 segundos cuando hay actividad
  useEffect(() => {
    if (!loading && profile) {
      const interval = setInterval(() => {
        refreshProfile()
      }, 30000) // 30 segundos

      return () => clearInterval(interval)
    }
  }, [loading, profile])

  const value: GamificationContextType = {
    profile,
    totalPoints,
    addPoints,
    refreshProfile,
    loading,
    recentPointsGained
  }

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  )
}