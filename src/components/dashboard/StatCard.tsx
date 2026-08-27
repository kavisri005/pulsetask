import React, { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  subtext?: string;
  variant?: 'indigo' | 'amber' | 'emerald' | 'rose';
  onClick?: () => void;
  isActive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  subtext,
  variant = 'indigo',
  onClick,
  isActive = false,
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  // Smooth number counter sync
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const variantStyles = {
    indigo: {
      activeBorder: 'ring-2 ring-indigo-500 border-indigo-500',
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      accentGlow: 'from-indigo-500/5 to-transparent',
    },
    amber: {
      activeBorder: 'ring-2 ring-amber-500 border-amber-500',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      accentGlow: 'from-amber-500/5 to-transparent',
    },
    emerald: {
      activeBorder: 'ring-2 ring-emerald-500 border-emerald-500',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      accentGlow: 'from-emerald-500/5 to-transparent',
    },
    rose: {
      activeBorder: 'ring-2 ring-rose-500 border-rose-500',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      accentGlow: 'from-rose-500/5 to-transparent',
    },
  }[variant];

  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative group overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border p-4 sm:p-4.5 transition-all duration-150 shadow-sm',
        onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:shadow active:scale-[0.99]' : '',
        isActive
          ? variantStyles.activeBorder
          : 'border-slate-200/80 dark:border-slate-800'
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-tight truncate">
          {label}
        </span>
        <div
          className={clsx(
            'w-8 h-8 rounded-xl flex items-center justify-center border shrink-0',
            variantStyles.iconBg
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-1">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {displayValue}
        </span>
        {subtext && (
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate text-right">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
