@echo off
echo Starting data import process...

echo.
echo Step 1: Importing departments...
call import_departments.bat

echo.
echo Step 2: Importing leave types...
call import_leave_types.bat

echo.
echo Step 3: Importing employees...
call import_employees.bat

echo.
echo All data imported successfully!
echo You can now start the application with 'npm run dev'
echo.
pause
