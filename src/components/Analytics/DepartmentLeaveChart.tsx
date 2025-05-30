import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, useTheme } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DepartmentLeaveData {
  department: string;
  count: number;
}

interface DepartmentLeaveChartProps {
  data?: DepartmentLeaveData[];
  loading?: boolean;
  title?: string;
  height?: number;
}

const DepartmentLeaveChart: React.FC<DepartmentLeaveChartProps> = ({
  data = [],
  loading = false,
  title = 'Leave Applications by Department',
  height = 300,
}) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const departmentLabels = data.map((item) => item.department);
      const departmentCounts = data.map((item) => item.count);

      setChartData({
        labels: departmentLabels,
        datasets: [
          {
            label: 'Leave Applications',
            data: departmentCounts,
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.dark,
            borderWidth: 1,
            borderRadius: 4,
            barThickness: 25,
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
          maxRotation: 45,
          minRotation: 45,
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
          <Bar data={chartData} options={options} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default DepartmentLeaveChart;
