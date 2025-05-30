-- SQL Script to insert real employee credentials for all departments
-- Password is set to 'password123' for all users (hashed with bcrypt)
-- The hash is generated using bcrypt with 10 rounds
-- $2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a is the hash for 'password123'

-- Use INSERT IGNORE to skip existing employee IDs
-- This will only insert users that don't already exist in the database

-- Computer Science and Engineering - Department ID: 1
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. CHANNAPRAGADA RAMA SESHAGIRI RAO', 'dr..rao@example.com', '9876598159', 'Male', 1, 'CSE002', 'Director & Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('KARUNAKAR PARVATHI', 'karunakar.parvathi@example.com', '9876548247', 'Female', 1, 'CSE004', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('CHAKRAPANI CHARUPALLI', 'chakrapani.charupalli@example.com', '9876531514', 'Male', 1, 'CSE005', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('GILLOLA SHAMESHWARI', 'gillola.shameshwari@example.com', '9876582937', 'Female', 1, 'CSE006', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr.Ch.Raju', 'dr.ch.raju.dr.ch.raju@example.com', '9876525799', 'Male', 1, 'CSE007', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Eedunuri Muralidhar Reddy', 'eedunuri.reddy@example.com', '9876532894', 'Male', 1, 'CSE008', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Naresh Bandam', 'naresh.bandam@example.com', '9876525453', 'Male', 1, 'CSE009', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dhanunjaya Rao Kodali', 'dhanunjaya.kodali@example.com', '9876596348', 'Male', 1, 'CSE010', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('V.Poorna Chander', 'v.poorna.chander@example.com', '9876581785', 'Male', 1, 'CSE011', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('K.Manasa', 'k.manasa.k.manasa@example.com', '9876557324', 'Female', 1, 'CSE012', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('P Sudhakar Rao', 'p.rao@example.com', '9876578651', 'Male', 1, 'CSE013', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('CH.Ramya', 'ch.ramya.ch.ramya@example.com', '9876588636', 'Female', 1, 'CSE014', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('ANTHOTI RAJU', 'anthoti.raju@example.com', '9876581663', 'Male', 1, 'CSE015', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('BACHLAKURI SUMATHI', 'bachlakuri.sumathi@example.com', '9876522583', 'Female', 1, 'CSE016', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('BANOTHU USHA', 'banothu.usha@example.com', '9876521757', 'Female', 1, 'CSE017', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('THUKARAM RAMAVATH', 'thukaram.ramavath@example.com', '9876547918', 'Male', 1, 'CSE018', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SHIREESHA GURRAM', 'shireesha.gurram@example.com', '9876580104', 'Female', 1, 'CSE019', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SAIDIVYA VISSAMSETTY', 'saidivya.vissamsetty@example.com', '9876585249', 'Female', 1, 'CSE020', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Gora Harika', 'gora.harika@example.com', '9876566033', 'Female', 1, 'CSD002', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('A Padmaja', 'a.padmaja@example.com', '9876596657', 'Female', 1, 'CSD003', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Naika Suman', 'naika.suman@example.com', '9876541616', 'Male', 1, 'CSD004', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Garlapati Supriya', 'garlapati.supriya@example.com', '9876581392', 'Female', 1, 'CSD005', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Ch.Chaithanya', 'ch.chaithanya.ch.chaithanya@example.com', '9876531454', 'Female', 1, 'CSD006', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Bondala Anil Raj', 'bondala.raj@example.com', '9876585691', 'Male', 1, 'CSD007', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Marri Saritha', 'marri.saritha@example.com', '9876564617', 'Female', 1, 'CSD008', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Chinnari', 'chinnari.chinnari@example.com', '9876569235', 'Female', 1, 'CSD009', 'Lab Assistant', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('M.Praveen Varma', 'm.praveen.varma@example.com', '9876557746', 'Male', 1, 'CSD010', 'Lab Assistant', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Sridhar Ambala', 'sridhar.ambala@example.com', '9876574634', 'Male', 1, 'CSC002', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SABAVATH RAJU', 'sabavath.raju@example.com', '9876530619', 'Male', 1, 'CSC003', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('PAVAN KUMAR GUPTA', 'pavan.gupta@example.com', '9876565766', 'Male', 1, 'CSC004', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('YADAGIRI VAJJA', 'yadagiri.vajja@example.com', '9876587445', 'Male', 1, 'CSC005', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('BETTY MALIREDDY', 'betty.malireddy@example.com', '9876537681', 'Female', 1, 'CSC006', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SOWJANYA YEMINENI', 'sowjanya.yemineni@example.com', '9876533829', 'Male', 1, 'CSC007', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SRILATHA KAKOJU', 'srilatha.kakoju@example.com', '9876577235', 'Female', 1, 'CSC008', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('JARUTLA PADMA', 'jarutla.padma@example.com', '9876522555', 'Female', 1, 'CSC009', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('JANGA PRANITHA', 'janga.pranitha@example.com', '9876546977', 'Male', 1, 'CSM002', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('MUDUMBA PAVANI SREE', 'mudumba.sree@example.com', '9876592765', 'Female', 1, 'CSM003', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- CSE - Data Science - Department ID: 2
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Navya Dubbaka', 'csd.hod@pallaviengineeringcollege.ac.in', '9876596924', 'Male', 2, 'CSD001', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1);

-- CSE - Cyber Security - Department ID: 3
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('MALOTHU RAVI', 'csc.hod@pallaviengineeringcollege.ac.in', '9876510048', 'Male', 3, 'CSC001', 'Assistant Professor&HOD', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1);

-- CSE - AI & ML - Department ID: 4
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Eslavath Ravi', 'csm.hod@pallaviengineeringcollege.ac.in', '9876542202', 'Male', 4, 'CSM001', 'Assistant Professor&HOD', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1);

-- Civil Engineering - Department ID: 5
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('M. Priyamvada', 'ce.hod@pallaviengineeringcollege.ac.in', '9876565099', 'Male', 5, 'CE001', 'ASSOC. PROFESSOR & HOD', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('R. Jaipal', 'r..jaipal@example.com', '9876529184', 'Male', 5, 'CE002', 'Assoc. Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('A. Mahesh Yadav', 'a..yadav@example.com', '9876555682', 'Male', 5, 'CE003', 'Assoc. Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('V Shiva Kumar', 'v.kumar@example.com', '9876525828', 'Male', 5, 'CE004', 'Asst. Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('P Chaitanya', 'p.chaitanya@example.com', '9876560755', 'Male', 5, 'CE005', 'Asst. Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('G. Venkateswar Reddy', 'g..reddy@example.com', '9876546250', 'Male', 5, 'CE006', 'Asst. Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('T. Naresh', 't..naresh@example.com', '9876526711', 'Male', 5, 'CE007', 'Asst. Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('G. Vijaya Parimala', 'g..parimala@example.com', '9876516236', 'Female', 5, 'CE008', 'Asst. Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. Anusha', 'b..anusha@example.com', '9876525941', 'Female', 5, 'CE009', 'Asst. Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Electrical and Electronics Engineering - Department ID: 6
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. VISWAPRAKASH BABU', 'eee.hod@pallaviengineeringcollege.ac.in', '9876546537', 'Male', 6, 'EEE001', 'Professor & HOD', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr. MALKA NAVEEN KUMAR', 'dr..kumar@example.com', '9876578470', 'Male', 6, 'EEE002', 'Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('N. MAHESH', 'n..mahesh@example.com', '9876553932', 'Male', 6, 'EEE003', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('V.SAIDULU', 'v.saidulu.v.saidulu@example.com', '9876518840', 'Male', 6, 'EEE004', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('M. VENKATESHWAR RAO', 'm..rao@example.com', '9876572882', 'Male', 6, 'EEE005', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. RAJU', 'b..raju@example.com', '9876548415', 'Male', 6, 'EEE006', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('N LAKSHMAN', 'n.lakshman@example.com', '9876530727', 'Male', 6, 'EEE007', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. SREENU', 'b..sreenu@example.com', '9876548237', 'Male', 6, 'EEE008', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('P SARASWATHI', 'p.saraswathi@example.com', '9876578127', 'Male', 6, 'EEE009', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. SWETHA', 'b..swetha@example.com', '9876581512', 'Male', 6, 'EEE010', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. NAVEEN', 'b..naveen@example.com', '9876513879', 'Male', 6, 'EEE011', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Electronics and Communication Engineering - Department ID: 7
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. K. Naveen Kumar', 'ece.hod@pallaviengineeringcollege.ac.in', '9876588771', 'Male', 7, 'ECE001', 'HOD & Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr. THOTA SRAVANTI', 'dr..sravanti@example.com', '9876593717', 'Male', 7, 'ECE002', 'IQAC, Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('ANAM SRINIVAS REDDY', 'anam.reddy@example.com', '9876553819', 'Male', 7, 'ECE003', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('NARENDAR REDDY BURRI', 'narendar.burri@example.com', '9876536658', 'Male', 7, 'ECE004', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('JOGU PRAVEEN', 'jogu.praveen@example.com', '9876584623', 'Male', 7, 'ECE005', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('BAVANDLAPALLY LAXMAN', 'bavandlapally.laxman@example.com', '9876518774', 'Male', 7, 'ECE006', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('MD. MUJEEBULLAH', 'md..mujeebullah@example.com', '9876583719', 'Male', 7, 'ECE007', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('CH. ANJAN KUMAR', 'ch..kumar@example.com', '9876556649', 'Male', 7, 'ECE008', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. LAXMAN', 'b..laxman@example.com', '9876516445', 'Male', 7, 'ECE009', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. MADHUKAR', 'b..madhukar@example.com', '9876560624', 'Male', 7, 'ECE010', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('G. RANJITH KUMAR', 'g..kumar@example.com', '9876587065', 'Male', 7, 'ECE011', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('MOHD ABDUL RAQEEB', 'mohd.raqeeb@example.com', '9876584635', 'Male', 7, 'ECE012', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('A. ROHIT YADAV', 'a..yadav@example.com', '9876551598', 'Male', 7, 'ECE013', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Humanities and Sciences - Department ID: 8
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Dr. D. Ramya', 'has.hod@pallaviengineeringcollege.ac.in', '9876592773', 'Male', 8, 'HSS001', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('Dr.B.Srinivas', 'dr.b.srinivas.dr.b.srinivas@example.com', '9876553390', 'Male', 8, 'HSS002', 'Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr.R.Uday Kumar', 'dr.r.uday.kumar@example.com', '9876525769', 'Male', 8, 'HSS003', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('K.Vijay bhaskar Reddy', 'k.vijay.reddy@example.com', '9876559072', 'Male', 8, 'HSS004', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B.Sathish', 'b.sathish.b.sathish@example.com', '9876516783', 'Male', 8, 'HSS005', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('A.Swetha', 'a.swetha.a.swetha@example.com', '9876589265', 'Female', 8, 'HSS006', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('K.Sireesha', 'k.sireesha.k.sireesha@example.com', '9876595843', 'Female', 8, 'HSS007', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('J.Usha Sree', 'j.usha.sree@example.com', '9876599507', 'Female', 8, 'HSS008', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('M.Suresh', 'm.suresh.m.suresh@example.com', '9876524506', 'Male', 8, 'HSS009', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B.Chandra Shekar Prasad', 'b.chandra.prasad@example.com', '9876536659', 'Male', 8, 'HSS010', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('M.Nagaraju', 'm.nagaraju.m.nagaraju@example.com', '9876533591', 'Male', 8, 'HSS011', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('P. Shekar', 'p..shekar@example.com', '9876525119', 'Male', 8, 'HSS012', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('S.Sireesha rani', 's.sireesha.rani@example.com', '9876569286', 'Female', 8, 'HSS013', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('K.Santhi Kumari', 'k.santhi.kumari@example.com', '9876583753', 'Female', 8, 'HSS014', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('K.Sumalatha', 'k.sumalatha.k.sumalatha@example.com', '9876521215', 'Female', 8, 'HSS015', 'Lab Assistant', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Master of Business Administration - Department ID: 9
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('DR. A DHANUNJAIAH', 'mba.hod@pallaviengineeringcollege.ac.in', '9876548579', 'Male', 9, 'MBA001', 'Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1),
('DR.SRINIVAS MANTA', 'dr.srinivas.manta@example.com', '9876561442', 'Male', 9, 'MBA002', 'Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Kavitha Kotte', 'kavitha.kotte@example.com', '9876568364', 'Female', 9, 'MBA003', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Dr. A.Aravind', 'dr..a.aravind@example.com', '9876568735', 'Male', 9, 'MBA004', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('G. Praveen Kumar', 'g..kumar@example.com', '9876594208', 'Male', 9, 'MBA005', 'Associate Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('N. Mounika', 'n..mounika@example.com', '9876573409', 'Female', 9, 'MBA006', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('Saleha Ahmedi', 'saleha.ahmedi@example.com', '9876522794', 'Female', 9, 'MBA007', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B.Rajitha', 'b.rajitha.b.rajitha@example.com', '9876513145', 'Female', 9, 'MBA008', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B.Ranjith kumar yadav', 'b.ranjith.yadav@example.com', '9876518292', 'Male', 9, 'MBA009', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. Upendar', 'b..upendar@example.com', '9876558770', 'Male', 9, 'MBA010', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('B. Raja', 'b..raja@example.com', '9876541143', 'Male', 9, 'MBA011', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('P. Shiva krishna Reddy', 'p..reddy@example.com', '9876569910', 'Male', 9, 'MBA012', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('S.Shanthi kumari', 's.shanthi.kumari@example.com', '9876521368', 'Female', 9, 'MBA013', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('SHARMILA', 'sharmila.sharmila@example.com', '9876576757', 'Female', 9, 'MBA014', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('M.NAGA RAJU', 'm.naga.raju@example.com', '9876550515', 'Male', 9, 'MBA015', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1),
('NAGAMANI', 'nagamani.nagamani@example.com', '9876559483', 'Female', 9, 'MBA016', 'Assistant Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 1, 1);

-- Administration - Department ID: 10
INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES
('Admin User', 'admin@pallaviengineeringcollege.ac.in', '9876558346', 'Male', 10, 'ADM001', 'Admin', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 4, 1),
('Super Admin User', 'superadmin@pallaviengineeringcollege.ac.in', '9876559734', 'Male', 10, 'ADM002', 'Super Admin', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 5, 1),
('Dr. M Bal Raju', 'principal@pallaviengineeringcollege.ac.in', '9876541715', 'Male', 10, 'CSE003', 'Principal & Professor', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 3, 1),
('Dr. A. Sai Hareesh', 'cse.hod@pallaviengineeringcollege.ac.in', '9876582636', 'Male', 10, 'CSE001', 'Associate Professor, HoD', '2023-01-01', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2, 1);

-- Note: The password hash '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a' corresponds to 'password123'
-- All users can login with their email and the password 'password123'