import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert,
  MenuItem,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { Department, Gender } from '@/types';

// Validation schema
const RegisterSchema = Yup.object().shape({
  full_name: Yup.string()
    .required('Full name is required')
    .min(3, 'Name must be at least 3 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone_number: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  gender: Yup.string()
    .required('Gender is required'),
  department_id: Yup.number()
    .required('Department is required'),
  employee_id: Yup.string()
    .required('Employee ID is required'),
  employee_position: Yup.string()
    .required('Position is required'),
  joining_date: Yup.date()
    .required('Joining date is required')
    .max(new Date(), 'Joining date cannot be in the future'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirm_password: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const Register = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/api/departments');
        setDepartments(response.data.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setError('Failed to load departments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const response = await axios.post('/api/users', values);

      if (response.data.success) {
        setSuccess(response.data.message || 'Registration submitted successfully! Please wait for admin approval before you can login.');
        setError(null);
        resetForm();

        // Redirect to login page after 5 seconds to give user time to read the message
        setTimeout(() => {
          router.push('/login');
        }, 5000);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
      setSuccess(null);
      console.error('Registration error:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>Register | Leave Management System</title>
      </Head>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                Create an Account
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" mt={1}>
                Register to access the Leave Management System
              </Typography>
            </Box>

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

            <Formik
              initialValues={{
                full_name: '',
                email: '',
                phone_number: '',
                gender: '',
                department_id: '',
                employee_id: '',
                employee_position: '',
                joining_date: '',
                password: '',
                confirm_password: '',
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Field name="full_name">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Full Name"
                            variant="outlined"
                            error={touched.full_name && Boolean(errors.full_name)}
                            helperText={touched.full_name && errors.full_name}
                          />
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field name="email">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Email Address"
                            variant="outlined"
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                          />
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field name="phone_number">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Phone Number"
                            variant="outlined"
                            error={touched.phone_number && Boolean(errors.phone_number)}
                            helperText={touched.phone_number && errors.phone_number}
                          />
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field name="gender">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            select
                            fullWidth
                            label="Gender"
                            variant="outlined"
                            error={touched.gender && Boolean(errors.gender)}
                            helperText={touched.gender && errors.gender}
                          >
                            <MenuItem value={Gender.Male}>Male</MenuItem>
                            <MenuItem value={Gender.Female}>Female</MenuItem>
                            <MenuItem value={Gender.Other}>Other</MenuItem>
                          </TextField>
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field name="department_id">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            select
                            fullWidth
                            label="Department"
                            variant="outlined"
                            error={touched.department_id && Boolean(errors.department_id)}
                            helperText={touched.department_id && errors.department_id}
                          >
                            {departments.map((dept) => (
                              <MenuItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field name="employee_id">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Employee ID"
                            variant="outlined"
                            error={touched.employee_id && Boolean(errors.employee_id)}
                            helperText={touched.employee_id && errors.employee_id}
                          />
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field name="employee_position">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Position"
                            variant="outlined"
                            error={touched.employee_position && Boolean(errors.employee_position)}
                            helperText={touched.employee_position && errors.employee_position}
                          />
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field name="joining_date">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="date"
                            label="Joining Date"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            error={touched.joining_date && Boolean(errors.joining_date)}
                            helperText={touched.joining_date && errors.joining_date}
                          />
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field name="password">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                  >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field name="confirm_password">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            variant="outlined"
                            error={touched.confirm_password && Boolean(errors.confirm_password)}
                            helperText={touched.confirm_password && errors.confirm_password}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                  >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        startIcon={<PersonAdd />}
                        sx={{ py: 1.5, mt: 2 }}
                      >
                        {isSubmitting ? 'Registering...' : 'Register'}
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>

            <Box mt={4} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link href="/login" passHref>
                  <Typography
                    component="span"
                    variant="body2"
                    color="primary"
                    sx={{ cursor: 'pointer', fontWeight: 'medium' }}
                  >
                    Sign in here
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Register;
