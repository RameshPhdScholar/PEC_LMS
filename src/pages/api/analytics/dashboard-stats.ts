import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '@/lib/db';
import { ApiResponse, UserRole, DashboardStats, LeaveDistribution, DepartmentLeaveDistribution, MonthlyLeaveData } from '@/types';

interface AnalyticsResponse {
  dashboardStats: DashboardStats;
  leaveStatusDistribution: { status: string; count: number }[];
  leaveTypeDistribution: LeaveDistribution[];
  departmentLeaveDistribution: DepartmentLeaveDistribution[];
  monthlyLeaveData: MonthlyLeaveData[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<AnalyticsResponse>>
) {
  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'You must be logged in to access this resource',
      });
    }

    // Different queries based on user role
    let departmentFilter = '';
    let departmentValues: any[] = [];

    // For HODs, filter by department
    if (session.user.role_id === UserRole.HOD) {
      // Get HOD's department from their email
      const hodEmail = session.user.email;
      let hodDepartmentId = null;

      if (hodEmail) {
        // Extract department code from email (e.g., csm.hod@... -> CSM)
        const emailPrefix = hodEmail.split('@')[0];
        const departmentCode = emailPrefix.split('.')[0].toUpperCase();

        // Map department codes to IDs
        const departmentMap: { [key: string]: number } = {
          'CSE': 1,
          'CSD': 2,
          'CSC': 3,
          'CSM': 4,
          'CE': 5,
          'EEE': 6,
          'ECE': 7,
          'HAS': 8,
          'H&S': 8,
          'MBA': 9,
          'ADMIN': 10
        };

        hodDepartmentId = departmentMap[departmentCode] || null;
      }

      if (hodDepartmentId) {
        departmentFilter = 'WHERE u.department_id = ?';
        departmentValues = [hodDepartmentId];
      }
    }

    // Get dashboard stats
    const dashboardStatsQuery = `
      SELECT
        (SELECT COUNT(*) FROM users u ${departmentFilter ? departmentFilter : ''}) as totalEmployees,
        (SELECT COUNT(*) FROM leave_applications la
          JOIN users u ON la.user_id = u.id
          ${departmentFilter ? departmentFilter : ''}) as totalLeaveApplications,
        (SELECT COUNT(*) FROM leave_applications la
          JOIN users u ON la.user_id = u.id
          ${departmentFilter ? departmentFilter : ''}
          ${departmentFilter ? 'AND' : 'WHERE'} (la.status = 'Pending' OR la.status = 'HOD Approved')) as pendingLeaveApplications,
        (SELECT COUNT(*) FROM leave_applications la
          JOIN users u ON la.user_id = u.id
          ${departmentFilter ? departmentFilter : ''}
          ${departmentFilter ? 'AND' : 'WHERE'} la.status = 'Principal Approved') as approvedLeaveApplications,
        (SELECT COUNT(*) FROM leave_applications la
          JOIN users u ON la.user_id = u.id
          ${departmentFilter ? departmentFilter : ''}
          ${departmentFilter ? 'AND' : 'WHERE'} (la.status = 'Rejected' OR la.status = 'Cancelled')) as rejectedLeaveApplications
    `;

    // For dashboard stats, we need to repeat the department value for each subquery
    const dashboardStatsValues = departmentValues.length > 0 ?
      Array(5).fill(departmentValues[0]) : [];

    const dashboardStats = await db.getRow<DashboardStats>({
      query: dashboardStatsQuery,
      values: dashboardStatsValues,
    });

    // Get leave status distribution
    const leaveStatusQuery = `
      SELECT la.status, COUNT(*) as count
      FROM leave_applications la
      JOIN users u ON la.user_id = u.id
      ${departmentFilter ? departmentFilter : ''}
      GROUP BY la.status
      ORDER BY count DESC
    `;

    const leaveStatusDistribution = await db.executeQuery<{ status: string; count: number }[]>({
      query: leaveStatusQuery,
      values: departmentValues,
    });

    // Get leave type distribution
    const leaveTypeQuery = `
      SELECT lt.name as leave_type, COUNT(*) as count
      FROM leave_applications la
      JOIN leave_types lt ON la.leave_type_id = lt.id
      JOIN users u ON la.user_id = u.id
      ${departmentFilter ? departmentFilter : ''}
      GROUP BY lt.name
      ORDER BY count DESC
    `;

    const leaveTypeDistribution = await db.executeQuery<LeaveDistribution[]>({
      query: leaveTypeQuery,
      values: departmentValues,
    });

    // Get department leave distribution (only for admin and principal)
    let departmentLeaveDistribution: DepartmentLeaveDistribution[] = [];

    if ([UserRole.Admin, UserRole.SuperAdmin, UserRole.Principal].includes(session.user.role_id)) {
      const departmentQuery = `
        SELECT d.name as department, COUNT(la.id) as count
        FROM departments d
        LEFT JOIN users u ON d.id = u.department_id
        LEFT JOIN leave_applications la ON u.id = la.user_id
        GROUP BY d.name
        ORDER BY count DESC
      `;

      departmentLeaveDistribution = await db.executeQuery<DepartmentLeaveDistribution[]>({
        query: departmentQuery,
        values: [],
      });
    }

    // Get monthly leave data
    const monthlyQuery = `
      SELECT
        DATE_FORMAT(la.created_at, '%b %Y') as month,
        COUNT(*) as count
      FROM leave_applications la
      JOIN users u ON la.user_id = u.id
      ${departmentFilter ? departmentFilter : ''}
      ${departmentFilter ? 'AND' : 'WHERE'} la.created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY month
      ORDER BY MIN(la.created_at)
    `;

    const monthlyLeaveData = await db.executeQuery<MonthlyLeaveData[]>({
      query: monthlyQuery,
      values: departmentValues,
    });

    return res.status(200).json({
      success: true,
      data: {
        dashboardStats: dashboardStats || {
          totalEmployees: 0,
          totalLeaveApplications: 0,
          pendingLeaveApplications: 0,
          approvedLeaveApplications: 0,
          rejectedLeaveApplications: 0,
        },
        leaveStatusDistribution: leaveStatusDistribution || [],
        leaveTypeDistribution: leaveTypeDistribution || [],
        departmentLeaveDistribution: departmentLeaveDistribution || [],
        monthlyLeaveData: monthlyLeaveData || [],
      },
    });
  } catch (error: any) {
    console.error('Error fetching analytics data:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
