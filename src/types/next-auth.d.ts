import { UserRole } from '.';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      name?: string;
      email: string;
      image?: string;
      role_id: UserRole;
      role_name: string;
      department_id?: number;
      department_name?: string;
      employee_id?: string;
      isAdminUser: boolean;
    };
  }

  interface User {
    id: number;
    name?: string;
    email: string;
    image?: string;
    role_id: UserRole;
    role_name: string;
    department_id?: number;
    department_name?: string;
    employee_id?: string;
    isAdminUser: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    role_id: UserRole;
    role_name: string;
    department_id?: number;
    department_name?: string;
    employee_id?: string;
    isAdminUser: boolean;
  }
}
