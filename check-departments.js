/**
 * Script to check department names in the database
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDepartments() {
  let connection;
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'leave_management'
    });

    console.log('Connected to database. Checking departments...');

    // Get all departments
    const [departments] = await connection.query(`
      SELECT id, name FROM departments ORDER BY id
    `);

    console.log('Current departments in the database:');
    console.table(departments);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

checkDepartments();
