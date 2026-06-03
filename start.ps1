# ERP & CRM System - Startup Script (Windows)
# Make sure you have: Python 3.12+, Node.js 20+, PostgreSQL, Redis

Write-Host "Starting ERP & CRM System..." -ForegroundColor Green

# Start Backend
Write-Host "[1/3] Starting Backend..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\backend"
    python -m venv venv 2>$null
    .\venv\Scripts\Activate.ps1
    pip install -r requirements.txt -q
    uvicorn app.main:app --reload --port 8000
}

# Start Frontend
Write-Host "[2/3] Starting Frontend..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\frontend"
    npm install -q
    npm run dev
}

# Start WhatsApp Service
Write-Host "[3/3] Starting WhatsApp Service..." -ForegroundColor Yellow
$whatsappJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\whatsapp"
    npm install -q
    npm start
}

Write-Host "`nSystem is starting up!" -ForegroundColor Green
Write-Host "  Backend API:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "  API Docs:     http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  Frontend:     http://localhost:3000" -ForegroundColor Cyan
Write-Host "  WhatsApp:     http://localhost:3001" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop all services" -ForegroundColor Gray

try {
    while ($true) { Start-Sleep -Seconds 10 }
} finally {
    Stop-Job $backendJob $frontendJob $whatsappJob
    Remove-Job $backendJob $frontendJob $whatsappJob
}
