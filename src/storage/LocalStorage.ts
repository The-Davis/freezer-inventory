import type { FreezerItem } from '../models/Item';
import { type IStorage, type AppSettings, DEFAULT_SETTINGS } from './IStorage';

const ITEMS_KEY = 'fi_items_v1';
const SETTINGS_KEY = 'fi_settings_v1';
const RECENT_KEY = 'fi_recent_v1';

function safeParseJSON<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Browser localStorage implementation of IStorage.
 * All methods are async to match the IStorage interface (so UI code is
 * identical regardless of which adapter is active).
 */
export class LocalStorageAdapter implements IStorage {
  async getItems(): Promise<FreezerItem[]> {
    return safeParseJSON<FreezerItem[]>(localStorage.getItem(ITEMS_KEY), []);
  }

  private async setItems(items: FreezerItem[]): Promise<void> {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  }

  async saveItem(item: FreezerItem): Promise<void> {
    const items = await this.getItems();
    items.push(item);
    await this.setItems(items);
  }

  async updateItem(item: FreezerItem): Promise<void> {
    const items = await this.getItems();
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      items[idx] = item;
      await this.setItems(items);
    }
  }

  async removeItem(id: string): Promise<void> {
    const items = await this.getItems();
    await this.setItems(items.filter((i) => i.id !== id));
  }

  async getSettings(): Promise<AppSettings> {
    return {
      ...DEFAULT_SETTINGS,
      ...safeParseJSON<Partial<AppSettings>>(localStorage.getItem(SETTINGS_KEY), {}),
    };
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  async getRecentlyRemoved(): Promise<FreezerItem | null> {
    return safeParseJSON<FreezerItem | null>(localStorage.getItem(RECENT_KEY), null);
  }

  async saveRecentlyRemoved(item: FreezerItem | null): Promise<void> {
    if (item === null) {
      localStorage.removeItem(RECENT_KEY);
    } else {
      localStorage.setItem(RECENT_KEY, JSON.stringify(item));
    }
  }
}
