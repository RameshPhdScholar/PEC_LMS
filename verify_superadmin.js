/**
 * Script to verify superadmin credentials in both tables
 *
 * This script will:
 * 1. Check if superadmin exists in system_users table
 * 2. Check if superadmin exists in users table
 * 3. Verify the password hash in both tables
 * 4. Fix any issues found
 *
 * Usage: node verify_superadmin.js
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

// Superadmin email and password
const superadminEmail = 'superadmin@pallaviengineeringcollege.ac.in';
const correctPassword = 'password123';

// Function to verify and fix superadmin credentials
async function verifySuperadmin() {
  let connection;
  try {
    // Create database connection
    console.log('Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('Connected to database.');

    // Generate correct password hash
    console.log('Generating correct password hash...');
    const correctHash = await bcrypt.hash(correctPassword, 10);
    console.log(`Correct password hash: ${correctHash}`);

    // Check system_users table
    console.log('\nChecking system_users table...');
    const [adminUsers] = await connection.execute(
      'SELECT * FROM system_users WHERE email = ?',
      [superadminEmail]
    );

    if (adminUsers.length === 0) {
      console.log('Superadmin not found in system_users table. Creating...');
      await connection.execute(
        'INSERT INTO system_users (email, password, role_id, is_active) VALUES (?, ?, 5, 1)',
        [superadminEmail, correctHash]
      );
      console.log('Superadmin created in system_users table.');
    } else {
      const adminUser = adminUsers[0];
      console.log(`Found superadmin in system_users table (ID: ${adminUser.id})`);

      // Test password
      try {
        const isAdminPasswordValid = await bcrypt.compare(correctPassword, adminUser.password);
        console.log(`Admin password valid: ${isAdminPasswordValid}`);

        if (!isAdminPasswordValid) {
          console.log('Updating superadmin password in system_users table...');
          await connection.execute(
            'UPDATE system_users SET password = ? WHERE id = ?',
            [correctHash, adminUser.id]
          );
          console.log('Superadmin password updated in system_users table.');
        }
      } catch (error) {
        console.log('Error comparing admin password, updating to new hash...');
        await connection.execute(
          'UPDATE system_users SET password = ? WHERE id = ?',
          [correctHash, adminUser.id]
        );
        console.log('Superadmin password updated in system_users table due to hash error.');
      }

      // Make sure is_active is set to 1
      if (adminUser.is_active !== 1) {
        console.log('Activating superadmin account in system_users table...');
        await connection.execute(
          'UPDATE system_users SET is_active = 1 WHERE id = ?',
          [adminUser.id]
        );
        console.log('Superadmin account activated in system_users table.');
      }
    }

    // Check users table
    console.log('\nChecking users table...');
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [superadminEmail]
    );

    if (users.length === 0) {
      console.log('Superadmin not found in users table. Creating...');
      await connection.execute(
        `INSERT INTO users (
          full_name, email, phone_number, gender, department_id,
          employee_id, employee_position, joining_date, password, role_id, is_active
        ) VALUES (
          'Super Admin', ?, '9876543002', 'Male', 10,
          'ADM002', 'Super Admin', '2023-01-01', ?, 5, 1
        )`,
        [superadminEmail, correctHash]
      );
      console.log('Superadmin created in users table.');
    } else {
      const user = users[0];
      console.log(`Found superadmin in users table (ID: ${user.id})`);

      // Test password
      try {
        const isUserPasswordValid = await bcrypt.compare(correctPassword, user.password);
        console.log(`User password valid: ${isUserPasswordValid}`);

        if (!isUserPasswordValid) {
          console.log('Updating superadmin password in users table...');
          await connection.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [correctHash, user.id]
          );
          console.log('Superadmin password updated in users table.');
        }
      } catch (error) {
        console.log('Error comparing user password, updating to new hash...');
        await connection.execute(
          'UPDATE users SET password = ? WHERE id = ?',
          [correctHash, user.id]
        );
        console.log('Superadmin password updated in users table due to hash error.');
      }

      // Make sure is_active is set to 1
      if (user.is_active !== 1) {
        console.log('Activating superadmin account in users table...');
        await connection.execute(
          'UPDATE users SET is_active = 1 WHERE id = ?',
          [user.id]
        );
        console.log('Superadmin account activated in users table.');
      }
    }

    console.log('\nVerification and fixes completed!');
    console.log(`Superadmin should now be able to log in with:`);
    console.log(`Email: ${superadminEmail}`);
    console.log(`Password: ${correctPassword}`);

  } catch (error) {
    console.error('Error verifying superadmin credentials:', error);
  } finally {
    // Close connection if it was opened
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the function
verifySuperadmin();
