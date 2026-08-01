export interface FreezerItem {
  id: string;
  name: string;
  shelf: number;
  storedAt: string;        // ISO date-time string
  brand?: string;
  category?: string;
  weightOz?: number;
  volumeOz?: number;
  expirationDate?: string; // YYYY-MM-DD date string
  notes?: string;
}

export function generateId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const CATEGORIES: string[] = [
  'Meat & Poultry',
  'Seafood',
  'Vegetables',
  'Fruits',
  'Prepared Meals',
  'Dairy',
  'Bread & Baked Goods',
  'Soups & Stocks',
  'Desserts',
  'Other',
];

/**
 * Returns the number of days until expiration (negative = already expired).
 */
export function daysUntilExpiry(expirationDate: string): number {
  const exp = new Date(expirationDate + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export type ExpiryStatus = 'expired' | 'danger' | 'warning' | 'ok';

/**
 * Returns a status code based on how soon the item expires.
 * expired  → already past expiration
 * danger   → within 3 days
 * warning  → within 14 days
 * ok       → more than 14 days away
 */
export function expiryStatus(expirationDate: string): ExpiryStatus {
  const days = daysUntilExpiry(expirationDate);
  if (days < 0) return 'expired';
  if (days <= 3) return 'danger';
  if (days <= 14) return 'warning';
  return 'ok';
}

/** Format an ISO date-time string for display (e.g. "Jul 31, 2026"). */
export function formatStoredDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Format a YYYY-MM-DD date string for display (e.g. "Jul 31, 2026"). */
export function formatExpiryDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
