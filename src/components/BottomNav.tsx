import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Receipt, Target, GraduationCap, Briefcase } from 'lucide-react';

interface TabItem {
  id: string;
  name: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: TabItem[] = [
  { id: 'home', name: 'Home', to: '/', icon: Home },
  { id: 'expenses', name: 'Expenses', to: '/expenses', icon: Receipt },
  { id: 'goals', name: 'Goals', to: '/goals', icon: Target },
  { id: 'scholarships', name: 'Scholarships', to: '/scholarships', icon: GraduationCap },
  { id: 'jobs', name: 'Jobs', to: '/jobs', icon: Briefcase },
];

export const BottomNav: React.FC = () => {
  return (
    <nav
      data-testid="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 pb-safe"
      aria-label="Bottom Navigation"
    >
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.id}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 px-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`relative p-1 rounded-xl transition-all ${
                      isActive ? 'bg-indigo-600/10 text-indigo-400' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full" />
                    )}
                  </div>
                  <span className="mt-0.5 text-[10px] tracking-tight">{tab.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
