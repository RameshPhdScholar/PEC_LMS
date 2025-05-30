import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '@/lib/db';
import { ApiResponse, LeaveBalance, UserRole } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LeaveBalance[] | LeaveBalance>>
) {
  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'You must be logged in to perform this action',
      });
    }

    // GET method - Fetch all leave balances (Admin only)
    if (req.method === 'GET') {
      // Only Admin and Super Admin can view all leave balances
      if (![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to view all leave balances',
        });
      }

      const { user_id, year, department_id } = req.query;

      let query = `
        SELECT lb.*,
          lt.name as leave_type_name,
          u.full_name as user_name,
          u.employee_id,
          u.department_id,
          d.name as department_name
        FROM leave_balances lb
        JOIN leave_types lt ON lb.leave_type_id = lt.id
        JOIN users u ON lb.user_id = u.id
        LEFT JOIN departments d ON u.department_id = d.id
      `;

      const values: any[] = [];
      const conditions: string[] = [];

      if (user_id) {
        conditions.push('lb.user_id = ?');
        values.push(user_id);
      }

      if (year) {
        conditions.push('lb.year = ?');
        values.push(year);
      }

      if (department_id) {
        conditions.push('u.department_id = ?');
        values.push(department_id);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY u.full_name, lt.name';

      const leaveBalances = await db.executeQuery<LeaveBalance[]>({
        query,
        values,
      });

      return res.status(200).json({
        success: true,
        data: leaveBalances,
      });
    }

    // POST method - Update leave balance (Admin only)
    if (req.method === 'POST') {
      // Only Admin and Super Admin can update leave balances
      if (![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to update leave balances',
        });
      }

      const { user_id, leave_type_id, balance, year } = req.body;

      // Validate required fields
      if (!user_id || !leave_type_id || balance === undefined || !year) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        });
      }

      // Get the leave type to check if it's Casual Leave
      const leaveType = await db.getRow<{ id: number; name: string }>({
        query: 'SELECT * FROM leave_types WHERE id = ?',
        values: [leave_type_id],
      });

      // Check if it's Casual Leave - no one can update Casual Leave as it's fixed at 12 per year
      if (leaveType && leaveType.name.toLowerCase() === 'casual leave') {
        return res.status(403).json({
          success: false,
          error: 'Casual Leave balance is fixed at 12 per year and cannot be updated',
        });
      }

      // Check if it's Maternity Leave and validate gender
      if (leaveType && leaveType.name.toLowerCase() === 'maternity leave') {
        const user = await db.getRow<{ id: number; gender: string }>({
          query: 'SELECT id, gender FROM users WHERE id = ?',
          values: [user_id],
        });

        if (!user) {
          return res.status(404).json({
            success: false,
            error: 'User not found',
          });
        }

        if (user.gender !== 'Female') {
          return res.status(403).json({
            success: false,
            error: 'Maternity Leave can only be allocated to female employees',
          });
        }
      }

      // Check if the leave balance exists
      const existingBalance = await db.getRow<LeaveBalance>({
        query: `
          SELECT * FROM leave_balances
          WHERE user_id = ? AND leave_type_id = ? AND year = ?
        `,
        values: [user_id, leave_type_id, year],
      });

      if (existingBalance) {
        // Update existing balance
        await db.executeQuery({
          query: `
            UPDATE leave_balances
            SET balance = ?
            WHERE user_id = ? AND leave_type_id = ? AND year = ?
          `,
          values: [balance, user_id, leave_type_id, year],
        });
      } else {
        // Insert new balance
        await db.executeQuery({
          query: `
            INSERT INTO leave_balances
            (user_id, leave_type_id, balance, year)
            VALUES (?, ?, ?, ?)
          `,
          values: [user_id, leave_type_id, balance, year],
        });
      }

      // Get the updated leave balance
      const updatedBalance = await db.getRow<LeaveBalance>({
        query: `
          SELECT lb.*,
            lt.name as leave_type_name,
            u.full_name as user_name
          FROM leave_balances lb
          JOIN leave_types lt ON lb.leave_type_id = lt.id
          JOIN users u ON lb.user_id = u.id
          WHERE lb.user_id = ? AND lb.leave_type_id = ? AND lb.year = ?
        `,
        values: [user_id, leave_type_id, year],
      });

      return res.status(200).json({
        success: true,
        data: updatedBalance || undefined,
        message: 'Leave balance updated successfully',
      });
    }

    // PUT method - Update leave balance (Admin only)
    if (req.method === 'PUT') {
      // Only Admin and Super Admin can update leave balances
      if (![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to update leave balances',
        });
      }

      const { user_id, leave_type_id, balance, year } = req.body;

      // Validate required fields
      if (!user_id || !leave_type_id || balance === undefined || !year) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        });
      }

      // Get the leave type to check if it's Casual Leave
      const leaveType = await db.getRow<{ id: number; name: string }>({
        query: 'SELECT * FROM leave_types WHERE id = ?',
        values: [leave_type_id],
      });

      // Check if it's Casual Leave - no one can update Casual Leave as it's fixed at 12 per year
      if (leaveType && leaveType.name.toLowerCase() === 'casual leave') {
        return res.status(403).json({
          success: false,
          error: 'Casual Leave balance is fixed at 12 per year and cannot be updated',
        });
      }

      // Check if it's Maternity Leave and validate gender
      if (leaveType && leaveType.name.toLowerCase() === 'maternity leave') {
        const user = await db.getRow<{ id: number; gender: string }>({
          query: 'SELECT id, gender FROM users WHERE id = ?',
          values: [user_id],
        });

        if (!user) {
          return res.status(404).json({
            success: false,
            error: 'User not found',
          });
        }

        if (user.gender !== 'Female') {
          return res.status(403).json({
            success: false,
            error: 'Maternity Leave can only be allocated to female employees',
          });
        }
      }

      // Check if the leave balance exists
      const existingBalance = await db.getRow<LeaveBalance>({
        query: `
          SELECT * FROM leave_balances
          WHERE user_id = ? AND leave_type_id = ? AND year = ?
        `,
        values: [user_id, leave_type_id, year],
      });

      if (!existingBalance) {
        return res.status(404).json({
          success: false,
          error: 'Leave balance not found',
        });
      }

      // Update existing balance
      await db.executeQuery({
        query: `
          UPDATE leave_balances
          SET balance = ?
          WHERE user_id = ? AND leave_type_id = ? AND year = ?
        `,
        values: [balance, user_id, leave_type_id, year],
      });

      // Get the updated leave balance
      const updatedBalance = await db.getRow<LeaveBalance>({
        query: `
          SELECT lb.*,
            lt.name as leave_type_name,
            u.full_name as user_name
          FROM leave_balances lb
          JOIN leave_types lt ON lb.leave_type_id = lt.id
          JOIN users u ON lb.user_id = u.id
          WHERE lb.user_id = ? AND lb.leave_type_id = ? AND lb.year = ?
        `,
        values: [user_id, leave_type_id, year],
      });

      return res.status(200).json({
        success: true,
        data: updatedBalance || undefined,
        message: 'Leave balance updated successfully',
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  } catch (error: any) {
    console.error('Error in leave balances API:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
