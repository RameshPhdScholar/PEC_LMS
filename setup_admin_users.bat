@echo off
echo Setting up system users table...

REM Get MySQL credentials from environment or use defaults
set DB_HOST=%DATABASE_HOST%
if "%DB_HOST%"=="" set DB_HOST=localhost

set DB_USER=%DATABASE_USER%
if "%DB_USER%"=="" set DB_USER=root

set DB_PASSWORD=%DATABASE_PASSWORD%
if "%DB_PASSWORD%"=="" set DB_PASSWORD=root

set DB_NAME=%DATABASE_NAME%
if "%DB_NAME%"=="" set DB_NAME=leave_management

REM Run the SQL script
mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < src\db\system_users_schema.sql

if %ERRORLEVEL% EQU 0 (
    echo System users table created successfully!
) else (
    echo Failed to create system users table. Please check your MySQL connection and credentials.
)

pause
