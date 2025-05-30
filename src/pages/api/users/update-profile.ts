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

    // Get the current user's ID from the session
    const userId = session.user.id;

    // Get the update data from the request body
    const {
      employee_id,
      phone_number,
      gender,
      employee_position,
      joining_date,
    } = req.body;

    // Check if employee_id is already taken by another user
    if (employee_id && employee_id !== session.user.employee_id) {
      const existingUser = await db.executeQuery<{ id: number }[]>({
        query: 'SELECT id FROM users WHERE employee_id = ? AND id != ?',
        values: [employee_id, userId],
      });

      if (existingUser.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Employee ID is already taken by another user',
        });
      }
    }

    // Update the user
    const updateData: any = {};

    if (employee_id) updateData.employee_id = employee_id;
    if (phone_number) updateData.phone_number = phone_number;
    if (gender) updateData.gender = gender;
    if (employee_position) updateData.employee_position = employee_position;
    if (joining_date) updateData.joining_date = joining_date;

    // Only update if there's data to update
    if (Object.keys(updateData).length > 0) {
      await db.updateRow({
        table: 'users',
        data: updateData,
        where: { id: userId },
      });
    }

    // Get the updated user
    const query = `
      SELECT u.*, r.name as role_name, d.name as department_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.id = ?
    `;

    const updatedUser = await db.getRow<User>({
      query,
      values: [userId],
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser as any;

    return res.status(200).json({
      success: true,
      data: userWithoutPassword,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while updating user profile',
    });
  }
}
