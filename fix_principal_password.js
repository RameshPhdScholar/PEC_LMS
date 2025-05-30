/**
 * Script to fix the principal's password in the database
 * 
 * Usage: node fix_principal_password.js
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configuration
const config = {
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: process.env.DATABASE_NAME || 'leave_management'
};

// Principal email
const principalEmail = 'principal@pallaviengineeringcollege.ac.in';
const passwordToSet = 'password123';

// Function to fix principal's password
async function fixPrincipalPassword() {
  let connection;
  try {
    // Create database connection
    console.log('Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('Connected to database.');

    // Check if principal exists
    console.log(`Checking if principal with email ${principalEmail} exists...`);
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [principalEmail]
    );

    if (users.length === 0) {
      console.error(`Principal with email ${principalEmail} not found in the database.`);
      return;
    }

    const user = users[0];
    console.log(`Found principal: ${user.full_name} (ID: ${user.id})`);

    // Generate new password hash
    console.log('Generating new password hash...');
    const hashedPassword = await bcrypt.hash(passwordToSet, 10);
    console.log(`New password hash: ${hashedPassword}`);

    // Update principal's password
    console.log('Updating principal password...');
    await connection.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, user.id]
    );

    console.log('Principal password updated successfully!');
    console.log(`Principal can now log in with email ${principalEmail} and password "${passwordToSet}"`);

  } catch (error) {
    console.error('Error fixing principal password:', error);
  } finally {
    // Close connection if it was opened
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the function
fixPrincipalPassword();
