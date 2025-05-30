/**
 * Script to verify login credentials in the database
 * 
 * This script will:
 * 1. Check if the user with the specified email exists
 * 2. Verify the password hash
 * 3. Optionally update the password if needed
 * 
 * Usage: node verify_login.js
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

// Email to check
const emailToCheck = 'cse.hod@pallaviengineeringcollege.ac.in';
const passwordToCheck = 'password123';
const correctHash = '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a';

// Function to verify login
async function verifyLogin() {
  let connection;
  try {
    // Create database connection
    console.log('Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('Connected to database.');

    // Check if user exists
    console.log(`Checking if user with email ${emailToCheck} exists...`);
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [emailToCheck]
    );

    if (users.length === 0) {
      console.error(`User with email ${emailToCheck} not found in the database.`);
      return;
    }

    const user = users[0];
    console.log('User found:');
    console.log(`- ID: ${user.id}`);
    console.log(`- Name: ${user.full_name}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Employee ID: ${user.employee_id}`);
    console.log(`- Role ID: ${user.role_id}`);
    console.log(`- Password Hash: ${user.password}`);

    // Verify password hash
    console.log('\nVerifying password hash...');
    const isPasswordValid = await bcrypt.compare(passwordToCheck, user.password);
    console.log(`Password '${passwordToCheck}' is ${isPasswordValid ? 'valid' : 'invalid'} for this user.`);

    // Check if the hash matches the expected hash
    console.log('\nComparing with expected hash...');
    console.log(`User hash:     ${user.password}`);
    console.log(`Expected hash: ${correctHash}`);
    console.log(`Hashes ${user.password === correctHash ? 'match' : 'do not match'}.`);

    // If password is invalid, offer to update it
    if (!isPasswordValid) {
      console.log('\nWould you like to update the password to the correct hash? (y/n)');
      process.stdin.once('data', async (data) => {
        const answer = data.toString().trim().toLowerCase();
        if (answer === 'y' || answer === 'yes') {
          try {
            await connection.execute(
              'UPDATE users SET password = ? WHERE id = ?',
              [correctHash, user.id]
            );
            console.log('Password updated successfully!');
          } catch (error) {
            console.error('Error updating password:', error);
          } finally {
            await connection.end();
            process.exit(0);
          }
        } else {
          console.log('Password not updated.');
          await connection.end();
          process.exit(0);
        }
      });
    } else {
      await connection.end();
    }
  } catch (error) {
    console.error('Error:', error);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

// Run the verification
verifyLogin();
