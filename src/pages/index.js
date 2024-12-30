import Link from 'next/link';
import { Typography, Button, Box, Container, Grid, Paper } from '@mui/material';

export default function Home() {
  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 2 }}>
      <Typography variant="h2" component="h2" gutterBottom align="center">
        Welcome to Our Retirement Planning Tools
      </Typography>
      <Typography variant="body1" paragraph align="center">
        Explore our suite of retirement planning tools to secure your future.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button component={Link} href="/retirement-calculator" variant="contained" color="primary">
          Go to Retirement Calculator
        </Button>
      </Box>

      {/* New content starts here */}
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Why Retirement Planning is Essential</Typography>
              <Typography variant="body1" paragraph>
                Retirement planning is not just about saving money; it&apos;s about ensuring that you can maintain your lifestyle and meet your financial needs when your regular income stops. As life expectancy increases, the need for a well-thought-out retirement plan becomes even more critical. Without proper planning, you might find yourself struggling to cover essential expenses in your later years, potentially leading to financial stress when you should be enjoying your golden years. A solid retirement plan gives you the peace of mind that comes from knowing you have enough resources to sustain your lifestyle.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>The Role of Accurate Forecasting in Retirement Planning</Typography>
              <Typography variant="body1" paragraph>
                Accurate forecasting plays a pivotal role in retirement planning. Understanding how your investments will grow over time, accounting for inflation, and estimating your future expenses are all crucial elements. However, these calculations can be complex and overwhelming. This is where the need for a reliable tool comes into play. A good retirement calculator helps break down these complexities by providing a clear picture of your financial trajectory, allowing you to make informed decisions today that will benefit you in the future.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Introducing the Retirement Calculator App</Typography>
              <Typography variant="body1" paragraph>
                The new Retirement Calculator app is designed to simplify the process of retirement planning. With a user-friendly interface, it allows you to input key details like your current age, annual expenses, retirement age, and expected return on investments. The app then calculates essential metrics such as your peak corpus value, the surplus beyond your life expectancy, and how many extra years your corpus will last. This instant feedback helps you understand whether you are on track to meet your retirement goals or if adjustments are needed.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Identifying Shortfalls and Making Adjustments</Typography>
              <Typography variant="body1" paragraph>
              One of the most valuable features of the Retirement Calculator app is its ability to identify potential shortfalls in your retirement plan. By adjusting variables like the inflation rate or investment returns, the app can show how these factors impact your financial outlook. For example, if your expected returns are lower than anticipated or inflation rises, the app will reflect these changes, helping you see if you need to increase your savings or adjust your retirement age. This proactive approach allows you to avoid unpleasant surprises in the future.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Planning for a Secure Future</Typography>
              <Typography variant="body1" paragraph>
                In conclusion, retirement planning is an essential part of ensuring a secure and comfortable future. The Retirement Calculator app empowers you to take control of your financial future by providing clear, actionable insights. By using this tool, you can identify potential shortfalls early, make necessary adjustments, and ultimately achieve your retirement goals with confidence. Don&apos;t leave your future to chance—start planning today with the help of this powerful tool.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      {/* New content ends here */}
    </Box>
  );
}
