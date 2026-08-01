export interface Freezer {
  id: string;
  name: string;
  shelfCount: number;
  icon?: string;
}

export const DEFAULT_FREEZER_ID = 'freezer-default';

/**
 * Create a new Freezer object with a unique time-based ID.
 */
export function createFreezer(name: string, shelfCount = 4, icon = 'snowflake'): Freezer {
  const rand = Math.random().toString(36).slice(2, 7);
  return {
    id: `freezer-${Date.now()}-${rand}`,
    name,
    shelfCount,
    icon,
  };
}

/** The single default freezer used when no freezers are configured. */
export const DEFAULT_FREEZER: Freezer = {
  id: DEFAULT_FREEZER_ID,
  name: 'My Container',
  shelfCount: 4,
  icon: 'snowflake',
};
