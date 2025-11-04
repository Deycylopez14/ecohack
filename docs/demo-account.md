# Cuenta de prueba para EcoHack

Para probar todas las funcionalidades sin configurar Supabase aún, puedes usar esta cuenta de ejemplo:

## Datos de prueba (modo local)
- **Email**: Usa tu propio email (ej: tu-email@gmail.com)
- **Contraseña**: Cualquiera (ej: 123456)
- **Nombre**: Tu nombre o "Usuario Demo"

**Nota**: No existe una cuenta preconfigurada. Debes registrarte primero.

## Cómo probar cada módulo

### 1. Registro/Login
- Ve a `/register` y crea una cuenta nueva con tu email
- Después ve a `/login` e inicia sesión con esos mismos datos
- Al iniciar sesión, te llevará a `/perfil`

### 2. Perfil
- Verás tu email y nombre
- Puntos iniciales: 0 (se actualizarán al completar actividades)
- Botón "Cerrar sesión" funcional

### 3. Mapa  
- Permite geolocalización para ver tu ubicación
- Muestra 3 puntos de reciclaje de ejemplo en CDMX
- Marcadores interactivos con popups

### 4. Gamificación
- **Sin Supabase**: verás 2 retos locales de fallback
- **Con Supabase**: ejecuta `docs/seed.sql` para ver 5 retos reales
- Botón "Completar" suma puntos a tu perfil
- Los puntos se sincronizan con Home

### 5. Educación
- Quiz de 3 preguntas sobre reciclaje
- 10 puntos por respuesta correcta
- Feedback inmediato al enviar

### 6. EcoTips
- 5 tips cargados desde JSON local
- Buscador funcional
- Filtro por categoría (basicos, papel, plastico, vidrio, organico)

### 7. Comunidad
- **Sin Supabase**: formulario deshabilitado
- **Con Supabase**: crear posts y dar likes
- Al ejecutar `docs/seed.sql` verás 5 posts de ejemplo

## Setup completo (recomendado)

1. **Variables de entorno**:
```bash
Copy-Item .env.example .env
# Editar .env con tus credenciales de Supabase
```

2. **Base de datos**:
```sql
-- En Supabase SQL Editor:
-- 1. Ejecutar docs/supabase.sql (tablas y políticas)
-- 2. Ejecutar docs/seed.sql (datos de ejemplo)
```

3. **Ejecutar**:
```bash
npm run dev
```

## Flujo de prueba sugerido

1. **Regístrate** → verás tu perfil con 0 puntos
2. **Ve al Mapa** → permite geolocalización y explora puntos
3. **Gamificación** → completa 1-2 retos → verás los puntos subir
4. **Educación** → haz el quiz → más puntos
5. **Comunidad** → crea un post, da likes
6. **EcoTips** → busca "plástico" o filtra por categoría
7. **Home** → verifica que los puntos se muestran correctamente

¡Todo debería funcionar sin problemas! 🌱