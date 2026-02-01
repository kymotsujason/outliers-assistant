import React from 'react';
import { Typography, Box, Chip, Badge, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { isBoolean, isArray } from '../../utils/typeUtils';

/** Renders values with type-appropriate formatting: chips for booleans, badges for arrays, colored chips for status strings. */
const FormattedValue: React.FC<{ value: unknown }> = ({ value }) => {
  const theme = useTheme();

  if (isBoolean(value)) {
    return (
      <Chip
        icon={value ? <CheckCircleIcon /> : <CancelIcon />}
        label={value ? 'Yes' : 'No'}
        size="small"
        color={value ? 'success' : 'default'}
        sx={{ fontWeight: 500 }}
      />
    );
  }

  if (isArray(value) && typeof value !== 'string') {
    if (value.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{ fontSize: '0.925rem' }}>
          Empty array
        </Typography>
      );
    }

    return (
      <Badge badgeContent={value.length} color="primary" sx={{ marginRight: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
            maxHeight: '120px',
            overflowY: 'auto',
            p: 0.5,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            background: theme.palette.background.paper,
          }}>
          {value.map((item: unknown, index: number) => (
            <Chip
              key={index}
              label={typeof item === 'object' ? JSON.stringify(item) : String(item)}
              size="small"
              variant="outlined"
              sx={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
            />
          ))}
        </Box>
      </Badge>
    );
  }

  if (typeof value === 'string' && ['active', 'pending', 'inactive', 'suspended'].includes(value.toLowerCase())) {
    const statusColors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
      active: 'success',
      pending: 'warning',
      inactive: 'default',
      suspended: 'error',
    };

    return (
      <Chip
        label={value}
        size="small"
        color={statusColors[value.toLowerCase()] || 'default'}
        sx={{ fontWeight: 500 }}
      />
    );
  }

  return (
    <Typography
      variant="body2"
      sx={{
        wordBreak: 'break-word',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', 'Consolas', monospace",
        fontSize: '0.925rem',
        backgroundColor: theme.palette.background.paper,
        p: 0.5,
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
      }}>
      {String(value)}
    </Typography>
  );
};

export default React.memo(FormattedValue);
