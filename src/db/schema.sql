-- Create the database
CREATE DATABASE IF NOT EXISTS leave_management;
USE leave_management;

-- Create Departments table
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Roles table
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone_number VARCHAR(20),
  gender ENUM('Male', 'Female', 'Other'),
  department_id INT,
  employee_id VARCHAR(50) UNIQUE,
  employee_position VARCHAR(100),
  joining_date DATE,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Create Leave Types table
CREATE TABLE IF NOT EXISTS leave_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  max_days_allowed INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Leave Balances table
CREATE TABLE IF NOT EXISTS leave_balances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  leave_type_id INT NOT NULL,
  balance FLOAT NOT NULL DEFAULT 0,
  year INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
  UNIQUE KEY (user_id, leave_type_id, year)
);

-- Create Leave Applications table
CREATE TABLE IF NOT EXISTS leave_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  leave_type_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days FLOAT NOT NULL,
  reason TEXT,
  status ENUM('Pending', 'HOD Approved', 'Principal Approved', 'Rejected', 'Cancelled') DEFAULT 'Pending',
  hod_approval_date DATETIME,
  hod_approval_user_id INT,
  principal_approval_date DATETIME,
  principal_approval_user_id INT,
  rejection_date DATETIME,
  rejection_user_id INT,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
  FOREIGN KEY (hod_approval_user_id) REFERENCES users(id),
  FOREIGN KEY (principal_approval_user_id) REFERENCES users(id),
  FOREIGN KEY (rejection_user_id) REFERENCES users(id)
);

-- Create Leave History table for tracking all changes
CREATE TABLE IF NOT EXISTS leave_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  leave_application_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  action_by_user_id INT NOT NULL,
  previous_status VARCHAR(50),
  new_status VARCHAR(50),
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (leave_application_id) REFERENCES leave_applications(id),
  FOREIGN KEY (action_by_user_id) REFERENCES users(id)
);

-- Insert default roles
INSERT INTO roles (name) VALUES
('Employee'),
('HOD'),
('Principal'),
('Admin'),
('Super Admin');

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

-- Insert leave types
INSERT INTO leave_types (name, description, max_days_allowed) VALUES
('Casual Leave', 'Short-term leave for personal matters', 12),
('On Duty Leave', 'Leave for official duties outside the organization', 15),
('Compensatory Casual Leave', 'Leave granted for working on holidays', 10),
('Sick Leave', 'Leave due to illness or medical conditions', 12),
('Maternity Leave', 'Leave for female employees for childbirth', 180),
('Vacation Leave', 'Annual vacation leave', 30);

-- Insert default admin users
INSERT INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id) VALUES
('Super Admin', 'superadmin@example.com', '9876543210', 'Male', 10, 'SA001', 'Super Administrator', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 5), -- password: superadmin123
('Admin', 'admin@example.com', '9876543211', 'Female', 10, 'AD001', 'Administrator', '2023-01-02', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 4), -- password: admin123
('Principal', 'principal@example.com', '9876543212', 'Male', 10, 'PR001', 'Principal', '2023-01-03', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 3), -- password: principal123
('CSE HOD', 'cse.hod@example.com', '9876543213', 'Female', 1, 'HD001', 'Head of Department', '2023-01-04', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2), -- password: hod123
('John Doe', 'john.doe@example.com', '9876543214', 'Male', 1, 'EM001', 'Assistant Professor', '2023-01-05', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1); -- password: employee123
