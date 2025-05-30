import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '@/lib/db';
import { ApiResponse, LeaveType, UserRole } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LeaveType[] | LeaveType>>
) {
  try {
    // GET method - Fetch all leave types
    if (req.method === 'GET') {
      const leaveTypes = await db.executeQuery<LeaveType[]>({
        query: 'SELECT * FROM leave_types ORDER BY name',
      });

      return res.status(200).json({
        success: true,
        data: leaveTypes,
      });
    }

    // Check authentication for other methods
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'You must be logged in to perform this action',
      });
    }

    // POST method - Create a new leave type (Admin only)
    if (req.method === 'POST') {
      // Only Admin and Super Admin can create leave types
      if (![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to create leave types',
        });
      }

      const { name, description } = req.body;

      // Validate required fields
      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Leave type name is required',
        });
      }

      // Check if leave type already exists
      const existingLeaveType = await db.executeQuery<LeaveType[]>({
        query: 'SELECT * FROM leave_types WHERE name = ?',
        values: [name],
      });

      if (existingLeaveType.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Leave type with this name already exists',
        });
      }

      // Insert the leave type
      const result = await db.executeQuery<{ insertId: number }>({
        query: 'INSERT INTO leave_types (name, description) VALUES (?, ?)',
        values: [name, description || null],
      });

      if (!result.insertId) {
        return res.status(500).json({
          success: false,
          error: 'Failed to create leave type',
        });
      }

      // Get the created leave type
      const leaveType = await db.getRow<LeaveType>({
        query: 'SELECT * FROM leave_types WHERE id = ?',
        values: [result.insertId],
      });

      return res.status(201).json({
        success: true,
        data: leaveType || undefined,
        message: 'Leave type created successfully',
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  } catch (error: any) {
    console.error('Error in leave types API:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
