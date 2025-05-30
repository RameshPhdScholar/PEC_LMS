@echo off
echo Setting up Leave Management System with dual roles for HODs and Principal...

echo Step 1: Importing real employee credentials into the database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot leave_management < src\db\real_credentials_import.sql

if %ERRORLEVEL% NEQ 0 (
    echo Failed to import real employee credentials. Error code: %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

echo Step 2: Building the application with dual role functionality...
npm run build

if %ERRORLEVEL% NEQ 0 (
    echo Failed to build the application. Error code: %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

echo Step 3: Starting the application...
npm run start

pause
