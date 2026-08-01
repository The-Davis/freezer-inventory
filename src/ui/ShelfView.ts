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
} from './common';
import { showPrintModal } from './qrModal';

export class ShelfView {
  private items: FreezerItem[] = [];
  private freezer: Freezer | null = null;
  private allFreezersList: Freezer[] = [];
  private selectedId: string | null = null;

  constructor(
    private container: HTMLElement,
    private app: App,
    private freezerId: string,
    private shelfNumber: number
  ) {}

  async render(): Promise<void> {
    const [allItems, settings] = await Promise.all([
      this.app.storage.getItems(),
      this.app.storage.getSettings(),
    ]);

    this.allFreezersList = settings.freezers;
    this.freezer = settings.freezers.find((f) => f.id === this.freezerId) ?? null;

    this.items = allItems
      .filter(
        (i) => i.freezerId === this.freezerId && i.shelf === this.shelfNumber
      )
      .sort(
        (a, b) =>
          new Date(a.storedAt).getTime() - new Date(b.storedAt).getTime()
      );

    const freezerName = this.freezer?.name ?? 'Container';
    const title = `${freezerName} — Shelf ${this.shelfNumber}`;

    this.container.innerHTML = `
      <div class="view shelf-view">
        ${renderHeader(title, this.app)}
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
                   ${this.items.map((item) => this.renderCard(item)).join('')}
                 </div>`
          }
        </div>
      </div>
    `;

    bindBackButton(this.app);
    this.bindListeners();
  }

  private renderCard(item: FreezerItem, expanded = false): string {
    const isSelected = this.selectedId === item.id && expanded;
    const expiryTag   = item.expirationDate ? this.renderExpiryTag(item.expirationDate) : '';
    const categoryTag = item.category
      ? `<span class="tag category-tag">${esc(item.category)}</span>` : '';
    const brandTag = item.brand
      ? `<span class="tag">${esc(item.brand)}</span>` : '';
    const dateTag = `<span class="tag date-tag">Stored ${formatStoredDate(item.storedAt)}</span>`;

    return `
      <div class="item-card ${isSelected ? 'selected' : ''} ${this.expiryCardClass(item)}"
           id="card-${item.id}" data-id="${item.id}"
           role="button" tabindex="0" aria-expanded="${isSelected}">
        <div class="item-name">${esc(item.name)}</div>
        <div class="item-meta">${categoryTag}${brandTag}${dateTag}${expiryTag}</div>
        ${isSelected ? this.renderExpanded(item) : ''}
      </div>
    `;
  }

  private renderExpanded(item: FreezerItem): string {
    // Build all move targets: shelves in every freezer (excluding current location)
    const moveTargets = this.allFreezersList.flatMap((f) =>
      Array.from({ length: f.shelfCount }, (_, i) => ({
        freezerId: f.id,
        freezerName: f.name,
        shelf: i + 1,
        isCurrent: f.id === this.freezerId && i + 1 === this.shelfNumber,
      }))
    ).filter((t) => !t.isCurrent);

    const hasTargets = moveTargets.length > 0;

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

  private bindListeners(): void {
    const list = document.getElementById('item-list');
    if (!list) return;

    list.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const btn    = target.closest('button') as HTMLButtonElement | null;

      if (btn) {
        this.handleButton(btn);
        return;
      }

      const card = target.closest<HTMLElement>('[data-id]');
      if (card) {
        const id = card.dataset['id'] ?? '';
        this.selectedId = this.selectedId === id ? null : id;
        this.rerenderList();
      }
    });
  }

  private handleButton(btn: HTMLButtonElement): void {
    const { id } = btn;
    if (id.startsWith('edit-btn-')) {
      const itemId = id.replace('edit-btn-', '');
      const item = this.items.find((i) => i.id === itemId);
      if (item) void this.app.navigate('store', { prefillItem: item, isEdit: true });
      return;
    }
    if (id.startsWith('dup-btn-')) {
      const itemId = id.replace('dup-btn-', '');
      const item = this.items.find((i) => i.id === itemId);
      if (item) void this.app.navigate('store', { prefillItem: item, isEdit: false });
      return;
    }
    if (id.startsWith('print-btn-')) {
      const itemId = id.replace('print-btn-', '');
      const item = this.items.find((i) => i.id === itemId);
      if (item) void showPrintModal(item, this.freezer?.name ?? 'Container', '🖨 Print Label');
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

  private rerenderList(): void {
    const list = document.getElementById('item-list');
    if (list) {
      list.innerHTML = this.items.map((item) => this.renderCard(item, true)).join('');
    }
  }

  private async removeItem(itemId: string): Promise<void> {
    const item = this.items.find((i) => i.id === itemId);
    if (!item) return;
    await this.app.storage.removeItem(itemId);
    await this.app.storage.saveRecentlyRemoved(item);
    this.selectedId = null;
    await this.render();
  }

  private async showMoveModal(itemId: string): Promise<void> {
    const item = this.items.find((i) => i.id === itemId);
    if (!item) return;

    // Group targets by freezer
    const groups = this.allFreezersList.map((f) => ({
      freezer: f,
      shelves: Array.from({ length: f.shelfCount }, (_, i) => i + 1).filter(
        (s) => !(f.id === this.freezerId && s === this.shelfNumber)
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
          <button class="btn btn-secondary" id="modal-cancel" style="width:100%;margin-top:12px">
            Cancel
          </button>
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
    await this.app.storage.updateItem({
      ...item,
      freezerId: newFreezerId,
      shelf: newShelf,
    });
    this.selectedId = null;
    await this.render();
  }

  destroy(): void {}
}
