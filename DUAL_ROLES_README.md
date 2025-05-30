# Leave Management System Documentation

This document explains the key features of the Leave Management System, including dual role functionality for HODs and Principal, and the Casual Leave policy.

## Overview

In this system, HODs and the Principal have dual roles:

1. **HODs**:
   - They have an **HOD role** for approving leave applications from employees in their department
   - They also have an **Employee role** in their department, allowing them to apply for leave themselves

2. **Principal**:
   - Has a **Principal role** for final approval of leave applications after HOD approval
   - Also has an **Employee role** in the CSE department, allowing them to apply for leave

## Implementation

The dual role functionality is implemented through application logic rather than database schema changes. This approach maintains the existing database structure while providing the required functionality.

### Key Components:

1. **Role Utility Functions** (`src/utils/roleUtils.ts`):
   - `hasRole(user, roleId)`: Checks if a user has a specific role, including dual roles
   - `getUserRoles(user)`: Returns all roles that a user has, including dual roles
   - `canApplyForLeave(user)`: Checks if a user can apply for leave (all users with Employee role)
   - `canApproveLeave(user)`: Checks if a user can approve leave (HODs and Principal)

2. **Navigation Menu** (`src/components/Dashboard/Layout.tsx`):
   - Uses the `hasRole` utility to determine which menu items to show
   - HODs and Principal see both employee-related and approval-related menu items

3. **Page Access Control**:
   - Each page checks if the user has the required role(s) to access it
   - HODs and Principal can access both employee pages and approval pages

## Database Structure

The database still uses a single `role_id` for each user, but the application logic treats HODs and the Principal as having multiple roles:

- HODs have `role_id = 2` in the database
- Principal has `role_id = 3` in the database
- The application logic treats them as also having `role_id = 1` (Employee)

## How to Use

1. **HODs**:
   - Can apply for leave using the "Apply Leave" menu
   - Can view their own leave applications using the "My Leaves" menu
   - Can approve/reject leave applications from their department using the "Leave Approvals" menu

2. **Principal**:
   - Can apply for leave using the "Apply Leave" menu
   - Can view their own leave applications using the "My Leaves" menu
   - Can approve/reject leave applications that have been approved by HODs using the "Leave Approvals" menu

## Login Credentials

- **HODs**: Use their department-specific email (e.g., `cse.hod@pallaviengineeringcollege.ac.in`)
- **Principal**: Use `principal@pallaviengineeringcollege.ac.in`
- **Password**: All users can log in with the password `password123`

## Casual Leave Policy

Casual Leave is a special type of leave with the following rules:

1. **Fixed Balance**: Each employee receives exactly 12 Casual Leave days per year.
2. **Non-Editable**: The Casual Leave balance cannot be modified by anyone, including Admins and Super Admins.
3. **Automatic Reset**: At the beginning of each year, the Casual Leave balance is automatically reset to 12 days.
4. **Usage**: When an employee applies for Casual Leave and it's approved, the balance is automatically reduced.

This policy ensures fair and consistent allocation of Casual Leave across all employees.

## Technical Notes

- The dual role functionality is implemented in the application layer, not the database layer
- This approach avoids the need for a many-to-many relationship between users and roles
- The `hasRole` utility function is the key component that enables this functionality
- Casual Leave balances are enforced through both frontend and backend validation
