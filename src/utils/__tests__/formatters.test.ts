import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  calculateRemainingBudget,
  calculateGoalProgress,
} from '../formatters';

describe('formatters utility', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(0)).toBe('$0');
    expect(formatCurrency(150.5)).toBe('$150.50');
    expect(formatCurrency(1200)).toBe('$1,200');
  });

  it('formats dates properly', () => {
    const formatted = formatDate(new Date('2026-11-22T00:00:00Z'));
    expect(formatted).toContain('2026');
  });

  it('calculates remaining budget correctly', () => {
    expect(calculateRemainingBudget(800, 300)).toBe(500);
    expect(calculateRemainingBudget(500, 600)).toBe(0);
  });

  it('calculates goal progress clamped between 0 and 100', () => {
    expect(calculateGoalProgress(250, 1000)).toBe(25);
    expect(calculateGoalProgress(1200, 1000)).toBe(100);
    expect(calculateGoalProgress(-10, 1000)).toBe(0);
    expect(calculateGoalProgress(50, 0)).toBe(0);
  });
});
