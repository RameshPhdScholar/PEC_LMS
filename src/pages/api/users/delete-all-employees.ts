import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '@/lib/db';
import { ApiResponse, UserRole } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  try {
    // Only DELETE method is allowed
    if (req.method !== 'DELETE') {
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} not allowed`,
      });
    }

    // Check authentication
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'You must be logged in to perform this action',
      });
    }

    // Only Super Admin and Admin can delete all employees
    if (![UserRole.SuperAdmin, UserRole.Admin].includes(session.user.role_id)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to perform this action',
      });
    }

    try {
      // 1. Delete all leave history records
      await db.executeQuery({
        query: 'DELETE FROM leave_history'
      });
      console.log('Deleted all leave history records');

      // 2. Delete all leave applications
      await db.executeQuery({
        query: 'DELETE FROM leave_applications'
      });
      console.log('Deleted all leave applications');

      // 3. Delete all leave balances
      await db.executeQuery({
        query: 'DELETE FROM leave_balances'
      });
      console.log('Deleted all leave balances');

      // 4. Get the list of essential system users to preserve
      const essentialUsers = await db.executeQuery({
        query: `
          SELECT id, email, role_id, employee_id, department_id
          FROM users
          WHERE
            email IN (
              'superadmin@pallaviengineeringcollege.ac.in',
              'admin@pallaviengineeringcollege.ac.in',
              'principal@pallaviengineeringcollege.ac.in'
            )
            OR role_id IN (${UserRole.SuperAdmin}, ${UserRole.Admin}, ${UserRole.Principal})
            OR email LIKE '%.hod@pallaviengineeringcollege.ac.in'
        `
      });

      console.log('Essential users to preserve:', essentialUsers);

      // 5. Delete all users
      await db.executeQuery({
        query: 'DELETE FROM users'
      });
      console.log('Deleted all users');

      // 6. Re-insert essential system users with minimal data
      for (const user of essentialUsers) {
        await db.executeQuery({
          query: `
            INSERT INTO users (
              id, email, employee_id, full_name, password, role_id,
              department_id, is_active, created_at, updated_at
            ) VALUES (
              ?, ?, ?, ?,
              '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a',
              ?, ?, 1, NOW(), NOW()
            )
          `,
          values: [
            user.id,
            user.email,
            user.employee_id,
            user.email.split('@')[0], // Use email username as full name
            user.role_id,
            user.role_id === UserRole.HOD ? user.department_id : 10 // Admin department
          ]
        });
      }
      console.log('Re-inserted essential system users');

      return res.status(200).json({
        success: true,
        message: 'All employee data has been deleted successfully. Essential system users preserved.',
      });
    } catch (error) {
      throw error;
    }
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
