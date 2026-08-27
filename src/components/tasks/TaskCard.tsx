import React from 'react';
import type { Task } from '../../types/todo';
import { PriorityBadge, StatusBadge, OverdueBadge, CategoryBadge } from '../ui/Badge';
import { getDueDateDescriptor } from '../../utils/dateUtils';
import { Calendar, Check, Edit3, Trash2, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const isCompleted = task.status === 'Completed';
  const { formattedText, relativeText, isOverdueState, isTodayState } = getDueDateDescriptor(
    task.dueDate,
    task.status
  );

  return (
    <div
      className={clsx(
        'group relative flex flex-col justify-between rounded-2xl p-4 sm:p-4.5 transition-all duration-200 border',
        isCompleted
          ? 'bg-slate-50/60 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 opacity-75 hover:opacity-100'
          : isOverdueState
          ? 'bg-white dark:bg-slate-900 border-red-500/30 dark:border-red-500/40 hover:border-red-500/50 shadow-sm hover:shadow-md'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md'
      )}
    >
      {/* Top Meta Badges: Category, Priority, Overdue, Status */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {task.category && <CategoryBadge category={task.category} />}
          <PriorityBadge priority={task.priority} />
          {isOverdueState && <OverdueBadge />}
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Task Content: Checkbox, Title & Description */}
      <div className="flex items-start gap-3 my-1">
        {/* Toggle Complete Checkbox */}
        <button
          type="button"
          onClick={() => onToggleStatus(task.id)}
          aria-label={isCompleted ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as completed`}
          className={clsx(
            'mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border transition-all duration-150 shrink-0 cursor-pointer',
            isCompleted
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/30'
              : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/80 hover:border-indigo-500 dark:hover:border-indigo-400'
          )}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Title & Description */}
        <div className="flex-1 min-w-0">
          <h3
            className={clsx(
              'text-sm sm:text-base font-semibold leading-snug tracking-tight text-slate-900 dark:text-slate-100 transition-all',
              isCompleted && 'line-through text-slate-400 dark:text-slate-500 font-normal'
            )}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={clsx(
                'mt-1 text-xs sm:text-sm leading-relaxed line-clamp-2 text-slate-600 dark:text-slate-400',
                isCompleted && 'text-slate-400 dark:text-slate-600'
              )}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Due Date & Action Controls */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        {/* Due date indicator */}
        <div
          className={clsx(
            'inline-flex items-center gap-1.5 text-xs font-medium',
            isOverdueState
              ? 'text-red-600 dark:text-red-400 font-semibold'
              : isTodayState
              ? 'text-amber-600 dark:text-amber-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          )}
        >
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>
            {isOverdueState
              ? `Overdue (${formattedText})`
              : isTodayState
              ? `Due Today`
              : `Due ${relativeText}`}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Quick Toggle Status */}
          <button
            type="button"
            onClick={() => onToggleStatus(task.id)}
            aria-label={isCompleted ? 'Move to pending' : 'Mark as complete'}
            className={clsx(
              'p-2 sm:p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
              isCompleted
                ? 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                : 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
            )}
            title={isCompleted ? 'Move to pending' : 'Mark as complete'}
          >
            {isCompleted ? <RotateCcw className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Edit task "${task.title}"`}
            className="p-2 sm:p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
            title="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(task)}
            aria-label={`Delete task "${task.title}"`}
            className="p-2 sm:p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
