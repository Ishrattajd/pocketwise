import React, { useState } from 'react';
import { formatCurrency, calculateGoalProgress } from '../utils/formatters';
import { Target, Laptop, GraduationCap, Plane, ShieldAlert } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
  iconName: 'laptop' | 'grad' | 'plane' | 'shield';
}

const initialGoals: Goal[] = [
  {
    id: '1',
    title: 'MacBook Pro / Engineering Laptop',
    target: 1200,
    current: 780,
    deadline: 'Spring 2027',
    category: 'Technology',
    iconName: 'laptop',
  },
  {
    id: '2',
    title: 'Textbook Reserve Fund',
    target: 350,
    current: 240,
    deadline: 'Next Semester',
    category: 'Academics',
    iconName: 'grad',
  },
  {
    id: '3',
    title: 'Emergency Dorm Fund',
    target: 500,
    current: 310,
    deadline: 'Ongoing',
    category: 'Safety Net',
    iconName: 'shield',
  },
  {
    id: '4',
    title: 'Spring Break Roadtrip',
    target: 400,
    current: 125,
    deadline: 'March 2027',
    category: 'Travel',
    iconName: 'plane',
  },
];

export const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const getIcon = (name: Goal['iconName']) => {
    switch (name) {
      case 'laptop':
        return <Laptop className="w-4 h-4 text-indigo-400" />;
      case 'grad':
        return <GraduationCap className="w-4 h-4 text-amber-400" />;
      case 'plane':
        return <Plane className="w-4 h-4 text-sky-400" />;
      case 'shield':
        return <ShieldAlert className="w-4 h-4 text-emerald-400" />;
    }
  };

  const handleDeposit = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, current: Math.min(g.target, g.current + amount) } : g))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Savings Goals</h2>
          <p className="text-xs text-slate-400">Lock money away for tuition, gear, or emergencies</p>
        </div>
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
          <Target className="w-5 h-5" />
        </div>
      </div>

      {/* Goal Cards */}
      <div className="space-y-3">
        {goals.map((goal) => {
          const progress = calculateGoalProgress(goal.current, goal.target);
          const isComplete = progress >= 100;

          return (
            <div
              key={goal.id}
              className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                    {getIcon(goal.iconName)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{goal.title}</h3>
                    <p className="text-[10px] text-slate-400">
                      {goal.category} • Target: {goal.deadline}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isComplete
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-indigo-500/10 text-indigo-400'
                  }`}
                >
                  {progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isComplete
                      ? 'bg-emerald-400'
                      : 'bg-gradient-to-r from-indigo-500 to-violet-400'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">{formatCurrency(goal.current)}</span>
                  <span className="text-slate-400"> of {formatCurrency(goal.target)}</span>
                </div>

                {!isComplete && (
                  <button
                    onClick={() => handleDeposit(goal.id, 25)}
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded-lg transition"
                  >
                    + Deposit $25
                  </button>
                )}
                {isComplete && (
                  <span className="text-[11px] font-semibold text-emerald-400">🎉 Achieved!</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Goals;
