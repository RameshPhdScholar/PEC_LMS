/**
 * Script to import credentials into the database
 *
 * Usage: node src/db/import_credentials.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function importCredentials() {
  let connection;
  try {
    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'real_credentials_data.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'leave_management',
      multipleStatements: true // Important for executing multiple SQL statements
    });

    console.log('Connected to database. Importing credentials...');

    // Execute SQL statements
    try {
      await connection.query(sqlContent);
      console.log('Credentials imported successfully!');
    } catch (sqlError) {
      // If there's a duplicate entry error, it's not critical since we're using INSERT IGNORE
      if (sqlError.code === 'ER_DUP_ENTRY') {
        console.log('Some users already exist in the database. Only new users were added.');
      } else {
        throw sqlError;
      }
    }

  } catch (error) {
    console.error('Error importing credentials:', error);
    process.exit(1);
  } finally {
    // Close connection if it was opened
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the import function
importCredentials();
