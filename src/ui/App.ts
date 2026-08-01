import type { IStorage } from '../storage/IStorage';
import type { FreezerItem } from '../models/Item';
import { HomeView } from './HomeView';
import { ShelfView } from './ShelfView';
import { FindView } from './FindView';
import { StoreView } from './StoreView';
import { ExpiringView } from './ExpiringView';
import { SettingsView } from './SettingsView';
import { RemoveConfirmView } from './RemoveConfirmView';

export type ViewName =
  | 'home'
  | 'shelf'
  | 'find'
  | 'store'
  | 'expiring'
  | 'settings'
  | 'remove-confirm';

export interface NavParams {
  freezerId?: string;
  shelfNumber?: number;
  itemId?: string;
  prefillItem?: FreezerItem;
}

interface NavEntry {
  view: ViewName;
  params: NavParams;
}

export class App {
  public readonly storage: IStorage;
  private container: HTMLElement;
  private history: NavEntry[] = [];

  constructor(container: HTMLElement, storage: IStorage) {
    this.container = container;
    this.storage = storage;
  }

  async showHome(): Promise<void> {
    await this.navigate('home', {}, true);
  }

  async navigate(
    view: ViewName,
    params: NavParams = {},
    clearHistory = false
  ): Promise<void> {
    if (clearHistory) this.history = [];
    this.history.push({ view, params });
    await this.mountView(view, params);
  }

  async goBack(): Promise<void> {
    if (this.history.length > 1) {
      this.history.pop();
      const prev = this.history[this.history.length - 1];
      await this.mountView(prev.view, prev.params);
    } else {
      await this.navigate('home', {}, true);
    }
  }

  canGoBack(): boolean {
    return this.history.length > 1;
  }

  async handleQRRemove(id: string): Promise<void> {
    await this.navigate('remove-confirm', { itemId: id }, true);
  }

  private async mountView(view: ViewName, params: NavParams): Promise<void> {
    this.container.innerHTML = '';
    this.container.className = 'view-container';

    let viewInstance: { render(): Promise<void> };

    switch (view) {
      case 'home':
        viewInstance = new HomeView(this.container, this);
        break;
      case 'shelf':
        viewInstance = new ShelfView(
          this.container,
          this,
          params.freezerId ?? '',
          params.shelfNumber ?? 1
        );
        break;
      case 'find':
        viewInstance = new FindView(this.container, this);
        break;
      case 'store':
        viewInstance = new StoreView(
          this.container,
          this,
          params.prefillItem,
          params.freezerId
        );
        break;
      case 'expiring':
        viewInstance = new ExpiringView(this.container, this);
        break;
      case 'settings':
        viewInstance = new SettingsView(this.container, this);
        break;
      case 'remove-confirm':
        viewInstance = new RemoveConfirmView(
          this.container,
          this,
          params.itemId ?? ''
        );
        break;
      default:
        viewInstance = new HomeView(this.container, this);
    }

    await viewInstance.render();
  }
}
