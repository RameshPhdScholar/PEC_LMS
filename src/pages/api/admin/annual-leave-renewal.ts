import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '@/lib/db';
import { ApiResponse, UserRole } from '@/types';

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
        error: 'You must be logged in to perform this action',
      });
    }

    // Only Admin and Super Admin can perform annual leave renewal
    if (![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to perform annual leave renewal',
      });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} not allowed`,
      });
    }

    const { year } = req.body;

    // Validate year
    if (!year || typeof year !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Valid financial year is required',
      });
    }

    // Get all active users
    const users = await db.executeQuery<{ id: number; full_name: string; employee_id: string }[]>({
      query: 'SELECT id, full_name, employee_id FROM users WHERE is_active = 1',
    });

    // Get Casual Leave type
    const casualLeaveType = await db.getRow<{ id: number; name: string }>({
      query: 'SELECT id, name FROM leave_types WHERE LOWER(name) = ?',
      values: ['casual leave'],
    });

    if (!casualLeaveType) {
      return res.status(404).json({
        success: false,
        error: 'Casual Leave type not found in the system',
      });
    }

    let renewedCount = 0;
    let createdCount = 0;
    const processedUsers: string[] = [];

    // Process each user
    for (const user of users) {
      // Check if casual leave balance exists for this user and year
      const existingBalance = await db.getRow<{ id: number; balance: number }>({
        query: `
          SELECT id, balance FROM leave_balances
          WHERE user_id = ? AND leave_type_id = ? AND year = ?
        `,
        values: [user.id, casualLeaveType.id, year],
      });

      if (existingBalance) {
        // Update existing casual leave balance to 12 (annual renewal)
        await db.executeQuery({
          query: `
            UPDATE leave_balances
            SET balance = 12
            WHERE user_id = ? AND leave_type_id = ? AND year = ?
          `,
          values: [user.id, casualLeaveType.id, year],
        });
        renewedCount++;
      } else {
        // Create new casual leave balance for this year
        await db.executeQuery({
          query: `
            INSERT INTO leave_balances
            (user_id, leave_type_id, balance, year)
            VALUES (?, ?, 12, ?)
          `,
          values: [user.id, casualLeaveType.id, year],
        });
        createdCount++;
      }

      processedUsers.push(`${user.employee_id} (${user.full_name})`);
    }

    return res.status(200).json({
      success: true,
      data: {
        year,
        totalUsers: users.length,
        renewedCount,
        createdCount,
        processedUsers,
      },
      message: `Annual casual leave renewal completed for financial year ${year}-${year + 1}. Renewed: ${renewedCount}, Created: ${createdCount}, Total: ${users.length} users processed.`,
    });
  } catch (error: any) {
    console.error('Error in annual leave renewal API:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred during annual leave renewal',
    });
  }
}
