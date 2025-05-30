import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Divider,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  HourglassEmpty as PendingIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/Dashboard/Layout';
import { LeaveApplication, LeaveStatus, UserRole } from '@/types';
import { formatDate as formatDateUtil } from '@/utils/format';

export default function MyLeaves() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Only employees, HODs, and principals can view their leaves
    if (session && ![UserRole.Employee, UserRole.HOD, UserRole.Principal].includes(session.user.role_id)) {
      router.push('/dashboard');
      return;
    }

    const fetchLeaves = async () => {
      try {
        const response = await axios.get('/api/leaves');
        let leavesData = response.data.data || [];

        // For HODs and Principals, filter to only show their own leave applications
        if (session?.user.role_id && [UserRole.HOD, UserRole.Principal].includes(session.user.role_id as UserRole)) {
          leavesData = leavesData.filter((leave: LeaveApplication) => leave.user_id === session.user.id);
        }

        setLeaves(leavesData);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching leaves:', error);
        setError(error.response?.data?.error || 'Failed to fetch leave applications');
        setLoading(false);
      }
    };

    if (session) {
      fetchLeaves();
    }
  }, [session, status, router]);

  const getStatusChip = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.Pending:
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" size="small" />;
      case LeaveStatus.HODApproved:
        return <Chip icon={<PendingIcon />} label="HOD Approved" color="info" size="small" />;
      case LeaveStatus.PrincipalApproved:
        return <Chip icon={<ApprovedIcon />} label="Approved" color="success" size="small" />;
      case LeaveStatus.Rejected:
        return <Chip icon={<RejectedIcon />} label="Rejected" color="error" size="small" />;
      case LeaveStatus.Cancelled:
        return <Chip icon={<RejectedIcon />} label="Cancelled" color="default" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return formatDateUtil(dateString);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Head>
        <title>My Leaves | Leave Management System</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h1" fontWeight="bold">
              My Leave Applications
            </Typography>
            {[UserRole.Employee, UserRole.HOD, UserRole.Principal].includes(session?.user.role_id as UserRole) && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => router.push('/leaves/apply')}
              >
                Apply for Leave
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {leaves.length === 0 ? (
            <Box textAlign="center" py={5}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No leave applications found.
              </Typography>
              {[UserRole.Employee, UserRole.HOD, UserRole.Principal].includes(session?.user.role_id as UserRole) && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/leaves/apply')}
                  sx={{ mt: 2 }}
                >
                  Apply for Your First Leave
                </Button>
              )}
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Leave Type</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Days</TableCell>
                    <TableCell>Applied On</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell>{leave.leave_type?.name || leave.leave_type_name}</TableCell>
                      <TableCell>{formatDate(leave.start_date)}</TableCell>
                      <TableCell>{formatDate(leave.end_date)}</TableCell>
                      <TableCell>{leave.days}</TableCell>
                      <TableCell>{formatDate(leave.created_at)}</TableCell>
                      <TableCell>{getStatusChip(leave.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </DashboardLayout>
  );
}
