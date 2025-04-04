import React from 'react';
import { Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface InfoTooltipProps {
  label: string;
  value: React.ReactNode;
  tooltip: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = React.memo(({ label, value, tooltip }) => (
  <Tooltip title={tooltip} placement="top-start" disableInteractive arrow>
    <Typography>
      {label}: {value === null || value === undefined ? 'N/A' : value}
    </Typography>
  </Tooltip>
));

const InfoIconWithTooltip: React.FC<{ tooltip: string }> = React.memo(({ tooltip }) => (
  <Tooltip title={tooltip} placement="top-start" disableInteractive arrow>
    <span>
      <InfoIcon />
    </span>
  </Tooltip>
));

export { InfoTooltip, InfoIconWithTooltip };
