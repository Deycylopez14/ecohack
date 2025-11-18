#!/bin/bash
# Script para generar iconos PWA de diferentes tamaños
# Requiere ImageMagick instalado: https://imagemagick.org/

# Verificar que existe el directorio de iconos
mkdir -p public/icons

# Imagen fuente (debe ser de alta resolución, preferiblemente 1024x1024)
SOURCE_ICON="public/icons/ecohack.png"

if [ ! -f "$SOURCE_ICON" ]; then
    echo "❌ No se encuentra la imagen fuente: $SOURCE_ICON"
    echo "Por favor, asegúrate de tener una imagen llamada 'ecohack.png' en public/icons/"
    exit 1
fi

echo "🚀 Generando iconos PWA..."

# Tamaños necesarios para PWA
sizes=(72 96 128 144 152 192 384 512)

for size in "${sizes[@]}"; do
    echo "📱 Generando icono de ${size}x${size}..."
    
    # Usar ImageMagick para redimensionar
    if command -v magick &> /dev/null; then
        magick "$SOURCE_ICON" -resize "${size}x${size}" "public/icons/icon-${size}x${size}.png"
    elif command -v convert &> /dev/null; then
        convert "$SOURCE_ICON" -resize "${size}x${size}" "public/icons/icon-${size}x${size}.png"
    else
        echo "❌ ImageMagick no está instalado. Instálalo desde: https://imagemagick.org/"
        echo "O usa una herramienta online como: https://www.pwabuilder.com/imageGenerator"
        exit 1
    fi
done

# Crear favicon.ico
echo "🌟 Generando favicon.ico..."
if command -v magick &> /dev/null; then
    magick "$SOURCE_ICON" -resize 32x32 -resize 16x16 -colors 256 public/favicon.ico
elif command -v convert &> /dev/null; then
    convert "$SOURCE_ICON" -resize 32x32 -resize 16x16 -colors 256 public/favicon.ico
fi

echo "✅ ¡Iconos generados exitosamente!"
echo ""
echo "📋 Archivos creados:"
for size in "${sizes[@]}"; do
    echo "   • public/icons/icon-${size}x${size}.png"
done
echo "   • public/favicon.ico"
echo ""
echo "💡 Tip: Para mejores resultados, asegúrate de que tu imagen fuente sea de 1024x1024px y tenga fondo transparente."