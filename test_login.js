/**
 * Script to test the login process directly
 *
 * This script will:
 * 1. Connect to the database
 * 2. Retrieve the superadmin user from both tables
 * 3. Test password validation
 * 4. Simulate the NextAuth login process
 *
 * Usage: node test_login.js
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

// Superadmin credentials
const email = 'superadmin@pallaviengineeringcollege.ac.in';
const password = 'password123';

// Function to test login
async function testLogin() {
  let connection;
  try {
    // Create database connection
    console.log('Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('Connected to database.');

    // Step 1: Check system_users table (this is checked first in the actual login process)
    console.log('\n--- Testing system_users table ---');
    const systemQuery = `
      SELECT s.*, r.name as role_name
      FROM system_users s
      LEFT JOIN roles r ON s.role_id = r.id
      WHERE s.email = ? AND s.is_active = 1
    `;

    const [systemUsers] = await connection.execute(systemQuery, [email]);

    if (systemUsers.length === 0) {
      console.log('No system user found with this email in system_users table.');
    } else {
      const systemUser = systemUsers[0];
      console.log(`Found system user: ID ${systemUser.id}, Role: ${systemUser.role_name}`);

      // Test password
      try {
        const isPasswordValid = await bcrypt.compare(password, systemUser.password);
        console.log(`Password validation result: ${isPasswordValid ? 'VALID' : 'INVALID'}`);

        if (isPasswordValid) {
          console.log('System user login would SUCCEED.');
        } else {
          console.log('System user login would FAIL due to invalid password.');

          // Debug password hash
          console.log(`\nPassword hash in database: ${systemUser.password}`);
          const newHash = await bcrypt.hash(password, 10);
          console.log(`New hash for '${password}': ${newHash}`);
        }
      } catch (error) {
        console.error('Error comparing password:', error);
      }
    }

    // Step 2: Check users table (this is checked second in the actual login process)
    console.log('\n--- Testing users table ---');
    const userQuery = `
      SELECT u.*, r.name as role_name, d.name as department_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.email = ? AND u.is_active = 1
    `;

    const [users] = await connection.execute(userQuery, [email]);

    if (users.length === 0) {
      console.log('No user found with this email in users table.');
    } else {
      const user = users[0];
      console.log(`Found user: ID ${user.id}, Name: ${user.full_name}, Role: ${user.role_name}, Department: ${user.department_name}`);

      // Test password
      try {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(`Password validation result: ${isPasswordValid ? 'VALID' : 'INVALID'}`);

        if (isPasswordValid) {
          console.log('Regular user login would SUCCEED.');
        } else {
          console.log('Regular user login would FAIL due to invalid password.');

          // Debug password hash
          console.log(`\nPassword hash in database: ${user.password}`);
          const newHash = await bcrypt.hash(password, 10);
          console.log(`New hash for '${password}': ${newHash}`);
        }
      } catch (error) {
        console.error('Error comparing password:', error);
      }
    }

    // Step 3: Check NextAuth configuration
    console.log('\n--- Testing NextAuth Configuration ---');
    console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`);
    console.log(`NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set'}`);
    console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);

    // Summary
    console.log('\n--- Login Test Summary ---');
    if ((systemUsers.length > 0 && await bcrypt.compare(password, systemUsers[0].password)) ||
        (users.length > 0 && await bcrypt.compare(password, users[0].password))) {
      console.log('✅ Login should SUCCEED with the provided credentials.');
    } else {
      console.log('❌ Login would FAIL with the provided credentials.');
    }

  } catch (error) {
    console.error('Error testing login:', error);
  } finally {
    // Close connection if it was opened
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed.');
    }
  }
}

// Run the function
testLogin();
