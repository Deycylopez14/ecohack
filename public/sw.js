// Service Worker para EcoHack PWA
const CACHE_NAME = 'ecohack-v1.1.0'
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/ecohack.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Rutas principales
  '/eco-tips',
  '/juegos',
  '/mapa',
  '/comunidad',
  '/perfil',
  '/educacion',
  '/gamificacion'
]

// Instalar el service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto')
        // Cachear recursos básicos
        return cache.addAll(urlsToCache.map(url => new Request(url, {
          credentials: 'same-origin',
          mode: 'cors'
        })).filter(request => {
          // Filtrar requests inválidos
          try {
            new URL(request.url)
            return true
          } catch (e) {
            return false
          }
        }))
      })
      .catch(err => {
        console.log('Error en cache:', err)
      })
  )
  
  // Activar inmediatamente sin esperar
  self.skipWaiting()
})

// Fetch de archivos con estrategia cache-first para assets y network-first para APIs
self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url)
  
  // Solo manejar requests del mismo origen
  if (requestURL.origin !== location.origin) {
    return
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en cache, devolverlo
        if (response) {
          return response
        }
        
        // Si no, hacer fetch y cachear si es exitoso
        return fetch(event.request).then(response => {
          // Verificar si la respuesta es válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }
          
          // Clonar la respuesta para poder usarla
          const responseToCache = response.clone()
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache)
            })
          
          return response
        }).catch(() => {
          // Si falla el fetch y no hay cache, mostrar página de error básica
          if (event.request.mode === 'navigate') {
            return caches.match('/')
          }
        })
      })
  )
})

// Activar el service worker y limpiar caches antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  
  // Tomar control de todas las páginas inmediatamente
  self.clients.claim()
})

// Escuchar mensajes del cliente principal
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})