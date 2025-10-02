@echo off
echo ========================================
echo   FashionSpace API - Compilando...
echo ========================================
echo.

cd /d "%~dp0"

call mvn clean install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Compilacao concluida com sucesso!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo   ERRO na compilacao!
    echo ========================================
)

echo.
pause
