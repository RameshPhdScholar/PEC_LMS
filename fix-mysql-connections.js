/**
 * Script to fix MySQL connection issues and test authentication
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Read .env.local file manually
function loadEnv() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';

        // Remove quotes if present
        if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
          value = value.replace(/^"|"$/g, '');
        }

        envVars[key] = value;
      }
    });

    return envVars;
  } catch (error) {
    console.error('Error loading .env.local file:', error);
    return {};
  }
}

const env = loadEnv();

async function fixConnectionsAndTest() {
  let connection;
  try {
    console.log('Attempting to connect to MySQL...');
    
    // Create a single connection instead of pool
    connection = await mysql.createConnection({
      host: env.DATABASE_HOST || 'localhost',
      port: parseInt(env.DATABASE_PORT || '3306'),
      database: env.DATABASE_NAME || 'leave_management',
      user: env.DATABASE_USER || 'root',
      password: env.DATABASE_PASSWORD || 'root',
      acquireTimeout: 60000,
      timeout: 60000
    });

    console.log('✅ Connected to MySQL successfully!');

    // Check current connections
    const [processlist] = await connection.query('SHOW PROCESSLIST');
    console.log(`Current active connections: ${processlist.length}`);

    // Kill idle connections (be careful with this)
    console.log('Checking for idle connections...');
    const [idleConnections] = await connection.query(`
      SELECT ID, USER, HOST, DB, COMMAND, TIME, STATE 
      FROM INFORMATION_SCHEMA.PROCESSLIST 
      WHERE COMMAND = 'Sleep' AND TIME > 300
    `);
    
    console.log(`Found ${idleConnections.length} idle connections (>5 minutes)`);

    // Test system users table
    console.log('\n--- Testing System Users ---');
    const [systemUsers] = await connection.query(`
      SELECT s.id, s.email, s.role_id, r.name as role_name, s.is_active
      FROM system_users s
      LEFT JOIN roles r ON s.role_id = r.id
      WHERE s.is_active = 1
      LIMIT 5
    `);
    
    console.log('System users found:');
    console.table(systemUsers);

    // Test regular users table
    console.log('\n--- Testing Regular Users ---');
    const [regularUsers] = await connection.query(`
      SELECT u.id, u.full_name, u.email, u.employee_id, u.role_id, r.name as role_name, u.is_active
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.is_active = 1
      LIMIT 5
    `);
    
    console.log('Regular users found:');
    console.table(regularUsers);

    // Test specific credentials
    console.log('\n--- Testing Specific Credentials ---');
    
    // Test superadmin
    const [superadmin] = await connection.query(`
      SELECT * FROM system_users WHERE email = 'superadmin@pallaviengineeringcollege.ac.in'
    `);
    
    if (superadmin.length > 0) {
      console.log('✅ Superadmin found in system_users');
      const isValidPassword = await bcrypt.compare('password123', superadmin[0].password);
      console.log(`Password validation: ${isValidPassword ? '✅ Valid' : '❌ Invalid'}`);
    } else {
      console.log('❌ Superadmin not found in system_users');
    }

    // Test admin
    const [admin] = await connection.query(`
      SELECT * FROM system_users WHERE email = 'admin@pallaviengineeringcollege.ac.in'
    `);
    
    if (admin.length > 0) {
      console.log('✅ Admin found in system_users');
      const isValidPassword = await bcrypt.compare('password123', admin[0].password);
      console.log(`Password validation: ${isValidPassword ? '✅ Valid' : '❌ Invalid'}`);
    } else {
      console.log('❌ Admin not found in system_users');
    }

    // Test a regular employee
    const [employee] = await connection.query(`
      SELECT * FROM users WHERE employee_id = 'CSE001' LIMIT 1
    `);
    
    if (employee.length > 0) {
      console.log('✅ Employee CSE001 found in users table');
      const isValidPassword = await bcrypt.compare('password123', employee[0].password);
      console.log(`Password validation: ${isValidPassword ? '✅ Valid' : '❌ Invalid'}`);
    } else {
      console.log('❌ Employee CSE001 not found in users table');
    }

    console.log('\n--- Connection Test Complete ---');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the test
fixConnectionsAndTest();
