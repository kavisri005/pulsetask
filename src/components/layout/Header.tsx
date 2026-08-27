import React from 'react';
import { Plus, Sun, Moon, CheckSquare, Sparkles, Command, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  onOpenAddTask: () => void;
  onFocusSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddTask, onFocusSearch }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-sm shadow-indigo-500/30 shrink-0">
            <CheckSquare className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                PulseTask
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-2.5 h-2.5" />
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block font-medium">
              Elevate your workflow and conquer your daily goals
            </p>
          </div>
        </div>

        {/* Actions (Search Quick-Trigger, Theme Toggle, and Add Task CTA) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Search Trigger button on desktop */}
          <button
            onClick={onFocusSearch}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-900 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
            title="Search tasks (Ctrl+K or /)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-slate-400 dark:text-slate-500">Quick search...</span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-600 dark:text-slate-300">
              <Command className="w-2.5 h-2.5" />K
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Primary Add Task CTA Button */}
          <Button
            onClick={onOpenAddTask}
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
            className="shadow-sm shadow-indigo-500/25 text-xs sm:text-sm font-semibold"
          >
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">New Task</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
