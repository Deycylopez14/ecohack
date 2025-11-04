import React from 'react'
import { supabase } from '../lib/supabase'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import { getProfile } from '../lib/gamification'

interface UserProfile {
  id: string
  user_id: string
  full_name: string | null
  points: number
  created_at: string
}

export default function Perfil() {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(true)
  const [userEmail, setUserEmail] = React.useState<string | null>(null)
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [activeTab, setActiveTab] = React.useState<'info' | 'logros' | 'actividad'>('info')
  const [isEditing, setIsEditing] = React.useState(false)
  const [profilePicture, setProfilePicture] = React.useState<string | null>(null)
  const [uploadingPicture, setUploadingPicture] = React.useState(false)
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
        setLoading(false)
        return
      }
      setUserEmail(u.email ?? null)
      
      // Cargar perfil con puntos
      const userProfile = await getProfile()
      if (userProfile) {
        setProfile(userProfile)
        setEditData({
          fullName: userProfile.full_name || '',
          bio: 'Comprometido con el medio ambiente 🌱',
          location: 'Ciudad de México',
          interests: 'Reciclaje, Compostaje, Energía Solar'
        })
        
        // Cargar foto de perfil desde localStorage
        const storageKey = `profilePicture_${userProfile.user_id}`
        const savedPicture = localStorage.getItem(storageKey)
        console.log('Loading profile picture on init:', {
          userId: userProfile.user_id,
          storageKey,
          hasSavedPicture: !!savedPicture,
          savedPictureLength: savedPicture?.length || 0
        })
        if (savedPicture) {
          setProfilePicture(savedPicture)
          console.log('Profile picture loaded from localStorage')
        } else {
          console.log('No saved profile picture found')
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const onLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handleSave = async () => {
    if (!profile) return
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: editData.fullName })
        .eq('user_id', profile.user_id)
      
      if (!error) {
        setProfile({ ...profile, full_name: editData.fullName })
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('=== INICIO handlePictureChange ===')
    const file = event.target.files?.[0]
    console.log('Archivo seleccionado:', {
      hasFile: !!file,
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
      hasProfile: !!profile,
      targetId: event.target.id,
      profileUserId: profile?.user_id
    })
    
    if (!file) {
      console.log('❌ No hay archivo seleccionado')
      return
    }

    if (!profile) {
      console.log('❌ No hay perfil cargado')
      return
    }

    console.log('✅ Archivo válido seleccionado:', file.name, file.type, file.size)

    // Validar que sea un archivo de imagen (más permisivo)
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml', 'image/tiff', 'image/ico']
    const isValidImage = validImageTypes.includes(file.type.toLowerCase()) || file.type.startsWith('image/')
    
    if (!isValidImage) {
      console.log('❌ Tipo de archivo no válido:', file.type)
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF, WebP, BMP, SVG, TIFF, ICO, etc.)')
      return
    }

    // Validar tamaño (máximo 10MB para ser más permisivo)
    if (file.size > 10 * 1024 * 1024) {
      console.log('❌ Archivo muy grande:', file.size)
      alert('La imagen es muy grande. Por favor selecciona una imagen menor a 10MB')
      return
    }

    console.log('✅ Archivo pasa todas las validaciones')
    setUploadingPicture(true)
    console.log('📤 Iniciando proceso de carga...')
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      console.log('✅ FileReader completado:', {
        resultLength: result?.length || 0,
        resultPreview: result?.substring(0, 50) + '...',
        userId: profile.user_id
      })
      
      // Actualizar estado inmediatamente
      console.log('🔄 Actualizando estado profilePicture...')
      setProfilePicture(result)
      
      // Guardar en localStorage
      const storageKey = `profilePicture_${profile.user_id}`
      localStorage.setItem(storageKey, result)
      console.log('💾 Guardado en localStorage:', storageKey)
      
      // Verificar que se guardó correctamente
      const verification = localStorage.getItem(storageKey)
      console.log('✅ Verificación localStorage:', !!verification)
      
      setUploadingPicture(false)
      console.log('🎉 Proceso completado exitosamente!')
      
      // Forzar re-render después de un momento
      setTimeout(() => {
        console.log('🔍 Estado actual profilePicture:', !!profilePicture)
        console.log('🔍 LocalStorage actual:', !!localStorage.getItem(storageKey))
      }, 100)
    }
    
    reader.onerror = (error) => {
      console.error('❌ Error en FileReader:', error)
      alert('Error al cargar la imagen')
      setUploadingPicture(false)
    }
    
    console.log('📖 Iniciando FileReader.readAsDataURL...')
    reader.readAsDataURL(file)
    
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    event.target.value = ''
    console.log('=== FIN handlePictureChange ===')
  }

  const removePicture = () => {
    if (!profile) return
    setProfilePicture(null)
    localStorage.removeItem(`profilePicture_${profile.user_id}`)
  }

  const getUserLevel = (points: number) => {
    if (points >= 10000) return { level: 'Eco-Master', color: '#047857', icon: '🏆' }
    if (points >= 5000) return { level: 'Eco-Warrior', color: '#059669', icon: '⚔️' }
    if (points >= 1000) return { level: 'Eco-Explorer', color: '#10b981', icon: '🌟' }
    return { level: 'Eco-Novato', color: '#34d399', icon: '🌱' }
  }

  const activities = [
    { type: 'quiz', text: 'Completó el quiz educativo', points: 30, time: '2 horas' },
    { type: 'game', text: 'Jugó Clasificador de Basura', points: 80, time: '3 horas' },
    { type: 'challenge', text: 'Completó reto "Primer Reciclaje"', points: 50, time: '1 día' },
    { type: 'post', text: 'Publicó en la comunidad', points: 10, time: '2 días' }
  ]

  const achievements = [
    { name: 'Primer Paso', description: 'Primer login en EcoHack', icon: '🎯', unlocked: true },
    { name: 'Quiz Master', description: 'Completar 5 quizzes', icon: '📚', unlocked: true },
    { name: 'Gamer Verde', description: 'Jugar todos los mini-juegos', icon: '🎮', unlocked: true },
    { name: 'Reciclador Pro', description: 'Acumular 10,000 puntos', icon: '♻️', unlocked: (profile?.points ?? 0) >= 10000 },
    { name: 'Comunidad Activa', description: 'Crear 10 posts', icon: '👥', unlocked: false },
    { name: 'Eco-Legend', description: 'Completar todos los retos', icon: '🏆', unlocked: false }
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

  const userLevel = getUserLevel(profile?.points || 0)

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
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg" style={{ background: 'var(--color-surface)' }}>
                {(() => {
                  console.log('🖼️ Renderizando avatar:', {
                    hasProfilePicture: !!profilePicture,
                    profilePictureLength: profilePicture?.length || 0,
                    profilePicturePreview: profilePicture?.substring(0, 30) + '...' || 'none'
                  })
                  return null
                })()}
                {profilePicture ? (
                  <img 
                    key={profilePicture.slice(-20)} // Usar los últimos 20 caracteres como key para forzar re-render
                    src={profilePicture} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover"
                    onLoad={() => console.log('✅ Profile picture image loaded successfully')}
                    onError={(e) => {
                      console.error('❌ Error loading profile picture:', e)
                      setProfilePicture(null)
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-4xl text-white font-bold">
                    {(profile?.full_name || userEmail || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Botón para cambiar foto directamente */}
              <div className="absolute bottom-0 right-0">
                <div className="relative group">
                  <label 
                    htmlFor="profile-picture-direct"
                    className="w-10 h-10 bg-gray-600 hover:bg-gray-700 rounded-full border-3 border-white flex items-center justify-center cursor-pointer transition-colors shadow-lg"
                    title="Haz clic para cambiar tu foto de perfil"
                  >
                    {uploadingPicture ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg 
                        width="16" 
                        height="16" 
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
                    )}
                  </label>
                  
                  {/* Tooltip hover */}
                  <div className="absolute bottom-12 right-0 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    📷 Cambiar foto
                  </div>
                  
                  {/* Input para cambio directo */}
                  <input
                    id="profile-picture-direct"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePictureChange}
                    className="hidden"
                  />
                </div>
              </div>
              
              {/* Indicador online */}
              <div className="absolute bottom-2 right-12 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
              
              {/* Botón pequeño para quitar foto (solo visible si hay foto) */}
              {profilePicture && (
                <button
                  onClick={removePicture}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full border-2 border-white flex items-center justify-center transition-colors shadow-md"
                  title="Quitar foto de perfil"
                >
                  <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>

            {/* Información del usuario */}
            <div className="flex-1 mt-4 sm:mt-0 sm:mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{profile?.full_name || 'Usuario EcoHack'}</h1>
                  <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">{userEmail}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg">{userLevel.icon}</span>
                    <span className="font-semibold" style={{ color: userLevel.color }}>{userLevel.level}</span>
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>• {profile?.points || 0} puntos</span>
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
                  <div className="text-2xl font-bold text-green-600">{profile?.points || 0}</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Puntos Totales</div>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ background: 'var(--color-surface)' }}>
                  <div className="text-2xl font-bold text-blue-600">500</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Botellas Recicladas</div>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ background: 'var(--color-surface)' }}>
                  <div className="text-2xl font-bold text-purple-600">90</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Días Activos</div>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ background: 'var(--color-surface)' }}>
                  <div className="text-2xl font-bold text-orange-600">15</div>
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
                {/* Modal solo para información del perfil - foto se cambia desde el avatar principal */}
                <div>
                  <label className="block text-sm font-medium mb-1">Foto de perfil</label>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4" style={{ borderColor: 'var(--color-border)' }}>
                      {profilePicture ? (
                        <img src={profilePicture} alt="Vista previa" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-2xl text-white font-bold">
                          {(profile?.full_name || userEmail || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-center">
                    <label 
                      htmlFor="modal-picture-input"
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg cursor-pointer transition-colors border flex items-center gap-2"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      <span>Cambiar foto</span>
                    </label>
                    <input
                      id="modal-picture-input"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePictureChange}
                      className="hidden"
                    />
                    {profilePicture && (
                      <button
                        onClick={removePicture}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                      >
                        🗑️ Quitar foto
                      </button>
                    )}
                  </div>
                </div>
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
      </div>
    </div>
  )
}
