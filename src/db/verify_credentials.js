/**
 * Script to verify credentials in the database
 *
 * Usage: node src/db/verify_credentials.js
 */

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function verifyCredentials() {
  let connection;
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'leave_management'
    });

    console.log('Connected to database. Verifying credentials...');

    // Count total users
    const [totalRows] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`Total users in database: ${totalRows[0].count}`);

    // Count users by role
    const [roleRows] = await connection.query(`
      SELECT r.name as role_name, COUNT(u.id) as count
      FROM users u
      JOIN roles r ON u.role_id = r.id
      GROUP BY r.name
    `);
    console.log('\nUsers by role:');
    roleRows.forEach(row => {
      console.log(`${row.role_name}: ${row.count}`);
    });

    // Count users by department
    const [deptRows] = await connection.query(`
      SELECT d.name as department_name, COUNT(u.id) as count
      FROM users u
      JOIN departments d ON u.department_id = d.id
      GROUP BY d.name
    `);
    console.log('\nUsers by department:');
    deptRows.forEach(row => {
      console.log(`${row.department_name}: ${row.count}`);
    });

    // Verify HOD emails
    const [hodRows] = await connection.query(`
      SELECT u.full_name, u.email, u.employee_id, d.name as department_name
      FROM users u
      JOIN departments d ON u.department_id = d.id
      WHERE u.role_id = 2
      ORDER BY d.id
    `);
    console.log('\nHOD emails:');
    hodRows.forEach(row => {
      console.log(`${row.full_name} (${row.employee_id}): ${row.email} - ${row.department_name}`);
    });

    // Verify admin emails
    const [adminRows] = await connection.query(`
      SELECT u.full_name, u.email, u.employee_id, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.role_id IN (3, 4, 5)
      ORDER BY u.role_id
    `);
    console.log('\nAdmin emails:');
    adminRows.forEach(row => {
      console.log(`${row.full_name} (${row.employee_id}): ${row.email} - ${row.role_name}`);
    });

    console.log('\nVerification complete!');
  } catch (error) {
    console.error('Error verifying credentials:', error);
    process.exit(1);
  } finally {
    // Close connection if it was opened
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the verification function
verifyCredentials();
