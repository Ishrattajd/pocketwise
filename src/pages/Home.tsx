import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatters';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Receipt,
  Target,
  GraduationCap,
  Briefcase,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { user } = useAuth();

  const monthlyBudget = 850;
  const spentSoFar = 385;
  const remaining = monthlyBudget - spentSoFar;
  const spentPercentage = Math.round((spentSoFar / monthlyBudget) * 100);

  return (
    <div className="space-y-4">
      {/* Welcome & Student Status */}
      <div className="bg-gradient-to-r from-indigo-900/60 to-slate-800/80 border border-indigo-500/20 rounded-2xl p-4">
        <span className="text-[11px] font-semibold tracking-wide text-indigo-400 uppercase">
          Campus Semester Overview
        </span>
        <h2 className="text-lg font-bold text-white mt-0.5">
          Hi, {user?.displayName?.split(' ')[0] || 'Student'}! 👋
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          You are pacing well this month. {100 - spentPercentage}% of your student allowance is
          still available.
        </p>
      </div>

      {/* Monthly Budget Card */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Monthly Student Budget</span>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            On Track
          </span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-black text-white">{formatCurrency(remaining)}</span>
            <span className="text-xs text-slate-400 ml-1.5">left to spend</span>
          </div>
          <span className="text-xs text-slate-400">Total: {formatCurrency(monthlyBudget)}</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${spentPercentage}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[11px] text-slate-400">
          <span>Spent: {formatCurrency(spentSoFar)}</span>
          <span>{spentPercentage}% used</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/expenses"
          className="p-3.5 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 rounded-xl flex flex-col justify-between transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Receipt className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
          </div>
          <div className="mt-3">
            <h3 className="text-xs font-semibold text-slate-200">Daily Expenses</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Track meals & supplies</p>
          </div>
        </Link>

        <Link
          to="/goals"
          className="p-3.5 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 rounded-xl flex flex-col justify-between transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
          </div>
          <div className="mt-3">
            <h3 className="text-xs font-semibold text-slate-200">Savings Goals</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Laptop & textbooks</p>
          </div>
        </Link>

        <Link
          to="/scholarships"
          className="p-3.5 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 rounded-xl flex flex-col justify-between transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
          </div>
          <div className="mt-3">
            <h3 className="text-xs font-semibold text-slate-200">Scholarships</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Matched awards</p>
          </div>
        </Link>

        <Link
          to="/jobs"
          className="p-3.5 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 rounded-xl flex flex-col justify-between transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
          </div>
          <div className="mt-3">
            <h3 className="text-xs font-semibold text-slate-200">Campus Jobs</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Work-study & gigs</p>
          </div>
        </Link>
      </div>

      {/* Student Financial Tip */}
      <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl flex items-start gap-3">
        <TrendingUp className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-semibold text-indigo-200">Student Tip: 50/30/20 Rule</h4>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
            Aim for 50% on essentials (dorm, meals, transit), 30% for fun, and 20% into savings or
            textbook reserve.
          </p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-semibold text-slate-300">Recent Spending</h3>
          <Link to="/expenses" className="text-[11px] text-indigo-400 hover:text-indigo-300">
            View All
          </Link>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold">
                🍱
              </div>
              <div>
                <p className="text-xs font-medium text-slate-200">Campus Dining Hall</p>
                <p className="text-[10px] text-slate-400">Food & Dining • Today</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-200">-$14.50</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold">
                📚
              </div>
              <div>
                <p className="text-xs font-medium text-slate-200">Calculus II Textbook Rental</p>
                <p className="text-[10px] text-slate-400">Education • Yesterday</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-200">-$42.00</span>
          </div>
        </div>
      </div>

      {/* PWA offline banner */}
      <div className="p-2.5 bg-slate-800/30 border border-slate-800 rounded-lg flex items-center gap-2 text-[11px] text-slate-400">
        <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>PocketWise works offline with automatic background sync!</span>
      </div>
    </div>
  );
};

export default Home;
