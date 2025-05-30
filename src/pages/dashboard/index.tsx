import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import { format, addDays, isWeekend } from 'date-fns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
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
  Add as AddIcon,
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
  leave_type_id: Yup.number().required('Leave type is required'),
  start_date: Yup.date().required('Start date is required'),
  end_date: Yup.date()
    .required('End date is required')
    .min(Yup.ref('start_date'), 'End date must be after start date'),
  reason: Yup.string().required('Reason is required').min(10, 'Reason should be at least 10 characters'),
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

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
  };

  const handleViewLeaveDetails = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setLeaveDetailsOpen(true);
  };

  const handleCloseLeaveDetails = () => {
    setLeaveDetailsOpen(false);
    setSelectedLeave(null);
  };

  // Calculate business days between two dates (excluding weekends)
  const calculateBusinessDays = (startDate: Date, endDate: Date) => {
    let days = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (!isWeekend(currentDate)) {
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
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        setError('');

        // Calculate business days
        const startDate = new Date(values.start_date);
        const endDate = new Date(values.end_date);
        const days = calculateBusinessDays(startDate, endDate);

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
          ...values,
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


        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="hod dashboard tabs">
            <Tab label="Dashboard" icon={<DashboardIcon />} iconPosition="start" />
            <Tab label="Pending Approvals" icon={<LeaveIcon />} iconPosition="start" />
            <Tab label="Department Leaves" icon={<PeopleIcon />} iconPosition="start" />
            <Tab label="My Leaves" icon={<LeaveIcon />} iconPosition="start" />
            <Tab label="Apply for Leave" icon={<AddIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Dashboard Tab */}
        <TabPanel value={tabValue} index={0}>
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
        </TabPanel>

        {/* Pending Approvals Tab */}
        <TabPanel value={tabValue} index={1}>
          <EmployeeLeaveTable
            data={leaves.filter(leave => leave.status === LeaveStatus.Pending)}
            loading={leavesLoading}
            title="Pending Leave Approvals"
            onViewDetails={handleViewLeaveDetails}
          />
        </TabPanel>

        {/* Department Leaves Tab */}
        <TabPanel value={tabValue} index={2}>
          <EmployeeLeaveTable
            data={leaves}
            loading={leavesLoading}
            title="All Department Leave Applications"
            onViewDetails={handleViewLeaveDetails}
            showDepartmentFilter={true}
            departments={departments}
          />
        </TabPanel>

        {/* My Leaves Tab */}
        <TabPanel value={tabValue} index={3}>
          <EmployeeLeaveTable
            data={leaves.filter(leave => leave.user_id === session?.user.id)}
            loading={leavesLoading}
            title="My Leave Applications"
            onViewDetails={handleViewLeaveDetails}
          />
        </TabPanel>

        {/* Apply for Leave Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            {/* Leave Balance Summary */}
            <Grid item xs={12} md={4}>
              <LeaveBalanceSummary
                data={leaveBalances}
                loading={loading}
                title="Available Leave Balances"
              />
            </Grid>

            {/* Leave Application Form */}
            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Apply for Leave
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={formik.handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Leave Type */}
                    <Grid item xs={12}>
                      <FormControl fullWidth error={formik.touched.leave_type_id && Boolean(formik.errors.leave_type_id)}>
                        <InputLabel id="leave-type-label">Leave Type</InputLabel>
                        <Select
                          labelId="leave-type-label"
                          id="leave_type_id"
                          name="leave_type_id"
                          value={formik.values.leave_type_id}
                          onChange={formik.handleChange}
                          label="Leave Type"
                        >
                          <MenuItem value={0} disabled>
                            Select Leave Type
                          </MenuItem>
                          {leaveTypes.map((type) => {
                            const balance = leaveBalances.find((b) => b.leave_type_id === type.id);
                            return (
                              <MenuItem key={type.id} value={type.id}>
                                {type.name} (Balance: {balance ? balance.balance : 0} days)
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {formik.touched.leave_type_id && formik.errors.leave_type_id && (
                          <FormHelperText>{formik.errors.leave_type_id}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Date Range */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={formik.touched.start_date && Boolean(formik.errors.start_date)}>
                        <InputLabel shrink htmlFor="start_date">
                          Start Date
                        </InputLabel>
                        <DatePicker
                          selected={formik.values.start_date ? new Date(formik.values.start_date) : null}
                          onChange={handleStartDateChange}
                          dateFormat="yyyy-MM-dd"
                          minDate={new Date()}
                          customInput={
                            <TextField
                              id="start_date"
                              name="start_date"
                              fullWidth
                              variant="outlined"
                              error={formik.touched.start_date && Boolean(formik.errors.start_date)}
                              helperText={formik.touched.start_date && formik.errors.start_date}
                            />
                          }
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={formik.touched.end_date && Boolean(formik.errors.end_date)}>
                        <InputLabel shrink htmlFor="end_date">
                          End Date
                        </InputLabel>
                        <DatePicker
                          selected={formik.values.end_date ? new Date(formik.values.end_date) : null}
                          onChange={handleEndDateChange}
                          dateFormat="yyyy-MM-dd"
                          minDate={formik.values.start_date ? new Date(formik.values.start_date) : new Date()}
                          customInput={
                            <TextField
                              id="end_date"
                              name="end_date"
                              fullWidth
                              variant="outlined"
                              error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                              helperText={formik.touched.end_date && formik.errors.end_date}
                            />
                          }
                        />
                      </FormControl>
                    </Grid>

                    {/* Reason */}
                    <Grid item xs={12}>
                      <TextField
                        id="reason"
                        name="reason"
                        label="Reason for Leave"
                        multiline
                        rows={4}
                        fullWidth
                        value={formik.values.reason}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.reason && Boolean(formik.errors.reason)}
                        helperText={formik.touched.reason && formik.errors.reason}
                      />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={submitting}
                          sx={{ minWidth: 150 }}
                        >
                          {submitting ? <CircularProgress size={24} /> : 'Submit Application'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
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


        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="principal dashboard tabs">
            <Tab label="Dashboard" icon={<DashboardIcon />} iconPosition="start" />
            <Tab label="Pending Approvals" icon={<LeaveIcon />} iconPosition="start" />
            <Tab label="Approved Leaves" icon={<ApprovedIcon />} iconPosition="start" />
            <Tab label="Rejected Leaves" icon={<RejectedIcon />} iconPosition="start" />
            <Tab label="My Leaves" icon={<LeaveIcon />} iconPosition="start" />
            <Tab label="Apply for Leave" icon={<AddIcon />} iconPosition="start" />
            <Tab label="Employees" icon={<PeopleIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Dashboard Tab */}
        <TabPanel value={tabValue} index={0}>
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
        </TabPanel>

        {/* Pending Approvals Tab */}
        <TabPanel value={tabValue} index={1}>
          {(() => {
            const hodApprovedLeaves = leaves.filter(leave => leave.status === LeaveStatus.HODApproved);
            console.log('Principal Dashboard - HOD Approved Leaves:', hodApprovedLeaves.length, hodApprovedLeaves);
            return (
              <Box>
                {hodApprovedLeaves.length > 0 && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>{hodApprovedLeaves.length} leave application(s)</strong> are waiting for your approval.
                      Review each application carefully before making a decision.
                    </Typography>
                  </Alert>
                )}
                <EmployeeLeaveTable
                  data={hodApprovedLeaves}
                  loading={leavesLoading}
                  title="HOD Approved Leaves - Pending Principal Approval"
                  onViewDetails={handleViewLeaveDetails}
                />
              </Box>
            );
          })()}
        </TabPanel>

        {/* Approved Leaves Tab */}
        <TabPanel value={tabValue} index={2}>
          {(() => {
            const approvedLeaves = leaves.filter(leave => leave.status === LeaveStatus.PrincipalApproved);
            console.log('Principal Dashboard - Approved Leaves:', approvedLeaves.length, approvedLeaves);
            return (
              <Box>
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>{approvedLeaves.length} leave application(s)</strong> have been approved by you.
                    This is the complete history of all approved leaves.
                  </Typography>
                </Alert>
                <EmployeeLeaveTable
                  data={approvedLeaves}
                  loading={leavesLoading}
                  title="Principal Approved Leave Applications"
                  onViewDetails={handleViewLeaveDetails}
                />
              </Box>
            );
          })()}
        </TabPanel>

        {/* Rejected Leaves Tab */}
        <TabPanel value={tabValue} index={3}>
          {(() => {
            const rejectedLeaves = leaves.filter(leave => leave.status === LeaveStatus.Rejected);
            console.log('Principal Dashboard - Rejected Leaves:', rejectedLeaves.length, rejectedLeaves);
            return (
              <Box>
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>{rejectedLeaves.length} leave application(s)</strong> have been rejected.
                    This is the complete history of all rejected leaves with reasons.
                  </Typography>
                </Alert>
                <EmployeeLeaveTable
                  data={rejectedLeaves}
                  loading={leavesLoading}
                  title="Rejected Leave Applications"
                  onViewDetails={handleViewLeaveDetails}
                />
              </Box>
            );
          })()}
        </TabPanel>

        {/* My Leaves Tab */}
        <TabPanel value={tabValue} index={4}>
          <EmployeeLeaveTable
            data={leaves.filter(leave => leave.user_id === session?.user.id)}
            loading={leavesLoading}
            title="My Leave Applications"
            onViewDetails={handleViewLeaveDetails}
          />
        </TabPanel>

        {/* Apply for Leave Tab */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            {/* Leave Balance Summary */}
            <Grid item xs={12} md={4}>
              <LeaveBalanceSummary
                data={leaveBalances}
                loading={loading}
                title="Available Leave Balances"
              />
            </Grid>

            {/* Leave Application Form */}
            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Apply for Leave
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={formik.handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Form fields - same as employee dashboard */}
                    <Grid item xs={12}>
                      <FormControl fullWidth error={formik.touched.leave_type_id && Boolean(formik.errors.leave_type_id)}>
                        <InputLabel id="leave-type-label">Leave Type</InputLabel>
                        <Select
                          labelId="leave-type-label"
                          id="leave_type_id"
                          name="leave_type_id"
                          value={formik.values.leave_type_id}
                          onChange={formik.handleChange}
                          label="Leave Type"
                        >
                          <MenuItem value={0} disabled>
                            Select Leave Type
                          </MenuItem>
                          {leaveTypes.map((type) => {
                            const balance = leaveBalances.find((b) => b.leave_type_id === type.id);
                            return (
                              <MenuItem key={type.id} value={type.id}>
                                {type.name} (Balance: {balance ? balance.balance : 0} days)
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {formik.touched.leave_type_id && formik.errors.leave_type_id && (
                          <FormHelperText>{formik.errors.leave_type_id}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={formik.touched.start_date && Boolean(formik.errors.start_date)}>
                        <InputLabel shrink htmlFor="start_date">Start Date</InputLabel>
                        <DatePicker
                          selected={formik.values.start_date ? new Date(formik.values.start_date) : null}
                          onChange={handleStartDateChange}
                          dateFormat="yyyy-MM-dd"
                          minDate={new Date()}
                          customInput={
                            <TextField
                              id="start_date"
                              name="start_date"
                              fullWidth
                              variant="outlined"
                              error={formik.touched.start_date && Boolean(formik.errors.start_date)}
                              helperText={formik.touched.start_date && formik.errors.start_date}
                            />
                          }
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={formik.touched.end_date && Boolean(formik.errors.end_date)}>
                        <InputLabel shrink htmlFor="end_date">End Date</InputLabel>
                        <DatePicker
                          selected={formik.values.end_date ? new Date(formik.values.end_date) : null}
                          onChange={handleEndDateChange}
                          dateFormat="yyyy-MM-dd"
                          minDate={formik.values.start_date ? new Date(formik.values.start_date) : new Date()}
                          customInput={
                            <TextField
                              id="end_date"
                              name="end_date"
                              fullWidth
                              variant="outlined"
                              error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                              helperText={formik.touched.end_date && formik.errors.end_date}
                            />
                          }
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        id="reason"
                        name="reason"
                        label="Reason for Leave"
                        multiline
                        rows={4}
                        fullWidth
                        value={formik.values.reason}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.reason && Boolean(formik.errors.reason)}
                        helperText={formik.touched.reason && formik.errors.reason}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={submitting}
                          sx={{ minWidth: 150 }}
                        >
                          {submitting ? <CircularProgress size={24} /> : 'Submit Application'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Employees Tab */}
        <TabPanel value={tabValue} index={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              All Employees by Department
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <EmployeesByDepartment
              employees={employees}
              departments={departments}
              loading={employeesLoading || departmentsLoading}
            />
          </Paper>
        </TabPanel>
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


        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="{session?.user?.name} dashboard tabs">
            <Tab label="Dashboard" icon={<DashboardIcon />} iconPosition="start" />
            <Tab label="My Leaves" icon={<LeaveIcon />} iconPosition="start" />
            <Tab label="Apply for Leave" icon={<AddIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Dashboard Tab */}
        <TabPanel value={tabValue} index={0}>
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
        </TabPanel>

        {/* My Leaves Tab */}
        <TabPanel value={tabValue} index={1}>
          <EmployeeLeaveTable
            data={leaves}
            loading={leavesLoading}
            title="My Leave Applications"
            onViewDetails={handleViewLeaveDetails}
          />
        </TabPanel>

        {/* Apply for Leave Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {/* Leave Balance Summary */}
            <Grid item xs={12} md={4}>
              <LeaveBalanceSummary
                data={leaveBalances}
                loading={loading}
                title="Available Leave Balances"
              />
            </Grid>

            {/* Leave Application Form */}
            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Apply for Leave
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={formik.handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Leave Type */}
                    <Grid item xs={12}>
                      <FormControl fullWidth error={formik.touched.leave_type_id && Boolean(formik.errors.leave_type_id)}>
                        <InputLabel id="leave-type-label">Leave Type</InputLabel>
                        <Select
                          labelId="leave-type-label"
                          id="leave_type_id"
                          name="leave_type_id"
                          value={formik.values.leave_type_id}
                          onChange={formik.handleChange}
                          label="Leave Type"
                        >
                          <MenuItem value={0} disabled>
                            Select Leave Type
                          </MenuItem>
                          {leaveTypes.map((type) => {
                            const balance = leaveBalances.find((b) => b.leave_type_id === type.id);
                            return (
                              <MenuItem key={type.id} value={type.id}>
                                {type.name} (Balance: {balance ? balance.balance : 0} days)
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {formik.touched.leave_type_id && formik.errors.leave_type_id && (
                          <FormHelperText>{formik.errors.leave_type_id}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Date Range */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={formik.touched.start_date && Boolean(formik.errors.start_date)}>
                        <InputLabel shrink htmlFor="start_date">
                          Start Date
                        </InputLabel>
                        <DatePicker
                          selected={formik.values.start_date ? new Date(formik.values.start_date) : null}
                          onChange={handleStartDateChange}
                          dateFormat="yyyy-MM-dd"
                          minDate={new Date()}
                          customInput={
                            <TextField
                              id="start_date"
                              name="start_date"
                              fullWidth
                              variant="outlined"
                              error={formik.touched.start_date && Boolean(formik.errors.start_date)}
                              helperText={formik.touched.start_date && formik.errors.start_date}
                            />
                          }
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={formik.touched.end_date && Boolean(formik.errors.end_date)}>
                        <InputLabel shrink htmlFor="end_date">
                          End Date
                        </InputLabel>
                        <DatePicker
                          selected={formik.values.end_date ? new Date(formik.values.end_date) : null}
                          onChange={handleEndDateChange}
                          dateFormat="yyyy-MM-dd"
                          minDate={formik.values.start_date ? new Date(formik.values.start_date) : new Date()}
                          customInput={
                            <TextField
                              id="end_date"
                              name="end_date"
                              fullWidth
                              variant="outlined"
                              error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                              helperText={formik.touched.end_date && formik.errors.end_date}
                            />
                          }
                        />
                      </FormControl>
                    </Grid>

                    {/* Reason */}
                    <Grid item xs={12}>
                      <TextField
                        id="reason"
                        name="reason"
                        label="Reason for Leave"
                        multiline
                        rows={4}
                        fullWidth
                        value={formik.values.reason}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.reason && Boolean(formik.errors.reason)}
                        helperText={formik.touched.reason && formik.errors.reason}
                      />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={submitting}
                          sx={{ minWidth: 150 }}
                        >
                          {submitting ? <CircularProgress size={24} /> : 'Submit Application'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
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


        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin dashboard tabs">
            <Tab label="Dashboard" icon={<DashboardIcon />} iconPosition="start" />
            <Tab label="All Leaves" icon={<LeaveIcon />} iconPosition="start" />
            <Tab label="Pending Registrations" icon={<PeopleIcon />} iconPosition="start" />
            <Tab label="Reports" icon={<ReportIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Dashboard Tab */}
        <TabPanel value={tabValue} index={0}>
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
        </TabPanel>

        {/* All Leaves Tab */}
        <TabPanel value={tabValue} index={1}>
          <EmployeeLeaveTable
            data={leaves}
            loading={leavesLoading}
            title="All Leave Applications"
            onViewDetails={handleViewLeaveDetails}
            showDepartmentFilter={true}
            departments={departments}
          />
        </TabPanel>

        {/* Pending Registrations Tab */}
        <TabPanel value={tabValue} index={2}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Pending User Registrations
              </Typography>
              <Chip
                label={`${pendingUsers.length} Pending`}
                color={pendingUsers.length > 0 ? "warning" : "success"}
                variant="outlined"
              />
            </Box>
            <Divider sx={{ mb: 3 }} />

            {pendingUsersLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : pendingUsers.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Pending Registrations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All user registrations have been processed.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee ID</TableCell>
                      <TableCell>Full Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Joining Date</TableCell>
                      <TableCell>Applied On</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingUsers.map((user) => {
                      const department = departments.find(d => d.id === user.department_id);
                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {user.employee_id}
                            </Typography>
                          </TableCell>
                          <TableCell>{user.full_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone_number || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip
                              label={department?.name || 'Unknown'}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          </TableCell>
                          <TableCell>{user.employee_position || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.gender || 'N/A'}
                              size="small"
                              color={user.gender === 'Female' ? 'secondary' : user.gender === 'Male' ? 'primary' : 'default'}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{user.joining_date ? formatDate(user.joining_date) : 'N/A'}</TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Tooltip title="Approve Registration">
                                <IconButton
                                  color="success"
                                  size="small"
                                  onClick={() => handleApproveUser(user.id)}
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: 'success.light',
                                      color: 'white'
                                    }
                                  }}
                                >
                                  <ApprovedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject Registration">
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() => handleRejectUser(user)}
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: 'error.light',
                                      color: 'white'
                                    }
                                  }}
                                >
                                  <RejectedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </TabPanel>

        {/* Reports Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Reports
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            View detailed reports on leave management.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/reports')}
          >
            Go to Reports
          </Button>
        </TabPanel>
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