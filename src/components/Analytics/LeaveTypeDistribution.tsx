import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, useTheme } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface LeaveTypeData {
  leave_type: string;
  count: number;
}

interface LeaveTypeDistributionProps {
  data?: LeaveTypeData[];
  loading?: boolean;
  title?: string;
  height?: number;
}

const LeaveTypeDistribution: React.FC<LeaveTypeDistributionProps> = ({
  data = [],
  loading = false,
  title = 'Leave Type Distribution',
  height = 300,
}) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const leaveTypeLabels = data.map((item) => item.leave_type);
      const leaveTypeCounts = data.map((item) => item.count);

      // Generate colors for each leave type
      const backgroundColors = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.error.main,
        theme.palette.info.main,
        '#9c27b0', // purple
        '#795548', // brown
        '#607d8b', // blue-grey
        '#009688', // teal
      ];

      setChartData({
        labels: leaveTypeLabels,
        datasets: [
          {
            data: leaveTypeCounts,
            backgroundColor: backgroundColors.slice(0, data.length),
            borderColor: backgroundColors.slice(0, data.length).map(color => color),
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
    cutout: '60%',
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
          <Doughnut data={chartData} options={options} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default LeaveTypeDistribution;
