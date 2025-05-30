import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '@/lib/db';
import { ApiResponse, Department, UserRole } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Department[] | Department>>
) {
  try {
    // GET method - Fetch all departments
    if (req.method === 'GET') {
      const departments = await db.executeQuery<Department[]>({
        query: 'SELECT * FROM departments ORDER BY id',
      });

      return res.status(200).json({
        success: true,
        data: departments,
      });
    }

    // POST method - Create a new department
    if (req.method === 'POST') {
      // Check authentication and authorization
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({
          success: false,
          error: 'You must be logged in to perform this action',
        });
      }

      // Only Super Admin can create departments
      if (session.user.role_id !== UserRole.SuperAdmin) {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to create departments',
        });
      }

      const { name, code } = req.body;

      if (!name || !code) {
        return res.status(400).json({
          success: false,
          error: 'Department name and code are required',
        });
      }

      // Check if department already exists with the same name or code
      const existingDepartment = await db.executeQuery<Department[]>({
        query: 'SELECT * FROM departments WHERE name = ? OR code = ?',
        values: [name, code],
      });

      if (existingDepartment.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Department with this name or code already exists',
        });
      }

      // Insert new department
      const departmentId = await db.insertRow({
        table: 'departments',
        data: { name, code },
      });

      const newDepartment = await db.getRow<Department>({
        query: 'SELECT * FROM departments WHERE id = ?',
        values: [departmentId],
      });

      return res.status(201).json({
        success: true,
        data: newDepartment!,
        message: 'Department created successfully',
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  } catch (error) {
    console.error('Departments API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
