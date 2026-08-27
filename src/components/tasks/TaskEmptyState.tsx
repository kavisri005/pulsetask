import React from 'react';
import { Button } from '../ui/Button';
import { CheckSquare, SearchX, Plus, RotateCcw } from 'lucide-react';

interface TaskEmptyStateProps {
  isFilterEmpty: boolean;
  onOpenAddTask: () => void;
  onClearFilters?: () => void;
  onLoadSampleData?: () => void;
}

export const TaskEmptyState: React.FC<TaskEmptyStateProps> = ({
  isFilterEmpty,
  onOpenAddTask,
  onClearFilters,
  onLoadSampleData,
}) => {
  if (isFilterEmpty) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 my-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3.5 border border-indigo-500/20">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
          No tasks found
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Try adjusting your search query or clearing active filters.
        </p>
        {onClearFilters && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="md"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={onClearFilters}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-14 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 my-4 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3.5 border border-indigo-500/20">
        <CheckSquare className="w-7 h-7 stroke-[2.2]" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
        Your workspace is clear.
      </h3>
      <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        Create your first task to get started organizing your productivity pipeline.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          onClick={onOpenAddTask}
          className="shadow-sm shadow-indigo-600/25"
        >
          Add your first task
        </Button>
        {onLoadSampleData && (
          <Button
            variant="secondary"
            size="md"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={onLoadSampleData}
          >
            Load sample tasks
          </Button>
        )}
      </div>
    </div>
  );
};
