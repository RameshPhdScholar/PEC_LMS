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
        u.employee_id,
        u.employee_position,
        u.gender,
        u.department_id,
        lt.name as leave_type_name,
        d.name as department_name,
        d.code as department_code,
        hod.full_name as hod_approver_name,
        principal.full_name as principal_approver_name
      FROM leave_applications la
      JOIN users u ON la.user_id = u.id
      JOIN leave_types lt ON la.leave_type_id = lt.id
      LEFT JOIN departments d ON u.department_id = d.id
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

    // Process the results to create properly structured nested objects
    const processedLeaves = approvedLeaves.map(app => {
      const appData = app as any; // Type assertion for SQL join properties
      return {
        ...app,
        user: {
          id: app.user_id,
          full_name: appData.user_name || 'Unknown User',
          employee_id: appData.employee_id || 'Not Set',
          employee_position: appData.employee_position || 'Not Set',
          gender: appData.gender || 'Not Set',
          department: {
            id: appData.department_id || 0,
            name: appData.department_name || 'Unknown Department',
            code: appData.department_code || 'UNK'
          }
        },
        leave_type: {
          id: app.leave_type_id,
          name: appData.leave_type_name || 'Unknown Leave Type'
        },
        hod_approver: appData.hod_approver_name ? {
          full_name: appData.hod_approver_name
        } : undefined,
        principal_approver: appData.principal_approver_name ? {
          full_name: appData.principal_approver_name
        } : undefined
      };
    });

    return res.status(200).json({
      success: true,
      data: processedLeaves as LeaveApplication[],
    });
  } catch (error: any) {
    console.error('Error in approved leaves API:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while fetching approved leaves',
    });
  }
}
