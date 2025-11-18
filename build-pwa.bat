@echo off
echo 🚀 Construyendo EcoHack PWA para producción...

REM Limpiar dist anterior
if exist dist rmdir /s /q dist

REM Construir para producción
echo 📦 Ejecutando build de Vite...
npm run build

if errorlevel 1 (
    echo ❌ Error en el build. Revisa los errores arriba.
    pause
    exit /b 1
)

echo ✅ Build completado exitosamente!

REM Verificar que archivos PWA estén presentes
echo 🔍 Verificando archivos PWA...

if not exist "dist\manifest.json" (
    echo ❌ Falta manifest.json
    exit /b 1
)

if not exist "dist\sw.js" (
    echo ❌ Falta service worker
    exit /b 1
)

echo ✅ Archivos PWA verificados!

echo.
echo 📋 Instrucciones de deployment:
echo.
echo 1. Sube el contenido de la carpeta 'dist' a tu servidor web
echo 2. Asegúrate de que el servidor sea HTTPS (requerido para PWA)
echo 3. Configura el servidor para servir archivos con headers correctos:
echo    - manifest.json: Content-Type: application/manifest+json
echo    - sw.js: Content-Type: application/javascript
echo.
echo 4. Opcional - Configura headers de cache:
echo    - Archivos estáticos: Cache-Control: max-age=31536000
echo    - HTML/SW: Cache-Control: no-cache
echo.
echo 💡 Para probar localmente:
echo    npx serve dist --single --listen 3000
echo.
pause