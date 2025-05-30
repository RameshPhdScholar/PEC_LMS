@echo off
echo Fixing system users' passwords in the database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot leave_management < fix_admin_passwords.sql

if %ERRORLEVEL% EQU 0 (
    echo System users' passwords fixed successfully!
    echo All system users can now log in with password "password123"
) else (
    echo Failed to fix system users' passwords. Error code: %ERRORLEVEL%
)

pause
