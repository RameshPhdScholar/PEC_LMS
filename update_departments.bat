@echo off
echo Updating departments in the database...
mysql -u root -proot leave_management < src/db/update_departments.sql
echo Departments updated successfully!
pause
