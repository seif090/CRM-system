# ERP & CRM - Start Desktop App (One Click)
# Starts Backend + Desktop App (no need for frontend dev server)

$root = $PSScriptRoot
$backend = "$root\backend"
$desktop = "$root\desktop"
$log = "$root\desktop-log.txt"

Write-Host "=== ERP & CRM System ===" -ForegroundColor Cyan
Write-Host ""

# Check if frontend dist exists (needed for desktop self-hosting)
if (-not (Test-Path "$root\frontend\dist\index.html")) {
  Write-Host "[!] Frontend dist not found. Building..." -ForegroundColor Yellow
  Push-Location "$root\frontend"
  npm run build
  Pop-Location
  Write-Host "[✓] Frontend built." -ForegroundColor Green
}

# Start Backend
Write-Host "[1/2] Starting Backend (port 8000) ..." -ForegroundColor Green
$bp = Start-Process -FilePath "powershell" -ArgumentList "-NoExit -NoProfile -Command", "cd '$backend'; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -WindowStyle Normal -PassThru
Start-Sleep -Seconds 3

# Check if desktop is built (packaged .exe) or needs to run via electron directly
$desktopExe = "$desktop\dist\ERP-CRM-win32-x64\ERP-CRM.exe"
if (Test-Path $desktopExe) {
  Write-Host "[2/2] Starting Desktop App ..." -ForegroundColor Green
  Start-Process -FilePath $desktopExe -WindowStyle Normal
} else {
  Write-Host "[2/2] Desktop app not packaged. Running via electron ..." -ForegroundColor Green
  Push-Location $desktop
  Start-Process -FilePath "powershell" -ArgumentList "-NoExit -NoProfile -Command", "cd '$desktop'; npm start" -WindowStyle Normal
  Pop-Location
}

Write-Host ""
Write-Host "✓ All services started!" -ForegroundColor Cyan
Write-Host "  Backend API:  http://localhost:8000"
Write-Host "  API Docs:     http://localhost:8000/docs"
Write-Host "  Desktop App:  Launched (serves built frontend, proxies API)"
Write-Host ""
Write-Host "Close the terminal windows to stop all services." -ForegroundColor Yellow
