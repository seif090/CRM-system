# Build Mobile APK - ERP & CRM
# =============================
# Requirements: Node.js, Java 17+, Android Studio (with SDK)

Write-Host "=== Building ERP & CRM Mobile APK ===" -ForegroundColor Cyan

# 1. Build the web frontend
Write-Host "[1/5] Building frontend..." -ForegroundColor Green
Set-Location "$PSScriptRoot\frontend"
npm run build
if (-not $?) { Write-Host "Frontend build failed!" -ForegroundColor Red; exit 1 }

# 2. Sync with Capacitor
Write-Host "[2/5] Syncing with Capacitor..." -ForegroundColor Green
Set-Location "$PSScriptRoot\mobile"
npx cap sync android
if (-not $?) { Write-Host "Capacitor sync failed!" -ForegroundColor Red; exit 1 }

# 3. Set ANDROID_HOME if needed
if (-not $env:ANDROID_HOME) {
  $possible = @("$env:LOCALAPPDATA\Android\Sdk", "C:\Program Files (x86)\Android\android-sdk", "C:\Android\Sdk")
  foreach ($p in $possible) {
    if (Test-Path $p) { $env:ANDROID_HOME = $p; break }
  }
}

# 4. Build debug APK
Write-Host "[3/5] Building debug APK..." -ForegroundColor Green
Set-Location "$PSScriptRoot\mobile\android"
./gradlew assembleDebug
if (-not $?) { Write-Host "APK build failed!" -ForegroundColor Red; exit 1 }

# 5. Locate the APK
$apk = Get-ChildItem -Recurse -Filter "*.apk" | Where-Object { $_.Name -match "debug" } | Select-Object -First 1
if ($apk) {
  Copy-Item $apk.FullName "$PSScriptRoot\ERP-CRM.apk" -Force
  Write-Host ""
  Write-Host "✓ APK built successfully!" -ForegroundColor Green
  Write-Host "  Location: $PSScriptRoot\ERP-CRM.apk"
  Write-Host "  Size: $([math]::Round($apk.Length / 1MB, 1)) MB"
} else {
  Write-Host "APK not found. Check $PSScriptRoot\mobile\android\app\build\outputs\apk\" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "To install on your phone:" -ForegroundColor Cyan
Write-Host "  adb install ERP-CRM.apk"
Write-Host "  (or transfer the APK file to your phone and open it)"
