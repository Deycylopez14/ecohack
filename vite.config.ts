import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'EcoHack - Aplicación Ecológica',
        short_name: 'EcoHack',
        description: 'Aplicación para promover el reciclaje y conciencia ecológica con juegos, mapas y comunidad',
        theme_color: '#047857',
        background_color: '#f3f4f6',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'any',
        categories: ['education', 'lifestyle', 'games', 'utilities'],
        lang: 'es-ES',
        prefer_related_applications: false,
        id: 'ecohack-app',
        icons: [
          {
            src: '/icons/ecohack.png',
            sizes: 'any',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512x512.png', 
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Mini-Juegos',
            short_name: 'Juegos',
            description: 'Acceso directo a los mini-juegos',
            url: '/juegos',
            icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Mapa Ecológico', 
            short_name: 'Mapa',
            description: 'Ver puntos de reciclaje cercanos',
            url: '/mapa',
            icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webp}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
        runtimeCaching: [
          // Cache para APIs externas
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300 // 5 minutos
              }
            }
          },
          // Cache para APIs de mapas
          {
            urlPattern: /^https:\/\/.*\.(openstreetmap|mapbox)\..*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'maps-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 86400 // 24 horas
              }
            }
          },
          // Cache para imágenes
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 604800 // 7 días
              }
            }
          },
          // Cache para fuentes de Google
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 31536000 // 1 año
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          leaflet: ['react-leaflet', 'leaflet'],
          icons: ['react-icons']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false // Disable en producción para reducir tamaño
  },
  server: {
    port: 3000,
    host: true
    // https: true // Descomenta para HTTPS automático
  },
  preview: {
    port: 3000,
    host: true
    // https: true // Descomenta para HTTPS automático
  }
})
