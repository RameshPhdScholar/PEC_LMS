import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '@/lib/db';
import { ApiResponse, LeaveBalance } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LeaveBalance[]>>
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

    // Only GET method is allowed
    if (req.method !== 'GET') {
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} not allowed`,
      });
    }

    // System users (HODs, Admin, Principal, SuperAdmin) don't have leave balances
    if (session.user.isAdminUser) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // Get current year
    const currentYear = new Date().getFullYear();

    // Get user's leave balances for the current year
    const query = `
      SELECT lb.*, lt.name as leave_type_name
      FROM leave_balances lb
      JOIN leave_types lt ON lb.leave_type_id = lt.id
      WHERE lb.user_id = ? AND lb.year = ?
      ORDER BY lt.name
    `;

    const leaveBalances = await db.executeQuery<LeaveBalance[]>({
      query,
      values: [session.user.id, currentYear],
    });

    // If no balances found, create default balances for all leave types
    if (leaveBalances.length === 0) {
      // Get all leave types
      const leaveTypes = await db.executeQuery<{ id: number; name: string }[]>({
        query: 'SELECT * FROM leave_types',
      });

      // Create default balances for each leave type
      const insertPromises = leaveTypes.map(async (leaveType) => {
        // Default balance based on leave type
        let defaultBalance = 0;
        switch (leaveType.name.toLowerCase()) {
          case 'casual leave':
            defaultBalance = 12; // Fixed at 12 per year
            break;
          case 'on duty leave':
            defaultBalance = 15; // Default allocation
            break;
          case 'compensatory casual leave':
            defaultBalance = 0; // Admin updates as needed
            break;
          case 'sick leave':
            defaultBalance = 12; // Default allocation
            break;
          case 'maternity leave':
            defaultBalance = 0; // Admin updates as needed
            break;
          case 'vacation leave':
            defaultBalance = 30; // Default allocation
            break;
          default:
            defaultBalance = 0;
        }

        // Insert default balance
        return db.executeQuery({
          query: `
            INSERT INTO leave_balances
            (user_id, leave_type_id, balance, year)
            VALUES (?, ?, ?, ?)
          `,
          values: [session.user.id, leaveType.id, defaultBalance, currentYear],
        });
      });

      await Promise.all(insertPromises);

      // Fetch the newly created balances
      const newLeaveBalances = await db.executeQuery<LeaveBalance[]>({
        query,
        values: [session.user.id, currentYear],
      });

      return res.status(200).json({
        success: true,
        data: newLeaveBalances,
      });
    }

    return res.status(200).json({
      success: true,
      data: leaveBalances,
    });
  } catch (error: any) {
    console.error('Error in leave balances API:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
