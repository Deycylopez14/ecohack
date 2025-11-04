import React from 'react'
import { supabase } from '../lib/supabase'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import { useGamification } from '../contexts/GamificationContext'

// Componente Toast simple para mostrar notificaciones
const Toast: React.FC<{
  message: string
  type: 'success' | 'error'
  onClose: () => void
}> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 z-50 max-w-sm ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      } ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{type === 'success' ? '✅' : '❌'}</span>
        <span className="font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-auto text-white hover:text-gray-200 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default function Perfil() {
  const navigate = useNavigate()
  const { profile, totalPoints, loading, refreshProfile } = useGamification()
  const [userEmail, setUserEmail] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<'info' | 'logros' | 'actividad'>('info')
  const [isEditing, setIsEditing] = React.useState(false)
  const [profilePicture, setProfilePicture] = React.useState<string | null>(null)
  const [uploadingPicture, setUploadingPicture] = React.useState(false)
  const [toast, setToast] = React.useState<{message: string, type: 'success' | 'error'} | null>(null)
  const [showPhotoMenu, setShowPhotoMenu] = React.useState(false)
  const [editData, setEditData] = React.useState({
    fullName: '',
    bio: '',
    location: '',
    interests: ''
  })

  React.useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser()
      const u = data.user
      if (!u) {
        return
      }
      setUserEmail(u.email ?? null)
      
      // Usar userId consistente (profile.user_id o email como fallback)
      const userId = profile?.user_id || u.email || 'default'
      
      // Cargar datos del perfil desde localStorage primero
      const localProfileKey = `profileData_${userId}`
      const savedProfileData = localStorage.getItem(localProfileKey)
      
      if (savedProfileData) {
        try {
          const localData = JSON.parse(savedProfileData)
          console.log('📋 Cargando datos de perfil desde localStorage:', localData)
          setEditData({
            fullName: localData.fullName || '',
            bio: localData.bio || 'Comprometido con el medio ambiente 🌱',
            location: localData.location || 'Ciudad de México',
            interests: localData.interests || 'Reciclaje, Compostaje, Energía Solar'
          })
        } catch (error) {
          console.log('Error parsing local profile data:', error)
        }
      }
      
      // Si hay profile de Supabase, usar esos datos (tiene prioridad)
      if (profile) {
        setEditData(prev => ({
          ...prev,
          fullName: profile.full_name || prev.fullName
        }))
      }
      
      // Si no hay datos locales ni de Supabase, usar valores por defecto
      if (!savedProfileData && !profile) {
        setEditData({
          fullName: '',
          bio: 'Comprometido con el medio ambiente 🌱',
          location: 'Ciudad de México',
          interests: 'Reciclaje, Compostaje, Energía Solar'
        })
      }
      
      // Cargar foto de perfil desde localStorage (funciona con o sin profile)
      const storageKey = `profilePicture_${userId}`
      const savedPicture = localStorage.getItem(storageKey)
      if (savedPicture) {
        console.log('📷 Cargando foto desde localStorage para:', userId)
        setProfilePicture(savedPicture)
      } else {
        console.log('📷 No se encontró foto guardada para:', userId)
      }
    }
    load()
  }, [profile])

  // Cargar foto inmediatamente sin esperar conexiones
  React.useEffect(() => {
    const loadProfilePicture = async () => {
      // Intentar múltiples fuentes para el userId
      let userId = 'ecohack_user'
      
      // 1. Primero intentar con profile
      if (profile?.user_id) {
        userId = profile.user_id
      } 
      // 2. Luego con userEmail del estado
      else if (userEmail) {
        userId = userEmail
      }
      // 3. Finalmente intentar obtener directamente de Supabase
      else {
        try {
          const { data } = await supabase.auth.getUser()
          if (data.user?.email) {
            userId = data.user.email
            setUserEmail(data.user.email) // Actualizar el estado también
          } else if (data.user?.id) {
            userId = data.user.id
          }
        } catch (error) {
          console.log('Usando userId por defecto debido a error:', error)
        }
      }

      // Intentar cargar desde múltiples keys por si acaso
      const possibleKeys = [
        `profilePicture_${userId}`,
        `profilePicture_${userEmail}`,
        `profilePicture_${profile?.user_id}`,
        'profilePicture_ecohack_user'
      ].filter(Boolean)

      for (const storageKey of possibleKeys) {
        const savedPicture = localStorage.getItem(storageKey)
        if (savedPicture) {
          console.log('📷 Foto encontrada con key:', storageKey)
          setProfilePicture(savedPicture)
          return
        }
      }
      
      console.log('📷 No se encontró foto guardada para ninguna key')
    }

    loadProfilePicture()
  }, []) // Sin dependencias - se ejecuta inmediatamente

  // Cerrar menú de foto con Escape
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowPhotoMenu(false)
      }
    }

    if (showPhotoMenu) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showPhotoMenu])

  const onLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handleSave = async () => {
    console.log('💾 Guardando perfil...', editData)
    
    try {
      // Intentar guardar en Supabase si está disponible
      if (profile?.user_id) {
        console.log('🔄 Intentando guardar en Supabase...')
        const { error } = await supabase
          .from('profiles')
          .update({ full_name: editData.fullName })
          .eq('user_id', profile.user_id)
        
        if (error) {
          console.log('⚠️ Error de Supabase, guardando localmente:', error.message)
        } else {
          console.log('✅ Guardado en Supabase exitoso')
          // Refrescar el perfil para obtener los datos actualizados
          await refreshProfile()
        }
      } else {
        console.log('📝 Profile no disponible, guardando solo localmente')
      }

      // SIEMPRE guardar localmente como respaldo
      const userId = profile?.user_id || userEmail || 'ecohack_user'
      const localProfileData = {
        fullName: editData.fullName,
        bio: editData.bio,
        location: editData.location,
        interests: editData.interests,
        lastUpdated: new Date().toISOString()
      }
      
      localStorage.setItem(`profileData_${userId}`, JSON.stringify(localProfileData))
      console.log('💾 Datos guardados localmente para:', userId)
      
      // Cerrar modal y mostrar notificación de éxito
      setIsEditing(false)
      setToast({ 
        message: '✅ Perfil actualizado correctamente', 
        type: 'success' 
      })

    } catch (error) {
      console.error('❌ Error al guardar perfil:', error)
      setToast({ 
        message: 'Error al guardar el perfil. Inténtalo de nuevo.', 
        type: 'error' 
      })
    }
  }

  // Función auxiliar para abrir selector de archivos
  const openFileSelector = () => {
    console.log('📁 Intentando abrir selector de archivos...')
    const input = document.getElementById('profile-picture-input') as HTMLInputElement
    if (input) {
      console.log('✅ Input encontrado, activando...')
      input.click()
    } else {
      console.log('❌ Input no encontrado')
      // Crear input dinámicamente como fallback
      const dynamicInput = document.createElement('input')
      dynamicInput.type = 'file'
      dynamicInput.accept = 'image/*'
      dynamicInput.onchange = (e) => handlePictureChange(e as any)
      dynamicInput.click()
      console.log('🔄 Usando input dinámico como fallback')
    }
  }

  const handlePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🎯 === INICIO handlePictureChange ===')
    console.log('🎯 Event target:', event.target)
    console.log('🎯 Files:', event.target.files)
    
    const file = event.target.files?.[0]
    
    if (!file) {
      console.log('❌ No hay archivo seleccionado')
      return
    }

    console.log('📷 Archivo seleccionado:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      hasProfile: !!profile,
      hasUserEmail: !!userEmail
    })

    // Usar múltiples fallbacks para el userId
    let userId = 'ecohack_user'
    if (profile?.user_id) {
      userId = profile.user_id
    } else if (userEmail) {
      userId = userEmail
    } else {
      // Intentar obtener del auth de Supabase
      try {
        const { data } = await supabase.auth.getUser()
        if (data.user?.email) {
          userId = data.user.email
        } else if (data.user?.id) {
          userId = data.user.id
        }
      } catch (error) {
        console.log('No se pudo obtener usuario de Supabase, usando fallback')
      }
    }

    console.log('✅ Usuario identificado:', userId)
    console.log('✅ Archivo válido seleccionado:', file.name, file.type, file.size)

    // Validar que sea un archivo de imagen
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml']
    const isValidImage = validImageTypes.includes(file.type.toLowerCase()) || file.type.startsWith('image/')
    
    if (!isValidImage) {
      console.log('❌ Tipo de archivo no válido:', file.type)
      setToast({ message: 'Por favor selecciona un archivo de imagen válido', type: 'error' })
      return
    }

    // Validar tamaño (máximo 15MB)
    if (file.size > 15 * 1024 * 1024) {
      console.log('❌ Archivo muy grande:', file.size)
      setToast({ message: 'La imagen es muy grande. Máximo 15MB', type: 'error' })
      return
    }

    console.log('✅ Archivo pasa todas las validaciones')
    setUploadingPicture(true)
    console.log('📤 Iniciando proceso de carga...')
    
    try {
      // Redimensionar imagen si es muy grande
      let processedFile = file
      if (file.size > 2 * 1024 * 1024) { // Si es mayor a 2MB
        console.log('🔄 Redimensionando imagen...')
        processedFile = await resizeImageFile(file, 800, 800, 0.8)
        console.log('✅ Imagen redimensionada:', processedFile.size)
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        console.log('✅ FileReader completado:', {
          resultLength: result?.length || 0,
          resultPreview: result?.substring(0, 50) + '...',
          userId: userId
        })
        
        // Actualizar estado inmediatamente
        console.log('🔄 Actualizando estado profilePicture...')
        setProfilePicture(result)
        
        // Guardar en localStorage con clave única (usar userId en lugar de profile.user_id)
        const storageKey = `profilePicture_${userId}`
        try {
          localStorage.setItem(storageKey, result)
          console.log('💾 Guardado en localStorage:', storageKey)
          
          // Verificar que se guardó correctamente
          const verification = localStorage.getItem(storageKey)
          console.log('✅ Verificación localStorage:', !!verification && verification.length > 0)
          
          // Mostrar notificación de éxito
          setToast({ message: 'Foto de perfil actualizada correctamente', type: 'success' })
          
        } catch (storageError) {
          console.error('❌ Error guardando en localStorage:', storageError)
          setToast({ message: 'Error al guardar la imagen. La imagen puede ser muy grande.', type: 'error' })
        }
        
        setUploadingPicture(false)
        console.log('🎉 Proceso completado exitosamente!')
      }
      
      reader.onerror = (error) => {
        console.error('❌ Error en FileReader:', error)
        setToast({ message: 'Error al procesar la imagen', type: 'error' })
        setUploadingPicture(false)
      }
      
      console.log('📖 Iniciando FileReader.readAsDataURL...')
      reader.readAsDataURL(processedFile)
      
    } catch (error) {
      console.error('❌ Error procesando imagen:', error)
      setToast({ message: 'Error al procesar la imagen', type: 'error' })
      setUploadingPicture(false)
    }
    
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    event.target.value = ''
    console.log('=== FIN handlePictureChange ===')
  }

  // Función auxiliar para redimensionar imágenes
  const resizeImageFile = (file: File, maxWidth: number, maxHeight: number, quality: number): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
        let { width, height } = img
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Dibujar imagen redimensionada con suavizado
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convertir a blob y luego a File
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(resizedFile)
          } else {
            resolve(file) // Fallback al archivo original
          }
        }, file.type, quality)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const removePicture = async () => {
    // Usar el mismo sistema robusto para obtener userId
    let userId = 'ecohack_user'
    if (profile?.user_id) {
      userId = profile.user_id
    } else if (userEmail) {
      userId = userEmail
    } else {
      try {
        const { data } = await supabase.auth.getUser()
        if (data.user?.email) {
          userId = data.user.email
        } else if (data.user?.id) {
          userId = data.user.id
        }
      } catch (error) {
        console.log('Usando userId por defecto para remover')
      }
    }

    setProfilePicture(null)
    
    // Remover de múltiples keys posibles
    const possibleKeys = [
      `profilePicture_${userId}`,
      `profilePicture_${userEmail}`,
      `profilePicture_${profile?.user_id}`,
      'profilePicture_ecohack_user'
    ].filter(Boolean)

    possibleKeys.forEach(key => {
      localStorage.removeItem(key)
    })
    
    console.log('🗑️ Foto removida para usuario:', userId)
  }

  const getUserLevel = (points: number) => {
    if (points >= 10000) return { level: 'Eco-Master', color: '#047857', icon: '🏆' }
    if (points >= 5000) return { level: 'Eco-Warrior', color: '#059669', icon: '⚔️' }
    if (points >= 1000) return { level: 'Eco-Explorer', color: '#10b981', icon: '🌟' }
    return { level: 'Eco-Novato', color: '#34d399', icon: '🌱' }
  }

  const userLevel = getUserLevel(totalPoints)

  const activities = [
    { type: 'quiz', text: 'Completó el quiz educativo', points: 30, time: '2 horas' },
    { type: 'game', text: 'Jugó Clasificador de Basura', points: 80, time: '3 horas' },
    { type: 'challenge', text: 'Completó reto "Primer Reciclaje"', points: 50, time: '1 día' },
    { type: 'post', text: 'Publicó en la comunidad', points: 10, time: '2 días' }
  ]

  const achievements = [
    { name: 'Primer Paso', description: 'Primer login en EcoHack', icon: '🎯', unlocked: true },
    { name: 'Quiz Master', description: 'Completar 5 quizzes', icon: '📚', unlocked: totalPoints >= 100 },
    { name: 'Gamer Verde', description: 'Jugar todos los mini-juegos', icon: '🎮', unlocked: totalPoints >= 200 },
    { name: 'Reciclador Pro', description: 'Acumular 1,000 puntos', icon: '♻️', unlocked: totalPoints >= 1000 },
    { name: 'Eco-Warrior', description: 'Acumular 5,000 puntos', icon: '⚔️', unlocked: totalPoints >= 5000 },
    { name: 'Eco-Master', description: 'Acumular 10,000 puntos', icon: '🏆', unlocked: totalPoints >= 10000 }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: 'var(--color-text)' }}>Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <div className="p-4 text-center">
          <p className="mb-4">No has iniciado sesión.</p>
          <Button onClick={() => navigate('/login')}>Iniciar Sesión</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }} role="main">
      {/* Portada estilo Facebook */}
      <div className="relative">
        <div 
          className="h-48 w-full bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)' }}
        >
          {/* Patrón decorativo */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 text-4xl">🌱</div>
            <div className="absolute top-8 right-8 text-3xl">♻️</div>
            <div className="absolute bottom-6 left-12 text-2xl">🌍</div>
            <div className="absolute bottom-4 right-4 text-3xl">🌿</div>
          </div>
          
          {/* Información nivel en portada */}
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 text-white">
              <span className="text-lg">{userLevel.icon}</span>
              <span className="font-bold">{userLevel.level}</span>
            </div>
          </div>
        </div>

        {/* Avatar y información principal */}
        <div className="relative px-4 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 -mt-16">
            {/* Avatar con menú estilo Facebook */}
            <div className="relative">
              {/* Input para cambiar foto - FUERA del menú para que siempre esté disponible */}
              <input
                id="profile-picture-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePictureChange}
                style={{ display: 'none' }}
              />

              {/* Foto de perfil clickeable */}
              <div 
                className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg cursor-pointer group relative"
                style={{ background: 'var(--color-surface)' }}
                onClick={() => setShowPhotoMenu(!showPhotoMenu)}
              >
                {profilePicture ? (
                  <img 
                    key={profilePicture.slice(-20)}
                    src={profilePicture} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                    onError={(e) => {
                      console.error('❌ Error loading profile picture:', e)
                      setProfilePicture(null)
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-4xl text-white font-bold group-hover:brightness-90 transition-all">
                    {(profile?.full_name || userEmail || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                
                {/* Overlay al hacer hover */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              </div>

              {/* Menú contextual estilo Facebook */}
              {showPhotoMenu && (
                <>
                  {/* Overlay para cerrar el menú */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowPhotoMenu(false)}
                  />
                  
                  {/* Menú de opciones */}
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border z-50 overflow-hidden"
                       style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                    
                    {/* Ver foto (solo si hay foto) */}
                    {profilePicture && (
                      <button
                        onClick={() => {
                          setShowPhotoMenu(false)
                          // Abrir foto en modal o nueva pestaña
                          const link = document.createElement('a')
                          link.href = profilePicture
                          link.download = 'mi-foto-perfil.jpg'
                          link.target = '_blank'
                          link.click()
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        <span>Ver foto de perfil</span>
                      </button>
                    )}
                    
                    {/* Cambiar foto */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log('🖱️ Click en cambiar foto de perfil')
                        setShowPhotoMenu(false)
                        openFileSelector()
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 cursor-pointer transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      <span>Cambiar foto de perfil</span>
                    </button>
                    
                    {/* Eliminar foto (solo si hay foto) */}
                    {profilePicture && (
                      <button
                        onClick={async () => {
                          setShowPhotoMenu(false)
                          await removePicture()
                          setToast({ message: 'Foto de perfil eliminada', type: 'success' })
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                        <span>Eliminar foto de perfil</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Información del usuario */}
            <div className="flex-1 mt-4 sm:mt-0 sm:mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">
                    {profile?.full_name || editData.fullName || 'Usuario EcoHack'}
                  </h1>
                  <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">{userEmail}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg">{userLevel.icon}</span>
                    <span className="font-semibold" style={{ color: userLevel.color }}>{userLevel.level}</span>
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>• {totalPoints} puntos</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 sm:mt-0">
                  <Button size="sm" onClick={() => setIsEditing(true)}>✏️ Editar</Button>
                  <Button size="sm" variant="outline" onClick={onLogout}>Cerrar sesión</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación por tabs */}
        <div className="border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex px-4">
            {[
              { key: 'info', label: 'Información', icon: '👤' },
              { key: 'logros', label: 'Logros', icon: '🏆' },
              { key: 'actividad', label: 'Actividad', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.key 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={{ 
                  color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  borderBottomColor: activeTab === tab.key ? 'var(--color-primary)' : 'transparent'
                }}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de tabs */}
        <div className="p-4">
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Estadísticas principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg text-center" style={{ background: 'var(--color-surface)' }}>
                  <div className="text-2xl font-bold text-green-600">{totalPoints}</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Puntos Totales</div>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ background: 'var(--color-surface)' }}>
                  <div className="text-2xl font-bold text-blue-600">{Math.floor(totalPoints / 10)}</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Items Reciclados</div>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ background: 'var(--color-surface)' }}>
                  <div className="text-2xl font-bold text-purple-600">{Math.floor(totalPoints / 20)}</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Partidas Jugadas</div>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ background: 'var(--color-surface)' }}>
                  <div className="text-2xl font-bold text-orange-600">{Math.floor(totalPoints / 50)}</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Retos Completados</div>
                </div>
              </div>

              {/* Información personal */}
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-surface)' }}>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span>ℹ️</span> Información Personal
                </h3>
                <div className="space-y-2">
                  <p><span className="font-semibold">Bio:</span> {editData.bio}</p>
                  <p><span className="font-semibold">📍 Ubicación:</span> {editData.location}</p>
                  <p><span className="font-semibold">🌱 Intereses:</span> {editData.interests}</p>
                  <p><span className="font-semibold">📅 Miembro desde:</span> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Reciente'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logros' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg mb-4">🏆 Logros Desbloqueados</h3>
              <div className="grid gap-3">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.unlocked 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 bg-gray-50 opacity-50'
                    }`}
                    style={{ 
                      background: achievement.unlocked ? 'rgba(34, 197, 94, 0.1)' : 'var(--color-surface)',
                      borderColor: achievement.unlocked ? 'var(--color-primary)' : 'var(--color-border)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4 className="font-bold">{achievement.name}</h4>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <span className="ml-auto text-green-600 text-xl">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'actividad' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg mb-4">📊 Actividad Reciente</h3>
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div key={index} className="p-4 rounded-lg border-l-4 border-green-500" style={{ background: 'var(--color-surface)' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{activity.text}</p>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          +{activity.points} puntos • hace {activity.time}
                        </p>
                      </div>
                      <span className="text-lg">
                        {activity.type === 'quiz' && '📚'}
                        {activity.type === 'game' && '🎮'}
                        {activity.type === 'challenge' && '🎯'}
                        {activity.type === 'post' && '💬'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      {/* Modal de edición */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] flex flex-col" 
            style={{ background: 'var(--color-surface)' }}
          >
            {/* Header fijo del modal */}
            <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-bold text-lg">✏️ Editar Perfil</h3>
            </div>
            
            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Información básica del perfil */}
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre completo</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg text-sm"
                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    value={editData.fullName}
                    onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    className="w-full p-2 border rounded-lg h-20"
                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    placeholder="Describe tu compromiso con el medio ambiente..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ubicación</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    value={editData.location}
                    onChange={(e) => setEditData({...editData, location: e.target.value})}
                  >
                    <option value="">Selecciona tu ciudad...</option>
                    <option value="Ciudad de México, México">🇲🇽 Ciudad de México, México</option>
                    <option value="Guadalajara, México">🇲🇽 Guadalajara, México</option>
                    <option value="Monterrey, México">🇲🇽 Monterrey, México</option>
                    <option value="Puebla, México">🇲🇽 Puebla, México</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Intereses ecológicos</label>
                  <input
                    type="text"
                    placeholder="Reciclaje, Compostaje, Energía Solar..."
                    className="w-full p-2 border rounded-lg text-sm"
                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    value={editData.interests}
                    onChange={(e) => setEditData({...editData, interests: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            {/* Footer fijo con botones */}
            <div className="p-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  💾 Guardar
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                  ❌ Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast de notificaciones */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      </div>
    </div>
  )
}
