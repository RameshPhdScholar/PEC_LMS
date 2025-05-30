/**
 * Script to update the AIML department name in the database
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateAIMLDepartment() {
  let connection;
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'leave_management'
    });

    console.log('Connected to database. Updating AIML department name...');

    // Get current department name
    const [beforeUpdate] = await connection.query(`
      SELECT id, name FROM departments WHERE id = 4
    `);
    
    console.log('Current AIML department name:');
    console.table(beforeUpdate);

    // Update department name
    await connection.query(`
      UPDATE departments SET name = 'Computer Science and Engineering – AIML' WHERE id = 4;
    `);
    
    // Verify the update
    const [afterUpdate] = await connection.query(`
      SELECT id, name FROM departments WHERE id = 4
    `);
    
    console.log('Updated AIML department name:');
    console.table(afterUpdate);

    console.log('AIML department name updated successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

updateAIMLDepartment();
