import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div className="w-full max-w-md mx-auto min-h-screen bg-slate-900 border-x border-slate-800/80 flex flex-col shadow-2xl relative">
        <Header />
        <main className="flex-1 pb-20 px-4 pt-4 overflow-y-auto">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};
