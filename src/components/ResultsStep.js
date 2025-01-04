import React from 'react';
import { Box, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, ReferenceLine, ReferenceDot, Area } from 'recharts';
import CoffeeIcon from '@mui/icons-material/LocalCafe';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

const GraphComponent = ({ data, currentAge, ageOfRetirement, ageOfDeath, formatCurrency, oneOffExpenses, peakCorpus, peakCorpusAge }) => {
   
    
    const generateTicks = () => {
        const ticks = [currentAge, ageOfRetirement, ageOfDeath];
      
        oneOffExpenses.forEach(expense => {
            if (!ticks.includes(expense.age)) {
                ticks.push(expense.age);
            }
        });
        
        const sortedTicks = ticks.sort((a, b) => a - b);
       
        return sortedTicks;
    };

    

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <Typography 
                variant="caption" 
                sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0, 
                    color: '#0D5D56',
                    fontFamily: 'Roboto',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                }}
            >
                Peak Corpus: {formatCurrency(peakCorpus)}
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart 
                    data={data} 
                    margin={{ top: 20, right: 20, left: -20, bottom: 20 }}
                >
                    <XAxis 
                        dataKey="year" 
                        type="number"
                        domain={[currentAge, ageOfDeath]}
                        ticks={generateTicks()}
                        tick={{ fontFamily: 'Roboto', fontSize: 12, fill: '#666' }}
                        tickLine={{ stroke: '#666', strokeWidth: 1 }}
                        axisLine={false}
                        label={{ value: 'Age', position: 'insideBottom', offset: -5, fill: '#666', fontFamily: 'Roboto', fontSize: 12 }}
                        interval={0}
                        allowDataOverflow={true}
                    />
                    <YAxis 
                        tick={false}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ fontFamily: 'Roboto', fontSize: 12 }}
                    />
                    <Legend 
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{
                            fontFamily: 'Roboto',
                            fontSize: 12,
                            paddingTop: 20,
                        }}
                        iconSize={12}
                        iconType="circle"
                    />
                    <Bar 
                        dataKey="oneOffExpense"
                        fill="#FF4B4B"
                        name="One-off Expense" 
                        barSize={20}
                        stackId="expenses"
                    />
                    <Bar 
                        dataKey="removedExpense"
                        fill="#4CAF50"
                        name="Removed Expense" 
                        barSize={20}
                        stackId="expenses"
                    />
                    <Area
                        type="monotone"
                        dataKey="totalCorpus"
                        fill="#0D5D56"
                        fillOpacity={0.1}
                        stroke="none"
                        name="Total Corpus"
                    />
                    <Line 
                        type="monotone" 
                        dataKey="annualExpenses" 
                        stroke="#dc004e" 
                        strokeWidth={1} 
                        dot={false} 
                        name="Annual Expenses" 
                    />
                    <ReferenceLine
                        x={peakCorpusAge}
                        stroke="#0D5D56"
                        strokeWidth={1}
                        strokeDasharray="5 5"
                    />
                    <ReferenceDot
                        x={peakCorpusAge}
                        y={peakCorpus}
                        r={5}
                        fill="#0D5D56"
                        stroke="#FFFFFF"
                        strokeWidth={1.5}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </Box>
    );
};

const calculateScenarios = (results) => {
  try {
    const {
      currentAge,
      ageOfRetirement,
      ageOfDeath,
      annualExpenses,
      estimatedInflationRate,
      annualInvestment,
      returnRate = 0, // Default to 0 if undefined
      surplusCash,
      corpusAtRetirement
    } = results;

    const yearsToRetirement = ageOfRetirement - currentAge;
    const yearsInRetirement = ageOfDeath - ageOfRetirement;
    const inflationRate = estimatedInflationRate / 100;
    const returnRateDecimal = returnRate / 100;

    // 1. Inflation Adjustment for Annual Expenses
    const inflatedExpenseAtRetirement = annualExpenses * Math.pow(1 + inflationRate, yearsToRetirement);

    // 2. Corpus Required at Retirement
    let corpusRequired = 0;
    for (let t = 0; t < yearsInRetirement; t++) {
      corpusRequired += inflatedExpenseAtRetirement * Math.pow(1 + inflationRate, t) / Math.pow(1 + returnRateDecimal, t);
    }

    // 3. Additional Corpus Needed
    const additionalCorpusNeeded = corpusRequired - corpusAtRetirement;

    // 4. Additional Annual Investment
    const additionalAnnualInvestment = additionalCorpusNeeded * returnRateDecimal / (Math.pow(1 + returnRateDecimal, yearsToRetirement) - 1);

    // Round up the additionalAnnualInvestment to the nearest thousand and make it absolute
    const roundedAdditionalAnnualInvestment = Math.ceil(Math.abs(additionalAnnualInvestment) / 1000) * 1000;

    // Scenario 2: Required yearly percentage increase
    const baseMonthlyInvestment = annualInvestment / 12;
    const targetMonthlyInvestment = (annualInvestment + additionalAnnualInvestment) / 12;
    const requiredIncrement = baseMonthlyInvestment > 0 ? ((targetMonthlyInvestment / baseMonthlyInvestment) - 1) * 100 : 0;

    // Scenario 3: Additional years needed
    const currentFV = annualInvestment * ((Math.pow(1 + returnRateDecimal, yearsToRetirement) - 1) / returnRateDecimal);
    const additionalYears = currentFV > 0 ? Math.ceil(
      Math.log((currentFV + additionalCorpusNeeded) / currentFV) / Math.log(1 + returnRateDecimal)
    ) - yearsToRetirement : 0;

    return {
      additionalAnnualInvestment: roundedAdditionalAnnualInvestment,
      requiredIncrement: Math.max(0, Math.round(requiredIncrement * 10) / 10),
      additionalYearsNeeded: Math.max(0, additionalYears)
    };
  } catch (error) {
    console.error('Error in calculateScenarios:', error);
    return {
      additionalAnnualInvestment: 5000,
      requiredIncrement: 10,
      additionalYearsNeeded: 5
    };
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ResultsStep({ results, formatCurrency, currency, onEdit }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  if (!results) {
    return <Typography><FormattedMessage id="noResultsAvailable" /></Typography>;
  }

  const { corpusAtRetirement, withdrawalRate, maxWithdrawalRate, surplusCash, additionalYears, isOnTrack, graphData, peakCorpus, peakCorpusAge, currentAge, ageOfRetirement, ageOfDeath, tableData } = results;

  // Calculate scenarios if not on track
  const scenarios = !isOnTrack ? calculateScenarios(results) : null;

  const highlightStyle = {
    fontWeight: 'bold',
    color: 'black',
  };

  const HighlightedValue = ({ value }) => <span style={highlightStyle}>{value}</span>;

  // Format the maxWithdrawalRate, capping it at 100%
  const formattedMaxWithdrawalRate = maxWithdrawalRate > 100 ? '100.00' : maxWithdrawalRate.toFixed(2);

  const validateInputs = () => {
    const newErrors = {};
    
    // Validate name (letters, spaces, and basic punctuation only)
    if (!name.match(/^[a-zA-Z\s'.,-]{2,50}$/)) {
      newErrors.name = 'Please enter a valid name (2-50 characters, no special characters)';
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email.match(emailRegex)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendReport = async () => {
    if (!validateInputs()) return;

    setSending(true);
    
    const headers = ['Age', 'Annual Investment', 'Total Corpus', 'Annual Expenses', 'Withdrawal Rate'];
    const csvContent = [
      headers.join(','),
      ...tableData.map(row => [
        row.year,
        Math.round(row.annualInvestment),
        Math.round(row.totalCorpus),
        Math.round(row.annualExpenses),
        row.withdrawalRate.toFixed(2)
      ].join(','))
    ].join('\n');

    try {
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          csvContent,
          ipAddress: results.ipAddress
        }),
      });

      if (!response.ok) throw new Error('Failed to send report');

      setOpenDialog(false);
      // You might want to show a success message here
    } catch (error) {
      
      // You might want to show an error message here
    } finally {
      setSending(false);
    }
  };

  const handleDownload = () => {
    setOpenDialog(true);
  };

  return (
    <Box>
      {/* Edit Button */}
      <Box sx={{ mb: 4 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<EditIcon />}
          onClick={onEdit}
          sx={{ 
            py: 1.5, 
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            backgroundColor: '#0D5D56',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#0A4A45',
            },
            mb: 2  // Add margin bottom for spacing
          }}
        >
          <FormattedMessage id="edit" />
        </Button>
        
        {/* Add Follow Us Button */}
        <Button
          fullWidth
          variant="outlined"
          href="https://x.com/retireseed"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ 
            py: 1.5, 
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            borderColor: '#0D5D56',
            color: '#0D5D56',
            '&:hover': {
              borderColor: '#0A4A45',
              backgroundColor: 'rgba(13, 93, 86, 0.04)',
            },
          }}
        >
          <FormattedMessage id="followUsOnX" defaultMessage="Follow Us on X" />
        </Button>
      </Box>

      {/* New Navigation Links */}
      <Box sx={{ 
        mb: 4, 
        display: { xs: 'flex', md: 'none' }, // Only show on mobile
        flexDirection: 'column',
        gap: 0.5
      }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
          <FormattedMessage id="quickNavigation" defaultMessage="Quick Navigation" />
        </Typography>
        {[
          { id: 'summary', icon: '📊', message: 'Summary' },
          { id: 'corpusProjection', icon: '📈', message: 'Corpus Projection' },
          { id: 'detailedReport', icon: '📋', message: 'Detailed Projection Report' },
          { id: 'support', icon: '☕', message: 'Support the Developer' }
        ].map((item) => (
          <Button
            key={item.id}
            variant="text"
            fullWidth
            onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
            sx={{
              justifyContent: 'flex-start',
              color: '#0D5D56',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(13, 93, 86, 0.04)',
              }
            }}
          >
            {item.icon} {item.message}
          </Button>
        ))}
      </Box>

      {/* Results Card */}
      <Card id="summary" sx={{ 
        mt: 2, 
        p: 2, 
        backgroundColor: isOnTrack ? '#e8f5e9' : '#ffebee',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <CardContent>
          <Typography variant="body1" paragraph>
            {isOnTrack ? (
              <FormattedMessage
                id="onTrackMessage"
                values={{
                  corpusAtRetirement: <HighlightedValue value={formatCurrency(corpusAtRetirement)} />,
                  initialRate: <HighlightedValue value={withdrawalRate.toFixed(2)} />,
                  maxRate: <HighlightedValue value={formattedMaxWithdrawalRate} />,
                  surplus: <HighlightedValue value={formatCurrency(Math.abs(surplusCash))} />,
                  additionalYears: <HighlightedValue value={additionalYears} />,
                  years: additionalYears === 1 ? 'year' : 'years',
                }}
              />
            ) : (
              <>
                <FormattedMessage
                  id="notOnTrackMessage"
                  values={{
                    corpusAtRetirement: <HighlightedValue value={formatCurrency(corpusAtRetirement)} />,
                    initialRate: <HighlightedValue value={withdrawalRate.toFixed(2)} />,
                    maxRate: <HighlightedValue value={formattedMaxWithdrawalRate} />,
                    shortfall: <HighlightedValue value={formatCurrency(Math.abs(surplusCash))} />,
                    yearsShort: <HighlightedValue value={Math.abs(additionalYears)} />,
                  }}
                />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <FormattedMessage
                    id="suggestedSolutions"
                    defaultMessage="Here are some ways to achieve your retirement goal:"
                  />
                  <ul>
                    <li>
                      <FormattedMessage
                        id="additionalAnnualSolution"
                        defaultMessage="Increase your current annual investment by {amount} per year"
                        values={{
                          amount: <HighlightedValue value={formatCurrency(scenarios.additionalAnnualInvestment)} />
                        }}
                      />
                    </li>
                    <li>
                      <FormattedMessage
                        id="incrementalIncreaseSolution"
                        defaultMessage="OR increase your monthly investments by {percentage}% each year"
                        values={{
                          percentage: <HighlightedValue value={Math.max(scenarios.requiredIncrement, 0).toFixed(1)} />
                        }}
                      />
                    </li>
                    <li>
                      <FormattedMessage
                        id="delayRetirementSolution"
                        defaultMessage="OR delay your retirement by {years} {yearLabel}"
                        values={{
                          years: <HighlightedValue value={scenarios.additionalYearsNeeded} />,
                          yearLabel: scenarios.additionalYearsNeeded === 1 ? 'year' : 'years'
                        }}
                      />
                    </li>
                  </ul>
                </Typography>
              </>
            )}
          </Typography>
        </CardContent>
      </Card>
      
      {/* Graph Card */}
      <Card id="corpusProjection" sx={{ mt: 4 }}>
        <CardContent>
          <Typography 
            variant="h6"
            gutterBottom 
            align="left" 
            sx={{ 
              mb: 2,
              fontWeight: 'bold',
              color: 'black',
              fontSize: '1rem', // Explicitly set font size
              lineHeight: 1.2, // Adjust line height for better spacing
            }}
          >
            <FormattedMessage id="corpusGrowthDecline" />
          </Typography>
          {graphData && graphData.length > 0 && (
            <Box sx={{ height: 400, mt: 3 }}> 
              <GraphComponent 
                data={graphData} 
                currentAge={currentAge}
                ageOfRetirement={ageOfRetirement}
                ageOfDeath={ageOfDeath}
                formatCurrency={formatCurrency}
                oneOffExpenses={results.oneOffExpenses || []}
                peakCorpus={peakCorpus}
                peakCorpusAge={peakCorpusAge}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card id="detailedReport" sx={{ mt: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h6"
              sx={{ 
                fontWeight: 'bold',
                color: 'black',
                fontSize: '1rem',
                lineHeight: 1.2,
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              <FormattedMessage id="detailedProjections" />
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={handleDownload}
              sx={{
                backgroundColor: '#0D5D56',
                color: '#ffffff',
                fontSize: '0.8rem',
                padding: '4px 8px',
                minWidth: '80px',
                fontFamily: 'Roboto, sans-serif',
                '&:hover': {
                  backgroundColor: '#0A4A45',
                },
              }}
            >
              <FormattedMessage id="download" />
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader aria-label="detailed projections table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>Age</TableCell>
                  <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>Annual Investment</TableCell>
                  <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>Total Corpus</TableCell>
                  <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>Annual Expenses</TableCell>
                  <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>Withdrawal Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.year}>
                    <TableCell sx={{ fontFamily: 'Roboto, sans-serif' }}>{row.year}</TableCell>
                    <TableCell sx={{ fontFamily: 'Roboto, sans-serif' }}>{formatCurrency(row.annualInvestment)}</TableCell>
                    <TableCell sx={{ fontFamily: 'Roboto, sans-serif' }}>{formatCurrency(row.totalCorpus)}</TableCell>
                    <TableCell sx={{ fontFamily: 'Roboto, sans-serif' }}>{formatCurrency(row.annualExpenses)}</TableCell>
                    <TableCell sx={{ fontFamily: 'Roboto, sans-serif' }}>
                      {row.withdrawalRate === null ? 'N/A' : `${row.withdrawalRate.toFixed(2)}%`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Support Card */}
      <Card id="support" sx={{ mt: 4, backgroundColor: '#f5f5f5', color: '#333333' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            <FormattedMessage id="supportDeveloper" />
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            <FormattedMessage id="buyMeCoffeeMessage" />
          </Typography>
          <Button
            variant="contained"
            startIcon={<CoffeeIcon />}
            href="https://www.buymeacoffee.com/retireseed"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: '#0D5D56',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#0A4A45',
              },
            }}
          >
            <FormattedMessage id="buyMeACoffee" />
          </Button>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Send Report to Email</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendReport} 
            disabled={sending}
            sx={{
              backgroundColor: '#0D5D56',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#0A4A45',
              },
            }}
          >
            {sending ? 'Sending...' : 'Send Report'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
