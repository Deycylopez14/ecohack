# EcoHack - Aplicación Ecológica Completa

## 📱 Sobre EcoHack

EcoHack es una aplicación web progresiva (PWA) diseñada para promover la conciencia ecológica y el reciclaje responsable. La aplicación incluye:

- **Autenticación completa** (registro, login, recuperación)
- **Mapa interactivo** con puntos de reciclaje georreferenciados
- **Sistema de gamificación** con puntos y retos
- **Mini-juegos educativos** (Clasificador de Basura, Aventura Eco)
- **Módulo educativo** con quiz interactivo
- **Comunidad ecológica** con posts y sistema de likes
- **EcoTips** con consejos de reciclaje filtrados por categoría
- **Perfil de usuario** personalizable
- **Diseño accesible** (WCAG AA/AAA, modo claro/oscuro)

## 🚀 Instalación Rápida

### Prerrequisitos
- Node.js 16+ y npm/yarn
- Cuenta de Supabase (gratuita)

### Pasos de Instalación

1. **Instalar dependencias:**
```bash
cd ecohack
npm install
```

2. **Configurar variables de entorno:**
Crear archivo `.env.local` con:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

3. **Configurar Supabase:**
   - Crear proyecto en [supabase.com](https://supabase.com)
   - Ejecutar script SQL: `docs/supabase.sql`
   - Ejecutar datos de prueba: `docs/seed.sql`
   - Copiar URL y clave anónima al archivo `.env.local`

4. **Ejecutar en desarrollo:**
```bash
npm run dev
```

5. **Construir para producción:**
```bash
npm run build
npm run preview
```

## 🎮 Funcionalidades Principales

### Mini-Juegos Interactivos

#### Clasificador de Basura
- Drag & drop HTML5 nativo
- Timer de 60 segundos
- 10 puntos por clasificación correcta
- 8 tipos de residuos y 4 contenedores

#### Aventura Eco
- Juego de plataformas con Canvas
- Recolección de botellas (5 pts cada una)
- Mecánicas de salto y movimiento
- Controles: ←→ mover, ESPACIO saltar

### Sistema de Gamificación
- 10 retos diferentes con recompensas
- Sistema de puntos persistente
- Integración con todas las actividades
- Estadísticas visuales

### Educación Interactiva
- Quiz con feedback inmediato
- 15 EcoTips categorizados
- Búsqueda y filtros avanzados

### Funcionalidades Sociales
- Comunidad con posts y likes
- Perfiles personalizables
- Mapa colaborativo

## 🎨 Diseño y Accesibilidad

### Características de Accesibilidad
- Contraste mínimo AA/AAA
- Navegación por teclado completa
- ARIA labels en componentes interactivos
- Modo claro por defecto, oscuro manual

### Paleta de Colores
- **Primario:** `#047857` (verde ecológico)
- **Secundario:** `#0e7490` (cyan/azul)
- **Accent:** `#164e63` (azul oscuro)

## 📱 PWA (Progressive Web App)

- Instalable en dispositivos móviles
- Funciona offline (caché de recursos)
- Iconos nativos optimizados
- Service Worker automático

## 📊 Estado del Proyecto

### ✅ Completado (95%)
- Autenticación completa y funcional
- Mapa interactivo con geolocalización
- Sistema de gamificación con persistencia
- Ambos mini-juegos completamente funcionales
- Educación con quiz integrado
- Comunidad con CRUD completo
- EcoTips expandidos (15 consejos)
- UI/UX accesible y responsiva
- PWA optimizada con caché
- 10 retos de gamificación

## 🎯 Uso de la Aplicación

### Flujo Básico del Usuario
1. **Registro/Login** → Crear cuenta o iniciar sesión
2. **Explorar Home** → Ver estadísticas y tarjetas informativas
3. **Jugar Mini-juegos** → Ganar puntos con Clasificador y Aventura Eco
4. **Aprender** → Completar quiz educativo y leer EcoTips
5. **Explorar** → Usar mapa para encontrar puntos de reciclaje
6. **Participar** → Publicar en la comunidad ecológica
7. **Progresar** → Completar retos y acumular puntos

## 🏆 Tecnologías Utilizadas

- **Frontend:** React 18 + TypeScript + Vite
- **Estilos:** Tailwind CSS + Variables CSS
- **Base de datos:** Supabase (PostgreSQL)
- **Mapas:** React-Leaflet + OpenStreetMap
- **PWA:** Vite-PWA + Workbox
- **Juegos:** Canvas API + HTML5 Drag & Drop

EcoHack es una aplicación completa que combina tecnología moderna, gamificación efectiva, educación interactiva y accesibilidad AAA para crear una experiencia móvil nativa que promueve la conciencia ecológica.
