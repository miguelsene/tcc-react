@echo off
echo ========================================
echo    TESTANDO TIPOS DE USUARIO
echo ========================================
echo.

cd fashionspace

echo [1] Iniciando servidor...
start http://localhost:3001
timeout /t 2 /nobreak > nul

echo [2] Abrindo navegador...
echo.
echo ========================================
echo  PASSOS PARA TESTAR:
echo ========================================
echo.
echo 1. Abra o DevTools (F12)
echo 2. No Console, execute: localStorage.clear()
echo 3. Recarregue a pagina (F5)
echo 4. Crie uma conta como "Dono de Bazar"
echo 5. Verifique se aparece "Criar Bazar" no menu
echo 6. Faca logout e crie conta como "Usuario Casual"  
echo 7. Verifique se NAO aparece "Criar Bazar"
echo.
echo ========================================

npm run dev