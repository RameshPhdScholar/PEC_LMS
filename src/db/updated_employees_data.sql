-- SQL Script to insert updated employee credentials for all departments
-- Password is set to 'password123' for all users (hashed with bcrypt)
-- The hash is generated using bcrypt with 10 rounds
-- $2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a is the hash for 'password123'

-- Use INSERT IGNORE to skip existing employee IDs
-- This will only insert users that don't already exist in the database

-- Computer Science and Engineering - Department ID: 1
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. CHANNAPRAGADA RAMA SESHAGIRI RAO', 'dr..rao@pallaviengineeringcollege.ac.in', '9876579652', 'Male', 1, 'CSE001', 'Director & Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr. M Bal Raju', 'dr..raju@pallaviengineeringcollege.ac.in', '9876579427', 'Male', 1, 'CSE002', 'Principal & Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr.A.Sai Hareesh', 'cse.hod@pallaviengineeringcollege.ac.in', '9876547210', 'Male', 1, 'CSE003', 'Associate Professor, HoD', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('KARUNAKAR PARVATHI', 'karunakar.parvathi@pallaviengineeringcollege.ac.in', '9876572092', 'Female', 1, 'CSE004', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('CHAKRAPANI CHARUPALLI', 'chakrapani.charupalli@pallaviengineeringcollege.ac.in', '9876537335', 'Male', 1, 'CSE005', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('GILLOLA SHAMESHWARI', 'gillola.shameshwari@pallaviengineeringcollege.ac.in', '9876536205', 'Female', 1, 'CSE006', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr.Ch.Raju', 'dr.ch.raju.@pallaviengineeringcollege.ac.in', '9876562025', 'Male', 1, 'CSE007', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Eedunuri Muralidhar Reddy', 'eedunuri.reddy@pallaviengineeringcollege.ac.in', '9876520895', 'Male', 1, 'CSE008', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Naresh Bandam', 'naresh.bandam@pallaviengineeringcollege.ac.in', '9876544495', 'Male', 1, 'CSE009', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dhanunjaya Rao Kodali', 'dhanunjaya.kodali@pallaviengineeringcollege.ac.in', '9876562869', 'Male', 1, 'CSE010', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('V.Poorna Chander', 'v.poorna.chander@pallaviengineeringcollege.ac.in', '9876576000', 'Male', 1, 'CSE011', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('K.Manasa', 'k.manasa.@pallaviengineeringcollege.ac.in', '9876516038', 'Female', 1, 'CSE012', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('P Sudhakar Rao', 'p.rao@pallaviengineeringcollege.ac.in', '9876514486', 'Male', 1, 'CSE013', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('CH.Ramya', 'ch.ramya.@pallaviengineeringcollege.ac.in', '9876517990', 'Female', 1, 'CSE014', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('ANTHOTI RAJU', 'anthoti.raju@pallaviengineeringcollege.ac.in', '9876552575', 'Male', 1, 'CSE015', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('BACHLAKURI SUMATHI', 'bachlakuri.sumathi@pallaviengineeringcollege.ac.in', '9876542972', 'Female', 1, 'CSE016', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('BANOTHU USHA', 'banothu.usha@pallaviengineeringcollege.ac.in', '9876572500', 'Female', 1, 'CSE017', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('THUKARAM RAMAVATH', 'thukaram.ramavath@pallaviengineeringcollege.ac.in', '9876572186', 'Male', 1, 'CSE018', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SHIREESHA GURRAM', 'shireesha.gurram@pallaviengineeringcollege.ac.in', '9876536792', 'Female', 1, 'CSE019', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SAIDIVYA VISSAMSETTY', 'saidivya.vissamsetty@pallaviengineeringcollege.ac.in', '9876580010', 'Female', 1, 'CSE020', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- CSE(Data Science) - Department ID: 2
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Navya Dubbaka', 'navya.dubbaka@pallaviengineeringcollege.ac.in', '9876550847', 'Female', 2, 'CSD001', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Gora Harika', 'gora.harika@pallaviengineeringcollege.ac.in', '9876584526', 'Female', 2, 'CSD002', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('A Padmaja', 'a.padmaja@pallaviengineeringcollege.ac.in', '9876535933', 'Female', 2, 'CSD003', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Naika Suman', 'naika.suman@pallaviengineeringcollege.ac.in', '9876515207', 'Male', 2, 'CSD004', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Garlapati Supriya', 'garlapati.supriya@pallaviengineeringcollege.ac.in', '9876510662', 'Female', 2, 'CSD005', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Ch.Chaithanya', 'ch.chaithanya.@pallaviengineeringcollege.ac.in', '9876527142', 'Female', 2, 'CSD006', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Bondala Anil Raj', 'bondala.raj@pallaviengineeringcollege.ac.in', '9876572943', 'Male', 2, 'CSD007', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Marri Saritha', 'marri.saritha@pallaviengineeringcollege.ac.in', '9876576350', 'Female', 2, 'CSD008', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Chinnari', 'chinnari.@pallaviengineeringcollege.ac.in', '9876587604', 'Female', 2, 'CSD009', 'Lab Assistant', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('M.Praveen Varma', 'm.praveen.varma@pallaviengineeringcollege.ac.in', '9876512979', 'Male', 2, 'CSD010', 'Lab Assistant', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- CSE(Cyber Security) - Department ID: 3
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('MALOTHU RAVI', 'csc.hod@pallaviengineeringcollege.ac.in', '9876558300', 'Male', 3, 'CSC001', 'Assistant Professor&HOD', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Sridhar Ambala', 'sridhar.ambala@pallaviengineeringcollege.ac.in', '9876556837', 'Male', 3, 'CSC002', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SABAVATH RAJU', 'sabavath.raju@pallaviengineeringcollege.ac.in', '9876534252', 'Male', 3, 'CSC003', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('PAVAN KUMAR GUPTA', 'pavan.gupta@pallaviengineeringcollege.ac.in', '9876510141', 'Male', 3, 'CSC004', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('YADAGIRI VAJJA', 'yadagiri.vajja@pallaviengineeringcollege.ac.in', '9876574495', 'Male', 3, 'CSC005', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('BETTY MALIREDDY', 'betty.malireddy@pallaviengineeringcollege.ac.in', '9876588243', 'Female', 3, 'CSC006', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SOWJANYA YEMINENI', 'sowjanya.yemineni@pallaviengineeringcollege.ac.in', '9876563385', 'Male', 3, 'CSC007', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SRILATHA KAKOJU', 'srilatha.kakoju@pallaviengineeringcollege.ac.in', '9876573226', 'Female', 3, 'CSC008', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('JARUTLA PADMA', 'jarutla.padma@pallaviengineeringcollege.ac.in', '9876595949', 'Female', 3, 'CSC009', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- CSE(AIML) - Department ID: 4
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Eslavath Ravi', 'csm.hod@pallaviengineeringcollege.ac.in', '9876577706', 'Male', 4, 'CSM001', 'Assistant Professor&HOD', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('JANGA PRANITHA', 'janga.pranitha@pallaviengineeringcollege.ac.in', '9876538215', 'Male', 4, 'CSM002', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('MUDUMBA PAVANI SREE', 'mudumba.sree@pallaviengineeringcollege.ac.in', '9876528033', 'Female', 4, 'CSM003', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Civil Engineering - Department ID: 5
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('M. Priyamvada', 'ce.hod@pallaviengineeringcollege.ac.in', '9876530815', 'Female', 5, 'CE001', 'ASSOC. PROFESSOR & HOD', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('R. Jaipal', 'r..jaipal@pallaviengineeringcollege.ac.in', '9876558759', 'Male', 5, 'CE002', 'Assoc. Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('A. Mahesh Yadav', 'a..yadav@pallaviengineeringcollege.ac.in', '9876550413', 'Male', 5, 'CE003', 'Assoc. Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('V Shiva Kumar', 'v.kumar@pallaviengineeringcollege.ac.in', '9876532733', 'Male', 5, 'CE004', 'Asst. Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('P Chaitanya', 'p.chaitanya@pallaviengineeringcollege.ac.in', '9876568008', 'Male', 5, 'CE005', 'Asst. Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('G. Venkateswar Reddy', 'g..reddy@pallaviengineeringcollege.ac.in', '9876584535', 'Male', 5, 'CE006', 'Asst. Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('T. Naresh', 't..naresh@pallaviengineeringcollege.ac.in', '9876560939', 'Male', 5, 'CE007', 'Asst. Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('G. Vijaya Parimala', 'g..parimala@pallaviengineeringcollege.ac.in', '9876538117', 'Female', 5, 'CE008', 'Asst. Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. Anusha', 'b..anusha@pallaviengineeringcollege.ac.in', '9876532693', 'Female', 5, 'CE009', 'Asst. Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Electrical and Electronics Engineering - Department ID: 6
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. MALKA NAVEEN KUMAR', 'dr..kumar@pallaviengineeringcollege.ac.in', '9876557596', 'Male', 6, 'EEE001', 'Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr. VISWAPRAKASH BABU', 'eee.hod@pallaviengineeringcollege.ac.in', '9876594704', 'Male', 6, 'EEE002', 'Professor & HOD', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Mr. N. MAHESH', 'mr..mahesh@pallaviengineeringcollege.ac.in', '9876570068', 'Male', 6, 'EEE003', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Mr. V.SAIDULU', 'mr..v.saidulu@pallaviengineeringcollege.ac.in', '9876527272', 'Male', 6, 'EEE004', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Mr. M. VENKATESHWAR RAO', 'mr..rao@pallaviengineeringcollege.ac.in', '9876584023', 'Male', 6, 'EEE005', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Mr. B. RAJU', 'mr..raju@pallaviengineeringcollege.ac.in', '9876538840', 'Male', 6, 'EEE006', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Mr. N LAKSHMAN', 'mr..lakshman@pallaviengineeringcollege.ac.in', '9876560632', 'Male', 6, 'EEE007', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Mr. B. SREENU', 'mr..sreenu@pallaviengineeringcollege.ac.in', '9876561738', 'Male', 6, 'EEE008', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Mrs. P SARASWATHI', 'mrs..saraswathi@pallaviengineeringcollege.ac.in', '9876561670', 'Female', 6, 'EEE009', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. SWETHA', 'b..swetha@pallaviengineeringcollege.ac.in', '9876592107', 'Male', 6, 'EEE010', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. NAVEEN', 'b..naveen@pallaviengineeringcollege.ac.in', '9876581056', 'Male', 6, 'EEE011', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Electronics and Communication Engineering - Department ID: 7
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. K. Naveen Kumar', 'ece.hod@pallaviengineeringcollege.ac.in', '9876564651', 'Male', 7, 'ECE001', 'HOD & Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr. THOTA SRAVANTI', 'dr..sravanti@pallaviengineeringcollege.ac.in', '9876550063', 'Male', 7, 'ECE002', 'IQAC, Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('ANAM SRINIVAS REDDY', 'anam.reddy@pallaviengineeringcollege.ac.in', '9876558928', 'Male', 7, 'ECE003', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('NARENDAR REDDY BURRI', 'narendar.burri@pallaviengineeringcollege.ac.in', '9876556067', 'Male', 7, 'ECE004', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('JOGU PRAVEEN', 'jogu.praveen@pallaviengineeringcollege.ac.in', '9876572718', 'Male', 7, 'ECE005', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('BAVANDLAPALLY LAXMAN', 'bavandlapally.laxman@pallaviengineeringcollege.ac.in', '9876523887', 'Male', 7, 'ECE006', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('MD. MUJEEBULLAH', 'md..mujeebullah@pallaviengineeringcollege.ac.in', '9876583575', 'Male', 7, 'ECE007', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('CH. ANJAN KUMAR', 'ch..kumar@pallaviengineeringcollege.ac.in', '9876534795', 'Male', 7, 'ECE008', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. LAXMAN', 'b..laxman@pallaviengineeringcollege.ac.in', '9876552780', 'Male', 7, 'ECE009', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. MADHUKAR', 'b..madhukar@pallaviengineeringcollege.ac.in', '9876562181', 'Male', 7, 'ECE010', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('G. RANJITH KUMAR', 'g..kumar@pallaviengineeringcollege.ac.in', '9876568085', 'Male', 7, 'ECE011', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('MOHD ABDUL RAQEEB', 'mohd.raqeeb@pallaviengineeringcollege.ac.in', '9876538266', 'Male', 7, 'ECE012', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('A. ROHIT YADAV', 'a..yadav@pallaviengineeringcollege.ac.in', '9876538890', 'Male', 7, 'ECE013', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Humanities and Sciences - Department ID: 8
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr.D.Ramya', 'dr.d.ramya.@pallaviengineeringcollege.ac.in', '9876590383', 'Female', 8, 'HAS001', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr.B.Srinivas', 'dr.b.srinivas.@pallaviengineeringcollege.ac.in', '9876585633', 'Male', 8, 'HAS002', 'Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr.R.Uday Kumar', 'dr.r.uday.kumar@pallaviengineeringcollege.ac.in', '9876584612', 'Male', 8, 'HAS003', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('K.Vijay bhaskar Reddy', 'k.vijay.reddy@pallaviengineeringcollege.ac.in', '9876552787', 'Male', 8, 'HAS004', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B.Sathish', 'b.sathish.@pallaviengineeringcollege.ac.in', '9876521776', 'Male', 8, 'HAS005', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('A.Swetha', 'a.swetha.@pallaviengineeringcollege.ac.in', '9876559663', 'Female', 8, 'HAS006', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('K.Sireesha', 'k.sireesha.@pallaviengineeringcollege.ac.in', '9876545883', 'Female', 8, 'HAS007', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('J.Usha Sree', 'j.usha.sree@pallaviengineeringcollege.ac.in', '9876527531', 'Female', 8, 'HAS008', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('M.Suresh', 'm.suresh.@pallaviengineeringcollege.ac.in', '9876534286', 'Male', 8, 'HAS009', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B.Chandra Shekar Prasad', 'b.chandra.prasad@pallaviengineeringcollege.ac.in', '9876510735', 'Male', 8, 'HAS010', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('M.Nagaraju', 'm.nagaraju.@pallaviengineeringcollege.ac.in', '9876523740', 'Male', 8, 'HAS011', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('P. Shekar', 'p..shekar@pallaviengineeringcollege.ac.in', '9876527910', 'Male', 8, 'HAS012', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('S.Sireesha rani', 's.sireesha.rani@pallaviengineeringcollege.ac.in', '9876540328', 'Female', 8, 'HAS013', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('K.Santhi Kumari', 'k.santhi.kumari@pallaviengineeringcollege.ac.in', '9876589272', 'Female', 8, 'HAS014', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('K.Sumalatha', 'k.sumalatha.@pallaviengineeringcollege.ac.in', '9876543263', 'Female', 8, 'HAS015', 'Lab Assistant', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- MBA - Department ID: 9
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('DR.A DHANUNJAIAH', 'dr.a.dhanunjaiah@pallaviengineeringcollege.ac.in', '9876546632', 'Male', 9, 'MBA001', 'Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('DR.SRINIVAS MANTA', 'dr.srinivas.manta@pallaviengineeringcollege.ac.in', '9876517392', 'Male', 9, 'MBA002', 'Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Mrs. Kavitha Kotte', 'mrs..kotte@pallaviengineeringcollege.ac.in', '9876554433', 'Female', 9, 'MBA003', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr. A.Aravind', 'dr..a.aravind@pallaviengineeringcollege.ac.in', '9876546873', 'Male', 9, 'MBA004', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Mr. G. Praveen Kumar', 'mr..kumar@pallaviengineeringcollege.ac.in', '9876553648', 'Male', 9, 'MBA005', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Ms. N. Mounika', 'ms..mounika@pallaviengineeringcollege.ac.in', '9876579565', 'Female', 9, 'MBA006', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Ms. Saleha Ahmedi', 'ms..ahmedi@pallaviengineeringcollege.ac.in', '9876577054', 'Female', 9, 'MBA007', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('MS. B.Rajitha', 'ms..b.rajitha@pallaviengineeringcollege.ac.in', '9876584860', 'Female', 9, 'MBA008', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Mr. B.Ranjith kumar yadav', 'mr..yadav@pallaviengineeringcollege.ac.in', '9876514095', 'Male', 9, 'MBA009', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Mr. B. Upendar', 'mr..upendar@pallaviengineeringcollege.ac.in', '9876526419', 'Male', 9, 'MBA010', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Mr. B. Raja', 'mr..raja@pallaviengineeringcollege.ac.in', '9876564491', 'Male', 9, 'MBA011', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Mr. P. Shiva krishna Reddy', 'mr..reddy@pallaviengineeringcollege.ac.in', '9876558857', 'Male', 9, 'MBA012', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('S.Shanthi kumari', 's.shanthi.kumari@pallaviengineeringcollege.ac.in', '9876542651', 'Female', 9, 'MBA013', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SHARMILA', 'sharmila.@pallaviengineeringcollege.ac.in', '9876581350', 'Female', 9, 'MBA014', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('M.NAGA RAJU', 'm.naga.raju@pallaviengineeringcollege.ac.in', '9876548296', 'Male', 9, 'MBA015', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('NAGAMANI', 'nagamani.@pallaviengineeringcollege.ac.in', '9876516079', 'Female', 9, 'MBA016', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Note: The password hash '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a' corresponds to 'password123'
-- All users can login with their email and the password 'password123'