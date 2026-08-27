import React, { useState, useEffect, useRef } from 'react';
import type { Task, TaskFormData, Priority, TaskValidationErrors } from '../../types/todo';
import { isValidDateString, getTodayDateString } from '../../utils/dateUtils';
import { Button } from '../ui/Button';
import { X, Calendar, AlertCircle, Sparkles, Clock, Flame, Check, Tag } from 'lucide-react';
import { clsx } from 'clsx';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  initialTask?: Task | null;
}

const CATEGORIES = ['Engineering', 'Design', 'Product', 'Personal', 'General'];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
}) => {
  const isEditMode = Boolean(initialTask);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: getTodayDateString(),
    category: 'Engineering',
  });

  const [errors, setErrors] = useState<TaskValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form when modal opens or initialTask changes
  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setFormData({
          title: initialTask.title,
          description: initialTask.description || '',
          priority: initialTask.priority,
          dueDate: initialTask.dueDate,
          category: initialTask.category || 'General',
        });
      } else {
        setFormData({
          title: '',
          description: '',
          priority: 'Medium',
          dueDate: getTodayDateString(),
          category: 'Engineering',
        });
      }
      setErrors({});
      setIsSubmitting(false);

      // Focus title input on next tick
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialTask]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: TaskValidationErrors = {};

    // Validate Title
    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      newErrors.title = 'Task title is required.';
    }

    // Validate Due Date
    const trimmedDueDate = formData.dueDate.trim();
    if (!trimmedDueDate) {
      newErrors.dueDate = 'Due date is required.';
    } else if (!isValidDateString(trimmedDueDate)) {
      newErrors.dueDate = 'Please enter a valid due date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    onSubmit(formData);
  };

  const priorities: { id: Priority; label: string; icon: typeof Sparkles; color: string }[] = [
    {
      id: 'Low',
      label: 'Low',
      icon: Sparkles,
      color: 'hover:border-emerald-500/50 data-[selected=true]:border-emerald-500 data-[selected=true]:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'Medium',
      label: 'Medium',
      icon: Clock,
      color: 'hover:border-amber-500/50 data-[selected=true]:border-amber-500 data-[selected=true]:bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      id: 'High',
      label: 'High',
      icon: Flame,
      color: 'hover:border-rose-500/50 data-[selected=true]:border-rose-500 data-[selected=true]:bg-rose-500/10 text-rose-600 dark:text-rose-400',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 transition-all duration-200 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2
              id="modal-title"
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight"
            >
              {isEditMode ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEditMode
                ? 'Update your task details and deadline'
                : 'Add a new item to your productivity pipeline'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Title Field */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              ref={titleInputRef}
              id="task-title"
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, title: e.target.value }));
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g. Finalize quarterly sprint retrospective"
              className={clsx(
                'w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all',
                errors.title
                  ? 'border-rose-400 focus:ring-rose-400 dark:border-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/50 focus:border-indigo-500'
              )}
            />
            {errors.title && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="task-desc"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Description <span className="text-slate-400 font-normal normal-case">(Optional)</span>
            </label>
            <textarea
              id="task-desc"
              rows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Add key context, dependencies, or acceptance criteria..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Priority & Category Grid */}
          <div className="space-y-3">
            {/* Priority Selection */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Priority Level
              </span>
              <div className="grid grid-cols-3 gap-2">
                {priorities.map((p) => {
                  const IconComponent = p.icon;
                  const isSelected = formData.priority === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      data-selected={isSelected}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, priority: p.id }))
                      }
                      className={clsx(
                        'relative flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700',
                        p.color,
                        isSelected && 'ring-2 ring-offset-1 dark:ring-offset-slate-900 shadow-sm'
                      )}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                      <span>{p.label}</span>
                      {isSelected && (
                        <Check className="w-3 h-3 absolute right-1.5 top-2 stroke-[3]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Selector */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => {
                  const isSelected = (formData.category || 'General') === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                      className={clsx(
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer',
                        isSelected
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 ring-1 ring-indigo-500/30'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      )}
                    >
                      <Tag className="w-2.5 h-2.5 text-indigo-500" />
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Due Date Field */}
          <div>
            <label
              htmlFor="task-due-date"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Due Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="task-due-date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, dueDate: e.target.value }));
                  if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: undefined }));
                }}
                className={clsx(
                  'w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all cursor-pointer',
                  errors.dueDate
                    ? 'border-rose-400 focus:ring-rose-400 dark:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/50 focus:border-indigo-500'
                )}
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            {errors.dueDate && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.dueDate}</span>
              </p>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="shadow-sm shadow-indigo-600/25 min-w-[110px]"
            >
              {isEditMode ? 'Save Changes' : 'Add Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
