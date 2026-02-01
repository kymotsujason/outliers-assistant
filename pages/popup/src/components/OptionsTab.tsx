import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { defaultTabStorage } from '@extension/storage';
import { useStorage } from '@extension/shared';

const TAB_OPTIONS = [
  { index: 0, label: 'Dashboard' },
  { index: 1, label: 'Prettier' },
  { index: 2, label: 'Raw' },
  { index: 3, label: 'Censored' },
] as const;

const OptionsTab: React.FC = () => {
  const defaultTab = useStorage(defaultTabStorage);

  const handleChange = (event: SelectChangeEvent<number>) => {
    defaultTabStorage.set(Number(event.target.value));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <SettingsIcon color="primary" />
        <Typography variant="h6">Options</Typography>
      </Box>

      <Paper sx={{ p: 2 }} variant="outlined">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Choose which tab opens by default when you open the extension.
        </Typography>

        <FormControl fullWidth size="small">
          <InputLabel id="default-tab-label">Default Tab</InputLabel>
          <Select labelId="default-tab-label" value={defaultTab} label="Default Tab" onChange={handleChange}>
            {TAB_OPTIONS.map(option => (
              <MenuItem key={option.index} value={option.index}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
    </Box>
  );
};

export default React.memo(OptionsTab);
