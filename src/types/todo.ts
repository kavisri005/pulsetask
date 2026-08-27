export type Priority = 'Low' | 'Medium' | 'High';

export type Status = 'Pending' | 'Completed';

export type FilterStatus = 'All' | 'Pending' | 'Completed';

export type FilterPriority = 'All' | 'Low' | 'Medium' | 'High';

export type SmartView =
  | 'all'
  | 'today'
  | 'upcoming'
  | 'completed'
  | 'high-priority'
  | 'overdue';

export type SortOption =
  | 'dueDate-asc'
  | 'dueDate-desc'
  | 'priority-desc'
  | 'priority-asc'
  | 'created-desc'
  | 'created-asc'
  | 'title-asc';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string; // Stored as 'YYYY-MM-DD'
  status: Status;
  category?: string; // Optional tag/category: 'Work' | 'Personal' | 'Project' | 'Engineering' | 'Design'
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  category?: string;
}

export interface TaskValidationErrors {
  title?: string;
  dueDate?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  completed: number;
  highPriority: number;
  overdue: number;
  dueToday: number;
  completionRate: number;
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

export interface FilterState {
  search: string;
  status: FilterStatus;
  priority: FilterPriority;
  sortBy: SortOption;
  view: SmartView;
}
