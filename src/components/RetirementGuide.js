// File: src/components/RetirementGuide.js

import React from 'react';
import { Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const RetirementGuide = () => {
  return (
    <Card sx={{ marginTop: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Retirement Planning Calculator Guide
        </Typography>
        <Typography variant="body2" paragraph>
          Planning for retirement is one of the most important aspects of personal financial planning. If one has a plan for retirement during working years, they can reap the benefits of investment in the retiring period. Planning for retirement involves many assumptions about life expectancy, state of economy, interest rate, and inflation.
        </Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Calculator Inputs</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" paragraph>
              The retirement planning Calculator asks the user to enter the following ten inputs:
            </Typography>
            <List>
              {[
                "Present Age (Today's Age in Years): Enter your current age in years.",
                "Retirement Age (Age at when you will retire): Enter the age at which you intend to retire.",
                "Life Expectancy (Age till you are expected to live): Enter the age until which you expect to live. This age can't be less than age of retirement.",
                "Long Term Inflation in economy (In %): Enter the long-term inflation expectation in the economy. The Federal Reserve typically aims for an inflation rate of around 2%, but it&apos;s advisable to consider a range between 2% to 3% for long-term planning. Historical inflation rates and economic forecasts should be taken into account.",
                "Present Living expenses per month (In $): Enter your present monthly expenses which you would like to maintain during retirement period, so as to maintain the present life style. For example, a 30-year-old user having $5,000 monthly expenses would require approximately $10,950 at the age of 60 due to inflation, assuming a 3% annual inflation rate.",
                "Reduction in expenses after retirement (In % terms): There would be certain expenses (commuting costs, work-related expenses, etc.), which may not be required during retirement phase. The user may decide and enter % amount by which expenses may be reduced during retired life. If user thinks there would be no such reduction, they may choose to enter \"0\" in the tab.",
                "Expected Return on Investment during working years (In %): This is one of the most important assumptions which user needs to make while doing retirement planning. The user needs to enter the rate of return they expect to make on their investments during their working life. For equity investments, it&apos;s generally advisable to assume returns between 6% to 8%, while for fixed income investments, 2% to 4% might be more realistic. The user is advised not to assume unrealistic investment returns while planning for retirement.",
                "Expected Rate of return during Retired Life (In %): This is the rate of return the user expects to receive on the corpus they&apos;ve accumulated during working years. It&apos;s expected that the user will invest this corpus in suitable financial products (Annuities, Bonds, Dividend-paying stocks) where they can earn decent returns during their retired life. Since this investment would be during retired life, users are advised to choose financial products that carry minimal to no risk. Such products typically yield returns in the range of 2% to 4%. Therefore, users are advised not to enter very high rates of return in this tab while entering their input.",
                "Current savings for the retirement phase (In $): If the user has any existing savings which they would like to deploy for the retirement phase, they may enter that amount in this tab. If there are no such savings, the user may enter 0 in this tab.",
                "Amount of retirement benefits received at the time of retirement (in $): In this tab, the user is expected to enter the money they would be receiving in the form of retirement benefits from their employer (401(k) funds, pension payouts, etc.). If the user does not have such benefits, they may enter 0 in this tab."
              ].map((text, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${index + 1}. ${text}`} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Calculator Outputs</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" paragraph>
              The retirement planning calculator generates the following three outputs for the user:
            </Typography>
            <List>
              {[
                "Per month amount required during retiring life: It lets the user know how much money they would require per month to maintain their lifestyle as assumed by them while making the retirement plan. For example, a 30-year-old user having $5,000 monthly expenses during working years would require approximately $10,950 at the age of 60 due to inflation, assuming a 3% annual inflation rate.",
                "Corpus Required at Retirement day to maintain present standard of living during Retired Life: It lets the user know how much money they need to have on the day of retirement to live a comfortable retired life until their expected end of life.",
                "Investment Required per month to achieve Retirement corpus: It lets the user know how much money they need to invest per month to achieve the retirement corpus as mentioned in point (b) above. In case the user is getting a \"0\" answer in this tab, that means the user's current savings and amount received as retirement benefits are enough to take care of their retirement needs. No separate investment is required."
              ].map((text, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${index + 1}. ${text}`} />
                </ListItem>
              ))}
            </List>
            <Typography variant="body2" paragraph>
              <strong>Note:</strong> All the calculations are carried out by assuming end of the period payments.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How to Use the Calculator</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {[
                "Enter your details in all the input fields as accurately as possible.",
                "Review the assumptions you've made, especially for inflation and expected returns.",
                "The calculator will automatically compute and display the results based on your inputs.",
                "Experiment with different scenarios by adjusting your inputs to see how they affect your retirement planning.",
                "Use the results to set realistic savings goals and adjust your financial strategy as needed."
              ].map((text, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${index + 1}. ${text}`} />
                </ListItem>
              ))}
            </List>
            <Typography variant="body2" paragraph>
              Remember, this calculator provides estimates based on the information you provide. it&apos;s always a good idea to consult with a financial advisor for personalized retirement planning advice.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default RetirementGuide;