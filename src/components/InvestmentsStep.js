import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import SliderComponent from './SliderComponent';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InvestmentsStep = ({ currentInvestmentValue, annualInvestment, annualInvestmentIncrement, returnOnInvestment, onInputChange, formatCurrency, currency }) => {
  return (
    <Box>
      <TextField
        label={<FormattedMessage id="currentInvestmentValue" />}
        value={currentInvestmentValue}
        onChange={(e) => onInputChange('currentInvestmentValue', parseFloat(e.target.value) || 0)}
        fullWidth
        type="number"
        InputProps={{
          startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
        }}
        sx={{ mb: 2 }}
      />
      <TextField
        label={<FormattedMessage id="annualInvestmentUntilRetirement" />}
        value={annualInvestment}
        onChange={(e) => onInputChange('annualInvestment', parseFloat(e.target.value) || 0)}
        fullWidth
        type="number"
        InputProps={{
          startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
        }}
        sx={{ mb: 2 }}
      />
      <SliderComponent
        label={<FormattedMessage id="annualInvestmentIncrement" />}
        value={annualInvestmentIncrement}
        onChange={(_, newValue) => onInputChange('annualInvestmentIncrement', newValue)}
        min={0}
        max={20}
        step={0.1}
        formatValue={(value) => `${value.toFixed(1)}%`}
        tooltipText={<FormattedMessage id="annualInvestmentIncrementTooltip" />}
      />
      <SliderComponent
        label={<FormattedMessage id="returnOnInvestment" />}
        value={returnOnInvestment}
        onChange={(_, newValue) => onInputChange('returnOnInvestment', newValue)}
        min={1}
        max={30}
        step={0.1}
        formatValue={(value) => `${value.toFixed(1)}%`}
        tooltipText={<FormattedMessage id="returnOnInvestmentTooltip" />}
      />
    </Box>
  );
};

export default InvestmentsStep;