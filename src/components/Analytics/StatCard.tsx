import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
  trend,
}) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          p: 2,
          color: color || theme.palette.primary.main,
          opacity: 0.2,
          transform: 'scale(1.5)',
          transformOrigin: 'top right',
        }}
      >
        {icon}
      </Box>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 1 }}>
        {value}
      </Typography>
      
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
      
      {trend && (
        <Box display="flex" alignItems="center" mt={1}>
          <Typography
            variant="body2"
            sx={{
              color: trend.isPositive ? theme.palette.success.main : theme.palette.error.main,
              fontWeight: 'medium',
            }}
          >
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            vs last month
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default StatCard;
