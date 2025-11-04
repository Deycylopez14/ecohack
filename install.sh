#!/bin/bash

echo "🚀 Script de instalación automática de EcoHack"
echo "============================================="

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm."
    exit 1
fi

echo "✅ Node.js versión: $(node --version)"
echo "✅ npm versión: $(npm --version)"

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ No se encontró package.json. Asegúrate de estar en el directorio del proyecto EcoHack."
    exit 1
fi

echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias. Intentando con npm ci..."
    npm ci
    
    if [ $? -ne 0 ]; then
        echo "❌ Error instalando dependencias. Intenta manualmente con 'npm install --force'"
        exit 1
    fi
fi

echo "✅ Dependencias instaladas correctamente"

# Verificar que los archivos necesarios existen
echo "🔍 Verificando archivos del proyecto..."

required_files=(
    "src/main.tsx"
    "src/pages/Home.tsx"
    "src/pages/EcoTips.tsx"
    "src/pages/Juegos.tsx"
    "src/pages/MapaInteligente.tsx"
    "src/pages/Comunidad.tsx"
    "src/pages/Perfil.tsx"
    "public/manifest.json"
    "public/sw.js"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "⚠️  Archivo faltante: $file"
    else
        echo "✅ $file"
    fi
done

echo ""
echo "🎉 ¡Instalación completada!"
echo ""
echo "🚀 Para iniciar el servidor de desarrollo:"
echo "   npm run dev"
echo ""
echo "🏗️  Para construir para producción:"
echo "   npm run build"
echo ""
echo "📱 Para probar la PWA:"
echo "   1. Ejecuta 'npm run build'"
echo "   2. Sirve los archivos con 'npm run preview'"
echo "   3. Abre la aplicación en un navegador compatible con PWA"
echo ""
echo "📖 Documentación completa en: https://github.com/tu-usuario/ecohack"