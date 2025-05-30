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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
} from '@mui/material';
import {
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  HourglassEmpty as PendingIcon,
  FileDownload as DownloadIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/Dashboard/Layout';
import { LeaveApplication, LeaveStatus, UserRole, LeaveType } from '@/types';
import { formatDate as formatDateUtil } from '@/utils/format';
import { format } from 'date-fns';

export default function DepartmentLeaves() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [filteredLeaves, setFilteredLeaves] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

  // Filters
  const [filters, setFilters] = useState({
    leave_type_id: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Only HODs can access this page
    if (session && session.user.role_id !== UserRole.HOD) {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all leaves
        const leavesResponse = await axios.get('/api/leaves');
        const leavesData = leavesResponse.data.data || [];

        // Get all leaves from the HOD's department, including approved ones
        const departmentLeaves = leavesData;

        setLeaves(departmentLeaves);
        setFilteredLeaves(departmentLeaves);

        // Fetch leave types
        const leaveTypesResponse = await axios.get('/api/leave-types');
        setLeaveTypes(leaveTypesResponse.data.data || []);

        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching department leaves:', error);
        setError(error.response?.data?.error || 'Failed to fetch leave applications');
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session, status, router]);

  // Apply filters
  useEffect(() => {
    let result = [...leaves];

    if (filters.leave_type_id) {
      result = result.filter(leave =>
        leave.leave_type_id === parseInt(filters.leave_type_id)
      );
    }

    if (filters.status) {
      result = result.filter(leave => leave.status === filters.status);
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter(leave => new Date(leave.start_date) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      result = result.filter(leave => new Date(leave.end_date) <= endDate);
    }

    setFilteredLeaves(result);
  }, [filters, leaves]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      leave_type_id: '',
      status: '',
      startDate: '',
      endDate: '',
    });
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

  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Employee', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Applied On'];
    const rows = filteredLeaves.map(leave => [
      leave.user?.full_name || leave.user_name || 'Unknown',
      leave.leave_type?.name || leave.leave_type_name || 'Unknown',
      formatDate(leave.start_date),
      formatDate(leave.end_date),
      leave.days,
      leave.status,
      formatDate(leave.created_at)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `department_leaves_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <title>Department Leaves | Leave Management System</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Department Leave History
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={exportToCSV}
              disabled={filteredLeaves.length === 0}
            >
              Export to CSV
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {/* Filters */}
          <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Leave Type</InputLabel>
                  <Select
                    name="leave_type_id"
                    value={filters.leave_type_id}
                    onChange={handleFilterChange}
                    label="Leave Type"
                  >
                    <MenuItem value="">All Leave Types</MenuItem>
                    {leaveTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    label="Status"
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value={LeaveStatus.Pending}>Pending</MenuItem>
                    <MenuItem value={LeaveStatus.HODApproved}>HOD Approved</MenuItem>
                    <MenuItem value={LeaveStatus.PrincipalApproved}>Principal Approved</MenuItem>
                    <MenuItem value={LeaveStatus.Rejected}>Rejected</MenuItem>
                    <MenuItem value={LeaveStatus.Cancelled}>Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  onClick={resetFilters}
                  fullWidth
                  sx={{ height: '40px' }}
                >
                  Reset Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {filteredLeaves.length === 0 ? (
            <Box textAlign="center" py={5}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No leave applications found for your department.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Leave Type</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Days</TableCell>
                    <TableCell>Applied On</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLeaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell>{leave.user?.full_name || leave.user_name || 'Unknown'}</TableCell>
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
