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

    // Only Admin and Super Admin can initialize leave balances
    if (![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to initialize leave balances',
      });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} not allowed`,
      });
    }

    const { year } = req.body;

    if (!year) {
      return res.status(400).json({
        success: false,
        error: 'Year is required',
      });
    }

    // Get all users
    const users = await db.executeQuery<{ id: number; full_name: string }[]>({
      query: 'SELECT id, full_name FROM users WHERE is_active = 1',
    });

    // Get all leave types
    const leaveTypes = await db.executeQuery<{ id: number; name: string }[]>({
      query: 'SELECT id, name FROM leave_types',
    });

    let createdCount = 0;
    let updatedCount = 0;

    // Initialize balances for each user and leave type
    for (const user of users) {
      for (const leaveType of leaveTypes) {
        // Check if balance already exists
        const existingBalance = await db.getRow<{ id: number }>({
          query: `
            SELECT id FROM leave_balances
            WHERE user_id = ? AND leave_type_id = ? AND year = ?
          `,
          values: [user.id, leaveType.id, year],
        });

        // Default balance based on leave type
        let defaultBalance = 0;

        // Only Casual Leave gets 12 days by default for all users (new and existing)
        // All other leave types start with 0 and are updated by Admin as needed
        if (leaveType.name.toLowerCase() === 'casual leave') {
          defaultBalance = 12; // Fixed at 12 per financial year for all users
        } else {
          defaultBalance = 0; // All other leave types start with 0, updated by Admin
        }

        if (existingBalance) {
          // For Casual Leave: Always ensure it's set to 12 for existing users (annual renewal)
          // For Other Leave Types: Don't update existing balances (preserve admin-set values)
          if (leaveType.name.toLowerCase() === 'casual leave') {
            await db.executeQuery({
              query: `
                UPDATE leave_balances
                SET balance = ?
                WHERE user_id = ? AND leave_type_id = ? AND year = ?
              `,
              values: [12, user.id, leaveType.id, year],
            });
            updatedCount++;
          }
          // Skip updating other leave types if they already exist (preserve admin settings)
        } else {
          // Create new balance for any missing leave type
          await db.executeQuery({
            query: `
              INSERT INTO leave_balances
              (user_id, leave_type_id, balance, year)
              VALUES (?, ?, ?, ?)
            `,
            values: [user.id, leaveType.id, defaultBalance, year],
          });
          createdCount++;
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Leave balances initialized successfully. Created: ${createdCount}, Updated: ${updatedCount}`,
      data: {
        year,
        usersProcessed: users.length,
        leaveTypesProcessed: leaveTypes.length,
        createdCount,
        updatedCount,
      },
    });
  } catch (error) {
    console.error('Error initializing leave balances:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
