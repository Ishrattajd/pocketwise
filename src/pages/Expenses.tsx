import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { Plus, Coffee, BookOpen, Home as HomeIcon, Bus, Film } from 'lucide-react';

interface Expense {
  id: string;
  name: string;
  category: 'Food' | 'Textbooks' | 'Housing' | 'Transit' | 'Fun';
  amount: number;
  date: string;
}

const initialExpenses: Expense[] = [
  { id: '1', name: 'Campus Coffee & Bagel', category: 'Food', amount: 6.75, date: 'Today' },
  { id: '2', name: 'Physics Lab Manual', category: 'Textbooks', amount: 35.0, date: 'Nov 20' },
  { id: '3', name: 'Dorm Laundry Card Top-up', category: 'Housing', amount: 20.0, date: 'Nov 18' },
  { id: '4', name: 'Monthly Student Subway Pass', category: 'Transit', amount: 45.0, date: 'Nov 15' },
  { id: '5', name: 'Student Film Society Ticket', category: 'Fun', amount: 8.5, date: 'Nov 12' },
];

export const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [filter, setFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newAmount, setNewAmount] = useState<string>('');
  const [newCategory, setNewCategory] = useState<Expense['category']>('Food');

  const filteredExpenses =
    filter === 'All' ? expenses : expenses.filter((e) => e.category === filter);

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const getCategoryIcon = (category: Expense['category']) => {
    switch (category) {
      case 'Food':
        return <Coffee className="w-4 h-4 text-amber-400" />;
      case 'Textbooks':
        return <BookOpen className="w-4 h-4 text-indigo-400" />;
      case 'Housing':
        return <HomeIcon className="w-4 h-4 text-emerald-400" />;
      case 'Transit':
        return <Bus className="w-4 h-4 text-sky-400" />;
      case 'Fun':
        return <Film className="w-4 h-4 text-rose-400" />;
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newAmount);
    if (!newTitle.trim() || isNaN(amountNum) || amountNum <= 0) return;

    const newItem: Expense = {
      id: Date.now().toString(),
      name: newTitle.trim(),
      amount: amountNum,
      category: newCategory,
      date: 'Just now',
    };

    setExpenses([newItem, ...expenses]);
    setNewTitle('');
    setNewAmount('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header & Total Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Student Expenses</h2>
          <p className="text-xs text-slate-400">Track and categorize every campus dollar</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg shadow-indigo-600/20 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Summary Box */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-medium">Filtered Total</span>
          <p className="text-2xl font-black text-white mt-0.5">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Entries</span>
          <p className="text-lg font-bold text-indigo-400">{filteredExpenses.length}</p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {['All', 'Food', 'Textbooks', 'Housing', 'Transit', 'Fun'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
              filter === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expense List */}
      <div className="space-y-2">
        {filteredExpenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-3.5 bg-slate-800/40 border border-slate-800 rounded-xl hover:border-slate-700 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                {getCategoryIcon(expense.category)}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">{expense.name}</h4>
                <p className="text-[10px] text-slate-400">
                  {expense.category} • {expense.date}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-400">-{formatCurrency(expense.amount)}</span>
          </div>
        ))}

        {filteredExpenses.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-500">
            No expenses found for category "{filter}".
          </div>
        )}
      </div>

      {/* Quick Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-3">Add Student Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400">Title / Place</label>
                <input
                  type="text"
                  placeholder="e.g. Dining Hall Meal, Used Book"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Expense['category'])}
                  className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Food">Food & Dining</option>
                  <option value="Textbooks">Textbooks & School</option>
                  <option value="Housing">Housing & Utilities</option>
                  <option value="Transit">Campus Transit</option>
                  <option value="Fun">Entertainment</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
