import React, { useState, useCallback, useEffect } from 'react';
import { 
  Typography, Box, Button, LinearProgress,
  Card, CardContent, useTheme, useMediaQuery
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import SliderComponent from './SliderComponent';
import ExpensesStep from './ExpensesStep';
import InvestmentsStep from './InvestmentsStep';
import IncomeStep from './IncomeStep';
import ResultsStep from './ResultsStep';
import CountrySelectionStep from './CountrySelectionStep';
import axios from 'axios';

const steps = ['countrySelection', 'profile', 'expenses', 'investments', 'income', 'results'];

export default function RetirementCalculator() {
  const [activeStep, setActiveStep] = useState(0);
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [calculationData, setCalculationData] = useState({
    currentAge: 30,
    ageOfRetirement: 65,
    ageOfDeath: 85,
    annualExpenses: 50000,
    estimatedInflationRate: 2,
    currentInvestmentValue: 0,
    annualInvestment: 10000,
    annualInvestmentIncrement: 0,
    returnOnInvestment: 7,
    oneOffExpenses: [],
    incomes: [],
  });
  const [results, setResults] = useState(null);
  const [shouldSaveCalculation, setShouldSaveCalculation] = useState(false);
  const [userIpAddress, setUserIpAddress] = useState('');
  const [locale, setLocale] = useState('en-US');
  const [language, setLanguage] = useState('en');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setCurrency(country.currency);
    
    // Instead of resetting values, we'll just update the currency
    // The actual conversion of values should happen in the calculation logic
    setCalculationData(prevData => ({
      ...prevData,
      // We're not changing any values here, just updating the currency
    }));
    
    handleNext();
  };

  const formatCurrency = useCallback((value) => {
    return formatCurrencyValue(value, currency);
  }, [currency]);

  const formatCurrencyValue = (value, currencyCode) => {
    // Use the current currency, not a hardcoded check
    if (currencyCode === 'INR') {
      if (value >= 10000000) {
        return `₹${(value / 10000000).toFixed(2)} Cr`;
      } else if (value >= 100000) {
        return `₹${(value / 100000).toFixed(2)} L`;
      }
    } else if (currencyCode === 'USD' || currencyCode === 'GBP') {
      const symbol = currencyCode === 'USD' ? '$' : '£';
      if (value >= 1000000) {
        return `${symbol}${(value / 1000000).toFixed(2)}M`;
      } else if (value >= 1000) {
        return `${symbol}${(value / 1000).toFixed(2)}K`;
      }
    }

    // For smaller values or other currencies, use the Intl.NumberFormat
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCalculate = useCallback(() => {
    const {
      currentAge,
      ageOfRetirement,
      ageOfDeath,
      annualExpenses,
      estimatedInflationRate,
      currentInvestmentValue,
      annualInvestment,
      annualInvestmentIncrement,
      returnOnInvestment,
      oneOffExpenses,
      incomes
    } = calculationData;

    let totalCorpus = currentInvestmentValue;
    let yearsInRetirement = Math.max(0, ageOfDeath - ageOfRetirement);
    let yearsToRetirement = Math.max(0, ageOfRetirement - currentAge);
    let inflationAdjustedExpenses = annualExpenses;
    let corpusAtRetirement = 0;
    let data = [];
    let maxCorpus = totalCorpus;
    let maxCorpusAge = currentAge;
    let shortfall = 0;
    let yearsShort = 0;
    
    let initialWithdrawalRate = 0;
    let currentWithdrawalRate = 0;
    let maxWithdrawalRate = 0;

    let currentAnnualInvestment = annualInvestment;

    for (let i = 0; i <= yearsToRetirement + yearsInRetirement; i++) {
      let currentAgeInLoop = currentAge + i;
      
      const oneOffExpense = oneOffExpenses.find(expense => expense.age === currentAgeInLoop && expense.type === 'oneOff');
      const removedExpense = oneOffExpenses.find(expense => expense.age === currentAgeInLoop && expense.type === 'recurring');
      
      if (oneOffExpense) {
        totalCorpus -= parseFloat(oneOffExpense.amount);
      }
      
      const recurringExpenses = oneOffExpenses.filter(expense => expense.age <= currentAgeInLoop && expense.type === 'recurring');
      const totalRecurringExpenses = recurringExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      
      // Calculate income for the current year
      const yearlyIncome = incomes.reduce((sum, income) => {
        if (currentAgeInLoop >= income.age) {
          const yearsReceivingIncome = currentAgeInLoop - income.age;
          const incrementFactor = Math.pow(1 + income.incrementRate / 100, yearsReceivingIncome);
          return sum + (income.amount * incrementFactor);
        }
        return sum;
      }, 0);

      if (i <= yearsToRetirement) {
        totalCorpus += currentAnnualInvestment;
        totalCorpus *= (1 + returnOnInvestment / 100);
        totalCorpus += yearlyIncome;
        
        // Increase annual investment for the next year
        currentAnnualInvestment *= (1 + annualInvestmentIncrement / 100);

        if (i === yearsToRetirement) {
          corpusAtRetirement = totalCorpus;
          initialWithdrawalRate = corpusAtRetirement > 0 
            ? (inflationAdjustedExpenses / corpusAtRetirement) * 100
            : 0;
          currentWithdrawalRate = initialWithdrawalRate;
          maxWithdrawalRate = initialWithdrawalRate;
        }
      } else {
        let withdrawalAmount = inflationAdjustedExpenses - totalRecurringExpenses - yearlyIncome;
        currentWithdrawalRate = totalCorpus > 0 
          ? (withdrawalAmount / totalCorpus) * 100
          : null; // Use null instead of Infinity when corpus is depleted
        maxWithdrawalRate = Math.max(maxWithdrawalRate, currentWithdrawalRate);
  
        totalCorpus -= withdrawalAmount;
        totalCorpus *= (1 + returnOnInvestment / 100);
        
        if (totalCorpus < 0 && yearsShort === 0) {
          yearsShort = ageOfDeath - currentAgeInLoop;
          shortfall = -totalCorpus;
        }
      }
      
      if (totalCorpus > maxCorpus) {
        maxCorpus = totalCorpus;
        maxCorpusAge = currentAgeInLoop;
      }

      inflationAdjustedExpenses *= (1 + estimatedInflationRate / 100);
      data.push({ 
        year: currentAgeInLoop, 
        totalCorpus: Math.max(0, totalCorpus),
        annualExpenses: inflationAdjustedExpenses,
        oneOffExpense: oneOffExpense ? parseFloat(oneOffExpense.amount) : 0,
        removedExpense: removedExpense ? parseFloat(removedExpense.amount) : 0,
        yearlyIncome: yearlyIncome,
        withdrawalRate: currentWithdrawalRate,
        annualInvestment: i <= yearsToRetirement ? currentAnnualInvestment : 0, // Add this line
        incomeType: yearlyIncome > 0 ? 'Income' : '-' // Add this line
      });
    }

    const calculatedResults = {
      corpusAtRetirement,
      withdrawalRate: initialWithdrawalRate,
      maxWithdrawalRate,
      surplusCash: totalCorpus > 0 ? totalCorpus : -shortfall,
      additionalYears: totalCorpus > 0 ? Math.floor(totalCorpus / inflationAdjustedExpenses) : -yearsShort,
      isOnTrack: totalCorpus > 0,
      peakCorpus: maxCorpus,
      peakCorpusAge: maxCorpusAge,
      currentAge: calculationData.currentAge,
      ageOfRetirement: calculationData.ageOfRetirement,
      ageOfDeath: calculationData.ageOfDeath,
      graphData: data,
      tableData: data // Add this line
    };

    
    setResults(calculatedResults);
    setShouldSaveCalculation(true);
    handleNext();
  }, [calculationData, currency, handleNext]);

  useEffect(() => {
    if (shouldSaveCalculation && results) {
      saveCalculation();
      setShouldSaveCalculation(false);
    }
  }, [shouldSaveCalculation, results]);

  const saveCalculation = async () => {
    try {
      const response = await fetch('/api/save-calculation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...calculationData,
          surplusCash: results.surplusCash,
          additionalYears: results.additionalYears,
          peakCorpusAge: results.peakCorpusAge,
          peakCorpus: results.peakCorpus,
          isOnTrack: results.isOnTrack,
          currency: currency,
          locale: locale,
          language: language,
          ipAddress: userIpAddress,
          expenses: calculationData.oneOffExpenses,
          incomes: calculationData.incomes,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

     // const data = await response.json();
      
    } catch (error) {
      console.error('Error saving calculation:', error.message);
    }
  };

  const handleInputChange = (key, value) => {
    setCalculationData(prevData => ({
      ...prevData,
      [key]: value
    }));
  };

  const handleDeleteIncome = (index) => {
    setCalculationData(prevData => ({
      ...prevData,
      incomes: prevData.incomes.filter((_, i) => i !== index)
    }));
  };

  const handleEdit = () => {
    setActiveStep(1); // Jump to Profile page (index 1 in the steps array)
    setResults(null); // Clear results
    // We're not resetting the calculationData here, so previous values are kept
  };

  const handleAddExpense = (newExpense) => {
    setCalculationData(prevData => ({
      ...prevData,
      oneOffExpenses: [...prevData.oneOffExpenses, newExpense]
    }));
  };

  const handleDeleteExpense = (index) => {
    setCalculationData(prevData => ({
      ...prevData,
      oneOffExpenses: prevData.oneOffExpenses.filter((_, i) => i !== index)
    }));
  };

  const handleAddIncome = (newIncome) => {
    setCalculationData(prevData => ({
      ...prevData,
      incomes: [...prevData.incomes, newIncome]
    }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <CountrySelectionStep onSelectCountry={handleSelectCountry} />;
      case 1:
        return (
          <Box>
            <SliderComponent
              label={<FormattedMessage id="currentAge" />}
              value={calculationData.currentAge}
              onChange={(_, newValue) => handleInputChange('currentAge', newValue)}
              min={18}
              max={70}
              formatValue={(value) => value.toLocaleString()}
              tooltipText={<FormattedMessage id="currentAgeTooltip" />}
            />
            <SliderComponent
              label={<FormattedMessage id="ageOfRetirement" />}
              value={calculationData.ageOfRetirement}
              onChange={(_, newValue) => handleInputChange('ageOfRetirement', newValue)}
              min={Math.max(calculationData.currentAge + 1, 1)}
              max={80}
              formatValue={(value) => value.toLocaleString()}
              tooltipText={<FormattedMessage id="ageOfRetirementTooltip" />}
            />
            <SliderComponent
              label={<FormattedMessage id="ageOfDeath" />}
              value={calculationData.ageOfDeath}
              onChange={(_, newValue) => handleInputChange('ageOfDeath', newValue)}
              min={Math.max(calculationData.ageOfRetirement + 1, calculationData.currentAge + 2)}
              max={120}
              formatValue={(value) => value.toLocaleString()}
              tooltipText={<FormattedMessage id="ageOfDeathTooltip" />}
            />
          </Box>
        );
      case 2:
        return (
          <ExpensesStep
            annualExpenses={calculationData.annualExpenses}
            estimatedInflationRate={calculationData.estimatedInflationRate}
            oneOffExpenses={calculationData.oneOffExpenses}
            onInputChange={handleInputChange}
            formatCurrency={formatCurrency}
            currency={currency}
            currentAge={calculationData.currentAge}
            ageOfDeath={calculationData.ageOfDeath}
            handleAddExpense={handleAddExpense}
            handleDeleteExpense={handleDeleteExpense}
          />
        );
      case 3:
        return (
          <InvestmentsStep
            {...calculationData}
            onInputChange={handleInputChange}
            formatCurrency={formatCurrency}
            currency={currency}
          />
        );
      case 4:
        return (
          <IncomeStep
            incomes={calculationData.incomes}
            onInputChange={handleInputChange}
            formatCurrency={formatCurrency}
            handleDeleteIncome={handleDeleteIncome}
            handleAddIncome={handleAddIncome}
            currency={currency}
            ageOfRetirement={calculationData.ageOfRetirement}
            ageOfDeath={calculationData.ageOfDeath}
          />
        );
      case 5:
        return <ResultsStep results={results} formatCurrency={formatCurrency} currency={currency} onEdit={handleEdit} />;
      default:
        return 'Unknown step';
    }
  };

  const showContinueButton = activeStep > 0 && activeStep < steps.length - 1;
  const showCalculateButton = activeStep === steps.length - 2;

  useEffect(() => {
    const detectLocale = () => {
      const userLocale = navigator.language || 'en-US';
      setLocale(userLocale);

      const languageCode = userLocale.split('-')[0];
      setLanguage(languageCode);

      // Update currency based on locale
      const currencyMap = {
        'en-US': 'USD',
        'en-GB': 'GBP',
        'de-DE': 'EUR',
        'ja-JP': 'JPY',
        'es-ES': 'EUR',
        'fr-FR': 'EUR',
        'hi-IN': 'INR',
        'en-IN': 'INR',
      };

      setCurrency(currencyMap[userLocale] || 'USD');
    };

    detectLocale();
  }, []);

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        // Use a service that returns the public IP address
        const response = await axios.get('https://api.ipify.org?format=json');
        setUserIpAddress(response.data.ip);
      } catch (error) {
        console.error('Error fetching IP address:', error);
        setUserIpAddress('Unknown');
      }
    };

    fetchIpAddress();
  }, []);

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 600, 
      margin: 'auto', 
      p: isMobile ? 2 : 3,
      boxSizing: 'border-box'
    }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mr: 1, fontWeight: 'bold' }}>
          {activeStep + 1}/{steps.length}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={(activeStep + 1) / steps.length * 100} 
          sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
        />
      </Box>
      <Card elevation={0} sx={{ bgcolor: 'background.default' }}>
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            <FormattedMessage id={`step.${steps[activeStep]}.title`} />
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            <FormattedMessage id={`step.${steps[activeStep]}.description`} />
          </Typography>
          {renderStepContent(activeStep)}
          {(showContinueButton || showCalculateButton) && (
            <Box sx={{ mt: 4 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={showCalculateButton ? handleCalculate : handleNext}
                sx={{ 
                  mb: 2, 
                  py: 1.5, 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                {showCalculateButton ? <FormattedMessage id="calculate" /> : <FormattedMessage id="continue" />}
              </Button>
              {activeStep > 0 && (
                <Button
                  fullWidth
                  variant="text"
                  onClick={handleBack}
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    color: 'text.secondary'
                  }}
                >
                  <FormattedMessage id="back" />
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}