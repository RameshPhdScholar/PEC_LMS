// Script to properly set up admin users and department employees
// Run with: node src/scripts/setup-admin-and-employees.js

require('dotenv').config();
const mysql = require('mysql2/promise');

// Define user roles
const UserRole = {
  Employee: 1,
  HOD: 2,
  Principal: 3,
  Admin: 4,
  SuperAdmin: 5
};

async function main() {
  // Create a connection to the database
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    database: process.env.DATABASE_NAME || 'leave_management',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
  });

  try {
    console.log('Connected to the database');

    // 1. Check if system_users table exists, create if not
    const [tables] = await connection.execute(`
      SHOW TABLES LIKE 'system_users'
    `);

    if (tables.length === 0) {
      console.log('Creating system_users table...');
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS system_users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role_id INT NOT NULL,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (role_id) REFERENCES roles(id)
        )
      `);
    }

    // 2. Set up system users with special permissions
    const adminUsers = [
      {
        email: 'superadmin@pallaviengineeringcollege.ac.in',
        role_id: UserRole.SuperAdmin
      },
      {
        email: 'admin@pallaviengineeringcollege.ac.in',
        role_id: UserRole.Admin
      },
      {
        email: 'principal@pallaviengineeringcollege.ac.in',
        role_id: UserRole.Principal
      },
      {
        email: 'cse.hod@pallaviengineeringcollege.ac.in',
        role_id: UserRole.HOD
      },
      {
        email: 'csd.hod@pallaviengineeringcollege.ac.in',
        role_id: UserRole.HOD
      },
      {
        email: 'csc.hod@pallaviengineeringcollege.ac.in',
        role_id: UserRole.HOD
      },
      {
        email: 'csm.hod@pallaviengineeringcollege.ac.in',
        role_id: UserRole.HOD
      },
      {
        email: 'ce.hod@pallaviengineeringcollege.ac.in',
        role_id: UserRole.HOD
      },
      {
        email: 'eee.hod@pallaviengineeringcollege.ac.in',
        role_id: UserRole.HOD
      },
      {
        email: 'ece.hod@pallaviengineeringcollege.ac.in',
        role_id: UserRole.HOD
      },
      {
        email: 'has.hod@pallaviengineeringcollege.ac.in',
        role_id: UserRole.HOD
      },
      {
        email: 'mba.hod@pallaviengineeringcollege.ac.in',
        role_id: UserRole.HOD
      }
    ];

    // Insert or update system users
    for (const user of adminUsers) {
      const [existingUsers] = await connection.execute(
        'SELECT id FROM system_users WHERE email = ?',
        [user.email]
      );

      if (existingUsers.length > 0) {
        // Update existing system user
        await connection.execute(`
          UPDATE system_users
          SET role_id = ?, is_active = TRUE
          WHERE email = ?
        `, [user.role_id, user.email]);
        console.log(`Updated system user: ${user.email}`);
      } else {
        // Insert new system user
        await connection.execute(`
          INSERT INTO system_users (
            email, password, role_id
          ) VALUES (
            ?, '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', ?
          )
        `, [user.email, user.role_id]);
        console.log(`Inserted system user: ${user.email}`);
      }
    }

    // 3. Set up administrative department employees
    const adminDeptEmployees = [
      {
        employee_id: 'ADM001',
        full_name: 'Dr. Sunil Kapoor',
        email: 'sunil.kapoor@pallaviengineeringcollege.ac.in',
        phone_number: '9876543101',
        gender: 'Male',
        department_id: 10, // Administration department
        employee_position: 'Administrative Director',
        joining_date: '2023-01-01',
        role_id: UserRole.Employee
      },
      {
        employee_id: 'ADM002',
        full_name: 'Rajesh Khanna',
        email: 'rajesh.khanna@pallaviengineeringcollege.ac.in',
        phone_number: '9876543102',
        gender: 'Male',
        department_id: 10,
        employee_position: 'Administrative Manager',
        joining_date: '2023-01-01',
        role_id: UserRole.Employee
      },
      {
        employee_id: 'ADM003',
        full_name: 'Kiran Bedi',
        email: 'kiran.bedi@pallaviengineeringcollege.ac.in',
        phone_number: '9876543103',
        gender: 'Female',
        department_id: 10,
        employee_position: 'Senior Administrator',
        joining_date: '2023-01-01',
        role_id: UserRole.Employee
      },
      {
        employee_id: 'ADM004',
        full_name: 'Priya Sharma',
        email: 'priya.sharma@pallaviengineeringcollege.ac.in',
        phone_number: '9876543104',
        gender: 'Female',
        department_id: 10,
        employee_position: 'HR Manager',
        joining_date: '2023-01-01',
        role_id: UserRole.Employee
      },
      {
        employee_id: 'ADM005',
        full_name: 'Anil Kumar',
        email: 'anil.kumar@pallaviengineeringcollege.ac.in',
        phone_number: '9876543105',
        gender: 'Male',
        department_id: 10,
        employee_position: 'Finance Manager',
        joining_date: '2023-01-01',
        role_id: UserRole.Employee
      },
      {
        employee_id: 'ADM006',
        full_name: 'Lakshmi Devi',
        email: 'lakshmi.devi@pallaviengineeringcollege.ac.in',
        phone_number: '9876543106',
        gender: 'Female',
        department_id: 10,
        employee_position: 'Accounts Manager',
        joining_date: '2023-01-01',
        role_id: UserRole.Employee
      },
      {
        employee_id: 'ADM007',
        full_name: 'Ravi Kumar',
        email: 'ravi.kumar@pallaviengineeringcollege.ac.in',
        phone_number: '9876543107',
        gender: 'Male',
        department_id: 10,
        employee_position: 'Office Superintendent',
        joining_date: '2023-01-01',
        role_id: UserRole.Employee
      },
      {
        employee_id: 'ADM008',
        full_name: 'Anitha Kumari',
        email: 'anitha.kumari@pallaviengineeringcollege.ac.in',
        phone_number: '9876543108',
        gender: 'Female',
        department_id: 10,
        employee_position: 'Administrative Assistant',
        joining_date: '2023-01-01',
        role_id: UserRole.Employee
      },
      {
        employee_id: 'ADM009',
        full_name: 'Ramesh Babu',
        email: 'ramesh.babu@pallaviengineeringcollege.ac.in',
        phone_number: '9876543109',
        gender: 'Male',
        department_id: 10,
        employee_position: 'Clerk',
        joining_date: '2023-01-01',
        role_id: UserRole.Employee
      },
      {
        employee_id: 'ADM010',
        full_name: 'Sunitha Rani',
        email: 'sunitha.rani@pallaviengineeringcollege.ac.in',
        phone_number: '9876543110',
        gender: 'Female',
        department_id: 10,
        employee_position: 'Office Assistant',
        joining_date: '2023-01-01',
        role_id: UserRole.Employee
      }
    ];

    // Insert or update administrative department employees
    for (const employee of adminDeptEmployees) {
      const [existingEmployees] = await connection.execute(
        'SELECT id FROM users WHERE employee_id = ? OR email = ?',
        [employee.employee_id, employee.email]
      );

      if (existingEmployees.length > 0) {
        // Update existing employee
        await connection.execute(`
          UPDATE users
          SET
            full_name = ?,
            email = ?,
            phone_number = ?,
            gender = ?,
            department_id = ?,
            employee_position = ?,
            joining_date = ?,
            role_id = ?
          WHERE id = ?
        `, [
          employee.full_name,
          employee.email,
          employee.phone_number,
          employee.gender,
          employee.department_id,
          employee.employee_position,
          employee.joining_date,
          employee.role_id,
          existingEmployees[0].id
        ]);
        console.log(`Updated administrative department employee: ${employee.full_name}`);
      } else {
        // Insert new employee
        await connection.execute(`
          INSERT INTO users (
            employee_id, full_name, email, phone_number, gender,
            department_id, employee_position, joining_date, password, role_id
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?,
            '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a',
            ?
          )
        `, [
          employee.employee_id,
          employee.full_name,
          employee.email,
          employee.phone_number,
          employee.gender,
          employee.department_id,
          employee.employee_position,
          employee.joining_date,
          employee.role_id
        ]);
        console.log(`Inserted administrative department employee: ${employee.full_name}`);
      }
    }

    console.log('Successfully set up system users and administrative department employees');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
    console.log('Database connection closed');
  }
}

main().catch(console.error);
