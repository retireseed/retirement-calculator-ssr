import React, { useState } from 'react';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import DeleteIcon from '@mui/icons-material/Delete';
import SliderComponent from './SliderComponent';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IncomeStep = ({ incomes, onInputChange, formatCurrency, handleDeleteIncome, currency, ageOfRetirement, ageOfDeath, handleAddIncome }) => {
  const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
  const [newIncome, setNewIncome] = useState({ age: ageOfRetirement, amount: '', incrementRate: 0, type: 'pension', subtype: '' });

  const handleOpenIncomeDialog = () => {
    setOpenIncomeDialog(true);
  };

  const handleCloseIncomeDialog = () => {
    setOpenIncomeDialog(false);
    setNewIncome({ age: ageOfRetirement, amount: '', incrementRate: 0, type: 'pension', subtype: '' });
  };

  const handleAddNewIncome = () => {
    if (newIncome.age && parseFloat(newIncome.amount) > 0 && newIncome.type && newIncome.subtype) {
      handleAddIncome(newIncome);
      handleCloseIncomeDialog();
    } else {
      alert('Please fill in all fields and ensure the amount is greater than 0.');
    }
  };

  return (
    <Box>
      <Button variant="outlined" onClick={handleOpenIncomeDialog} size="small" sx={{ mb: 2 }}>
        <FormattedMessage id="addRetirementIncome" />
      </Button>

      {incomes.length > 0 && (
        <TableContainer component={Paper}>
          <Table size="small" aria-label="income table">
            <TableHead>
              <TableRow>
                <TableCell><FormattedMessage id="age" /></TableCell>
                <TableCell><FormattedMessage id="amount" /></TableCell>
                <TableCell><FormattedMessage id="incomeType" /></TableCell>
                <TableCell><FormattedMessage id="incomeSubtype" /></TableCell>
                <TableCell><FormattedMessage id="incomeIncrementRate" /></TableCell>
                <TableCell><FormattedMessage id="actions" /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incomes.map((income, index) => (
                <TableRow key={index}>
                  <TableCell>{income.age}</TableCell>
                  <TableCell>{formatCurrency(income.amount)}</TableCell>
                  <TableCell><FormattedMessage id={income.type} /></TableCell>
                  <TableCell>{income.subtype}</TableCell>
                  <TableCell>{`${income.incrementRate}%`}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteIncome(index)} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openIncomeDialog} onClose={handleCloseIncomeDialog} maxWidth="xs" fullWidth>
        <DialogTitle><FormattedMessage id="addRetirementIncome" /></DialogTitle>
        <DialogContent>
          <Typography variant="caption" sx={{ display: 'block', mb: 2 }}>
            <FormattedMessage id="addRetirementIncomeDescription" />
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SliderComponent
              label={<FormattedMessage id="age" />}
              value={newIncome.age}
              onChange={(_, newValue) => setNewIncome({...newIncome, age: newValue})}
              min={ageOfRetirement}
              max={ageOfDeath}
              step={1}
              formatValue={(value) => value.toLocaleString()}
            />
            <TextField
              label={<FormattedMessage id="incomeAmount" />}
              value={newIncome.amount}
              onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
              }}
            />
            <SliderComponent
              label={<FormattedMessage id="incomeIncrementRate" />}
              value={newIncome.incrementRate}
              onChange={(_, newValue) => setNewIncome({...newIncome, incrementRate: newValue})}
              min={0}
              max={20}
              step={0.1}
              formatValue={(value) => `${value.toFixed(1)}%`}
            />
            <FormControl fullWidth>
              <InputLabel><FormattedMessage id="incomeType" /></InputLabel>
              <Select
                value={newIncome.type}
                onChange={(e) => setNewIncome({...newIncome, type: e.target.value})}
                label={<FormattedMessage id="incomeType" />}
              >
                <MenuItem value="pension"><FormattedMessage id="pension" /></MenuItem>
                <MenuItem value="passive"><FormattedMessage id="passive" /></MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel><FormattedMessage id="incomeSubtype" /></InputLabel>
              <Select
                value={newIncome.subtype}
                onChange={(e) => setNewIncome({...newIncome, subtype: e.target.value})}
                label={<FormattedMessage id="incomeSubtype" />}
              >
                <MenuItem value="Rental"><FormattedMessage id="rental" /></MenuItem>
                <MenuItem value="Dividends"><FormattedMessage id="dividends" /></MenuItem>
                <MenuItem value="Pension"><FormattedMessage id="pension" /></MenuItem>
                <MenuItem value="Other"><FormattedMessage id="other" /></MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIncomeDialog}><FormattedMessage id="cancel" /></Button>
          <Button onClick={handleAddNewIncome}><FormattedMessage id="add" /></Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IncomeStep;