import app from './firebase';
import { ParsedExpense, ParsedExpenseSchema, Category } from '../utils/schemas';

interface GenerativeModelInstance {
  generateContent: (prompt: string) => Promise<{
    response: {
      text: () => string;
    };
  }>;
}

let cachedModel: GenerativeModelInstance | null = null;
let modelInitAttempted = false;

/**
 * Attempts to initialize Gemini via Firebase AI Logic (firebase/ai, getAI with GoogleAIBackend).
 * Zero API keys in code. If not available or fails, falls back seamlessly.
 */
async function getGeminiModel(): Promise<GenerativeModelInstance | null> {
  if (cachedModel) return cachedModel;
  if (modelInitAttempted) return null;
  modelInitAttempted = true;

  try {
    const aiModule = await import('firebase/ai');
    if (aiModule && typeof aiModule.getAI === 'function') {
      const ai = aiModule.getAI(app, {
        backend: aiModule.GoogleAIBackend ? new aiModule.GoogleAIBackend() : undefined,
      });
      cachedModel = aiModule.getGenerativeModel(ai, { model: 'gemini-2.5-flash' });
      return cachedModel;
    }
  } catch (err) {
    console.warn('Firebase AI Logic not available; falling back to local NLP heuristics:', err);
  }
  return null;
}

/**
 * Robust local fallback regex & keyword-to-category parser.
 * Extracts numeric amount, categorizes based on student keywords, and assigns clean note.
 */
export function fallbackParseExpense(text: string): ParsedExpense {
  const clean = text.trim();
  if (!clean) {
    return { amount: 0, category: 'Other', note: 'Campus expense' };
  }

  // Match numbers (e.g., "120", "₹120", "rs 50", "45.50")
  const amountMatch = clean.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d{1,2})?)/i) ||
    clean.match(/(\d+(?:\.\d{1,2})?)\s*(?:₹|rs\.?|inr|rupees?)?/i);

  const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;

  // Keyword to category dictionary
  const lower = clean.toLowerCase();
  let category: Category = 'Other';

  if (
    /(movie|cinema|theatre|theater|party|outing|match|game|netflix|spot|treat|club|trip|celebration|fun)/i.test(
      lower
    )
  ) {
    category = 'Fun';
  } else if (
    /(chai|samosa|thali|canteen|mess|lunch|dinner|breakfast|dosa|coffee|tea|food|snack|maggi|fruit|grocery|meal|burger|pizza|biryani)/i.test(
      lower
    )
  ) {
    category = 'Food';
  } else if (
    /(bus|auto|metro|uber|ola|cab|petrol|fuel|train|ticket|pass|travel|transit|rickshaw|fare)/i.test(
      lower
    )
  ) {
    category = 'Transport';
  } else if (
    /(book|textbook|xerox|photocopy|print|notes|course|stationary|stationery|pen|register|exam|library)/i.test(
      lower
    )
  ) {
    category = 'Books';
  } else if (
    /(rent|hostel|room|pg|maintenance|electricity|wifi|water|deposit)/i.test(lower)
  ) {
    category = 'Rent';
  }

  // Clean note by removing numbers and currency symbols
  let note = clean
    .replace(/(?:₹|rs\.?|inr)?\s*\d+(?:\.\d{1,2})?\s*(?:₹|rs\.?|inr|rupees?)?/gi, '')
    .trim()
    .replace(/^[,.\s-]+|[,.\s-]+$/g, '');

  if (!note) {
    note = category !== 'Other' ? `${category} expense` : 'College spend';
  }

  // Capitalize first letter of note
  note = note.charAt(0).toUpperCase() + note.slice(1);

  return {
    amount: Math.max(1, amount || 1),
    category,
    note: note.slice(0, 200),
  };
}

/**
 * Parses freeform natural language text into a structured expense using Gemini.
 * Uses response schema and validates with Zod. Falls back to local regex on failure or demo.
 */
export async function parseExpense(
  text: string,
  isDemo: boolean = false
): Promise<ParsedExpense> {
  if (isDemo) {
    return fallbackParseExpense(text);
  }

  try {
    const model = await getGeminiModel();
    if (!model) {
      return fallbackParseExpense(text);
    }

    const prompt = `You are a financial parser for college students.
Parse the following student expense string into exact JSON with keys "amount" (number), "category" (one of: "Food", "Transport", "Books", "Rent", "Fun", "Other"), and "note" (string up to 50 chars).
Return ONLY pure JSON without markdown code blocks.
Input: "${text}"`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    // Strip possible markdown fences
    const jsonStr = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(jsonStr);

    return ParsedExpenseSchema.parse({
      amount: Number(parsed.amount),
      category: parsed.category,
      note: String(parsed.note || '').slice(0, 200),
    });
  } catch (err) {
    console.warn('Gemini parseExpense failed, using fallback parser:', err);
    return fallbackParseExpense(text);
  }
}

/**
 * Fallback rule-based savings tips based on actual expenses and monthly budget.
 */
export function fallbackInsights(
  expenses: Array<{ amount: number; category: string; date: string }>,
  budget: number = 8000
): string[] {
  const tips: string[] = [];
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  // Group by category
  const categoryTotals: Record<string, number> = {};
  for (const exp of expenses) {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  }

  // Tip 1: Top Category
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  if (topCategory && topCategory[1] > 0) {
    if (topCategory[0] === 'Food') {
      tips.push('Campus food is your top spend. Bundling mess meal passes saves 15-20% compared to daily canteen snacks.');
    } else if (topCategory[0] === 'Transport') {
      tips.push('Transit is high this month. A monthly student bus or metro smartcard cuts per-ride auto fare costs in half.');
    } else if (topCategory[0] === 'Books') {
      tips.push('Textbooks and notes are your main cost. Check the campus library reserve and senior book-share clubs before buying new.');
    } else {
      tips.push(`${topCategory[0]} is your largest category (${Math.round((topCategory[1] / (total || 1)) * 100)}% of spend). Watch non-essential upgrades.`);
    }
  } else {
    tips.push('Log all your small daily canteen spends to discover your hidden spending patterns.');
  }

  // Tip 2: Budget Pace
  if (budget > 0) {
    const remaining = budget - total;
    if (remaining < 0) {
      tips.push(`You have exceeded your monthly allowance by ${Math.abs(remaining).toFixed(0)}. Freeze discretionary weekend spends for the rest of the month.`);
    } else if (total > budget * 0.75) {
      tips.push('You have used over 75% of your monthly student budget. Pace your weekend outings to finish on track.');
    } else {
      tips.push(`Great pacing! You still have ₹${remaining.toFixed(0)} left in your budget. Deposit a small amount into your savings goal.`);
    }
  } else {
    tips.push('Set a monthly student budget on Home to stay ahead of semester expenses.');
  }

  // Tip 3: Student Action
  tips.push('Check the Scholarships tab this week — government NSP and state merit deadlines close before semester exams.');

  return tips.slice(0, 3);
}

/**
 * Returns three short, friendly saving tips based on the last 30 days.
 */
export async function getInsights(
  expenses: Array<{ amount: number; category: string; date: string }>,
  monthlyBudget: number = 8000,
  isDemo: boolean = false
): Promise<string[]> {
  if (isDemo || expenses.length === 0) {
    return fallbackInsights(expenses, monthlyBudget);
  }

  try {
    const model = await getGeminiModel();
    if (!model) {
      return fallbackInsights(expenses, monthlyBudget);
    }

    const summary = expenses.slice(0, 20).map((e) => `${e.category}: ${e.amount}`).join(', ');
    const prompt = `You are a financial advisor for college students.
Based on these recent expenses: [${summary}] and a monthly budget of ${monthlyBudget}, provide exactly 3 concise, friendly, and practical student money-saving tips (each 1-2 sentences).
Return ONLY a valid JSON array of 3 strings, like ["tip 1", "tip 2", "tip 3"]. Do not include markdown code blocks.`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const jsonStr = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(jsonStr);

    if (Array.isArray(parsed) && parsed.length >= 3) {
      return parsed.slice(0, 3).map((t: unknown) => String(t));
    }
    return fallbackInsights(expenses, monthlyBudget);
  } catch (err) {
    console.warn('Gemini getInsights failed, using fallback:', err);
    return fallbackInsights(expenses, monthlyBudget);
  }
}

/**
 * Checks student scholarship eligibility using Gemini with graceful local fallback.
 */
export async function checkScholarshipEligibility(
  scholarshipName: string,
  profile: string,
  isDemo: boolean = false
): Promise<string> {
  if (isDemo) {
    return `Based on standard college guidelines, enrolled undergraduate students with verified academic records are generally eligible for ${scholarshipName}. Prepare your marksheets, college ID, and domicile certificate.`;
  }

  try {
    const model = await getGeminiModel();
    if (!model) {
      return `Standard eligibility for ${scholarshipName} typically requires regular college enrollment, a minimum 60% score in your prior degree, and domicile documentation.`;
    }

    const prompt = `In 2 short sentences, assess whether a student with profile "${profile}" is likely eligible for "${scholarshipName}" and what key document they should have ready.`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.warn('Gemini eligibility check failed, using fallback:', err);
    return `Eligibility for ${scholarshipName} typically requires active enrollment and prior academic records. Confirm on the official portal before the deadline.`;
  }
}
