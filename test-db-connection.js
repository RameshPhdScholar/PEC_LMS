// Simple script to test database connection
const mysql = require('mysql2/promise');
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

async function testConnection() {
  try {
    console.log('Attempting to connect to the database...');
    console.log('Database config:', {
      host: env.DATABASE_HOST,
      port: env.DATABASE_PORT,
      database: env.DATABASE_NAME,
      user: env.DATABASE_USER,
      // Not logging password for security
    });

    const connection = await mysql.createConnection({
      host: env.DATABASE_HOST,
      port: parseInt(env.DATABASE_PORT || '3306'),
      database: env.DATABASE_NAME,
      user: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD
    });

    console.log('Successfully connected to the database!');

    // Test a simple query
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM roles');
    console.log('Number of roles in the database:', rows[0].count);

    await connection.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

testConnection();
