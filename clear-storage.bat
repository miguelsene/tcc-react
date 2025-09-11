@echo off
echo ========================================
echo    LIMPANDO DADOS DO FASHIONSPACE
echo ========================================
echo.
echo Este script ira limpar todos os dados salvos no navegador.
echo Voce precisara criar novas contas para testar.
echo.
pause

echo Iniciando o projeto...
cd fashionspace
start http://localhost:3001
npm run dev

echo.
echo ========================================
echo  INSTRUCOES PARA TESTAR:
echo ========================================
echo 1. Abra o DevTools (F12)
echo 2. Va para Application/Storage
echo 3. Clique em "Clear storage"
echo 4. Ou execute no Console:
echo    localStorage.clear()
echo 5. Recarregue a pagina
echo 6. Crie uma nova conta como "Dono de Bazar"
echo ========================================

pause