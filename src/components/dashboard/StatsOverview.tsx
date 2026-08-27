import React from 'react';
import type { TaskStats, FilterStatus, FilterPriority, SmartView } from '../../types/todo';
import { StatCard } from './StatCard';
import { Layers, Clock, CheckCircle2, Flame, Sparkles, TrendingUp } from 'lucide-react';

interface StatsOverviewProps {
  stats: TaskStats;
  currentStatus: FilterStatus;
  currentPriority: FilterPriority;
  currentView: SmartView;
  onSelectStatus: (status: FilterStatus) => void;
  onSelectPriority: (priority: FilterPriority) => void;
  onSelectView: (view: SmartView) => void;
}

const INSIGHTS = [
  '“The secret of getting ahead is getting started.” — Mark Twain',
  '“Focus on being productive instead of busy.” — Tim Ferriss',
  '“Small daily improvements over time lead to stunning results.” — Robin Sharma',
  '“Action is the foundational key to all success.” — Pablo Picasso',
];

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  stats,
  currentStatus,
  currentPriority,
  currentView,
  onSelectStatus,
  onSelectPriority,
  onSelectView,
}) => {
  // Stable quote selection
  const insight = INSIGHTS[0];

  return (
    <section aria-label="Task Analytics Dashboard" className="mb-6 space-y-3.5">
      {/* 4-Column Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {/* Total Tasks */}
        <StatCard
          label="Total Tasks"
          value={stats.total}
          icon={Layers}
          variant="indigo"
          subtext="All in pipeline"
          isActive={currentView === 'all' && currentStatus === 'All' && currentPriority === 'All'}
          onClick={() => {
            onSelectView('all');
            onSelectStatus('All');
            onSelectPriority('All');
          }}
        />

        {/* Pending Tasks */}
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={Clock}
          variant="amber"
          subtext="In progress"
          isActive={currentStatus === 'Pending' && currentPriority === 'All'}
          onClick={() => {
            onSelectView('all');
            onSelectStatus('Pending');
            onSelectPriority('All');
          }}
        />

        {/* Completed Tasks */}
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          variant="emerald"
          subtext={`${stats.completionRate}% achieved`}
          isActive={currentStatus === 'Completed' || currentView === 'completed'}
          onClick={() => {
            onSelectView('completed');
            onSelectStatus('All');
            onSelectPriority('All');
          }}
        />

        {/* High Priority Tasks */}
        <StatCard
          label="High Priority"
          value={stats.highPriority}
          icon={Flame}
          variant="rose"
          subtext="Urgent focus"
          isActive={currentPriority === 'High' || currentView === 'high-priority'}
          onClick={() => {
            onSelectView('high-priority');
            onSelectPriority('High');
            onSelectStatus('Pending');
          }}
        />
      </div>

      {/* Progress & Productivity Insight Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5">
        {/* Daily Progress Widget (spans 2 cols on desktop) */}
        <div className="md:col-span-2 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Daily Progress
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {stats.total > 0
                ? `${stats.completed} of ${stats.total} tasks completed`
                : 'No active tasks'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-2.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 min-w-[36px] text-right font-mono">
              {stats.completionRate}%
            </span>
          </div>
        </div>

        {/* Productivity Insight Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/15 dark:border-indigo-500/20 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-snug italic">
            {insight}
          </p>
        </div>
      </div>
    </section>
  );
};
