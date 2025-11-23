/**
 * Currency Formatter Utility
 * Formats numbers as currency with locale support
 */

export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback if locale/currency not supported
    return `${currency} ${amount.toFixed(2)}`;
  }
};

export const parseCurrencyAmount = (text) => {
  // Remove currency symbols and commas, extract number
  const cleaned = text.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export default {
  formatCurrency,
  parseCurrencyAmount,
};
