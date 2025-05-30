import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  Avatar,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Tooltip,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  Wc as GenderIcon,
  Business as BusinessIcon,
  AccountBalance as BalanceIcon,
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  HourglassEmpty as PendingIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Security as SecurityIcon,
  Close as CloseIcon,
  CheckCircle,
} from '@mui/icons-material';
// Date picker imports removed due to installation issues
import DashboardLayout from '@/components/Dashboard/Layout';
import { formatDate } from '@/utils/format';
import { Gender, User, UserRole } from '@/types';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [leaveBalances, setLeaveBalances] = useState<any[]>([]);
  const [recentLeaves, setRecentLeaves] = useState<any[]>([]);
  const [balancesLoading, setBalancesLoading] = useState(true);
  const [leavesLoading, setLeavesLoading] = useState(true);

  // Change password states
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      // Redirect administrative users to dashboard
      if ([UserRole.Admin, UserRole.SuperAdmin, UserRole.Principal, UserRole.HOD].includes(session?.user.role_id as UserRole)) {
        router.push('/dashboard');
        return;
      }

      // Fetch profile data, leave balances, and recent leaves for employees
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get('/api/users/me');
          const user = response.data.data;
          setUserData(user);
          setLoading(false);
        } catch (error: any) {
          console.error('Error fetching user profile:', error);
          setError(error.response?.data?.error || 'Failed to fetch user profile');
          setLoading(false);
        }
      };

      const fetchLeaveBalances = async () => {
        try {
          const response = await axios.get('/api/leave-balances/my-balances');
          setLeaveBalances(response.data.data || []);
          setBalancesLoading(false);
        } catch (error: any) {
          console.error('Error fetching leave balances:', error);
          setBalancesLoading(false);
        }
      };

      const fetchRecentLeaves = async () => {
        try {
          const response = await axios.get('/api/leaves');
          const allLeaves = response.data.data || [];
          // Filter to get only user's leaves and take the most recent 5
          const userLeaves = allLeaves
            .filter((leave: any) => leave.user_id === session?.user.id)
            .slice(0, 5);
          setRecentLeaves(userLeaves);
          setLeavesLoading(false);
        } catch (error: any) {
          console.error('Error fetching recent leaves:', error);
          setLeavesLoading(false);
        }
      };

      fetchUserProfile();
      fetchLeaveBalances();
      fetchRecentLeaves();
    }
  }, [session, status, router]);

  // Handle password change
  const handlePasswordChange = async () => {
    setPasswordError(null);
    setPasswordLoading(true);

    try {
      const response = await axios.put('/api/users/change-password', passwordData);

      if (response.data.success) {
        setPasswordSuccess('Password changed successfully!');
        setSnackbarOpen(true);
        setChangePasswordOpen(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error: any) {
      setPasswordError(error.response?.data?.error || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle password input change
  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value,
    }));
    setPasswordError(null);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Helper function to get role color
  const getRoleColor = (roleId: UserRole) => {
    switch (roleId) {
      case UserRole.SuperAdmin:
        return 'error';
      case UserRole.Admin:
        return 'warning';
      case UserRole.Principal:
        return 'success';
      case UserRole.HOD:
        return 'info';
      case UserRole.Employee:
        return 'primary';
      default:
        return 'default';
    }
  };

  // Helper function to get status chip for leaves
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" size="small" />;
      case 'HOD Approved':
        return <Chip icon={<PendingIcon />} label="HOD Approved" color="info" size="small" />;
      case 'Principal Approved':
        return <Chip icon={<ApprovedIcon />} label="Approved" color="success" size="small" />;
      case 'Rejected':
        return <Chip icon={<RejectedIcon />} label="Rejected" color="error" size="small" />;
      case 'Cancelled':
        return <Chip icon={<RejectedIcon />} label="Cancelled" color="default" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Helper function to calculate leave balance percentage
  const getBalancePercentage = (balance: number, maxDays: number = 30) => {
    return Math.min((balance / maxDays) * 100, 100);
  };

  // Helper function to get balance color
  const getBalanceColor = (percentage: number) => {
    if (percentage >= 70) return 'success';
    if (percentage >= 30) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Head>
        <title>My Profile | Leave Management System</title>
      </Head>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Enhanced Header Section with Perfect Alignment */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          {/* Change Password Button - Top Priority */}
          <Box display="flex" justifyContent="flex-end" mb={4}>
            <Button
              variant="contained"
              startIcon={<LockIcon />}
              onClick={() => setChangePasswordOpen(true)}
              size="large"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Change Password
            </Button>
          </Box>

          <Grid container spacing={4} alignItems="stretch">
            {/* Main Profile Information */}
            <Grid item xs={12} lg={8}>
              {/* Primary Profile Section */}
              <Box display="flex" alignItems="center" mb={4}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '3rem',
                    border: '4px solid rgba(255, 255, 255, 0.3)',
                    mr: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  }}
                >
                  {userData?.full_name?.charAt(0) || <PersonIcon fontSize="large" />}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.2 }}>
                    {userData?.full_name || session?.user?.name || 'Employee'}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 2, fontWeight: 500 }}>
                    {userData?.email || session?.user?.email}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                    <Chip
                      label={`ID: ${userData?.employee_id || session?.user?.employee_id || 'N/A'}`}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        fontSize: '0.9rem',
                        height: 36,
                      }}
                    />
                    <Chip
                      label={userData?.department?.name || session?.user?.department_name || 'N/A'}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        fontSize: '0.9rem',
                        height: 36,
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Additional Profile Details - Perfectly Aligned Grid */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" sx={{ minHeight: 60 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 3,
                      }}
                    >
                      <PhoneIcon sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.5rem' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500 }}>
                        Phone Number
                      </Typography>
                      <Typography variant="body1" fontWeight="600" sx={{ fontSize: '1.1rem' }}>
                        {userData?.phone_number || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" sx={{ minHeight: 60 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 3,
                      }}
                    >
                      <GenderIcon sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.5rem' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500 }}>
                        Gender
                      </Typography>
                      <Typography variant="body1" fontWeight="600" sx={{ fontSize: '1.1rem' }}>
                        {userData?.gender || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" sx={{ minHeight: 60 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 3,
                      }}
                    >
                      <WorkIcon sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.5rem' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500 }}>
                        Position
                      </Typography>
                      <Typography variant="body1" fontWeight="600" sx={{ fontSize: '1.1rem' }}>
                        {userData?.employee_position || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" sx={{ minHeight: 60 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 3,
                      }}
                    >
                      <CalendarIcon sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.5rem' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500 }}>
                        Joining Date
                      </Typography>
                      <Typography variant="body1" fontWeight="600" sx={{ fontSize: '1.1rem' }}>
                        {userData?.joining_date ? formatDate(userData.joining_date) : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* Stats and Status - Perfectly Aligned */}
            <Grid item xs={12} lg={4}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 400,
                }}
              >
                {/* Leave Stats */}
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, textAlign: 'center', opacity: 0.9 }}>
                    Leave Statistics
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.15)',
                          p: 3,
                          borderRadius: 3,
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          textAlign: 'center',
                          height: 100,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h3" fontWeight="bold" color="white" sx={{ lineHeight: 1 }}>
                          {leaveBalances.reduce((total, balance) => total + balance.balance, 0)}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, mt: 1 }}>
                          Total Leave Days
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.15)',
                          p: 3,
                          borderRadius: 3,
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          textAlign: 'center',
                          height: 100,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h3" fontWeight="bold" color="white" sx={{ lineHeight: 1 }}>
                          {recentLeaves.length}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, mt: 1 }}>
                          Recent Applications
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Account Information */}
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, textAlign: 'center', opacity: 0.9 }}>
                    Account Information
                  </Typography>

                  {/* Account Status */}
                  <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 2, fontWeight: 500 }}>
                      Account Status
                    </Typography>
                    <Chip
                      label={userData?.is_active ? 'Active Employee' : 'Inactive'}
                      color={userData?.is_active ? 'success' : 'error'}
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        height: 36,
                        px: 2,
                      }}
                    />
                  </Box>

                  {/* Last Login */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 2, fontWeight: 500 }}>
                      Last Login
                    </Typography>
                    <Typography variant="body1" fontWeight="600" sx={{ fontSize: '1.1rem' }}>
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Leave Balances Section */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <BalanceIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              My Leave Balances
            </Typography>
          </Box>
          {balancesLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {leaveBalances.length > 0 ? (
                leaveBalances.map((balance) => {
                  const percentage = getBalancePercentage(balance.balance, balance.leave_type_name === 'Casual Leave' ? 12 : 30);
                  const color = getBalanceColor(percentage);

                  return (
                    <Grid item xs={12} sm={6} md={4} key={balance.id}>
                      <Card elevation={1} sx={{ height: '100%', border: `2px solid ${color === 'success' ? '#4caf50' : color === 'warning' ? '#ff9800' : '#f44336'}` }}>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {balance.leave_type_name}
                            </Typography>
                            <Chip
                              label={`${balance.balance} days`}
                              color={color}
                              size="small"
                              variant="filled"
                            />
                          </Box>
                          <Box mb={2}>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                              <Typography variant="body2" color="text.secondary">
                                Available
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {balance.balance} / {balance.leave_type_name === 'Casual Leave' ? 12 : 30}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              color={color}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Financial Year: {balance.year}-{balance.year + 1}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <Alert severity="info">
                    No leave balances found. Please contact your administrator to set up your leave allocations.
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </Paper>

        {/* Recent Leave History Section */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <HistoryIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Recent Leave Applications
            </Typography>
          </Box>
          {leavesLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Leave Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Days</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Applied On</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentLeaves.length > 0 ? (
                    recentLeaves.map((leave) => (
                      <TableRow key={leave.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {leave.leave_type_name || leave.leave_type?.name || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${leave.days} ${leave.days === 1 ? 'day' : 'days'}`}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(leave.created_at)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {getStatusChip(leave.status)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="text.secondary" py={2}>
                          No leave applications found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>



        {/* Enhanced Change Password Dialog */}
        <Dialog
          open={changePasswordOpen}
          onClose={() => setChangePasswordOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <LockIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    Change Password
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Update your account password for better security
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setChangePasswordOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ px: 3 }}>
            {passwordError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                <Typography variant="body2" fontWeight="medium">
                  {passwordError}
                </Typography>
              </Alert>
            )}

            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Password Requirements:</strong>
                <br />• Minimum 6 characters long
                <br />• Must be different from your current password
                <br />• Use a combination of letters, numbers, and symbols for better security
              </Typography>
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'white',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('current')}
                          edge="end"
                        >
                          {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'white',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SecurityIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('new')}
                          edge="end"
                        >
                          {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                  error={passwordData.confirmPassword !== '' && passwordData.newPassword !== passwordData.confirmPassword}
                  helperText={
                    passwordData.confirmPassword !== '' && passwordData.newPassword !== passwordData.confirmPassword
                      ? 'Passwords do not match'
                      : passwordData.confirmPassword !== '' && passwordData.newPassword === passwordData.confirmPassword
                      ? '✓ Passwords match'
                      : ''
                  }
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'white',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CheckCircle color={passwordData.confirmPassword !== '' && passwordData.newPassword === passwordData.confirmPassword ? 'success' : 'action'} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('confirm')}
                          edge="end"
                        >
                          {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setChangePasswordOpen(false)}
              disabled={passwordLoading}
              variant="outlined"
              size="large"
              sx={{ borderRadius: 2, px: 4 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordChange}
              variant="contained"
              size="large"
              disabled={
                passwordLoading ||
                !passwordData.currentPassword ||
                !passwordData.newPassword ||
                !passwordData.confirmPassword ||
                passwordData.newPassword !== passwordData.confirmPassword ||
                passwordData.newPassword.length < 6
              }
              startIcon={passwordLoading ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
              sx={{
                borderRadius: 2,
                px: 4,
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                }
              }}
            >
              {passwordLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            {passwordSuccess}
          </Alert>
        </Snackbar>
      </Container>
    </DashboardLayout>
  );
}
