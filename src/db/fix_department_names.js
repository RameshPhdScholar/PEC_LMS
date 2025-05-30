/**
 * Script to fix department names in the database
 * This script updates the department names with correct encoding for special characters
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDepartmentNames() {
  let connection;
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'leave_management'
    });

    console.log('Connected to database. Fixing department names...');

    // Get current departments
    const [beforeUpdate] = await connection.query(`
      SELECT id, name FROM departments ORDER BY id
    `);
    
    console.log('Current department names:');
    console.table(beforeUpdate);

    // Update department names with correct encoding
    await connection.query(`
      UPDATE departments SET name = 'Computer Science and Engineering – Data Science' WHERE id = 2;
    `);
    
    await connection.query(`
      UPDATE departments SET name = 'Computer Science and Engineering – Cyber Security' WHERE id = 3;
    `);
    
    await connection.query(`
      UPDATE departments SET name = 'Computer Science and Engineering – Artificial Intelligence & Machine Learning' WHERE id = 4;
    `);

    // Verify the updates
    const [afterUpdate] = await connection.query(`
      SELECT id, name FROM departments ORDER BY id
    `);
    
    console.log('Updated department names:');
    console.table(afterUpdate);

    console.log('Department names updated successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

fixDepartmentNames();
