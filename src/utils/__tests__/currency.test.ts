import { describe, it, expect } from 'vitest';
import { formatMoney, getCurrencyLocale, getCurrencySymbol } from '../currency';

describe('currency utility', () => {
  it('formats INR using en-IN locale by default', () => {
    expect(formatMoney(60)).toBe('₹60');
    expect(formatMoney(500)).toBe('₹500');
    expect(formatMoney(8000)).toBe('₹8,000');
    expect(formatMoney(45000)).toBe('₹45,000');
    expect(formatMoney(100000)).toBe('₹1,00,000');
    expect(formatMoney(60.5)).toBe('₹60.50');
  });

  it('formats other supported currencies correctly', () => {
    expect(formatMoney(150, 'USD')).toBe('$150');
    expect(formatMoney(150.5, 'USD')).toBe('$150.50');
    expect(formatMoney(100, 'EUR')).toContain('100');
    expect(formatMoney(100, 'GBP')).toContain('100');
  });

  it('resolves correct symbols and locales', () => {
    expect(getCurrencySymbol('INR')).toBe('₹');
    expect(getCurrencySymbol('USD')).toBe('$');
    expect(getCurrencyLocale('INR')).toBe('en-IN');
    expect(getCurrencyLocale('USD')).toBe('en-US');
  });
});
