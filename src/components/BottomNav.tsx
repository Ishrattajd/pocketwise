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
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E5E0D8] px-2 pb-safe"
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
                `min-h-[44px] flex flex-col items-center justify-center flex-1 py-1 px-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-[#0F766E] font-semibold'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`relative p-1.5 rounded-xl transition-all ${
                      isActive ? 'bg-[#0F766E]/10 text-[#0F766E]' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#0F766E] rounded-full" />
                    )}
                  </div>
                  <span className="mt-0.5 text-[11px] tracking-tight">{tab.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
