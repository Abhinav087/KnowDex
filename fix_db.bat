@echo off
echo ==========================================
echo      Knowdex AI - Database Reset Tool
echo ==========================================
echo.
echo [WARNING] This will terminate ALL Python processes and delete the database.
echo.
pause

echo.
echo 1. Stopping running processes...
taskkill /IM python.exe /F
taskkill /IM node.exe /F
echo.

echo 2. Deleting old database...
del /F /Q "knowdex.db"
if exist "knowdex.db" (
    echo [ERROR] Failed to delete database. Is it still open?
    pause
    exit /b
)
echo Database deleted successfully.

echo.
echo 3. Restarting Backend (to recreate tables)...
start "Knowdex Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload"

echo.
echo 4. Restarting Frontend...
start "Knowdex Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo      Success! Application Restarted.
echo ==========================================
echo Please reload http://localhost:5173 and register a new account.
pause
