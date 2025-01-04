import React, { useState } from 'react';
import { Typography, Box, Slider, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const SliderComponent = ({ label, value, onChange, min, max, step = 1, formatValue = (value) => value, tooltipText }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showTooltip, setShowTooltip] = useState(false);

  const handleTooltipClick = () => {
    if (isMobile) {
      setShowTooltip(!showTooltip);
    }
  };

  return (
    <Box sx={{ marginBottom: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 0.5 }}>
        <Typography variant="body2" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {label}
          {tooltipText && (
            isMobile ? (
              <IconButton 
                size="small" 
                onClick={handleTooltipClick}
                sx={{ padding: 0, marginLeft: 1 }}
              >
                <InfoIcon fontSize="inherit" />
              </IconButton>
            ) : (
              <Tooltip title={tooltipText}>
                <IconButton size="small" sx={{ padding: 0, marginLeft: 1 }}>
                  <InfoIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            )
          )}
        </Typography>
      </Box>
      {isMobile && showTooltip && (
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            color: 'text.secondary',
            fontSize: '0.75rem',
            mb: 1,
            mt: -0.5
          }}
        >
          {tooltipText}
        </Typography>
      )}
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