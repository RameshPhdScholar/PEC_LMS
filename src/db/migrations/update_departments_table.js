/**
 * Migration script to update the departments table structure
 * - Adds a code column to the departments table
 * - Updates the existing departments with the required names and codes
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  console.log('Starting departments table migration...');

  // Create connection
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'leave_management',
  });

  try {
    // Check if code column exists
    const [columns] = await connection.execute(`
      SHOW COLUMNS FROM departments LIKE 'code'
    `);

    // Add code column if it doesn't exist
    if (columns.length === 0) {
      console.log('Adding code column to departments table...');
      await connection.execute(`
        ALTER TABLE departments ADD COLUMN code VARCHAR(10) AFTER name
      `);
    }

    // Define departments data
    const departments = [
      { id: 1, code: 'CSE', name: 'Computer Science and Engineering' },
      { id: 2, code: 'CSD', name: 'Computer Science and Engineering – Data Science' },
      { id: 3, code: 'CSC', name: 'Computer Science and Engineering – Cyber Security' },
      { id: 4, code: 'CSM', name: 'Computer Science and Engineering – Artificial Intelligence & Machine Learning' },
      { id: 5, code: 'CE', name: 'Civil Engineering' },
      { id: 6, code: 'EEE', name: 'Electrical and Electronics Engineering' },
      { id: 7, code: 'ECE', name: 'Electronics and Communication Engineering' },
      { id: 8, code: 'H&S', name: 'Humanities and Sciences (H&S)' },
      { id: 9, code: 'MBA', name: 'Master of Business Administration (MBA)' },
      { id: 10, code: 'Admin', name: 'Administration' }
    ];

    // Get existing departments
    const [existingDepartments] = await connection.execute('SELECT id FROM departments ORDER BY id');

    console.log('Updating existing departments...');

    // Update existing departments
    for (let i = 0; i < departments.length; i++) {
      const dept = departments[i];

      if (i < existingDepartments.length) {
        // Update existing department
        const deptId = existingDepartments[i].id;
        await connection.execute(
          'UPDATE departments SET code = ?, name = ? WHERE id = ?',
          [dept.code, dept.name, deptId]
        );
        console.log(`Updated department ID ${deptId}: ${dept.name} (${dept.code})`);
      } else {
        // Insert new department
        await connection.execute(
          'INSERT INTO departments (id, code, name) VALUES (?, ?, ?)',
          [dept.id, dept.code, dept.name]
        );
        console.log(`Added new department: ${dept.name} (${dept.code})`);
      }
    }

    console.log('Departments table migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
