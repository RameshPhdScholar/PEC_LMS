import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { hash } from 'bcryptjs';
import db from '@/lib/db';
import { ApiResponse, AdminUser, UserRole } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
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

    // Only Super Admin and Admin can access this endpoint
    if (![UserRole.SuperAdmin, UserRole.Admin].includes(session.user.role_id)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to access this endpoint',
      });
    }

    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid admin user ID',
      });
    }

    // GET method - Get system user by ID
    if (req.method === 'GET') {
      const query = `
        SELECT s.*, r.name as role_name
        FROM system_users s
        LEFT JOIN roles r ON s.role_id = r.id
        WHERE s.id = ?
      `;

      const systemUser = await db.getRow<AdminUser>({
        query,
        values: [id],
      });

      if (!systemUser) {
        return res.status(404).json({
          success: false,
          error: 'System user not found',
        });
      }

      // Remove password from response
      const { password, ...systemUserWithoutPassword } = systemUser;

      return res.status(200).json({
        success: true,
        data: systemUserWithoutPassword,
      });
    }

    // PUT method - Update system user
    if (req.method === 'PUT') {
      const {
        email,
        password,
        role_id,
        is_active,
      } = req.body;

      // Get the current system user
      const currentSystemUser = await db.getRow<AdminUser>({
        query: 'SELECT * FROM system_users WHERE id = ?',
        values: [id],
      });

      if (!currentSystemUser) {
        return res.status(404).json({
          success: false,
          error: 'System user not found',
        });
      }

      // Prepare update data
      const updateData: any = {};

      // Only update email if it's provided and different
      if (email && email !== currentSystemUser.email) {
        // Check if email already exists in system_users
        const existingSystemUser = await db.executeQuery<AdminUser[]>({
          query: 'SELECT * FROM system_users WHERE email = ? AND id != ?',
          values: [email, id],
        });

        if (existingSystemUser.length > 0) {
          return res.status(400).json({
            success: false,
            error: 'System user with this email already exists',
          });
        }

        // Check if email already exists in users
        const existingUser = await db.executeQuery<any[]>({
          query: 'SELECT * FROM users WHERE email = ?',
          values: [email],
        });

        if (existingUser.length > 0) {
          return res.status(400).json({
            success: false,
            error: 'Regular user with this email already exists',
          });
        }

        updateData.email = email;
      }

      // Only update password if it's provided
      if (password) {
        updateData.password = await hash(password, 10);
      }

      // Update role_id if provided
      if (role_id) {
        updateData.role_id = role_id;
      }

      // Update is_active if provided
      if (is_active !== undefined) {
        updateData.is_active = is_active;
      }

      // Only update if there are changes
      if (Object.keys(updateData).length > 0) {
        await db.updateRow({
          table: 'system_users',
          data: updateData,
          where: { id },
        });
      }

      // Get the updated system user
      const query = `
        SELECT s.*, r.name as role_name
        FROM system_users s
        LEFT JOIN roles r ON s.role_id = r.id
        WHERE s.id = ?
      `;

      const updatedSystemUser = await db.getRow<AdminUser>({
        query,
        values: [id],
      });

      if (!updatedSystemUser) {
        return res.status(500).json({
          success: false,
          error: 'Failed to retrieve updated system user',
        });
      }

      // Remove password from response
      const { password: _, ...systemUserWithoutPassword } = updatedSystemUser;

      return res.status(200).json({
        success: true,
        data: systemUserWithoutPassword,
        message: 'System user updated successfully',
      });
    }

    // DELETE method - Delete system user
    if (req.method === 'DELETE') {
      // Check if system user exists
      const systemUser = await db.getRow<AdminUser>({
        query: 'SELECT * FROM system_users WHERE id = ?',
        values: [id],
      });

      if (!systemUser) {
        return res.status(404).json({
          success: false,
          error: 'System user not found',
        });
      }

      // Delete system user
      await db.deleteRow({
        table: 'system_users',
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'System user deleted successfully',
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
