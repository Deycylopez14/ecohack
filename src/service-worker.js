const CACHE_NAME = 'ecohack-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/pages/Educacion.jsx',
  '/src/pages/Minijuegos.jsx',
  '/src/components/EducacionContent.jsx',
  '/src/components/QuizClasificacion.jsx',
  '/src/components/SimuladorImpacto.jsx',
  '/src/styles/global.css',
  // Agrega aquí otros recursos clave
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match('/index.html'));
    })
  );
});
