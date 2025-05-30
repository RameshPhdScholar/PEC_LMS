import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  EventNote,
  Assessment,
  MoreVert,
  Download,
  Refresh,
  FilterList,
  CalendarToday,
  Business,
} from '@mui/icons-material';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { StatCard } from '@/components/Analytics';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface SuperAdminDashboardProps {
  userId?: number;
}

interface DashboardStats {
  totalEmployees: number;
  totalLeaves: number;
  pendingApprovals: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  departmentCount: number;
  employeeTrend: number;
  leaveTrend: number;
}

interface LeaveAnalytics {
  dailyLeaves: { date: string; count: number }[];
  monthlyLeaves: { month: string; count: number }[];
  departmentWiseLeaves: { department: string; count: number }[];
  leaveTypeDistribution: { type: string; count: number }[];
  employeeLeavePattern: { employee: string; leaves: number; department: string }[];
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ userId }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<LeaveAnalytics | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API calls - replace with actual API endpoints
      const mockStats: DashboardStats = {
        totalEmployees: 245,
        totalLeaves: 1234,
        pendingApprovals: 23,
        approvedLeaves: 1089,
        rejectedLeaves: 122,
        departmentCount: 8,
        employeeTrend: 12.5,
        leaveTrend: -3.2,
      };

      const mockAnalytics: LeaveAnalytics = {
        dailyLeaves: Array.from({ length: 30 }, (_, i) => ({
          date: format(subDays(new Date(), 29 - i), 'MMM dd'),
          count: Math.floor(Math.random() * 20) + 5,
        })),
        monthlyLeaves: [
          { month: 'Jan', count: 89 },
          { month: 'Feb', count: 76 },
          { month: 'Mar', count: 102 },
          { month: 'Apr', count: 95 },
          { month: 'May', count: 118 },
          { month: 'Jun', count: 134 },
        ],
        departmentWiseLeaves: [
          { department: 'Engineering', count: 234 },
          { department: 'Marketing', count: 156 },
          { department: 'Sales', count: 189 },
          { department: 'HR', count: 98 },
          { department: 'Finance', count: 123 },
        ],
        leaveTypeDistribution: [
          { type: 'Annual Leave', count: 456 },
          { type: 'Sick Leave', count: 234 },
          { type: 'Personal Leave', count: 189 },
          { type: 'Emergency Leave', count: 98 },
        ],
        employeeLeavePattern: [
          { employee: 'John Doe', leaves: 23, department: 'Engineering' },
          { employee: 'Jane Smith', leaves: 19, department: 'Marketing' },
          { employee: 'Mike Johnson', leaves: 25, department: 'Sales' },
          { employee: 'Sarah Wilson', leaves: 18, department: 'HR' },
          { employee: 'David Brown', leaves: 21, department: 'Finance' },
        ],
      };

      setStats(mockStats);
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const exportData = (format: string) => {
    console.log(`Exporting data in ${format} format`);
    handleMenuClose();
  };

  if (loading || !stats || !analytics) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>Loading dashboard...</Typography>
      </Box>
    );
  }

  const dailyLeavesChartData = {
    labels: analytics.dailyLeaves.map(item => item.date),
    datasets: [
      {
        label: 'Daily Leaves',
        data: analytics.dailyLeaves.map(item => item.count),
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
        tension: 0.4,
      },
    ],
  };

  const monthlyLeavesChartData = {
    labels: analytics.monthlyLeaves.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Leaves',
        data: analytics.monthlyLeaves.map(item => item.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const departmentChartData = {
    labels: analytics.departmentWiseLeaves.map(item => item.department),
    datasets: [
      {
        data: analytics.departmentWiseLeaves.map(item => item.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  const leaveTypeChartData = {
    labels: analytics.leaveTypeDistribution.map(item => item.type),
    datasets: [
      {
        data: analytics.leaveTypeDistribution.map(item => item.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Super Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchDashboardData}
          >
            Refresh
          </Button>
          <IconButton onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => exportData('PDF')}>
              <Download sx={{ mr: 1 }} /> Export PDF
            </MenuItem>
            <MenuItem onClick={() => exportData('Excel')}>
              <Download sx={{ mr: 1 }} /> Export Excel
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={<People />}
            color={theme.palette.primary.main}
            trend={{
              value: stats.employeeTrend,
              isPositive: stats.employeeTrend > 0,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Total Leaves"
            value={stats.totalLeaves}
            icon={<EventNote />}
            color={theme.palette.secondary.main}
            trend={{
              value: stats.leaveTrend,
              isPositive: stats.leaveTrend > 0,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={<CalendarToday />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Approved Leaves"
            value={stats.approvedLeaves}
            icon={<TrendingUp />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Rejected Leaves"
            value={stats.rejectedLeaves}
            icon={<TrendingDown />}
            color={theme.palette.error.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Departments"
            value={stats.departmentCount}
            icon={<Business />}
            color={theme.palette.info.main}
          />
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Overview" />
          <Tab label="Leave Analytics" />
          <Tab label="Employee Insights" />
          <Tab label="Department Analysis" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Daily Leave Trends (Last 30 Days)
              </Typography>
              <Line data={dailyLeavesChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Leave Type Distribution
              </Typography>
              <Doughnut data={leaveTypeChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </Paper>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Leave Trends
              </Typography>
              <Bar data={monthlyLeavesChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Department-wise Leaves
              </Typography>
              <Pie data={departmentChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </Paper>
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Employee Leave Patterns
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell align="right">Total Leaves</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analytics.employeeLeavePattern.map((employee, index) => (
                      <TableRow key={index}>
                        <TableCell>{employee.employee}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell align="right">{employee.leaves}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={employee.leaves > 20 ? 'High Usage' : 'Normal'}
                            color={employee.leaves > 20 ? 'warning' : 'success'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tabValue === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Department Analysis
              </Typography>
              <Grid container spacing={2}>
                {analytics.departmentWiseLeaves.map((dept, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardHeader title={dept.department} />
                      <CardContent>
                        <Typography variant="h4" color="primary">
                          {dept.count}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Leaves
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default SuperAdminDashboard;