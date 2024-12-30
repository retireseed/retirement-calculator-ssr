import React from 'react';
import { Box, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, ReferenceLine, ReferenceDot, Area } from 'recharts';
import CoffeeIcon from '@mui/icons-material/LocalCafe';
import EditIcon from '@mui/icons-material/Edit';

const GraphComponent = ({ data, currentAge, ageOfRetirement, ageOfDeath, formatCurrency, oneOffExpenses, peakCorpus, peakCorpusAge }) => {


    const generateTicks = () => {
        let ticks = [currentAge, ageOfRetirement, ageOfDeath];
        oneOffExpenses.forEach(expense => {
          if (!ticks.includes(expense.age)) {
            ticks.push(expense.age);
          }
        });
        return ticks.sort((a, b) => a - b);
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
                    <Bar dataKey="oneOffExpense" fill="#ff6b6b" name="One-off Expense" />
                    <Bar dataKey="removedExpense" fill="#4ecdc4" name="Removed Expense" />
                    <Area
                        type="monotone"
                        dataKey="totalCorpus"
                        fill="#0D5D56"
                        fillOpacity={0.1}
                        stroke="none"
                        name="Total Corpus"
                    />
                    <Line type="monotone" dataKey="annualExpenses" stroke="#dc004e" strokeWidth={1} dot={false} name="Annual Expenses" />
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ResultsStep({ results, formatCurrency, currency, onEdit }) {
  if (!results) {
    return <Typography><FormattedMessage id="noResultsAvailable" /></Typography>;
  }

  const { corpusAtRetirement, withdrawalRate, maxWithdrawalRate, surplusCash, additionalYears, isOnTrack, graphData, peakCorpus, peakCorpusAge, currentAge, ageOfRetirement, ageOfDeath, tableData } = results;

  const highlightStyle = {
    fontWeight: 'bold',
    color: 'black',
  };

  const HighlightedValue = ({ value }) => <span style={highlightStyle}>{value}</span>;

  // Format the maxWithdrawalRate, capping it at 100%
  const formattedMaxWithdrawalRate = maxWithdrawalRate > 100 ? '100.00' : maxWithdrawalRate.toFixed(2);

  const handleDownload = () => {
    const headers = ['Age', 'Annual Investment', 'Total Corpus', 'Annual Expenses', 'Withdrawal Rate'];
    const csvContent = [
      headers.join(','),
      ...tableData.map(row => [
        row.year,
        row.annualInvestment,
        row.totalCorpus,
        row.annualExpenses,
        row.withdrawalRate.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'retirement_projections.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Box>
      {/* Edit Button with updated styling */}
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
          }}
        >
          <FormattedMessage id="edit" />
        </Button>
      </Box>

      {/* Results Card */}
      <Card sx={{ 
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
            )}
          </Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ mt: 4 }}>
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

      {/* Updated Table Card */}
      <Card sx={{ mt: 4 }}>
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

      {/* New "Buy Me a Coffee" card with updated styling */}
      <Card sx={{ mt: 4, backgroundColor: '#f5f5f5', color: '#333333' }}>
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
    </Box>
  );
}
