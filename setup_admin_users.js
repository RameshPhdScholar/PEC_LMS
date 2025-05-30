/**
 * Script to set up system users table
 *
 * This script will:
 * 1. Check if system_users table exists
 * 2. Create it if it doesn't exist
 * 3. Insert or update the default system users
 *
 * Usage: node setup_admin_users.js
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

// System users to set up
const adminUsers = [
  { email: 'superadmin@pallaviengineeringcollege.ac.in', role_id: 5, role: 'Super Admin' },
  { email: 'admin@pallaviengineeringcollege.ac.in', role_id: 4, role: 'Admin' },
  { email: 'principal@pallaviengineeringcollege.ac.in', role_id: 3, role: 'Principal' },
  { email: 'cse.hod@pallaviengineeringcollege.ac.in', role_id: 2, role: 'HOD' },
  { email: 'eee.hod@pallaviengineeringcollege.ac.in', role_id: 2, role: 'HOD' },
  { email: 'ece.hod@pallaviengineeringcollege.ac.in', role_id: 2, role: 'HOD' },
  { email: 'ce.hod@pallaviengineeringcollege.ac.in', role_id: 2, role: 'HOD' },
  { email: 'csd.hod@pallaviengineeringcollege.ac.in', role_id: 2, role: 'HOD' },
  { email: 'csc.hod@pallaviengineeringcollege.ac.in', role_id: 2, role: 'HOD' },
  { email: 'csm.hod@pallaviengineeringcollege.ac.in', role_id: 2, role: 'HOD' },
  { email: 'has.hod@pallaviengineeringcollege.ac.in', role_id: 2, role: 'HOD' },
  { email: 'mba.hod@pallaviengineeringcollege.ac.in', role_id: 2, role: 'HOD' },
  { email: 'admin.hod@pallaviengineeringcollege.ac.in', role_id: 2, role: 'HOD' }
];

const passwordToSet = 'password123';

// Function to set up system users
async function setupAdminUsers() {
  let connection;
  try {
    // Create database connection
    console.log('Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('Connected to database.');

    // Check if system_users table exists
    console.log('Checking if system_users table exists...');
    const [tables] = await connection.execute(`
      SHOW TABLES LIKE 'system_users'
    `);

    if (tables.length === 0) {
      console.log('Creating system_users table...');
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS system_users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role_id INT NOT NULL,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (role_id) REFERENCES roles(id)
        )
      `);
      console.log('system_users table created successfully!');
    } else {
      console.log('system_users table already exists.');
    }

    // Generate password hash
    console.log('Generating password hash...');
    const hashedPassword = await bcrypt.hash(passwordToSet, 10);
    console.log(`Password hash: ${hashedPassword}`);

    // Insert or update system users
    for (const user of adminUsers) {
      console.log(`\nProcessing ${user.role} with email ${user.email}...`);

      // Check if user already exists
      const [existingUsers] = await connection.execute(
        'SELECT id FROM system_users WHERE email = ?',
        [user.email]
      );

      if (existingUsers.length > 0) {
        // Update existing user
        console.log(`Updating existing ${user.role}...`);
        await connection.execute(
          'UPDATE system_users SET password = ?, role_id = ?, is_active = TRUE WHERE email = ?',
          [hashedPassword, user.role_id, user.email]
        );
        console.log(`${user.role} updated successfully!`);
      } else {
        // Insert new user
        console.log(`Creating new ${user.role}...`);
        await connection.execute(
          'INSERT INTO system_users (email, password, role_id) VALUES (?, ?, ?)',
          [user.email, hashedPassword, user.role_id]
        );
        console.log(`${user.role} created successfully!`);
      }
    }

    console.log('\nAll system users have been set up successfully!');
    console.log(`All system users can now log in with their respective emails and password "${passwordToSet}"`);

  } catch (error) {
    console.error('Error setting up system users:', error);
  } finally {
    // Close connection if it was opened
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the function
setupAdminUsers();
