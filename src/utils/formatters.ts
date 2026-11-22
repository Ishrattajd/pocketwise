import { formatMoney } from './currency';

/**
 * Formats a number into currency string. Defaults to INR (₹) using en-IN locale.
 */
export function formatCurrency(amount: number, code: string = 'INR'): string {
  return formatMoney(amount, code);
}

export { formatMoney };

/**
 * Formats an ISO date string or Date object to a human-readable format
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

/**
 * Calculates remaining budget
 */
export function calculateRemainingBudget(totalBudget: number, spent: number): number {
  return totalBudget - spent;
}

/**
 * Calculates percentage progress for savings goals (clamped 0 to 100)
 */
export function calculateGoalProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  const percentage = (current / target) * 100;
  return Math.min(100, Math.max(0, Math.round(percentage)));
}

/**
 * Calculates the number of days left until a deadline date.
 */
export function calculateDaysLeft(deadline: string): number {
  const target = new Date(deadline);
  if (isNaN(target.getTime())) return 0;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
