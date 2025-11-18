@echo off
echo 🔒 Configurando HTTPS para EcoHack PWA...
echo.

REM Verificar si OpenSSL está disponible
where openssl >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ OpenSSL no está instalado.
    echo.
    echo 📋 Opciones para obtener HTTPS:
    echo.
    echo 1. INSTALAR OPENSSL:
    echo    - Descarga desde: https://slproweb.com/products/Win32OpenSSL.html
    echo    - Instala la versión "Light"
    echo    - Reinicia CMD y ejecuta este script nuevamente
    echo.
    echo 2. USAR HERRAMIENTAS ONLINE:
    echo    - Netlify: https://netlify.com ^(gratis con HTTPS automático^)
    echo    - Vercel: https://vercel.com ^(gratis con HTTPS automático^)
    echo    - GitHub Pages: https://pages.github.com ^(gratis con HTTPS^)
    echo.
    echo 3. USAR LOCALHOST ^(funciona para pruebas básicas^):
    echo    - npm run dev
    echo    - Abre: http://localhost:3000
    echo    - El navegador permite PWA en localhost
    echo.
    echo 4. USAR NGROK ^(túnel HTTPS temporal^):
    echo    - Instala ngrok: https://ngrok.com/
    echo    - npm run serve
    echo    - ngrok http 3000
    echo    - Te da una URL https://xxxxx.ngrok.io
    echo.
    pause
    exit /b 1
)

echo ✅ OpenSSL encontrado. Generando certificado...
echo.

REM Crear directorio para certificados
if not exist "ssl" mkdir ssl

REM Generar clave privada
openssl genrsa -out ssl/key.pem 2048

REM Generar certificado auto-firmado
openssl req -new -x509 -key ssl/key.pem -out ssl/cert.pem -days 365 -subj "/C=MX/ST=Estado/L=Ciudad/O=EcoHack/CN=localhost"

echo ✅ Certificado generado exitosamente!
echo.
echo 📁 Archivos creados:
echo    • ssl/key.pem  ^(clave privada^)
echo    • ssl/cert.pem ^(certificado^)
echo.
echo 🚀 Para usar HTTPS:
echo    npm run serve:ssl
echo.
echo 💡 Nota: Tu navegador mostrará advertencia de "no seguro"
echo    Esto es normal para certificados auto-firmados.
echo    Haz clic en "Avanzado" → "Continuar a localhost"
echo.
pause