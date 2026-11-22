export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isDemo?: boolean;
}

export type NavTabId = 'home' | 'expenses' | 'goals' | 'scholarships' | 'jobs';

export interface NavTabItem {
  id: NavTabId;
  label: string;
  path: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: 'Food' | 'Textbooks' | 'Housing' | 'Transportation' | 'Entertainment' | 'Other';
  date: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

export interface ScholarshipItem {
  id: string;
  title: string;
  provider: string;
  amount: number;
  deadline: string;
  category: string;
  description: string;
}

export interface JobItem {
  id: string;
  title: string;
  department: string;
  hourlyRate: number;
  hoursPerWeek: string;
  type: 'On-Campus' | 'Work-Study' | 'Part-Time' | 'Remote';
  location: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsDemo: () => void;
  signOut: () => Promise<void>;
  error: string | null;
}
