import React from 'react';
import { Card, CardContent, Box, Typography, Chip, useTheme } from '@mui/material';

export type StatusLevel = 'active' | 'warning' | 'error' | 'inactive';

interface StatusCardProps {
  title: string;
  status: StatusLevel;
  statusLabel: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const statusConfig: Record<StatusLevel, { color: string; bg: string }> = {
  active: { color: '#4caf50', bg: 'rgba(76, 175, 80, 0.08)' },
  warning: { color: '#ff9800', bg: 'rgba(255, 152, 0, 0.08)' },
  error: { color: '#f44336', bg: 'rgba(244, 67, 54, 0.08)' },
  inactive: { color: '#9e9e9e', bg: 'rgba(158, 158, 158, 0.08)' },
};

const StatusCard: React.FC<StatusCardProps> = ({ title, status, statusLabel, icon, children }) => {
  const theme = useTheme();
  const config = statusConfig[status];

  return (
    <Card
      variant="outlined"
      sx={{
        borderLeft: `3px solid ${config.color}`,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : config.bg,
        height: '100%',
      }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ color: config.color, display: 'flex' }}>{icon}</Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {title}
            </Typography>
          </Box>
          <Chip
            label={statusLabel}
            size="small"
            sx={{
              backgroundColor: config.color,
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 20,
            }}
          />
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};

export default React.memo(StatusCard);
