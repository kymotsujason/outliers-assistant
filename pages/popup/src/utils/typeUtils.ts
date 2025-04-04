/**
 * Type guard functions and utilities for safely working with unknown data
 */

// Type guard functions
export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number';
};

/**
 * Type guard to check if a value is a boolean
 */
export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

// Helper function to safely access nested properties
export const safeAccess = (obj: unknown, path: string[]): unknown => {
  let current: unknown = obj;
  for (const key of path) {
    if (!isRecord(current)) {
      return undefined;
    }
    current = current[key];
  }
  return current;
};

// Helper function to safely convert to date string
export const safeDate = (value: unknown): string => {
  if (!value) return 'N/A';
  try {
    return new Date(String(value)).toLocaleString();
  } catch {
    console.error('Invalid date format:', value);
    return 'N/A';
  }
};

// Helper to safely convert a value to string with fallback
export const safeString = (value: unknown, fallback = 'N/A'): string => {
  if (isString(value)) return value;
  if (isNumber(value) || isBoolean(value)) return String(value);
  return fallback;
};
