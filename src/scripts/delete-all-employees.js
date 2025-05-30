// Script to delete all employee data from the database
// Run with: node src/scripts/delete-all-employees.js

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

    // 1. Delete all leave history records
    await connection.execute('DELETE FROM leave_history');
    console.log('Deleted all leave history records');

    // 2. Delete all leave applications
    await connection.execute('DELETE FROM leave_applications');
    console.log('Deleted all leave applications');

    // 3. Delete all leave balances
    await connection.execute('DELETE FROM leave_balances');
    console.log('Deleted all leave balances');

    // 4. Get the list of essential system users to preserve
    const [essentialUsers] = await connection.execute(`
      SELECT id, email, role_id, employee_id, department_id
      FROM users
      WHERE
        email IN (
          'superadmin@pallaviengineeringcollege.ac.in',
          'admin@pallaviengineeringcollege.ac.in',
          'principal@pallaviengineeringcollege.ac.in'
        )
        OR role_id IN (${UserRole.SuperAdmin}, ${UserRole.Admin}, ${UserRole.Principal})
        OR email LIKE '%.hod@pallaviengineeringcollege.ac.in'
    `);

    console.log('Essential users to preserve:', essentialUsers);

    // 5. Delete all users
    await connection.execute('DELETE FROM users');
    console.log('Deleted all users');

    // 6. Re-insert essential system users with minimal data
    for (const user of essentialUsers) {
      await connection.execute(`
        INSERT INTO users (
          id, email, employee_id, full_name, password, role_id,
          department_id, is_active, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?,
          '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a',
          ?, ?, 1, NOW(), NOW()
        )
      `, [
        user.id,
        user.email,
        user.employee_id,
        user.email.split('@')[0], // Use email username as full name
        user.role_id,
        user.role_id === UserRole.HOD ? user.department_id : 10 // Admin department
      ]);
    }
    console.log('Re-inserted essential system users');

    console.log('All employee data has been deleted successfully. Essential system users preserved.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
    console.log('Database connection closed');
  }
}

main().catch(console.error);
