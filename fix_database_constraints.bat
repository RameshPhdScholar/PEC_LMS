@echo off
echo Fixing database foreign key constraints...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot leave_management < fix_database_constraints.sql
if %ERRORLEVEL% EQU 0 (
    echo Database constraints fixed successfully!
) else (
    echo Failed to fix database constraints. Error code: %ERRORLEVEL%
)
pause
