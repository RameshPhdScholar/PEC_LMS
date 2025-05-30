-- SQL Script to insert credentials for all roles across all departments
-- Password is set to 'password123' for all users (hashed with bcrypt)
-- The hash is generated using bcrypt with 10 rounds
-- $2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a is the hash for 'password123'

-- Use INSERT IGNORE to skip existing employee IDs
-- This will only insert users that don't already exist in the database

-- Computer Science and Engineering (CSE) - Department ID: 1
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. Rajesh Kumar', 'rajesh.kumar@example.com', '9876543001', 'Male', 1, 'CSE001', 'HOD & Professor', '2020-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr. Priya Sharma', 'priya.sharma@example.com', '9876543002', 'Female', 1, 'CSE002', 'Professor', '2020-01-02', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr. Amit Patel', 'amit.patel@example.com', '9876543003', 'Male', 1, 'CSE003', 'Associate Professor', '2020-01-03', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Neha Gupta', 'neha.gupta@example.com', '9876543004', 'Female', 1, 'CSE004', 'Assistant Professor', '2020-01-04', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Ramesh Kore', 'ramesh.kore@example.com', '9876543005', 'Male', 1, 'CSE005', 'Assistant Professor', '2025-05-20', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Computer Science and Engineering - Data Science (CSD) - Department ID: 2
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. Sanjay Mehta', 'sanjay.mehta@example.com', '9876543006', 'Male', 2, 'CSD001', 'HOD & Professor', '2020-01-05', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr. Anita Desai', 'anita.desai@example.com', '9876543007', 'Female', 2, 'CSD002', 'Professor', '2020-01-06', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Vikram Singh', 'vikram.singh@example.com', '9876543008', 'Male', 2, 'CSD003', 'Associate Professor', '2020-01-07', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Meera Reddy', 'meera.reddy@example.com', '9876543009', 'Female', 2, 'CSD004', 'Assistant Professor', '2020-01-08', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Computer Science and Engineering - Cyber Security (CSC) - Department ID: 3
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. Rahul Verma', 'rahul.verma@example.com', '9876543010', 'Male', 3, 'CSC001', 'HOD & Professor', '2020-01-09', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr. Sunita Rao', 'sunita.rao@example.com', '9876543011', 'Female', 3, 'CSC002', 'Professor', '2020-01-10', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Arun Kumar', 'arun.kumar@example.com', '9876543012', 'Male', 3, 'CSC003', 'Associate Professor', '2020-01-11', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Kavita Joshi', 'kavita.joshi@example.com', '9876543013', 'Female', 3, 'CSC004', 'Assistant Professor', '2020-01-12', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Computer Science and Engineering - AI & ML (CSM) - Department ID: 4
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. Vivek Sharma', 'vivek.sharma@example.com', '9876543014', 'Male', 4, 'CSM001', 'HOD & Professor', '2020-01-13', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr. Deepa Nair', 'deepa.nair@example.com', '9876543015', 'Female', 4, 'CSM002', 'Professor', '2020-01-14', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Karthik Menon', 'karthik.menon@example.com', '9876543016', 'Male', 4, 'CSM003', 'Associate Professor', '2020-01-15', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Anjali Mathur', 'anjali.mathur@example.com', '9876543017', 'Female', 4, 'CSM004', 'Assistant Professor', '2020-01-16', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Civil Engineering (CE) - Department ID: 5
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. Suresh Iyer', 'suresh.iyer@example.com', '9876543018', 'Male', 5, 'CE001', 'HOD & Professor', '2020-01-17', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr. Lakshmi Menon', 'lakshmi.menon@example.com', '9876543019', 'Female', 5, 'CE002', 'Professor', '2020-01-18', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Rajiv Malhotra', 'rajiv.malhotra@example.com', '9876543020', 'Male', 5, 'CE003', 'Associate Professor', '2020-01-19', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Divya Pillai', 'divya.pillai@example.com', '9876543021', 'Female', 5, 'CE004', 'Assistant Professor', '2020-01-20', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Electrical and Electronics Engineering (EEE) - Department ID: 6
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. Mohan Krishnan', 'mohan.krishnan@example.com', '9876543022', 'Male', 6, 'EEE001', 'HOD & Professor', '2020-01-21', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr. Radha Gopalan', 'radha.gopalan@example.com', '9876543023', 'Female', 6, 'EEE002', 'Professor', '2020-01-22', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Venkat Raman', 'venkat.raman@example.com', '9876543024', 'Male', 6, 'EEE003', 'Associate Professor', '2020-01-23', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Shobha Nair', 'shobha.nair@example.com', '9876543025', 'Female', 6, 'EEE004', 'Assistant Professor', '2020-01-24', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Electronics and Communication Engineering (ECE) - Department ID: 7
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. Prakash Menon', 'prakash.menon@example.com', '9876543026', 'Male', 7, 'ECE001', 'HOD & Professor', '2020-01-25', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr. Geetha Nambiar', 'geetha.nambiar@example.com', '9876543027', 'Female', 7, 'ECE002', 'Professor', '2020-01-26', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Srinivas Rao', 'srinivas.rao@example.com', '9876543028', 'Male', 7, 'ECE003', 'Associate Professor', '2020-01-27', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Rekha Mohan', 'rekha.mohan@example.com', '9876543029', 'Female', 7, 'ECE004', 'Assistant Professor', '2020-01-28', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Humanities and Sciences (HSS) - Department ID: 8
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. Anil Kumar', 'anil.kumar@example.com', '9876543030', 'Male', 8, 'HSS001', 'HOD & Professor', '2020-01-29', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr. Sarita Devi', 'sarita.devi@example.com', '9876543031', 'Female', 8, 'HSS002', 'Professor', '2020-01-30', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Ravi Shankar', 'ravi.shankar@example.com', '9876543032', 'Male', 8, 'HSS003', 'Associate Professor', '2020-01-31', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Nandini Reddy', 'nandini.reddy@example.com', '9876543033', 'Female', 8, 'HSS004', 'Assistant Professor', '2020-02-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Master of Business Administration (MBA) - Department ID: 9
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. Ramesh Iyer', 'ramesh.iyer@example.com', '9876543034', 'Male', 9, 'MBA001', 'HOD & Professor', '2020-02-02', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr. Sudha Murthy', 'sudha.murthy@example.com', '9876543035', 'Female', 9, 'MBA002', 'Professor', '2020-02-03', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Vijay Mallya', 'vijay.mallya@example.com', '9876543036', 'Male', 9, 'MBA003', 'Associate Professor', '2020-02-04', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Priya Dutt', 'priya.dutt@example.com', '9876543037', 'Female', 9, 'MBA004', 'Assistant Professor', '2020-02-05', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Administration (ADM) - Department ID: 10
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. Sunil Kapoor', 'sunil.kapoor@example.com', '9876543038', 'Male', 10, 'ADM001', 'Principal', '2020-02-06', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 3, 1),
('Rajesh Khanna', 'rajesh.khanna@example.com', '9876543039', 'Male', 10, 'ADM002', 'Admin', '2020-02-07', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 4, 1),
('Kiran Bedi', 'kiran.bedi@example.com', '9876543040', 'Female', 10, 'ADM003', 'Super Admin', '2020-02-08', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 5, 1);

-- Note: The password hash '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a' corresponds to 'password123'
-- All users can login with their email and the password 'password123'
