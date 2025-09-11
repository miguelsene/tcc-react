@echo off
echo ========================================
echo    TESTANDO PROJETO FASHIONSPACE
echo ========================================
echo.

echo [1/4] Verificando estrutura do projeto...
if exist "fashionspace\package.json" (
    echo ✓ package.json encontrado
) else (
    echo ✗ package.json não encontrado
    pause
    exit /b 1
)

echo.
echo [2/4] Verificando dependências...
cd fashionspace
if exist "node_modules" (
    echo ✓ node_modules existe
) else (
    echo ! Instalando dependências...
    npm install
)

echo.
echo [3/4] Verificando arquivos principais...
if exist "src\App.jsx" (
    echo ✓ App.jsx encontrado
) else (
    echo ✗ App.jsx não encontrado
)

if exist "src\pages\Login\Login.jsx" (
    echo ✓ Login.jsx encontrado
) else (
    echo ✗ Login.jsx não encontrado
)

echo.
echo [4/4] Iniciando servidor de desenvolvimento...
echo.
echo ========================================
echo  SERVIDOR INICIANDO NA PORTA 3001
echo  Acesse: http://localhost:3001
echo ========================================
echo.

npm run dev

pause