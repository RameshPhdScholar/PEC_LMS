@echo off
echo Importing leave types data into the database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot leave_management < src\db\leave_types_data.sql
if %ERRORLEVEL% EQU 0 (
    echo Leave types data imported successfully!
) else (
    echo Failed to import leave types data. Error code: %ERRORLEVEL%
)
pause
