# TapNova NFC Website PowerShell Startup Script
$Host.UI.RawUI.WindowTitle = "TapNova NFC Server"
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       TapNova NFC Card Platform - Web Server           " -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/"
    Read-Host "Press Enter to exit..."
    exit 1
}

# Check node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing required dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "[INFO] Starting web server..." -ForegroundColor Green
Write-Host "[INFO] Website URL : http://localhost:3000/" -ForegroundColor Cyan
Write-Host "[INFO] Admin Portal: http://localhost:3000/#admin (or press Ctrl+Shift+A)" -ForegroundColor White
Write-Host ""
Write-Host "Opening your browser in 2 seconds..." -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop the server anytime." -ForegroundColor DarkGray
Write-Host "========================================================" -ForegroundColor Cyan

Start-Job -ScriptBlock {
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3000/"
} | Out-Null

npm run dev -- --host
