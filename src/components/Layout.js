import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { IntlProvider } from 'react-intl';
import translations from '../lib/translations';
import theme from '../lib/theme';
import Navigation from './Navigation';

export default function Layout({ children, language = 'en' }) { // Default to 'en' if not provided
  return (
    <ThemeProvider theme={theme}>
      <IntlProvider messages={translations[language]} locale={language} defaultLocale="en">
        <Navigation />
        <main>{children}</main>
      </IntlProvider>
    </ThemeProvider>
  );
}