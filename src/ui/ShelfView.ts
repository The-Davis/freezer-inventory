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
} from './common';

export class ShelfView {
  private selectedId: string | null = null;
  private items: FreezerItem[] = [];
  private shelfCount = 4;

  constructor(
    private container: HTMLElement,
    private app: App,
    private shelfNumber: number
  ) {}

  async render(): Promise<void> {
    const [allItems, settings] = await Promise.all([
      this.app.storage.getItems(),
      this.app.storage.getSettings(),
    ]);

    this.shelfCount = settings.shelfCount;

    // Items on this shelf, oldest first
    this.items = allItems
      .filter((i) => i.shelf === this.shelfNumber)
      .sort(
        (a, b) =>
          new Date(a.storedAt).getTime() - new Date(b.storedAt).getTime()
      );

    this.container.innerHTML = `
      <div class="view shelf-view">
        ${renderHeader(`Shelf ${this.shelfNumber}`, this.app)}
        <div class="scroll-view">
          ${
            this.items.length === 0
              ? `<div class="empty-state">
                   <div class="empty-icon">🧊</div>
                   <div class="empty-title">This shelf is empty</div>
                   <div class="empty-description">
                     Tap <strong>Store</strong> on the home screen to add items.
                   </div>
                 </div>`
              : `<div class="section-header">
                   ${this.items.length} item${this.items.length !== 1 ? 's' : ''} — oldest first
                 </div>
                 <div class="item-list" id="item-list">
                   ${this.items.map((item) => this.renderItemCard(item)).join('')}
                 </div>`
          }
        </div>
      </div>
    `;

    bindBackButton(this.app);
    this.bindItemListeners();
  }

  private renderItemCard(item: FreezerItem, expanded = false): string {
    const isSelected = this.selectedId === item.id;
    const expiryTag = item.expirationDate ? this.renderExpiryTag(item.expirationDate) : '';
    const categoryTag = item.category
      ? `<span class="tag category-tag">${esc(item.category)}</span>`
      : '';
    const brandTag = item.brand
      ? `<span class="tag">${esc(item.brand)}</span>`
      : '';
    const dateTag = `<span class="tag date-tag">Stored ${formatStoredDate(item.storedAt)}</span>`;

    const details = expanded && isSelected ? this.renderExpanded(item) : '';

    return `
      <div class="item-card ${isSelected ? 'selected' : ''} ${this.expiryCardClass(item)}"
           id="card-${item.id}"
           data-id="${item.id}"
           role="button"
           tabindex="0"
           aria-expanded="${isSelected}">
        <div class="item-name">${esc(item.name)}</div>
        <div class="item-meta">
          ${categoryTag}${brandTag}${dateTag}${expiryTag}
        </div>
        ${details}
      </div>
    `;
  }

  private renderExpanded(item: FreezerItem): string {
    return `
      <div class="item-actions" id="actions-${item.id}">
        <div class="action-row">
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
    let cls = 'tag';
    let label = `Exp ${dateStr}`;

    if (status === 'expired') {
      cls = 'tag expiry-danger';
      label = `Expired ${dateStr}`;
    } else if (status === 'danger') {
      cls = 'tag expiry-danger';
      label = `Exp in ${days}d`;
    } else if (status === 'warning') {
      cls = 'tag expiry-warning';
      label = `Exp in ${days}d`;
    }

    return `<span class="${cls}">${label}</span>`;
  }

  private expiryCardClass(item: FreezerItem): string {
    if (!item.expirationDate) return '';
    const s = expiryStatus(item.expirationDate);
    if (s === 'expired' || s === 'danger') return 'expiring-danger';
    if (s === 'warning') return 'expiring-warning';
    return '';
  }

  private bindItemListeners(): void {
    const list = document.getElementById('item-list');
    if (!list) return;

    // Toggle card expansion on click
    list.addEventListener('click', (e) => {
      const card = (e.target as HTMLElement).closest('.item-card') as HTMLElement | null;
      if (!card) return;
      const id = card.dataset['id'];
      if (!id) return;

      // If clicking an action button, don't toggle
      if ((e.target as HTMLElement).closest('button')) return;

      this.selectedId = this.selectedId === id ? null : id;
      this.rerenderList();
    });

    list.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('button') as HTMLButtonElement | null;
      if (!btn) return;

      const id = btn.id;

      if (id.startsWith('remove-btn-')) {
        const itemId = id.replace('remove-btn-', '');
        this.showInlineConfirm(itemId);
        return;
      }

      if (id.startsWith('confirm-yes-')) {
        const itemId = id.replace('confirm-yes-', '');
        void this.removeItem(itemId);
        return;
      }

      if (id.startsWith('confirm-no-')) {
        const itemId = id.replace('confirm-no-', '');
        this.hideInlineConfirm(itemId);
        return;
      }

      if (id.startsWith('move-btn-')) {
        const itemId = id.replace('move-btn-', '');
        void this.showMoveModal(itemId);
        return;
      }
    });
  }

  private rerenderList(): void {
    const list = document.getElementById('item-list');
    if (!list) return;
    list.innerHTML = this.items
      .map((item) => this.renderItemCard(item, true))
      .join('');
  }

  private showInlineConfirm(itemId: string): void {
    const actionRow = document
      .getElementById(`actions-${itemId}`)
      ?.querySelector<HTMLElement>('.action-row');
    const confirmRow = document.getElementById(`confirm-${itemId}`);
    if (actionRow) actionRow.classList.add('hidden');
    if (confirmRow) confirmRow.classList.remove('hidden');
  }

  private hideInlineConfirm(itemId: string): void {
    const actionRow = document
      .getElementById(`actions-${itemId}`)
      ?.querySelector<HTMLElement>('.action-row');
    const confirmRow = document.getElementById(`confirm-${itemId}`);
    if (actionRow) actionRow.classList.remove('hidden');
    if (confirmRow) confirmRow.classList.add('hidden');
  }

  private async removeItem(itemId: string): Promise<void> {
    const item = this.items.find((i) => i.id === itemId);
    if (!item) return;

    await this.app.storage.removeItem(itemId);
    await this.app.storage.saveRecentlyRemoved(item);

    // Refresh view
    this.selectedId = null;
    await this.render();
  }

  private async showMoveModal(itemId: string): Promise<void> {
    const item = this.items.find((i) => i.id === itemId);
    if (!item) return;

    const shelves = Array.from({ length: this.shelfCount }, (_, i) => i + 1).filter(
      (n) => n !== this.shelfNumber
    );

    const overlay = showModal(`
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div class="modal-header">
          <div class="modal-title">Move "${esc(item.name)}" to…</div>
        </div>
        <div class="modal-body">
          <div class="shelf-select-list" id="shelf-select-list">
            ${shelves
              .map(
                (n) =>
                  `<button class="shelf-option" data-shelf="${n}">
                     Shelf ${n}
                     <span>›</span>
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
    this.selectedId = null;
    await this.render();
  }

  destroy(): void {}
}
