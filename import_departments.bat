@echo off
echo Importing departments data into the database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot leave_management < src\db\departments_data.sql
if %ERRORLEVEL% EQU 0 (
    echo Departments data imported successfully!
) else (
    echo Failed to import departments data. Error code: %ERRORLEVEL%
)
pause
