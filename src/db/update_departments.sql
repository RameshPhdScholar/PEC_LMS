-- SQL Script to update departments with new names and codes

-- First, check if the code column exists, if not add it
SET @column_exists = 0;
SELECT COUNT(*) INTO @column_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'leave_management'
AND TABLE_NAME = 'departments'
AND COLUMN_NAME = 'code';

SET @add_code_column = CONCAT('ALTER TABLE departments ADD COLUMN code VARCHAR(10) NOT NULL DEFAULT "DEPT" AFTER name');
SET @add_desc_column = CONCAT('ALTER TABLE departments ADD COLUMN description VARCHAR(255) AFTER code');

-- Add columns if they don't exist
SET @sql = IF(@column_exists = 0, @add_code_column, 'SELECT "Code column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if description column exists
SET @desc_column_exists = 0;
SELECT COUNT(*) INTO @desc_column_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'leave_management'
AND TABLE_NAME = 'departments'
AND COLUMN_NAME = 'description';

SET @sql = IF(@desc_column_exists = 0, @add_desc_column, 'SELECT "Description column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- First, delete all existing departments
DELETE FROM departments;

-- Reset auto-increment
ALTER TABLE departments AUTO_INCREMENT = 1;

-- Insert departments in the exact order specified
INSERT INTO departments (id, name, code, description) VALUES
(1, 'Computer Science and Engineering', 'CSE', 'Computer Science and Engineering Department'),
(2, 'Computer Science and Engineering – Data Science', 'CSD', 'Computer Science and Engineering – Data Science Department'),
(3, 'Computer Science and Engineering – Cyber Security', 'CSC', 'Computer Science and Engineering – Cyber Security Department'),
(4, 'Computer Science and Engineering – AIML', 'CSM', 'Computer Science and Engineering – AIML Department'),
(5, 'Civil Engineering', 'CE', 'Civil Engineering Department'),
(6, 'Electrical and Electronics Engineering', 'EEE', 'Electrical and Electronics Engineering Department'),
(7, 'Electronics and Communication Engineering', 'ECE', 'Electronics and Communication Engineering Department'),
(8, 'Humanities and Sciences (H&S)', 'H&S', 'Humanities and Sciences Department'),
(9, 'Master of Business Administration (MBA)', 'MBA', 'Master of Business Administration Department'),
(10, 'Administration', 'Admin', 'Administration Department');



-- Display updated departments
SELECT id, name, code, description FROM departments ORDER BY id;
