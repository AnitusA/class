@echo off
echo Setting up Class Management System...
echo.

REM Navigate to project directory
cd /d "d:\Clg\class-management-system"

REM Check if we're in the right directory
if not exist package.json (
    echo Error: package.json not found. Please make sure you're in the correct directory.
    pause
    exit /b 1
)

echo Installing dependencies...
npm install

echo.
echo Setup complete!
echo.
echo To start the development server:
echo   1. Open a terminal in this directory
echo   2. Run: npm run dev
echo   3. Open http://localhost:3000 in your browser
echo.
echo Before using the application:
echo   1. Set up your Supabase project
echo   2. Update the .env file with your Supabase credentials
echo   3. Run the database setup script in Supabase SQL editor
echo.
pause
