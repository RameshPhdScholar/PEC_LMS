/**
 * Script to convert HTML employee data to SQL statements
 *
 * Usage: node src/db/html_to_sql.js
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Department ID mapping
const DEPARTMENT_IDS = {
  'Computer Science and Engineering': 1,
  'Computer Science and Engineering – Data Science': 2,
  'Computer Science and Engineering – Cyber Security': 3,
  'Computer Science and Engineering – Artificial Intelligence & Machine Learning': 4,
  'Civil Engineering': 5,
  'Electrical and Electronics Engineering': 6,
  'Electronics and Communication Engineering': 7,
  'Humanities and Sciences (H&S)': 8,
  'Master of Business Administration (MBA)': 9,
  'Administration': 10
};

// Role ID mapping
const ROLE_IDS = {
  'Employee': 1,
  'HOD': 2,
  'Principal': 3,
  'Admin': 4,
  'Super Admin': 5
};

// Function to generate a random phone number
function generatePhoneNumber() {
  return '98765' + Math.floor(10000 + Math.random() * 90000);
}

// Function to generate email address
function generateEmail(name, employeeId, role, department) {
  // For HODs, use department code
  if (role === 'HOD') {
    const deptCode = employeeId.substring(0, employeeId.indexOf('0')).toLowerCase();
    return `${deptCode}.hod@pallaviengineeringcollege.ac.in`;
  }

  // For Principal
  if (role === 'Principal') {
    return 'principal@pallaviengineeringcollege.ac.in';
  }

  // For Admin and Super Admin
  if (role === 'Admin') {
    return 'admin@pallaviengineeringcollege.ac.in';
  }

  if (role === 'Super Admin') {
    return 'superadmin@pallaviengineeringcollege.ac.in';
  }

  // For regular employees, use a standard format
  const nameParts = name.toLowerCase().split(' ');
  return `${nameParts[0]}.${nameParts[nameParts.length - 1]}@example.com`;
}

// Function to parse the HTML and extract employee data
async function parseEmployeeData() {
  try {
    // Read the HTML file
    const htmlPath = path.join(__dirname, 'real_credentials.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Parse the HTML
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    // Initialize arrays to store employee data
    const employees = [];
    const processedIds = new Set(); // Track processed employee IDs to avoid duplicates

    // Extract system users
    const systemHeading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Administrative Users') || h.textContent.includes('System Users'));
    const systemTable = systemHeading ? systemHeading.nextElementSibling : null;
    if (systemTable && systemTable.tagName === 'TABLE') {
      const rows = systemTable.querySelectorAll('tr');

      // Skip the header row
      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('td');

        if (cells.length >= 7) {
          const name = cells[0].textContent.trim();
          const email = cells[1].textContent.trim();
          const employeeId = cells[2].textContent.trim();
          const position = cells[3].textContent.trim();
          const role = cells[4].textContent.trim();
          const department = cells[5].textContent.trim();

          // Skip if we've already processed this employee ID
          if (processedIds.has(employeeId)) {
            continue;
          }

          // Determine role ID
          let roleId = 1; // Default to Employee
          if (role.includes('HOD')) {
            roleId = 2;
          } else if (role.includes('Principal')) {
            roleId = 3;
          } else if (role.includes('Admin') && !role.includes('Super')) {
            roleId = 4;
          } else if (role.includes('Super Admin')) {
            roleId = 5;
          }

          // Determine department ID
          let departmentId = 10; // Default to Administration
          for (const [deptName, deptId] of Object.entries(DEPARTMENT_IDS)) {
            if (department.includes(deptName)) {
              departmentId = deptId;
              break;
            }
          }

          // Special case for Principal
          if (roleId === 3) {
            departmentId = 10; // Principal belongs to Administration
          }

          employees.push({
            full_name: name,
            email: email,
            phone_number: generatePhoneNumber(),
            gender: name.includes('Dr.') ? 'Male' : (name.includes('Mrs.') ? 'Female' : 'Male'),
            department_id: departmentId,
            employee_id: employeeId,
            employee_position: position,
            joining_date: '2023-01-01',
            role_id: roleId
          });

          // Mark this ID as processed
          processedIds.add(employeeId);
        }
      }
    }

    // Extract department employees
    const departmentHeadings = document.querySelectorAll('h2');

    for (const heading of departmentHeadings) {
      // Skip the System Users heading
      if (heading.textContent.includes('Administrative Users') || heading.textContent.includes('System Users')) {
        continue;
      }

      const departmentName = heading.textContent.trim();
      let departmentId = 1; // Default to CSE

      // Find the matching department ID
      for (const [deptName, deptId] of Object.entries(DEPARTMENT_IDS)) {
        if (departmentName.includes(deptName)) {
          departmentId = deptId;
          break;
        }
      }

      // Get the table following this heading
      const table = heading.nextElementSibling;
      if (table && table.tagName === 'TABLE') {
        const rows = table.querySelectorAll('tr');

        // Skip the header row
        for (let i = 1; i < rows.length; i++) {
          const cells = rows[i].querySelectorAll('td');

          if (cells.length >= 6) {
            const name = cells[1].textContent.trim();
            const employeeId = cells[cells.length - 2].textContent.trim();

            // Skip if we've already processed this employee ID
            if (processedIds.has(employeeId)) {
              continue;
            }

            let gender = 'Male';
            let position = '';

            // Handle different table structures
            if (departmentName.includes('Electronics and Communication')) {
              // ECE department has a different structure
              gender = 'Male'; // Default to Male as gender is not specified
              position = cells[4].textContent.trim();
            } else {
              // Standard structure for most departments
              if (cells.length >= 7) {
                gender = cells[2].textContent.trim();
                position = cells[3].textContent.trim();
              } else {
                position = cells[2].textContent.trim();
              }
            }

            const roleText = cells[cells.length - 1].textContent.trim();

            // Determine role ID
            let roleId = 1; // Default to Employee
            if (roleText.includes('HOD')) {
              roleId = 2;
            } else if (roleText.includes('Principal')) {
              roleId = 3;
            }

            // Generate email
            const email = generateEmail(name, employeeId, roleText.includes('HOD') ? 'HOD' : 'Employee', departmentName);

            employees.push({
              full_name: name,
              email: email,
              phone_number: generatePhoneNumber(),
              gender: gender,
              department_id: departmentId,
              employee_id: employeeId,
              employee_position: position,
              joining_date: '2023-01-01',
              role_id: roleId
            });

            // Mark this ID as processed
            processedIds.add(employeeId);
          }
        }
      }
    }

    // Use employees array directly (no need to combine)
    const allEmployees = employees;

    // Generate SQL statements
    let sql = `-- SQL Script to insert real employee credentials for all departments
-- Password is set to 'password123' for all users (hashed with bcrypt)
-- The hash is generated using bcrypt with 10 rounds
-- $2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a is the hash for 'password123'

-- Use INSERT IGNORE to skip existing employee IDs
-- This will only insert users that don't already exist in the database

`;

    // Group employees by department for better organization
    const employeesByDept = {};

    for (const emp of allEmployees) {
      if (!employeesByDept[emp.department_id]) {
        employeesByDept[emp.department_id] = [];
      }
      employeesByDept[emp.department_id].push(emp);
    }

    // Generate SQL for each department
    for (const [deptId, deptEmployees] of Object.entries(employeesByDept)) {
      // Find department name
      let deptName = 'Unknown Department';
      for (const [name, id] of Object.entries(DEPARTMENT_IDS)) {
        if (id === parseInt(deptId)) {
          deptName = name;
          break;
        }
      }

      sql += `-- ${deptName} - Department ID: ${deptId}\n`;
      sql += `INSERT IGNORE INTO users (full_name, email, phone_number, gender, department_id, employee_id, employee_position, joining_date, password, role_id, is_active) VALUES\n`;

      for (let i = 0; i < deptEmployees.length; i++) {
        const emp = deptEmployees[i];
        sql += `('${emp.full_name}', '${emp.email}', '${emp.phone_number}', '${emp.gender}', ${emp.department_id}, '${emp.employee_id}', '${emp.employee_position}', '${emp.joining_date}', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', ${emp.role_id}, 1)`;

        if (i < deptEmployees.length - 1) {
          sql += ',\n';
        } else {
          sql += ';\n\n';
        }
      }
    }

    sql += `-- Note: The password hash '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a' corresponds to 'password123'
-- All users can login with their email and the password 'password123'`;

    // Write SQL to file
    const sqlPath = path.join(__dirname, 'real_credentials_data.sql');
    fs.writeFileSync(sqlPath, sql, 'utf8');

    console.log(`Successfully generated SQL file at ${sqlPath}`);
    console.log(`Total employees: ${allEmployees.length}`);

  } catch (error) {
    console.error('Error parsing employee data:', error);
  }
}

// Run the script
parseEmployeeData();
