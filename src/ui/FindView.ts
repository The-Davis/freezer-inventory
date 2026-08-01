import type { App } from './App';
import type { FreezerItem } from '../models/Item';
import {
  expiryStatus,
  formatStoredDate,
  formatExpiryDate,
  daysUntilExpiry,
} from '../models/Item';
import type { Freezer } from '../models/Freezer';
import {
  esc,
  renderHeader,
  bindBackButton,
  showModal,
  removeModal,
  ICON_SEARCH,
} from './common';
import { showPrintModal } from './qrModal';

export class FindView {
  private allItems: FreezerItem[] = [];
  private freezers: Freezer[] = [];
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
    this.freezers = settings.freezers;

    this.container.innerHTML = `
      <div class="view find-view">
        ${renderHeader('Find Item', this.app)}
        <div class="search-container">
          <div class="search-input-wrapper">
            <span class="search-icon">${ICON_SEARCH}</span>
            <input type="search" class="search-input" id="search-input"
              placeholder="Search by name, brand, category…"
              autocomplete="off" autocorrect="off" spellcheck="false">
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

  private freezerName(freezerId: string): string {
    return this.freezers.find((f) => f.id === freezerId)?.name ?? 'Unknown Container';
  }

  private filterItems(): FreezerItem[] {
    if (!this.query) return [...this.allItems];
    return this.allItems.filter((item) =>
      [item.name, item.brand ?? '', item.category ?? '', item.notes ?? '']
        .join(' ')
        .toLowerCase()
        .includes(this.query)
    );
  }

  private renderResults(): string {
    const results = this.filterItems();

    if (this.allItems.length === 0) {
      return `<div class="empty-state">
        <div class="empty-icon">🧊</div>
        <div class="empty-title">All freezers are empty</div>
        <div class="empty-description">Use <strong>Store</strong> to add items first.</div>
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
    const expiryTag   = item.expirationDate ? this.renderExpiryTag(item.expirationDate) : '';
    const categoryTag = item.category
      ? `<span class="tag category-tag">${esc(item.category)}</span>` : '';
    const freezerTag  = `<span class="tag freezer-tag">${esc(this.freezerName(item.freezerId))}</span>`;
    const shelfTag    = `<span class="tag shelf-tag">Shelf ${item.shelf}</span>`;
    const dateTag     = `<span class="tag date-tag">Stored ${formatStoredDate(item.storedAt)}</span>`;

    return `
      <div class="item-card ${isSelected ? 'selected' : ''} ${this.expiryCardClass(item)}"
           id="card-${item.id}" data-id="${item.id}" role="button" tabindex="0">
        <div class="item-name">${esc(item.name)}</div>
        <div class="item-meta">${freezerTag}${shelfTag}${categoryTag}${dateTag}${expiryTag}</div>
        ${isSelected ? this.renderExpanded(item) : ''}
      </div>
    `;
  }

  private renderExpanded(item: FreezerItem): string {
    // Move targets: all shelves in all freezers excluding current location
    const hasTargets = this.freezers.some((f) =>
      Array.from({ length: f.shelfCount }, (_, i) => i + 1).some(
        (s) => !(f.id === item.freezerId && s === item.shelf)
      )
    );

    return `
      <div class="item-actions">
        <div class="action-row" id="action-row-${item.id}">
          <button class="btn btn-secondary btn-sm" id="edit-btn-${item.id}">Edit</button>
          <button class="btn btn-secondary btn-sm" id="dup-btn-${item.id}">Duplicate</button>
          <button class="btn btn-secondary btn-sm" id="print-btn-${item.id}">Print</button>
          ${hasTargets
            ? `<button class="btn btn-secondary btn-sm" id="move-btn-${item.id}">Move…</button>`
            : ''}
          <button class="btn btn-danger btn-sm" id="remove-btn-${item.id}">Remove</button>
        </div>
        <div class="remove-confirm-inline hidden" id="confirm-${item.id}">
          <span class="confirm-inline-text">Remove from container?</span>
          <button class="btn btn-danger btn-sm" id="confirm-yes-${item.id}">Confirm</button>
          <button class="btn btn-secondary btn-sm" id="confirm-no-${item.id}">Cancel</button>
        </div>
      </div>
    `;
  }

  private renderExpiryTag(expirationDate: string): string {
    const status = expiryStatus(expirationDate);
    const days   = daysUntilExpiry(expirationDate);
    const dateStr = formatExpiryDate(expirationDate);
    if (status === 'expired') return `<span class="tag expiry-danger">Expired ${dateStr}</span>`;
    if (status === 'danger')  return `<span class="tag expiry-danger">Exp in ${days}d</span>`;
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
    if (wrapper) {
      wrapper.innerHTML = this.renderResults();
      this.bindResultListeners();
    }
  }

  private bindResultListeners(): void {
    const el = document.getElementById('find-results');
    if (!el) return;

    el.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('button') as HTMLButtonElement | null;
      if (btn) { this.handleButton(btn); return; }

      const card = target.closest<HTMLElement>('[data-id]');
      if (card) {
        const id = card.dataset['id'] ?? '';
        this.selectedId = this.selectedId === id ? null : id;
        this.refreshResults();
      }
    });
  }

  private handleButton(btn: HTMLButtonElement): void {
    const { id } = btn;
    if (id.startsWith('edit-btn-')) {
      const itemId = id.replace('edit-btn-', '');
      const item = this.allItems.find((i) => i.id === itemId);
      if (item) void this.app.navigate('store', { prefillItem: item, isEdit: true });
      return;
    }
    if (id.startsWith('dup-btn-')) {
      const itemId = id.replace('dup-btn-', '');
      const item = this.allItems.find((i) => i.id === itemId);
      if (item) void this.app.navigate('store', { prefillItem: item, isEdit: false });
      return;
    }
    if (id.startsWith('print-btn-')) {
      const itemId = id.replace('print-btn-', '');
      const item = this.allItems.find((i) => i.id === itemId);
      if (item) void showPrintModal(item, this.freezerName(item.freezerId), '🖨 Print Label');
      return;
    }
    if (id.startsWith('remove-btn-')) {
      const itemId = id.replace('remove-btn-', '');
      document.getElementById(`action-row-${itemId}`)?.classList.add('hidden');
      document.getElementById(`confirm-${itemId}`)?.classList.remove('hidden');
      return;
    }
    if (id.startsWith('confirm-yes-')) {
      void this.removeItem(id.replace('confirm-yes-', ''));
      return;
    }
    if (id.startsWith('confirm-no-')) {
      const itemId = id.replace('confirm-no-', '');
      document.getElementById(`action-row-${itemId}`)?.classList.remove('hidden');
      document.getElementById(`confirm-${itemId}`)?.classList.add('hidden');
      return;
    }
    if (id.startsWith('move-btn-')) {
      void this.showMoveModal(id.replace('move-btn-', ''));
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

    const groups = this.freezers.map((f) => ({
      freezer: f,
      shelves: Array.from({ length: f.shelfCount }, (_, i) => i + 1).filter(
        (s) => !(f.id === item.freezerId && s === item.shelf)
      ),
    })).filter((g) => g.shelves.length > 0);

    const groupHtml = groups.map((g) => `
      <div class="move-group">
        <div class="move-group-label">${esc(g.freezer.name)}</div>
        ${g.shelves.map((s) => `
          <button class="shelf-option"
                  data-freezer="${esc(g.freezer.id)}"
                  data-shelf="${s}">
            Shelf ${s} <span>›</span>
          </button>`).join('')}
      </div>
    `).join('');

    const overlay = showModal(`
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div class="modal-header">
          <div class="modal-title">Move "${esc(item.name)}" to…</div>
        </div>
        <div class="modal-body">
          <div class="shelf-select-list">${groupHtml}</div>
          <button class="btn btn-secondary" id="modal-cancel" style="width:100%;margin-top:12px">Cancel</button>
        </div>
      </div>
    `);

    overlay.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('button') as HTMLButtonElement | null;
      if (!btn) return;
      if (btn.id === 'modal-cancel') { removeModal(overlay); return; }
      const newFreezerId = btn.dataset['freezer'];
      const newShelf     = parseInt(btn.dataset['shelf'] ?? '1', 10);
      if (newFreezerId) void this.moveItem(item, newFreezerId, newShelf, overlay);
    });
  }

  private async moveItem(
    item: FreezerItem,
    newFreezerId: string,
    newShelf: number,
    overlay: HTMLElement
  ): Promise<void> {
    removeModal(overlay);
    const updated = { ...item, freezerId: newFreezerId, shelf: newShelf };
    await this.app.storage.updateItem(updated);
    const idx = this.allItems.findIndex((i) => i.id === item.id);
    if (idx >= 0) this.allItems[idx] = updated;
    this.selectedId = null;
    this.refreshResults();
  }

  destroy(): void {}
}
