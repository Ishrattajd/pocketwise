import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCurrency } from '../hooks/useCurrency';
import { calculateGoalProgress } from '../utils/formatters';
import { Target, Plus, Laptop, GraduationCap, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { EmptyGoalsIllustration } from '../components/Illustrations';

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
  iconName: 'laptop' | 'grad' | 'shield' | 'target';
}

const demoGoals: Goal[] = [
  {
    id: '1',
    title: 'Coding & Engineering Laptop',
    target: 45000,
    current: 28500,
    deadline: 'Next Semester',
    category: 'Technology',
    iconName: 'laptop',
  },
  {
    id: '2',
    title: 'Semester Exam & Textbook Fund',
    target: 6000,
    current: 4200,
    deadline: 'Jan 2027',
    category: 'Academics',
    iconName: 'grad',
  },
  {
    id: '3',
    title: 'Emergency Student Reserve',
    target: 10000,
    current: 6500,
    deadline: 'Ongoing',
    category: 'Safety Net',
    iconName: 'shield',
  },
];

export const Goals: React.FC = () => {
  const { user } = useAuth();
  const { format, symbol } = useCurrency();

  const storageKey = `pocketwise_goals_${user?.uid || 'guest'}`;

  // For demo account: rupees demo goals (laptop ₹45,000). For new real sign in: start empty!
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return user?.isDemo ? demoGoals : [];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(goals));
  }, [goals, storageKey]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const getIcon = (name: Goal['iconName']) => {
    switch (name) {
      case 'laptop':
        return <Laptop className="w-5 h-5 text-[#0F766E]" />;
      case 'grad':
        return <GraduationCap className="w-5 h-5 text-[#F59E0B]" />;
      case 'shield':
        return <ShieldAlert className="w-5 h-5 text-[#0F766E]" />;
      default:
        return <Target className="w-5 h-5 text-[#0F766E]" />;
    }
  };

  const handleDeposit = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, current: Math.min(g.target, g.current + amount) } : g))
    );
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = parseFloat(newTarget);
    if (!newTitle.trim() || isNaN(targetNum) || targetNum <= 0) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      target: targetNum,
      current: 0,
      deadline: newDeadline.trim() || 'Next Semester',
      category: 'Student Savings',
      iconName: 'target',
    };

    setGoals([newGoal, ...goals]);
    setNewTitle('');
    setNewTarget('');
    setNewDeadline('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#1E293B]">Savings Goals</h2>
          <p className="text-xs text-[#64748B]">Save for tuition, devices, or emergencies</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="min-h-[44px] flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goal Cards */}
      <div className="space-y-3">
        {goals.map((goal) => {
          const progress = calculateGoalProgress(goal.current, goal.target);
          const isComplete = progress >= 100;

          return (
            <div
              key={goal.id}
              className="p-4 bg-white border border-[#E5E0D8] rounded-3xl space-y-3 shadow-sm hover:border-[#0F766E]/40 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E5E0D8]">
                    {getIcon(goal.iconName)}
                  </div>
                  <div>
                    <h3 className="font-heading text-xs font-bold text-[#1E293B]">{goal.title}</h3>
                    <p className="text-[10px] text-[#64748B]">
                      {goal.category} • Target: {goal.deadline}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isComplete
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-teal-50 text-[#0F766E] border border-[#0F766E]/20'
                  }`}
                >
                  {progress}%
                </span>
              </div>

              {/* Progress bar in Deep Teal */}
              <div className="w-full bg-[#FAF7F2] border border-[#E5E0D8] h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-300 bg-[#0F766E]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#1E293B]">{format(goal.current)}</span>
                  <span className="text-[#64748B]"> of {format(goal.target)}</span>
                </div>

                {!isComplete ? (
                  <button
                    onClick={() => handleDeposit(goal.id, 500)}
                    className="min-h-[44px] text-xs font-semibold text-[#0F766E] bg-teal-50 hover:bg-teal-100 border border-[#0F766E]/20 px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                  >
                    <span>+ Deposit {format(500)}</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Achieved!
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-8 text-center shadow-sm">
            <EmptyGoalsIllustration className="w-32 h-24 mx-auto" />
            <p className="mt-3 text-xs font-bold text-[#1E293B]">No savings goals created yet</p>
            <p className="text-[11px] text-[#64748B] mt-1 max-w-xs mx-auto">
              Start saving for your next laptop, course certifications, or an emergency buffer.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F766E] text-white text-xs font-semibold rounded-xl hover:bg-[#115E59]"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Goal</span>
            </button>
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-[#E5E0D8] rounded-3xl p-6 shadow-xl">
            <h3 className="font-heading text-sm font-bold text-[#1E293B] mb-3">
              Create Savings Target
            </h3>
            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label htmlFor="goal-name-input" className="text-xs font-semibold text-[#1E293B]">
                  Goal Name *
                </label>
                <input
                  id="goal-name-input"
                  type="text"
                  placeholder="e.g. Coding Laptop, Gate Exam Fees"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="min-h-[44px] mt-1 w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="goal-target-input" className="text-xs font-semibold text-[#1E293B]">
                  Target Amount ({symbol}) *
                </label>
                <input
                  id="goal-target-input"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 45000"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="min-h-[44px] mt-1 w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="goal-deadline-input" className="text-xs font-semibold text-[#1E293B]">
                  Target Date
                </label>
                <input
                  id="goal-deadline-input"
                  type="text"
                  placeholder="e.g. Next Semester, March 2027"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="min-h-[44px] mt-1 w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="min-h-[44px] flex-1 py-2.5 rounded-xl bg-[#FAF7F2] text-xs font-semibold text-[#64748B] hover:text-[#1E293B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] flex-1 py-2.5 rounded-xl bg-[#0F766E] text-xs font-semibold text-white shadow-sm hover:bg-[#115E59]"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
