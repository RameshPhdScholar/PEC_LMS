import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '@/lib/db';
import { ApiResponse, LeaveApplication, LeaveStatus, UserRole } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LeaveApplication[]>>
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

    // Parse query parameters for filtering
    const { 
      department_id, 
      user_id, 
      leave_type_id, 
      start_date, 
      end_date,
      limit = '50' // Default limit to 50 records
    } = req.query;

    // Base query with joins to get all relevant information
    let baseQuery = `
      SELECT la.*,
        u.full_name as user_name,
        lt.name as leave_type_name,
        d.name as department_name,
        hod.full_name as hod_approver_name,
        principal.full_name as principal_approver_name
      FROM leave_applications la
      JOIN users u ON la.user_id = u.id
      JOIN leave_types lt ON la.leave_type_id = lt.id
      JOIN departments d ON u.department_id = d.id
      LEFT JOIN users hod ON la.hod_approval_user_id = hod.id
      LEFT JOIN users principal ON la.principal_approval_user_id = principal.id
      WHERE la.status = ?
    `;

    // Start with the status filter for approved leaves
    let values: any[] = [LeaveStatus.PrincipalApproved];

    // Role-based access control
    if (session.user.role_id === UserRole.HOD) {
      // HODs can only see approved leaves for their department
      baseQuery += ' AND u.department_id = ?';
      values.push(session.user.department_id);
    } else if (session.user.role_id === UserRole.Employee) {
      // Employees can only see their own approved leaves
      baseQuery += ' AND la.user_id = ?';
      values.push(session.user.id);
    }
    // Admins, SuperAdmins, and Principals can see all approved leaves

    // Apply additional filters if provided
    if (department_id && [UserRole.Admin, UserRole.SuperAdmin, UserRole.Principal].includes(session.user.role_id as UserRole)) {
      baseQuery += ' AND u.department_id = ?';
      values.push(department_id);
    }

    if (user_id && [UserRole.Admin, UserRole.SuperAdmin, UserRole.Principal, UserRole.HOD].includes(session.user.role_id as UserRole)) {
      baseQuery += ' AND la.user_id = ?';
      values.push(user_id);
    }

    if (leave_type_id) {
      baseQuery += ' AND la.leave_type_id = ?';
      values.push(leave_type_id);
    }

    if (start_date) {
      baseQuery += ' AND la.start_date >= ?';
      values.push(start_date);
    }

    if (end_date) {
      baseQuery += ' AND la.end_date <= ?';
      values.push(end_date);
    }

    // Add order and limit
    baseQuery += ' ORDER BY la.principal_approval_date DESC LIMIT ?';
    values.push(parseInt(limit as string, 10));

    // Execute query
    const approvedLeaves = await db.executeQuery<LeaveApplication[]>({
      query: baseQuery,
      values,
    });

    return res.status(200).json({
      success: true,
      data: approvedLeaves,
    });
  } catch (error: any) {
    console.error('Error in approved leaves API:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while fetching approved leaves',
    });
  }
}
