import type { FreezerItem } from '../models/Item';
import { type IStorage, type AppSettings, type AppState } from './IStorage';

const BASE = '/api';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`Server error ${res.status}: ${await res.text()}`);
  }
  // 204 No Content → return undefined cast to T
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

/**
 * Server storage adapter — thin fetch wrapper over the Express REST API.
 * Mirrors the LocalStorageAdapter API exactly.
 */
export class ServerStorageAdapter implements IStorage {
  async getItems(): Promise<FreezerItem[]> {
    return request<FreezerItem[]>('/items');
  }

  async saveItem(item: FreezerItem): Promise<void> {
    return request<void>('/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateItem(item: FreezerItem): Promise<void> {
    return request<void>(`/items/${item.id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async removeItem(id: string): Promise<void> {
    return request<void>(`/items/${id}`, { method: 'DELETE' });
  }

  async getSettings(): Promise<AppSettings> {
    return request<AppSettings>('/settings');
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    return request<void>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getRecentlyRemoved(): Promise<FreezerItem | null> {
    return request<FreezerItem | null>('/recent');
  }

  async saveRecentlyRemoved(item: FreezerItem | null): Promise<void> {
    return request<void>('/recent', {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async exportState(): Promise<AppState> {
    return request<AppState>('/state');
  }

  async importState(state: AppState): Promise<void> {
    return request<void>('/state', {
      method: 'PUT',
      body: JSON.stringify(state),
    });
  }
}
