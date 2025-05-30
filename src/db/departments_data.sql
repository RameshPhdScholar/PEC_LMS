-- SQL Script to insert departments data

-- First, clear existing departments
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
