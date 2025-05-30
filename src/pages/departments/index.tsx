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
  CircularProgress,
  Divider,
  Alert,
  TextField,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Domain as DomainIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/Dashboard/Layout';
import { Department, UserRole } from '@/types';

export default function Departments() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');



  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Only admins can view departments
    if (session && ![UserRole.Admin, UserRole.SuperAdmin].includes(session.user.role_id)) {
      router.push('/dashboard');
      return;
    }

    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/departments');
        setDepartments(response.data.data || []);
        setFilteredDepartments(response.data.data || []);
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

  // Filter departments based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDepartments(departments);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = departments.filter(
        (dept) =>
          dept.name.toLowerCase().includes(searchLower) ||
          dept.code.toLowerCase().includes(searchLower)
      );
      setFilteredDepartments(filtered);
    }
  }, [searchTerm, departments]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };



  if (status === 'loading' || loading) {
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
        <title>Departments | Leave Management System</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Department Management
            </Typography>

          </Box>
          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Search */}
          <Box mb={3}>
            <TextField
              fullWidth
              label="Search Departments"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Box>

          {/* Department Table */}
          <TableContainer component={Paper} variant="outlined" sx={{ mt: 3 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: 'primary.light' }}>
                <TableRow>
                  <TableCell width="10%" sx={{ fontWeight: 'bold', color: 'white' }}>#</TableCell>
                  <TableCell width="25%" sx={{ fontWeight: 'bold', color: 'white' }}>Code</TableCell>
                  <TableCell width="65%" sx={{ fontWeight: 'bold', color: 'white' }}>Department Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDepartments.map((department, index) => (
                  <TableRow
                    key={department.id}
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Chip
                        label={department.code}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {department.name}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredDepartments.length === 0 && (
            <Paper variant="outlined" sx={{ p: 5, mt: 3, textAlign: 'center' }}>
              <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <DomainIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
                <Typography variant="h6" color="text.secondary">
                  No departments found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No departments match your search criteria. Try adjusting your search.
                </Typography>
              </Box>
            </Paper>
          )}
        </Paper>
      </Container>


    </DashboardLayout>
  );
}
