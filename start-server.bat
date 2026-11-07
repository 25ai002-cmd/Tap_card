@echo off
title TapNova NFC Website Server
color 0B

echo ========================================================
echo         TapNova NFC Card Platform - Web Server
echo ========================================================
echo.

cd /d "%~dp0"

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] First-time setup: Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo [INFO] Starting Vite development server...
echo [INFO] Website URL: http://localhost:3000/
echo [INFO] Admin Portal: http://localhost:3000/#admin (or press Ctrl+Shift+A)
echo.
echo Press Ctrl+C in this window anytime to stop the server.
echo ========================================================
echo.

:: Automatically launch default browser in background after 2 seconds
start "" powershell -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000/'"

:: Start the Vite server
call npm run dev -- --host
pause
