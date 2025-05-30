/**
 * Script to update emails for HODs and administrative users
 *
 * Usage: node src/db/update_emails.js
 */

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function updateEmails() {
  let connection;
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'leave_management'
    });

    console.log('Connected to database. Updating emails...');

    // Get all HODs
    const [hods] = await connection.query(
      'SELECT id, full_name, email, department_id FROM users WHERE role_id = 2'
    );

    console.log(`Found ${hods.length} HODs in the database`);

    // Define department codes
    const departmentCodes = {
      1: 'cse', // CSE
      2: 'csd', // CSD
      3: 'csc', // CSC
      4: 'csm', // CSM
      5: 'ce',  // CE
      6: 'eee', // EEE
      7: 'ece', // ECE
      8: 'has', // H&S (Humanities and Sciences)
      9: 'mba'  // MBA
    };

    // Update each HOD individually
    for (const hod of hods) {
      const deptCode = departmentCodes[hod.department_id];
      if (!deptCode) {
        console.log(`Skipping HOD ${hod.full_name} - unknown department ID: ${hod.department_id}`);
        continue;
      }

      const newEmail = `${deptCode}.hod@pallaviengineeringcollege.ac.in`;

      // Skip if email is already correct
      if (hod.email === newEmail) {
        console.log(`HOD ${hod.full_name} already has correct email: ${newEmail}`);
        continue;
      }

      try {
        await connection.query(
          'UPDATE users SET email = ? WHERE id = ?',
          [newEmail, hod.id]
        );
        console.log(`Updated HOD ${hod.full_name} email from ${hod.email} to ${newEmail}`);
      } catch (err) {
        console.error(`Failed to update HOD ${hod.full_name}: ${err.message}`);
      }
    }

    // Get all system users
    const [admins] = await connection.query(
      'SELECT id, full_name, email, role_id FROM users WHERE role_id IN (3, 4, 5)'
    );

    console.log(`Found ${admins.length} system users in the database`);

    // Define system user emails
    const adminEmails = {
      3: 'principal@pallaviengineeringcollege.ac.in', // Principal
      4: 'admin@pallaviengineeringcollege.ac.in',     // Admin
      5: 'superadmin@pallaviengineeringcollege.ac.in' // Super Admin
    };

    // Update each system user individually
    for (const admin of admins) {
      const newEmail = adminEmails[admin.role_id];
      if (!newEmail) {
        console.log(`Skipping system user ${admin.full_name} - unknown role ID: ${admin.role_id}`);
        continue;
      }

      // Skip if email is already correct
      if (admin.email === newEmail) {
        console.log(`System user ${admin.full_name} already has correct email: ${newEmail}`);
        continue;
      }

      try {
        await connection.query(
          'UPDATE users SET email = ? WHERE id = ?',
          [newEmail, admin.id]
        );
        console.log(`Updated system user ${admin.full_name} email from ${admin.email} to ${newEmail}`);
      } catch (err) {
        console.error(`Failed to update system user ${admin.full_name}: ${err.message}`);
      }
    }

    console.log('Email updates complete!');
  } catch (error) {
    console.error('Error updating emails:', error);
    process.exit(1);
  } finally {
    // Close connection if it was opened
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the update function
updateEmails();
