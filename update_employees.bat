@echo off
echo Updating employee data...

echo Step 1: Generating SQL from HTML data...
node src\db\new_html_to_sql.js

if %ERRORLEVEL% NEQ 0 (
    echo Failed to generate SQL. Error code: %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

echo Step 2: Importing updated employee data into the database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot leave_management < src\db\updated_employees_data.sql

if %ERRORLEVEL% EQU 0 (
    echo Updated employee data imported successfully!
) else (
    echo Failed to import updated employee data. Error code: %ERRORLEVEL%
)

pause
