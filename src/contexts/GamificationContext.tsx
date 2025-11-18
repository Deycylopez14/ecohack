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
        
        // Obtener datos adicionales desde localStorage si están disponibles
        const userId = userProfile.user_id || 'default'
        const profileKey = `profileData_${userId}`
        const savedProfileData = localStorage.getItem(profileKey)
        
        let fullName = userProfile.full_name
        if (savedProfileData) {
          try {
            const localData = JSON.parse(savedProfileData)
            // Priorizar el nombre guardado localmente si es más reciente
            if (localData.fullName && localData.fullName.trim() !== '') {
              fullName = localData.fullName
              console.log('📋 Usando nombre desde localStorage:', fullName)
            }
          } catch (error) {
            console.log('Error parsing local profile data:', error)
          }
        }
        
        // Actualizar profile con datos combinados
        const updatedProfile = {
          ...userProfile,
          full_name: fullName
        }
        
        setProfile(updatedProfile)
        setTotalPoints(userProfile.points)
        
        // Sincronizar con localStorage
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
      // Sistema robusto de identificación de usuario para cross-device
      let userId = 'ecohack_user_default'
      
      // Buscar datos en múltiples keys posibles para máxima compatibilidad
      const possibleKeys = [
        `totalPoints_${userId}`,
        'totalPoints_ecohack_user_default',
        'totalPoints_default'
      ]

      const possibleProfileKeys = [
        `profileData_${userId}`,
        'profileData_ecohack_user_default',
        'profileData_default'
      ]

      let savedPoints = null
      let foundPointsKey = null
      let profileData = null
      let foundProfileKey = null

      // Buscar puntos en cualquier key posible
      for (const key of possibleKeys) {
        const points = localStorage.getItem(key as string)
        if (points !== null) {
          savedPoints = points
          foundPointsKey = key
          console.log(`📱 Puntos encontrados en key: ${key}`)
          break
        }
      }

      // Buscar datos de perfil en cualquier key posible
      for (const key of possibleProfileKeys) {
        const data = key ? localStorage.getItem(key as string) : null
        if (data !== null) {
          try {
            profileData = JSON.parse(data)
            foundProfileKey = key
            console.log(`📋 Datos de perfil encontrados en key: ${key}`, profileData)
            break
          } catch (error) {
            console.log(`Error parsing profile data from key ${key}:`, error)
          }
        }
      }

      // Migrar datos a key principal si se encontraron en otras keys
      const mainPointsKey = `totalPoints_${userId}`
      const mainProfileKey = `profileData_${userId}`

      if (savedPoints && foundPointsKey !== mainPointsKey) {
        localStorage.setItem(mainPointsKey, savedPoints)
        console.log(`🔄 Puntos migrados de ${foundPointsKey} a ${mainPointsKey}`)
      }

      if (profileData && foundProfileKey !== mainProfileKey) {
        localStorage.setItem(mainProfileKey, JSON.stringify(profileData))
        console.log(`🔄 Perfil migrado de ${foundProfileKey} a ${mainProfileKey}`)
      }

      // Configurar estado con datos encontrados
      if (savedPoints) {
        const points = parseInt(savedPoints, 10)
        console.log(`📱 Cargando ${points} puntos desde localStorage`)
        setTotalPoints(points)
        setProfile({
          id: userId,
          user_id: userId,
          full_name: profileData?.fullName || `Usuario EcoHack`,
          points: points,
          created_at: new Date().toISOString()
        })
      } else {
        console.log('📱 No hay puntos guardados localmente, iniciando en 0')
        setTotalPoints(0)
        // Crear perfil básico incluso sin puntos
        setProfile({
          id: userId,
          user_id: userId,
          full_name: profileData?.fullName || `Usuario EcoHack`,
          points: 0,
          created_at: new Date().toISOString()
        })
      }

      // Intentar sincronizar con sessionStorage para consistencia cross-tab
      try {
        if (savedPoints) {
          sessionStorage.setItem(`totalPoints_${userId}`, savedPoints)
        }
        if (profileData) {
          sessionStorage.setItem(`profileData_${userId}`, JSON.stringify(profileData))
        }
        console.log('🔄 Datos sincronizados con sessionStorage')
      } catch (sessionError) {
        console.log('⚠️ No se pudo sincronizar con sessionStorage:', sessionError)
      }

    } catch (error) {
      console.error('Error loading from localStorage:', error)
      setTotalPoints(0)
      setProfile({
        id: 'ecohack_user_default',
        user_id: 'ecohack_user_default',
        full_name: 'Usuario EcoHack',
        points: 0,
        created_at: new Date().toISOString()
      })
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

  // Listener para sincronización cross-tab y cross-device
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key?.includes('profileData_') || event.key?.includes('totalPoints_')) {
        console.log('🔄 Detectado cambio en localStorage, sincronizando...', event.key)
        setTimeout(() => {
          refreshProfile()
        }, 500) // Delay para evitar conflictos de escritura
      }
    }

    // Listener para cambios en localStorage desde otras pestañas
    window.addEventListener('storage', handleStorageChange)

    // Listener personalizado para cambios en la misma pestaña
    const handleCustomStorageEvent = (event: CustomEvent) => {
      console.log('🔄 Evento personalizado de storage detectado:', event.detail)
      setTimeout(() => {
        refreshProfile()
      }, 500)
    }

    window.addEventListener('localStorageUpdate', handleCustomStorageEvent as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorageUpdate', handleCustomStorageEvent as EventListener)
    }
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