-- SQL Script to insert employees data with usernames and passwords
-- Password is set to 'password123' for all users (hashed)
-- The hash is generated using bcrypt with 10 rounds

-- Civil Engineering Department (ID: 5)
INSERT INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('M. Priyamvada', 'priyamvada.m@example.com', '9876543001', 'Female', 5, 'CIV001', 'ASSOC. PROFESSOR & HOD', '2020-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('R. Jaipal', 'jaipal.r@example.com', '9876543002', 'Male', 5, 'CIV002', 'Assoc. Professor', '2020-01-02', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('A. Mahesh Yadav', 'mahesh.a@example.com', '9876543003', 'Male', 5, 'CIV003', 'Assoc. Professor', '2020-01-03', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('V Shiva Kumar', 'shiva.v@example.com', '9876543004', 'Male', 5, 'CIV004', 'Asst. Professor', '2020-01-04', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('P Chaitanya', 'chaitanya.p@example.com', '9876543005', 'Male', 5, 'CIV005', 'Asst. Professor', '2020-01-05', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('G. Venkateswar Reddy', 'venkateswar.g@example.com', '9876543006', 'Male', 5, 'CIV006', 'Asst. Professor', '2020-01-06', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('T. Naresh', 'naresh.t@example.com', '9876543007', 'Male', 5, 'CIV007', 'Asst. Professor', '2020-01-07', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('G. Vijaya Parimala', 'vijaya.g@example.com', '9876543008', 'Female', 5, 'CIV008', 'Asst. Professor', '2020-01-08', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. Anusha', 'anusha.b@example.com', '9876543009', 'Female', 5, 'CIV009', 'Asst. Professor', '2020-01-09', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- EEE Department (ID: 6)
INSERT INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. MALKA NAVEEN KUMAR', 'naveen.malka@example.com', '9876543010', 'Male', 6, 'EEE001', 'Professor', '2020-01-10', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr. VISWAPRAKASH BABU', 'viswaprakash.b@example.com', '9876543011', 'Male', 6, 'EEE002', 'Professor & HOD', '2020-01-11', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('N. MAHESH', 'mahesh.n@example.com', '9876543012', 'Male', 6, 'EEE003', 'Associate Professor', '2020-01-12', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('V.SAIDULU', 'saidulu.v@example.com', '9876543013', 'Male', 6, 'EEE004', 'Associate Professor', '2020-01-13', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('M. VENKATESHWAR RAO', 'venkateshwar.m@example.com', '9876543014', 'Male', 6, 'EEE005', 'Associate Professor', '2020-01-14', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. RAJU', 'raju.b@example.com', '9876543015', 'Male', 6, 'EEE006', 'Assistant Professor', '2020-01-15', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('N LAKSHMAN', 'lakshman.n@example.com', '9876543016', 'Male', 6, 'EEE007', 'Assistant Professor', '2020-01-16', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. SREENU', 'sreenu.b@example.com', '9876543017', 'Male', 6, 'EEE008', 'Assistant Professor', '2020-01-17', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('P SARASWATHI', 'saraswathi.p@example.com', '9876543018', 'Female', 6, 'EEE009', 'Assistant Professor', '2020-01-18', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. SWETHA', 'swetha.b@example.com', '9876543019', 'Female', 6, 'EEE010', 'Assistant Professor', '2020-01-19', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. NAVEEN', 'naveen.b@example.com', '9876543020', 'Male', 6, 'EEE011', 'Assistant Professor', '2020-01-20', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- ECE Department (ID: 7)
INSERT INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. K. Naveen Kumar', 'naveen.k@example.com', '9876543021', 'Male', 7, 'ECE001', 'HOD & Professor', '2020-01-21', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr. THOTA SRAVANTI', 'sravanti.t@example.com', '9876543022', 'Female', 7, 'ECE002', 'Associate Professor', '2020-01-22', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('ANAM SRINIVAS REDDY', 'srinivas.a@example.com', '9876543023', 'Male', 7, 'ECE003', 'Assistant Professor', '2020-01-23', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('NARENDAR REDDY BURRI', 'narendar.b@example.com', '9876543024', 'Male', 7, 'ECE004', 'Assistant Professor', '2020-01-24', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('JOGU PRAVEEN', 'praveen.j@example.com', '9876543025', 'Male', 7, 'ECE005', 'Assistant Professor', '2020-01-25', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('BAVANDLAPALLY LAXMAN', 'laxman.b@example.com', '9876543026', 'Male', 7, 'ECE006', 'Assistant Professor', '2020-01-26', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('MD. MUJEEBULLAH', 'mujeebullah.md@example.com', '9876543027', 'Male', 7, 'ECE007', 'Assistant Professor', '2020-01-27', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('CH. ANJAN KUMAR', 'anjan.ch@example.com', '9876543028', 'Male', 7, 'ECE008', 'Assistant Professor', '2020-01-28', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. LAXMAN', 'laxman.b2@example.com', '9876543029', 'Male', 7, 'ECE009', 'Assistant Professor', '2020-01-29', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. MADHUKAR', 'madhukar.b@example.com', '9876543030', 'Male', 7, 'ECE010', 'Assistant Professor', '2020-01-30', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('G. RANJITH KUMAR', 'ranjith.g@example.com', '9876543031', 'Male', 7, 'ECE011', 'Assistant Professor', '2020-01-31', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('MOHD ABDUL RAQEEB', 'abdul.m@example.com', '9876543032', 'Male', 7, 'ECE012', 'Assistant Professor', '2020-02-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('A. ROHIT YADAV', 'rohit.a@example.com', '9876543033', 'Male', 7, 'ECE013', 'Assistant Professor', '2020-02-02', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- CSE Department (ID: 1)
INSERT INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. CHANNAPRAGADA RAMA SESHAGIRI RAO', 'rama.c@example.com', '9876543034', 'Male', 1, 'CSE001', 'Director & Professor', '2020-02-03', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr. M Bal Raju', 'balraju.m@example.com', '9876543035', 'Male', 1, 'CSE002', 'Principal & Professor', '2020-02-04', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 3, 1),
('Dr.A.Sai Hareesh', 'sai.a@example.com', '9876543036', 'Male', 1, 'CSE003', 'Associate Professor, HoD', '2020-02-05', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('KARUNAKAR PARVATHI', 'karunakar.p@example.com', '9876543037', 'Female', 1, 'CSE004', 'Assistant Professor', '2020-02-06', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('CHAKRAPANI CHARUPALLI', 'chakrapani.c@example.com', '9876543038', 'Male', 1, 'CSE005', 'Assistant Professor', '2020-02-07', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('GILLOLA SHAMESHWARI', 'shameshwari.g@example.com', '9876543039', 'Female', 1, 'CSE006', 'Assistant Professor', '2020-02-08', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr.Ch.Raju', 'raju.ch@example.com', '9876543040', 'Male', 1, 'CSE007', 'Assistant Professor', '2020-02-09', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Eedunuri Muralidhar Reddy', 'muralidhar.e@example.com', '9876543041', 'Male', 1, 'CSE008', 'Assistant Professor', '2020-02-10', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Naresh Bandam', 'naresh.b@example.com', '9876543042', 'Male', 1, 'CSE009', 'Assistant Professor', '2020-02-11', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dhanunjaya Rao Kodali', 'dhanunjaya.k@example.com', '9876543043', 'Male', 1, 'CSE010', 'Assistant Professor', '2020-02-12', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('V.Poorna Chander', 'poorna.v@example.com', '9876543044', 'Male', 1, 'CSE011', 'Assistant Professor', '2020-02-13', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('K.Manasa', 'manasa.k@example.com', '9876543045', 'Female', 1, 'CSE012', 'Assistant Professor', '2020-02-14', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('P Sudhakar Rao', 'sudhakar.p@example.com', '9876543046', 'Male', 1, 'CSE013', 'Assistant Professor', '2020-02-15', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('CH.Ramya', 'ramya.ch@example.com', '9876543047', 'Female', 1, 'CSE014', 'Assistant Professor', '2020-02-16', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('ANTHOTI RAJU', 'raju.a@example.com', '9876543048', 'Male', 1, 'CSE015', 'Assistant Professor', '2020-02-17', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('BACHLAKURI SUMATHI', 'sumathi.b@example.com', '9876543049', 'Female', 1, 'CSE016', 'Assistant Professor', '2020-02-18', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('BANOTHU USHA', 'usha.b@example.com', '9876543050', 'Female', 1, 'CSE017', 'Assistant Professor', '2020-02-19', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('THUKARAM RAMAVATH', 'thukaram.r@example.com', '9876543051', 'Male', 1, 'CSE018', 'Assistant Professor', '2020-02-20', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SHIREESHA GURRAM', 'shireesha.g@example.com', '9876543052', 'Female', 1, 'CSE019', 'Assistant Professor', '2020-02-21', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SAIDIVYA VISSAMSETTY', 'saidivya.v@example.com', '9876543053', 'Female', 1, 'CSE020', 'Assistant Professor', '2020-02-22', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- CSE(Data Science) Department (ID: 2)
INSERT INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Navya Dubbaka', 'navya.d@example.com', '9876543054', 'Female', 2, 'CSD001', 'Assistant Professor', '2020-02-23', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Gora Harika', 'harika.g@example.com', '9876543055', 'Female', 2, 'CSD002', 'Assistant Professor', '2020-02-24', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('A Padmaja', 'padmaja.a@example.com', '9876543056', 'Female', 2, 'CSD003', 'Assistant Professor', '2020-02-25', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Naika Suman', 'suman.n@example.com', '9876543057', 'Male', 2, 'CSD004', 'Assistant Professor', '2020-02-26', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Garlapati Supriya', 'supriya.g@example.com', '9876543058', 'Female', 2, 'CSD005', 'Assistant Professor', '2020-02-27', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Ch.Chaithanya', 'chaithanya.ch@example.com', '9876543059', 'Female', 2, 'CSD006', 'Assistant Professor', '2020-02-28', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Bondala Anil Raj', 'anil.b@example.com', '9876543060', 'Male', 2, 'CSD007', 'Assistant Professor', '2020-02-29', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Marri Saritha', 'saritha.m@example.com', '9876543061', 'Female', 2, 'CSD008', 'Assistant Professor', '2020-03-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Chinnari', 'chinnari@example.com', '9876543062', 'Female', 2, 'CSD009', 'Lab Assistant', '2020-03-02', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('M.Praveen Varma', 'praveen.m@example.com', '9876543063', 'Male', 2, 'CSD010', 'Lab Assistant', '2020-03-03', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- CSE(Cyber Security) Department (ID: 3)
INSERT INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('MALOTHU RAVI', 'ravi.m@example.com', '9876543064', 'Male', 3, 'CSC001', 'Assistant Professor&HOD', '2020-03-04', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Sridhar Ambala', 'sridhar.a@example.com', '9876543065', 'Male', 3, 'CSC002', 'Assistant Professor', '2020-03-05', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SABAVATH RAJU', 'raju.s@example.com', '9876543066', 'Male', 3, 'CSC003', 'Assistant Professor', '2020-03-06', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('PAVAN KUMAR GUPTA', 'pavan.g@example.com', '9876543067', 'Male', 3, 'CSC004', 'Assistant Professor', '2020-03-07', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('YADAGIRI VAJJA', 'yadagiri.v@example.com', '9876543068', 'Male', 3, 'CSC005', 'Assistant Professor', '2020-03-08', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('BETTY MALIREDDY', 'betty.m@example.com', '9876543069', 'Female', 3, 'CSC006', 'Assistant Professor', '2020-03-09', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SOWJANYA YEMINENI', 'sowjanya.y@example.com', '9876543070', 'Female', 3, 'CSC007', 'Assistant Professor', '2020-03-10', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SRILATHA KAKOJU', 'srilatha.k@example.com', '9876543071', 'Female', 3, 'CSC008', 'Assistant Professor', '2020-03-11', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('JARUTLA PADMA', 'padma.j@example.com', '9876543072', 'Female', 3, 'CSC009', 'Assistant Professor', '2020-03-12', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- CSE(AIML) Department (ID: 4)
INSERT INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Eslavath Ravi', 'ravi.e@example.com', '9876543073', 'Male', 4, 'CSA001', 'Assistant Professor&HOD', '2020-03-13', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('JANGA PRANITHA', 'pranitha.j@example.com', '9876543074', 'Female', 4, 'CSA002', 'Assistant Professor', '2020-03-14', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('MUDUMBA PAVANI SREE', 'pavani.m@example.com', '9876543075', 'Female', 4, 'CSA003', 'Assistant Professor', '2020-03-15', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Humanities and Sciences (H&S) Department (ID: 8)
INSERT INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr.D.Ramya', 'ramya.d@example.com', '9876543076', 'Female', 8, 'HNS001', 'Associate Professor', '2020-03-16', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr.B.Srinivas', 'srinivas.b@example.com', '9876543077', 'Male', 8, 'HNS002', 'Professor', '2020-03-17', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr.R.Uday Kumar', 'uday.r@example.com', '9876543078', 'Male', 8, 'HNS003', 'Associate Professor', '2020-03-18', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('K.Vijay bhaskar Reddy', 'vijay.k@example.com', '9876543079', 'Male', 8, 'HNS004', 'Assistant Professor', '2020-03-19', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B.Sathish', 'sathish.b@example.com', '9876543080', 'Male', 8, 'HNS005', 'Assistant Professor', '2020-03-20', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('A.Swetha', 'swetha.a@example.com', '9876543081', 'Female', 8, 'HNS006', 'Assistant Professor', '2020-03-21', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('K.Sireesha', 'sireesha.k@example.com', '9876543082', 'Female', 8, 'HNS007', 'Assistant Professor', '2020-03-22', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('J.Usha Sree', 'usha.j@example.com', '9876543083', 'Female', 8, 'HNS008', 'Assistant Professor', '2020-03-23', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('M.Suresh', 'suresh.m@example.com', '9876543084', 'Male', 8, 'HNS009', 'Assistant Professor', '2020-03-24', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B.Chandra Shekar Prasad', 'chandra.b@example.com', '9876543085', 'Male', 8, 'HNS010', 'Assistant Professor', '2020-03-25', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('M.Nagaraju', 'nagaraju.m@example.com', '9876543086', 'Male', 8, 'HNS011', 'Assistant Professor', '2020-03-26', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('P. Shekar', 'shekar.p@example.com', '9876543087', 'Male', 8, 'HNS012', 'Assistant Professor', '2020-03-27', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('S.Sireesha rani', 'sireesha.s@example.com', '9876543088', 'Female', 8, 'HNS013', 'Assistant Professor', '2020-03-28', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('K.Santhi Kumari', 'santhi.k@example.com', '9876543089', 'Female', 8, 'HNS014', 'Assistant Professor', '2020-03-29', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('K.Sumalatha', 'sumalatha.k@example.com', '9876543090', 'Female', 8, 'HNS015', 'Lab Assistant', '2020-03-30', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- MBA Department (ID: 9)
INSERT INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('DR.A DHANUNJAIAH', 'dhanunjaiah.a@example.com', '9876543091', 'Male', 9, 'MBA001', 'Professor', '2020-03-31', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('DR.SRINIVAS MANTA', 'srinivas.m@example.com', '9876543092', 'Male', 9, 'MBA002', 'Professor', '2020-04-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Kavitha Kotte', 'kavitha.k@example.com', '9876543093', 'Female', 9, 'MBA003', 'Associate Professor', '2020-04-02', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr. A.Aravind', 'aravind.a@example.com', '9876543094', 'Male', 9, 'MBA004', 'Associate Professor', '2020-04-03', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('G. Praveen Kumar', 'praveen.g@example.com', '9876543095', 'Male', 9, 'MBA005', 'Associate Professor', '2020-04-04', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('N. Mounika', 'mounika.n@example.com', '9876543096', 'Female', 9, 'MBA006', 'Assistant Professor', '2020-04-05', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Saleha Ahmedi', 'saleha.a@example.com', '9876543097', 'Female', 9, 'MBA007', 'Assistant Professor', '2020-04-06', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B.Rajitha', 'rajitha.b@example.com', '9876543098', 'Female', 9, 'MBA008', 'Assistant Professor', '2020-04-07', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B.Ranjith kumar yadav', 'ranjith.b@example.com', '9876543099', 'Male', 9, 'MBA009', 'Assistant Professor', '2020-04-08', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. Upendar', 'upendar.b@example.com', '9876543100', 'Male', 9, 'MBA010', 'Assistant Professor', '2020-04-09', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. Raja', 'raja.b@example.com', '9876543101', 'Male', 9, 'MBA011', 'Assistant Professor', '2020-04-10', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('P. Shiva krishna Reddy', 'shiva.p@example.com', '9876543102', 'Male', 9, 'MBA012', 'Assistant Professor', '2020-04-11', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('S.Shanthi kumari', 'shanthi.s@example.com', '9876543103', 'Female', 9, 'MBA013', 'Assistant Professor', '2020-04-12', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SHARMILA', 'sharmila@example.com', '9876543104', 'Female', 9, 'MBA014', 'Assistant Professor', '2020-04-13', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('M.NAGA RAJU', 'nagaraju.m2@example.com', '9876543105', 'Male', 9, 'MBA015', 'Assistant Professor', '2020-04-14', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('NAGAMANI', 'nagamani@example.com', '9876543106', 'Female', 9, 'MBA016', 'Assistant Professor', '2020-04-15', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);
