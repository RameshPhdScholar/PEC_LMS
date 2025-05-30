@echo off
echo Importing real employee credentials into the database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot leave_management < src\db\real_credentials_import.sql

if %ERRORLEVEL% EQU 0 (
    echo Real employee credentials imported successfully!
) else (
    echo Failed to import real employee credentials. Error code: %ERRORLEVEL%
)

pause
