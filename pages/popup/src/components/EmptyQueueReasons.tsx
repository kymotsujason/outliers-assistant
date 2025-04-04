import React from 'react';
import { Typography, Box } from '@mui/material';
import { isRecord, isString } from '../utils/typeUtils';

interface EmptyQueueReasonsProps {
  emptyQueueReasons: unknown;
  idJson: Record<string, string>;
}

const EmptyQueueReasons: React.FC<EmptyQueueReasonsProps> = React.memo(({ emptyQueueReasons, idJson }) => {
  if (!emptyQueueReasons) return <>None</>;

  if (!isRecord(emptyQueueReasons)) {
    return <Typography color="error">Invalid empty queue reasons data</Typography>;
  }

  if (Object.keys(emptyQueueReasons).length === 0) {
    return <Typography>No empty queue reasons available.</Typography>;
  }

  return (
    <Box>
      {Object.entries(emptyQueueReasons).map(([projectId, reviewLevels]) => (
        <Box key={projectId} sx={{ marginBottom: 1 }}>
          <Typography component="div">
            <strong>{idJson[projectId] ?? projectId}:</strong>
          </Typography>
          {isRecord(reviewLevels) ? (
            Object.entries(reviewLevels).map(([reviewLevel, reason]) => (
              <Box key={reviewLevel} sx={{ marginLeft: 2, marginTop: 0.5 }}>
                <Typography variant="body2">
                  <strong>{reviewLevel}:</strong> {isString(reason) ? reason : 'N/A'}
                </Typography>
              </Box>
            ))
          ) : (
            <Box sx={{ marginLeft: 2 }}>
              <Typography variant="body2" color="error">
                Invalid review levels data
              </Typography>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
});

export default EmptyQueueReasons;
