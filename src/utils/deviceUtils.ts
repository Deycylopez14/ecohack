/**
 * Utilidades para detectar y manejar diferentes tipos de dispositivos
 * Garantiza funcionalidad consistente cross-device
 */

interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isIOS: boolean
  isAndroid: boolean
  isSafari: boolean
  touchSupport: boolean
  screenSize: 'small' | 'medium' | 'large'
}

/**
 * Detecta el tipo de dispositivo y características
 */
export function getDeviceInfo(): DeviceInfo {
  const userAgent = navigator.userAgent
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)|Android(?=.*(?:\bTablet\b|\bTab\b))/i.test(userAgent)
  const isIOS = /iPad|iPhone|iPod/.test(userAgent)
  const isAndroid = /Android/i.test(userAgent)
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent)
  
  const screenWidth = window.innerWidth
  let screenSize: 'small' | 'medium' | 'large' = 'medium'
  
  if (screenWidth < 768) {
    screenSize = 'small'
  } else if (screenWidth < 1024) {
    screenSize = 'medium'
  } else {
    screenSize = 'large'
  }
  
  return {
    isMobile: isMobile && !isTablet,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    isIOS,
    isAndroid,
    isSafari,
    touchSupport,
    screenSize
  }
}

/**
 * Genera un ID único para el dispositivo basado en características del navegador
 * Útil para sincronización de datos cross-device
 */
export function getDeviceId(): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx!.textBaseline = 'top'
  ctx!.font = '14px Arial'
  ctx!.fillText('Device fingerprint', 2, 2)
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|')
  
  // Generar hash simple del fingerprint
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convertir a 32-bit integer
  }
  
  return `device_${Math.abs(hash).toString(16)}`
}

/**
 * Obtiene el almacenamiento disponible en el dispositivo
 */
export async function getStorageInfo(): Promise<{
  quota: number
  usage: number
  available: number
  percentage: number
}> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      const quota = estimate.quota || 0
      const usage = estimate.usage || 0
      const available = quota - usage
      const percentage = quota > 0 ? (usage / quota) * 100 : 0
      
      return {
        quota,
        usage,
        available,
        percentage
      }
    }
  } catch (error) {
    console.log('No se pudo obtener información de almacenamiento:', error)
  }
  
  return {
    quota: 0,
    usage: 0,
    available: 0,
    percentage: 0
  }
}

/**
 * Optimiza la key de localStorage basada en el dispositivo
 * para evitar conflictos cross-device
 */
export function getOptimizedStorageKey(userId: string, dataType: string): string {
  const deviceInfo = getDeviceInfo()
  const deviceId = getDeviceId()
  
  // Crear key que incluya información del dispositivo para prevenir conflictos
  const baseKey = `${dataType}_${userId}`
  
  // En móviles, agregar identificador de dispositivo para mayor precisión
  if (deviceInfo.isMobile || deviceInfo.isTablet) {
    return `${baseKey}_${deviceId.slice(-8)}`
  }
  
  return baseKey
}

/**
 * Configura optimizaciones específicas para el dispositivo
 */
export function applyDeviceOptimizations(): void {
  const deviceInfo = getDeviceInfo()
  
  // Prevenir zoom en iOS en inputs
  if (deviceInfo.isIOS) {
    const meta = document.querySelector('meta[name="viewport"]')
    if (meta) {
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover')
    }
  }
  
  // Agregar clase CSS para tipo de dispositivo
  document.body.classList.add(
    deviceInfo.isMobile ? 'device-mobile' : 
    deviceInfo.isTablet ? 'device-tablet' : 'device-desktop'
  )
  
  if (deviceInfo.touchSupport) {
    document.body.classList.add('touch-device')
  }
  
  document.body.classList.add(`screen-${deviceInfo.screenSize}`)
}

/**
 * Detecta si el dispositivo está en modo offline
 */
export function isOffline(): boolean {
  return !navigator.onLine
}

/**
 * Listener para cambios en el estado de conexión
 */
export function onConnectivityChange(callback: (isOnline: boolean) => void): () => void {
  const handleOnline = () => callback(true)
  const handleOffline = () => callback(false)
  
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}