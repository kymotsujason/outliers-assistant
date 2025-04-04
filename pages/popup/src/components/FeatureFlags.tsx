import React from 'react';
import { Typography, Box } from '@mui/material';
import { InfoTooltip } from './InfoTooltip';
import { isBoolean, isNumber, isString } from '../utils/typeUtils';

interface FeatureFlagsProps {
  featureFlags: Record<string, unknown> | null;
}

// Function to format feature flag values with proper coloring
const formatFeatureFlagValue = (value: unknown): React.ReactNode => {
  if (isBoolean(value)) {
    return <span style={{ color: value ? '#4caf50' : '#f44336' }}>{String(value)}</span>;
  }

  if (isNumber(value)) {
    return <span style={{ color: '#2196f3' }}>{value}</span>;
  }

  if (isString(value)) {
    return <span style={{ color: '#ff9800' }}>"{value}"</span>;
  }

  return String(value);
};

const FeatureFlags: React.FC<FeatureFlagsProps> = React.memo(({ featureFlags }) => {
  if (!featureFlags || Object.keys(featureFlags).length === 0) {
    return <Typography>No Feature Flags Available.</Typography>;
  }

  return (
    <Box>
      {Object.entries(featureFlags).map(([flag, value], index) => (
        <InfoTooltip key={index} label={flag} value={formatFeatureFlagValue(value)} tooltip={`Feature flag: ${flag}`} />
      ))}
    </Box>
  );
});

export default FeatureFlags;
