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
  Button,
  CircularProgress,
  Divider,
  Alert,
  TextField,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import DashboardLayout from '@/components/Dashboard/Layout';
import { LeaveBalance, UserRole, User, LeaveType } from '@/types';

export default function LeaveBalances() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedUser, setSelectedUser] = useState<number | ''>('');

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBalance, setEditingBalance] = useState<LeaveBalance | null>(null);
  const [newBalance, setNewBalance] = useState<number>(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Only admins can manage leave balances
    if (session && ![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await axios.get('/api/users');
        setUsers(usersResponse.data.data || []);

        // Fetch leave types
        const leaveTypesResponse = await axios.get('/api/leave-types');
        setLeaveTypes(leaveTypesResponse.data.data || []);

        // Fetch leave balances
        await fetchLeaveBalances();

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

  const fetchLeaveBalances = async () => {
    try {
      let url = `/api/leave-balances?year=${selectedYear}`;

      if (selectedUser) {
        url += `&user_id=${selectedUser}`;
      }

      const response = await axios.get(url);
      setLeaveBalances(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching leave balances:', error);
      setError(error.response?.data?.error || 'Failed to fetch leave balances');
    }
  };

  useEffect(() => {
    if (session && [UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      fetchLeaveBalances();
    }
  }, [selectedYear, selectedUser, session]);

  const handleEditBalance = (balance: LeaveBalance) => {
    setEditingBalance(balance);
    setNewBalance(balance.balance);
    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setEditingBalance(null);
  };

  const handleSaveBalance = async () => {
    if (!editingBalance) return;

    setProcessing(true);

    try {
      await axios.post('/api/leave-balances', {
        user_id: editingBalance.user_id,
        leave_type_id: editingBalance.leave_type_id,
        balance: newBalance,
        year: selectedYear,
      });

      // Refresh the list
      await fetchLeaveBalances();
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error updating leave balance:', error);
      setError(error.response?.data?.error || 'Failed to update leave balance');
    } finally {
      setProcessing(false);
    }
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
        <title>Leave Balances | Leave Management System</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
            Manage Leave Balances
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Filters */}
          <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Employee"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value as number | '')}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="">All Employees</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.full_name} ({user.employee_id})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Year"
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  variant="outlined"
                  size="small"
                  InputProps={{ inputProps: { min: 2000, max: 2100 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSelectedUser('');
                    setSelectedYear(new Date().getFullYear());
                  }}
                  fullWidth
                  sx={{ height: '40px' }}
                >
                  Reset Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {leaveBalances.length === 0 ? (
            <Box textAlign="center" py={5}>
              <Typography variant="body1" color="text.secondary">
                No leave balances found matching the filters.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Leave Type</TableCell>
                    <TableCell>Balance (Days)</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaveBalances.map((balance) => (
                    <TableRow key={`${balance.user_id}-${balance.leave_type_id}-${balance.year}`}>
                      <TableCell>{balance.user_name || 'Unknown'}</TableCell>
                      <TableCell>{balance.employee_id || 'Unknown'}</TableCell>
                      <TableCell>{balance.leave_type_name || 'Unknown'}</TableCell>
                      <TableCell>{balance.balance}</TableCell>
                      <TableCell>{balance.year}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditBalance(balance)}
                          disabled={balance.leave_type_name?.toLowerCase() === 'casual leave'}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      {/* Edit Balance Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Edit Leave Balance</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Employee:</strong> {editingBalance?.user_name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Leave Type:</strong> {editingBalance?.leave_type_name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Year:</strong> {selectedYear}
            </Typography>
            {editingBalance?.leave_type_name?.toLowerCase() === 'casual leave' && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Casual Leave balance is fixed at 12 per year and cannot be updated.
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Balance (Days)"
              type="number"
              fullWidth
              value={newBalance}
              onChange={(e) => setNewBalance(parseFloat(e.target.value))}
              InputProps={{ inputProps: { min: 0, step: 0.5 } }}
              sx={{ mt: 2 }}
              disabled={editingBalance?.leave_type_name?.toLowerCase() === 'casual leave'}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={processing}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveBalance}
            color="primary"
            variant="contained"
            disabled={processing}
          >
            {processing ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
