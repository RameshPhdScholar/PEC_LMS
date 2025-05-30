import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import { format, addDays } from 'date-fns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Button,
  TextField,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  EventNote as LeaveIcon,
  Assessment as ReportIcon,
  People as PeopleIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  HourglassEmpty as PendingIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/Dashboard/Layout';
import {
  UserRole,
  LeaveApplication,
  LeaveStatus,
  LeaveType,
  LeaveBalance,
  LeaveApplicationFormData,
  UserApprovalStatus,
  User,
  Department
} from '@/types';
import { formatDate as formatDateUtil } from '@/utils/format';
import {
  LeaveStatusChart,
  DepartmentLeaveChart,
  MonthlyLeaveChart,
  LeaveTypeDistribution,
  LeaveBalanceSummary,
  EmployeeLeaveTable,
  StatCard
} from '@/components/Analytics';

// Validation schema for leave application
const validationSchema = Yup.object({
  leave_type_id: Yup.number().required('Leave type is required').min(1, 'Please select a valid leave type'),
  start_date: Yup.date().required('Start date is required'),
  end_date: Yup.date()
    .required('End date is required')
    .test('date-range', 'End date cannot be before start date', function(value) {
      const { start_date } = this.parent;
      if (!start_date || !value) return true;
      return new Date(value) >= new Date(start_date);
    }),
  reason: Yup.string().required('Reason is required').min(10, 'Reason should be at least 10 characters'),
});

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [leavesLoading, setLeavesLoading] = useState(true);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);
  const [leaveDetailsOpen, setLeaveDetailsOpen] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [employees, setEmployees] = useState<User[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [pendingUsersLoading, setPendingUsersLoading] = useState(true);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedUserForRejection, setSelectedUserForRejection] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingUser, setProcessingUser] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Fetch analytics data
        const analyticsResponse = await axios.get('/api/analytics/dashboard-stats');
        setAnalyticsData(analyticsResponse.data.data);
        setAnalyticsLoading(false);

        // Fetch leave applications
        const leavesResponse = await axios.get('/api/leaves');
        const leavesData = leavesResponse.data.data || [];
        console.log('Dashboard - Fetched leaves data:', leavesData.length, leavesData);
        console.log('Dashboard - Leave statuses:', leavesData.map((l: any) => ({ id: l.id, status: l.status, user: l.user_name })));
        setLeaves(leavesData);
        setLeavesLoading(false);

        // Fetch departments
        const departmentsResponse = await axios.get('/api/departments');
        setDepartments(departmentsResponse.data.data || []);
        setDepartmentsLoading(false);

        // Fetch pending users for admin/superadmin
        if ([UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
          try {
            const pendingResponse = await axios.get('/api/users/pending');
            setPendingUsers(pendingResponse.data.data || []);
          } catch (error) {
            console.error('Error fetching pending users:', error);
            setPendingUsers([]);
          }
          setPendingUsersLoading(false);
        }

        // Fetch leave types and balances for employees
        if ([UserRole.Employee, UserRole.HOD, UserRole.Principal].includes(session.user.role_id)) {
          const leaveTypesResponse = await axios.get('/api/leave-types');
          setLeaveTypes(leaveTypesResponse.data.data || []);

          const leaveBalancesResponse = await axios.get('/api/leave-balances/my-balances');
          setLeaveBalances(leaveBalancesResponse.data.data || []);

          // Fetch employees data for Principal
          if (session.user.role_id === UserRole.Principal) {
            const employeesResponse = await axios.get('/api/users');
            setEmployees(employeesResponse.data.data || []);
            setEmployeesLoading(false);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session, status, router]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Clear error when switching tabs
    setError('');
  };

  const handleViewLeaveDetails = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setLeaveDetailsOpen(true);
  };

  const handleCloseLeaveDetails = () => {
    setLeaveDetailsOpen(false);
    setSelectedLeave(null);
  };

  // Calculate business days between two dates (excluding Sundays and second Saturdays)
  const calculateBusinessDays = (startDate: Date, endDate: Date) => {
    let days = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      // Check if it's Sunday
      if (dayOfWeek === 0) {
        // Skip Sunday
      }
      // Check if it's second Saturday of the month
      else if (dayOfWeek === 6) {
        const dateOfMonth = currentDate.getDate();
        // Calculate the date of the first Saturday of the month
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const firstSaturday = 7 - firstDayOfMonth.getDay() + 6;
        const secondSaturday = firstSaturday + 7;

        // If it's the second Saturday, skip it (holiday)
        if (dateOfMonth >= secondSaturday && dateOfMonth < secondSaturday + 7) {
          // Skip second Saturday - it's a holiday
        } else {
          // It's a working Saturday (1st, 3rd, 4th, 5th Saturday)
          days++;
        }
      }
      // All other days (Monday to Friday) are working days
      else {
        days++;
      }

      currentDate = addDays(currentDate, 1);
    }

    return days;
  };

  // Initialize formik for leave application
  const formik = useFormik<LeaveApplicationFormData>({
    initialValues: {
      leave_type_id: 0,
      start_date: '',
      end_date: '',
      reason: '',
    },
    validationSchema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        setError('');

        // Validate required fields before submission
        if (!values.leave_type_id || values.leave_type_id === 0) {
          setError('Please select a leave type');
          setSubmitting(false);
          return;
        }

        if (!values.start_date) {
          setError('Please select a start date');
          setSubmitting(false);
          return;
        }

        if (!values.end_date) {
          setError('Please select an end date');
          setSubmitting(false);
          return;
        }

        if (!values.reason || values.reason.trim().length < 10) {
          setError('Please provide a reason for leave (at least 10 characters)');
          setSubmitting(false);
          return;
        }

        // Calculate business days
        const startDate = new Date(values.start_date);
        const endDate = new Date(values.end_date);

        // Validate date range
        if (endDate < startDate) {
          setError('End date cannot be before start date');
          setSubmitting(false);
          return;
        }

        const days = calculateBusinessDays(startDate, endDate);

        if (days <= 0) {
          setError('Selected date range contains no working days. Please avoid Sundays and second Saturdays.');
          setSubmitting(false);
          return;
        }

        // Check if user has enough leave balance
        const selectedLeaveTypeBalance = leaveBalances.find(
          (balance) => balance.leave_type_id === values.leave_type_id
        );

        if (selectedLeaveTypeBalance && selectedLeaveTypeBalance.balance < days) {
          setError(`You don't have enough leave balance. Available: ${selectedLeaveTypeBalance.balance} days`);
          setSubmitting(false);
          return;
        }

        // Submit the leave application
        await axios.post('/api/leaves', {
          leave_type_id: values.leave_type_id,
          start_date: values.start_date,
          end_date: values.end_date,
          reason: values.reason.trim(),
          days,
        });

        toast.success('Leave application submitted successfully');

        // Refresh leaves data
        const leavesResponse = await axios.get('/api/leaves');
        setLeaves(leavesResponse.data.data || []);

        // Reset form
        formik.resetForm();
        setTabValue(1); // Switch to My Leaves tab
        setSubmitting(false);
      } catch (error: any) {
        console.error('Error submitting leave application:', error);
        setError(error.response?.data?.error || 'Failed to submit leave application');
        setSubmitting(false);
      }
    },
  });

  // Handle date changes
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      formik.setFieldValue('start_date', format(date, 'yyyy-MM-dd'));

      // If end date is before start date, update end date
      if (formik.values.end_date && new Date(formik.values.end_date) < date) {
        formik.setFieldValue('end_date', format(date, 'yyyy-MM-dd'));
      }
    } else {
      formik.setFieldValue('start_date', '');
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      formik.setFieldValue('end_date', format(date, 'yyyy-MM-dd'));
    } else {
      formik.setFieldValue('end_date', '');
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

  // Handle user approval
  const handleApproveUser = async (userId: number) => {
    try {
      setProcessingUser(true);
      await axios.post(`/api/users/${userId}/approve`);

      // Remove the approved user from pending users list
      setPendingUsers(prev => prev.filter(user => user.id !== userId));

      // Show success message
      setError('');
      // You can add a success toast here if you have toast notifications
      console.log('User approved successfully');

    } catch (error: any) {
      console.error('Error approving user:', error);
      setError(error.response?.data?.error || 'Failed to approve user');
    } finally {
      setProcessingUser(false);
    }
  };

  // Handle user rejection
  const handleRejectUser = (user: User) => {
    setSelectedUserForRejection(user);
    setRejectDialogOpen(true);
  };

  // Confirm user rejection
  const handleConfirmRejectUser = async () => {
    if (!selectedUserForRejection || !rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessingUser(true);
      await axios.post(`/api/users/${selectedUserForRejection.id}/reject`, {
        rejection_reason: rejectionReason.trim()
      });

      // Remove the rejected user from pending users list
      setPendingUsers(prev => prev.filter(user => user.id !== selectedUserForRejection.id));

      // Close dialog and reset state
      setRejectDialogOpen(false);
      setSelectedUserForRejection(null);
      setRejectionReason('');
      setError('');

      // You can add a success toast here if you have toast notifications
      console.log('User rejected successfully');

    } catch (error: any) {
      console.error('Error rejecting user:', error);
      setError(error.response?.data?.error || 'Failed to reject user');
    } finally {
      setProcessingUser(false);
    }
  };

  // Close rejection dialog
  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setSelectedUserForRejection(null);
    setRejectionReason('');
  };

  // Render HOD dashboard
  const renderHODDashboard = () => {
    return (
      <>
        <Head>
          <title>HOD Dashboard | Leave Management System</title>
        </Head>

        {/* Dashboard Content */}
        <Box sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Employees"
                value={analyticsData?.dashboardStats?.totalEmployees || 0}
                icon={<PeopleIcon fontSize="large" />}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Leave Applications"
                value={analyticsData?.dashboardStats?.totalLeaveApplications || 0}
                icon={<LeaveIcon fontSize="large" />}
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Approvals"
                value={analyticsData?.dashboardStats?.pendingLeaveApplications || 0}
                icon={<PendingIcon fontSize="large" />}
                color={theme.palette.warning.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Approved Leaves"
                value={analyticsData?.dashboardStats?.approvedLeaveApplications || 0}
                icon={<ApprovedIcon fontSize="large" />}
                color={theme.palette.success.main}
              />
            </Grid>

            {/* Leave Status Distribution */}
            <Grid item xs={12} md={6}>
              <LeaveStatusChart
                data={analyticsData?.leaveStatusDistribution}
                loading={analyticsLoading}
                title="Department Leave Status Distribution"
              />
            </Grid>

            {/* Leave Type Distribution */}
            <Grid item xs={12} md={6}>
              <LeaveTypeDistribution
                data={analyticsData?.leaveTypeDistribution}
                loading={analyticsLoading}
                title="Department Leave Type Distribution"
              />
            </Grid>

            {/* Monthly Leave Trend */}
            <Grid item xs={12}>
              <MonthlyLeaveChart
                data={analyticsData?.monthlyLeaveData}
                loading={analyticsLoading}
                title="Department Monthly Leave Trend"
              />
            </Grid>

            {/* Recent Leave Applications */}
            <Grid item xs={12}>
              <EmployeeLeaveTable
                data={leaves.slice(0, 5)}
                loading={leavesLoading}
                title="Recent Department Leave Applications"
                onViewDetails={handleViewLeaveDetails}
              />
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };



  // Component to display employees by department
  const EmployeesByDepartment = ({
    employees,
    departments,
    loading
  }: {
    employees: User[],
    departments: Department[],
    loading: boolean
  }) => {
    const [expanded, setExpanded] = useState<string | false>(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      setPage(0);
    };

    const filterEmployees = (departmentId: number) => {
      return employees
        .filter(employee =>
          employee.department_id === departmentId &&
          (searchTerm === '' ||
            employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => a.employee_id.localeCompare(b.employee_id)); // Sort by employee_id in ascending order
    };

    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box>
        <Box mb={3}>
          <TextField
            fullWidth
            label="Search Employees"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name, employee ID, or email"
            size="small"
          />
        </Box>

        {departments.map((department) => {
          const departmentEmployees = filterEmployees(department.id);

          if (departmentEmployees.length === 0) {
            return null;
          }

          return (
            <Accordion
              key={department.id}
              expanded={expanded === `panel-${department.id}`}
              onChange={handleAccordionChange(`panel-${department.id}`)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${department.id}-content`}
                id={`panel-${department.id}-header`}
              >
                <Typography variant="h6" fontWeight="medium">
                  {department.name} ({department.code}) - {departmentEmployees.length} employees
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Position</TableCell>
                        <TableCell>Joining Date</TableCell>
                        <TableCell>Role</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {departmentEmployees
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((employee) => (
                          <TableRow key={employee.id} hover>
                            <TableCell>{employee.employee_id}</TableCell>
                            <TableCell>{employee.full_name}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>{employee.employee_position || 'N/A'}</TableCell>
                            <TableCell>{employee.joining_date ? formatDateUtil(employee.joining_date) : 'N/A'}</TableCell>
                            <TableCell>
                              {employee.role_id === UserRole.HOD ? (
                                <Chip size="small" color="primary" label="HOD" />
                              ) : employee.role_id === UserRole.Principal ? (
                                <Chip size="small" color="secondary" label="Principal" />
                              ) : (
                                'Employee'
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {departmentEmployees.length > rowsPerPage && (
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={departmentEmployees.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    );
  };

  // Render principal dashboard
  const renderPrincipalDashboard = () => {
    return (
      <>
        <Head>
          <title>Principal Dashboard | Leave Management System</title>
        </Head>

        {/* Dashboard Content */}
        <Box sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Employees"
                value={analyticsData?.dashboardStats?.totalEmployees || 0}
                icon={<PeopleIcon fontSize="large" />}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Leave Applications"
                value={analyticsData?.dashboardStats?.totalLeaveApplications || 0}
                icon={<LeaveIcon fontSize="large" />}
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Approvals"
                value={analyticsData?.dashboardStats?.pendingLeaveApplications || 0}
                icon={<PendingIcon fontSize="large" />}
                color={theme.palette.warning.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Approved Leaves"
                value={analyticsData?.dashboardStats?.approvedLeaveApplications || 0}
                icon={<ApprovedIcon fontSize="large" />}
                color={theme.palette.success.main}
              />
            </Grid>

            {/* Department Leave Distribution */}
            <Grid item xs={12} md={6}>
              <DepartmentLeaveChart
                data={analyticsData?.departmentLeaveDistribution}
                loading={analyticsLoading}
                title="Leave Applications by Department"
              />
            </Grid>

            {/* Leave Status Distribution */}
            <Grid item xs={12} md={6}>
              <LeaveStatusChart
                data={analyticsData?.leaveStatusDistribution}
                loading={analyticsLoading}
                title="Leave Status Distribution"
              />
            </Grid>

            {/* Leave Type Distribution */}
            <Grid item xs={12} md={6}>
              <LeaveTypeDistribution
                data={analyticsData?.leaveTypeDistribution}
                loading={analyticsLoading}
                title="Leave Type Distribution"
              />
            </Grid>

            {/* Monthly Leave Trend */}
            <Grid item xs={12} md={6}>
              <MonthlyLeaveChart
                data={analyticsData?.monthlyLeaveData}
                loading={analyticsLoading}
                title="Monthly Leave Trend"
              />
            </Grid>

            {/* Recent Leave Applications */}
            <Grid item xs={12}>
              <EmployeeLeaveTable
                data={leaves.slice(0, 5)}
                loading={leavesLoading}
                title="Recent Leave Applications"
                onViewDetails={handleViewLeaveDetails}
              />
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };



  // Render employee dashboard
  const renderEmployeeDashboard = () => {
    return (
      <>
        <Head>
          <title>{session?.user?.name} Dashboard | Leave Management System</title>
        </Head>

        {/* Dashboard Content */}
        <Box sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Leave Balance Summary */}
            <Grid item xs={12} md={6}>
              <LeaveBalanceSummary
                data={leaveBalances}
                loading={loading}
                title="My Leave Balances"
              />
            </Grid>

            {/* Leave Status Distribution */}
            <Grid item xs={12} md={6}>
              <LeaveStatusChart
                data={analyticsData?.leaveStatusDistribution}
                loading={analyticsLoading}
                title="My Leave Status Distribution"
              />
            </Grid>

            {/* Monthly Leave Trend */}
            <Grid item xs={12}>
              <MonthlyLeaveChart
                data={analyticsData?.monthlyLeaveData}
                loading={analyticsLoading}
                title="My Monthly Leave Trend"
              />
            </Grid>

            {/* Recent Leave Applications */}
            <Grid item xs={12}>
              <EmployeeLeaveTable
                data={leaves.slice(0, 5)}
                loading={leavesLoading}
                title="Recent Leave Applications"
                onViewDetails={handleViewLeaveDetails}
              />
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };



  // Render admin dashboard
  const renderAdminDashboard = () => {
    return (
      <>
        <Head>
          <title>{session?.user?.role_id === UserRole.Admin ? 'Admin' : 'Super Admin'} Dashboard | Leave Management System</title>
        </Head>

        {/* Dashboard Content */}
        <Box sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Employees"
                value={analyticsData?.dashboardStats?.totalEmployees || 0}
                icon={<PeopleIcon fontSize="large" />}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Leave Applications"
                value={analyticsData?.dashboardStats?.totalLeaveApplications || 0}
                icon={<LeaveIcon fontSize="large" />}
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Approvals"
                value={analyticsData?.dashboardStats?.pendingLeaveApplications || 0}
                icon={<PendingIcon fontSize="large" />}
                color={theme.palette.warning.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Approved Leaves"
                value={analyticsData?.dashboardStats?.approvedLeaveApplications || 0}
                icon={<ApprovedIcon fontSize="large" />}
                color={theme.palette.success.main}
              />
            </Grid>

            {/* Department Leave Distribution */}
            <Grid item xs={12} md={6}>
              <DepartmentLeaveChart
                data={analyticsData?.departmentLeaveDistribution}
                loading={analyticsLoading}
                title="Leave Applications by Department"
              />
            </Grid>

            {/* Leave Status Distribution */}
            <Grid item xs={12} md={6}>
              <LeaveStatusChart
                data={analyticsData?.leaveStatusDistribution}
                loading={analyticsLoading}
                title="Leave Status Distribution"
              />
            </Grid>

            {/* Leave Type Distribution */}
            <Grid item xs={12} md={6}>
              <LeaveTypeDistribution
                data={analyticsData?.leaveTypeDistribution}
                loading={analyticsLoading}
                title="Leave Type Distribution"
              />
            </Grid>

            {/* Monthly Leave Trend */}
            <Grid item xs={12} md={6}>
              <MonthlyLeaveChart
                data={analyticsData?.monthlyLeaveData}
                loading={analyticsLoading}
                title="Monthly Leave Trend"
              />
            </Grid>

            {/* Recent Leave Applications */}
            <Grid item xs={12}>
              <EmployeeLeaveTable
                data={leaves.slice(0, 10)}
                loading={leavesLoading}
                title="Recent Leave Applications"
                onViewDetails={handleViewLeaveDetails}
              />
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };

  // Leave details dialog
  const renderLeaveDetailsDialog = () => {
    return (
      <Dialog
        open={leaveDetailsOpen}
        onClose={handleCloseLeaveDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Leave Application Details</Typography>
            <IconButton onClick={handleCloseLeaveDetails} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedLeave && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">{session?.user?.name}</Typography>
                <Typography variant="body1" gutterBottom>{selectedLeave.user_name || selectedLeave.user?.full_name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Department</Typography>
                <Typography variant="body1" gutterBottom>{selectedLeave.department_name || selectedLeave.user?.department?.name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Leave Type</Typography>
                <Typography variant="body1" gutterBottom>{selectedLeave.leave_type_name || selectedLeave.leave_type?.name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Typography variant="body1" gutterBottom>{getStatusChip(selectedLeave.status)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                <Typography variant="body1" gutterBottom>{formatDate(selectedLeave.start_date)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                <Typography variant="body1" gutterBottom>{formatDate(selectedLeave.end_date)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Days</Typography>
                <Typography variant="body1" gutterBottom>{selectedLeave.days}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Applied On</Typography>
                <Typography variant="body1" gutterBottom>{formatDate(selectedLeave.created_at)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Reason</Typography>
                <Typography variant="body1" gutterBottom>{selectedLeave.reason || 'No reason provided'}</Typography>
              </Grid>
              {selectedLeave.hod_approval_date && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">HOD Approved On</Typography>
                  <Typography variant="body1" gutterBottom>{formatDate(selectedLeave.hod_approval_date)}</Typography>
                </Grid>
              )}
              {selectedLeave.principal_approval_date && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Principal Approved On</Typography>
                  <Typography variant="body1" gutterBottom>{formatDate(selectedLeave.principal_approval_date)}</Typography>
                </Grid>
              )}
              {selectedLeave.rejection_date && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Rejected On</Typography>
                    <Typography variant="body1" gutterBottom>{formatDate(selectedLeave.rejection_date)}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Rejection Reason</Typography>
                    <Typography variant="body1" gutterBottom>{selectedLeave.rejection_reason || 'No reason provided'}</Typography>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLeaveDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
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
      {session?.user.role_id === UserRole.Employee && renderEmployeeDashboard()}
      {session?.user.role_id === UserRole.HOD && renderHODDashboard()}
      {session?.user.role_id === UserRole.Principal && renderPrincipalDashboard()}
      {(session?.user.role_id === UserRole.Admin || session?.user.role_id === UserRole.SuperAdmin) && renderAdminDashboard()}
      {renderLeaveDetailsDialog()}

      {/* User Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onClose={handleCloseRejectDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" component="div" color="error">
            Reject User Registration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action will permanently reject the user registration
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedUserForRejection && (
            <Box sx={{ pt: 2 }}>
              <Paper sx={{ p: 2, mb: 3, backgroundColor: 'error.light', color: 'error.contrastText' }}>
                <Typography variant="subtitle2" gutterBottom>
                  User Details
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Name:</strong> {selectedUserForRejection.full_name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Employee ID:</strong> {selectedUserForRejection.employee_id}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Email:</strong> {selectedUserForRejection.email}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Department:</strong> {departments.find(d => d.id === selectedUserForRejection.department_id)?.name || 'Unknown'}
                </Typography>
              </Paper>

              <TextField
                autoFocus
                label="Reason for Rejection *"
                multiline
                rows={4}
                fullWidth
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                error={!rejectionReason.trim()}
                helperText={!rejectionReason.trim() ? "Please provide a reason for rejection" : "This reason will be sent to the user"}
                sx={{ mb: 2 }}
              />

              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Warning: This action cannot be undone
                </Typography>
                <Typography variant="body2">
                  • The user registration will be permanently rejected
                  <br />
                  • The user will not be able to login to the system
                  <br />
                  • The user will be notified of the rejection with the provided reason
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseRejectDialog}
            disabled={processingUser}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRejectUser}
            color="error"
            variant="contained"
            disabled={processingUser || !rejectionReason.trim()}
            startIcon={processingUser ? <CircularProgress size={20} /> : <RejectedIcon />}
          >
            {processingUser ? 'Rejecting...' : 'Reject Registration'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}