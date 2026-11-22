import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCurrency } from '../hooks/useCurrency';
import { useExpenses } from '../hooks/useExpenses';
import { getInsights } from '../services/gemini';
import { Link } from 'react-router-dom';
import {
  Receipt,
  Target,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  ArrowUpRight,
  PlusCircle,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  Utensils,
  BookOpen,
  Bus,
  Home as HomeIcon,
  Film,
  Sparkles,
} from 'lucide-react';
import { EmptyExpensesIllustration } from '../components/Illustrations';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const { format, symbol } = useCurrency();
  const {
    expenses,
    goals,
    monthlyBudget,
    updateMonthlyBudget,
    contributeGoal,
    loading: expensesLoading,
  } = useExpenses();

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(monthlyBudget > 0 ? String(monthlyBudget) : '');

  // Keep input synced with actual budget
  useEffect(() => {
    if (monthlyBudget > 0 && !isEditingBudget) {
      setBudgetInput(String(monthlyBudget));
    }
  }, [monthlyBudget, isEditingBudget]);

  // Gemini insights state
  const [tips, setTips] = useState<string[]>([]);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [tipsError, setTipsError] = useState<string | null>(null);

  // Load insights
  const fetchTips = async () => {
    setTipsLoading(true);
    setTipsError(null);
    try {
      const result = await getInsights(expenses, monthlyBudget, user?.isDemo);
      setTips(result);
    } catch {
      setTipsError('Unable to refresh tips right now. Showing default student tips.');
    } finally {
      setTipsLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses.length, monthlyBudget]);

  // Budget calculations
  const spentSoFar = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = monthlyBudget - spentSoFar;
  const isOverspent = monthlyBudget > 0 && remaining < 0;
  const spentPercentage = monthlyBudget > 0 ? Math.min(100, Math.round((spentSoFar / monthlyBudget) * 100)) : 0;

  // Category breakdown calculation
  const categoryTotals: Record<string, number> = {
    Food: 0,
    Transport: 0,
    Books: 0,
    Rent: 0,
    Fun: 0,
    Other: 0,
  };
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const categories = [
    { name: 'Food', amount: categoryTotals.Food, icon: Utensils, color: '#0F766E' },
    { name: 'Transport', amount: categoryTotals.Transport, icon: Bus, color: '#0F766E' },
    { name: 'Books', amount: categoryTotals.Books, icon: BookOpen, color: '#0F766E' },
    { name: 'Rent', amount: categoryTotals.Rent, icon: HomeIcon, color: '#0F766E' },
    { name: 'Fun', amount: categoryTotals.Fun, icon: Film, color: '#F59E0B' },
    { name: 'Other', amount: categoryTotals.Other, icon: Receipt, color: '#64748B' },
  ].filter((c) => c.amount > 0 || expenses.length === 0);

  // Weekly Strip calculation (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayTotal = expenses
      .filter((e) => e.date === dateStr || (i === 6 && e.date.toLowerCase() === 'today'))
      .reduce((sum, e) => sum + e.amount, 0);
    return { dateStr, dayName, dayTotal };
  });

  const maxDailySpend = Math.max(...last7Days.map((d) => d.dayTotal), 100);

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val >= 0) {
      await updateMonthlyBudget(val);
      setIsEditingBudget(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Welcome Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-[#0F766E] uppercase">
            Semester Overview
          </span>
          <h2 className="font-heading text-lg font-bold text-[#1E293B]">
            Hello, {user?.displayName?.split(' ')[0] || 'Student'}
          </h2>
        </div>
        {user?.isDemo && (
          <span className="text-[10px] font-semibold text-[#F59E0B] bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            Demo Preview
          </span>
        )}
      </div>

      {/* Large "Left to spend this month" Hero Card */}
      <div
        className={`bg-white rounded-3xl p-5 border transition-all shadow-sm ${
          isOverspent ? 'border-[#F87171] ring-1 ring-[#F87171]/20' : 'border-[#E5E0D8]'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#64748B]">Left to spend this month</span>
          {monthlyBudget > 0 ? (
            isOverspent ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#F87171] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                Over Budget
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0F766E] bg-teal-50 border border-[#0F766E]/20 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                On Track
              </span>
            )
          ) : (
            <span className="text-xs font-medium text-[#F59E0B] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              Setup Needed
            </span>
          )}
        </div>

        {monthlyBudget > 0 ? (
          <>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span
                  className={`font-heading text-3xl font-extrabold tracking-tight ${
                    isOverspent ? 'text-[#F87171]' : 'text-[#0F766E]'
                  }`}
                >
                  {format(Math.max(0, remaining))}
                </span>
                {isOverspent && (
                  <p className="text-xs font-semibold text-[#F87171] mt-0.5">
                    Exceeded budget by {format(Math.abs(remaining))}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsEditingBudget(true)}
                className="text-xs font-semibold text-[#0F766E] hover:underline min-h-[44px] flex items-center focus:ring-2 focus:ring-[#0F766E] rounded-lg px-2"
              >
                Edit Budget
              </button>
            </div>

            {/* Progress Bar (Coral only for overspending) */}
            <div className="mt-4 w-full bg-[#FAF7F2] border border-[#E5E0D8] h-3 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverspent ? 'bg-[#F87171]' : 'bg-[#0F766E]'
                }`}
                style={{ width: `${spentPercentage}%` }}
              />
            </div>

            <div className="mt-2.5 flex justify-between text-xs text-[#64748B]">
              <span>Spent: {format(spentSoFar)}</span>
              <span>Budget: {format(monthlyBudget)}</span>
            </div>
          </>
        ) : (
          <div className="mt-3 text-center py-3">
            <p className="text-xs text-[#64748B] mb-3">
              Set your monthly student allowance to monitor mess, transit, and textbook spends.
            </p>
            <button
              onClick={() => setIsEditingBudget(true)}
              className="min-h-[44px] inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm focus:ring-2 focus:ring-[#0F766E]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Set Monthly Budget</span>
            </button>
          </div>
        )}

        {/* Inline Monthly Budget Editor */}
        {isEditingBudget && (
          <form onSubmit={handleSaveBudget} className="mt-4 pt-4 border-t border-[#E5E0D8] space-y-3">
            <label htmlFor="home-budget-input" className="block text-xs font-semibold text-[#1E293B]">
              Monthly Student Budget ({symbol})
            </label>
            <div className="flex gap-2">
              <input
                id="home-budget-input"
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 8000"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="min-h-[44px] flex-1 bg-white border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                required
              />
              <button
                type="submit"
                className="min-h-[44px] px-4 py-2 bg-[#0F766E] text-white text-xs font-semibold rounded-xl hover:bg-[#115E59]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingBudget(false)}
                className="min-h-[44px] px-3 py-2 bg-[#FAF7F2] text-[#64748B] text-xs font-medium rounded-xl hover:text-[#1E293B]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Weekly Strip: Spending past 7 days */}
      <div className="bg-white border border-[#E5E0D8] rounded-3xl p-4 shadow-sm" aria-label="Weekly spending strip">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-xs font-bold text-[#1E293B]">Past 7 Days</h3>
          <span className="text-[11px] text-[#64748B]">Daily spending strip</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5 items-end h-28 pt-2">
          {last7Days.map((d, index) => {
            const heightPercent = Math.max(8, Math.round((d.dayTotal / maxDailySpend) * 100));
            const isToday = index === 6;
            return (
              <div key={d.dateStr} className="flex flex-col items-center h-full justify-end group">
                <div
                  className="w-full bg-[#FAF7F2] rounded-lg flex items-end justify-center p-1 relative h-20"
                  title={`${d.dayName}: ${format(d.dayTotal)}`}
                >
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-md transition-all duration-300 ${
                      isToday ? 'bg-[#0F766E]' : 'bg-[#0F766E]/40 group-hover:bg-[#0F766E]'
                    }`}
                  />
                </div>
                <span className={`text-[10px] mt-1.5 font-medium ${isToday ? 'font-bold text-[#0F766E]' : 'text-[#64748B]'}`}>
                  {d.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white border border-[#E5E0D8] rounded-3xl p-4 shadow-sm" aria-label="Category spending breakdown">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-xs font-bold text-[#1E293B]">Category Breakdown</h3>
          <span className="text-[11px] text-[#64748B]">Total: {format(spentSoFar)}</span>
        </div>
        {spentSoFar > 0 ? (
          <div className="space-y-2.5">
            {categories.map((c) => {
              const Icon = c.icon;
              const pct = Math.round((c.amount / (spentSoFar || 1)) * 100);
              return (
                <div key={c.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-[#0F766E]" />
                      <span className="font-semibold text-[#1E293B]">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#64748B]">{pct}%</span>
                      <span className="font-bold text-[#1E293B]">{format(c.amount)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0F766E] rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-[#64748B] text-center py-2">
            Log expenses to see your categories visualised here.
          </p>
        )}
      </div>

      {/* AI Insights Card (with Refresh Button & aria-live) */}
      <div className="p-4 bg-white border border-[#E5E0D8] rounded-3xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-[#0F766E]">
              <Sparkles className="w-4 h-4 text-[#0F766E]" />
            </div>
            <div>
              <h4 className="font-heading text-xs font-bold text-[#1E293B]">AI Student Insights</h4>
              <p className="text-[10px] text-[#64748B]">Personalized tips via Gemini</p>
            </div>
          </div>
          <button
            onClick={fetchTips}
            disabled={tipsLoading}
            aria-label="Refresh tips"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] text-[#0F766E] hover:border-[#0F766E] transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${tipsLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div aria-live="polite" className="space-y-2">
          {tipsLoading ? (
            <p className="text-xs text-[#64748B] animate-pulse">Analyzing recent spending patterns...</p>
          ) : tipsError ? (
            <p className="text-xs text-[#F59E0B]">{tipsError}</p>
          ) : (
            tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#1E293B]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] mt-1.5 shrink-0" />
                <p className="leading-relaxed">{tip}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/expenses"
          className="min-h-[44px] p-4 bg-white hover:bg-slate-50 border border-[#E5E0D8] rounded-2xl flex flex-col justify-between transition group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#0F766E]/10 text-[#0F766E]">
              <Receipt className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#64748B] group-hover:text-[#1E293B]" />
          </div>
          <div className="mt-3">
            <h3 className="font-heading text-xs font-bold text-[#1E293B]">Daily Expenses</h3>
            <p className="text-[11px] text-[#64748B] mt-0.5">Quick add with AI</p>
          </div>
        </Link>

        <Link
          to="/goals"
          className="min-h-[44px] p-4 bg-white hover:bg-slate-50 border border-[#E5E0D8] rounded-2xl flex flex-col justify-between transition group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
              <Target className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#64748B] group-hover:text-[#1E293B]" />
          </div>
          <div className="mt-3">
            <h3 className="font-heading text-xs font-bold text-[#1E293B]">Savings Goals</h3>
            <p className="text-[11px] text-[#64748B] mt-0.5">Laptop & exam funds</p>
          </div>
        </Link>

        <Link
          to="/scholarships"
          className="min-h-[44px] p-4 bg-white hover:bg-slate-50 border border-[#E5E0D8] rounded-2xl flex flex-col justify-between transition group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#0F766E]/10 text-[#0F766E]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#64748B] group-hover:text-[#1E293B]" />
          </div>
          <div className="mt-3">
            <h3 className="font-heading text-xs font-bold text-[#1E293B]">Scholarships</h3>
            <p className="text-[11px] text-[#64748B] mt-0.5">Eligibility advisor</p>
          </div>
        </Link>

        <Link
          to="/jobs"
          className="min-h-[44px] p-4 bg-white hover:bg-slate-50 border border-[#E5E0D8] rounded-2xl flex flex-col justify-between transition group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
              <Briefcase className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#64748B] group-hover:text-[#1E293B]" />
          </div>
          <div className="mt-3">
            <h3 className="font-heading text-xs font-bold text-[#1E293B]">Campus Jobs</h3>
            <p className="text-[11px] text-[#64748B] mt-0.5">Bookmark roles</p>
          </div>
        </Link>
      </div>

      {/* Savings Goals Highlights */}
      {goals.length > 0 && (
        <div className="bg-white border border-[#E5E0D8] rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xs font-bold text-[#1E293B]">Active Savings Goals</h3>
            <Link to="/goals" className="text-[11px] font-semibold text-[#0F766E] hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-2">
            {goals.slice(0, 2).map((g) => {
              const progress = Math.min(100, Math.round((g.currentAmount / (g.targetAmount || 1)) * 100));
              return (
                <div key={g.id} className="p-3 bg-[#FAF7F2] border border-[#E5E0D8] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1E293B]">{g.title}</span>
                    <span className="text-[#0F766E] font-bold">{progress}%</span>
                  </div>
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0F766E] rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>{format(g.currentAmount)} of {format(g.targetAmount)}</span>
                    <button
                      onClick={() => contributeGoal(g.id, 500)}
                      className="min-h-[44px] text-xs font-semibold text-[#0F766E] hover:underline px-2"
                    >
                      + {format(500)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-heading text-xs font-bold text-[#1E293B]">Recent Spending</h3>
          <Link
            to="/expenses"
            className="text-[11px] font-semibold text-[#0F766E] hover:underline min-h-[44px] flex items-center"
          >
            View All
          </Link>
        </div>

        {expensesLoading ? (
          <p className="text-xs text-[#64748B] text-center py-4">Syncing expenses...</p>
        ) : expenses.length > 0 ? (
          <div className="space-y-2">
            {expenses.slice(0, 3).map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3.5 bg-white border border-[#E5E0D8] rounded-2xl shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] flex items-center justify-center text-[#0F766E]">
                    {expense.category === 'Food' ? (
                      <Utensils className="w-4 h-4" />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1E293B]">{expense.note || expense.category}</p>
                    <p className="text-[10px] text-[#64748B]">
                      {expense.category} • {expense.date}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#1E293B]">-{format(expense.amount)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 text-center shadow-sm">
            <EmptyExpensesIllustration className="w-28 h-20 mx-auto" />
            <p className="mt-2 text-xs font-semibold text-[#1E293B]">No expenses recorded yet</p>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Start fresh by logging your canteen meals, auto fares, and textbooks.
            </p>
            <Link
              to="/expenses"
              className="mt-3 min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 bg-[#0F766E] text-white text-xs font-semibold rounded-xl"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add First Expense</span>
            </Link>
          </div>
        )}
      </div>

      {/* Student Tip Banner */}
      <div className="p-3 bg-white border border-[#E5E0D8] rounded-2xl flex items-center gap-2.5 text-[11px] text-[#64748B] shadow-sm">
        <Lightbulb className="w-4 h-4 text-[#F59E0B] shrink-0" />
        <span>Rule of thumb: 50% campus needs, 30% outings, 20% savings.</span>
      </div>
    </div>
  );
};

export default Home;
