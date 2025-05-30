import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import db from '@/lib/db';
import { ApiResponse, LeaveApplication, LeaveStatus, UserRole } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LeaveApplication>>
) {
  try {
    // Only POST method is allowed
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} not allowed`,
      });
    }

    // Check authentication
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'You must be logged in to perform this action',
      });
    }

    // Only HODs and Principals can reject leaves
    if (![UserRole.HOD, UserRole.Principal].includes(session.user.role_id)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to reject leave applications',
      });
    }

    const { id } = req.query;
    const { rejection_reason } = req.body;

    // Validate rejection reason
    if (!rejection_reason) {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required',
      });
    }

    // Get the leave application
    const leaveApplication = await db.getRow<LeaveApplication & { department_id: number }>({
      query: `
        SELECT la.*, u.department_id
        FROM leave_applications la
        JOIN users u ON la.user_id = u.id
        WHERE la.id = ?
      `,
      values: [id],
    });

    if (!leaveApplication) {
      return res.status(404).json({
        success: false,
        error: 'Leave application not found',
      });
    }

    // Check if the leave application is in the correct state for rejection
    if (session.user.role_id === UserRole.HOD) {
      // HODs can only reject pending applications from their department
      if (leaveApplication.status !== LeaveStatus.Pending) {
        return res.status(400).json({
          success: false,
          error: 'Leave application is not in a pending state',
        });
      }

      // For HOD users, we need to get their department_id
      // First check if they are a system user (HOD from system_users table)
      let hodUser = await db.getRow<{ department_id: number; user_id?: number }>({
        query: `
          SELECT department_id FROM users
          WHERE email = ? AND role_id = ?
        `,
        values: [session.user.email, UserRole.HOD],
      });

      // If not found in users table, they might be a system user
      if (!hodUser || !hodUser.department_id) {
        // For system HODs, determine department from email pattern
        const emailPrefix = session.user.email.split('@')[0];
        const deptCode = emailPrefix.split('.')[0].toUpperCase();

        // Map department codes to IDs
        const deptMapping: { [key: string]: number } = {
          'CSE': 1, 'CSD': 2, 'CSC': 3, 'CSM': 4, 'CE': 5,
          'EEE': 6, 'ECE': 7, 'HAS': 8, 'H&S': 8, 'MBA': 9, 'ADMIN': 10
        };

        const departmentId = deptMapping[deptCode];
        if (!departmentId) {
          return res.status(403).json({
            success: false,
            error: 'Cannot determine HOD department from email',
          });
        }

        hodUser = { department_id: departmentId, user_id: undefined };
      } else {
        // Regular user HOD - get their user ID for the foreign key
        const userHod = await db.getRow<{ id: number }>({
          query: `SELECT id FROM users WHERE email = ? AND role_id = ?`,
          values: [session.user.email, UserRole.HOD],
        });
        hodUser.user_id = userHod?.id;
      }

      // Check if the HOD is from the same department as the employee
      if (leaveApplication.department_id !== hodUser.department_id) {
        return res.status(403).json({
          success: false,
          error: 'You can only reject leave applications from your department',
        });
      }
    } else if (session.user.role_id === UserRole.Principal) {
      // Principals can only reject applications that have been approved by HODs
      if (leaveApplication.status !== LeaveStatus.HODApproved) {
        return res.status(400).json({
          success: false,
          error: 'Leave application has not been approved by HOD',
        });
      }
    }

    // Determine the user ID for rejection
    let rejectionUserId = null;
    if (session.user.role_id === UserRole.HOD) {
      // Use the HOD user ID if available
      rejectionUserId = hodUser?.user_id || null;
    } else if (session.user.role_id === UserRole.Principal) {
      // Check if Principal exists in users table
      const principalUser = await db.getRow<{ id: number }>({
        query: `SELECT id FROM users WHERE email = ? AND role_id = ?`,
        values: [session.user.email, UserRole.Principal],
      });
      rejectionUserId = principalUser?.id || null;
    }

    // Update the leave application status to Rejected
    await db.executeQuery({
      query: `
        UPDATE leave_applications
        SET status = ?, rejection_date = NOW(), rejection_user_id = ?, rejection_reason = ?
        WHERE id = ?
      `,
      values: [LeaveStatus.Rejected, rejectionUserId, rejection_reason, id],
    });

    // Add to leave history (only if user exists in users table)
    if (rejectionUserId) {
      await db.executeQuery({
        query: `
          INSERT INTO leave_history
          (leave_application_id, action, action_by_user_id, previous_status, new_status, comments)
          VALUES (?, 'Rejected', ?, ?, ?, ?)
        `,
        values: [
          id,
          rejectionUserId,
          leaveApplication.status,
          LeaveStatus.Rejected,
          rejection_reason,
        ],
      });
    }

    // Get the updated leave application
    const updatedLeaveApplication = await db.getRow<LeaveApplication>({
      query: `
        SELECT la.*,
          lt.name as leave_type_name,
          u.full_name as user_name,
          d.name as department_name
        FROM leave_applications la
        JOIN leave_types lt ON la.leave_type_id = lt.id
        JOIN users u ON la.user_id = u.id
        JOIN departments d ON u.department_id = d.id
        WHERE la.id = ?
      `,
      values: [id],
    });

    return res.status(200).json({
      success: true,
      data: updatedLeaveApplication || undefined,
      message: 'Leave application rejected successfully',
    });
  } catch (error: any) {
    console.error('Error in leave rejection API:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
