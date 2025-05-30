import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { hash, compare } from 'bcryptjs';
import db from '@/lib/db';
import { ApiResponse, UserWithPassword } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ message: string }>>
) {
  try {
    // Only PUT method is allowed
    if (req.method !== 'PUT') {
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

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'All password fields are required',
      });
    }

    // Validate new password confirmation
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'New password and confirmation do not match',
      });
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long',
      });
    }

    // Get the current user with password
    const currentUser = await db.getRow<UserWithPassword>({
      query: 'SELECT * FROM users WHERE id = ?',
      values: [session.user.id],
    });

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await compare(currentPassword, currentUser.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect',
      });
    }

    // Check if new password is different from current password
    const isSamePassword = await compare(newPassword, currentUser.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        error: 'New password must be different from current password',
      });
    }

    // Hash the new password
    const hashedNewPassword = await hash(newPassword, 10);

    // Update the password in the database
    await db.updateRow({
      table: 'users',
      data: { password: hashedNewPassword },
      where: { id: session.user.id },
    });

    return res.status(200).json({
      success: true,
      data: { message: 'Password changed successfully' },
    });

  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
