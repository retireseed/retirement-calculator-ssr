import React from 'react';
import { Typography, Box, Button, Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';

const CountrySelectionStep = ({ onSelectCountry }) => {
  const countries = [
    { code: 'US', name: 'United States', currency: 'USD', symbol: '$' },
    { code: 'UK', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
    { code: 'IN', name: 'India', currency: 'INR', symbol: '₹' },
  ];

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        <FormattedMessage id="selectCountryTitle" defaultMessage="Select Your Country" />
      </Typography>
      <Typography variant="body1" paragraph>
        <FormattedMessage id="selectCountryMessage" defaultMessage="Please choose your country to personalize your retirement planning experience:" />
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {countries.map((country) => (
          <Grid item key={country.code}>
            <Button
              variant="outlined"
              onClick={() => onSelectCountry(country)}
              size="large"
            >
              {country.name} ({country.symbol})
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CountrySelectionStep;