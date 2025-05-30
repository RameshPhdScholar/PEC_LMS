/**
 * Script to check the current structure of the departments table
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  console.log('Checking departments table structure...');
  
  // Create connection
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'leave_management',
  });

  try {
    // Get table structure
    const [columns] = await connection.execute(`
      SHOW COLUMNS FROM departments
    `);
    
    console.log('Departments table columns:');
    columns.forEach(column => {
      console.log(`- ${column.Field} (${column.Type})`);
    });
    
    // Get current data
    const [rows] = await connection.execute('SELECT * FROM departments');
    
    console.log('\nCurrent departments data:');
    rows.forEach(row => {
      console.log(row);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
