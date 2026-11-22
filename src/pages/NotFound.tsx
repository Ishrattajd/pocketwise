import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="font-heading text-5xl font-extrabold text-[#0F766E]">404</div>
      <h2 className="font-heading text-base font-bold text-[#1E293B]">Page Not Found</h2>
      <p className="text-xs text-[#64748B] max-w-xs">
        The student resource or budget page you requested doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="min-h-[44px] inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-sm"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
