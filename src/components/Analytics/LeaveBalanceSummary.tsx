import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  LinearProgress,
  Tooltip,
  useTheme,
} from '@mui/material';
import { LeaveBalance } from '@/types';

interface LeaveBalanceSummaryProps {
  data?: LeaveBalance[];
  loading?: boolean;
  title?: string;
}

const LeaveBalanceSummary: React.FC<LeaveBalanceSummaryProps> = ({
  data = [],
  loading = false,
  title = 'Leave Balance Summary',
}) => {
  const theme = useTheme();

  // Function to determine color based on balance percentage
  const getColorByPercentage = (balance: number, maxDays: number = 12) => {
    const percentage = (balance / maxDays) * 100;
    if (percentage <= 25) return theme.palette.error.main;
    if (percentage <= 50) return theme.palette.warning.main;
    if (percentage <= 75) return theme.palette.info.main;
    return theme.palette.success.main;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress />
          </Box>
        ) : data && data.length > 0 ? (
          <Grid container spacing={2}>
            {data.map((balance) => {
              const leaveTypeName = balance.leave_type?.name || balance.leave_type_name || 'Unknown';
              const maxDays = balance.leave_type?.max_days_allowed || 12;
              const percentage = Math.min((balance.balance / maxDays) * 100, 100);
              const color = getColorByPercentage(balance.balance, maxDays);

              return (
                <Grid item xs={12} key={balance.id}>
                  <Box mb={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="body2" fontWeight="medium">
                        {leaveTypeName}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {balance.balance} / {maxDays} days
                      </Typography>
                    </Box>
                    <Tooltip 
                      title={`${Math.round(percentage)}% remaining`} 
                      placement="top"
                      arrow
                    >
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: theme.palette.grey[200],
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: color,
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Tooltip>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height={100}>
            <Typography variant="body2" color="text.secondary">
              No leave balance data available
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default LeaveBalanceSummary;
