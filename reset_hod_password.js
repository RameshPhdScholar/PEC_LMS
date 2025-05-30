/**
 * Script to reset the password for the CSE HOD user
 * 
 * This script will update the password for the CSE HOD user to 'password123'
 * 
 * Usage: node reset_hod_password.js
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

// Email to reset
const emailToReset = 'cse.hod@pallaviengineeringcollege.ac.in';
const newPassword = 'password123';

// Function to reset password
async function resetPassword() {
  let connection;
  try {
    // Create database connection
    console.log('Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('Connected to database.');

    // Check if user exists
    console.log(`Checking if user with email ${emailToReset} exists...`);
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [emailToReset]
    );

    if (users.length === 0) {
      console.error(`User with email ${emailToReset} not found in the database.`);
      await connection.end();
      return;
    }

    const user = users[0];
    console.log('User found:');
    console.log(`- ID: ${user.id}`);
    console.log(`- Name: ${user.full_name}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Employee ID: ${user.employee_id}`);

    // Generate new password hash
    console.log('\nGenerating new password hash...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(`New password hash: ${hashedPassword}`);

    // Update the password
    console.log('\nUpdating password...');
    await connection.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, user.id]
    );
    console.log('Password updated successfully!');

    // Verify the new password
    console.log('\nVerifying new password...');
    const [updatedUsers] = await connection.execute(
      'SELECT password FROM users WHERE id = ?',
      [user.id]
    );
    
    if (updatedUsers.length > 0) {
      const isPasswordValid = await bcrypt.compare(newPassword, updatedUsers[0].password);
      console.log(`New password verification: ${isPasswordValid ? 'Success' : 'Failed'}`);
    }

    await connection.end();
    console.log('\nDone. You can now log in with:');
    console.log(`Email: ${emailToReset}`);
    console.log(`Password: ${newPassword}`);
  } catch (error) {
    console.error('Error:', error);
    if (connection) {
      await connection.end();
    }
  }
}

// Run the password reset
resetPassword();
