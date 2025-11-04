// Service Worker para EcoHack PWA
const CACHE_NAME = 'ecohack-v1.0.0'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/ecohack.png',
  '/eco-tips',
  '/juegos',
  '/mapa',
  '/comunidad',
  '/perfil'
]

// Instalar el service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto')
        return cache.addAll(urlsToCache.map(url => new Request(url, {credentials: 'same-origin'})))
      })
      .catch(err => {
        console.log('Error en cache:', err)
      })
  )
})

// Fetch de archivos
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - devolver respuesta
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})

// Activar el service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})