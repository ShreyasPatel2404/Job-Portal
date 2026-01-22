@echo off
echo ==========================================
echo   JOB PORTAL - DEV STARTUP SCRIPT
echo ==========================================
echo.
echo Stopping any existing processes on port 8080...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8080" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo.
echo 1. Starting Backend (Spring Boot)...
echo    (This will open in a new window)
echo    PLEASE WAIT for "Started JobPortalApplication" in that window before logging in!
start "Job Portal Backend" cmd /k ".\mvnw.cmd spring-boot:run"

echo.
echo 2. Giving Backend time to initialize...
timeout /t 15

echo.
echo 3. Starting Frontend (Vite)...
cd frontend
npm run dev
