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

    // Only Admin and SuperAdmin can reject users
    if (![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to reject users',
      });
    }

    const { id } = req.query;
    const { rejection_reason } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    if (!rejection_reason || typeof rejection_reason !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required',
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
        SET approval_status = ?, approved_by = ?, approved_at = NOW(), rejection_reason = ?
        WHERE id = ?
      `,
      values: [UserApprovalStatus.Rejected, session.user.id, rejection_reason, id],
    });

    return res.status(200).json({
      success: true,
      message: 'User registration rejected successfully',
    });
  } catch (error: any) {
    console.error('Error rejecting user:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
