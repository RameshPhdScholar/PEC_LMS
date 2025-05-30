import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import db from '@/lib/db';
import { ApiResponse, UserRole, UserApprovalStatus } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  try {
    if (req.method !== 'POST') {
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

    // Only Admin and SuperAdmin can approve users
    if (![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to approve users',
      });
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    // Check if user exists and is pending approval
    const user = await db.getRow<any>({
      query: 'SELECT * FROM users WHERE id = ? AND approval_status = ?',
      values: [id, UserApprovalStatus.Pending],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found or not pending approval',
      });
    }

    // Update user approval status
    await db.executeQuery({
      query: `
        UPDATE users 
        SET approval_status = ?, approved_by = ?, approved_at = NOW()
        WHERE id = ?
      `,
      values: [UserApprovalStatus.Approved, session.user.id, id],
    });

    // Initialize leave balances for the approved user
    const currentYear = new Date().getFullYear();

    // Get all leave types
    const leaveTypes = await db.executeQuery<{ id: number; name: string }[]>({
      query: 'SELECT id, name FROM leave_types',
    });

    // Create default balances for each leave type
    for (const leaveType of leaveTypes) {
      // Default balance based on leave type
      let defaultBalance = 0;

      // Only Casual Leave gets 12 days by default for every new user
      // All other leave types start with 0 and are updated by Admin as needed
      if (leaveType.name.toLowerCase() === 'casual leave') {
        defaultBalance = 12; // Fixed at 12 per academic year for all users
      } else {
        defaultBalance = 0; // All other leave types start with 0, updated by Admin
      }

      // Insert default balance
      await db.executeQuery({
        query: `
          INSERT INTO leave_balances
          (user_id, leave_type_id, balance, year)
          VALUES (?, ?, ?, ?)
        `,
        values: [id, leaveType.id, defaultBalance, currentYear],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User approved successfully and leave balances initialized',
    });
  } catch (error: any) {
    console.error('Error approving user:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
