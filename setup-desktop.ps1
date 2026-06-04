# ERP & CRM Desktop App - Installer Script
# Run this script to install the desktop app

$src = "$PSScriptRoot\desktop\dist\ERP-CRM-win32-x64"
$dest = "$env:LOCALAPPDATA\ERP-CRM"
$shortcut = "$env:USERPROFILE\Desktop\ERP & CRM.lnk"

Write-Host "=== ERP & CRM Desktop Installer ===" -ForegroundColor Cyan

# Stop if running
$existing = Get-Process "ERP-CRM" -ErrorAction SilentlyContinue
if ($existing) { $existing | Stop-Process -Force }

# Copy files
Write-Host "Copying files to $dest ..." -ForegroundColor Yellow
if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
New-Item -ItemType Directory -Path $dest -Force | Out-Null
Copy-Item -Path "$src\*" -Destination $dest -Recurse -Force

# Create shortcut
Write-Host "Creating desktop shortcut ..." -ForegroundColor Yellow
$shell = New-Object -ComObject WScript.Shell
$lnk = $shell.CreateShortcut($shortcut)
$lnk.TargetPath = "$dest\ERP-CRM.exe"
$lnk.WorkingDirectory = $dest
$lnk.Description = "ERP & CRM System"
$lnk.Save()

Write-Host ""
Write-Host "✓ Installation complete!" -ForegroundColor Green
Write-Host "  App: $dest\ERP-CRM.exe"
Write-Host "  Shortcut: $shortcut"
Write-Host ""
Write-Host "Run the app from the desktop shortcut or start it directly."
Write-Host ""
Write-Host "IMPORTANT: Make sure the backend server is running first!"
Write-Host "  Start backend: cd backend && uvicorn app.main:app --reload"
Write-Host "  Start frontend: cd frontend && npm run dev"
