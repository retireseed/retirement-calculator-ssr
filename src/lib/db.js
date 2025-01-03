import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db = null;

async function openDb() {
  if (!db) {
    try {
      db = await open({
        filename: './retirement_calculations.db',
        driver: sqlite3.Database
      });

      await db.run(`CREATE TABLE IF NOT EXISTS calculations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT,
        current_age INTEGER,
        annual_expenses REAL,
        age_of_retirement INTEGER,
        age_of_death INTEGER,
        estimated_inflation_rate REAL,
        annual_investment REAL,
        annual_investment_increment REAL,
        return_on_investment REAL,
        current_investment_value REAL,
        surplus_cash REAL,
        additional_years INTEGER,
        peak_corpus REAL,
        peak_corpus_age INTEGER,
        is_on_track BOOLEAN,
        currency TEXT,
        locale TEXT,
        language TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        channel TEXT
      )`);

      await db.run(`CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT,
        age INTEGER,
        amount REAL,
        category TEXT,
        type TEXT,
        action TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      await db.run(`CREATE TABLE IF NOT EXISTS income (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT,
        age INTEGER,
        amount REAL,
        increment_rate REAL,
        type TEXT,
        subtype TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      await db.run(`CREATE TABLE IF NOT EXISTS downloads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT,
        name TEXT,
        email TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

    } catch (error) {
      console.error('Error opening database:', error);
      throw error;
    }
  }
  return db;
}

export { openDb };