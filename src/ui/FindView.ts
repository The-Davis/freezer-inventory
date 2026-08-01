import type { App } from './App';
import type { FreezerItem } from '../models/Item';
import {
  expiryStatus,
  formatStoredDate,
  formatExpiryDate,
  daysUntilExpiry,
} from '../models/Item';
import {
  esc,
  renderHeader,
  bindBackButton,
  showModal,
  removeModal,
  ICON_SEARCH,
} from './common';

export class FindView {
  private allItems: FreezerItem[] = [];
  private shelfCount = 4;
  private selectedId: string | null = null;
  private query = '';

  constructor(
    private container: HTMLElement,
    private app: App
  ) {}

  async render(): Promise<void> {
    const [items, settings] = await Promise.all([
      this.app.storage.getItems(),
      this.app.storage.getSettings(),
    ]);

    this.allItems = items;
    this.shelfCount = settings.shelfCount;

    this.container.innerHTML = `
      <div class="view find-view">
        ${renderHeader('Find Item', this.app)}

        <div class="search-container">
          <div class="search-input-wrapper">
            <span class="search-icon">${ICON_SEARCH}</span>
            <input
              type="search"
              class="search-input"
              id="search-input"
              placeholder="Search by name, brand, category…"
              autocomplete="off"
              autocorrect="off"
              spellcheck="false"
            >
          </div>
        </div>

        <div class="scroll-view" id="results-wrapper">
          ${this.renderResults()}
        </div>
      </div>
    `;

    bindBackButton(this.app);

    const searchEl = document.getElementById('search-input') as HTMLInputElement;
    searchEl.focus();

    searchEl.addEventListener('input', () => {
      this.query = searchEl.value.trim().toLowerCase();
      this.selectedId = null;
      this.refreshResults();
    });

    this.bindResultListeners();
  }

  private filterItems(): FreezerItem[] {
    if (!this.query) return [...this.allItems];
    return this.allItems.filter((item) => {
      const haystack = [
        item.name,
        item.brand ?? '',
        item.category ?? '',
        item.notes ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(this.query);
    });
  }

  private renderResults(): string {
    const results = this.filterItems();

    if (this.allItems.length === 0) {
      return `<div class="empty-state">
        <div class="empty-icon">🧊</div>
        <div class="empty-title">Freezer is empty</div>
        <div class="empty-description">
          Use <strong>Store</strong> to add items first.
        </div>
      </div>`;
    }

    if (results.length === 0) {
      return `<div class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-title">No items found</div>
        <div class="empty-description">Try a different search term.</div>
      </div>`;
    }

    return `<div class="item-list" id="find-results">
      ${results.map((item) => this.renderCard(item)).join('')}
    </div>`;
  }

  private renderCard(item: FreezerItem): string {
    const isSelected = this.selectedId === item.id;
    const expiryTag = item.expirationDate
      ? this.renderExpiryTag(item.expirationDate)
      : '';
    const categoryTag = item.category
      ? `<span class="tag category-tag">${esc(item.category)}</span>`
      : '';
    const shelfTag = `<span class="tag shelf-tag">Shelf ${item.shelf}</span>`;
    const dateTag = `<span class="tag date-tag">Stored ${formatStoredDate(item.storedAt)}</span>`;

    return `
      <div class="item-card ${isSelected ? 'selected' : ''} ${this.expiryCardClass(item)}"
           id="card-${item.id}"
           data-id="${item.id}"
           role="button"
           tabindex="0">
        <div class="item-name">${esc(item.name)}</div>
        <div class="item-meta">
          ${shelfTag}${categoryTag}${dateTag}${expiryTag}
        </div>
        ${isSelected ? this.renderExpanded(item) : ''}
      </div>
    `;
  }

  private renderExpanded(item: FreezerItem): string {
    return `
      <div class="item-actions">
        <div class="action-row" id="action-row-${item.id}">
          <button class="btn btn-danger btn-sm" id="remove-btn-${item.id}">
            Remove
          </button>
          ${
            this.shelfCount > 1
              ? `<button class="btn btn-secondary btn-sm" id="move-btn-${item.id}">
                   Move to Shelf…
                 </button>`
              : ''
          }
        </div>
        <div class="remove-confirm-inline hidden" id="confirm-${item.id}">
          <span class="confirm-inline-text">Remove from freezer?</span>
          <button class="btn btn-danger btn-sm" id="confirm-yes-${item.id}">Confirm</button>
          <button class="btn btn-secondary btn-sm" id="confirm-no-${item.id}">Cancel</button>
        </div>
      </div>
    `;
  }

  private renderExpiryTag(expirationDate: string): string {
    const status = expiryStatus(expirationDate);
    const days = daysUntilExpiry(expirationDate);
    const dateStr = formatExpiryDate(expirationDate);
    if (status === 'expired') return `<span class="tag expiry-danger">Expired ${dateStr}</span>`;
    if (status === 'danger') return `<span class="tag expiry-danger">Exp in ${days}d</span>`;
    if (status === 'warning') return `<span class="tag expiry-warning">Exp in ${days}d</span>`;
    return `<span class="tag date-tag">Exp ${dateStr}</span>`;
  }

  private expiryCardClass(item: FreezerItem): string {
    if (!item.expirationDate) return '';
    const s = expiryStatus(item.expirationDate);
    if (s === 'expired' || s === 'danger') return 'expiring-danger';
    if (s === 'warning') return 'expiring-warning';
    return '';
  }

  private refreshResults(): void {
    const wrapper = document.getElementById('results-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = this.renderResults();
    this.bindResultListeners();
  }

  private bindResultListeners(): void {
    const resultsEl = document.getElementById('find-results');
    if (!resultsEl) return;

    resultsEl.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('button') as HTMLButtonElement | null;

      if (btn) {
        this.handleButtonClick(btn);
        return;
      }

      const card = target.closest<HTMLElement>('[data-id]');
      if (card) {
        const id = card.dataset['id'] ?? '';
        this.selectedId = this.selectedId === id ? null : id;
        this.refreshResults();
      }
    });
  }

  private handleButtonClick(btn: HTMLButtonElement): void {
    const { id } = btn;

    if (id.startsWith('remove-btn-')) {
      const itemId = id.replace('remove-btn-', '');
      const actionRow = document.getElementById(`action-row-${itemId}`);
      const confirmRow = document.getElementById(`confirm-${itemId}`);
      actionRow?.classList.add('hidden');
      confirmRow?.classList.remove('hidden');
      return;
    }

    if (id.startsWith('confirm-yes-')) {
      const itemId = id.replace('confirm-yes-', '');
      void this.removeItem(itemId);
      return;
    }

    if (id.startsWith('confirm-no-')) {
      const itemId = id.replace('confirm-no-', '');
      const actionRow = document.getElementById(`action-row-${itemId}`);
      const confirmRow = document.getElementById(`confirm-${itemId}`);
      actionRow?.classList.remove('hidden');
      confirmRow?.classList.add('hidden');
      return;
    }

    if (id.startsWith('move-btn-')) {
      const itemId = id.replace('move-btn-', '');
      void this.showMoveModal(itemId);
    }
  }

  private async removeItem(itemId: string): Promise<void> {
    const item = this.allItems.find((i) => i.id === itemId);
    if (!item) return;

    await this.app.storage.removeItem(itemId);
    await this.app.storage.saveRecentlyRemoved(item);

    this.allItems = this.allItems.filter((i) => i.id !== itemId);
    this.selectedId = null;
    this.refreshResults();
  }

  private async showMoveModal(itemId: string): Promise<void> {
    const item = this.allItems.find((i) => i.id === itemId);
    if (!item) return;

    const shelves = Array.from(
      { length: this.shelfCount },
      (_, i) => i + 1
    ).filter((n) => n !== item.shelf);

    const overlay = showModal(`
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div class="modal-header">
          <div class="modal-title">Move "${esc(item.name)}" to…</div>
        </div>
        <div class="modal-body">
          <div class="shelf-select-list">
            ${shelves
              .map(
                (n) =>
                  `<button class="shelf-option" data-shelf="${n}">
                     Shelf ${n} <span>›</span>
                   </button>`
              )
              .join('')}
          </div>
          <button class="btn btn-secondary" id="modal-cancel" style="width:100%;margin-top:12px">
            Cancel
          </button>
        </div>
      </div>
    `);

    overlay.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('button') as HTMLButtonElement | null;
      if (!btn) return;

      if (btn.id === 'modal-cancel') {
        removeModal(overlay);
        return;
      }

      const shelfStr = btn.dataset['shelf'];
      if (shelfStr) {
        const newShelf = parseInt(shelfStr, 10);
        void this.moveItem(item, newShelf, overlay);
      }
    });
  }

  private async moveItem(
    item: FreezerItem,
    newShelf: number,
    overlay: HTMLElement
  ): Promise<void> {
    removeModal(overlay);
    await this.app.storage.updateItem({ ...item, shelf: newShelf });
    const idx = this.allItems.findIndex((i) => i.id === item.id);
    if (idx >= 0) this.allItems[idx] = { ...item, shelf: newShelf };
    this.selectedId = null;
    this.refreshResults();
  }

  destroy(): void {}
}
