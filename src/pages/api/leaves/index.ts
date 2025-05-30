import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '@/lib/db';
import { ApiResponse, LeaveApplication, UserRole } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LeaveApplication[] | LeaveApplication>>
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

    // GET method - Fetch leave applications
    if (req.method === 'GET') {
      let query = '';
      let values: any[] = [];

      // Different queries based on user role
      if ([UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
        // Admins can see all leave applications with detailed information
        query = `
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
          ORDER BY la.created_at DESC
        `;
      } else if ([UserRole.HOD, UserRole.Principal].includes(session.user.role_id)) {
        // HODs can see leave applications from their department
        // Principals can see all leave applications that have been approved by HODs
        if (session.user.role_id === UserRole.HOD) {
          // For HOD users, we need to get their department_id from the users table
          // since HODs might be stored in system_users table without department_id
          const hodUser = await db.getRow<{ department_id: number }>({
            query: `
              SELECT department_id FROM users
              WHERE email = ? AND role_id = ?
            `,
            values: [session.user.email, UserRole.HOD],
          });

          if (!hodUser || !hodUser.department_id) {
            return res.status(403).json({
              success: false,
              error: 'HOD department information not found',
            });
          }

          query = `
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
            WHERE u.department_id = ?
            ORDER BY la.created_at DESC
          `;
          values = [hodUser.department_id];
        } else {
          // Principal sees all leave applications (for dashboard history)
          query = `
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
            ORDER BY la.created_at DESC
          `;
        }
      } else {
        // Regular employees can only see their own leave applications
        query = `
          SELECT la.*,
            u.full_name as user_name,
            u.employee_id,
            u.employee_position,
            u.gender,
            u.department_id,
            lt.name as leave_type_name,
            d.name as department_name,
            d.code as department_code
          FROM leave_applications la
          JOIN users u ON la.user_id = u.id
          JOIN leave_types lt ON la.leave_type_id = lt.id
          LEFT JOIN departments d ON u.department_id = d.id
          WHERE la.user_id = ?
          ORDER BY la.created_at DESC
        `;
        values = [session.user.id];
      }

      const leaveApplications = await db.executeQuery<LeaveApplication[]>({
        query,
        values,
      });

      // Process the results to create properly structured nested objects
      const processedApplications = leaveApplications.map(app => {
        const appData = app as any; // Type assertion for SQL join properties
        return {
          ...app,
          user: {
            id: app.user_id,
            full_name: appData.user_name || session.user.name || session.user.email?.split('@')[0] || 'Unknown User',
            employee_id: appData.employee_id || session.user.employee_id || 'Not Set',
            employee_position: appData.employee_position || 'Not Set',
            gender: appData.gender || 'Not Set',
            department: {
              id: appData.department_id || session.user.department_id || 0,
              name: appData.department_name || session.user.department_name || 'Unknown Department',
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
        data: processedApplications as LeaveApplication[],
      });
    }

    // POST method - Create a new leave application
    if (req.method === 'POST') {
      // Only employees, HODs, and Principals can apply for leave
      if (![UserRole.Employee, UserRole.HOD, UserRole.Principal].includes(session.user.role_id)) {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to apply for leave',
        });
      }

      const { leave_type_id, start_date, end_date, days, reason } = req.body;

      // Validate required fields
      if (!leave_type_id || leave_type_id === 0) {
        return res.status(400).json({
          success: false,
          error: 'Leave type is required',
        });
      }

      if (!start_date) {
        return res.status(400).json({
          success: false,
          error: 'Start date is required',
        });
      }

      if (!end_date) {
        return res.status(400).json({
          success: false,
          error: 'End date is required',
        });
      }

      if (!days || days <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Number of days is required and must be greater than 0',
        });
      }

      if (!reason || reason.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Reason for leave is required',
        });
      }

      if (reason.trim().length < 10) {
        return res.status(400).json({
          success: false,
          error: 'Reason for leave must be at least 10 characters',
        });
      }

      // Check if user has enough leave balance
      const leaveBalance = await db.getRow<{ balance: number }>({
        query: `
          SELECT * FROM leave_balances
          WHERE user_id = ? AND leave_type_id = ? AND year = YEAR(CURDATE())
        `,
        values: [session.user.id, leave_type_id],
      });

      if (!leaveBalance || leaveBalance.balance < days) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient leave balance',
        });
      }

      // Insert the leave application
      const result = await db.executeQuery<{ insertId: number }>({
        query: `
          INSERT INTO leave_applications
          (user_id, leave_type_id, start_date, end_date, days, reason, status)
          VALUES (?, ?, ?, ?, ?, ?, 'Pending')
        `,
        values: [session.user.id, leave_type_id, start_date, end_date, days, reason],
      });

      if (!result.insertId) {
        return res.status(500).json({
          success: false,
          error: 'Failed to create leave application',
        });
      }

      // Get the created leave application
      const leaveApplication = await db.getRow<LeaveApplication>({
        query: `
          SELECT la.*,
            u.full_name as user_name,
            u.employee_id,
            u.employee_position,
            u.gender,
            u.department_id,
            lt.name as leave_type_name,
            d.name as department_name,
            d.code as department_code
          FROM leave_applications la
          JOIN users u ON la.user_id = u.id
          JOIN leave_types lt ON la.leave_type_id = lt.id
          LEFT JOIN departments d ON u.department_id = d.id
          WHERE la.id = ?
        `,
        values: [result.insertId],
      });

      // Process the result to create properly structured nested objects
      if (leaveApplication) {
        const appData = leaveApplication as any; // Type assertion for SQL join properties
        const processedApplication = {
          ...leaveApplication,
          user: {
            id: leaveApplication.user_id,
            full_name: appData.user_name || session.user.name || session.user.email?.split('@')[0] || 'Unknown User',
            employee_id: appData.employee_id || session.user.employee_id || 'Not Set',
            employee_position: appData.employee_position || 'Not Set',
            gender: appData.gender || 'Not Set',
            department: {
              id: appData.department_id || session.user.department_id || 0,
              name: appData.department_name || session.user.department_name || 'Unknown Department',
              code: appData.department_code || 'UNK'
            }
          },
          leave_type: {
            id: leaveApplication.leave_type_id,
            name: appData.leave_type_name || 'Unknown Leave Type'
          }
        };

        return res.status(201).json({
          success: true,
          data: processedApplication as LeaveApplication,
          message: 'Leave application submitted successfully',
        });
      }

      // Add to leave history
      await db.executeQuery({
        query: `
          INSERT INTO leave_history
          (leave_application_id, action, action_by_user_id, new_status)
          VALUES (?, 'Applied', ?, 'Pending')
        `,
        values: [result.insertId, session.user.id],
      });

      return res.status(500).json({
        success: false,
        error: 'Failed to process leave application',
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  } catch (error: any) {
    console.error('Error in leave applications API:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
