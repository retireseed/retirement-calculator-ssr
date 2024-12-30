import React from 'react';
import { Typography, Box, Container, List, ListItem, ListItemText, Divider } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

const PrivacyPage = () => {
  const intl = useIntl();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          <FormattedMessage id="privacyPolicy" defaultMessage="Privacy Policy" />
        </Typography>
        
        <Typography variant="body1" paragraph>
          <FormattedMessage 
            id="privacyIntro" 
            defaultMessage="This Privacy Policy describes how your personal information is collected, used, and shared when you visit or use our Retirement Calculator web application." 
          />
        </Typography>

        <Typography variant="h6" gutterBottom>
          <FormattedMessage id="informationWeCollect" defaultMessage="Information We Collect" />
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText 
              primary={intl.formatMessage({ id: "personalInfo", defaultMessage: "Personal Information" })}
              secondary={intl.formatMessage({ id: "personalInfoDesc", defaultMessage: "We collect personal information that you voluntarily provide to us when you use our calculator, such as your current age, retirement age, and financial details." })}
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary={intl.formatMessage({ id: "usageInfo", defaultMessage: "Usage Information" })}
              secondary={intl.formatMessage({ id: "usageInfoDesc", defaultMessage: "We automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device." })}
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          <FormattedMessage id="howWeUseInfo" defaultMessage="How We Use Your Information" />
        </Typography>
        
        <Typography variant="body1" paragraph>
          <FormattedMessage 
            id="useInfoDesc" 
            defaultMessage="We use the information we collect to provide, maintain, and improve our Retirement Calculator. This includes:" 
          />
        </Typography>

        <List>
          <ListItem>
            <ListItemText primary={intl.formatMessage({ id: "calculateRetirement", defaultMessage: "Calculating your retirement projections" })} />
          </ListItem>
          <ListItem>
            <ListItemText primary={intl.formatMessage({ id: "improveApp", defaultMessage: "Improving and optimizing our application" })} />
          </ListItem>
          <ListItem>
            <ListItemText primary={intl.formatMessage({ id: "communicateUsers", defaultMessage: "Communicating with you about your results or any issues" })} />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          <FormattedMessage id="dataSharing" defaultMessage="Sharing Your Information" />
        </Typography>
        
        <Typography variant="body1" paragraph>
          <FormattedMessage 
            id="dataSharingDesc" 
            defaultMessage="We do not share your personal information with third parties. Your data is used solely for the purpose of providing you with accurate retirement calculations and improving our service." 
          />
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          <FormattedMessage id="dataProtection" defaultMessage="Data Protection" />
        </Typography>
        
        <Typography variant="body1" paragraph>
          <FormattedMessage 
            id="dataProtectionDesc" 
            defaultMessage="We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security." 
          />
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          <FormattedMessage id="changes" defaultMessage="Changes" />
        </Typography>
        
        <Typography variant="body1" paragraph>
          <FormattedMessage 
            id="changesDesc" 
            defaultMessage="We may update this privacy policy from time to time in order to reflect changes to our practices or for other operational, legal or regulatory reasons." 
          />
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          <FormattedMessage id="contact" defaultMessage="Contact Us" />
        </Typography>
        
        <Typography variant="body1" paragraph>
          <FormattedMessage 
            id="contactDesc" 
            defaultMessage="For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at retireseed@gmail.com." 
          />
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPage;