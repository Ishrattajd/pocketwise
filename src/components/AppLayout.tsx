import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E293B] flex flex-col justify-between">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0F766E] focus:text-white focus:rounded-xl focus:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
      >
        Skip to content
      </a>
      <div className="w-full max-w-md mx-auto min-h-screen bg-[#FAF7F2] border-x border-[#E5E0D8] flex flex-col shadow-sm relative">
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 pb-24 px-4 pt-4 overflow-y-auto focus:outline-none">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};
