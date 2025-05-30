-- Fix database foreign key constraints for leave_applications table
-- This script will temporarily disable foreign key checks, clean up invalid data, and re-enable checks

USE leave_management;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Clean up any invalid leave applications with non-existent user references
DELETE FROM leave_applications 
WHERE user_id NOT IN (SELECT id FROM users);

-- Clean up any invalid leave applications with non-existent leave type references
DELETE FROM leave_applications 
WHERE leave_type_id NOT IN (SELECT id FROM leave_types);

-- Set NULL for any invalid hod_approval_user_id references
UPDATE leave_applications 
SET hod_approval_user_id = NULL 
WHERE hod_approval_user_id IS NOT NULL 
AND hod_approval_user_id NOT IN (SELECT id FROM users);

-- Set NULL for any invalid principal_approval_user_id references
UPDATE leave_applications 
SET principal_approval_user_id = NULL 
WHERE principal_approval_user_id IS NOT NULL 
AND principal_approval_user_id NOT IN (SELECT id FROM users);

-- Set NULL for any invalid rejection_user_id references
UPDATE leave_applications 
SET rejection_user_id = NULL 
WHERE rejection_user_id IS NOT NULL 
AND rejection_user_id NOT IN (SELECT id FROM users);

-- Clean up leave_history table as well
DELETE FROM leave_history 
WHERE leave_application_id NOT IN (SELECT id FROM leave_applications);

DELETE FROM leave_history 
WHERE action_by_user_id NOT IN (SELECT id FROM users);

-- Clean up leave_balances table
DELETE FROM leave_balances 
WHERE user_id NOT IN (SELECT id FROM users);

DELETE FROM leave_balances 
WHERE leave_type_id NOT IN (SELECT id FROM leave_types);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Show current status
SELECT 'Leave Applications Count' as Info, COUNT(*) as Count FROM leave_applications
UNION ALL
SELECT 'Users Count' as Info, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Leave Types Count' as Info, COUNT(*) as Count FROM leave_types
UNION ALL
SELECT 'Departments Count' as Info, COUNT(*) as Count FROM departments;

-- Show any remaining constraint issues
SELECT 'Invalid user_id in leave_applications' as Issue, COUNT(*) as Count
FROM leave_applications la
LEFT JOIN users u ON la.user_id = u.id
WHERE u.id IS NULL
UNION ALL
SELECT 'Invalid leave_type_id in leave_applications' as Issue, COUNT(*) as Count
FROM leave_applications la
LEFT JOIN leave_types lt ON la.leave_type_id = lt.id
WHERE lt.id IS NULL;
