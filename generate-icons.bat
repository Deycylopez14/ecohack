@echo off
REM Script para generar iconos PWA de diferentes tamaños (Windows)
REM Requiere ImageMagick instalado: https://imagemagick.org/

REM Verificar que existe el directorio de iconos
if not exist "public\icons" mkdir "public\icons"

REM Imagen fuente (debe ser de alta resolución, preferiblemente 1024x1024)
set SOURCE_ICON=public\icons\ecohack.png

if not exist "%SOURCE_ICON%" (
    echo ❌ No se encuentra la imagen fuente: %SOURCE_ICON%
    echo Por favor, asegúrate de tener una imagen llamada 'ecohack.png' en public/icons/
    pause
    exit /b 1
)

echo 🚀 Generando iconos PWA...

REM Tamaños necesarios para PWA
set sizes=72 96 128 144 152 192 384 512

for %%s in (%sizes%) do (
    echo 📱 Generando icono de %%sx%%s...
    
    REM Usar ImageMagick para redimensionar
    magick "%SOURCE_ICON%" -resize %%sx%%s "public\icons\icon-%%sx%%s.png"
    if errorlevel 1 (
        echo ❌ Error generando icono de %%sx%%s
        echo Asegúrate de tener ImageMagick instalado: https://imagemagick.org/
        echo O usa una herramienta online como: https://www.pwabuilder.com/imageGenerator
    )
)

REM Crear favicon.ico
echo 🌟 Generando favicon.ico...
magick "%SOURCE_ICON%" -resize 32x32 -resize 16x16 -colors 256 public\favicon.ico

echo ✅ ¡Iconos generados exitosamente!
echo.
echo 📋 Archivos creados:
for %%s in (%sizes%) do (
    echo    • public\icons\icon-%%sx%%s.png
)
echo    • public\favicon.ico
echo.
echo 💡 Tip: Para mejores resultados, asegúrate de que tu imagen fuente sea de 1024x1024px y tenga fondo transparente.
pause