import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading PocketWise...',
}) => {
  return (
    <div
      data-testid="loading-spinner"
      className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center"
    >
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-400 animate-pulse">{message}</p>
    </div>
  );
};
