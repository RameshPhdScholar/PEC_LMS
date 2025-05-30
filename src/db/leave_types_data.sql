-- SQL Script to insert leave types data

-- First, clear existing leave types
DELETE FROM leave_types;

-- Reset auto-increment
ALTER TABLE leave_types AUTO_INCREMENT = 1;

-- Insert leave types
INSERT INTO leave_types (id, name, description) VALUES 
(1, 'Casual Leave', 'Short-term leave for personal matters'),
(2, 'Sick Leave', 'Leave due to illness or medical reasons'),
(3, 'Vacation Leave', 'Annual vacation leave'),
(4, 'On Duty Leave', 'Leave for official duties outside the institution'),
(5, 'Compensatory Casual Leave', 'Leave granted as compensation for working on holidays'),
(6, 'Maternity Leave', 'Leave granted to female employees for childbirth and childcare');
