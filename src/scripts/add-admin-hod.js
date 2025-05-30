// Script to add admin.hod@pallaviengineeringcollege.ac.in as HOD for administrative department
// Run with: node src/scripts/add-admin-hod.js

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

    // Use the existing hash for 'password123'
    const hashedPassword = '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a';
    console.log('Using existing password hash');

    // Check if system_users table exists
    const [tables] = await connection.execute(`
      SHOW TABLES LIKE 'system_users'
    `);

    if (tables.length === 0) {
      console.error('system_users table does not exist. Please run setup-admin-and-employees.js first.');
      return;
    }

    // Check if the admin HOD user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM system_users WHERE email = ?',
      ['admin.hod@pallaviengineeringcollege.ac.in']
    );

    if (existingUsers.length > 0) {
      // Update existing system user
      await connection.execute(`
        UPDATE system_users
        SET role_id = ?, password = ?, is_active = TRUE
        WHERE email = ?
      `, [UserRole.HOD, hashedPassword, 'admin.hod@pallaviengineeringcollege.ac.in']);
      console.log('Updated admin HOD user: admin.hod@pallaviengineeringcollege.ac.in');
    } else {
      // Insert new system user
      await connection.execute(`
        INSERT INTO system_users (
          email, password, role_id
        ) VALUES (
          ?, ?, ?
        )
      `, ['admin.hod@pallaviengineeringcollege.ac.in', hashedPassword, UserRole.HOD]);
      console.log('Inserted admin HOD user: admin.hod@pallaviengineeringcollege.ac.in');
    }

    // Also create a corresponding employee in the users table who will be the HOD
    // First, check if there's already an employee assigned as HOD for admin department
    const [existingHOD] = await connection.execute(`
      SELECT id FROM users
      WHERE department_id = 10 AND role_id = ?
    `, [UserRole.HOD]);

    // Create a new employee record or update existing one
    const adminHODEmployee = {
      employee_id: 'ADM011',
      full_name: 'Dr. Venkat Rao',
      email: 'venkat.rao@pallaviengineeringcollege.ac.in',
      phone_number: '9876543111',
      gender: 'Male',
      department_id: 10, // Administration department
      employee_position: 'Head of Administrative Department',
      joining_date: '2023-01-01',
      role_id: UserRole.HOD
    };

    if (existingHOD.length > 0) {
      // Update existing HOD
      await connection.execute(`
        UPDATE users
        SET
          full_name = ?,
          email = ?,
          phone_number = ?,
          gender = ?,
          employee_position = ?,
          joining_date = ?
        WHERE id = ?
      `, [
        adminHODEmployee.full_name,
        adminHODEmployee.email,
        adminHODEmployee.phone_number,
        adminHODEmployee.gender,
        adminHODEmployee.employee_position,
        adminHODEmployee.joining_date,
        existingHOD[0].id
      ]);
      console.log(`Updated administrative department HOD: ${adminHODEmployee.full_name}`);
    } else {
      // Insert new HOD
      await connection.execute(`
        INSERT INTO users (
          employee_id, full_name, email, phone_number, gender,
          department_id, employee_position, joining_date, password, role_id
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `, [
        adminHODEmployee.employee_id,
        adminHODEmployee.full_name,
        adminHODEmployee.email,
        adminHODEmployee.phone_number,
        adminHODEmployee.gender,
        adminHODEmployee.department_id,
        adminHODEmployee.employee_position,
        adminHODEmployee.joining_date,
        hashedPassword,
        adminHODEmployee.role_id
      ]);
      console.log(`Inserted administrative department HOD: ${adminHODEmployee.full_name}`);
    }

    console.log('Successfully added admin HOD system user and corresponding employee');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
    console.log('Database connection closed');
  }
}

main().catch(console.error);
