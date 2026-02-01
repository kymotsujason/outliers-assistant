import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';

interface StatItem {
  label: string;
  value: string;
  color?: string;
}

interface QuickStatsProps {
  stats: StatItem[];
}

const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 1,
      }}>
      {stats.map((stat, index) => (
        <Paper
          key={index}
          variant="outlined"
          sx={{
            p: 1,
            textAlign: 'center',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : undefined,
          }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {stat.label}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', 'Consolas', monospace",
              fontSize: '1.0rem',
              color: stat.color || theme.palette.text.primary,
              mt: 0.25,
            }}>
            {stat.value}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default React.memo(QuickStats);
