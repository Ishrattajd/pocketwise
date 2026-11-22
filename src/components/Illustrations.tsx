import React from 'react';

export const StudentFinanceIllustration: React.FC<{ className?: string }> = ({
  className = 'w-48 h-36',
}) => (
  <svg
    viewBox="0 0 240 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Background soft backdrop */}
    <rect x="20" y="20" width="200" height="140" rx="20" fill="#F0FDFA" />
    <circle cx="180" cy="50" r="28" fill="#FEF3C7" />
    
    {/* Student Card / Notebook */}
    <rect x="50" y="45" width="105" height="75" rx="10" fill="#FFFFFF" stroke="#E5E0D8" strokeWidth="2" />
    <rect x="62" y="58" width="50" height="6" rx="3" fill="#0F766E" />
    <rect x="62" y="72" width="75" height="4" rx="2" fill="#E5E0D8" />
    <rect x="62" y="82" width="60" height="4" rx="2" fill="#E5E0D8" />
    <rect x="62" y="92" width="40" height="4" rx="2" fill="#E5E0D8" />
    
    {/* Wallet Accent Card */}
    <rect x="95" y="70" width="95" height="65" rx="12" fill="#0F766E" />
    <rect x="95" y="82" width="95" height="12" fill="#115E59" />
    <rect x="155" y="95" width="28" height="18" rx="6" fill="#F59E0B" />
    <circle cx="163" cy="104" r="2.5" fill="#FFFFFF" />

    {/* Rupee Coin */}
    <circle cx="70" cy="125" r="16" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
    <path
      d="M66 119H74M66 122H74M66 122C68 122 71 122 71 125C71 128 68 128 66 128H73L70 133"
      stroke="#FFFFFF"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Sparkle details */}
    <path d="M195 95L197 100L202 102L197 104L195 109L193 104L188 102L193 100L195 95Z" fill="#F59E0B" />
    <path d="M40 50L41 53L44 54L41 55L40 58L39 55L36 54L39 53L40 50Z" fill="#0F766E" opacity="0.6" />
  </svg>
);

export const EmptyExpensesIllustration: React.FC<{ className?: string }> = ({
  className = 'w-36 h-28',
}) => (
  <svg
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="25" y="15" width="110" height="90" rx="16" fill="#FAF7F2" />
    {/* Receipt shape */}
    <path
      d="M50 25H110V95L102 91L94 95L86 91L78 95L70 91L62 95L54 91L50 95V25Z"
      fill="#FFFFFF"
      stroke="#E5E0D8"
      strokeWidth="2"
    />
    <rect x="62" y="38" width="36" height="5" rx="2.5" fill="#0F766E" />
    <rect x="62" y="50" width="24" height="4" rx="2" fill="#E5E0D8" />
    <rect x="62" y="60" width="36" height="4" rx="2" fill="#E5E0D8" />
    <circle cx="95" cy="74" r="10" fill="#FEF3C7" />
    <path d="M92 74H98M95 71V77" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const EmptyGoalsIllustration: React.FC<{ className?: string }> = ({
  className = 'w-36 h-28',
}) => (
  <svg
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="25" y="15" width="110" height="90" rx="16" fill="#FAF7F2" />
    {/* Target / Goal board */}
    <circle cx="80" cy="58" r="32" fill="#FFFFFF" stroke="#E5E0D8" strokeWidth="2" />
    <circle cx="80" cy="58" r="22" fill="#F0FDFA" stroke="#0F766E" strokeWidth="1.5" />
    <circle cx="80" cy="58" r="12" fill="#FFFFFF" stroke="#E5E0D8" strokeWidth="1.5" />
    <circle cx="80" cy="58" r="5" fill="#F59E0B" />
    {/* Arrow */}
    <path d="M80 58L104 36" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M98 34L106 34L106 42" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
