import React, { useEffect, useState } from 'react';
import { CurrencyCode, formatMoney, getCurrencySymbol } from '../utils/currency';
import { CurrencyContext } from '../hooks/useCurrency';

const STORAGE_KEY = 'pocketwise_currency';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'INR' || saved === 'USD' || saved === 'EUR' || saved === 'GBP') {
      return saved;
    }
    return 'INR';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
  };

  const format = (amount: number): string => {
    return formatMoney(amount, currency);
  };

  const symbol = getCurrencySymbol(currency);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};
