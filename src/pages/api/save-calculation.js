import { openDb } from '../../lib/db';

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