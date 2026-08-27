import React from 'react';
import type { FilterStatus, FilterPriority, SmartView } from '../../types/todo';
import { X, RotateCcw } from 'lucide-react';

interface ActiveFiltersProps {
  search: string;
  onClearSearch: () => void;
  status: FilterStatus;
  onResetStatus: () => void;
  priority: FilterPriority;
  onResetPriority: () => void;
  view: SmartView;
  onResetView: () => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  search,
  onClearSearch,
  status,
  onResetStatus,
  priority,
  onResetPriority,
  view,
  onResetView,
  onClearAll,
  hasActiveFilters,
}) => {
  if (!hasActiveFilters) return null;

  const viewLabels: Record<SmartView, string> = {
    all: 'All Tasks',
    today: 'Due Today',
    upcoming: 'Upcoming',
    completed: 'Completed View',
    'high-priority': 'High Priority View',
    overdue: 'Overdue View',
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 text-xs">
      <span className="text-slate-400 dark:text-slate-500 font-medium">Active filters:</span>

      {/* Smart View Tag */}
      {view !== 'all' && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-medium">
          <span>View: {viewLabels[view]}</span>
          <button
            onClick={onResetView}
            className="hover:text-indigo-900 dark:hover:text-indigo-200 p-0.5 rounded cursor-pointer"
            aria-label="Clear view filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Search Tag */}
      {search.trim().length > 0 && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
          <span>Search: &ldquo;{search}&rdquo;</span>
          <button
            onClick={onClearSearch}
            className="hover:text-slate-900 dark:hover:text-slate-100 p-0.5 rounded cursor-pointer"
            aria-label="Clear search filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Status Tag */}
      {status !== 'All' && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
          <span>Status: {status}</span>
          <button
            onClick={onResetStatus}
            className="hover:text-slate-900 dark:hover:text-slate-100 p-0.5 rounded cursor-pointer"
            aria-label="Clear status filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Priority Tag */}
      {priority !== 'All' && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
          <span>Priority: {priority}</span>
          <button
            onClick={onResetPriority}
            className="hover:text-amber-900 dark:hover:text-amber-100 p-0.5 rounded cursor-pointer"
            aria-label="Clear priority filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Clear All Action */}
      <button
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium underline underline-offset-2 ml-1 cursor-pointer transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear filters</span>
      </button>
    </div>
  );
};
