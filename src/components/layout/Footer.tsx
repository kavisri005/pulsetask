import React from 'react';
import { Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Persistence Status */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="flex items-center gap-1.5 font-medium">
            <Database className="w-3.5 h-3.5" />
            LocalStorage Synchronized
          </span>
        </div>

        {/* Keyboard hints */}
        <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">
              /
            </kbd>
            to search
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">
              N
            </kbd>
            new task
          </span>
        </div>

        {/* Copyright */}
        <div className="text-center sm:text-right">
          <p>© {new Date().getFullYear()} PulseTask Productivity Engine</p>
        </div>
      </div>
    </footer>
  );
};
