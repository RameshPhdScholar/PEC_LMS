-- Sample Leave Applications Data
-- This script creates sample leave applications to test the system

USE leave_management;

-- First, let's check if we have users and leave types
SELECT 'Users Count' as Info, COUNT(*) as Count FROM users WHERE role_id = 1
UNION ALL
SELECT 'Leave Types Count' as Info, COUNT(*) as Count FROM leave_types
UNION ALL
SELECT 'Departments Count' as Info, COUNT(*) as Count FROM departments;

-- Insert sample leave applications for testing
-- Note: We'll use existing user IDs and leave type IDs

-- Get some sample user IDs (employees only)
SET @user1 = (SELECT id FROM users WHERE role_id = 1 AND employee_id LIKE 'CSE%' LIMIT 1);
SET @user2 = (SELECT id FROM users WHERE role_id = 1 AND employee_id LIKE 'EEE%' LIMIT 1);
SET @user3 = (SELECT id FROM users WHERE role_id = 1 AND employee_id LIKE 'ECE%' LIMIT 1);
SET @user4 = (SELECT id FROM users WHERE role_id = 1 AND employee_id LIKE 'CE%' LIMIT 1);
SET @user5 = (SELECT id FROM users WHERE role_id = 1 AND employee_id LIKE 'CSM%' LIMIT 1);

-- Get leave type IDs
SET @casual_leave = (SELECT id FROM leave_types WHERE name = 'Casual Leave' LIMIT 1);
SET @sick_leave = (SELECT id FROM leave_types WHERE name = 'Sick Leave' LIMIT 1);
SET @vacation_leave = (SELECT id FROM leave_types WHERE name = 'Vacation Leave' LIMIT 1);
SET @on_duty_leave = (SELECT id FROM leave_types WHERE name = 'On Duty Leave' LIMIT 1);

-- Get HOD user ID for approvals
SET @hod_user = (SELECT id FROM users WHERE role_id = 2 LIMIT 1);

-- Clear existing sample data
DELETE FROM leave_applications WHERE reason LIKE 'Sample%' OR reason LIKE 'Test%';

-- Insert sample leave applications with different statuses
INSERT INTO leave_applications (user_id, leave_type_id, start_date, end_date, days, reason, status, created_at) VALUES
-- Pending applications
(@user1, @casual_leave, '2024-12-20', '2024-12-22', 3, 'Sample casual leave for personal work', 'Pending', '2024-12-15 09:00:00'),
(@user2, @sick_leave, '2024-12-18', '2024-12-19', 2, 'Sample sick leave due to fever', 'Pending', '2024-12-17 10:30:00'),

-- HOD Approved applications (waiting for Principal approval)
(@user3, @vacation_leave, '2024-12-25', '2024-12-30', 6, 'Sample vacation leave for family trip', 'HOD Approved', '2024-12-10 14:00:00'),
(@user4, @on_duty_leave, '2024-12-23', '2024-12-24', 2, 'Sample on duty leave for conference', 'HOD Approved', '2024-12-12 11:15:00'),

-- Principal Approved applications
(@user5, @casual_leave, '2024-12-05', '2024-12-06', 2, 'Sample approved casual leave', 'Principal Approved', '2024-12-01 08:45:00'),
(@user1, @sick_leave, '2024-11-28', '2024-11-29', 2, 'Sample approved sick leave', 'Principal Approved', '2024-11-25 16:20:00'),

-- Rejected applications
(@user2, @vacation_leave, '2024-12-15', '2024-12-20', 6, 'Sample rejected vacation leave', 'Rejected', '2024-12-08 13:30:00');

-- Update HOD approved applications with approval details
UPDATE leave_applications 
SET hod_approval_date = DATE_SUB(created_at, INTERVAL -1 DAY),
    hod_approval_user_id = @hod_user
WHERE status = 'HOD Approved' AND reason LIKE 'Sample%';

-- Update Principal approved applications with approval details
UPDATE leave_applications 
SET hod_approval_date = DATE_SUB(created_at, INTERVAL -1 DAY),
    hod_approval_user_id = @hod_user,
    principal_approval_date = DATE_SUB(created_at, INTERVAL -2 DAY),
    principal_approval_user_id = (SELECT id FROM users WHERE role_id = 3 LIMIT 1)
WHERE status = 'Principal Approved' AND reason LIKE 'Sample%';

-- Update rejected applications with rejection details
UPDATE leave_applications 
SET hod_approval_date = DATE_SUB(created_at, INTERVAL -1 DAY),
    hod_approval_user_id = @hod_user,
    rejection_date = DATE_SUB(created_at, INTERVAL -2 DAY),
    rejection_user_id = (SELECT id FROM users WHERE role_id = 3 LIMIT 1),
    rejection_reason = 'Sample rejection: Insufficient leave balance or conflicting schedule'
WHERE status = 'Rejected' AND reason LIKE 'Sample%';

-- Show the inserted data
SELECT 
    la.id,
    u.full_name as employee_name,
    u.employee_id,
    lt.name as leave_type,
    d.name as department,
    la.start_date,
    la.end_date,
    la.days,
    la.status,
    la.reason,
    la.created_at
FROM leave_applications la
JOIN users u ON la.user_id = u.id
JOIN leave_types lt ON la.leave_type_id = lt.id
LEFT JOIN departments d ON u.department_id = d.id
WHERE la.reason LIKE 'Sample%'
ORDER BY la.created_at DESC;

-- Show summary
SELECT 
    'Total Sample Applications' as Info, 
    COUNT(*) as Count 
FROM leave_applications 
WHERE reason LIKE 'Sample%'
UNION ALL
SELECT 
    CONCAT('Status: ', status) as Info, 
    COUNT(*) as Count 
FROM leave_applications 
WHERE reason LIKE 'Sample%'
GROUP BY status;
