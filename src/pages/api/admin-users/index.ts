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

    // GET method - Get all admin users
    if (req.method === 'GET') {
      const query = `
        SELECT s.*, r.name as role_name
        FROM system_users s
        LEFT JOIN roles r ON s.role_id = r.id
        ORDER BY s.email
      `;

      const adminUsers = await db.executeQuery<AdminUser[]>({ query });

      // Remove password from response
      const adminUsersWithoutPassword = adminUsers.map(({ password, ...user }: any) => user);

      return res.status(200).json({
        success: true,
        data: adminUsersWithoutPassword,
      });
    }

    // POST method - Create a new admin user
    if (req.method === 'POST') {
      const {
        email,
        password,
        role_id,
      } = req.body;

      // Validate required fields
      if (!email || !password || !role_id) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        });
      }

      // Check if email already exists in system_users
      const existingSystemUser = await db.executeQuery<AdminUser[]>({
        query: 'SELECT * FROM system_users WHERE email = ?',
        values: [email],
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

      // Hash password
      const hashedPassword = await hash(password, 10);

      // Insert new system user
      const systemUserData = {
        email,
        password: hashedPassword,
        role_id,
      };

      const systemUserId = await db.insertRow({
        table: 'system_users',
        data: systemUserData,
      });

      // Get the created system user
      const query = `
        SELECT s.*, r.name as role_name
        FROM system_users s
        LEFT JOIN roles r ON s.role_id = r.id
        WHERE s.id = ?
      `;

      const newSystemUser = await db.getRow<AdminUser>({
        query,
        values: [systemUserId],
      });

      if (!newSystemUser) {
        return res.status(500).json({
          success: false,
          error: 'Failed to retrieve created system user',
        });
      }

      // Remove password from response
      const { password: _, ...systemUserWithoutPassword } = newSystemUser;

      return res.status(201).json({
        success: true,
        data: systemUserWithoutPassword,
        message: 'System user created successfully',
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
