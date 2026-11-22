import { z } from 'zod';

export const CategoryEnum = z.enum([
  'Food',
  'Transport',
  'Books',
  'Rent',
  'Fun',
  'Other',
]);

export type Category = z.infer<typeof CategoryEnum>;

export const ExpenseSchema = z.object({
  id: z.string().optional(),
  amount: z
    .number()
    .positive('Amount must be greater than 0')
    .lt(10000000, 'Amount must be less than 10,000,000'),
  category: CategoryEnum,
  note: z
    .string()
    .max(200, 'Note must not exceed 200 characters')
    .default(''),
  date: z.string().min(1, 'Date is required'),
});

export type ExpenseInput = z.infer<typeof ExpenseSchema>;

export const ParsedExpenseSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be greater than 0')
    .lt(10000000, 'Amount must be less than 10,000,000'),
  category: CategoryEnum,
  note: z.string().max(200).default(''),
});

export type ParsedExpense = z.infer<typeof ParsedExpenseSchema>;

export const SavingsGoalSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(1, 'Goal title is required')
    .max(100, 'Goal title must not exceed 100 characters'),
  targetAmount: z
    .number()
    .positive('Target amount must be greater than 0')
    .lt(10000000, 'Target amount must be less than 10,000,000'),
  currentAmount: z
    .number()
    .min(0, 'Current amount cannot be negative')
    .default(0),
  deadline: z.string().min(1, 'Target deadline is required'),
  category: z.string().default('Savings'),
});

export type SavingsGoalInput = z.infer<typeof SavingsGoalSchema>;

export const ScholarshipSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Scholarship name is required').max(150),
  amount: z
    .number()
    .positive('Award amount must be greater than 0')
    .lt(10000000, 'Amount must be less than 10,000,000'),
  deadline: z.string().min(1, 'Deadline date is required'),
  link: z
    .string()
    .url('Must be a valid URL')
    .or(z.literal(''))
    .default(''),
  provider: z.string().default('Student Scholarship'),
  tag: z.string().default('Custom'),
});

export type ScholarshipInput = z.infer<typeof ScholarshipSchema>;

export const UserSettingsSchema = z.object({
  monthlyBudget: z.number().min(0).lt(10000000).default(8000),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP']).default('INR'),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;
