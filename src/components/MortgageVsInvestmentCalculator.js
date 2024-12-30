import React, { useState, useCallback, useEffect } from 'react';
import { 
  Typography, Box, Card, CardContent, 
  Table, TableBody, TableCell, TableContainer, 
   TableRow, Paper, Slider, Tooltip, IconButton, TextField, InputAdornment,
  Select, MenuItem, FormControl
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { FormattedMessage } from 'react-intl';

const currencyOptions = [
  { value: 'USD', symbol: '$', locale: 'en-US' },
  { value: 'EUR', symbol: '€', locale: 'de-DE' },
  { value: 'GBP', symbol: '£', locale: 'en-GB' },
  { value: 'JPY', symbol: '¥', locale: 'ja-JP' },
  { value: 'INR', symbol: '₹', locale: 'en-IN' },
];

export default function MortgageVsInvestmentCalculator() {
  //const intl = useIntl();
  const [loanAmount, setLoanAmount] = useState(200000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [extraPayment, setExtraPayment] = useState(0);
  const [investmentReturn, setInvestmentReturn] = useState(7);
  const [propertyAppreciation, setPropertyAppreciation] = useState(3);
  const [currency, setCurrency] = useState('USD');
  const [locale, setLocale] = useState('en-US');

  const [results, setResults] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const calculateResults = useCallback(() => {
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);

    let mortgageBalance = loanAmount;
    let investmentBalance = 0;
    let totalInterestPaid = 0;
    let monthsToPayoff = totalPayments;
    let finalPropertyValue = loanAmount;

    for (let month = 1; month <= totalPayments; month++) {
      const interestPayment = mortgageBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment + extraPayment;
      
      totalInterestPaid += interestPayment;
      mortgageBalance -= principalPayment;

      if (mortgageBalance <= 0) {
        monthsToPayoff = month;
        break;
      }

      investmentBalance += extraPayment * Math.pow(1 + investmentReturn / 100 / 12, totalPayments - month);
      
      // Calculate property appreciation monthly
      finalPropertyValue *= (1 + propertyAppreciation / 100 / 12);
    }

    const yearsToPayoff = monthsToPayoff / 12;
    const totalCostMortgage = monthlyPayment * monthsToPayoff + extraPayment * monthsToPayoff;
    const totalCostInvestment = monthlyPayment * totalPayments;
    const investmentGrowth = investmentBalance - extraPayment * totalPayments;

    setResults({
      yearsToPayoff,
      totalInterestPaid,
      totalCostMortgage,
      totalCostInvestment,
      investmentBalance,
      investmentGrowth,
      monthlyPayment,
      finalPropertyValue
    });
  }, [loanAmount, interestRate, loanTerm, extraPayment, investmentReturn, propertyAppreciation]);

  useEffect(() => {
    if (isMounted) {
      calculateResults();
    }
  }, [isMounted, calculateResults]);

  const formatCurrency = (value) => {
    if (!isMounted) {
      // Simple formatting for server-side rendering
      return `${currencyOptions.find(option => option.value === currency).symbol}${Math.round(value).toLocaleString()}`;
    }
    // More precise formatting for client-side rendering
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCurrencyChange = (event) => {
    const selectedCurrency = event.target.value;
    const currencyOption = currencyOptions.find(option => option.value === selectedCurrency);
    setCurrency(selectedCurrency);
    setLocale(currencyOption.locale);
  };

  const SliderComponent = ({ 
    label, 
    value, 
    onChange, 
    min, 
    max, 
    step = 1, 
    tooltipText, 
    formatValue, 
    allowInput = false
  }) => {
    const [inputValue, setInputValue] = useState(value.toString());

    const handleSliderChange = (event, newValue) => {
      onChange(newValue);
      setInputValue(newValue.toString());
    };

    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };

    const handleInputBlur = () => {
      const newValue = Number(inputValue);
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        onChange(newValue);
      } else {
        setInputValue(value.toString());
      }
    };

    return (
      <Box sx={{ marginBottom: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0.5 }}>
          <Typography variant="caption">
            {label}
            {tooltipText && (
              <Tooltip title={tooltipText}>
                <IconButton size="small" sx={{ padding: 0, marginLeft: 0.5 }}>
                  <InfoIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            )}
          </Typography>
          {allowInput ? (
            <TextField
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              size="small"
              sx={{ width: '80px' }}
              InputProps={{
                startAdornment: <InputAdornment position="start">{currencyOptions.find(option => option.value === currency).symbol}</InputAdornment>,
              }}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">
              {formatValue(value)}
            </Typography>
          )}
        </Box>
        {isMounted && (
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            min={min}
            max={max}
            step={step}
          />
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        <FormattedMessage id="mortgageVsInvestmentTitle" />
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginTop: 2 }}>
        <Card sx={{ flexBasis: '300px', flexGrow: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
              <FormControl size="small">
                <Select
                  value={currency}
                  onChange={handleCurrencyChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Select currency' }}
                >
                  {currencyOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.symbol} {option.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <SliderComponent
              label={<FormattedMessage id="loanAmount" />}
              value={loanAmount}
              onChange={setLoanAmount}
              min={10000}
              max={1000000}
              step={1000}
              formatValue={formatCurrency}
              allowInput={true}
            />
            <SliderComponent
              label={<FormattedMessage id="interestRate" />}
              value={interestRate}
              onChange={setInterestRate}
              min={0.1}
              max={15}
              step={0.1}
              formatValue={(value) => `${value}%`}
            />
            <SliderComponent
              label={<FormattedMessage id="loanTerm" />}
              value={loanTerm}
              onChange={setLoanTerm}
              min={5}
              max={30}
              step={1}
              formatValue={(value) => `${value} years`}
            />
            <SliderComponent
              label={<FormattedMessage id="extraPayment" />}
              value={extraPayment}
              onChange={setExtraPayment}
              min={0}
              max={5000}
              step={50}
              formatValue={formatCurrency}
              allowInput={true}
            />
            <SliderComponent
              label={<FormattedMessage id="investmentReturn" />}
              value={investmentReturn}
              onChange={setInvestmentReturn}
              min={0.1}
              max={15}
              step={0.1}
              formatValue={(value) => `${value}%`}
            />
            <SliderComponent
              label={<FormattedMessage id="propertyAppreciation" />}
              value={propertyAppreciation}
              onChange={setPropertyAppreciation}
              min={0}
              max={10}
              step={0.1}
              formatValue={(value) => `${value}%`}
            />
          </CardContent>
        </Card>

        <Box sx={{ flexBasis: '600px', flexGrow: 2 }}>
          {results && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <FormattedMessage id="results" />
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell><FormattedMessage id="monthlyPayment" /></TableCell>
                        <TableCell align="right">{formatCurrency(results.monthlyPayment)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><FormattedMessage id="yearsToPayoff" /></TableCell>
                        <TableCell align="right">{results.yearsToPayoff.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><FormattedMessage id="totalInterestPaid" /></TableCell>
                        <TableCell align="right">{formatCurrency(results.totalInterestPaid)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><FormattedMessage id="totalCostMortgage" /></TableCell>
                        <TableCell align="right">{formatCurrency(results.totalCostMortgage)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><FormattedMessage id="totalCostInvestment" /></TableCell>
                        <TableCell align="right">{formatCurrency(results.totalCostInvestment)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><FormattedMessage id="investmentBalance" /></TableCell>
                        <TableCell align="right">{formatCurrency(results.investmentBalance)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><FormattedMessage id="investmentGrowth" /></TableCell>
                        <TableCell align="right">{formatCurrency(results.investmentGrowth)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><FormattedMessage id="finalPropertyValue" /></TableCell>
                        <TableCell align="right">{formatCurrency(results.finalPropertyValue)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="body1" mt={2} color={results.investmentGrowth > (results.finalPropertyValue - loanAmount) ? "success.main" : "error.main"}>
                  {results.investmentGrowth > (results.finalPropertyValue - loanAmount) ? (
                    <FormattedMessage id="investingMoreProfitable" />
                  ) : (
                    <FormattedMessage id="prepayingMoreProfitable" />
                  )}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
}