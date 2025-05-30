@echo off
echo Setting up Leave Management System in development mode...

echo Step 1: Importing real employee credentials into the database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot leave_management < src\db\real_credentials_import.sql

if %ERRORLEVEL% NEQ 0 (
    echo Failed to import real employee credentials. Error code: %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

echo Step 2: Starting the development server...
npx next dev

pause
