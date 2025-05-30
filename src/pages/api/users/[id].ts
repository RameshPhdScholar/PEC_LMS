import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { hash } from 'bcryptjs';
import db from '@/lib/db';
import { ApiResponse, User, UserRole, UserWithPassword } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User>>
) {
  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'You must be signed in to access this endpoint',
      });
    }

    // Only Super Admin can edit/delete users
    if (session.user.role_id !== UserRole.SuperAdmin) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to access this endpoint',
      });
    }

    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
      });
    }

    // GET method - Get user by ID
    if (req.method === 'GET') {
      const query = `
        SELECT u.*, r.name as role_name, d.name as department_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        LEFT JOIN departments d ON u.department_id = d.id
        WHERE u.id = ?
      `;

      const user = await db.getRow<User>({
        query,
        values: [id],
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
    }

    // PUT method - Update user
    if (req.method === 'PUT') {
      const {
        full_name,
        email,
        phone_number,
        gender,
        department_id,
        employee_id,
        employee_position,
        joining_date,
        password,
        role_id,
      } = req.body;

      // Get the current user
      const currentUser = await db.getRow<UserWithPassword>({
        query: 'SELECT * FROM users WHERE id = ?',
        values: [id],
      });

      if (!currentUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Prepare update data
      const updateData: any = {};

      // Update fields if provided
      if (full_name) updateData.full_name = full_name;

      // Only update email if it's provided and different
      if (email && email !== currentUser.email) {
        // Check if email already exists
        const existingUser = await db.executeQuery<UserWithPassword[]>({
          query: 'SELECT * FROM users WHERE email = ? AND id != ?',
          values: [email, id],
        });

        if (existingUser.length > 0) {
          return res.status(400).json({
            success: false,
            error: 'User with this email already exists',
          });
        }

        updateData.email = email;
      }

      // Only update employee_id if it's provided and different
      if (employee_id && employee_id !== currentUser.employee_id) {
        // Check if employee_id already exists
        const existingEmployeeId = await db.executeQuery<UserWithPassword[]>({
          query: 'SELECT * FROM users WHERE employee_id = ? AND id != ?',
          values: [employee_id, id],
        });

        if (existingEmployeeId.length > 0) {
          return res.status(400).json({
            success: false,
            error: 'User with this Employee ID already exists',
          });
        }

        updateData.employee_id = employee_id;
      }

      // Update other fields if provided
      if (phone_number !== undefined) updateData.phone_number = phone_number;
      if (gender !== undefined) updateData.gender = gender;
      if (department_id !== undefined) updateData.department_id = department_id;
      if (employee_position !== undefined) updateData.employee_position = employee_position;
      if (joining_date !== undefined) updateData.joining_date = joining_date;
      if (role_id !== undefined) updateData.role_id = role_id;

      // Only update password if it's provided
      if (password) {
        updateData.password = await hash(password, 10);
      }

      // Only update if there are changes
      if (Object.keys(updateData).length > 0) {
        await db.updateRow({
          table: 'users',
          data: updateData,
          where: { id },
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
        values: [id],
      });

      if (!updatedUser) {
        return res.status(500).json({
          success: false,
          error: 'Failed to retrieve updated user',
        });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = updatedUser as any;

      return res.status(200).json({
        success: true,
        data: userWithoutPassword,
        message: 'User updated successfully',
      });
    }

    // DELETE method - Delete user
    if (req.method === 'DELETE') {
      // Check if user exists
      const user = await db.getRow<User>({
        query: 'SELECT * FROM users WHERE id = ?',
        values: [id],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Delete user
      await db.deleteRow({
        table: 'users',
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
