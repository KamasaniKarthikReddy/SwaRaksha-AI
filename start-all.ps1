Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting SwaRakshaAI Services..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

Write-Host "1. Starting Machine Learning Server (Port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\6ml\6ml'; .\venv\Scripts\python.exe server.py"

Write-Host "2. Starting Backend Server (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\backend'; npm start"

Write-Host "3. Starting Frontend Dev Server (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\frontend'; npm run dev"

Write-Host "========================================================" -ForegroundColor Green
Write-Host "All 3 services have been launched in separate windows!" -ForegroundColor Green
Write-Host "Frontend URL: http://localhost:5173" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
