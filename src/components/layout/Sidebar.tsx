import React from 'react';
import type { SmartView, TaskStats } from '../../types/todo';
import {
  Layers,
  Calendar,
  Clock,
  CheckCircle2,
  Flame,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  currentView: SmartView;
  onSelectView: (view: SmartView) => void;
  stats: TaskStats;
  onResetSampleData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  stats,
  onResetSampleData,
}) => {
  const navItems = [
    {
      id: 'all' as SmartView,
      label: 'All Tasks',
      icon: Layers,
      count: stats.total,
    },
    {
      id: 'today' as SmartView,
      label: 'Today',
      icon: Calendar,
      count: stats.dueToday,
      highlight: stats.dueToday > 0,
    },
    {
      id: 'upcoming' as SmartView,
      label: 'Upcoming',
      icon: Clock,
      count: stats.pending - stats.dueToday - stats.overdue > 0 ? stats.pending - stats.dueToday - stats.overdue : undefined,
    },
    {
      id: 'completed' as SmartView,
      label: 'Completed',
      icon: CheckCircle2,
      count: stats.completed,
    },
    {
      id: 'high-priority' as SmartView,
      label: 'High Priority',
      icon: Flame,
      count: stats.highPriority,
      color: 'text-rose-500',
    },
    {
      id: 'overdue' as SmartView,
      label: 'Overdue',
      icon: AlertCircle,
      count: stats.overdue,
      badgeColor: 'bg-red-500 text-white',
      color: 'text-red-500',
      highlight: stats.overdue > 0,
    },
  ];

  return (
    <aside className="w-full lg:w-60 shrink-0 mb-6 lg:mb-0">
      {/* Desktop & Tablet Sidebar Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm">
        <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1.5 mb-1 flex items-center justify-between">
          <span>Views</span>
          <Sparkles className="w-3 h-3 text-indigo-500" />
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={clsx(
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer',
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <IconComponent
                    className={clsx(
                      'w-4 h-4 shrink-0',
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : item.color || 'text-slate-400'
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={clsx(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      item.badgeColor
                        ? item.badgeColor
                        : isActive
                        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Secondary Workspace utilities */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={onResetSampleData}
            title="Reload realistic demo tasks"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo Tasks</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
