import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '@/lib/db';
import { ApiResponse, LeaveHistory, UserRole } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LeaveHistory[]>>
) {
  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'You must be logged in to perform this action',
      });
    }

    // Only GET method is allowed
    if (req.method !== 'GET') {
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} not allowed`,
      });
    }

    // Parse query parameters
    const { 
      leave_application_id, 
      department_id, 
      user_id, 
      start_date, 
      end_date, 
      status 
    } = req.query;

    // Base query with joins to get all relevant information
    let baseQuery = `
      SELECT lh.*,
        u.full_name as action_by_user_name,
        la.start_date, la.end_date, la.days,
        la.status as current_status,
        la.user_id as leave_user_id,
        lu.full_name as leave_user_name,
        lu.department_id,
        d.name as department_name,
        lt.name as leave_type_name
      FROM leave_history lh
      JOIN leave_applications la ON lh.leave_application_id = la.id
      JOIN users u ON lh.action_by_user_id = u.id
      JOIN users lu ON la.user_id = lu.id
      JOIN departments d ON lu.department_id = d.id
      JOIN leave_types lt ON la.leave_type_id = lt.id
    `;

    // Build WHERE clause based on role and filters
    let whereConditions: string[] = [];
    let values: any[] = [];

    // Role-based access control
    if (session.user.role_id === UserRole.HOD) {
      // HODs can only see history for their department
      whereConditions.push('lu.department_id = ?');
      values.push(session.user.department_id);
    } else if (session.user.role_id === UserRole.Employee) {
      // Employees can only see their own leave history
      whereConditions.push('la.user_id = ?');
      values.push(session.user.id);
    }
    // Admins, SuperAdmins, and Principals can see all leave history

    // Apply filters if provided
    if (leave_application_id) {
      whereConditions.push('lh.leave_application_id = ?');
      values.push(leave_application_id);
    }

    if (department_id && [UserRole.Admin, UserRole.SuperAdmin, UserRole.Principal].includes(session.user.role_id as UserRole)) {
      whereConditions.push('lu.department_id = ?');
      values.push(department_id);
    }

    if (user_id && [UserRole.Admin, UserRole.SuperAdmin, UserRole.Principal, UserRole.HOD].includes(session.user.role_id as UserRole)) {
      whereConditions.push('la.user_id = ?');
      values.push(user_id);
    }

    if (start_date) {
      whereConditions.push('la.start_date >= ?');
      values.push(start_date);
    }

    if (end_date) {
      whereConditions.push('la.end_date <= ?');
      values.push(end_date);
    }

    if (status) {
      whereConditions.push('la.status = ?');
      values.push(status);
    }

    // Combine query parts
    let query = baseQuery;
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }
    query += ' ORDER BY lh.created_at DESC';

    // Execute query
    const leaveHistory = await db.executeQuery<LeaveHistory[]>({
      query,
      values,
    });

    return res.status(200).json({
      success: true,
      data: leaveHistory,
    });
  } catch (error: any) {
    console.error('Error in leave history API:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while fetching leave history',
    });
  }
}
