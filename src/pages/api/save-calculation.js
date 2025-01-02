import { openDb } from '../../lib/db';
import nodemailer from 'nodemailer';



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'retireseed@gmail.com',
    pass: 'ebhv fbcd hwss yuqr' // Use App Password from Google Account
  }
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const db = await openDb();
      const {
        currentAge,
        annualExpenses,
        ageOfRetirement,
        ageOfDeath,
        estimatedInflationRate,
        annualInvestment,
        annualInvestmentIncrement,
        returnOnInvestment,
        currentInvestmentValue,
        surplusCash,
        additionalYears,
        peakCorpus,
        peakCorpusAge,
        isOnTrack,
        currency,
        locale,
        language,
        ipAddress,
        expenses,
        incomes
      } = req.body;

      // Insert main calculation data
      const result = await db.run(`
        INSERT INTO calculations (
          ip_address, current_age, annual_expenses, age_of_retirement, age_of_death,
          estimated_inflation_rate, annual_investment, annual_investment_increment, return_on_investment,
          current_investment_value, surplus_cash, additional_years, peak_corpus,
          peak_corpus_age, is_on_track, currency, locale, language
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        ipAddress, currentAge, annualExpenses, ageOfRetirement, ageOfDeath,
        estimatedInflationRate, annualInvestment, annualInvestmentIncrement, returnOnInvestment,
        currentInvestmentValue, surplusCash, additionalYears, peakCorpus,
        peakCorpusAge, isOnTrack ? 1 : 0, currency, locale, language
      ]);

      // Insert expenses
      for (const expense of expenses) {
        await db.run(`
          INSERT INTO expenses (ip_address, age, amount, category, type, action)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [ipAddress, expense.age, expense.amount, expense.category, expense.type, 'add']);
      }

      // Insert incomes
      for (const income of incomes) {
        await db.run(`
          INSERT INTO income (ip_address, age, amount, increment_rate, type, subtype)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [ipAddress, income.age, income.amount, income.incrementRate, income.type, income.subtype]);
      }

      // Updated email content with all fields
      const emailContent = `
        New Retirement Calculation Details:
        
        Personal Information:
        - IP Address: ${ipAddress}
        - Currency: ${currency}
        - Locale: ${locale}
        - Language: ${language}
        
        Age & Timeline:
        - Current Age: ${currentAge}
        - Retirement Age: ${ageOfRetirement}
        - Age of Death: ${ageOfDeath}
        
        Financial Details:
        - Annual Expenses: ${currency} ${annualExpenses}
        - Current Investment Value: ${currency} ${currentInvestmentValue}
        - Annual Investment: ${currency} ${annualInvestment}
        - Annual Investment Increment: ${annualInvestmentIncrement}%
        - Return on Investment: ${returnOnInvestment}%
        - Estimated Inflation Rate: ${estimatedInflationRate}%
        
        Results:
        - Is On Track: ${isOnTrack ? 'Yes' : 'No'}
        - Surplus Cash: ${currency} ${surplusCash}
        - Additional Years: ${additionalYears}
        - Peak Corpus: ${currency} ${peakCorpus}
        - Peak Corpus Age: ${peakCorpusAge}
        
        Number of Expenses: ${expenses.length}
        Number of Income Sources: ${incomes.length}
      `;

      await transporter.sendMail({
        from: 'retireseed@gmail.com',
        to: 'retireseed@gmail.com',
        subject: 'New Retirement Calculation Saved',
        text: emailContent
      });

      res.status(200).json({ message: 'Calculation saved successfully', id: result.lastID });
    } catch (error) {
      console.error('Error saving calculation:', error);
      res.status(500).json({ error: 'Error saving calculation' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}