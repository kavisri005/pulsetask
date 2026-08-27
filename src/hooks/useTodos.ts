import { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  Task,
  TaskFormData,
  TaskStats,
  FilterState,
  Status,
  FilterStatus,
  FilterPriority,
  SmartView,
  SortOption,
  Priority,
} from '../types/todo';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';
import { INITIAL_SAMPLE_TASKS } from '../utils/sampleData';
import { isDueToday, isOverdue, isUpcomingDate } from '../utils/dateUtils';

const PRIORITY_WEIGHT: Record<Priority, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

const INITIAL_FILTERS: FilterState = {
  search: '',
  status: 'All',
  priority: 'All',
  sortBy: 'dueDate-asc',
  view: 'all',
};

export function useTodos() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Sync state to LocalStorage whenever tasks change
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Compute live dashboard & smart view metrics
  const stats: TaskStats = useMemo(() => {
    const total = tasks.length;
    let pending = 0;
    let completed = 0;
    let highPriority = 0;
    let overdue = 0;
    let dueToday = 0;

    for (const t of tasks) {
      if (t.status === 'Completed') {
        completed++;
      } else {
        pending++;
        if (t.priority === 'High') {
          highPriority++;
        }
        if (isOverdue(t.dueDate, t.status)) {
          overdue++;
        }
        if (isDueToday(t.dueDate)) {
          dueToday++;
        }
      }
    }

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, pending, completed, highPriority, overdue, dueToday, completionRate };
  }, [tasks]);

  // Add Task
  const addTask = useCallback((formData: TaskFormData): Task => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      title: formData.title.trim(),
      description: (formData.description || '').trim(),
      priority: formData.priority,
      dueDate: formData.dueDate.trim(),
      category: (formData.category || 'General').trim(),
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  // Update Task
  const updateTask = useCallback((id: string, formData: TaskFormData): Task | null => {
    let updatedItem: Task | null = null;
    const now = new Date().toISOString();

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          updatedItem = {
            ...t,
            title: formData.title.trim(),
            description: (formData.description || '').trim(),
            priority: formData.priority,
            dueDate: formData.dueDate.trim(),
            category: (formData.category || t.category || 'General').trim(),
            updatedAt: now,
          };
          return updatedItem;
        }
        return t;
      })
    );

    return updatedItem;
  }, []);

  // Toggle Task Status (Pending <-> Completed)
  const toggleTaskStatus = useCallback((id: string): { task: Task; newStatus: Status } | null => {
    let result: { task: Task; newStatus: Status } | null = null;
    const now = new Date().toISOString();

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus: Status = t.status === 'Pending' ? 'Completed' : 'Pending';
          const updated: Task = {
            ...t,
            status: newStatus,
            updatedAt: now,
          };
          result = { task: updated, newStatus };
          return updated;
        }
        return t;
      })
    );

    return result;
  }, []);

  // Delete Task
  const deleteTask = useCallback((id: string): boolean => {
    let deleted = false;
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === id);
      if (exists) {
        deleted = true;
        return prev.filter((t) => t.id !== id);
      }
      return prev;
    });
    return deleted;
  }, []);

  // Reset to initial demo tasks
  const resetToSampleTasks = useCallback(() => {
    setTasks(INITIAL_SAMPLE_TASKS);
  }, []);

  // Clear all tasks
  const clearAllTasks = useCallback(() => {
    setTasks([]);
  }, []);

  // Filter & Search controls
  const setSearch = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  }, []);

  const setStatusFilter = useCallback((status: FilterStatus) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setPriorityFilter = useCallback((priority: FilterPriority) => {
    setFilters((prev) => ({ ...prev, priority }));
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const setSmartView = useCallback((view: SmartView) => {
    setFilters((prev) => {
      // Map view to appropriate defaults or keep independent
      return { ...prev, view };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  // Filtered and sorted tasks pipeline
  const filteredTasks = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return tasks
      .filter((task) => {
        // Smart View filtering
        if (filters.view === 'today') {
          if (!isDueToday(task.dueDate)) return false;
        } else if (filters.view === 'upcoming') {
          if (!isUpcomingDate(task.dueDate) || task.status === 'Completed') return false;
        } else if (filters.view === 'completed') {
          if (task.status !== 'Completed') return false;
        } else if (filters.view === 'high-priority') {
          if (task.priority !== 'High' || task.status === 'Completed') return false;
        } else if (filters.view === 'overdue') {
          if (!isOverdue(task.dueDate, task.status)) return false;
        }

        // Status filter
        if (filters.status !== 'All' && task.status !== filters.status) {
          return false;
        }

        // Priority filter
        if (filters.priority !== 'All' && task.priority !== filters.priority) {
          return false;
        }

        // Search query (matches title, description, or category)
        if (query.length > 0) {
          const titleMatch = task.title.toLowerCase().includes(query);
          const descMatch = task.description.toLowerCase().includes(query);
          const catMatch = task.category ? task.category.toLowerCase().includes(query) : false;
          if (!titleMatch && !descMatch && !catMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'dueDate-asc':
            return a.dueDate.localeCompare(b.dueDate);
          case 'dueDate-desc':
            return b.dueDate.localeCompare(a.dueDate);
          case 'priority-desc':
            return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
          case 'priority-asc':
            return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
          case 'created-desc':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'created-asc':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'title-asc':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [tasks, filters]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search.trim().length > 0 ||
      filters.status !== 'All' ||
      filters.priority !== 'All' ||
      filters.view !== 'all' ||
      filters.sortBy !== 'dueDate-asc'
    );
  }, [filters]);

  return {
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
    clearAllTasks,
  };
}
