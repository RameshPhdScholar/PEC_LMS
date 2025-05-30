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
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  HourglassEmpty as PendingIcon,
  FileDownload as DownloadIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import DashboardLayout from '@/components/Dashboard/Layout';
import { LeaveApplication, LeaveStatus, UserRole, Department, LeaveType } from '@/types';
import { formatDate as formatDateUtil } from '@/utils/format';

export default function AllLeaves() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [filteredLeaves, setFilteredLeaves] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

  // Filters
  const [filters, setFilters] = useState({
    department_id: '',
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

    // Only admins can view all leaves
    if (session && ![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch all leaves
        const leavesResponse = await axios.get('/api/leaves');
        setLeaves(leavesResponse.data.data || []);
        setFilteredLeaves(leavesResponse.data.data || []);

        // Fetch departments
        const departmentsResponse = await axios.get('/api/departments');
        setDepartments(departmentsResponse.data.data || []);

        // Fetch leave types
        const leaveTypesResponse = await axios.get('/api/leave-types');
        setLeaveTypes(leaveTypesResponse.data.data || []);

        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.error || 'Failed to fetch data');
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

    if (filters.department_id) {
      result = result.filter(leave =>
        leave.user?.department_id === parseInt(filters.department_id)
      );
    }

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
      department_id: '',
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
    const headers = ['Employee', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Applied On'];
    const rows = filteredLeaves.map(leave => [
      leave.user?.full_name || 'Unknown',
      leave.user?.department?.name || 'Unknown',
      leave.leave_type?.name || 'Unknown',
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
    link.setAttribute('download', `leave_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
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
        <title>All Leaves | Leave Management System</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h1" fontWeight="bold">
              All Leave Applications
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

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Filters */}
          <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Department"
                  name="department_id"
                  value={filters.department_id}
                  onChange={handleFilterChange}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Leave Type"
                  name="leave_type_id"
                  value={filters.leave_type_id}
                  onChange={handleFilterChange}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="">All Leave Types</MenuItem>
                  {leaveTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value={LeaveStatus.Pending}>Pending</MenuItem>
                  <MenuItem value={LeaveStatus.HODApproved}>HOD Approved</MenuItem>
                  <MenuItem value={LeaveStatus.PrincipalApproved}>Principal Approved</MenuItem>
                  <MenuItem value={LeaveStatus.Rejected}>Rejected</MenuItem>
                  <MenuItem value={LeaveStatus.Cancelled}>Cancelled</MenuItem>
                </TextField>
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

          {filteredLeaves.length === 0 ? (
            <Box textAlign="center" py={5}>
              <Typography variant="body1" color="text.secondary">
                No leave applications found matching the filters.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Leave Type</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Days</TableCell>
                    <TableCell>Applied On</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLeaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell>{leave.user?.full_name || 'Unknown'}</TableCell>
                      <TableCell>{leave.user?.department ? `${leave.user.department.name} (${leave.user.department.code})` : 'Unknown'}</TableCell>
                      <TableCell>{leave.leave_type?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                      </TableCell>
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
