import type { Task, Priority, Status } from '../types/todo';
import { INITIAL_SAMPLE_TASKS } from './sampleData';

export const STORAGE_KEY = 'todo-app-tasks';
export const THEME_STORAGE_KEY = 'todo-app-theme';

const VALID_PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];
const VALID_STATUSES: Status[] = ['Pending', 'Completed'];

/**
 * Validates whether an unknown object conforms to the Task interface.
 */
export function isValidTask(item: unknown): item is Task {
  if (!item || typeof item !== 'object') return false;

  const candidate = item as Record<string, unknown>;

  const hasValidId = typeof candidate.id === 'string' && candidate.id.trim().length > 0;
  const hasValidTitle = typeof candidate.title === 'string' && candidate.title.trim().length > 0;
  const hasValidDesc = typeof candidate.description === 'string';
  const hasValidPriority =
    typeof candidate.priority === 'string' &&
    VALID_PRIORITIES.includes(candidate.priority as Priority);
  const hasValidDueDate = typeof candidate.dueDate === 'string' && candidate.dueDate.trim().length > 0;
  const hasValidStatus =
    typeof candidate.status === 'string' &&
    VALID_STATUSES.includes(candidate.status as Status);
  const hasValidCreatedAt = typeof candidate.createdAt === 'string';
  const hasValidUpdatedAt = typeof candidate.updatedAt === 'string';

  return (
    hasValidId &&
    hasValidTitle &&
    hasValidDesc &&
    hasValidPriority &&
    hasValidDueDate &&
    hasValidStatus &&
    hasValidCreatedAt &&
    hasValidUpdatedAt
  );
}

/**
 * Reads tasks from LocalStorage with schema validation and automatic corruption recovery.
 */
export function loadTasksFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      // First-time visit: seed with initial sample data
      saveTasksToStorage(INITIAL_SAMPLE_TASKS);
      return INITIAL_SAMPLE_TASKS;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('LocalStorage data is not an array, falling back to sample tasks.');
      return INITIAL_SAMPLE_TASKS;
    }

    // Filter and recover valid tasks
    const recoveredTasks: Task[] = parsed.filter(isValidTask);

    // If array was populated but every element was invalid, return fallback
    if (parsed.length > 0 && recoveredTasks.length === 0) {
      console.warn('All tasks in LocalStorage were malformed. Recovering fallback tasks.');
      return INITIAL_SAMPLE_TASKS;
    }

    return recoveredTasks;
  } catch (error) {
    console.error('Failed to load tasks from LocalStorage due to corruption:', error);
    return INITIAL_SAMPLE_TASKS;
  }
}

/**
 * Persists tasks array to LocalStorage.
 */
export function saveTasksToStorage(tasks: Task[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Failed to save tasks to LocalStorage:', error);
    return false;
  }
}
