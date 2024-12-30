import React from 'react';
import { Typography, Box, Slider, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormattedMessage } from 'react-intl';

const SliderComponent = ({ label, value, onChange, min, max, step = 1, formatValue = (value) => value, tooltipText }) => {
  return (
    <Box sx={{ marginBottom: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 0.5 }}>
        <Typography variant="body2" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {label}
          {tooltipText && (
            <Tooltip title={tooltipText}>
              <IconButton size="small" sx={{ padding: 0, marginLeft: 1 }}>
                <InfoIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
        </Typography>
      </Box>
      <Slider
        value={value}
        onChange={onChange}
        valueLabelDisplay="auto"
        min={min}
        max={max}
        step={step}
        valueLabelFormat={formatValue}
      />
      <Typography variant="body2" color="text.secondary" align="right">
        {formatValue(value)}
      </Typography>
    </Box>
  );
};

export default SliderComponent;