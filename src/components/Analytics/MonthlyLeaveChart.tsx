import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, useTheme } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MonthlyLeaveData {
  month: string;
  count: number;
}

interface MonthlyLeaveChartProps {
  data?: MonthlyLeaveData[];
  loading?: boolean;
  title?: string;
  height?: number;
}

const MonthlyLeaveChart: React.FC<MonthlyLeaveChartProps> = ({
  data = [],
  loading = false,
  title = 'Monthly Leave Trends',
  height = 300,
}) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const monthLabels = data.map((item) => item.month);
      const monthlyCounts = data.map((item) => item.count);

      setChartData({
        labels: monthLabels,
        datasets: [
          {
            label: 'Leave Applications',
            data: monthlyCounts,
            borderColor: theme.palette.primary.main,
            backgroundColor: 'rgba(63, 81, 181, 0.1)',
            pointBackgroundColor: theme.palette.primary.main,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: theme.palette.primary.main,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2,
            tension: 0.3,
            fill: true,
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
        position: 'top' as const,
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
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
        ticks: {
          precision: 0,
          font: {
            size: 11,
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
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
          <Line data={chartData} options={options} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default MonthlyLeaveChart;
