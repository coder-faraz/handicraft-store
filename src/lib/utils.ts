// FILE: src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid } from 'date-fns';

/**
 * Merge Tailwind CSS class names without conflicts.
 * Combines clsx (conditional classes) + tailwind-merge (deduplication).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Indian Rupees.
 * e.g. 1234.5 → '₹1,235'
 * e.g. 12345  → '₹12,345'
 */
export function formatPrice(amount: number, showDecimal = false): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimal ? 2 : 0,
    maximumFractionDigits: showDecimal ? 2 : 0,
  }).format(amount);
}

/**
 * Convert a string to a URL-safe slug.
 * e.g. 'Handcrafted Wooden Box!' → 'handcrafted-wooden-box'
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // spaces → hyphens
    .replace(/[^\w\-]+/g, '')       // remove non-word chars
    .replace(/\-\-+/g, '-')         // multiple hyphens → single
    .replace(/^-+/, '')             // trim leading hyphens
    .replace(/-+$/, '');            // trim trailing hyphens
}

/**
 * Truncate a string to a maximum length, appending '…' if cut.
 * e.g. truncate('Hello World', 7) → 'Hello W…'
 */
export function truncate(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Format a Date, ISO string, or timestamp to a human-readable string.
 * Default pattern: 'dd MMM yyyy' → '14 Jun 2026'
 */
export function formatDate(
  date: Date | string | number,
  pattern = 'dd MMM yyyy'
): string {
  try {
    let d: Date;
    if (typeof date === 'string') {
      d = parseISO(date);
    } else if (typeof date === 'number') {
      d = new Date(date);
    } else {
      d = date;
    }
    if (!isValid(d)) return '—';
    return format(d, pattern);
  } catch {
    return '—';
  }
}

/**
 * Format a datetime for order/invoice display.
 * e.g. '14 Jun 2026, 04:30 PM'
 */
export function formatDateTime(date: Date | string | number): string {
  return formatDate(date, 'dd MMM yyyy, hh:mm aa');
}

/**
 * Calculate discount percentage between original and sale price.
 */
export function calculateDiscount(price: number, salePrice: number): number {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

/**
 * Generate a random alphanumeric order number.
 * e.g. 'LMC-2026-AB12CD'
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LMC-${year}-${random}`;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Deep merge two objects (shallow for arrays).
 */
export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    const srcVal = source[key];
    if (srcVal && typeof srcVal === 'object' && !Array.isArray(srcVal)) {
      result[key] = deepMerge(result[key] as any, srcVal as any);
    } else {
      result[key] = srcVal as any;
    }
  }
  return result;
}

/**
 * Debounce a function call.
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Parse a query string value to number, returning fallback if invalid.
 */
export function parseQueryInt(val: string | null | undefined, fallback: number): number {
  const n = parseInt(val ?? '', 10);
  return isNaN(n) ? fallback : n;
}
