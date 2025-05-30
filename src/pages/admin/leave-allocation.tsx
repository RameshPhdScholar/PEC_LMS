import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Autocomplete,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/Dashboard/Layout';
import { User, LeaveType, LeaveBalance, UserRole, Department } from '@/types';

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
      id={`leave-allocation-tabpanel-${index}`}
      aria-labelledby={`leave-allocation-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function LeaveAllocationPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // State management
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');



  // Filter states
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDepartment, setSelectedDepartment] = useState<number | ''>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingBalance, setEditingBalance] = useState<LeaveBalance | null>(null);
  const [selectedUserForAction, setSelectedUserForAction] = useState<User | null>(null);
  const [newBalance, setNewBalance] = useState(0);
  const [createLeaveType, setCreateLeaveType] = useState<number | ''>('');
  const [createDays, setCreateDays] = useState(0);



  // Annual renewal state
  const [renewalDialogOpen, setRenewalDialogOpen] = useState(false);
  const [renewalLoading, setRenewalLoading] = useState(false);

  // Check authentication and authorization
  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      router.push('/dashboard');
      return;
    }
  }, [session, router]);

  // Fetch initial data
  useEffect(() => {
    if (session && [UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      fetchUsers();
      fetchDepartments();
      fetchLeaveTypes();
      fetchLeaveBalances();
    }
  }, [session, selectedYear, selectedDepartment]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      const userData = response.data.data || [];
      console.log('Fetched users:', userData.length, userData);
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/departments');
      const deptData = response.data.data || [];
      console.log('Fetched departments:', deptData.length, deptData);
      setDepartments(deptData);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to fetch departments');
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      const response = await axios.get('/api/leave-types');
      const leaveTypeData = response.data.data || [];
      console.log('Fetched leave types:', leaveTypeData.length, leaveTypeData);
      setLeaveTypes(leaveTypeData);
    } catch (error) {
      console.error('Error fetching leave types:', error);
      setError('Failed to fetch leave types');
    }
  };

  const fetchLeaveBalances = async () => {
    try {
      setLoading(true);
      let url = `/api/leave-balances?year=${selectedYear}`;

      if (selectedDepartment) {
        // Filter by department - we'll need to modify the API to support this
        url += `&department_id=${selectedDepartment}`;
      }

      console.log('Fetching leave balances from:', url);
      const response = await axios.get(url);
      const balanceData = response.data.data || [];
      console.log('Fetched leave balances:', balanceData.length, balanceData);
      setLeaveBalances(balanceData);
    } catch (error: any) {
      console.error('Error fetching leave balances:', error);
      setError(error.response?.data?.error || 'Failed to fetch leave balances');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditBalance = (balance: LeaveBalance) => {
    setEditingBalance(balance);
    setNewBalance(balance.balance);
    setEditDialogOpen(true);
  };

  const handleSaveBalance = async () => {
    if (!editingBalance) return;

    try {
      setLoading(true);

      // Use PUT method for updating existing balance
      await axios.put(`/api/leave-balances/${editingBalance.id}`, {
        balance: newBalance,
      });

      setSuccess(`Leave balance updated successfully for ${editingBalance.user_name}`);
      await fetchLeaveBalances();
      setEditDialogOpen(false);
      setEditingBalance(null);
      setNewBalance(0);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to update leave balance');
    } finally {
      setLoading(false);
    }
  };

  // CREATE: Add new leave allocation
  const handleCreateLeaveAllocation = async () => {
    if (!selectedUserForAction || !createLeaveType || createDays < 0) {
      setError('Please select a leave type and enter valid days');
      return;
    }

    // Check if trying to assign Maternity Leave to non-female employee
    const selectedLeaveType = leaveTypes.find(lt => lt.id === createLeaveType);
    if (selectedLeaveType?.name.toLowerCase() === 'maternity leave' &&
        selectedUserForAction.gender !== 'Female') {
      setError('Maternity Leave can only be allocated to female employees');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/leave-balances', {
        user_id: selectedUserForAction.id,
        leave_type_id: createLeaveType,
        balance: createDays,
        year: selectedYear,
      });

      setSuccess(`Successfully created ${createDays} days allocation`);
      await fetchLeaveBalances();
      setCreateDialogOpen(false);
      setSelectedUserForAction(null);
      setCreateLeaveType('');
      setCreateDays(0);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to create leave allocation');
    } finally {
      setLoading(false);
    }
  };

  // DELETE: Remove leave allocation
  const handleDeleteLeaveAllocation = async () => {
    if (!editingBalance) return;

    try {
      setLoading(true);
      await axios.delete(`/api/leave-balances/${editingBalance.id}`);

      setSuccess('Leave allocation deleted successfully');
      await fetchLeaveBalances();
      setDeleteDialogOpen(false);
      setEditingBalance(null);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to delete leave allocation');
    } finally {
      setLoading(false);
    }
  };


  // Annual casual leave renewal
  const handleAnnualRenewal = async () => {
    setRenewalLoading(true);
    try {
      const response = await axios.post('/api/admin/annual-leave-renewal', {
        year: selectedYear,
      });

      setSuccess(response.data.message);
      setRenewalDialogOpen(false);
      await fetchLeaveBalances(); // Refresh the data
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to perform annual leave renewal');
    } finally {
      setRenewalLoading(false);
    }
  };





  // Generate years for selection
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Filter leave balances based on selected filters
  const filteredBalances = leaveBalances.filter(balance => {
    if (selectedDepartment) {
      const user = users.find(u => u.id === balance.user_id);
      return user?.department_id === selectedDepartment;
    }
    return true;
  });

  // Group balances by user for better display
  const groupedBalances = filteredBalances.reduce((acc, balance) => {
    const userId = balance.user_id;
    if (!acc[userId]) {
      acc[userId] = {
        user: users.find(u => u.id === userId),
        balances: []
      };
    }
    acc[userId].balances.push(balance);
    return acc;
  }, {} as Record<number, { user?: User; balances: LeaveBalance[] }>);

  // Add users who don't have any leave balances yet
  const filteredUsers = selectedDepartment
    ? users.filter(u => u.department_id === selectedDepartment)
    : users;

  filteredUsers.forEach(user => {
    if (!groupedBalances[user.id]) {
      groupedBalances[user.id] = {
        user: user,
        balances: []
      };
    }
  });

  if (!session || ![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
    return null;
  }

  return (
    <DashboardLayout title="Leave Allocation">
      <Box sx={{ width: '100%' }}>


        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="leave allocation tabs">
            <Tab label="Individual Allocation" />
            <Tab label="Leave Summary" />
          </Tabs>
        </Paper>

        {/* Individual Allocation Tab */}
        <TabPanel value={tabValue} index={0}>
          {/* Enhanced Filters Section */}
          <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <FilterIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                Filter & Search Options
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Financial Year</InputLabel>
                  <Select
                    value={selectedYear}
                    label="Financial Year"
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    sx={{ backgroundColor: 'white' }}
                  >
                    {years.map(year => (
                      <MenuItem key={year} value={year}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" fontWeight="medium">
                            {year}-{year + 1}
                          </Typography>
                          {year === currentYear && (
                            <Chip label="Current" size="small" color="primary" sx={{ ml: 1 }} />
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={selectedDepartment}
                    label="Department"
                    onChange={(e) => setSelectedDepartment(e.target.value as number | '')}
                    sx={{ backgroundColor: 'white' }}
                  >
                    <MenuItem value="">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight="medium">
                          All Departments
                        </Typography>
                        <Chip label={`${departments.length} total`} size="small" sx={{ ml: 1 }} />
                      </Box>
                    </MenuItem>
                    {departments.map(dept => (
                      <MenuItem key={dept.id} value={dept.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <Typography variant="body2">{dept.name}</Typography>
                          <Chip label={dept.code} size="small" variant="outlined" />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  options={users}
                  getOptionLabel={(option) => `${option.full_name} (${option.employee_id})`}
                  value={selectedUser}
                  onChange={(_event, newValue) => setSelectedUser(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Employee"
                      variant="outlined"
                      sx={{ backgroundColor: 'white' }}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <Typography variant="body2" fontWeight="medium">
                          {option.full_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.employee_id} • {departments.find(d => d.id === option.department_id)?.name || 'No Department'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={fetchLeaveBalances}
                  fullWidth
                  sx={{
                    height: 56,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                    }
                  }}
                >
                  Refresh
                </Button>
              </Grid>
            </Grid>

            {/* Annual Renewal Section */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Annual Casual Leave Renewal
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Renew casual leave allocation (12 days) for all existing users for the selected financial year.
                This will ensure all users get their annual casual leave allocation.
              </Typography>
              <Button
                variant="contained"
                color="warning"
                startIcon={<RefreshIcon />}
                onClick={() => setRenewalDialogOpen(true)}
                disabled={renewalLoading}
              >
                Renew Casual Leaves for {selectedYear}-{selectedYear + 1}
              </Button>
            </Box>
          </Paper>

          {/* Enhanced Leave Balances Table */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  Employee Leave Balances ({selectedYear}-{selectedYear + 1})
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Manage individual leave allocations for all employees
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>System Overview:</strong>
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                  <Chip label={`${users.length} Users`} size="small" color="primary" variant="outlined" />
                  <Chip label={`${departments.length} Departments`} size="small" color="secondary" variant="outlined" />
                  <Chip label={`${leaveTypes.length} Leave Types`} size="small" color="info" variant="outlined" />
                  <Chip label={`${leaveBalances.length} Allocations`} size="small" color="success" variant="outlined" />
                </Box>
              </Box>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : Object.keys(groupedBalances).length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No employees found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedDepartment
                    ? "No employees found in the selected department."
                    : "No employees found in the system. Please add employees first."}
                </Typography>
              </Box>
            ) : (
              <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white', minWidth: 200 }}>
                        Employee Details
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white', minWidth: 120 }}>
                        Employee ID
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white', minWidth: 100 }}>
                        Gender
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white', minWidth: 200 }}>
                        Department
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'success.main', color: 'white', minWidth: 150 }}>
                        Casual Leave
                        <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>
                          (Fixed: 12 days)
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'info.main', color: 'white', minWidth: 150 }}>
                        On Duty Leave
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'warning.main', color: 'white', minWidth: 180 }}>
                        Compensatory Casual Leave
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'error.main', color: 'white', minWidth: 150 }}>
                        Sick Leave
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'secondary.main', color: 'white', minWidth: 150 }}>
                        Maternity Leave
                        <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>
                          (Female only)
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.dark', color: 'white', minWidth: 150 }}>
                        Vacation Leave
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'grey.800', color: 'white', minWidth: 120 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(groupedBalances)
                      .filter(([userId, _data]) => !selectedUser || Number(userId) === selectedUser.id)
                      .map(([userId, data]) => {
                        const user = data.user;
                        const department = departments.find(d => d.id === user?.department_id);

                        // Create a map of leave type balances
                        const balanceMap = data.balances.reduce((acc, balance) => {
                          const leaveType = leaveTypes.find(lt => lt.id === balance.leave_type_id);
                          if (leaveType) {
                            acc[leaveType.name] = balance;
                          }
                          return acc;
                        }, {} as Record<string, LeaveBalance>);

                        return (
                          <TableRow
                            key={userId}
                            hover
                            sx={{
                              '&:hover': { backgroundColor: 'action.hover' },
                              '&:nth-of-type(odd)': { backgroundColor: 'action.selected' }
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="body2" fontWeight="medium">
                                  {user?.full_name || 'Employee Name Not Available'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {user?.employee_position || 'Position Not Set'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={user?.employee_id || 'ID Not Set'}
                                size="small"
                                variant="outlined"
                                color={user?.employee_id ? 'primary' : 'default'}
                                sx={{ fontWeight: 'bold' }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={user?.gender || 'Not Specified'}
                                size="small"
                                color={user?.gender === 'Female' ? 'secondary' : user?.gender === 'Male' ? 'primary' : 'default'}
                                variant="filled"
                                sx={{ minWidth: 70 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="body2" fontWeight="medium">
                                  {department?.name || 'Department Not Assigned'}
                                </Typography>
                                {department?.code && (
                                  <Chip
                                    label={department.code}
                                    size="small"
                                    variant="outlined"
                                    sx={{ mt: 0.5, width: 'fit-content' }}
                                  />
                                )}
                              </Box>
                            </TableCell>
                            {leaveTypes.map(leaveType => {
                              const balance = balanceMap[leaveType.name];
                              const isEditable = leaveType.name.toLowerCase() !== 'casual leave';
                              const isMaternityLeave = leaveType.name.toLowerCase() === 'maternity leave';
                              const isMaternityRestricted = isMaternityLeave && user?.gender !== 'Female';

                              return (
                                <TableCell key={leaveType.id}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                                    {isMaternityRestricted ? (
                                      <Tooltip title="Maternity Leave is only available for female employees">
                                        <Chip
                                          label="Not Applicable"
                                          color="default"
                                          size="small"
                                          variant="outlined"
                                          sx={{
                                            opacity: 0.6,
                                            fontStyle: 'italic'
                                          }}
                                        />
                                      </Tooltip>
                                    ) : (
                                      <>
                                        <Chip
                                          label={balance ? `${balance.balance} days` : 'Not Set'}
                                          color={
                                            balance
                                              ? balance.balance > 0
                                                ? 'success'
                                                : 'warning'
                                              : 'default'
                                          }
                                          size="small"
                                          variant={balance ? 'filled' : 'outlined'}
                                        />
                                        {balance ? (
                                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            {isEditable && (
                                              <Tooltip title={`Edit ${leaveType.name} Balance`}>
                                                <IconButton
                                                  size="small"
                                                  onClick={() => handleEditBalance(balance)}
                                                  sx={{
                                                    '&:hover': {
                                                      backgroundColor: 'primary.light',
                                                      color: 'white'
                                                    }
                                                  }}
                                                >
                                                  <EditIcon fontSize="small" />
                                                </IconButton>
                                              </Tooltip>
                                            )}
                                            {isEditable && (
                                              <Tooltip title={`Delete ${leaveType.name} Allocation`}>
                                                <IconButton
                                                  size="small"
                                                  color="error"
                                                  onClick={() => {
                                                    setEditingBalance(balance);
                                                    setDeleteDialogOpen(true);
                                                  }}
                                                  sx={{
                                                    '&:hover': {
                                                      backgroundColor: 'error.light',
                                                      color: 'white'
                                                    }
                                                  }}
                                                >
                                                  <DeleteIcon fontSize="small" />
                                                </IconButton>
                                              </Tooltip>
                                            )}
                                          </Box>
                                        ) : (
                                          <Tooltip title={`Create ${leaveType.name} Allocation`}>
                                            <IconButton
                                              size="small"
                                              color="primary"
                                              onClick={() => {
                                                if (user) {
                                                  setSelectedUserForAction(user);
                                                  setCreateLeaveType(leaveType.id);
                                                  setCreateDialogOpen(true);
                                                }
                                              }}
                                              sx={{
                                                '&:hover': {
                                                  backgroundColor: 'success.light',
                                                  color: 'white'
                                                }
                                              }}
                                            >
                                              <AddIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        )}
                                      </>
                                    )}
                                  </Box>
                                </TableCell>
                              );
                            })}
                            <TableCell align="center">
                              {/* Actions column - buttons removed as per request */}
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



        {/* Leave Summary Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {/* Summary Cards */}
            {leaveTypes.map(leaveType => {
              const typeBalances = filteredBalances.filter(b => b.leave_type_id === leaveType.id);
              const totalAllocated = typeBalances.reduce((sum, b) => sum + b.balance, 0);
              const avgPerEmployee = typeBalances.length > 0 ? totalAllocated / typeBalances.length : 0;

              return (
                <Grid item xs={12} md={4} key={leaveType.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {leaveType.name}
                      </Typography>
                      <Typography variant="h4" color="primary" gutterBottom>
                        {totalAllocated}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total days allocated
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2">
                        Average per employee: {avgPerEmployee.toFixed(1)} days
                      </Typography>
                      <Typography variant="body2">
                        Employees with allocation: {typeBalances.filter(b => b.balance > 0).length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>

        {/* Edit Balance Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" component="div">
              Edit Leave Balance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update the leave allocation for this employee
            </Typography>
          </DialogTitle>
          <DialogContent>
            {editingBalance && (
              <Box sx={{ pt: 2 }}>
                <Paper sx={{ p: 2, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Current Allocation Details
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Employee:</strong> {editingBalance.user_name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Leave Type:</strong> {editingBalance.leave_type_name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Current Balance:</strong> {editingBalance.balance} days
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Financial Year:</strong> {selectedYear}-{selectedYear + 1}
                  </Typography>
                </Paper>

                <TextField
                  autoFocus
                  label="New Balance (Days)"
                  type="number"
                  fullWidth
                  value={newBalance}
                  onChange={(e) => setNewBalance(Number(e.target.value))}
                  InputProps={{
                    inputProps: { min: 0, max: 365, step: 0.5 },
                    endAdornment: <Typography variant="body2" color="text.secondary">days</Typography>
                  }}
                  disabled={editingBalance.leave_type_name?.toLowerCase() === 'casual leave'}
                  error={newBalance < 0}
                  helperText={
                    newBalance < 0
                      ? "Balance cannot be negative"
                      : editingBalance.leave_type_name?.toLowerCase() === 'casual leave'
                        ? "Casual Leave is fixed at 12 days per year"
                        : `Change from ${editingBalance.balance} to ${newBalance} days`
                  }
                  sx={{ mb: 2 }}
                />

                {editingBalance.leave_type_name?.toLowerCase() === 'casual leave' ? (
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>Casual Leave Policy:</strong> This leave type is fixed at 12 days per year and cannot be modified by administrators.
                    </Typography>
                  </Alert>
                ) : (
                  <Alert severity={newBalance !== editingBalance.balance ? "warning" : "info"}>
                    <Typography variant="body2">
                      {newBalance !== editingBalance.balance
                        ? `You are changing the balance from ${editingBalance.balance} to ${newBalance} days. This will ${newBalance > editingBalance.balance ? 'increase' : 'decrease'} the employee's available leave days.`
                        : "Enter a new balance value to update this leave allocation."
                      }
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setEditDialogOpen(false)}
              disabled={loading}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveBalance}
              color="primary"
              variant="contained"
              disabled={
                loading ||
                editingBalance?.leave_type_name?.toLowerCase() === 'casual leave' ||
                newBalance < 0 ||
                newBalance === editingBalance?.balance
              }
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {loading ? 'Saving...' : 'Update Balance'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Leave Allocation Dialog */}
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" component="div">
              Create Leave Allocation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add a new leave allocation for an employee
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedUserForAction && (
              <Box sx={{ pt: 2 }}>
                <Paper sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Employee Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Name:</strong> {selectedUserForAction.full_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Employee ID:</strong> {selectedUserForAction.employee_id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Financial Year:</strong> {selectedYear}-{selectedYear + 1}
                  </Typography>
                </Paper>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Leave Type *</InputLabel>
                  <Select
                    value={createLeaveType}
                    label="Leave Type *"
                    onChange={(e) => setCreateLeaveType(e.target.value as number)}
                    error={createLeaveType === '' && createDays > 0}
                  >
                    {leaveTypes
                      .filter(lt => {
                        // Exclude casual leave
                        if (lt.name.toLowerCase() === 'casual leave') return false;

                        // Exclude Maternity Leave for non-female employees
                        if (lt.name.toLowerCase() === 'maternity leave' &&
                            selectedUserForAction?.gender !== 'Female') return false;

                        return true;
                      })
                      .map(leaveType => {
                        // Check if this leave type already exists for this user
                        const existingBalance = leaveBalances.find(
                          b => b.user_id === selectedUserForAction.id &&
                               b.leave_type_id === leaveType.id &&
                               b.year === selectedYear
                        );

                        return (
                          <MenuItem key={leaveType.id} value={leaveType.id}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                              <span>{leaveType.name}</span>
                              {existingBalance && (
                                <Chip
                                  label={`${existingBalance.balance} days`}
                                  size="small"
                                  color="warning"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </MenuItem>
                        );
                      })}
                  </Select>
                  {createLeaveType === '' && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      Select a leave type to create allocation
                      {selectedUserForAction?.gender !== 'Female' && (
                        <><br />Note: Maternity Leave is only available for female employees</>
                      )}
                    </Typography>
                  )}
                </FormControl>

                <TextField
                  label="Number of Days *"
                  type="number"
                  fullWidth
                  value={createDays}
                  onChange={(e) => setCreateDays(Number(e.target.value))}
                  InputProps={{
                    inputProps: { min: 0, max: 365, step: 0.5 },
                    endAdornment: <Typography variant="body2" color="text.secondary">days</Typography>
                  }}
                  error={createDays < 0}
                  helperText={createDays < 0 ? "Days cannot be negative" : "Enter the number of leave days to allocate"}
                  sx={{ mb: 2 }}
                />

                <Alert
                  severity={createLeaveType && createDays >= 0 ? "success" : "info"}
                  sx={{ mt: 1 }}
                >
                  {createLeaveType && createDays >= 0
                    ? `Ready to create ${createDays} days allocation for ${leaveTypes.find(lt => lt.id === createLeaveType)?.name}`
                    : "Fill in the required fields to create a new leave allocation"
                  }
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => {
                setCreateDialogOpen(false);
                setCreateLeaveType('');
                setCreateDays(0);
              }}
              disabled={loading}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateLeaveAllocation}
              color="primary"
              variant="contained"
              disabled={loading || !createLeaveType || createDays < 0}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {loading ? 'Creating...' : 'Create Allocation'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Leave Allocation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" component="div" color="error">
              Delete Leave Allocation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This action will permanently remove the leave allocation
            </Typography>
          </DialogTitle>
          <DialogContent>
            {editingBalance && (
              <Box sx={{ pt: 2 }}>
                <Paper sx={{ p: 2, mb: 3, backgroundColor: 'error.light', color: 'error.contrastText' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Allocation Details
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Employee:</strong> {editingBalance.user_name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Leave Type:</strong> {editingBalance.leave_type_name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Current Balance:</strong> {editingBalance.balance} days
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Financial Year:</strong> {selectedYear}-{selectedYear + 1}
                  </Typography>
                </Paper>

                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Warning: This action cannot be undone
                  </Typography>
                  <Typography variant="body2">
                    • The leave allocation will be permanently deleted
                    <br />
                    • Any pending leave applications using this allocation may be affected
                    <br />
                    • The employee will lose access to these leave days
                  </Typography>
                </Alert>

                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Note:</strong> Casual Leave allocations cannot be deleted as they are fixed at 12 days per year.
                  </Typography>
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              disabled={loading}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteLeaveAllocation}
              color="error"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            >
              {loading ? 'Deleting...' : 'Delete Allocation'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Annual Renewal Confirmation Dialog */}
        <Dialog open={renewalDialogOpen} onClose={() => setRenewalDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" component="div" color="warning.main">
              Annual Casual Leave Renewal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Renew casual leave allocation for all existing users
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Paper sx={{ p: 2, mb: 3, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Renewal Details
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Financial Year:</strong> {selectedYear}-{selectedYear + 1}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Total Users:</strong> {users.length} employees
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Casual Leave Allocation:</strong> 12 days per user
                </Typography>
              </Paper>

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  What will happen:
                </Typography>
                <Typography variant="body2">
                  • All existing users will get 12 casual leaves for {selectedYear}-{selectedYear + 1}
                  <br />
                  • If a user already has casual leave allocation, it will be updated to 12 days
                  <br />
                  • If a user doesn't have casual leave allocation, it will be created with 12 days
                  <br />
                  • Other leave types will not be affected
                </Typography>
              </Alert>

              <Alert severity="warning">
                <Typography variant="body2">
                  <strong>Important:</strong> This action will update casual leave balances for all {users.length} users in the system.
                  Make sure you have selected the correct financial year.
                </Typography>
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setRenewalDialogOpen(false)}
              disabled={renewalLoading}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAnnualRenewal}
              color="warning"
              variant="contained"
              disabled={renewalLoading}
              startIcon={renewalLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
            >
              {renewalLoading ? 'Processing...' : `Renew for ${users.length} Users`}
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </DashboardLayout>
  );
}