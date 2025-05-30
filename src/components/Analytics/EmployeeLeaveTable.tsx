import React, { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  useTheme,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  HourglassEmpty as PendingIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { LeaveApplication, LeaveStatus, Department } from '@/types';
import { formatDate as formatDateUtil } from '@/utils/format';

interface EmployeeLeaveTableProps {
  data?: LeaveApplication[];
  loading?: boolean;
  title?: string;
  onViewDetails?: (leave: LeaveApplication) => void;
  showDepartmentFilter?: boolean;
  departments?: Department[];
}

type Order = 'asc' | 'desc';
type OrderBy = keyof LeaveApplication | 'user_name' | 'leave_type_name' | 'department_name' | 'employee_id';

const EmployeeLeaveTable: React.FC<EmployeeLeaveTableProps> = ({
  data = [],
  loading = false,
  title = 'Leave Applications',
  onViewDetails,
  showDepartmentFilter = false,
  departments = [],
}) => {
  const theme = useTheme();
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<OrderBy>('created_at');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleDepartmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDepartment(event.target.value);
    setPage(0);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return formatDateUtil(dateString);
  };

  const getStatusChip = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.Pending:
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" size="small" />;
      case LeaveStatus.HODApproved:
        return <Chip icon={<PendingIcon />} label="HOD Approved" color="info" size="small" />;
      case LeaveStatus.PrincipalApproved:
        return <Chip icon={<ApprovedIcon />} label="Approved" color="success" size="small" />;
      case LeaveStatus.Rejected:
        return <Chip icon={<RejectedIcon />} label="Rejected" color="error" size="small" />;
      case LeaveStatus.Cancelled:
        return <Chip icon={<RejectedIcon />} label="Cancelled" color="default" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Filter data based on search term and department
  const filteredData = data.filter((leave) => {
    // Department filter
    if (selectedDepartment && leave.user?.department_id !== parseInt(selectedDepartment)) {
      return false;
    }

    // Search filter
    if (searchTerm) {
      const searchFields = [
        leave.user_name,
        leave.leave_type_name,
        leave.department_name,
        leave.reason,
        formatDate(leave.start_date),
        formatDate(leave.end_date),
        leave.status,
      ].filter(Boolean).map(field => field?.toLowerCase());

      return searchFields.some(field => field?.includes(searchTerm.toLowerCase()));
    }

    return true;
  });

  // Sort data
  const sortedData = React.useMemo(() => {
    const comparator = (a: LeaveApplication, b: LeaveApplication) => {
      let aValue: any = a[orderBy as keyof LeaveApplication];
      let bValue: any = b[orderBy as keyof LeaveApplication];

      // Handle custom fields from joins
      if (orderBy === 'user_name') {
        aValue = a.user_name || a.user?.full_name || '';
        bValue = b.user_name || b.user?.full_name || '';
      } else if (orderBy === 'leave_type_name') {
        aValue = a.leave_type_name || a.leave_type?.name || '';
        bValue = b.leave_type_name || b.leave_type?.name || '';
      } else if (orderBy === 'department_name') {
        aValue = a.department_name || (a.user?.department ? `${a.user.department.name} (${a.user.department.code})` : '') || '';
        bValue = b.department_name || (b.user?.department ? `${b.user.department.name} (${b.user.department.code})` : '') || '';
      }

      // Handle date comparison
      if (aValue instanceof Date && bValue instanceof Date) {
        return order === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
      }

      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      // Handle number comparison
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    };

    return [...filteredData].sort(comparator);
  }, [filteredData, order, orderBy]);

  // Paginate data
  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <Grid container spacing={2} sx={{ width: 'auto' }}>
          {showDepartmentFilter && departments.length > 0 && (
            <Grid item>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Department</InputLabel>
                <Select
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  label="Department"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item>
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 200 }}
            />
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    <TableSortLabel
                      active={orderBy === 'user_name'}
                      direction={orderBy === 'user_name' ? order : 'asc'}
                      onClick={() => handleRequestSort('user_name')}
                      sx={{ '&:hover': { color: 'primary.main' } }}
                    >
                      Employee Details
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    <TableSortLabel
                      active={orderBy === 'employee_id'}
                      direction={orderBy === 'employee_id' ? order : 'asc'}
                      onClick={() => handleRequestSort('employee_id')}
                      sx={{ '&:hover': { color: 'primary.main' } }}
                    >
                      Employee ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    <TableSortLabel
                      active={orderBy === 'leave_type_name'}
                      direction={orderBy === 'leave_type_name' ? order : 'asc'}
                      onClick={() => handleRequestSort('leave_type_name')}
                      sx={{ '&:hover': { color: 'primary.main' } }}
                    >
                      Leave Type
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    <TableSortLabel
                      active={orderBy === 'start_date'}
                      direction={orderBy === 'start_date' ? order : 'asc'}
                      onClick={() => handleRequestSort('start_date')}
                      sx={{ '&:hover': { color: 'primary.main' } }}
                    >
                      Start Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    <TableSortLabel
                      active={orderBy === 'end_date'}
                      direction={orderBy === 'end_date' ? order : 'asc'}
                      onClick={() => handleRequestSort('end_date')}
                      sx={{ '&:hover': { color: 'primary.main' } }}
                    >
                      End Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    <TableSortLabel
                      active={orderBy === 'days'}
                      direction={orderBy === 'days' ? order : 'asc'}
                      onClick={() => handleRequestSort('days')}
                      sx={{ '&:hover': { color: 'primary.main' } }}
                    >
                      Duration
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    <TableSortLabel
                      active={orderBy === 'status'}
                      direction={orderBy === 'status' ? order : 'asc'}
                      onClick={() => handleRequestSort('status')}
                      sx={{ '&:hover': { color: 'primary.main' } }}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((leave) => {
                    // Enhanced data extraction with better fallbacks
                    const employeeName = leave.user_name || leave.user?.full_name || 'Employee Name Not Available';
                    const employeeId = leave.employee_id || leave.user?.employee_id || 'ID Not Set';
                    const leaveTypeName = leave.leave_type_name || leave.leave_type?.name || 'Leave Type Not Specified';
                    const departmentName = leave.department_name ||
                                         (leave.user?.department ? `${leave.user.department.name} (${leave.user.department.code})` : '') ||
                                         'Department Not Assigned';

                    return (
                      <TableRow key={leave.id} hover sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2" fontWeight="medium">
                              {employeeName}
                            </Typography>
                            {departmentName !== 'Department Not Assigned' && (
                              <Typography variant="caption" color="text.secondary">
                                {departmentName}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={employeeId}
                            size="small"
                            variant="outlined"
                            color={employeeId === 'ID Not Set' ? 'default' : 'primary'}
                            sx={{ fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={leaveTypeName}
                            size="small"
                            color={leaveTypeName === 'Leave Type Not Specified' ? 'default' : 'secondary'}
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(leave.start_date)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(leave.end_date)}
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
                        <TableCell>{getStatusChip(leave.status)}</TableCell>
                        <TableCell align="right">
                          {onViewDetails && (
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => onViewDetails(leave)}
                                sx={{
                                  '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'white'
                                  }
                                }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="text.secondary" py={2}>
                        No leave applications found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
};

export default EmployeeLeaveTable;
