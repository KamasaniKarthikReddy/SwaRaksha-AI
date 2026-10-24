@echo off
echo ========================================================
echo Starting SwaRakshaAI Services...
echo ========================================================

echo 1. Starting Machine Learning Server (Port 8000)...
start "SwaRaksha - ML Service (Port 8000)" cmd /k "cd /d "%~dp06ml\6ml" && venv\Scripts\python.exe server.py"

echo 2. Starting Node.js Backend Server (Port 3000)...
start "SwaRaksha - Backend (Port 3000)" cmd /k "cd /d "%~dp0backend" && npm start"

echo 3. Starting Frontend Server (Port 5173)...
start "SwaRaksha - Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo ========================================================
echo All services are launching in their own terminal windows.
echo Frontend will be accessible at: http://localhost:5173
echo ========================================================
pause
