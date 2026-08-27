import React from 'react';
import type { Task } from '../../types/todo';
import { TaskCard } from './TaskCard';
import { TaskEmptyState } from './TaskEmptyState';

interface TaskListProps {
  tasks: Task[];
  totalTasksCount: number;
  hasActiveFilters: boolean;
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onOpenAddTask: () => void;
  onClearFilters: () => void;
  onLoadSampleData: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  totalTasksCount,
  hasActiveFilters,
  onToggleStatus,
  onEdit,
  onDelete,
  onOpenAddTask,
  onClearFilters,
  onLoadSampleData,
}) => {
  // If zero total tasks in entire app
  if (totalTasksCount === 0) {
    return (
      <TaskEmptyState
        isFilterEmpty={false}
        onOpenAddTask={onOpenAddTask}
        onLoadSampleData={onLoadSampleData}
      />
    );
  }

  // If filtered down to 0
  if (tasks.length === 0) {
    return (
      <TaskEmptyState
        isFilterEmpty={true}
        onOpenAddTask={onOpenAddTask}
        onClearFilters={hasActiveFilters ? onClearFilters : undefined}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3.5 sm:gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
