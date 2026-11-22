import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  calculateRemainingBudget,
  calculateGoalProgress,
  calculateDaysLeft,
} from '../formatters';

describe('formatters utility', () => {
  it('formats currency correctly in INR-first and other codes', () => {
    expect(formatCurrency(60)).toBe('₹60');
    expect(formatCurrency(8000)).toBe('₹8,000');
    expect(formatCurrency(150.5, 'USD')).toBe('$150.50');
  });

  it('formats dates properly', () => {
    const formatted = formatDate(new Date('2026-11-22T00:00:00Z'));
    expect(formatted).toContain('2026');
  });

  it('calculates remaining budget correctly (positive or overspent)', () => {
    expect(calculateRemainingBudget(8000, 2500)).toBe(5500);
    expect(calculateRemainingBudget(5000, 6000)).toBe(-1000);
  });

  it('calculates goal progress clamped between 0 and 100', () => {
    expect(calculateGoalProgress(28500, 45000)).toBe(63);
    expect(calculateGoalProgress(50000, 45000)).toBe(100);
    expect(calculateGoalProgress(-10, 1000)).toBe(0);
    expect(calculateGoalProgress(50, 0)).toBe(0);
  });

  describe('calculateDaysLeft', () => {
    it('calculates positive days left for future dates', () => {
      const now = new Date();
      const in10Days = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
      const iso = in10Days.toISOString().split('T')[0];
      const daysLeft = calculateDaysLeft(iso);
      expect(daysLeft).toBe(10);
    });

    it('calculates 0 or 1 for today', () => {
      const today = new Date().toISOString().split('T')[0];
      const days = calculateDaysLeft(today);
      expect(days).toBe(0);
    });

    it('calculates negative days for past deadlines', () => {
      const now = new Date();
      const past = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
      const iso = past.toISOString().split('T')[0];
      const daysLeft = calculateDaysLeft(iso);
      expect(daysLeft).toBe(-5);
    });

    it('returns 0 for invalid date strings', () => {
      expect(calculateDaysLeft('not-a-valid-date')).toBe(0);
    });
  });
});
