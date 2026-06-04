# ERP & CRM - Build WPF Desktop App
# Creates a single-file portable executable

$root = $PSScriptRoot
$project = "$root\desktop-wpf"
$output = "$root\desktop-wpf\bin\publish"

Write-Host "=== Building ERP & CRM Desktop (WPF) ===" -ForegroundColor Cyan
Write-Host ""

# Build frontend first if dist doesn't exist
if (-not (Test-Path "$root\frontend\dist\index.html")) {
    Write-Host "[1/3] Building frontend..." -ForegroundColor Green
    Push-Location "$root\frontend"
    npm run build
    Pop-Location
} else {
    Write-Host "[1/3] Frontend dist already exists. Skipping." -ForegroundColor Yellow
}

# Publish WPF app as single-file portable
Write-Host "[2/3] Building WPF app..." -ForegroundColor Green
Push-Location $project
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -o $output
Pop-Location

if (-not (Test-Path "$output\ErpCrmDesktop.exe")) {
    Write-Host "[ERROR] Build failed!" -ForegroundColor Red
    exit 1
}

# Create shortcut
Write-Host "[3/3] Creating shortcut..." -ForegroundColor Green
$shortcutPath = "$root\ERP-CRM Desktop.lnk"
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "$output\ErpCrmDesktop.exe"
$shortcut.WorkingDirectory = $root
$shortcut.Description = "ERP & CRM System"
$shortcut.Save()

Write-Host ""
Write-Host "=== Build Complete ===" -ForegroundColor Green
Write-Host "  Executable: $output\ErpCrmDesktop.exe"
Write-Host "  Shortcut:   $shortcutPath"
Write-Host ""
Write-Host "To run: double-click the shortcut or:" -ForegroundColor Yellow
Write-Host "  & `"$output\ErpCrmDesktop.exe`""
