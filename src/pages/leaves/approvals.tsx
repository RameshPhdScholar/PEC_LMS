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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  HourglassEmpty as PendingIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/Dashboard/Layout';
import { LeaveApplication, LeaveStatus, UserRole } from '@/types';
import { formatDate as formatDateUtil } from '@/utils/format';

export default function LeaveApprovals() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Only HODs and principals can approve leaves
    if (session && ![UserRole.HOD, UserRole.Principal].includes(session.user.role_id)) {
      router.push('/dashboard');
      return;
    }

    const fetchLeaves = async () => {
      try {
        const response = await axios.get('/api/leaves');

        // Filter leaves based on role and status
        let filteredLeaves = response.data.data || [];

        if (session?.user.role_id === UserRole.HOD) {
          // HODs see pending leaves from their department
          filteredLeaves = filteredLeaves.filter(
            (leave: LeaveApplication) => leave.status === LeaveStatus.Pending
          );
        } else if (session?.user.role_id === UserRole.Principal) {
          // Principals see leaves approved by HODs
          filteredLeaves = filteredLeaves.filter(
            (leave: LeaveApplication) => leave.status === LeaveStatus.HODApproved
          );
        }

        setLeaves(filteredLeaves);
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

  const handleApprove = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setActionType('approve');
  };

  const handleReject = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setActionType('reject');
    setRejectionReason('');
  };

  const handleCloseDialog = () => {
    setSelectedLeave(null);
    setActionType(null);
    setRejectionReason('');
  };

  const handleConfirmAction = async () => {
    if (!selectedLeave) return;

    setProcessing(true);
    setError(''); // Clear any previous errors

    try {
      let response;
      if (actionType === 'approve') {
        response = await axios.post(`/api/leaves/${selectedLeave.id}/approve`);
        console.log('Approval response:', response.data);
      } else if (actionType === 'reject') {
        response = await axios.post(`/api/leaves/${selectedLeave.id}/reject`, {
          rejection_reason: rejectionReason,
        });
        console.log('Rejection response:', response.data);
      }

      // Refresh the list
      const listResponse = await axios.get('/api/leaves');
      console.log('Refreshed leaves:', listResponse.data);

      // Filter leaves based on role and status
      let filteredLeaves = listResponse.data.data || [];

      if (session?.user.role_id === UserRole.HOD) {
        // HODs see pending leaves from their department
        filteredLeaves = filteredLeaves.filter(
          (leave: LeaveApplication) => leave.status === LeaveStatus.Pending
        );
      } else if (session?.user.role_id === UserRole.Principal) {
        // Principals see leaves approved by HODs
        filteredLeaves = filteredLeaves.filter(
          (leave: LeaveApplication) => leave.status === LeaveStatus.HODApproved
        );
      }

      setLeaves(filteredLeaves);
      handleCloseDialog();

      // Show success message
      console.log(`Leave application ${actionType}d successfully`);
    } catch (error: any) {
      console.error('Error processing leave action:', error);
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.error || `Failed to ${actionType} leave application`);
    } finally {
      setProcessing(false);
    }
  };

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
        <title>Leave Approvals | Leave Management System</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
            {session?.user.role_id === UserRole.HOD ? 'Pending Leave Approvals' : 'HOD Approved Leaves'}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {leaves.length === 0 ? (
            <Box textAlign="center" py={5}>
              <Typography variant="body1" color="text.secondary">
                No pending leave applications found.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Leave Type</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Days</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell>{leave.user_name || leave.user?.full_name || 'Unknown'}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {leave.employee_id || leave.user?.employee_id || 'Unknown'}
                        </Typography>
                      </TableCell>
                      <TableCell>{leave.department_name || leave.user?.department?.name || 'Unknown'}</TableCell>
                      <TableCell>{leave.leave_type_name || leave.leave_type?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                      </TableCell>
                      <TableCell>{leave.days}</TableCell>
                      <TableCell>{getStatusChip(leave.status)}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleApprove(leave)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleReject(leave)}
                          >
                            Reject
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      {/* Approval Dialog */}
      <Dialog open={actionType === 'approve' && selectedLeave !== null} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Approval</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to approve the leave application for{' '}
            <strong>{selectedLeave?.user?.full_name}</strong> from{' '}
            <strong>{formatDate(selectedLeave?.start_date || '')}</strong> to{' '}
            <strong>{formatDate(selectedLeave?.end_date || '')}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={processing}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            color="success"
            variant="contained"
            disabled={processing}
          >
            {processing ? <CircularProgress size={24} /> : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={actionType === 'reject' && selectedLeave !== null} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Rejection</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to reject the leave application for{' '}
            <strong>{selectedLeave?.user?.full_name}</strong>?
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="rejection_reason"
            label="Reason for Rejection"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={processing}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            color="error"
            variant="contained"
            disabled={processing || !rejectionReason.trim()}
          >
            {processing ? <CircularProgress size={24} /> : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
