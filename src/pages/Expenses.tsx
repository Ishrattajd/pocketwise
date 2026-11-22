import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCurrency } from '../hooks/useCurrency';
import { useExpenses, ExpenseItem } from '../hooks/useExpenses';
import { parseExpense } from '../services/gemini';
import { Category } from '../utils/schemas';
import { ExpenseForm, ExpenseFormData } from '../components/ExpenseForm';
import {
  Plus,
  BookOpen,
  Home as HomeIcon,
  Bus,
  Film,
  Receipt,
  Utensils,
  Sparkles,
  Edit2,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { EmptyExpensesIllustration } from '../components/Illustrations';

export const Expenses: React.FC = () => {
  const { user } = useAuth();
  const { format, symbol } = useCurrency();
  const { expenses, addExpense, updateExpense, deleteExpense, loading } = useExpenses();

  const [filter, setFilter] = useState<string>('All');

  // Quick Add AI State
  const [quickInput, setQuickInput] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<{
    amount: number;
    category: Category;
    note: string;
  } | null>(null);
  const [quickError, setQuickError] = useState<string | null>(null);

  // Manual Add / Edit Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);

  const filteredExpenses =
    filter === 'All' ? expenses : expenses.filter((e) => e.category === filter);

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case 'Food':
        return <Utensils className="w-4 h-4 text-[#0F766E]" />;
      case 'Transport':
        return <Bus className="w-4 h-4 text-[#0F766E]" />;
      case 'Books':
        return <BookOpen className="w-4 h-4 text-[#0F766E]" />;
      case 'Rent':
        return <HomeIcon className="w-4 h-4 text-[#0F766E]" />;
      case 'Fun':
        return <Film className="w-4 h-4 text-[#F59E0B]" />;
      default:
        return <Receipt className="w-4 h-4 text-[#64748B]" />;
    }
  };

  // Quick Add with Gemini
  const handleQuickParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim() || quickLoading) return;

    setQuickLoading(true);
    setQuickError(null);
    setParsedPreview(null);

    try {
      const parsed = await parseExpense(quickInput, user?.isDemo);
      setParsedPreview(parsed);
    } catch {
      setQuickError('Could not parse expense string. Please try manual entry.');
    } finally {
      setQuickLoading(false);
    }
  };

  const handleConfirmQuickAdd = async () => {
    if (!parsedPreview) return;
    try {
      await addExpense({
        amount: parsedPreview.amount,
        category: parsedPreview.category,
        note: parsedPreview.note,
        date: new Date().toISOString().split('T')[0],
      });
      setParsedPreview(null);
      setQuickInput('');
    } catch (err: unknown) {
      setQuickError(err instanceof Error ? err.message : 'Failed to save expense');
    }
  };

  // Manual Add / Edit
  const openAddModal = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const openEditModal = (item: ExpenseItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSaveForm = async (data: ExpenseFormData) => {
    if (editingItem) {
      await updateExpense(editingItem.id, data);
    } else {
      await addExpense(data);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#1E293B]">Daily Expenses</h2>
          <p className="text-xs text-[#64748B]">Real-time campus spending tracker</p>
        </div>
        <button
          onClick={openAddModal}
          aria-label="Add new expense manually"
          className="min-h-[44px] flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition focus:ring-2 focus:ring-[#0F766E]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Spend</span>
        </button>
      </div>

      {/* AI Quick-Add Box */}
      <div className="bg-white border border-[#E5E0D8] rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-50 text-[#0F766E]">
            <Sparkles className="w-4 h-4 text-[#0F766E]" />
          </div>
          <div>
            <h3 className="font-heading text-xs font-bold text-[#1E293B]">Quick Add with AI</h3>
            <p className="text-[10px] text-[#64748B]">Type naturally like "120 chai and samosa" or "50 bus"</p>
          </div>
        </div>

        <form onSubmit={handleQuickParse} className="space-y-2">
          <label htmlFor="ai-quick-input" className="block text-xs font-semibold text-[#1E293B]">
            Describe expense
          </label>
          <div className="flex gap-2">
            <input
              id="ai-quick-input"
              type="text"
              placeholder='e.g. "120 chai and samosa"'
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              disabled={quickLoading}
              className="min-h-[44px] flex-1 bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#1E293B] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
            />
            <button
              type="submit"
              disabled={quickLoading || !quickInput.trim()}
              className="min-h-[44px] px-4 py-2 bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
            >
              {quickLoading ? (
                <span className="animate-spin text-xs">...</span>
              ) : (
                <span>Parse</span>
              )}
            </button>
          </div>
        </form>

        <div aria-live="polite">
          {quickLoading && (
            <p className="text-[11px] text-[#64748B] animate-pulse">Extracting amount and category with Gemini...</p>
          )}

          {quickError && (
            <p className="text-[11px] text-[#F87171]">{quickError}</p>
          )}

          {parsedPreview && (
            <div className="p-3 bg-teal-50 border border-[#0F766E]/20 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#0F766E]">
                  Confirm: {format(parsedPreview.amount)} ({parsedPreview.category})
                </p>
                <p className="text-[11px] text-[#1E293B]">Note: {parsedPreview.note}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleConfirmQuickAdd}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-[#0F766E] text-white rounded-xl px-3 text-xs font-semibold hover:bg-[#115E59]"
                  aria-label="Confirm and save parsed expense"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setParsedPreview(null)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-white border border-[#E5E0D8] text-[#64748B] rounded-xl px-2.5 text-xs hover:text-[#1E293B]"
                  aria-label="Dismiss parsed preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-white border border-[#E5E0D8] rounded-3xl p-4 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-[#64748B] font-medium">Filtered Total</span>
          <p className="font-heading text-2xl font-bold text-[#1E293B] mt-0.5">{format(totalSpent)}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-[#64748B]">Entries</span>
          <p className="font-heading text-lg font-bold text-[#0F766E]">{filteredExpenses.length}</p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {['All', 'Food', 'Transport', 'Books', 'Rent', 'Fun', 'Other'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl font-semibold transition-all shrink-0 border ${
              filter === cat
                ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm'
                : 'bg-white text-[#64748B] border-[#E5E0D8] hover:text-[#1E293B]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expenses List */}
      <div className="space-y-2">
        {loading ? (
          <p className="text-xs text-[#64748B] text-center py-6 animate-pulse">Syncing expenses...</p>
        ) : filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3.5 bg-white border border-[#E5E0D8] rounded-2xl shadow-sm hover:border-[#0F766E]/40 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] flex items-center justify-center">
                  {getCategoryIcon(expense.category)}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1E293B]">{expense.note || expense.category}</h4>
                  <p className="text-[10px] text-[#64748B]">
                    {expense.category} • {expense.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1E293B]">-{format(expense.amount)}</span>
                <button
                  onClick={() => openEditModal(expense)}
                  aria-label={`Edit ${expense.note || expense.category}`}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#64748B] hover:text-[#0F766E] p-1.5 rounded-lg"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  aria-label={`Delete ${expense.note || expense.category}`}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#64748B] hover:text-[#F87171] p-1.5 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-8 text-center shadow-sm">
            <EmptyExpensesIllustration className="w-32 h-24 mx-auto" />
            <p className="mt-3 text-xs font-bold text-[#1E293B]">No expenses recorded yet</p>
            <p className="text-[11px] text-[#64748B] mt-1 max-w-xs mx-auto">
              {filter === 'All'
                ? 'Start fresh by logging your canteen meals, auto fares, and college stationery.'
                : `No expenses found in category "${filter}".`}
            </p>
            <button
              onClick={openAddModal}
              className="mt-4 min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F766E] text-white text-xs font-semibold rounded-xl hover:bg-[#115E59]"
            >
              <Plus className="w-4 h-4" />
              <span>Log First Expense</span>
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-[#E5E0D8] rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading text-sm font-bold text-[#1E293B]">
                {editingItem ? 'Edit Campus Expense' : 'Add Campus Expense'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#64748B] hover:text-[#1E293B]"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ExpenseForm
              initialValues={
                editingItem
                  ? {
                      amount: editingItem.amount,
                      category: editingItem.category,
                      note: editingItem.note,
                      date: editingItem.date,
                    }
                  : undefined
              }
              isEditing={!!editingItem}
              currencySymbol={symbol}
              onSubmit={handleSaveForm}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
