// Script to fix the separation between administrative users and administrative department employees
// Run with: node src/scripts/fix-admin-separation.js

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

    // 1. First, let's identify the system users
    // This includes Super Admin, Admin, Principal, and all HODs
    const [adminUsers] = await connection.execute(`
      SELECT id, email, role_id, employee_id
      FROM users
      WHERE role_id IN (${UserRole.SuperAdmin}, ${UserRole.Admin}, ${UserRole.Principal}, ${UserRole.HOD})
    `);

    // 2. Create administrative department employees (regular staff)
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

    // 3. Update system users with proper information
    for (const email of adminEmails) {
      const name = email.split('@')[0];
      const position = name === 'superadmin' ? 'Super Administrator' :
                      name === 'admin' ? 'Administrator' : 'Principal';

      await connection.execute(`
        UPDATE users
        SET
          full_name = CONCAT(UPPER(SUBSTRING(?, 1, 1)), SUBSTRING(?, 2)),
          employee_position = ?
        WHERE email = ?
      `, [name, name, position, email]);

      console.log(`Updated system user: ${email}`);
    }

    // 4. Insert administrative department employees
    for (const employee of adminDeptEmployees) {
      // Check if employee already exists
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

    console.log('Successfully separated system users from administrative department employees');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
    console.log('Database connection closed');
  }
}

main().catch(console.error);
