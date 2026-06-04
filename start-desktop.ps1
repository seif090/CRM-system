# ERP & CRM - Start Desktop App (One Click)
# Run this to start: Backend → Frontend → Desktop App

$root = $PSScriptRoot
$backend = "$root\backend"
$frontend = "$root\frontend"
$desktop = "$root\desktop\dist\ERP-CRM-win32-x64\ERP-CRM.exe"
$log = "$root\desktop-log.txt"

Write-Host "=== ERP & CRM System ===" -ForegroundColor Cyan
Write-Host "Starting all services ...`n" -ForegroundColor Yellow

# Start Backend
Write-Host "[1/3] Starting Backend (port 8000) ..." -ForegroundColor Green
$bp = Start-Process -FilePath "powershell" -ArgumentList "-NoExit -NoProfile -Command", "cd '$backend'; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -WindowStyle Normal -PassThru
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "[2/3] Starting Frontend (port 3000) ..." -ForegroundColor Green
$fp = Start-Process -FilePath "powershell" -ArgumentList "-NoExit -NoProfile -Command", "cd '$frontend'; npm run dev" -WindowStyle Normal -PassThru
Start-Sleep -Seconds 3

# Start Desktop App
Write-Host "[3/3] Starting Desktop App ..." -ForegroundColor Green
if (Test-Path $desktop) {
  $env:APP_URL = "http://localhost:3000"
  Start-Process -FilePath $desktop -WindowStyle Normal
} else {
  Write-Host "Desktop app not built yet. Run 'setup-desktop.ps1' first." -ForegroundColor Red
  Write-Host "Falling back to browser: http://localhost:3000" -ForegroundColor Yellow
  Start-Process "http://localhost:3000"
}

Write-Host ""
Write-Host "✓ All services started!" -ForegroundColor Cyan
Write-Host "  Backend API: http://localhost:8000"
Write-Host "  API Docs:    http://localhost:8000/docs"
Write-Host "  Frontend:    http://localhost:3000"
Write-Host ""
Write-Host "Close the terminal windows to stop all services." -ForegroundColor Yellow
