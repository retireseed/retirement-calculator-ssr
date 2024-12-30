import React, { useState } from 'react';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import DeleteIcon from '@mui/icons-material/Delete';
import SliderComponent from './SliderComponent';

const ExpensesStep = ({ annualExpenses, estimatedInflationRate, oneOffExpenses, onInputChange, formatCurrency, currency, currentAge, ageOfDeath, handleAddExpense, handleDeleteExpense }) => {
  const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
  const [newExpense, setNewExpense] = useState({ age: currentAge, amount: '', category: '', type: 'oneOff' });

  const handleOpenExpenseDialog = () => {
    setOpenExpenseDialog(true);
  };

  const handleCloseExpenseDialog = () => {
    setOpenExpenseDialog(false);
    setNewExpense({ age: currentAge, amount: '', category: '', type: 'oneOff' });
  };

  const handleAddNewExpense = () => {
    if (newExpense.age && parseFloat(newExpense.amount) > 0 && newExpense.category && newExpense.type) {
      const updatedExpense = {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        action: newExpense.type === 'oneOff' ? 'Add' : 'Remove'
      };
      handleAddExpense(updatedExpense);
      handleCloseExpenseDialog();
    } else {
      alert('Please fill in all fields and ensure the amount is greater than 0.');
    }
  };

  return (
    <Box>
      <TextField
        label={<FormattedMessage id="annualExpenses" />}
        value={annualExpenses}
        onChange={(e) => onInputChange('annualExpenses', parseFloat(e.target.value) || 0)}
        fullWidth
        type="number"
        InputProps={{
          startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
        }}
        sx={{ mb: 2 }}
      />
      <SliderComponent
        label={<FormattedMessage id="estimatedInflationRate" />}
        value={estimatedInflationRate}
        onChange={(_, newValue) => onInputChange('estimatedInflationRate', newValue)}
        min={0}
        max={20}
        step={0.1}
        formatValue={(value) => `${value.toFixed(1)}%`}
        tooltipText={<FormattedMessage id="estimatedInflationRateTooltip" />}
      />
      <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={handleOpenExpenseDialog}>
        <FormattedMessage id="manageExpenses" />
      </Button>

      {oneOffExpenses.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="small" aria-label="expenses table">
            <TableHead>
              <TableRow>
                <TableCell><FormattedMessage id="age" /></TableCell>
                <TableCell><FormattedMessage id="amount" /></TableCell>
                <TableCell><FormattedMessage id="category" /></TableCell>
                <TableCell><FormattedMessage id="type" /></TableCell>
                <TableCell><FormattedMessage id="actions" /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {oneOffExpenses.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell>{expense.age}</TableCell>
                  <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>
                    <FormattedMessage id={expense.type === 'oneOff' ? 'oneOffExpense' : 'regularExpense'} />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteExpense(index)} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openExpenseDialog} onClose={handleCloseExpenseDialog} maxWidth="xs" fullWidth>
        <DialogTitle><FormattedMessage id="manageExpenses" /></DialogTitle>
        <DialogContent>
          <Typography variant="caption" sx={{ display: 'block', mb: 2 }}>
            <FormattedMessage id="manageExpensesDescription" />
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SliderComponent
              label={<FormattedMessage id="age" />}
              value={newExpense.age}
              onChange={(_, newValue) => setNewExpense({...newExpense, age: newValue})}
              min={currentAge}
              max={ageOfDeath}
              step={1}
              formatValue={(value) => value.toLocaleString()}
            />
            <TextField
              label={<FormattedMessage id="expenseAmount" />}
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
              }}
            />
            <FormControl fullWidth>
              <InputLabel><FormattedMessage id="expenseCategory" /></InputLabel>
              <Select
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                label={<FormattedMessage id="expenseCategory" />}
              >
                <MenuItem value="Wedding"><FormattedMessage id="wedding" /></MenuItem>
                <MenuItem value="Education"><FormattedMessage id="education" /></MenuItem>
                <MenuItem value="Travel"><FormattedMessage id="travel" /></MenuItem>
                <MenuItem value="Other"><FormattedMessage id="other" /></MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel><FormattedMessage id="expenseType" /></InputLabel>
              <Select
                value={newExpense.type}
                onChange={(e) => setNewExpense({...newExpense, type: e.target.value})}
                label={<FormattedMessage id="expenseType" />}
              >
                <MenuItem value="oneOff"><FormattedMessage id="addOneOffExpense" /></MenuItem>
                <MenuItem value="recurring"><FormattedMessage id="removeRegularExpense" /></MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExpenseDialog}><FormattedMessage id="cancel" /></Button>
          <Button onClick={handleAddNewExpense}><FormattedMessage id="add" /></Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpensesStep;