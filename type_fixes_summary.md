# Type Error Fixes for Leave Management System

## Issues Fixed

We identified and fixed two TypeScript type errors that were preventing the application from building successfully:

1. **Error in `balances.tsx`**: Property 'user_name' does not exist on type 'LeaveBalance'
2. **Error in `my-leaves.tsx`**: Property 'leave_type_name' does not exist on type 'LeaveApplication'

## Changes Made

### 1. Updated `LeaveBalance` Interface

We added the missing properties to the `LeaveBalance` interface in `src/types/index.ts`:

```typescript
export interface LeaveBalance {
  id: number;
  user_id: number;
  leave_type_id: number;
  balance: number;
  year: number;
  created_at: string;
  updated_at: string;
  user?: User;
  leave_type?: LeaveType;
  // Additional properties from API joins
  user_name?: string;
  employee_id?: string;
  leave_type_name?: string;
}
```

### 2. Updated `LeaveApplication` Interface

We added the missing properties to the `LeaveApplication` interface in `src/types/index.ts`:

```typescript
export interface LeaveApplication {
  id: number;
  user_id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  days: number;
  reason?: string;
  status: LeaveStatus;
  hod_approval_date?: string;
  hod_approval_user_id?: number;
  principal_approval_date?: string;
  principal_approval_user_id?: number;
  rejection_date?: string;
  rejection_user_id?: number;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  leave_type?: LeaveType;
  hod_approver?: User;
  principal_approver?: User;
  rejector?: User;
  // Additional properties from API joins
  user_name?: string;
  leave_type_name?: string;
  department_name?: string;
}
```

## Why These Changes Were Needed

The API endpoints in the application were returning additional properties that weren't defined in the TypeScript interfaces:

1. In `src/pages/api/leave-balances/index.ts`, the GET endpoint was joining tables and returning additional fields:
   ```sql
   SELECT lb.*,
     lt.name as leave_type_name,
     u.full_name as user_name,
     u.employee_id
   FROM leave_balances lb
   JOIN leave_types lt ON lb.leave_type_id = lt.id
   JOIN users u ON lb.user_id = u.id
   ```

2. Similarly, in `src/pages/api/leaves/index.ts`, the GET endpoint was also joining tables and returning additional fields:
   ```sql
   SELECT la.*,
     u.full_name as user_name,
     lt.name as leave_type_name,
     d.name as department_name
   FROM leave_applications la
   JOIN users u ON la.user_id = u.id
   JOIN leave_types lt ON la.leave_type_id = lt.id
   JOIN departments d ON u.department_id = d.id
   ```

By updating the TypeScript interfaces to include these additional properties, we've ensured type safety throughout the application.

## Next Steps

After fixing these type errors, you should be able to build and run the application successfully. However, you may need to address the PowerShell execution policy issue as described in the `fix_execution_policy.html` file.
