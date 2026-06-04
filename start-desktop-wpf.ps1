# ERP & CRM - Start WPF Desktop App
# Starts Backend + WPF Desktop App

$root = $PSScriptRoot
$backend = "$root\backend"
$distExe = "$root\desktop-wpf\bin\publish\ErpCrmDesktop.exe"

Write-Host "=== ERP & CRM System (WPF) ===" -ForegroundColor Cyan
Write-Host ""

# Check if built executable exists
if (-not (Test-Path $distExe)) {
    Write-Host "[!] Desktop app not built yet. Building..." -ForegroundColor Yellow
    & "$root\build-desktop-wpf.ps1"
}

# Start Backend
Write-Host "[1/2] Starting Backend (port 8000) ..." -ForegroundColor Green
$bp = Start-Process -FilePath "powershell" -ArgumentList "-NoExit -NoProfile -Command", "cd '$backend'; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -WindowStyle Normal -PassThru
Start-Sleep -Seconds 3

# Start WPF Desktop App
Write-Host "[2/2] Starting WPF Desktop App ..." -ForegroundColor Green
Start-Process -FilePath $distExe -WindowStyle Normal

Write-Host ""
Write-Host "✓ All services started!" -ForegroundColor Cyan
Write-Host "  Backend API:  http://localhost:8000"
Write-Host "  API Docs:     http://localhost:8000/docs"
Write-Host "  Desktop App:  WPF + WebView2 (serves built frontend)"
Write-Host ""
Write-Host "Close the terminal windows to stop all services." -ForegroundColor Yellow
