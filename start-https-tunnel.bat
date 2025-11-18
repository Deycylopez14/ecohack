@echo off
echo 🌐 Configurando túnel HTTPS con ngrok...
echo.

REM Verificar si ngrok está instalado
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ngrok no está instalado.
    echo.
    echo 📥 Para instalar ngrok:
    echo.
    echo 1. Ve a: https://ngrok.com/
    echo 2. Crea cuenta gratis
    echo 3. Descarga ngrok para Windows
    echo 4. Descomprime ngrok.exe en esta carpeta
    echo 5. Ejecuta: ngrok config add-authtoken TU_TOKEN
    echo 6. Ejecuta este script nuevamente
    echo.
    echo 🚀 O usa la forma rápida:
    echo    - npm run serve
    echo    - En otra terminal: ngrok http 3000
    echo.
    pause
    exit /b 1
)

echo ✅ ngrok encontrado!
echo.
echo 🚀 Iniciando servidor y túnel HTTPS...
echo.
echo 📱 Tu app estará disponible en:
echo    • URL local: http://localhost:3000
echo    • URL HTTPS: Se mostrará en la consola de ngrok
echo.
echo 💡 La URL HTTPS funcionará desde cualquier dispositivo!
echo.

REM Iniciar servidor en segundo plano
start /B npm run serve

REM Esperar un momento para que se inicie el servidor
timeout /t 3 /nobreak >nul

REM Iniciar túnel ngrok
echo Iniciando túnel ngrok...
ngrok http 3000