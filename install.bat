@echo off
echo 🚀 Script de instalación automática de EcoHack
echo =============================================

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm no está instalado. Por favor instala npm.
    pause
    exit /b 1
)

echo ✅ Node.js versión:
node --version
echo ✅ npm versión:
npm --version

REM Verificar si estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ No se encontró package.json. Asegúrate de estar en el directorio del proyecto EcoHack.
    pause
    exit /b 1
)

echo 📦 Instalando dependencias...
npm install

if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias. Intentando con npm ci...
    npm ci
    
    if %errorlevel% neq 0 (
        echo ❌ Error instalando dependencias. Intenta manualmente con 'npm install --force'
        pause
        exit /b 1
    )
)

echo ✅ Dependencias instaladas correctamente

REM Verificar archivos necesarios
echo 🔍 Verificando archivos del proyecto...

if exist "src\main.tsx" (echo ✅ src\main.tsx) else (echo ⚠️  Archivo faltante: src\main.tsx)
if exist "src\pages\Home.tsx" (echo ✅ src\pages\Home.tsx) else (echo ⚠️  Archivo faltante: src\pages\Home.tsx)
if exist "src\pages\EcoTips.tsx" (echo ✅ src\pages\EcoTips.tsx) else (echo ⚠️  Archivo faltante: src\pages\EcoTips.tsx)
if exist "src\pages\Juegos.tsx" (echo ✅ src\pages\Juegos.tsx) else (echo ⚠️  Archivo faltante: src\pages\Juegos.tsx)
if exist "src\pages\MapaInteligente.tsx" (echo ✅ src\pages\MapaInteligente.tsx) else (echo ⚠️  Archivo faltante: src\pages\MapaInteligente.tsx)
if exist "src\pages\Comunidad.tsx" (echo ✅ src\pages\Comunidad.tsx) else (echo ⚠️  Archivo faltante: src\pages\Comunidad.tsx)
if exist "src\pages\Perfil.tsx" (echo ✅ src\pages\Perfil.tsx) else (echo ⚠️  Archivo faltante: src\pages\Perfil.tsx)
if exist "public\manifest.json" (echo ✅ public\manifest.json) else (echo ⚠️  Archivo faltante: public\manifest.json)
if exist "public\sw.js" (echo ✅ public\sw.js) else (echo ⚠️  Archivo faltante: public\sw.js)

echo.
echo 🎉 ¡Instalación completada!
echo.
echo 🚀 Para iniciar el servidor de desarrollo:
echo    npm run dev
echo.
echo 🏗️  Para construir para producción:
echo    npm run build
echo.
echo 📱 Para probar la PWA:
echo    1. Ejecuta 'npm run build'
echo    2. Sirve los archivos con 'npm run preview'
echo    3. Abre la aplicación en un navegador compatible con PWA
echo.
echo 📖 Documentación completa en: https://github.com/tu-usuario/ecohack
echo.
pause