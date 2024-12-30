import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { FormattedMessage } from 'react-intl';

const GetStartedStep = ({ onNext }) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        <FormattedMessage id="welcomeTitle" defaultMessage="Welcome to Your Retirement Planning Journey!" />
      </Typography>
      <Typography variant="body1" paragraph>
        <FormattedMessage id="welcomeMessage" defaultMessage="Congratulations on taking the first step towards a secure financial future! Planning for retirement is an exciting adventure, and we're here to make it fun and easy for you." />
      </Typography>
      <Typography variant="body1" paragraph>
        <FormattedMessage id="planningBenefits" defaultMessage="By starting your retirement planning today, you're setting yourself up for a future filled with possibilities. Whether you dream of traveling the world, pursuing new hobbies, or simply enjoying peace of mind, a well-planned retirement can help make those dreams a reality." />
      </Typography>
      <Button variant="contained" color="primary" onClick={onNext} size="large">
        <FormattedMessage id="getStartedButton" defaultMessage="Let's Get Started!" />
      </Button>
    </Box>
  );
};

export default GetStartedStep;