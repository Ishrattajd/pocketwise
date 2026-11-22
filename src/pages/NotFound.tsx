import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="text-5xl font-black text-indigo-500">404</div>
      <h2 className="text-base font-bold text-white">Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-xs">
        The student resource or budget page you requested doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
