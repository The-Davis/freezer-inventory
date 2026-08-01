import type { FreezerItem } from '../models/Item';

export interface AppSettings {
  shelfCount: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  shelfCount: 4,
};

/**
 * Storage adapter interface — implemented by LocalStorageAdapter (browser)
 * and ServerStorageAdapter (LAN server). UI code targets this interface
 * exclusively so it is completely storage-agnostic.
 */
export interface IStorage {
  /** Return all currently-stored (active) freezer items. */
  getItems(): Promise<FreezerItem[]>;

  /** Persist a brand-new item. */
  saveItem(item: FreezerItem): Promise<void>;

  /** Replace an existing item (matched by id). */
  updateItem(item: FreezerItem): Promise<void>;

  /** Permanently delete an item by id. */
  removeItem(id: string): Promise<void>;

  /** Return application-level settings. */
  getSettings(): Promise<AppSettings>;

  /** Persist application-level settings. */
  saveSettings(settings: AppSettings): Promise<void>;

  /**
   * Return the single most-recently-removed item, or null if none.
   * Only one item is stored at a time; removing a second item replaces it.
   */
  getRecentlyRemoved(): Promise<FreezerItem | null>;

  /** Persist (or clear) the recently-removed item. */
  saveRecentlyRemoved(item: FreezerItem | null): Promise<void>;
}
