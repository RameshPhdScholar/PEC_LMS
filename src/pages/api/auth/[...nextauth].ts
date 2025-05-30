import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import db from '@/lib/db';
import { User, UserRole, AdminUser } from '@/types';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('NextAuth authorize called with credentials:', {
          email: credentials?.email,
          passwordProvided: !!credentials?.password
        });
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        // First, try to find a system user by email
        const systemQuery = `
          SELECT s.*, r.name as role_name
          FROM system_users s
          LEFT JOIN roles r ON s.role_id = r.id
          WHERE s.email = ? AND s.is_active = 1
        `;

        console.log('Looking for system user with email:', credentials?.email);
        const systemUsers = await db.executeQuery<any[]>({
          query: systemQuery,
          values: [credentials.email]
        });

        // If system user found, verify password
        if (systemUsers.length > 0) {
          console.log('System user found:', {
            id: systemUsers[0].id,
            email: systemUsers[0].email,
            role_id: systemUsers[0].role_id,
            role_name: systemUsers[0].role_name,
            is_active: systemUsers[0].is_active,
            passwordHash: systemUsers[0].password?.substring(0, 10) + '...'
          });
          const systemUser = systemUsers[0];

          // Verify password
          console.log('Validating system user password...');
          const isPasswordValid = await compare(credentials.password, systemUser.password);
          console.log('System user password validation result:', isPasswordValid);

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          // Return system user without password
          const { password, ...systemWithoutPassword } = systemUser;

          // Add required fields for NextAuth
          return {
            ...systemWithoutPassword,
            name: systemUser.email.split('@')[0], // Use part of email as name
            isAdminUser: true,
            // Set default values for fields that are required but not in system_users table
            employee_id: undefined,
            department_id: undefined,
            department_name: undefined
          };
        }

        // If no system user found, try to find a regular user
        const userQuery = `
          SELECT u.*, r.name as role_name, d.name as department_name
          FROM users u
          LEFT JOIN roles r ON u.role_id = r.id
          LEFT JOIN departments d ON u.department_id = d.id
          WHERE u.email = ? AND u.is_active = 1 AND u.approval_status = 'Approved'
        `;

        console.log('Looking for regular user with email:', credentials?.email);
        const users = await db.executeQuery<any[]>({
          query: userQuery,
          values: [credentials.email]
        });

        if (users.length === 0) {
          console.log('No approved regular user found with this email');

          // Check if user exists but is not approved
          const pendingUserQuery = `
            SELECT u.approval_status
            FROM users u
            WHERE u.email = ? AND u.is_active = 1
          `;

          const pendingUsers = await db.executeQuery<any[]>({
            query: pendingUserQuery,
            values: [credentials.email]
          });

          if (pendingUsers.length > 0) {
            const approvalStatus = pendingUsers[0].approval_status;
            if (approvalStatus === 'Pending') {
              throw new Error('Your registration is pending admin approval. Please wait for approval before logging in.');
            } else if (approvalStatus === 'Rejected') {
              throw new Error('Your registration has been rejected. Please contact the administrator.');
            }
          }

          throw new Error('No user found with this email');
        }

        const user = users[0];

        // Verify password
        console.log('Regular user found:', {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role_id: user.role_id,
            role_name: user.role_name,
            is_active: user.is_active,
            passwordHash: user.password?.substring(0, 10) + '...'
          });
          console.log('Validating regular user password...');
          const isPasswordValid = await compare(credentials.password, user.password);
          console.log('Regular user password validation result:', isPasswordValid);

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return {
          ...userWithoutPassword,
          name: user.full_name,
          isAdminUser: false
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback called with user:', user ? {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name,
        isAdminUser: user.isAdminUser
      } : 'No user');

      if (user) {
        token.id = Number(user.id);
        token.role_id = Number(user.role_id);
        token.role_name = String(user.role_name);
        token.isAdminUser = Boolean(user.isAdminUser);

        // Only set these fields for regular users
        if (!user.isAdminUser) {
          token.department_id = user.department_id ? Number(user.department_id) : undefined;
          token.department_name = user.department_name ? String(user.department_name) : undefined;
          token.employee_id = String(user.employee_id);
        }

        console.log('JWT token after update:', token);
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback called with token:', token ? {
        id: token.id,
        role_id: token.role_id,
        role_name: token.role_name,
        isAdminUser: token.isAdminUser
      } : 'No token');

      if (token) {
        session.user.id = token.id as number;
        session.user.role_id = token.role_id as UserRole;
        session.user.role_name = token.role_name as string;
        session.user.isAdminUser = token.isAdminUser as boolean;

        // Only set these fields for regular users
        if (!token.isAdminUser) {
          session.user.department_id = token.department_id as number;
          session.user.department_name = token.department_name as string;
          session.user.employee_id = token.employee_id as string;
        }

        console.log('Session after update:', session);
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
