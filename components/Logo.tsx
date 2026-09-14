import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function Logo({ size = 'md', showSubtitle = true }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative ${iconSizes[size]} flex items-center justify-center`}>
        {/* Modern geometric supply-chain shield icon */}
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="reliable-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="reliable-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
          </defs>

          {/* Hexagonal outer shield */}
          <path
            d="M24 4L42 14V34L24 44L6 34V14L24 4Z"
            fill="#F8FAFC"
            stroke="url(#reliable-grad-1)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Interlocking R-Node Geometric Path */}
          <path
            d="M18 16H27C29.7614 16 32 18.2386 32 21C32 23.7614 29.7614 26 27 26H18V16Z"
            stroke="url(#reliable-grad-1)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 16V32"
            stroke="url(#reliable-grad-2)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M25 26L31 32"
            stroke="#059669"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Center node */}
          <circle cx="24" cy="21" r="2.5" fill="#0284C7" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-wider uppercase text-slate-900 ${textSizes[size]} font-sans`}>
            Reliable
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold -mt-1">
            Enterprise Procurement
          </span>
        )}
      </div>
    </div>
  );
}
