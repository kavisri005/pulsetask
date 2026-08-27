import React from 'react';
import type {
  FilterStatus,
  FilterPriority,
  SortOption,
  TaskStats,
} from '../../types/todo';
import { SearchBar } from './SearchBar';
import { ArrowUpDown, Filter, SlidersHorizontal } from 'lucide-react';
import { clsx } from 'clsx';

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  priority: FilterPriority;
  onPriorityChange: (priority: FilterPriority) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  stats: TaskStats;
  matchingCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortByChange,
  stats,
  matchingCount,
}) => {
  const statusOptions: { id: FilterStatus; label: string; count: number }[] = [
    { id: 'All', label: 'All', count: stats.total },
    { id: 'Pending', label: 'Pending', count: stats.pending },
    { id: 'Completed', label: 'Completed', count: stats.completed },
  ];

  const priorityOptions: { id: FilterPriority; label: string }[] = [
    { id: 'All', label: 'All Priorities' },
    { id: 'High', label: 'High Priority' },
    { id: 'Medium', label: 'Medium Priority' },
    { id: 'Low', label: 'Low Priority' },
  ];

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: 'dueDate-asc', label: 'Due Date: Soonest' },
    { id: 'dueDate-desc', label: 'Due Date: Latest' },
    { id: 'priority-desc', label: 'Priority: High → Low' },
    { id: 'priority-asc', label: 'Priority: Low → High' },
    { id: 'created-desc', label: 'Created: Newest' },
    { id: 'created-asc', label: 'Created: Oldest' },
    { id: 'title-asc', label: 'Title: A → Z' },
  ];

  return (
    <div className="space-y-3 mb-5">
      {/* Top row: Search, Priority Dropdown, Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <SearchBar value={search} onChange={onSearchChange} />

        <div className="flex items-center gap-2">
          {/* Priority Select */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={priority}
              onChange={(e) => onPriorityChange(e.target.value as FilterPriority)}
              aria-label="Filter by priority"
              className="w-full sm:w-auto appearance-none pl-8 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
            >
              {priorityOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <SlidersHorizontal className="w-3 h-3" />
            </div>
          </div>

          {/* Sort Select */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortOption)}
              aria-label="Sort tasks"
              className="w-full sm:w-auto appearance-none pl-8 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Status Tabs & Result Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
        {/* Status Segmented Control */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 max-w-full overflow-x-auto">
          {statusOptions.map((opt) => {
            const isActive = status === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onStatusChange(opt.id)}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                <span>{opt.label}</span>
                <span
                  className={clsx(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  )}
                >
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Matching Result Count */}
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Showing <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{matchingCount}</span> {matchingCount === 1 ? 'task' : 'tasks'}
        </div>
      </div>
    </div>
  );
};
