import type { App } from './App';
import type { FreezerItem } from '../models/Item';
import { expiryStatus } from '../models/Item';
import {
  esc,
  renderHeader,
  bindBackButton,
  ICON_SETTINGS,
  ICON_SNOWFLAKE,
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

    // Count items per shelf
    const shelfCounts: number[] = Array(settings.shelfCount).fill(0);
    for (const item of items) {
      const idx = item.shelf - 1;
      if (idx >= 0 && idx < settings.shelfCount) {
        shelfCounts[idx]++;
      }
    }

    // Count expiring items (within 14 days)
    const expiringCount = items.filter((item) => {
      if (!item.expirationDate) return false;
      const s = expiryStatus(item.expirationDate);
      return s === 'expired' || s === 'danger' || s === 'warning';
    }).length;

    const settingsBtn = `
      <button class="icon-btn" id="settings-btn" aria-label="Settings">
        ${ICON_SETTINGS}
      </button>`;

    this.container.innerHTML = `
      <div class="view home-view">
        ${renderHeader('', this.app, settingsBtn)}

        <div class="scroll-view home-scroll">
          <!-- Logo area -->
          <div class="home-logo">
            <span class="home-logo-icon">${ICON_SNOWFLAKE}</span>
            <span class="home-logo-text">Freezer</span>
          </div>

          <!-- Freezer visualization -->
          <div class="freezer-outer" role="list" aria-label="Freezer shelves">
            <div class="freezer-label-bar">
              <span class="freezer-title-text">
                ${ICON_SNOWFLAKE} INVENTORY
              </span>
              <span class="total-count">${items.length} item${items.length !== 1 ? 's' : ''}</span>
            </div>

            <div class="shelf-list">
              ${shelfCounts.map((count, i) => this.renderShelf(i + 1, count)).join('')}
            </div>
          </div>

          <!-- Recently removed banner -->
          ${
            recent
              ? `<div class="banner" id="recent-banner">
                   <span class="banner-text">
                     Recently removed: <strong>${esc(recent.name)}</strong>
                   </span>
                   <button class="btn-link" id="reStore-btn">Re-store</button>
                 </div>`
              : ''
          }
        </div>

        <!-- Bottom action bar -->
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

    // ── Event listeners ────────────────────────────────────────────────────
    bindBackButton(this.app);

    document.getElementById('settings-btn')!.addEventListener('click', () => {
      void this.app.navigate('settings');
    });

    document.getElementById('find-btn')!.addEventListener('click', () => {
      void this.app.navigate('find');
    });

    document.getElementById('store-btn')!.addEventListener('click', () => {
      void this.app.navigate('store');
    });

    document.getElementById('expiring-btn')!.addEventListener('click', () => {
      void this.app.navigate('expiring');
    });

    for (let i = 1; i <= settings.shelfCount; i++) {
      document
        .getElementById(`shelf-row-${i}`)
        ?.addEventListener('click', () => {
          void this.app.navigate('shelf', { shelfNumber: i });
        });
    }

    if (recent) {
      document.getElementById('reStore-btn')?.addEventListener('click', () => {
        void this.app.navigate('store', { prefillItem: recent });
      });
    }
  }

  private renderShelf(shelfNum: number, count: number): string {
    const filled = Math.min(count, MAX_DOTS);
    const extra = count > MAX_DOTS ? count - MAX_DOTS : 0;

    const dots = Array.from({ length: MAX_DOTS }, (_, i) =>
      i < filled
        ? '<div class="dot filled" aria-hidden="true"></div>'
        : '<div class="dot empty" aria-hidden="true"></div>'
    ).join('');

    return `
      <div class="shelf-row"
           id="shelf-row-${shelfNum}"
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

  // No external event listeners to clean up
  destroy(): void {}
}
