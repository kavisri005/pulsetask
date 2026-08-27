import React from 'react';
import { useToast } from '../../hooks/useToast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { clsx } from 'clsx';
import type { ToastType } from '../../types/todo';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: {
    id: string;
    type: ToastType;
    message: string;
    description?: string;
  };
  onDismiss: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const config = {
    success: {
      icon: CheckCircle2,
      border: 'border-emerald-500/30 dark:border-emerald-500/40',
      bg: 'bg-white dark:bg-slate-900',
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      indicator: 'bg-emerald-500',
    },
    error: {
      icon: AlertCircle,
      border: 'border-rose-500/30 dark:border-rose-500/40',
      bg: 'bg-white dark:bg-slate-900',
      iconColor: 'text-rose-500 dark:text-rose-400',
      indicator: 'bg-rose-500',
    },
    warning: {
      icon: AlertTriangle,
      border: 'border-amber-500/30 dark:border-amber-500/40',
      bg: 'bg-white dark:bg-slate-900',
      iconColor: 'text-amber-500 dark:text-amber-400',
      indicator: 'bg-amber-500',
    },
    info: {
      icon: Info,
      border: 'border-indigo-500/30 dark:border-indigo-500/40',
      bg: 'bg-white dark:bg-slate-900',
      iconColor: 'text-indigo-500 dark:text-indigo-400',
      indicator: 'bg-indigo-500',
    },
  }[toast.type];

  const IconComponent = config.icon;

  return (
    <div
      role="alert"
      className={clsx(
        'pointer-events-auto relative flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-fade-in overflow-hidden',
        config.bg,
        config.border
      )}
    >
      <div className={clsx('absolute left-0 top-0 bottom-0 w-1', config.indicator)} />
      <div className={clsx('shrink-0 mt-0.5', config.iconColor)}>
        <IconComponent className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0 pr-2">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
          {toast.message}
        </p>
        {toast.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
