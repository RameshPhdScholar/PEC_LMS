-- SQL Script to insert real employee credentials for all departments
-- Password is set to 'password123' for all users (hashed with bcrypt)
-- The hash is generated using bcrypt with 10 rounds
-- $2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a is the hash for 'password123'

-- Use INSERT IGNORE to skip existing employee IDs
-- This will only insert users that don't already exist in the database

-- First, make sure we have the correct departments
INSERT IGNORE INTO departments (id, name) VALUES
(1, 'Computer Science and Engineering'),
(2, 'Computer Science and Engineering – Data Science'),
(3, 'Computer Science and Engineering – Cyber Security'),
(4, 'Computer Science and Engineering – AIML'),
(5, 'Civil Engineering'),
(6, 'Electrical and Electronics Engineering'),
(7, 'Electronics and Communication Engineering'),
(8, 'Humanities and Sciences (H&S)'),
(9, 'Master of Business Administration (MBA)'),
(10, 'Administration');

-- Make sure we have the correct roles
INSERT IGNORE INTO roles (id, name) VALUES
(1, 'Employee'),
(2, 'HOD'),
(3, 'Principal'),
(4, 'Admin'),
(5, 'Super Admin');

-- Administrative Users (Admin, Super Admin, Principal)
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Admin User', 'admin@pallaviengineeringcollege.ac.in', '9876543001', 'Male', 10, 'ADM001', 'Admin', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 4, 1),
('Super Admin User', 'superadmin@pallaviengineeringcollege.ac.in', '9876543002', 'Male', 10, 'ADM002', 'Super Admin', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 5, 1),
('Dr. M Bal Raju', 'principal@pallaviengineeringcollege.ac.in', '9876543003', 'Male', 1, 'CSE003', 'Principal & Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 3, 1);

-- HODs (with HOD role)
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. A. Sai Hareesh', 'cse.hod@pallaviengineeringcollege.ac.in', '9876543004', 'Male', 1, 'CSE001', 'Associate Professor, HoD', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Navya Dubbaka', 'csd.hod@pallaviengineeringcollege.ac.in', '9876543005', 'Female', 2, 'CSD001', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('MALOTHU RAVI', 'csc.hod@pallaviengineeringcollege.ac.in', '9876543006', 'Male', 3, 'CSC001', 'Assistant Professor&HOD', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Eslavath Ravi', 'csm.hod@pallaviengineeringcollege.ac.in', '9876543007', 'Male', 4, 'CSM001', 'Assistant Professor&HOD', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('M. Priyamvada', 'ce.hod@pallaviengineeringcollege.ac.in', '9876543008', 'Female', 5, 'CE001', 'ASSOC. PROFESSOR & HOD', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr. VISWAPRAKASH BABU', 'eee.hod@pallaviengineeringcollege.ac.in', '9876543009', 'Male', 6, 'EEE001', 'Professor & HOD', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr. K. Naveen Kumar', 'ece.hod@pallaviengineeringcollege.ac.in', '9876543010', 'Male', 7, 'ECE001', 'HOD & Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr. D. Ramya', 'has.hod@pallaviengineeringcollege.ac.in', '9876543011', 'Female', 8, 'HSS001', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('DR. A DHANUNJAIAH', 'mba.hod@pallaviengineeringcollege.ac.in', '9876543012', 'Male', 9, 'MBA001', 'Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1);

-- Administration Department (Dummy Data) - Department ID: 10
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Rajesh Kumar', 'rajesh.kumar@pallaviengineeringcollege.ac.in', '9876543100', 'Male', 10, 'ADM003', 'Administrative Officer', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Priya Sharma', 'priya.sharma@pallaviengineeringcollege.ac.in', '9876543101', 'Female', 10, 'ADM004', 'HR Manager', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Suresh Reddy', 'suresh.reddy@pallaviengineeringcollege.ac.in', '9876543102', 'Male', 10, 'ADM005', 'Finance Officer', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Lakshmi Devi', 'lakshmi.devi@pallaviengineeringcollege.ac.in', '9876543103', 'Female', 10, 'ADM006', 'Accounts Manager', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Venkat Rao', 'venkat.rao@pallaviengineeringcollege.ac.in', '9876543104', 'Male', 10, 'ADM007', 'Office Superintendent', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Anitha Kumari', 'anitha.kumari@pallaviengineeringcollege.ac.in', '9876543105', 'Female', 10, 'ADM008', 'Administrative Assistant', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Ramesh Babu', 'ramesh.babu@pallaviengineeringcollege.ac.in', '9876543106', 'Male', 10, 'ADM009', 'Clerk', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Sunitha Rani', 'sunitha.rani@pallaviengineeringcollege.ac.in', '9876543107', 'Female', 10, 'ADM010', 'Office Assistant', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Computer Science and Engineering (CSE) - Department ID: 1
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. CHANNAPRAGADA RAMA SESHAGIRI RAO', 'channapragada.rao@pallaviengineeringcollege.ac.in', '9876543013', 'Male', 1, 'CSE002', 'Director & Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('KARUNAKAR PARVATHI', 'karunakar.parvathi@pallaviengineeringcollege.ac.in', '9876543014', 'Female', 1, 'CSE004', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('CHAKRAPANI CHARUPALLI', 'chakrapani.charupalli@pallaviengineeringcollege.ac.in', '9876543015', 'Male', 1, 'CSE005', 'Assistant Professor', '2023-05-20', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('GILLOLA SHAMESHWARI', 'gillola.shameshwari@pallaviengineeringcollege.ac.in', '9876543016', 'Female', 1, 'CSE006', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr.Ch.Raju', 'ch.raju@pallaviengineeringcollege.ac.in', '9876543017', 'Male', 1, 'CSE007', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Eedunuri Muralidhar Reddy', 'eedunuri.reddy@pallaviengineeringcollege.ac.in', '9876543018', 'Male', 1, 'CSE008', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Naresh Bandam', 'naresh.bandam@pallaviengineeringcollege.ac.in', '9876543019', 'Male', 1, 'CSE009', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dhanunjaya Rao Kodali', 'dhanunjaya.kodali@pallaviengineeringcollege.ac.in', '9876543020', 'Male', 1, 'CSE010', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('V.Poorna Chander', 'poorna.chander@pallaviengineeringcollege.ac.in', '9876543021', 'Male', 1, 'CSE011', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('K.Manasa', 'k.manasa@pallaviengineeringcollege.ac.in', '9876543022', 'Female', 1, 'CSE012', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('P Sudhakar Rao', 'sudhakar.rao@pallaviengineeringcollege.ac.in', '9876543023', 'Male', 1, 'CSE013', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('CH.Ramya', 'ch.ramya@pallaviengineeringcollege.ac.in', '9876543024', 'Female', 1, 'CSE014', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('ANTHOTI RAJU', 'anthoti.raju@pallaviengineeringcollege.ac.in', '9876543025', 'Male', 1, 'CSE015', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('BACHLAKURI SUMATHI', 'bachlakuri.sumathi@pallaviengineeringcollege.ac.in', '9876543026', 'Female', 1, 'CSE016', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('BANOTHU USHA', 'banothu.usha@pallaviengineeringcollege.ac.in', '9876543027', 'Female', 1, 'CSE017', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('THUKARAM RAMAVATH', 'thukaram.ramavath@pallaviengineeringcollege.ac.in', '9876543028', 'Male', 1, 'CSE018', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SHIREESHA GURRAM', 'shireesha.gurram@pallaviengineeringcollege.ac.in', '9876543029', 'Female', 1, 'CSE019', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SAIDIVYA VISSAMSETTY', 'saidivya.vissamsetty@pallaviengineeringcollege.ac.in', '9876543030', 'Female', 1, 'CSE020', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Note: The password hash '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a' corresponds to 'password123'
-- All users can login with their email and the password 'password123'
