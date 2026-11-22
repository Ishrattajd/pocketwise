/**
 * Formats a number into standard USD currency string ($xx.xx)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats an ISO date string or Date object to a human-readable format
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

/**
 * Calculates remaining budget
 */
export function calculateRemainingBudget(totalBudget: number, spent: number): number {
  return Math.max(0, totalBudget - spent);
}

/**
 * Calculates percentage progress for savings goals (clamped 0 to 100)
 */
export function calculateGoalProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  const percentage = (current / target) * 100;
  return Math.min(100, Math.max(0, Math.round(percentage)));
}
