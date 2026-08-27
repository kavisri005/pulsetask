import type { Status } from '../types/todo';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Parses a 'YYYY-MM-DD' calendar date string safely without UTC timezone shift.
 */
export function parseCalendarDate(dateStr: string): { year: number; month: number; day: number } | null {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const parts = dateStr.trim().split('-');
  if (parts.length !== 3) return null;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10); // 1-12
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  // Validate actual days in month
  const testDate = new Date(year, month - 1, day);
  if (
    testDate.getFullYear() !== year ||
    testDate.getMonth() !== month - 1 ||
    testDate.getDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

/**
 * Gets today's local date in 'YYYY-MM-DD' format.
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a calendar date string (YYYY-MM-DD) into a human-friendly format (e.g., 'Aug 30, 2026').
 */
export function formatDueDate(dateStr: string): string {
  const parsed = parseCalendarDate(dateStr);
  if (!parsed) return 'No due date';

  const monthName = MONTH_NAMES[parsed.month - 1];
  return `${monthName} ${parsed.day}, ${parsed.year}`;
}

/**
 * Calculates the difference in whole calendar days between a given date and today.
 * Positive = future, Negative = past, 0 = today.
 */
export function getDayDifference(dateStr: string): number | null {
  const parsed = parseCalendarDate(dateStr);
  if (!parsed) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(parsed.year, parsed.month - 1, parsed.day);

  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Returns whether a task is overdue.
 * CRITICAL RULE: Completed tasks are NEVER overdue.
 */
export function isOverdue(dateStr: string, status: Status): boolean {
  if (status === 'Completed') return false;

  const diff = getDayDifference(dateStr);
  if (diff === null) return false;

  return diff < 0;
}

/**
 * Returns whether a date matches today's local date.
 */
export function isDueToday(dateStr: string): boolean {
  const diff = getDayDifference(dateStr);
  return diff === 0;
}

/**
 * Returns whether a date matches tomorrow's local date.
 */
export function isDueTomorrow(dateStr: string): boolean {
  const diff = getDayDifference(dateStr);
  return diff === 1;
}

/**
 * Returns whether a date is in the future.
 */
export function isUpcomingDate(dateStr: string): boolean {
  const diff = getDayDifference(dateStr);
  return diff !== null && diff > 0;
}

/**
 * Gets a contextual, human-friendly due date descriptor with relative SaaS badge labels.
 */
export function getDueDateDescriptor(dateStr: string, status: Status): {
  formattedText: string;
  relativeText: string;
  isOverdueState: boolean;
  isTodayState: boolean;
  isTomorrowState: boolean;
  daysDiff: number | null;
} {
  const diff = getDayDifference(dateStr);
  const isOver = isOverdue(dateStr, status);
  const isToday = isDueToday(dateStr);
  const isTomorrow = isDueTomorrow(dateStr);
  const formatted = formatDueDate(dateStr);

  let relative = formatted;

  if (isOver) {
    if (diff === -1) {
      relative = 'Yesterday';
    } else if (diff !== null && diff < -1) {
      relative = `${Math.abs(diff)}d overdue`;
    }
  } else if (isToday) {
    relative = 'Today';
  } else if (isTomorrow) {
    relative = 'Tomorrow';
  } else if (diff !== null && diff > 1 && diff <= 7) {
    relative = `In ${diff} days`;
  }

  return {
    formattedText: formatted,
    relativeText: relative,
    isOverdueState: isOver,
    isTodayState: isToday,
    isTomorrowState: isTomorrow,
    daysDiff: diff,
  };
}

/**
 * Validates whether an input string is a valid YYYY-MM-DD date.
 */
export function isValidDateString(dateStr: string): boolean {
  return parseCalendarDate(dateStr) !== null;
}
