import { createContext, useContext } from 'react';
import { CurrencyCode, formatMoney, getCurrencySymbol } from '../utils/currency';

export interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  format: (amount: number) => string;
  symbol: string;
}

export const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'INR',
  setCurrency: () => {},
  format: (amount: number) => formatMoney(amount, 'INR'),
  symbol: getCurrencySymbol('INR'),
});

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
