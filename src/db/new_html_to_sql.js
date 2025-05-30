/**
 * Script to convert HTML employee data to SQL statements
 * Modified to handle the new employee data format
 *
 * Usage: node src/db/new_html_to_sql.js
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

// Department code mapping for employee IDs
const DEPARTMENT_CODES = {
  1: 'CSE',
  2: 'CSD',
  3: 'CSC',
  4: 'CSM',
  5: 'CE',
  6: 'EEE',
  7: 'ECE',
  8: 'HAS',
  9: 'MBA',
  10: 'ADM'
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
    const deptCode = DEPARTMENT_CODES[department].toLowerCase();
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
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  return `${firstName}.${lastName}@pallaviengineeringcollege.ac.in`;
}

// Function to generate employee ID
function generateEmployeeId(departmentId, index) {
  const deptCode = DEPARTMENT_CODES[departmentId];
  return `${deptCode}${String(index).padStart(3, '0')}`;
}

// Function to determine if a person is HOD based on designation
function isHOD(designation) {
  return designation.toLowerCase().includes('hod') ||
         designation.toLowerCase().includes('head of department');
}

// Function to parse the HTML and extract employee data
async function parseEmployeeData() {
  try {
    // Read the HTML file
    const htmlPath = path.join(__dirname, 'new_employee_data.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Parse the HTML
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    // Initialize arrays to store employee data
    const employees = [];
    const departmentEmployeeCounts = {};

    // Extract department employees
    const departmentHeadings = document.querySelectorAll('h2');

    for (const heading of departmentHeadings) {
      const departmentName = heading.textContent.trim();
      let departmentId = null;

      // Find the matching department ID
      for (const [deptName, deptId] of Object.entries(DEPARTMENT_IDS)) {
        if (departmentName.includes(deptName)) {
          departmentId = deptId;
          break;
        }
      }

      if (!departmentId) {
        console.warn(`Department not found for: ${departmentName}`);
        continue;
      }

      // Initialize counter for this department if not exists
      if (!departmentEmployeeCounts[departmentId]) {
        departmentEmployeeCounts[departmentId] = 1;
      }

      // Get the table following this heading
      const table = heading.nextElementSibling;
      if (table && table.tagName === 'TABLE') {
        const rows = table.querySelectorAll('tr');

        // Skip the header row
        for (let i = 1; i < rows.length; i++) {
          const cells = rows[i].querySelectorAll('td');

          if (cells.length >= 4) { // Ensure we have at least name, gender, designation
            const name = cells[1].textContent.trim();
            let gender = 'Male'; // Default
            let designation = '';
            let qualification = '';

            // Handle different table structures based on department
            if (departmentName.includes('Electronics and Communication')) {
              // ECE has a different structure
              designation = cells[4].textContent.trim();
              qualification = cells[2].textContent.trim();
              // Determine gender from name (not ideal but works for this dataset)
              gender = name.includes('Dr.') ? 'Male' :
                      (name.includes('Mrs.') || name.includes('Ms.') ? 'Female' : 'Male');
            }
            else if (departmentName.includes('Electrical and Electronics')) {
              // EEE has a different structure
              designation = cells[2].textContent.trim();
              qualification = cells[3].textContent.trim();
              // Determine gender from name
              gender = name.includes('Dr.') ? 'Male' :
                      (name.includes('Mrs.') || name.includes('Ms.') ? 'Female' : 'Male');
            }
            else {
              // Standard structure for most departments
              if (cells.length >= 5) {
                gender = cells[2].textContent.trim();
                designation = cells[3].textContent.trim();
                qualification = cells[4].textContent.trim();
              } else {
                designation = cells[2].textContent.trim();
                qualification = cells[3] ? cells[3].textContent.trim() : '';
              }
            }

            // Determine role ID
            let roleId = 1; // Default to Employee
            if (isHOD(designation)) {
              roleId = 2; // HOD
            }

            // Generate employee ID
            const employeeId = generateEmployeeId(departmentId, departmentEmployeeCounts[departmentId]);
            departmentEmployeeCounts[departmentId]++;

            // Generate email
            const email = generateEmail(name, employeeId, roleId === 2 ? 'HOD' : 'Employee', departmentId);

            employees.push({
              full_name: name,
              email: email,
              phone_number: generatePhoneNumber(),
              gender: gender,
              department_id: departmentId,
              employee_id: employeeId,
              employee_position: designation,
              joining_date: '2023-01-01',
              role_id: roleId,
              qualification: qualification
            });
          }
        }
      }
    }

    // Generate SQL statements
    let sql = `-- SQL Script to insert updated employee credentials for all departments
-- Password is set to 'password123' for all users (hashed with bcrypt)
-- The hash is generated using bcrypt with 10 rounds
-- $2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a is the hash for 'password123'

-- Use INSERT IGNORE to skip existing employee IDs
-- This will only insert users that don't already exist in the database

`;

    // Group employees by department for better organization
    const employeesByDept = {};

    for (const emp of employees) {
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
    const sqlPath = path.join(__dirname, 'updated_employees_data.sql');
    fs.writeFileSync(sqlPath, sql, 'utf8');

    console.log(`Successfully generated SQL file at ${sqlPath}`);
    console.log(`Total employees: ${employees.length}`);

  } catch (error) {
    console.error('Error parsing employee data:', error);
  }
}

// Run the script
parseEmployeeData();
