import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const TipMessage = ({ message }) => (
  <Paper elevation={0} sx={{ backgroundColor: '#e3f2fd', p: 2, mt: 2, borderRadius: 2 }}>
    <Box display="flex" alignItems="center">
      <InfoIcon sx={{ mr: 1, color: '#1976d2' }} />
      <Typography variant="body2">{message}</Typography>
    </Box>
  </Paper>
);

export default TipMessage;