@echo off
title Student Management System - Woxsen University
echo ======================================================================
echo    STUDENT MANAGEMENT SYSTEM - WOXSEN UNIVERSITY
echo    Course: 24TU05IT01 - Industry Excellence Track
echo ======================================================================
echo.

echo [1/3] Checking Node.js environment...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [2/3] Starting Express Backend Server on Port 5000...
start "SMS Backend API Server (Port 5000)" cmd /k "cd server && npm start"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Vite Frontend Server on Port 5173...
start "SMS Frontend Vite (Port 5173)" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ======================================================================
echo    Opening Student Management System in Browser...
echo    Frontend:    http://localhost:5173
echo    Backend API: http://localhost:5000/api/health
echo ======================================================================
start http://localhost:5173

echo.
echo Systems are running! Press any key in this window to close this launcher.
pause >nul
