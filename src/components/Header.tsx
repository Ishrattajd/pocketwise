import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCurrency } from '../hooks/useCurrency';
import { CurrencySelector } from './CurrencySelector';
import { LogOut, Wallet, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { currency } = useCurrency();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5E0D8] px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center space-x-2.5">
        <div className="w-10 h-10 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-sm">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-base leading-tight tracking-tight text-[#1E293B] flex items-center gap-1.5">
            PocketWise
            <span className="text-[10px] font-semibold tracking-wide bg-[#0F766E]/10 text-[#0F766E] px-1.5 py-0.5 rounded-md">
              PWA
            </span>
          </h1>
          <p className="text-xs text-[#64748B]">Student Money Manager</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Quick Currency Badge & Switcher */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Currency and settings"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-white border border-[#E5E0D8] text-xs font-semibold text-[#1E293B] hover:border-[#0F766E] transition shadow-sm"
        >
          <span>{currency}</span>
          <Settings className="w-3.5 h-3.5 text-[#64748B]" />
        </button>

        {user && (
          <button
            onClick={() => void signOut()}
            aria-label="Sign out"
            title="Sign out"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl bg-white border border-[#E5E0D8] text-[#64748B] hover:text-[#1E293B] hover:border-[#0F766E] transition shadow-sm"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Settings Dropdown */}
      {showSettings && (
        <div className="absolute top-16 right-4 z-50 w-64 bg-white border border-[#E5E0D8] rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1E293B]">Active Currency</span>
            <button
              onClick={() => setShowSettings(false)}
              className="text-xs text-[#64748B] hover:text-[#1E293B] p-1"
            >
              Done
            </button>
          </div>
          <p className="text-[11px] text-[#64748B] mb-3">
            Choose your preferred currency for expense tracking and budgets.
          </p>
          <CurrencySelector />

          {user && (
            <div className="mt-3 pt-3 border-t border-[#E5E0D8] flex items-center justify-between text-xs">
              <span className="text-[#64748B] truncate max-w-[130px]">
                {user.displayName || 'Student'}
              </span>
              {user.isDemo && (
                <span className="text-[10px] font-semibold text-[#F59E0B] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  Demo Mode
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
