@echo off
echo ========================================
echo   FashionSpace - Instalacao Automatica
echo ========================================
echo.

echo [1/3] Instalando dependencias do frontend...
cd FRONT\fashionspace
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo [2/3] Dependencias instaladas com sucesso!
echo.

echo [3/3] Configuracao necessaria:
echo.
echo IMPORTANTE: Voce precisa configurar o Google OAuth!
echo 1. Leia o arquivo GOOGLE_OAUTH_SETUP.md
echo 2. Obtenha seu Client ID do Google Cloud Console
echo 3. Substitua YOUR_GOOGLE_CLIENT_ID em src/App.jsx
echo.

echo ========================================
echo   Instalacao concluida!
echo ========================================
echo.
echo Para iniciar o projeto:
echo   cd FRONT\fashionspace
echo   npm run dev
echo.

pause
