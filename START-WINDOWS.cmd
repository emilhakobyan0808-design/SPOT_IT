@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Install Node.js 22.13 or later from https://nodejs.org/
 pause
 exit /b 1
)
node scripts/check-node.mjs
if errorlevel 1 (
 pause
 exit /b 1
)
if not exist node_modules (
 call npm ci
 if errorlevel 1 (
  echo Dependency installation failed. Check your internet connection.
  pause
  exit /b 1
 )
)
if not exist dist\index.html (
 call npm run build
 if errorlevel 1 (
  pause
  exit /b 1
 )
)
echo Open http://localhost:3000 in your browser. Press Ctrl+C to stop.
call npm start
pause
