import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '@/lib/db';
import { ApiResponse, LeaveBalance, UserRole } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LeaveBalance>>
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

    // Only Admin and Super Admin can perform operations on leave balances
    if (![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to perform this action',
      });
    }

    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid leave balance ID',
      });
    }

    // GET method - Get specific leave balance
    if (req.method === 'GET') {
      const leaveBalance = await db.getRow<LeaveBalance>({
        query: `
          SELECT lb.*,
            lt.name as leave_type_name,
            u.full_name as user_name,
            u.employee_id,
            d.name as department_name
          FROM leave_balances lb
          JOIN leave_types lt ON lb.leave_type_id = lt.id
          JOIN users u ON lb.user_id = u.id
          LEFT JOIN departments d ON u.department_id = d.id
          WHERE lb.id = ?
        `,
        values: [id],
      });

      if (!leaveBalance) {
        return res.status(404).json({
          success: false,
          error: 'Leave balance not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: leaveBalance,
      });
    }

    // PUT method - Update specific leave balance
    if (req.method === 'PUT') {
      const { balance } = req.body;

      if (balance === undefined || balance < 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid balance value',
        });
      }

      // Check if leave balance exists
      const existingBalance = await db.getRow<LeaveBalance>({
        query: `
          SELECT lb.*, lt.name as leave_type_name
          FROM leave_balances lb
          JOIN leave_types lt ON lb.leave_type_id = lt.id
          WHERE lb.id = ?
        `,
        values: [id],
      });

      if (!existingBalance) {
        return res.status(404).json({
          success: false,
          error: 'Leave balance not found',
        });
      }

      // Check if it's Casual Leave - no one can update Casual Leave as it's fixed at 12 per year
      if (existingBalance.leave_type_name?.toLowerCase() === 'casual leave') {
        return res.status(403).json({
          success: false,
          error: 'Casual Leave balance is fixed at 12 per year and cannot be updated',
        });
      }

      // Update the balance
      await db.executeQuery({
        query: 'UPDATE leave_balances SET balance = ? WHERE id = ?',
        values: [balance, id],
      });

      // Get the updated leave balance
      const updatedBalance = await db.getRow<LeaveBalance>({
        query: `
          SELECT lb.*,
            lt.name as leave_type_name,
            u.full_name as user_name,
            u.employee_id,
            d.name as department_name
          FROM leave_balances lb
          JOIN leave_types lt ON lb.leave_type_id = lt.id
          JOIN users u ON lb.user_id = u.id
          LEFT JOIN departments d ON u.department_id = d.id
          WHERE lb.id = ?
        `,
        values: [id],
      });

      return res.status(200).json({
        success: true,
        data: updatedBalance || undefined,
        message: 'Leave balance updated successfully',
      });
    }

    // DELETE method - Delete specific leave balance
    if (req.method === 'DELETE') {
      // Check if leave balance exists
      const existingBalance = await db.getRow<LeaveBalance>({
        query: `
          SELECT lb.*, lt.name as leave_type_name
          FROM leave_balances lb
          JOIN leave_types lt ON lb.leave_type_id = lt.id
          WHERE lb.id = ?
        `,
        values: [id],
      });

      if (!existingBalance) {
        return res.status(404).json({
          success: false,
          error: 'Leave balance not found',
        });
      }

      // Check if it's Casual Leave - no one can delete Casual Leave as it's fixed at 12 per year
      if (existingBalance.leave_type_name?.toLowerCase() === 'casual leave') {
        return res.status(403).json({
          success: false,
          error: 'Casual Leave balance cannot be deleted as it is fixed at 12 per year',
        });
      }

      // Check if there are any pending or approved leave applications using this balance
      const activeApplications = await db.executeQuery<{ count: number }[]>({
        query: `
          SELECT COUNT(*) as count
          FROM leave_applications
          WHERE user_id = ? AND leave_type_id = ? 
          AND status IN ('Pending', 'HOD Approved', 'Principal Approved')
          AND YEAR(start_date) = ?
        `,
        values: [existingBalance.user_id, existingBalance.leave_type_id, existingBalance.year],
      });

      if (activeApplications[0].count > 0) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete leave balance with active leave applications',
        });
      }

      // Delete the leave balance
      await db.deleteRow({
        table: 'leave_balances',
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'Leave balance deleted successfully',
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  } catch (error: any) {
    console.error('Error in leave balance API:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
