import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  CircularProgress,
} from '@mui/material';
import DashboardLayout from '@/components/Dashboard/Layout';
import { UserRole } from '@/types';

export default function EmployeeCredentials() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    if (status !== 'loading') {
      router.push('/dashboard');
    }
  }, [status, router]);

  // Show loading indicator while redirecting
  return (
    <DashboardLayout>
      <Head>
        <title>Redirecting... | Leave Management System</title>
      </Head>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    </DashboardLayout>
  );
}
