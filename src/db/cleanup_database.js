/**
 * Script to clean up the database by removing duplicate HODs and system users
 *
 * Usage: node src/db/cleanup_database.js
 */

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function cleanupDatabase() {
  let connection;
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'leave_management'
    });

    console.log('Connected to database. Cleaning up...');

    // Get all HODs grouped by department
    const [hodsByDept] = await connection.query(`
      SELECT department_id, COUNT(*) as count, GROUP_CONCAT(id) as ids, GROUP_CONCAT(full_name) as names
      FROM users
      WHERE role_id = 2
      GROUP BY department_id
      HAVING COUNT(*) > 1
    `);

    console.log(`Found ${hodsByDept.length} departments with multiple HODs`);

    // Keep only one HOD per department (the one with the correct email)
    for (const dept of hodsByDept) {
      const [hods] = await connection.query(`
        SELECT id, full_name, email, employee_id
        FROM users
        WHERE department_id = ? AND role_id = 2
      `, [dept.department_id]);

      console.log(`Department ${dept.department_id} has ${hods.length} HODs: ${hods.map(h => h.full_name).join(', ')}`);

      // Find the HOD with the correct email format
      const deptCodes = {
        1: 'cse', 2: 'csd', 3: 'csc', 4: 'csm', 5: 'ce', 6: 'eee', 7: 'ece', 8: 'has', 9: 'mba'
      };
      const correctEmail = `${deptCodes[dept.department_id]}.hod@pallaviengineeringcollege.ac.in`;

      const correctHod = hods.find(h => h.email === correctEmail);
      if (correctHod) {
        // Keep this HOD, change others to regular employees
        for (const hod of hods) {
          if (hod.id !== correctHod.id) {
            await connection.query(`
              UPDATE users SET role_id = 1 WHERE id = ?
            `, [hod.id]);
            console.log(`Changed ${hod.full_name} (${hod.employee_id}) from HOD to Employee`);
          }
        }
      } else {
        // No HOD has the correct email, keep the first one and update its email
        const keepHod = hods[0];
        await connection.query(`
          UPDATE users SET email = ? WHERE id = ?
        `, [correctEmail, keepHod.id]);
        console.log(`Updated ${keepHod.full_name} (${keepHod.employee_id}) email to ${correctEmail}`);

        // Change others to regular employees
        for (let i = 1; i < hods.length; i++) {
          await connection.query(`
            UPDATE users SET role_id = 1 WHERE id = ?
          `, [hods[i].id]);
          console.log(`Changed ${hods[i].full_name} (${hods[i].employee_id}) from HOD to Employee`);
        }
      }
    }

    // Get all system users grouped by role
    const [adminsByRole] = await connection.query(`
      SELECT role_id, COUNT(*) as count, GROUP_CONCAT(id) as ids, GROUP_CONCAT(full_name) as names
      FROM users
      WHERE role_id IN (3, 4, 5)
      GROUP BY role_id
      HAVING COUNT(*) > 1
    `);

    console.log(`Found ${adminsByRole.length} system user roles with multiple users`);

    // Keep only one system user per role (the one with the correct email)
    for (const role of adminsByRole) {
      const [admins] = await connection.query(`
        SELECT id, full_name, email, employee_id
        FROM users
        WHERE role_id = ?
      `, [role.role_id]);

      console.log(`Role ${role.role_id} has ${admins.length} users: ${admins.map(a => a.full_name).join(', ')}`);

      // Find the system user with the correct email format
      const adminEmails = {
        3: 'principal@pallaviengineeringcollege.ac.in',
        4: 'admin@pallaviengineeringcollege.ac.in',
        5: 'superadmin@pallaviengineeringcollege.ac.in'
      };
      const correctEmail = adminEmails[role.role_id];

      const correctAdmin = admins.find(a => a.email === correctEmail);
      if (correctAdmin) {
        // Keep this system user, delete others
        for (const admin of admins) {
          if (admin.id !== correctAdmin.id) {
            await connection.query(`
              DELETE FROM users WHERE id = ?
            `, [admin.id]);
            console.log(`Deleted duplicate system user ${admin.full_name} (${admin.employee_id})`);
          }
        }
      } else {
        // No system user has the correct email, keep the first one and update its email
        const keepAdmin = admins[0];
        await connection.query(`
          UPDATE users SET email = ? WHERE id = ?
        `, [correctEmail, keepAdmin.id]);
        console.log(`Updated ${keepAdmin.full_name} (${keepAdmin.employee_id}) email to ${correctEmail}`);

        // Delete others
        for (let i = 1; i < admins.length; i++) {
          await connection.query(`
            DELETE FROM users WHERE id = ?
          `, [admins[i].id]);
          console.log(`Deleted duplicate system user ${admins[i].full_name} (${admins[i].employee_id})`);
        }
      }
    }

    console.log('Database cleanup complete!');
  } catch (error) {
    console.error('Error cleaning up database:', error);
    process.exit(1);
  } finally {
    // Close connection if it was opened
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the cleanup function
cleanupDatabase();
