import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '@/lib/db';
import { ApiResponse, User } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User>>
) {
  try {
    // Only GET method is allowed
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

    // Get the current user's ID from the session
    const userId = session.user.id;

    // Get the user details
    const query = `
      SELECT u.*, r.name as role_name, d.name as department_name 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      LEFT JOIN departments d ON u.department_id = d.id 
      WHERE u.id = ?
    `;
    
    const user = await db.getRow<User>({
      query,
      values: [userId],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user as any;

    return res.status(200).json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while fetching user profile',
    });
  }
}
