@echo off
echo Importing employees data into the database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot leave_management < src\db\employees_data.sql
if %ERRORLEVEL% EQU 0 (
    echo Employees data imported successfully!
) else (
    echo Failed to import employees data. Error code: %ERRORLEVEL%
)
pause
