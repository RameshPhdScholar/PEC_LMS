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

import DashboardLayout from '@/components/Dashboard/Layout';
import { UserRole, Department } from '@/types';

// Validation schema for employee form
const validationSchema = Yup.object({
  employee_id: Yup.string().required('Employee ID is required'),
  full_name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  phone_number: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  gender: Yup.string().required('Gender is required'),
  department_id: Yup.number().required('Department is required'),
  employee_position: Yup.string().required('Position is required'),
  joining_date: Yup.date().required('Joining date is required'),
});

export default function AddEmployee() {
  const { data: session, status } = useSession();
  const router = useRouter();
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

    // Only Admin and SuperAdmin can add employees
    if (session && ![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      router.push('/dashboard');
      return;
    }

    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/api/departments');
        setDepartments(response.data.data || []);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching departments:', error);
        setError(error.response?.data?.error || 'Failed to fetch departments');
        setLoading(false);
      }
    };

    if (session) {
      fetchDepartments();
    }
  }, [session, status, router]);

  const formik = useFormik({
    initialValues: {
      employee_id: '',
      full_name: '',
      email: '',
      password: '',
      phone_number: '',
      gender: '',
      department_id: 0,
      employee_position: '',
      joining_date: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      setError('');
      setSuccess('');

      try {
        // Add role_id as Employee (1) to the values
        const employeeData = {
          ...values,
          role_id: UserRole.Employee // All users are employees
        };

        // Call the API to create the employee
        const response = await axios.post('/api/users', employeeData);

        setSuccess(response.data.message || 'Employee added successfully!');
        setTimeout(() => {
          router.push('/employees');
        }, 2000);
      } catch (error: any) {
        console.error('Error adding employee:', error);
        setError(error.response?.data?.error || 'Failed to add employee');
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
        <title>Add Employee | Leave Management System</title>
      </Head>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            Add New Employee
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
              <Grid item xs={12} sm={6}>
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
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="phone_number"
                  name="phone_number"
                  label="Phone Number"
                  value={formik.values.phone_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
                  helperText={formik.touched.phone_number && formik.errors.phone_number}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                >
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    label="Gender"
                  >
                    <MenuItem value="" disabled>Select Gender</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {formik.touched.gender && formik.errors.gender && (
                    <FormHelperText>{formik.errors.gender}</FormHelperText>
                  )}
                </FormControl>
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
                    {submitting ? <CircularProgress size={24} /> : 'Add Employee'}
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
