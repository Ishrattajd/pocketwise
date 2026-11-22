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
        <div className="w-12 h-12 rounded-full border-4 border-[#0F766E]/20 border-t-[#0F766E] animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium text-[#64748B] animate-pulse">{message}</p>
    </div>
  );
};
