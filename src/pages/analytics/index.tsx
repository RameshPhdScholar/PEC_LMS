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
  Grid,
  CircularProgress,
  Divider,
  Alert,
  Tabs,
  Tab,
  Button,
  useTheme,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  EventNote as LeaveIcon,
  Assessment as ReportIcon,
  People as PeopleIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  HourglassEmpty as PendingIcon,
  FileDownload as DownloadIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import DashboardLayout from '@/components/Dashboard/Layout';
import {
  LeaveStatusChart,
  DepartmentLeaveChart,
  MonthlyLeaveChart,
  LeaveTypeDistribution,
  LeaveBalanceSummary,
  EmployeeLeaveTable,
  StatCard
} from '@/components/Analytics';
import { UserRole, Department } from '@/types';

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
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Analytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: format(startOfMonth(subMonths(new Date(), 6)), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Only admins can view analytics
    if (session && ![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch departments
        const departmentsResponse = await axios.get('/api/departments');
        setDepartments(departmentsResponse.data.data || []);

        // Fetch analytics data
        const analyticsResponse = await axios.get('/api/analytics/dashboard-stats', {
          params: {
            department_id: selectedDepartment !== 'all' ? selectedDepartment : undefined,
            start_date: dateRange.startDate,
            end_date: dateRange.endDate,
          }
        });
        setAnalyticsData(analyticsResponse.data.data);

        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching analytics data:', error);
        setError(error.response?.data?.error || 'Failed to fetch analytics data');
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session, status, router, selectedDepartment, dateRange]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDepartmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDepartment(event.target.value);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(prev => ({
      ...prev,
      startDate: event.target.value,
    }));
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(prev => ({
      ...prev,
      endDate: event.target.value,
    }));
  };

  const exportAnalyticsToCSV = () => {
    // Create CSV content
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Employees', analyticsData?.dashboardStats?.totalEmployees || 0],
      ['Total Leave Applications', analyticsData?.dashboardStats?.totalLeaveApplications || 0],
      ['Pending Leave Applications', analyticsData?.dashboardStats?.pendingLeaveApplications || 0],
      ['Approved Leave Applications', analyticsData?.dashboardStats?.approvedLeaveApplications || 0],
      ['Rejected Leave Applications', analyticsData?.dashboardStats?.rejectedLeaveApplications || 0],
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
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
        <title>Analytics | Leave Management System</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Leave Management Analytics
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={exportAnalyticsToCSV}
            >
              Export Report
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
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    id="department"
                    value={selectedDepartment}
                    label="Department"
                    onChange={handleDepartmentChange}
                  >
                    <MenuItem value="all">All Departments</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={dateRange.startDate}
                  onChange={handleStartDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={dateRange.endDate}
                  onChange={handleEndDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                />
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
              <Tab label="Overview" icon={<DashboardIcon />} iconPosition="start" />
              <Tab label="Leave Types" icon={<LeaveIcon />} iconPosition="start" />
              <Tab label="Departments" icon={<PeopleIcon />} iconPosition="start" />
              <Tab label="Trends" icon={<ReportIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* Overview Tab */}
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
                  loading={loading}
                  title="Leave Status Distribution"
                />
              </Grid>

              {/* Leave Type Distribution */}
              <Grid item xs={12} md={6}>
                <LeaveTypeDistribution
                  data={analyticsData?.leaveTypeDistribution}
                  loading={loading}
                  title="Leave Type Distribution"
                />
              </Grid>

              {/* Monthly Leave Trend */}
              <Grid item xs={12}>
                <MonthlyLeaveChart
                  data={analyticsData?.monthlyLeaveData}
                  loading={loading}
                  title="Monthly Leave Trend"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Leave Types Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <LeaveTypeDistribution
                  data={analyticsData?.leaveTypeDistribution}
                  loading={loading}
                  title="Leave Type Distribution"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Leave Type Analysis
                </Typography>
                <Typography variant="body1" paragraph>
                  This section provides detailed analysis of leave types usage across the organization.
                </Typography>
                {/* Additional leave type analytics would go here */}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Departments Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <DepartmentLeaveChart
                  data={analyticsData?.departmentLeaveDistribution}
                  loading={loading}
                  title="Leave Applications by Department"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Department Analysis
                </Typography>
                <Typography variant="body1" paragraph>
                  This section provides detailed analysis of leave patterns across different departments.
                </Typography>
                {/* Additional department analytics would go here */}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Trends Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MonthlyLeaveChart
                  data={analyticsData?.monthlyLeaveData}
                  loading={loading}
                  title="Monthly Leave Trend"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Trend Analysis
                </Typography>
                <Typography variant="body1" paragraph>
                  This section provides detailed analysis of leave trends over time.
                </Typography>
                {/* Additional trend analytics would go here */}
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Container>
    </DashboardLayout>
  );
}
