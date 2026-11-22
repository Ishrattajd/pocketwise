import { describe, it, expect, vi } from 'vitest';
import {
  parseExpense,
  fallbackParseExpense,
  fallbackInsights,
  getInsights,
  checkScholarshipEligibility,
} from '../gemini';
import { ExpenseItem } from '../../hooks/useExpenses';

describe('Gemini and AI Service', () => {
  describe('fallbackParseExpense regex parser', () => {
    it('parses food expense strings', () => {
      const res = fallbackParseExpense('120 chai and samosa');
      expect(res.amount).toBe(120);
      expect(res.category).toBe('Food');
      expect(res.note).toBe('Chai and samosa');
    });

    it('parses transport expenses', () => {
      const res = fallbackParseExpense('50 bus fare');
      expect(res.amount).toBe(50);
      expect(res.category).toBe('Transport');
    });

    it('parses book/academic expenses', () => {
      const res = fallbackParseExpense('450 textbook photocopy');
      expect(res.amount).toBe(450);
      expect(res.category).toBe('Books');
    });

    it('parses rent/hostel expenses', () => {
      const res = fallbackParseExpense('8000 room rent');
      expect(res.amount).toBe(8000);
      expect(res.category).toBe('Rent');
    });

    it('parses fun/entertainment expenses', () => {
      const res = fallbackParseExpense('250 movie tickets');
      expect(res.amount).toBe(250);
      expect(res.category).toBe('Fun');
    });

    it('defaults to Other when no keyword matches', () => {
      const res = fallbackParseExpense('150 generic recharge');
      expect(res.amount).toBe(150);
      expect(res.category).toBe('Other');
    });

    it('handles currency symbol prefix gracefully', () => {
      const res = fallbackParseExpense('₹80 coffee');
      expect(res.amount).toBe(80);
      expect(res.category).toBe('Food');
    });

    it('falls back to 1 minimum for valid schema if no digits found', () => {
      const res = fallbackParseExpense('just some tea');
      expect(res.amount).toBe(1);
      expect(res.category).toBe('Food');
    });
  });

  describe('fallbackInsights rule-based advisor', () => {
    it('returns default starter tips for empty expenses list', () => {
      const tips = fallbackInsights([]);
      expect(tips).toHaveLength(3);
      expect(tips.some((t) => t.includes('budget') || t.includes('canteen'))).toBe(true);
    });

    it('generates category-informed tips based on recent expenses', () => {
      const expenses: ExpenseItem[] = [
        { id: '1', amount: 500, category: 'Food', note: 'Swiggy', date: '2026-11-20' },
        { id: '2', amount: 300, category: 'Transport', note: 'Uber', date: '2026-11-21' },
      ];
      const tips = fallbackInsights(expenses);
      expect(tips).toHaveLength(3);
      expect(tips.some((t) => t.includes('Food') || t.includes('canteen'))).toBe(true);
    });
  });

  describe('demo mode isolation', () => {
    it('parseExpense runs in demo mode without throwing or requiring live Gemini AI', async () => {
      const parsed = await parseExpense('120 chai and samosa', true);
      expect(parsed.amount).toBe(120);
      expect(parsed.category).toBe('Food');
    });

    it('getInsights runs in demo mode using fallback insights', async () => {
      const tips = await getInsights([], 8000, true);
      expect(tips).toHaveLength(3);
    });

    it('checkScholarshipEligibility returns demo guidance without error', async () => {
      const result = await checkScholarshipEligibility(
        'National Scholarship Portal',
        '2nd year CS student',
        true
      );
      expect(result).toContain('National Scholarship Portal');
    });
  });

  describe('graceful error fallback when AI service is unavailable', () => {
    it('falls back to regex parser when dynamic import fails', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const res = await parseExpense('75 bus pass', false);
      expect(res.amount).toBe(75);
      expect(res.category).toBe('Transport');
      warnSpy.mockRestore();
    });
  });
});
