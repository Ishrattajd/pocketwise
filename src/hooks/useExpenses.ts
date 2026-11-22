import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { db } from '../services/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ExpenseSchema,
  SavingsGoalSchema,
  UserSettingsSchema,
  Category,
} from '../utils/schemas';

export interface ExpenseItem {
  id: string;
  amount: number;
  category: Category;
  note: string;
  date: string;
}

export interface GoalItem {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

export interface UserScholarshipItem {
  id: string;
  name: string;
  amount: number;
  deadline: string;
  link: string;
  provider: string;
  tag: string;
}

// Initial Indian demo dataset
const DEMO_EXPENSES: ExpenseItem[] = [
  { id: 'd1', amount: 60, category: 'Food', note: 'Canteen Thali & Chai', date: new Date().toISOString().split('T')[0] },
  { id: 'd2', amount: 500, category: 'Transport', note: 'Monthly Bus Pass', date: '2026-11-20' },
  { id: 'd3', amount: 1200, category: 'Books', note: 'Engineering Textbook Rental', date: '2026-11-18' },
  { id: 'd4', amount: 300, category: 'Rent', note: 'Hostel Laundry & Water', date: '2026-11-15' },
  { id: 'd5', amount: 450, category: 'Fun', note: 'Campus Tech Society Workshop', date: '2026-11-12' },
];

const DEMO_GOALS: GoalItem[] = [
  { id: 'g1', title: 'Coding & Engineering Laptop', targetAmount: 45000, currentAmount: 28500, deadline: 'Next Semester', category: 'Technology' },
  { id: 'g2', title: 'Semester Exam & Books Fund', targetAmount: 6000, currentAmount: 4200, deadline: 'Jan 2027', category: 'Academics' },
  { id: 'g3', title: 'Emergency Student Reserve', targetAmount: 10000, currentAmount: 6500, deadline: 'Ongoing', category: 'Safety Net' },
];

export function useExpenses() {
  const { user } = useAuth();
  const isDemo = Boolean(user?.isDemo);
  const uid = user?.uid;

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    if (isDemo) {
      const saved = localStorage.getItem('pocketwise_demo_expenses');
      return saved ? JSON.parse(saved) : DEMO_EXPENSES;
    }
    return [];
  });

  const [goals, setGoals] = useState<GoalItem[]>(() => {
    if (isDemo) {
      const saved = localStorage.getItem('pocketwise_demo_goals');
      return saved ? JSON.parse(saved) : DEMO_GOALS;
    }
    return [];
  });

  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    if (isDemo) {
      const saved = localStorage.getItem('pocketwise_demo_budget');
      return saved ? Number(saved) : 8000;
    }
    return 0;
  });

  const [savedJobs, setSavedJobs] = useState<string[]>(() => {
    if (isDemo) {
      const saved = localStorage.getItem('pocketwise_demo_saved_jobs');
      return saved ? JSON.parse(saved) : ['1'];
    }
    return [];
  });

  const [customScholarships, setCustomScholarships] = useState<UserScholarshipItem[]>(() => {
    if (isDemo) {
      const saved = localStorage.getItem('pocketwise_demo_scholarships');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [loading, setLoading] = useState<boolean>(!isDemo);

  // Firestore real-time listeners for signed-in users (never touched in demo mode)
  useEffect(() => {
    if (isDemo || !uid) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Listen to expenses collection
    const expensesRef = collection(db, 'users', uid, 'expenses');
    const expensesQuery = query(expensesRef, orderBy('date', 'desc'));
    const unsubExpenses = onSnapshot(
      expensesQuery,
      (snapshot) => {
        const items: ExpenseItem[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            amount: Number(data.amount || 0),
            category: (data.category as Category) || 'Other',
            note: String(data.note || ''),
            date: String(data.date || ''),
          };
        });
        setExpenses(items);
        setLoading(false);
      },
      (err) => {
        console.warn('Expenses listener warning (safe fallback active):', err);
        setLoading(false);
      }
    );

    // 2. Listen to goals collection
    const goalsRef = collection(db, 'users', uid, 'goals');
    const unsubGoals = onSnapshot(
      goalsRef,
      (snapshot) => {
        const items: GoalItem[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: String(data.title || ''),
            targetAmount: Number(data.targetAmount || 0),
            currentAmount: Number(data.currentAmount || 0),
            deadline: String(data.deadline || ''),
            category: String(data.category || 'Savings'),
          };
        });
        setGoals(items);
      },
      (err) => console.warn('Goals listener warning:', err)
    );

    // 3. Listen to settings document
    const settingsDocRef = doc(db, 'users', uid, 'settings', 'general');
    const unsubSettings = onSnapshot(
      settingsDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && typeof data.monthlyBudget === 'number') {
            setMonthlyBudget(data.monthlyBudget);
          }
        }
      },
      (err) => console.warn('Settings listener warning:', err)
    );

    // 4. Listen to saved jobs
    const savedJobsDocRef = doc(db, 'users', uid, 'savedJobs', 'list');
    const unsubSavedJobs = onSnapshot(
      savedJobsDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data?.jobIds)) {
            setSavedJobs(data.jobIds);
          }
        }
      },
      (err) => console.warn('Saved jobs listener warning:', err)
    );

    // 5. Listen to custom scholarships
    const scholarshipsRef = collection(db, 'users', uid, 'scholarships');
    const unsubScholarships = onSnapshot(
      scholarshipsRef,
      (snapshot) => {
        const items: UserScholarshipItem[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: String(data.name || ''),
            amount: Number(data.amount || 0),
            deadline: String(data.deadline || ''),
            link: String(data.link || ''),
            provider: String(data.provider || 'Student Added'),
            tag: String(data.tag || 'Custom'),
          };
        });
        setCustomScholarships(items);
      },
      (err) => console.warn('Scholarships listener warning:', err)
    );

    // Cleanup listeners
    return () => {
      unsubExpenses();
      unsubGoals();
      unsubSettings();
      unsubSavedJobs();
      unsubScholarships();
    };
  }, [isDemo, uid]);

  // Persist demo state changes locally
  useEffect(() => {
    if (isDemo) {
      localStorage.setItem('pocketwise_demo_expenses', JSON.stringify(expenses));
      localStorage.setItem('pocketwise_demo_goals', JSON.stringify(goals));
      localStorage.setItem('pocketwise_demo_budget', String(monthlyBudget));
      localStorage.setItem('pocketwise_demo_saved_jobs', JSON.stringify(savedJobs));
      localStorage.setItem('pocketwise_demo_scholarships', JSON.stringify(customScholarships));
    }
  }, [isDemo, expenses, goals, monthlyBudget, savedJobs, customScholarships]);

  // Expense Actions
  const addExpense = useCallback(
    async (item: Omit<ExpenseItem, 'id'>) => {
      const validated = ExpenseSchema.parse(item);

      if (isDemo || !uid) {
        const newExp: ExpenseItem = {
          ...validated,
          id: `demo_${Date.now()}`,
        };
        setExpenses((prev) => [newExp, ...prev]);
        return;
      }

      await addDoc(collection(db, 'users', uid, 'expenses'), {
        ...validated,
        createdAt: serverTimestamp(),
      });
    },
    [isDemo, uid]
  );

  const updateExpense = useCallback(
    async (id: string, updates: Partial<ExpenseItem>) => {
      if (isDemo || !uid) {
        setExpenses((prev) =>
          prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
        );
        return;
      }

      const expenseDocRef = doc(db, 'users', uid, 'expenses', id);
      await updateDoc(expenseDocRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    },
    [isDemo, uid]
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      if (isDemo || !uid) {
        setExpenses((prev) => prev.filter((e) => e.id !== id));
        return;
      }

      await deleteDoc(doc(db, 'users', uid, 'expenses', id));
    },
    [isDemo, uid]
  );

  // Budget Actions
  const updateMonthlyBudget = useCallback(
    async (budget: number) => {
      UserSettingsSchema.shape.monthlyBudget.parse(budget);

      if (isDemo || !uid) {
        setMonthlyBudget(budget);
        return;
      }

      const settingsDocRef = doc(db, 'users', uid, 'settings', 'general');
      await setDoc(
        settingsDocRef,
        {
          monthlyBudget: budget,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setMonthlyBudget(budget);
    },
    [isDemo, uid]
  );

  // Goal Actions
  const addGoal = useCallback(
    async (goal: Omit<GoalItem, 'id'>) => {
      const validated = SavingsGoalSchema.parse(goal);

      if (isDemo || !uid) {
        const newGoal: GoalItem = {
          ...validated,
          id: `demo_goal_${Date.now()}`,
        };
        setGoals((prev) => [...prev, newGoal]);
        return;
      }

      await addDoc(collection(db, 'users', uid, 'goals'), {
        ...validated,
        createdAt: serverTimestamp(),
      });
    },
    [isDemo, uid]
  );

  const contributeGoal = useCallback(
    async (id: string, amount: number) => {
      if (amount <= 0) return;

      if (isDemo || !uid) {
        setGoals((prev) =>
          prev.map((g) =>
            g.id === id
              ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) }
              : g
          )
        );
        return;
      }

      const goal = goals.find((g) => g.id === id);
      if (!goal) return;

      const newTotal = Math.min(goal.targetAmount, goal.currentAmount + amount);
      await updateDoc(doc(db, 'users', uid, 'goals', id), {
        currentAmount: newTotal,
        updatedAt: serverTimestamp(),
      });
    },
    [isDemo, uid, goals]
  );

  const deleteGoal = useCallback(
    async (id: string) => {
      if (isDemo || !uid) {
        setGoals((prev) => prev.filter((g) => g.id !== id));
        return;
      }

      await deleteDoc(doc(db, 'users', uid, 'goals', id));
    },
    [isDemo, uid]
  );

  // Saved Jobs Action
  const toggleSaveJob = useCallback(
    async (jobId: string) => {
      const next = savedJobs.includes(jobId)
        ? savedJobs.filter((id) => id !== jobId)
        : [...savedJobs, jobId];

      setSavedJobs(next);

      if (isDemo || !uid) return;

      await setDoc(
        doc(db, 'users', uid, 'savedJobs', 'list'),
        { jobIds: next, updatedAt: serverTimestamp() },
        { merge: true }
      );
    },
    [isDemo, uid, savedJobs]
  );

  // Custom Scholarship Action
  const addScholarship = useCallback(
    async (scholarship: Omit<UserScholarshipItem, 'id'>) => {
      if (isDemo || !uid) {
        const newS: UserScholarshipItem = {
          ...scholarship,
          id: `demo_s_${Date.now()}`,
        };
        setCustomScholarships((prev) => [newS, ...prev]);
        return;
      }

      await addDoc(collection(db, 'users', uid, 'scholarships'), {
        ...scholarship,
        createdAt: serverTimestamp(),
      });
    },
    [isDemo, uid]
  );

  return {
    expenses,
    goals,
    monthlyBudget,
    savedJobs,
    customScholarships,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    updateMonthlyBudget,
    addGoal,
    contributeGoal,
    deleteGoal,
    toggleSaveJob,
    addScholarship,
  };
}
