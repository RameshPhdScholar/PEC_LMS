import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Alert,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays } from 'date-fns';
import DashboardLayout from '@/components/Dashboard/Layout';
import { LeaveType, LeaveApplicationFormData, LeaveBalance, UserRole } from '@/types';

// Validation schema
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

export default function ApplyLeave() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  // Initialize formik
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
        router.push('/leaves/my-leaves');
      } catch (error: any) {
        console.error('Error submitting leave application:', error);
        setError(error.response?.data?.error || 'Failed to submit leave application');
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Only employees, HODs, and Principals can apply for leave
    if (session && ![UserRole.Employee, UserRole.HOD, UserRole.Principal].includes(session.user.role_id)) {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch leave types
        const leaveTypesResponse = await axios.get('/api/leave-types');
        setLeaveTypes(leaveTypesResponse.data.data || []);

        // Fetch leave balances for the current user
        const leaveBalancesResponse = await axios.get('/api/leave-balances/my-balances');
        setLeaveBalances(leaveBalancesResponse.data.data || []);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session, status, router]);

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
        <title>Apply for Leave | Leave Management System</title>
      </Head>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
            Current Leave Balances
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {leaveBalances.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Leave Type</TableCell>
                    <TableCell align="right">Available Balance (Days)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaveBalances.map((balance) => (
                    <TableRow key={balance.id}>
                      <TableCell>{balance.leave_type?.name || 'Unknown'}</TableCell>
                      <TableCell align="right">{balance.balance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No leave balances found.
            </Typography>
          )}
        </Paper>

        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
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
      </Container>
    </DashboardLayout>
  );
}
