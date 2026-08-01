import type { FreezerItem } from '../models/Item';
import { resolveFreezerId } from '../models/Item';
import { DEFAULT_FREEZER_ID, DEFAULT_FREEZER } from '../models/Freezer';
import { type IStorage, type AppSettings, DEFAULT_SETTINGS } from './IStorage';

const ITEMS_KEY    = 'fi_items_v1';
const SETTINGS_KEY = 'fi_settings_v1';
const RECENT_KEY   = 'fi_recent_v1';

function safeParseJSON<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Migrate settings from the old single-freezer format (`{ shelfCount: N }`)
 * to the new multi-freezer format (`{ freezers: [...] }`).
 */
function migrateSettings(raw: Record<string, unknown>): AppSettings {
  // New format — already has freezers array
  if (Array.isArray(raw['freezers']) && raw['freezers'].length > 0) {
    return { freezers: raw['freezers'] as AppSettings['freezers'] };
  }

  // Old format — has shelfCount, create a single default freezer
  const oldCount =
    typeof raw['shelfCount'] === 'number' ? raw['shelfCount'] : 4;
  return {
    freezers: [{ ...DEFAULT_FREEZER, shelfCount: oldCount }],
  };
}

/**
 * Ensure every item has a `freezerId`.  Items stored before multi-freezer
 * support was added will lack the field; default them to the first freezer.
 */
function normaliseItem(
  item: Partial<FreezerItem>,
  firstFreezerId: string
): FreezerItem {
  return {
    ...(item as FreezerItem),
    freezerId: item.freezerId ?? firstFreezerId,
  };
}

export class LocalStorageAdapter implements IStorage {
  async getItems(): Promise<FreezerItem[]> {
    const settings = await this.getSettings();
    const firstId = settings.freezers[0]?.id ?? DEFAULT_FREEZER_ID;
    const raw = safeParseJSON<Partial<FreezerItem>[]>(
      localStorage.getItem(ITEMS_KEY),
      []
    );
    return raw.map((i) => normaliseItem(i, firstId));
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
    const raw = safeParseJSON<Record<string, unknown>>(
      localStorage.getItem(SETTINGS_KEY),
      {}
    );
    if (Object.keys(raw).length === 0) return { ...DEFAULT_SETTINGS };
    return migrateSettings(raw);
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  async getRecentlyRemoved(): Promise<FreezerItem | null> {
    return safeParseJSON<FreezerItem | null>(
      localStorage.getItem(RECENT_KEY),
      null
    );
  }

  async saveRecentlyRemoved(item: FreezerItem | null): Promise<void> {
    if (item === null) {
      localStorage.removeItem(RECENT_KEY);
    } else {
      localStorage.setItem(RECENT_KEY, JSON.stringify(item));
    }
  }
}
