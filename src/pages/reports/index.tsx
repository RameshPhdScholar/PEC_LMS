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
  Card,
  CardContent,
  CircularProgress,
  Button,
  Divider,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  FileDownload as DownloadIcon,
  Assessment as ReportIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import DashboardLayout from '@/components/Dashboard/Layout';
import {
  UserRole,
  LeaveApplication,
  LeaveStatus,
  Department,
  LeaveType,
  DepartmentLeaveDistribution,
  LeaveDistribution,
  MonthlyLeaveData,
} from '@/types';
import { formatDate } from '@/utils/format';

// Tab panel component
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
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// COLORS for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Reports() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

  // Report data
  const [departmentLeaveData, setDepartmentLeaveData] = useState<DepartmentLeaveDistribution[]>([]);
  const [leaveTypeData, setLeaveTypeData] = useState<LeaveDistribution[]>([]);
  const [monthlyLeaveData, setMonthlyLeaveData] = useState<MonthlyLeaveData[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);

  // Filters
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [departmentId, setDepartmentId] = useState<string>('');
  const [leaveTypeId, setLeaveTypeId] = useState<string>('');

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Only HODs, Principals, and Admins can access reports
    if (session && ![UserRole.HOD, UserRole.Principal, UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all leaves
        const leavesResponse = await axios.get('/api/leaves');
        let leavesData = leavesResponse.data.data || [];

        // If user is HOD, filter leaves to only show their department
        if (session?.user.role_id === UserRole.HOD && session?.user.department_id) {
          leavesData = leavesData.filter(leave =>
            leave.user?.department_id === session.user.department_id ||
            leave.department_name === departments.find(d => d.id === session.user.department_id)?.name
          );

          // For HODs, automatically set the department filter to their department
          setDepartmentId(session.user.department_id.toString());
        }

        setLeaves(leavesData);

        // Fetch departments
        const departmentsResponse = await axios.get('/api/departments');
        setDepartments(departmentsResponse.data.data || []);

        // Fetch leave types
        const leaveTypesResponse = await axios.get('/api/leave-types');
        setLeaveTypes(leaveTypesResponse.data.data || []);

        // Process data for reports
        processReportData(leavesData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session, status, router]);

  // Process data when filters change
  useEffect(() => {
    if (leaves.length > 0) {
      processReportData(leaves);
    }
  }, [year, departmentId, leaveTypeId, leaves]);

  const processReportData = (leavesData: LeaveApplication[]) => {
    // Filter data based on selected filters
    let filteredLeaves = [...leavesData];

    // Filter by year
    if (year) {
      filteredLeaves = filteredLeaves.filter(leave =>
        new Date(leave.created_at).getFullYear() === year
      );
    }

    // Filter by department
    if (departmentId) {
      filteredLeaves = filteredLeaves.filter(leave =>
        leave.user?.department_id === parseInt(departmentId)
      );
    }

    // Filter by leave type
    if (leaveTypeId) {
      filteredLeaves = filteredLeaves.filter(leave =>
        leave.leave_type_id === parseInt(leaveTypeId)
      );
    }

    // Process department-wise leave distribution
    const deptData: Record<string, number> = {};
    filteredLeaves.forEach(leave => {
      let deptName = 'Unknown';
      if (leave.user?.department?.name && leave.user?.department?.code) {
        deptName = `${leave.user.department.name} (${leave.user.department.code})`;
      } else if (leave.department_name) {
        deptName = leave.department_name;
      }
      deptData[deptName] = (deptData[deptName] || 0) + 1;
    });

    const departmentLeaveDistribution = Object.keys(deptData).map(dept => ({
      department: dept,
      count: deptData[dept]
    }));
    setDepartmentLeaveData(departmentLeaveDistribution);

    // Process leave type distribution
    const leaveTypeDataMap: Record<string, number> = {};
    filteredLeaves.forEach(leave => {
      const typeName = leave.leave_type?.name || leave.leave_type_name || 'Unknown';
      leaveTypeDataMap[typeName] = (leaveTypeDataMap[typeName] || 0) + 1;
    });

    const leaveTypeDistribution = Object.keys(leaveTypeDataMap).map(type => ({
      leave_type: type,
      count: leaveTypeDataMap[type]
    }));
    setLeaveTypeData(leaveTypeDistribution);

    // Process monthly leave data
    const monthlyData: Record<string, number> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    months.forEach(month => {
      monthlyData[month] = 0;
    });

    filteredLeaves.forEach(leave => {
      const month = new Date(leave.created_at).getMonth();
      const monthName = months[month];
      monthlyData[monthName] = (monthlyData[monthName] || 0) + 1;
    });

    const monthlyLeaveDistribution = months.map(month => ({
      month,
      count: monthlyData[month]
    }));
    setMonthlyLeaveData(monthlyLeaveDistribution);

    // Process status-based data
    const statusDataMap: Record<string, number> = {};
    filteredLeaves.forEach(leave => {
      statusDataMap[leave.status] = (statusDataMap[leave.status] || 0) + 1;
    });

    const statusDistribution = Object.keys(statusDataMap).map(status => ({
      name: status,
      value: statusDataMap[status]
    }));
    setStatusData(statusDistribution);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Calculate tab indices based on user role
  const getTabIndex = (baseIndex: number) => {
    if (session?.user.role_id === UserRole.HOD) {
      // For HODs, skip the department-wise tab (index 0)
      return baseIndex > 0 ? baseIndex - 1 : baseIndex;
    }
    return baseIndex;
  };

  const exportToCSV = (data: any[], filename: string) => {
    // Create CSV content
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(','));
    const csvContent = [headers, ...rows].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
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
        <title>Reports | Leave Management System</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
            Leave Reports
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Filters */}
          <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  variant="outlined"
                  size="small"
                  InputProps={{ inputProps: { min: 2000, max: 2100 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    label="Department"
                    disabled={session?.user.role_id === UserRole.HOD}
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id.toString()}>
                        {dept.name} ({dept.code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Leave Type</InputLabel>
                  <Select
                    value={leaveTypeId}
                    onChange={(e) => setLeaveTypeId(e.target.value)}
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
            </Grid>
          </Paper>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
              {/* Department-wise tab only visible to Admin, Super Admin, and Principal */}
              {session?.user.role_id !== UserRole.HOD && (
                <Tab icon={<BarChartIcon />} label="Department-wise" />
              )}
              <Tab icon={<PieChartIcon />} label="Leave Type" />
              <Tab icon={<TimelineIcon />} label="Monthly Trends" />
              <Tab icon={<ReportIcon />} label="Status-wise" />
            </Tabs>
          </Box>

          {/* Department-wise Leave Distribution - Only for Admin, Super Admin, and Principal */}
          {session?.user.role_id !== UserRole.HOD && (
            <TabPanel value={tabValue} index={0}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Department-wise Leave Distribution</Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => exportToCSV(departmentLeaveData, 'department_leave_report')}
                  disabled={departmentLeaveData.length === 0}
                >
                  Export
                </Button>
              </Box>

              {departmentLeaveData.length === 0 ? (
                <Typography variant="body1" textAlign="center" py={5} color="text.secondary">
                  No data available for the selected filters
                </Typography>
              ) : (
                <Box height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departmentLeaveData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="department"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Number of Leaves" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </TabPanel>
          )}

          {/* Leave Type Distribution */}
          <TabPanel value={tabValue} index={getTabIndex(1)}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Leave Type Distribution</Typography>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => exportToCSV(leaveTypeData, 'leave_type_report')}
                disabled={leaveTypeData.length === 0}
              >
                Export
              </Button>
            </Box>

            {leaveTypeData.length === 0 ? (
              <Typography variant="body1" textAlign="center" py={5} color="text.secondary">
                No data available for the selected filters
              </Typography>
            ) : (
              <Box height={400} display="flex" justifyContent="center">
                <ResponsiveContainer width="80%" height="100%">
                  <PieChart>
                    <Pie
                      data={leaveTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ leave_type, percent }) => `${leave_type}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="leave_type"
                    >
                      {leaveTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} leaves`, props.payload.leave_type]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </TabPanel>

          {/* Monthly Leave Trends */}
          <TabPanel value={tabValue} index={getTabIndex(2)}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Monthly Leave Trends</Typography>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => exportToCSV(monthlyLeaveData, 'monthly_leave_report')}
                disabled={monthlyLeaveData.length === 0}
              >
                Export
              </Button>
            </Box>

            {monthlyLeaveData.every(item => item.count === 0) ? (
              <Typography variant="body1" textAlign="center" py={5} color="text.secondary">
                No data available for the selected filters
              </Typography>
            ) : (
              <Box height={400}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyLeaveData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of Leaves" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </TabPanel>

          {/* Status-wise Distribution */}
          <TabPanel value={tabValue} index={getTabIndex(3)}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Status-wise Leave Distribution</Typography>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => exportToCSV(statusData, 'status_leave_report')}
                disabled={statusData.length === 0}
              >
                Export
              </Button>
            </Box>

            {statusData.length === 0 ? (
              <Typography variant="body1" textAlign="center" py={5} color="text.secondary">
                No data available for the selected filters
              </Typography>
            ) : (
              <Box height={400} display="flex" justifyContent="center">
                <ResponsiveContainer width="80%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} leaves`, props.payload.name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </TabPanel>
        </Paper>
      </Container>
    </DashboardLayout>
  );
}
