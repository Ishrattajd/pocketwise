import { describe, it, expect } from 'vitest';
import { ExpenseSchema, CategoryEnum, ScholarshipSchema } from '../schemas';

describe('Zod Validation Schemas', () => {
  describe('ExpenseSchema', () => {
    it('validates a valid expense successfully', () => {
      const valid = {
        amount: 120,
        category: 'Food',
        note: 'Canteen chai and samosa',
        date: '2026-11-22',
      };
      const result = ExpenseSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.amount).toBe(120);
        expect(result.data.category).toBe('Food');
        expect(result.data.note).toBe('Canteen chai and samosa');
      }
    });

    it('allows valid expenses for each allowed category', () => {
      CategoryEnum.options.forEach((cat) => {
        const res = ExpenseSchema.safeParse({
          amount: 50,
          category: cat,
          note: 'Sample expense',
          date: '2026-11-22',
        });
        expect(res.success).toBe(true);
      });
    });

    it('rejects non-positive amount (zero or negative)', () => {
      const zero = ExpenseSchema.safeParse({
        amount: 0,
        category: 'Food',
        note: 'Zero item',
        date: '2026-11-22',
      });
      expect(zero.success).toBe(false);

      const negative = ExpenseSchema.safeParse({
        amount: -50,
        category: 'Food',
        note: 'Negative item',
        date: '2026-11-22',
      });
      expect(negative.success).toBe(false);
    });

    it('rejects amounts exceeding 10,000,000', () => {
      const tooLarge = ExpenseSchema.safeParse({
        amount: 10000000,
        category: 'Other',
        note: 'Too big',
        date: '2026-11-22',
      });
      expect(tooLarge.success).toBe(false);
    });

    it('rejects invalid category', () => {
      const invalidCat = ExpenseSchema.safeParse({
        amount: 200,
        category: 'Entertainment', // Not in allowed enum
        note: 'Invalid category',
        date: '2026-11-22',
      });
      expect(invalidCat.success).toBe(false);
    });

    it('rejects notes longer than 200 characters', () => {
      const longNote = ExpenseSchema.safeParse({
        amount: 100,
        category: 'Other',
        note: 'A'.repeat(201),
        date: '2026-11-22',
      });
      expect(longNote.success).toBe(false);
    });

    it('requires valid date string', () => {
      const missingDate = ExpenseSchema.safeParse({
        amount: 100,
        category: 'Other',
        note: 'Missing date',
        date: '',
      });
      expect(missingDate.success).toBe(false);
    });
  });

  describe('ScholarshipSchema', () => {
    it('validates a correct scholarship object', () => {
      const result = ScholarshipSchema.safeParse({
        name: 'National Scholarship Portal Post-Matric',
        amount: 25000,
        deadline: '2026-12-31',
        link: 'https://scholarships.gov.in',
        provider: 'Ministry of Minority Affairs',
        tag: 'Government',
      });
      expect(result.success).toBe(true);
    });

    it('rejects scholarship with non-positive amount', () => {
      const result = ScholarshipSchema.safeParse({
        name: 'Test Grant',
        amount: 0,
        deadline: '2026-12-31',
      });
      expect(result.success).toBe(false);
    });
  });
});
