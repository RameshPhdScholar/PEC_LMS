/**
 * Script to check and fix administrative users' passwords in the database
 *
 * Usage: node check_admin_passwords.js
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

// System users to check
const adminUsers = [
  { email: 'principal@pallaviengineeringcollege.ac.in', role: 'Principal' },
  { email: 'admin@pallaviengineeringcollege.ac.in', role: 'Admin' },
  { email: 'superadmin@pallaviengineeringcollege.ac.in', role: 'Super Admin' }
];

const passwordToSet = 'password123';

// Function to check and fix system user passwords
async function checkSystemUserPasswords() {
  let connection;
  try {
    // Create database connection
    console.log('Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('Connected to database.');

    // Generate new password hash
    console.log('Generating new password hash...');
    const hashedPassword = await bcrypt.hash(passwordToSet, 10);
    console.log(`New password hash: ${hashedPassword}`);

    // Check each system user
    for (const admin of adminUsers) {
      console.log(`\nChecking ${admin.role} with email ${admin.email}...`);

      // Check if user exists
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [admin.email]
      );

      if (users.length === 0) {
        console.error(`${admin.role} with email ${admin.email} not found in the database.`);
        continue;
      }

      const user = users[0];
      console.log(`Found ${admin.role}: ${user.full_name} (ID: ${user.id})`);

      // Update user's password
      console.log(`Updating ${admin.role} password...`);
      await connection.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, user.id]
      );

      console.log(`${admin.role} password updated successfully!`);
      console.log(`${admin.role} can now log in with email ${admin.email} and password "${passwordToSet}"`);
    }

    console.log('\nAll system user passwords have been updated successfully!');

  } catch (error) {
    console.error('Error checking/fixing system user passwords:', error);
  } finally {
    // Close connection if it was opened
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the function
checkSystemUserPasswords();
