import type { FreezerItem } from '../models/Item';
import type { Freezer } from '../models/Freezer';
import { DEFAULT_FREEZER } from '../models/Freezer';

export interface AppSettings {
  appTitle?: string;
  appIcon?: string;
  /** Ordered list of containers.  Always contains at least one entry. */
  freezers: Freezer[];
}

export interface AppState {
  version: number;
  settings: AppSettings;
  items: FreezerItem[];
  recent: FreezerItem | null;
}

export const DEFAULT_SETTINGS: AppSettings = {
  appTitle: 'My Inventory',
  appIcon: 'snowflake',
  freezers: [DEFAULT_FREEZER],
};

/**
 * Storage adapter interface — implemented by LocalStorageAdapter (browser)
 * and ServerStorageAdapter (LAN server).
 */
export interface IStorage {
  getItems(): Promise<FreezerItem[]>;
  saveItem(item: FreezerItem): Promise<void>;
  updateItem(item: FreezerItem): Promise<void>;
  removeItem(id: string): Promise<void>;
  getSettings(): Promise<AppSettings>;
  saveSettings(settings: AppSettings): Promise<void>;
  getRecentlyRemoved(): Promise<FreezerItem | null>;
  saveRecentlyRemoved(item: FreezerItem | null): Promise<void>;
  exportState(): Promise<AppState>;
  importState(state: AppState): Promise<void>;
}
