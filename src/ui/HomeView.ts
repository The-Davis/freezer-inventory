import type { App } from './App';
import type { FreezerItem } from '../models/Item';
import { expiryStatus } from '../models/Item';
import type { Freezer } from '../models/Freezer';
import {
  esc,
  renderHeader,
  bindBackButton,
  ICON_SETTINGS,
  getIcon,
} from './common';

const MAX_DOTS = 8;

export class HomeView {
  constructor(
    private container: HTMLElement,
    private app: App
  ) {}

  async render(): Promise<void> {
    const [items, settings, recent] = await Promise.all([
      this.app.storage.getItems(),
      this.app.storage.getSettings(),
      this.app.storage.getRecentlyRemoved(),
    ]);

    const { freezers } = settings;

    // Count items per freezer per shelf
    const countMap = new Map<string, number[]>(); // freezerId → shelfCounts[]
    for (const freezer of freezers) {
      countMap.set(freezer.id, Array(freezer.shelfCount).fill(0));
    }
    for (const item of items) {
      const counts = countMap.get(item.freezerId);
      if (counts && item.shelf >= 1 && item.shelf <= counts.length) {
        counts[item.shelf - 1]++;
      }
    }

    // Count expiring items across all freezers
    const expiringCount = items.filter((item) => {
      if (!item.expirationDate) return false;
      const s = expiryStatus(item.expirationDate);
      return s === 'expired' || s === 'danger' || s === 'warning';
    }).length;

    document.title = settings.appTitle?.trim() || 'My Inventory';

    const settingsBtn = `
      <button class="icon-btn" id="settings-btn" aria-label="Settings">
        ${ICON_SETTINGS}
      </button>`;

    this.container.innerHTML = `
      <div class="view home-view">
        ${renderHeader('', this.app, settingsBtn)}

        <div class="scroll-view home-scroll">
          <div class="home-logo">
            <span class="home-logo-icon">${getIcon(settings.appIcon)}</span>
            <span class="home-logo-text">${esc(settings.appTitle ?? 'My Inventory')}</span>
          </div>

          ${freezers.map((freezer) =>
            this.renderFreezerCard(
              freezer,
              items.filter((i) => i.freezerId === freezer.id),
              countMap.get(freezer.id) ?? []
            )
          ).join('')}

          <div class="add-freezer-row">
            <button class="btn btn-secondary" id="add-freezer-btn">
              ＋ Add Container
            </button>
          </div>

          ${recent ? `
            <div class="banner" id="recent-banner">
              <span class="banner-text">
                Recently removed: <strong>${esc(recent.name)}</strong>
                ${this.freezerNameFor(recent.freezerId, freezers)
                  ? `<span class="text-muted"> — ${esc(this.freezerNameFor(recent.freezerId, freezers))}</span>`
                  : ''}
              </span>
              <button class="btn-link" id="reStore-btn">Re-store</button>
            </div>` : ''}
        </div>

        <div class="bottom-bar">
          <button class="bottom-btn" id="find-btn">
            <span class="btn-icon-lg">🔍</span>
            Find
          </button>
          <button class="bottom-btn primary" id="store-btn">
            <span class="btn-icon-lg">＋</span>
            Store
          </button>
          <button class="bottom-btn ${expiringCount > 0 ? 'warning' : ''}" id="expiring-btn">
            <span class="btn-icon-lg">⏳</span>
            Expiring
            ${expiringCount > 0 ? `<span class="count-badge">${expiringCount}</span>` : ''}
          </button>
        </div>
      </div>
    `;

    bindBackButton(this.app);

    document.getElementById('settings-btn')!.addEventListener('click', () =>
      void this.app.navigate('settings')
    );
    document.getElementById('find-btn')!.addEventListener('click', () =>
      void this.app.navigate('find')
    );
    document.getElementById('store-btn')!.addEventListener('click', () =>
      void this.app.navigate('store')
    );
    document.getElementById('expiring-btn')!.addEventListener('click', () =>
      void this.app.navigate('expiring')
    );

    document.getElementById('add-freezer-btn')?.addEventListener('click', () =>
      void this.app.navigate('settings')
    );

    // Shelf row click listeners — one per freezer per shelf
    for (const freezer of freezers) {
      for (let s = 1; s <= freezer.shelfCount; s++) {
        document
          .getElementById(`shelf-row-${freezer.id}-${s}`)
          ?.addEventListener('click', () => {
            void this.app.navigate('shelf', {
              freezerId: freezer.id,
              shelfNumber: s,
            });
          });
      }
    }

    if (recent) {
      document.getElementById('reStore-btn')?.addEventListener('click', () =>
        void this.app.navigate('store', { prefillItem: recent, freezerId: recent.freezerId })
      );
    }
  }

  private renderFreezerCard(
    freezer: Freezer,
    freezerItems: FreezerItem[],
    shelfCounts: number[]
  ): string {
    return `
      <div class="freezer-outer" role="list" aria-label="${esc(freezer.name)} shelves">
        <div class="freezer-label-bar">
          <span class="freezer-title-text">
            ${getIcon(freezer.icon)} ${esc(freezer.name)}
          </span>
          <span class="total-count">
            ${freezerItems.length} item${freezerItems.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div class="shelf-list">
          ${shelfCounts.map((count, i) =>
            this.renderShelf(freezer.id, i + 1, count)
          ).join('')}
        </div>
      </div>
    `;
  }

  private renderShelf(freezerId: string, shelfNum: number, count: number): string {
    const filled = Math.min(count, MAX_DOTS);
    const extra  = count > MAX_DOTS ? count - MAX_DOTS : 0;

    const dots = Array.from({ length: MAX_DOTS }, (_, i) =>
      i < filled
        ? '<div class="dot filled" aria-hidden="true"></div>'
        : '<div class="dot empty"  aria-hidden="true"></div>'
    ).join('');

    return `
      <div class="shelf-row"
           id="shelf-row-${esc(freezerId)}-${shelfNum}"
           role="listitem button"
           tabindex="0"
           aria-label="Shelf ${shelfNum}, ${count} item${count !== 1 ? 's' : ''}">
        <span class="shelf-number">Shelf ${shelfNum}</span>
        <div class="shelf-indicator">
          ${count === 0 ? '<span class="shelf-empty-label">empty</span>' : dots}
          ${extra > 0 ? `<span class="dot-overflow">+${extra}</span>` : ''}
        </div>
        <span class="shelf-chevron">›</span>
      </div>
    `;
  }

  private freezerNameFor(freezerId: string, freezers: Freezer[]): string {
    return freezers.find((f) => f.id === freezerId)?.name ?? '';
  }

  destroy(): void {}
}
