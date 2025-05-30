-- Add approval fields to users table
ALTER TABLE users 
ADD COLUMN approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending' AFTER is_active,
ADD COLUMN approved_by INT NULL AFTER approval_status,
ADD COLUMN approved_at TIMESTAMP NULL AFTER approved_by,
ADD COLUMN rejection_reason TEXT NULL AFTER approved_at,
ADD FOREIGN KEY (approved_by) REFERENCES users(id);

-- Update existing users to be approved (so they can continue to login)
UPDATE users SET approval_status = 'Approved', approved_at = NOW() WHERE is_active = 1;

-- Update system users to be approved as well
UPDATE users SET approval_status = 'Approved', approved_at = NOW() 
WHERE role_id IN (3, 4, 5) OR email LIKE '%@pallaviengineeringcollege.ac.in';
