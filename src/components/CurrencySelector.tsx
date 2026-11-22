import React from 'react';
import { useCurrency } from '../hooks/useCurrency';
import { CurrencyCode, SUPPORTED_CURRENCIES } from '../utils/currency';

interface CurrencySelectorProps {
  compact?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ compact = false }) => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-1.5" data-testid="currency-selector">
      {compact ? (
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          aria-label="Select currency"
          className="min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-[#E5E0D8] text-[#1E293B] focus:outline-none focus:border-[#0F766E] shadow-sm cursor-pointer"
        >
          {SUPPORTED_CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="flex bg-[#FAF7F2] p-1 rounded-xl border border-[#E5E0D8] w-full">
          {SUPPORTED_CURRENCIES.map((c) => {
            const isSelected = currency === c.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => setCurrency(c.code)}
                className={`min-h-[44px] flex-1 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                  isSelected
                    ? 'bg-[#0F766E] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                {c.symbol} {c.code}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
