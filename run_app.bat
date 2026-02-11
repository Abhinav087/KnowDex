@echo off
echo Starting Knowdex AI...

:: Start Backend in a new window
start "Knowdex Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload"

:: Start Frontend in a new window
start "Knowdex Frontend" cmd /k "cd frontend && npm run dev"

echo Servers started!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
pause
