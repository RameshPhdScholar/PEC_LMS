import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { hash } from 'bcryptjs';
import db from '@/lib/db';
import { ApiResponse, User, UserRole, UserWithPassword } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User[] | User>>
) {
  try {
    // GET method - Fetch all users
    if (req.method === 'GET') {
      // Check authentication
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({
          success: false,
          error: 'You must be logged in to perform this action',
        });
      }

      // Only Admin, Super Admin, Principal, and HOD can view users
      if (![UserRole.Admin, UserRole.SuperAdmin, UserRole.Principal, UserRole.HOD].includes(session.user.role_id)) {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to view users',
        });
      }

      const { email } = req.query;

      let query = `
        SELECT u.*, r.name as role_name, d.name as department_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        LEFT JOIN departments d ON u.department_id = d.id
      `;

      const values: any[] = [];

      if (email) {
        query += ' WHERE u.email = ?';
        values.push(email);
      }

      query += ' ORDER BY u.employee_id ASC';

      const users = await db.executeQuery<User[]>({ query, values });

      // Remove password from response
      const usersWithoutPassword = users.map(({ password, ...user }: any) => user);

      return res.status(200).json({
        success: true,
        data: usersWithoutPassword,
      });
    }

    // POST method - Create a new user (register)
    if (req.method === 'POST') {
      // Check if this is an admin creating a user or a public registration
      const session = await getServerSession(req, res, authOptions);
      const isAdminCreation = session && [UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id);

      // If not admin creation, this is a public registration (no authentication required)

      const {
        full_name,
        email,
        phone_number,
        gender,
        department_id,
        employee_id,
        employee_position,
        joining_date,
        password,
        role_id = UserRole.Employee, // Default to Employee role
      } = req.body;

      // Validate required fields
      if (!full_name || !email || !password || !employee_id) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        });
      }

      // Check if email already exists
      const existingUser = await db.executeQuery<UserWithPassword[]>({
        query: 'SELECT * FROM users WHERE email = ?',
        values: [email],
      });

      if (existingUser.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists',
        });
      }

      // Check if employee_id already exists
      const existingEmployeeId = await db.executeQuery<UserWithPassword[]>({
        query: 'SELECT * FROM users WHERE employee_id = ?',
        values: [employee_id],
      });

      if (existingEmployeeId.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'User with this Employee ID already exists',
        });
      }

      // Hash password
      const hashedPassword = await hash(password, 10);

      // Determine approval status based on who is creating the user
      const approvalStatus = isAdminCreation ? 'Approved' : 'Pending';
      const approvedBy = isAdminCreation ? session.user.id : null;
      const approvedAt = isAdminCreation ? new Date() : null;

      // Insert new user
      const userData = {
        full_name,
        email,
        phone_number,
        gender,
        department_id,
        employee_id,
        employee_position,
        joining_date,
        password: hashedPassword,
        role_id,
        approval_status: approvalStatus,
        approved_by: approvedBy,
        approved_at: approvedAt,
      };

      const userId = await db.insertRow({
        table: 'users',
        data: userData,
      });

      // Initialize leave balances only for approved users (admin-created or approved registrations)
      if (approvalStatus === 'Approved') {
        const currentYear = new Date().getFullYear();

        // Get all leave types
        const leaveTypes = await db.executeQuery<{ id: number; name: string }[]>({
          query: 'SELECT id, name FROM leave_types',
        });

        // Create default balances for each leave type
        for (const leaveType of leaveTypes) {
          // Default balance based on leave type
          let defaultBalance = 0;

          // Only Casual Leave gets 12 days by default for every new user
          // All other leave types start with 0 and are updated by Admin as needed
          if (leaveType.name.toLowerCase() === 'casual leave') {
            defaultBalance = 12; // Fixed at 12 per academic year for all users
          } else {
            defaultBalance = 0; // All other leave types start with 0, updated by Admin
          }

          // Insert default balance
          await db.executeQuery({
            query: `
              INSERT INTO leave_balances
              (user_id, leave_type_id, balance, year)
              VALUES (?, ?, ?, ?)
            `,
            values: [userId, leaveType.id, defaultBalance, currentYear],
          });
        }
      }

      // Get the created user
      const query = `
        SELECT u.*, r.name as role_name, d.name as department_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        LEFT JOIN departments d ON u.department_id = d.id
        WHERE u.id = ?
      `;

      const newUser = await db.getRow<UserWithPassword>({
        query,
        values: [userId],
      });

      if (!newUser) {
        return res.status(500).json({
          success: false,
          error: 'Failed to retrieve created user',
        });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      const message = isAdminCreation
        ? 'User created and approved successfully'
        : 'Registration submitted successfully. Please wait for admin approval before you can login.';

      return res.status(201).json({
        success: true,
        data: userWithoutPassword,
        message,
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  } catch (error) {
    console.error('Users API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
