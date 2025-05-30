import { User, UserRole } from '@/types';

/**
 * Utility functions for handling user roles and permissions
 */

/**
 * Type for any user object that has a role_id property
 * This allows us to handle both the User type and the session user object
 */
type UserWithRole = {
  role_id: UserRole;
  [key: string]: any;
};

/**
 * Permission types for different operations
 */
export enum Permission {
  READ_OWN_LEAVES = 'read_own_leaves',
  READ_ALL_LEAVES = 'read_all_leaves',
  READ_DEPARTMENT_LEAVES = 'read_department_leaves',
  APPROVE_LEAVES = 'approve_leaves',
  MANAGE_EMPLOYEES = 'manage_employees',
  MANAGE_DEPARTMENTS = 'manage_departments',
  VIEW_ANALYTICS = 'view_analytics',
  VIEW_ADVANCED_ANALYTICS = 'view_advanced_analytics',
  CREATE_EMPLOYEES = 'create_employees',
  CRUD_EMPLOYEES = 'crud_employees',
  CRUD_LEAVES = 'crud_leaves',
  SYSTEM_ADMIN = 'system_admin'
}

/**
 * Role-based permissions mapping
 */
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.Employee]: [
    Permission.READ_OWN_LEAVES,
    Permission.VIEW_ANALYTICS
  ],
  [UserRole.HOD]: [
    Permission.READ_OWN_LEAVES,
    Permission.READ_DEPARTMENT_LEAVES,
    Permission.APPROVE_LEAVES,
    Permission.VIEW_ANALYTICS
  ],
  [UserRole.Principal]: [
    Permission.READ_OWN_LEAVES,
    Permission.READ_ALL_LEAVES,
    Permission.APPROVE_LEAVES,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_ADVANCED_ANALYTICS
  ],
  [UserRole.Admin]: [
    Permission.READ_ALL_LEAVES,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_ADVANCED_ANALYTICS,
    Permission.CREATE_EMPLOYEES
  ],
  [UserRole.SuperAdmin]: [
    Permission.READ_ALL_LEAVES,
    Permission.CRUD_EMPLOYEES,
    Permission.CRUD_LEAVES,
    Permission.MANAGE_EMPLOYEES,
    Permission.MANAGE_DEPARTMENTS,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_ADVANCED_ANALYTICS,
    Permission.SYSTEM_ADMIN
  ]
};

/**
 * Check if a user has a specific role
 *
 * @param user The user object (can be User from types or session.user)
 * @param roleId The role ID to check
 * @returns boolean indicating if the user has the specified role
 */
export const hasRole = (user: UserWithRole | undefined | null, roleId: UserRole): boolean => {
  if (!user) return false;

  // Direct role match
  return user.role_id === roleId;
};

/**
 * Get all roles that a user has
 *
 * @param user The user object (can be User from types or session.user)
 * @returns Array of role IDs that the user has
 */
export const getUserRoles = (user: UserWithRole | undefined | null): UserRole[] => {
  if (!user) return [];

  return [user.role_id];
};

/**
 * Check if a user has a specific permission
 *
 * @param user The user object (can be User from types or session.user)
 * @param permission The permission to check
 * @returns boolean indicating if the user has the specified permission
 */
export const hasPermission = (user: UserWithRole | undefined | null, permission: Permission): boolean => {
  if (!user) return false;

  const userPermissions = ROLE_PERMISSIONS[user.role_id] || [];
  return userPermissions.includes(permission);
};

/**
 * Get all permissions for a user
 *
 * @param user The user object (can be User from types or session.user)
 * @returns Array of permissions that the user has
 */
export const getUserPermissions = (user: UserWithRole | undefined | null): Permission[] => {
  if (!user) return [];

  return ROLE_PERMISSIONS[user.role_id] || [];
};

/**
 * Check if a user can view day-wise/month-wise analytics
 *
 * @param user The user object (can be User from types or session.user)
 * @returns boolean indicating if the user can view analytics
 */
export const canViewAnalytics = (user: UserWithRole | undefined | null): boolean => {
  return hasPermission(user, Permission.VIEW_ANALYTICS);
};

/**
 * Check if a user can view advanced analytics
 *
 * @param user The user object (can be User from types or session.user)
 * @returns boolean indicating if the user can view advanced analytics
 */
export const canViewAdvancedAnalytics = (user: UserWithRole | undefined | null): boolean => {
  return hasPermission(user, Permission.VIEW_ADVANCED_ANALYTICS);
};

/**
 * Check if a user has read-only permissions on employees and leaves
 *
 * @param user The user object (can be User from types or session.user)
 * @returns boolean indicating if the user has read-only permissions
 */
export const hasReadOnlyPermissions = (user: UserWithRole | undefined | null): boolean => {
  return hasRole(user, UserRole.Admin) && !hasRole(user, UserRole.SuperAdmin);
};

/**
 * Check if a user can perform CRUD operations on employees and leaves
 *
 * @param user The user object (can be User from types or session.user)
 * @returns boolean indicating if the user can perform CRUD operations
 */
export const canPerformCRUD = (user: UserWithRole | undefined | null): boolean => {
  return hasPermission(user, Permission.CRUD_EMPLOYEES) || hasPermission(user, Permission.CRUD_LEAVES);
};

/**
 * Check if a user can apply for leave
 * Only users with Employee role can apply for leave
 *
 * @param user The user object (can be User from types or session.user)
 * @returns boolean indicating if the user can apply for leave
 */
export const canApplyForLeave = (user: UserWithRole | undefined | null): boolean => {
  if (!user) return false;
  return user.role_id === UserRole.Employee;
};

/**
 * Check if a user can approve leave
 * Only users with HOD or Principal role can approve leave
 *
 * @param user The user object (can be User from types or session.user)
 * @returns boolean indicating if the user can approve leave
 */
export const canApproveLeave = (user: UserWithRole | undefined | null): boolean => {
  if (!user) return false;
  return user.role_id === UserRole.HOD || user.role_id === UserRole.Principal;
};

/**
 * Check if a user can manage leave balances
 * Only users with Admin or Super Admin role can manage leave balances
 *
 * @param user The user object (can be User from types or session.user)
 * @returns boolean indicating if the user can manage leave balances
 */
export const canManageLeaveBalances = (user: UserWithRole | undefined | null): boolean => {
  if (!user) return false;
  return user.role_id === UserRole.Admin || user.role_id === UserRole.SuperAdmin;
};
