import React from 'react';
import type { Priority, Status } from '../../types/todo';
import { AlertCircle, CheckCircle2, Clock, Flame, Sparkles, Tag } from 'lucide-react';
import { clsx } from 'clsx';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const config = {
    High: {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 dark:border-rose-500/30',
      icon: Flame,
      label: 'High',
    },
    Medium: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30',
      icon: Clock,
      label: 'Medium',
    },
    Low: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30',
      icon: Sparkles,
      label: 'Low',
    },
  }[priority];

  const IconComponent = config.icon;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-md border transition-all select-none',
        config.bg,
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      )}
    >
      <IconComponent className={clsx(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      <span>{priority}</span>
    </span>
  );
};

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const isCompleted = status === 'Completed';

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-md border transition-all select-none',
        isCompleted
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30'
          : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20 dark:border-slate-500/30',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      )}
    >
      {isCompleted ? (
        <CheckCircle2 className={clsx(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5', 'text-emerald-500')} />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
      )}
      <span>{status}</span>
    </span>
  );
};

interface OverdueBadgeProps {
  size?: 'sm' | 'md';
}

export const OverdueBadge: React.FC<OverdueBadgeProps> = ({ size = 'sm' }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-semibold rounded-md border select-none',
        'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25 dark:border-red-500/35',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      )}
      title="This task is past its due date"
    >
      <AlertCircle className={clsx(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5', 'text-red-500')} />
      <span>Overdue</span>
    </span>
  );
};

interface CategoryBadgeProps {
  category?: string;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category = 'General', size = 'sm' }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-medium rounded-md border select-none',
        'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 dark:border-indigo-500/30',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      )}
    >
      <Tag className={clsx(size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3', 'text-indigo-500')} />
      <span>{category}</span>
    </span>
  );
};
