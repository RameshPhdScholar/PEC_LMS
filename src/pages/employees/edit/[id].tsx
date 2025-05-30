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
  Button,
  CircularProgress,
  Divider,
  Alert,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format, parse } from 'date-fns';
import DashboardLayout from '@/components/Dashboard/Layout';
import { User, UserRole, Department } from '@/types';
import { getApiUrl } from '@/utils/apiUtils';

// Validation schema for employee form
const validationSchema = Yup.object({
  employee_id: Yup.string().required('Employee ID is required'),
  full_name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  department_id: Yup.number().required('Department is required'),
  role_id: Yup.number().required('Role is required'),
  employee_position: Yup.string().required('Position is required'),
  joining_date: Yup.date().required('Joining date is required'),
});

export default function EditEmployee() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [employee, setEmployee] = useState<User | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Only SuperAdmin can edit employees
    if (session && session.user.role_id !== UserRole.SuperAdmin) {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      if (!id) return;

      try {
        // Fetch departments
        const departmentsResponse = await axios.get(getApiUrl('/api/departments'));
        setDepartments(departmentsResponse.data.data || []);

        // Fetch employee data
        const employeeResponse = await axios.get(getApiUrl(`/api/users/${id}`));
        setEmployee(employeeResponse.data.data);

        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.error || 'Failed to fetch data');
        setLoading(false);
      }
    };

    if (session && id) {
      fetchData();
    }
  }, [session, status, router, id]);

  const formik = useFormik({
    initialValues: {
      employee_id: employee?.employee_id || '',
      full_name: employee?.full_name || '',
      email: employee?.email || '',
      department_id: employee?.department_id || 0,
      role_id: employee?.role_id || UserRole.Employee,
      employee_position: employee?.employee_position || '',
      joining_date: employee?.joining_date || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      setError('');
      setSuccess('');

      try {
        // Call the API to update the employee
        const response = await axios.put(getApiUrl(`/api/users/${id}`), values);

        setSuccess(response.data.message || 'Employee updated successfully!');
        setTimeout(() => {
          router.push('/employees');
        }, 2000);
      } catch (error: any) {
        console.error('Error updating employee:', error);
        setError(error.response?.data?.error || 'Failed to update employee');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('joining_date', e.target.value);
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
        <title>Edit Employee | Leave Management System</title>
      </Head>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            Edit Employee
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="employee_id"
                  name="employee_id"
                  label="Employee ID"
                  value={formik.values.employee_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.employee_id && Boolean(formik.errors.employee_id)}
                  helperText={formik.touched.employee_id && formik.errors.employee_id}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="full_name"
                  name="full_name"
                  label="Full Name"
                  value={formik.values.full_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.full_name && Boolean(formik.errors.full_name)}
                  helperText={formik.touched.full_name && formik.errors.full_name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={formik.touched.department_id && Boolean(formik.errors.department_id)}
                >
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    id="department_id"
                    name="department_id"
                    value={formik.values.department_id}
                    onChange={formik.handleChange}
                    label="Department"
                  >
                    <MenuItem value={0} disabled>Select Department</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.department_id && formik.errors.department_id && (
                    <FormHelperText>{formik.errors.department_id}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={formik.touched.role_id && Boolean(formik.errors.role_id)}
                >
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role_id"
                    name="role_id"
                    value={formik.values.role_id}
                    onChange={formik.handleChange}
                    label="Role"
                  >
                    <MenuItem value={UserRole.Employee}>Employee</MenuItem>
                    <MenuItem value={UserRole.HOD}>HOD</MenuItem>
                    <MenuItem value={UserRole.Principal}>Principal</MenuItem>
                  </Select>
                  {formik.touched.role_id && formik.errors.role_id && (
                    <FormHelperText>{formik.errors.role_id}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="employee_position"
                  name="employee_position"
                  label="Position"
                  value={formik.values.employee_position}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.employee_position && Boolean(formik.errors.employee_position)}
                  helperText={formik.touched.employee_position && formik.errors.employee_position}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="joining_date"
                  name="joining_date"
                  label="Joining Date"
                  type="date"
                  value={formik.values.joining_date}
                  onChange={handleDateChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.joining_date && Boolean(formik.errors.joining_date)}
                  helperText={formik.touched.joining_date && formik.errors.joining_date}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/employees')}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                  >
                    {submitting ? <CircularProgress size={24} /> : 'Update Employee'}
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
