// User related types
export enum UserRole {
  Employee = 1,
  HOD = 2,
  Principal = 3,
  Admin = 4,
  SuperAdmin = 5
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum UserApprovalStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  gender?: Gender;
  department_id?: number;
  employee_id: string;
  employee_position?: string;
  joining_date?: string;
  role_id: UserRole;
  is_active: boolean;
  approval_status: UserApprovalStatus;
  approved_by?: number;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  department?: Department;
  role?: Role;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface AdminUser {
  id: number;
  email: string;
  password: string;
  role_id: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  role?: Role;
}

export interface Role {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// Department related types
export interface Department {
  id: number;
  name: string;
  code: string;
  created_at?: string;
  updated_at?: string;
}

// Leave related types
export interface LeaveType {
  id: number;
  name: string;
  description?: string;
  max_days_allowed?: number;
  created_at: string;
  updated_at: string;
}

export enum LeaveStatus {
  Pending = 'Pending',
  HODApproved = 'HOD Approved',
  PrincipalApproved = 'Principal Approved',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled'
}

export interface LeaveApplication {
  id: number;
  user_id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  days: number;
  reason?: string;
  status: LeaveStatus;
  hod_approval_date?: string;
  hod_approval_user_id?: number;
  principal_approval_date?: string;
  principal_approval_user_id?: number;
  rejection_date?: string;
  rejection_user_id?: number;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  leave_type?: LeaveType;
  hod_approver?: User;
  principal_approver?: User;
  rejector?: User;
  // Additional properties from API joins
  user_name?: string;
  employee_id?: string;
  leave_type_name?: string;
  department_name?: string;
}

export interface LeaveBalance {
  id: number;
  user_id: number;
  leave_type_id: number;
  balance: number;
  year: number;
  created_at: string;
  updated_at: string;
  user?: User;
  leave_type?: LeaveType;
  // Additional properties from API joins
  user_name?: string;
  employee_id?: string;
  leave_type_name?: string;
}

export interface LeaveHistory {
  id: number;
  leave_application_id: number;
  action: string;
  action_by_user_id: number;
  previous_status?: string;
  new_status?: string;
  comments?: string;
  created_at: string;
  leave_application?: LeaveApplication;
  action_by_user?: User;
}

// Dashboard related types
export interface DashboardStats {
  totalEmployees: number;
  totalLeaveApplications: number;
  pendingLeaveApplications: number;
  approvedLeaveApplications: number;
  rejectedLeaveApplications: number;
}

export interface LeaveDistribution {
  leave_type: string;
  count: number;
}

export interface DepartmentLeaveDistribution {
  department: string;
  count: number;
}

export interface MonthlyLeaveData {
  month: string;
  count: number;
}

// Form related types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  full_name: string;
  email: string;
  phone_number: string;
  gender: Gender;
  department_id: number;
  employee_id: string;
  employee_position: string;
  joining_date: string;
  password: string;
  confirm_password: string;
  role_id: UserRole;
}

export interface LeaveApplicationFormData {
  leave_type_id: number;
  start_date: string;
  end_date: string;
  reason?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
