import React from 'react';
import { Box, Typography } from '@mui/material';
import { InfoIconWithTooltip } from '../InfoTooltip';
import FormattedValue from './FormattedValue';

interface InfoRowProps {
  label: string;
  value: unknown;
  tooltip: string;
  icon?: React.ReactNode;
}

/** A labeled row showing a value with a tooltip. Replaces the former inline EnhancedInfoTooltip. */
const InfoRow: React.FC<InfoRowProps> = ({ label, value, tooltip, icon }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        p: 0.25,
        mb: 0.25,
        borderRadius: 1,
        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
      }}>
      {icon && <Box sx={{ mr: 1, mt: 0.5 }}>{icon}</Box>}

      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.1 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 0.5, fontSize: '0.9rem' }}>
            {label}
          </Typography>
          <InfoIconWithTooltip tooltip={tooltip} />
        </Box>

        <Box sx={{ ml: 0.25 }}>{React.isValidElement(value) ? value : <FormattedValue value={value} />}</Box>
      </Box>
    </Box>
  );
};

export default React.memo(InfoRow);
