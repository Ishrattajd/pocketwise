export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyOption {
  code: CurrencyCode;
  label: string;
  symbol: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'INR', label: 'INR (₹)', symbol: '₹' },
  { code: 'USD', label: 'USD ($)', symbol: '$' },
  { code: 'EUR', label: 'EUR (€)', symbol: '€' },
  { code: 'GBP', label: 'GBP (£)', symbol: '£' },
];

/**
 * Returns the standard locale code for a given currency code.
 * Defaults to 'en-IN' for INR.
 */
export function getCurrencyLocale(code: string = 'INR'): string {
  switch (code.toUpperCase()) {
    case 'INR':
      return 'en-IN';
    case 'EUR':
      return 'de-DE';
    case 'GBP':
      return 'en-GB';
    case 'USD':
      return 'en-US';
    default:
      return 'en-IN';
  }
}

/**
 * Returns the currency symbol for display (e.g. ₹ for INR, $ for USD).
 */
export function getCurrencySymbol(code: string = 'INR'): string {
  const match = SUPPORTED_CURRENCIES.find((c) => c.code === code.toUpperCase());
  return match ? match.symbol : '₹';
}

/**
 * Formats a monetary amount using Intl.NumberFormat.
 * Uses 'en-IN' locale by default for Indian Rupee (INR).
 * Omit decimals for whole numbers, includes 2 decimal places when fractional.
 */
export function formatMoney(amount: number, code: string = 'INR'): string {
  const currencyCode = code.toUpperCase();
  const locale = getCurrencyLocale(currencyCode);
  const hasDecimals = amount % 1 !== 0;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
