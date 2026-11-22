import React, { useState } from 'react';
import { ExpenseSchema, CategoryEnum, Category } from '../utils/schemas';

export interface ExpenseFormData {
  amount: number;
  category: Category;
  note: string;
  date: string;
}

export interface ExpenseFormProps {
  initialValues?: {
    amount?: number | string;
    category?: Category;
    note?: string;
    date?: string;
  };
  onSubmit: (data: ExpenseFormData) => Promise<void> | void;
  onCancel: () => void;
  isEditing?: boolean;
  currencySymbol?: string;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isEditing = false,
  currencySymbol = '₹',
}) => {
  const [amount, setAmount] = useState<string>(
    initialValues?.amount !== undefined ? String(initialValues.amount) : ''
  );
  const [category, setCategory] = useState<Category>(initialValues?.category || 'Food');
  const [note, setNote] = useState<string>(initialValues?.note || '');
  const [date, setDate] = useState<string>(
    initialValues?.date || new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    const result = ExpenseSchema.safeParse({
      amount: parsedAmount,
      category,
      note: note.trim(),
      date,
    });

    if (!result.success) {
      const firstIssue = result.error.issues[0]?.message || 'Invalid expense data';
      setError(firstIssue);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(result.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label="Expense Form">
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="p-2.5 bg-red-50 border border-[#F87171]/40 rounded-xl text-xs text-[#DC2626] font-medium"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="expense-amount-input" className="block text-xs font-semibold text-[#1E293B]">
          Amount ({currencySymbol}) *
        </label>
        <input
          id="expense-amount-input"
          type="number"
          step="any"
          placeholder="e.g. 120"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="min-h-[44px] mt-1 w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="expense-category-select" className="block text-xs font-semibold text-[#1E293B]">
          Category *
        </label>
        <select
          id="expense-category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="min-h-[44px] mt-1 w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
        >
          {CategoryEnum.options.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="expense-note-input" className="block text-xs font-semibold text-[#1E293B]">
          Note (max 200 chars)
        </label>
        <input
          id="expense-note-input"
          type="text"
          maxLength={200}
          placeholder="e.g. Canteen lunch, Library Xerox"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[44px] mt-1 w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="expense-date-input" className="block text-xs font-semibold text-[#1E293B]">
          Date *
        </label>
        <input
          id="expense-date-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="min-h-[44px] mt-1 w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
          required
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="min-h-[44px] flex-1 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-slate-100 text-xs font-semibold text-[#64748B] transition focus:ring-2 focus:ring-[#0F766E]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-[44px] flex-1 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-xs font-semibold text-white shadow-sm transition focus:ring-2 focus:ring-[#0F766E] disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
};
