import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '@/lib/db';
import { ApiResponse, UserRole, UserApprovalStatus, User } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User[]>>
) {
  try {
    if (req.method !== 'GET') {
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

    // Only Admin and SuperAdmin can view pending registrations
    if (![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to view pending registrations',
      });
    }

    // Get all pending users
    const query = `
      SELECT u.*, r.name as role_name, d.name as department_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.approval_status = ?
      ORDER BY u.created_at DESC
    `;

    const pendingUsers = await db.executeQuery<User[]>({
      query,
      values: [UserApprovalStatus.Pending],
    });

    // Remove passwords from response
    const usersWithoutPassword = pendingUsers.map(user => {
      const { password, ...userWithoutPassword } = user as any;
      return userWithoutPassword;
    });

    return res.status(200).json({
      success: true,
      data: usersWithoutPassword,
    });
  } catch (error: any) {
    console.error('Error fetching pending users:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
