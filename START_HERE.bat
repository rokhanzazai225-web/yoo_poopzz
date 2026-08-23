@echo off
color 0A
cls
echo.
echo ╔════════════════════════════════════════╗
echo ║   🎮 YOO POOPZZ SERVER LAUNCHER 🎮    ║
echo ╚════════════════════════════════════════╝
echo.

echo Checking for Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is NOT installed!
    echo Please download from: https://nodejs.org
    pause
    exit /b
)

echo ✅ Node.js found
echo.
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ npm install failed
    pause
    exit /b
)

echo.
echo ✅ Dependencies installed
echo.
echo Starting server...
echo.
call npm start

pause
