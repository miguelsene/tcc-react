@echo off
echo ========================================
echo   FashionSpace API - Iniciando...
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Compilando o projeto...
call mvn clean install -DskipTests

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRO: Falha ao compilar o projeto!
    echo Verifique se o Maven esta instalado e configurado.
    pause
    exit /b 1
)

echo.
echo [2/2] Iniciando o servidor...
echo.
call mvn spring-boot:run

pause
