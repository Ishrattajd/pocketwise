import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Wallet } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-base leading-tight tracking-tight text-white flex items-center gap-1.5">
            PocketWise
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.2 rounded">
              PWA
            </span>
          </h1>
          <p className="text-xs text-slate-400">Student Money Manager</p>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-slate-200 truncate max-w-[120px]">
              {user.displayName || 'Student'}
            </p>
            {user.isDemo && <p className="text-[10px] text-amber-400 font-medium">Demo Mode</p>}
          </div>

          <button
            onClick={() => void signOut()}
            aria-label="Sign out"
            title="Sign out"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
