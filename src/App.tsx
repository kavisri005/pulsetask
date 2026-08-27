import React, { useState, useEffect } from 'react';
import { useTodos } from './hooks/useTodos';
import { useToast, ToastProvider } from './hooks/useToast';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { StatsOverview } from './components/dashboard/StatsOverview';
import { FilterBar } from './components/filters/FilterBar';
import { ActiveFilters } from './components/filters/ActiveFilters';
import { TaskList } from './components/tasks/TaskList';
import { TaskModal } from './components/modals/TaskModal';
import { DeleteModal } from './components/modals/DeleteModal';
import { ToastContainer } from './components/ui/Toast';
import type { Task, TaskFormData } from './types/todo';

const TodoAppContent: React.FC = () => {
  const {
    tasks,
    filteredTasks,
    stats,
    filters,
    hasActiveFilters,
    addTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setSortBy,
    setSmartView,
    resetFilters,
    resetToSampleTasks,
  } = useTodos();

  const { toast } = useToast();

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Global 'N' keyboard shortcut to open task modal
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'n' || e.key === 'N') &&
        !isTaskModalOpen &&
        !deletingTask &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        e.preventDefault();
        setEditingTask(null);
        setIsTaskModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isTaskModalOpen, deletingTask]);

  // Focus Search Bar handler
  const handleFocusSearch = () => {
    const searchInput = document.querySelector('input[type="text"][aria-label="Search tasks"]') as HTMLInputElement | null;
    searchInput?.focus();
  };

  // Add/Edit Submission
  const handleTaskFormSubmit = (formData: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, formData);
      toast.success('Task updated successfully', `"${formData.title}" was saved.`);
    } else {
      addTask(formData);
      toast.success('Task created successfully', `"${formData.title}" added to pipeline.`);
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  // Toggle Status
  const handleToggleStatus = (id: string) => {
    const result = toggleTaskStatus(id);
    if (!result) return;

    if (result.newStatus === 'Completed') {
      toast.success('Task completed', `"${result.task.title}" is done!`);
    } else {
      toast.info('Task moved to pending', `"${result.task.title}" is back in progress.`);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (task: Task) => {
    setDeletingTask(task);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingTask) return;
    const taskTitle = deletingTask.title;
    deleteTask(deletingTask.id);
    toast.warning('Task deleted', `"${taskTitle}" was removed.`);
    setDeletingTask(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header */}
      <Header
        onOpenAddTask={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        onFocusSearch={handleFocusSearch}
      />

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Smart Views Compact Sidebar */}
          <Sidebar
            currentView={filters.view}
            onSelectView={setSmartView}
            stats={stats}
            onResetSampleData={() => {
              resetToSampleTasks();
              toast.info('Reset demo workspace', 'Restored 5 sample productivity tasks.');
            }}
          />

          {/* Main Dashboard & Task Workspace */}
          <main className="flex-1 min-w-0 w-full">
            {/* Dashboard Analytics & Progress Overview */}
            <StatsOverview
              stats={stats}
              currentStatus={filters.status}
              currentPriority={filters.priority}
              currentView={filters.view}
              onSelectStatus={setStatusFilter}
              onSelectPriority={setPriorityFilter}
              onSelectView={setSmartView}
            />

            {/* Filter Controls & Search */}
            <FilterBar
              search={filters.search}
              onSearchChange={setSearch}
              status={filters.status}
              onStatusChange={setStatusFilter}
              priority={filters.priority}
              onPriorityChange={setPriorityFilter}
              sortBy={filters.sortBy}
              onSortByChange={setSortBy}
              stats={stats}
              matchingCount={filteredTasks.length}
            />

            {/* Active Filter Chips with Reset */}
            <ActiveFilters
              search={filters.search}
              onClearSearch={() => setSearch('')}
              status={filters.status}
              onResetStatus={() => setStatusFilter('All')}
              priority={filters.priority}
              onResetPriority={() => setPriorityFilter('All')}
              view={filters.view}
              onResetView={() => setSmartView('all')}
              onClearAll={resetFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Task Cards Grid */}
            <TaskList
              tasks={filteredTasks}
              totalTasksCount={tasks.length}
              hasActiveFilters={hasActiveFilters}
              onToggleStatus={handleToggleStatus}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onOpenAddTask={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onClearFilters={resetFilters}
              onLoadSampleData={resetToSampleTasks}
            />
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskFormSubmit}
        initialTask={editingTask}
      />

      <DeleteModal
        isOpen={Boolean(deletingTask)}
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <TodoAppContent />
    </ToastProvider>
  );
}
