import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '@/lib/db';
import { ApiResponse, Department, UserRole } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Department>>
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

    // Admin can view departments, but only SuperAdmin can edit/delete
    if (![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to access this endpoint',
      });
    }

    // For PUT and DELETE operations, only SuperAdmin is allowed
    if ((req.method === 'PUT' || req.method === 'DELETE') && session.user.role_id !== UserRole.SuperAdmin) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to perform this action',
      });
    }

    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid department ID',
      });
    }

    // GET method - Get department by ID
    if (req.method === 'GET') {
      const department = await db.getRow<Department>({
        query: 'SELECT * FROM departments WHERE id = ?',
        values: [id],
      });

      if (!department) {
        return res.status(404).json({
          success: false,
          error: 'Department not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: department,
      });
    }

    // PUT method - Update department
    if (req.method === 'PUT') {
      const { name, code } = req.body;

      // Validate required fields
      if (!name || !code) {
        return res.status(400).json({
          success: false,
          error: 'Department name and code are required',
        });
      }

      // Check if department exists
      const existingDepartment = await db.getRow<Department>({
        query: 'SELECT * FROM departments WHERE id = ?',
        values: [id],
      });

      if (!existingDepartment) {
        return res.status(404).json({
          success: false,
          error: 'Department not found',
        });
      }

      // Check if another department with the same name or code exists
      const duplicateDepartment = await db.executeQuery<Department[]>({
        query: 'SELECT * FROM departments WHERE (name = ? OR code = ?) AND id != ?',
        values: [name, code, id],
      });

      if (duplicateDepartment.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Another department with the same name or code already exists',
        });
      }

      // Update department
      await db.updateRow({
        table: 'departments',
        data: { name, code },
        where: { id },
      });

      // Get updated department
      const updatedDepartment = await db.getRow<Department>({
        query: 'SELECT * FROM departments WHERE id = ?',
        values: [id],
      });

      return res.status(200).json({
        success: true,
        data: updatedDepartment!,
        message: 'Department updated successfully',
      });
    }

    // DELETE method - Delete department
    if (req.method === 'DELETE') {
      // Check if department exists
      const department = await db.getRow<Department>({
        query: 'SELECT * FROM departments WHERE id = ?',
        values: [id],
      });

      if (!department) {
        return res.status(404).json({
          success: false,
          error: 'Department not found',
        });
      }

      // Check if department has associated users
      const associatedUsers = await db.executeQuery<{ count: number }[]>({
        query: 'SELECT COUNT(*) as count FROM users WHERE department_id = ?',
        values: [id],
      });

      if (associatedUsers[0].count > 0) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete department with associated users',
        });
      }

      // Delete department
      await db.deleteRow({
        table: 'departments',
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'Department deleted successfully',
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
