# Leave Management System

A comprehensive leave management system built with Next.js, Material UI, and MySQL.

## Features

- 5 user roles: Employee, HOD, Principal, Admin, Super Admin
- 10 departments with faculty data
- 6 leave types with configurable balances
- Approval workflow: Employee → HOD → Principal
- Real-time data visualization and reporting
- Leave balance management

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Setup Instructions

### 1. Database Setup

1. Create a MySQL database named `leave_management`
2. Update the database credentials in `.env.local` if needed (default password is 'root')
3. Run the schema creation script:
   ```
   mysql -u root -proot leave_management < src/db/schema.sql
   ```

### 2. Import Sample Data

Run the following batch file to import all sample data:
```
import_all_data.bat
```

This will import:
- Departments
- Leave types
- Employee data with usernames and passwords

### 3. Install Dependencies

```
npm install
```

### 4. Run the Application

```
npm run dev
```

The application will be available at http://localhost:3000

## User Credentials

All employees have been created with the following credentials:
- Username: Their email address (e.g., `employee.name@example.com`)
- Password: `password123`

You can view and print all employee credentials by logging in as an admin and navigating to "Employee Credentials" in the sidebar.

## User Roles

1. **Employee**: Can apply for leave and view their leave history
2. **HOD**: Can approve/reject leave applications from their department
3. **Principal**: Can approve/reject leave applications approved by HODs
4. **Admin**: Can manage employees, departments, and leave types
5. **Super Admin**: Has all admin privileges plus can update Casual Leave balances

## Leave Types

1. Casual Leave
2. Sick Leave
3. Vacation Leave
4. On Duty Leave
5. Compensatory Casual Leave
6. Maternity Leave

## Departments

1. CSE
2. CSE(Data Science)
3. CSE(Cyber Security)
4. CSE(AIML)
5. Civil Engineering
6. EEE
7. ECE
8. Humanities and Sciences
9. MBA

## License

This project is licensed under the MIT License.
