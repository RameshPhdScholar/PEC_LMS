import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, useTheme } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { LeaveStatus } from '@/types';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface LeaveStatusData {
  status: string;
  count: number;
}

interface LeaveStatusChartProps {
  data?: LeaveStatusData[];
  loading?: boolean;
  title?: string;
  height?: number;
}

const LeaveStatusChart: React.FC<LeaveStatusChartProps> = ({
  data = [],
  loading = false,
  title = 'Leave Status Distribution',
  height = 300,
}) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const statusLabels = data.map((item) => item.status);
      const statusCounts = data.map((item) => item.count);

      // Define colors based on status
      const backgroundColors = data.map((item) => {
        switch (item.status) {
          case LeaveStatus.Pending:
            return theme.palette.warning.main;
          case LeaveStatus.HODApproved:
            return theme.palette.info.main;
          case LeaveStatus.PrincipalApproved:
            return theme.palette.success.main;
          case LeaveStatus.Rejected:
            return theme.palette.error.main;
          case LeaveStatus.Cancelled:
            return theme.palette.grey[500];
          default:
            return theme.palette.primary.main;
        }
      });

      setChartData({
        labels: statusLabels,
        datasets: [
          {
            data: statusCounts,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color),
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
      });
    }
  }, [data, theme]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Box height={height} display="flex" alignItems="center" justifyContent="center">
        {loading ? (
          <CircularProgress />
        ) : data && data.length > 0 ? (
          <Pie data={chartData} options={options} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default LeaveStatusChart;
