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
  TablePagination,
} from '@mui/material';
import {
  Add as AddIcon,
  FileDownload as DownloadIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import DashboardLayout from '@/components/Dashboard/Layout';
import { User, UserRole, Department } from '@/types';
import { formatDate as formatDateUtil } from '@/utils/format';

export default function Employees() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [employees, setEmployees] = useState<User[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Only admins and superadmins can view employees (but only superadmin can edit/delete)
    if (session && ![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch departments
        const departmentsResponse = await axios.get('/api/departments');
        setDepartments(departmentsResponse.data.data || []);

        // Fetch employees
        const employeesResponse = await axios.get('/api/users');
        setEmployees(employeesResponse.data.data || []);
        setFilteredEmployees(employeesResponse.data.data || []);

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

  // Apply filters
  useEffect(() => {
    let result = [...employees];

    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        employee =>
          employee.full_name?.toLowerCase().includes(searchLower) ||
          employee.employee_id?.toLowerCase().includes(searchLower) ||
          employee.email?.toLowerCase().includes(searchLower) ||
          employee.employee_position?.toLowerCase().includes(searchLower)
      );
    }

    // Apply department filter
    if (departmentFilter) {
      result = result.filter(
        employee => employee.department_id === parseInt(departmentFilter)
      );
    }

    // Sort by employee_id in ascending order
    result = result.sort((a, b) => a.employee_id.localeCompare(b.employee_id));

    setFilteredEmployees(result);
    setPage(0); // Reset to first page when filters change
  }, [searchTerm, departmentFilter, employees]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDepartmentFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDepartmentFilter(event.target.value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
  };



  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Employee ID', 'Name', 'Email', 'Department', 'Position', 'Role', 'Joining Date'];
    const rows = filteredEmployees.map(employee => [
      employee.employee_id || 'N/A',
      employee.full_name || 'N/A',
      employee.email || 'N/A',
      departments.find(d => d.id === employee.department_id)?.name || 'N/A',
      employee.employee_position || 'N/A',
      employee.role_id === UserRole.HOD ? 'HOD' :
      employee.role_id === UserRole.Principal ? 'Principal' : 'Employee',
      employee.joining_date ? formatDateUtil(employee.joining_date) : 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `employees_${format(new Date(), 'yyyy-MM-dd')}.csv`);
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
        <title>Employees | Leave Management System</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Employee Management
            </Typography>
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={exportToCSV}
                disabled={filteredEmployees.length === 0}
                sx={{ mr: 2 }}
              >
                Export to CSV
              </Button>
              {/* Admin and SuperAdmin can add employees */}
              {session?.user && [UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id) && (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/employees/add')}
                >
                  Add Employee
                </Button>
              )}
            </Box>
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
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Search"
                  name="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  variant="outlined"
                  size="small"
                  placeholder="Search by name, ID, email..."
                  InputProps={{
                    endAdornment: <SearchIcon color="action" />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Department"
                  name="department"
                  value={departmentFilter}
                  onChange={handleDepartmentFilterChange}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="outlined"
                  onClick={resetFilters}
                  fullWidth
                  sx={{ height: '40px' }}
                >
                  Reset Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {filteredEmployees.length === 0 ? (
            <Box textAlign="center" py={5}>
              <Typography variant="body1" color="text.secondary">
                No employees found matching the filters.
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>Joining Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEmployees
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((employee) => (
                        <TableRow key={employee.id} hover>
                          <TableCell>{employee.employee_id || 'N/A'}</TableCell>
                          <TableCell>{employee.full_name || 'N/A'}</TableCell>
                          <TableCell>{employee.email || 'N/A'}</TableCell>
                          <TableCell>
                            {departments.find(d => d.id === employee.department_id)
                              ? `${departments.find(d => d.id === employee.department_id)?.name} (${departments.find(d => d.id === employee.department_id)?.code})`
                              : 'N/A'}
                          </TableCell>
                          <TableCell>{employee.employee_position || 'N/A'}</TableCell>
                          <TableCell>
                            {employee.joining_date ? formatDateUtil(employee.joining_date) : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredEmployees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>
      </Container>


    </DashboardLayout>
  );
}
