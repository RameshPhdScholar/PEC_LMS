@echo off
echo Creating leave_management database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot < src\db\schema.sql
if %ERRORLEVEL% EQU 0 (
    echo Database created successfully!
) else (
    echo Failed to create database. Error code: %ERRORLEVEL%
)
pause
