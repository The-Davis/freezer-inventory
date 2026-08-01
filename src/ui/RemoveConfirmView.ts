import type { App } from './App';
import type { FreezerItem } from '../models/Item';
import { formatStoredDate, formatExpiryDate } from '../models/Item';
import { esc } from './common';

export class RemoveConfirmView {
  constructor(
    private container: HTMLElement,
    private app: App,
    private itemId: string
  ) {}

  async render(): Promise<void> {
    const items = await this.app.storage.getItems();
    const item = items.find((i) => i.id === this.itemId);

    if (!item) {
      this.renderNotFound();
      return;
    }

    this.renderConfirm(item);
  }

  private renderNotFound(): void {
    this.container.innerHTML = `
      <div class="view remove-confirm-view">
        <header class="app-header">
          <div class="header-spacer"></div>
          <h1 class="header-title">Remove Item</h1>
          <div class="header-spacer"></div>
        </header>
        <div class="scroll-view">
          <div class="confirm-view">
            <div class="confirm-icon">🤔</div>
            <div class="confirm-title">Item Not Found</div>
            <div class="confirm-subtitle">
              This item may have already been removed, or the QR code
              is from a different device or storage session.
            </div>
            <button class="btn btn-primary" id="home-btn" style="margin-top:16px">
              Go Home
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('home-btn')?.addEventListener('click', () => {
      void this.app.showHome();
    });
  }

  private renderConfirm(item: FreezerItem): void {
    const details = [
      ['Name', item.name],
      ['Shelf', `Shelf ${item.shelf}`],
      ['Category', item.category ?? '—'],
      ['Brand', item.brand ?? '—'],
      ['Stored', formatStoredDate(item.storedAt)],
      ...(item.expirationDate
        ? [['Expires', formatExpiryDate(item.expirationDate)]]
        : []),
    ];

    this.container.innerHTML = `
      <div class="view remove-confirm-view">
        <header class="app-header">
          <div class="header-spacer"></div>
          <h1 class="header-title">Remove Item</h1>
          <div class="header-spacer"></div>
        </header>
        <div class="scroll-view">
          <div class="confirm-view">
            <div class="confirm-icon">🧊</div>
            <div class="confirm-title">Remove from Container?</div>
            <div class="confirm-subtitle">
              Confirm that you are removing this item from your inventory.
            </div>

            <div class="confirm-details">
              ${details
                .map(
                  ([label, value]) => `
                    <div class="confirm-detail-row">
                      <span class="confirm-detail-label">${esc(String(label))}</span>
                      <span class="confirm-detail-value">${esc(String(value))}</span>
                    </div>`
                )
                .join('')}
            </div>

            <div style="display:flex;gap:10px;width:100%;margin-top:8px">
              <button class="btn btn-secondary" id="cancel-btn" style="flex:1">
                Cancel
              </button>
              <button class="btn btn-danger" id="confirm-btn" style="flex:2">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('cancel-btn')?.addEventListener('click', () => {
      void this.app.showHome();
    });

    document.getElementById('confirm-btn')?.addEventListener('click', () => {
      void this.doRemove(item);
    });
  }

  private async doRemove(item: FreezerItem): Promise<void> {
    const confirmBtn = document.getElementById('confirm-btn') as HTMLButtonElement;
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Removing…';

    await this.app.storage.removeItem(item.id);
    await this.app.storage.saveRecentlyRemoved(item);

    this.renderSuccess(item);
  }

  private renderSuccess(item: FreezerItem): void {
    this.container.innerHTML = `
      <div class="view remove-confirm-view">
        <header class="app-header">
          <div class="header-spacer"></div>
          <h1 class="header-title">Removed</h1>
          <div class="header-spacer"></div>
        </header>
        <div class="scroll-view">
          <div class="success-screen">
            <div class="success-icon">✅</div>
            <div class="confirm-title">Removed!</div>
            <div class="confirm-subtitle">
              <strong>${esc(item.name)}</strong> has been removed from
              your freezer inventory.
            </div>

            <div class="success-actions">
              <button class="btn btn-secondary" id="reStore-btn">
                Re-store this item
              </button>
              <button class="btn btn-primary" id="home-btn">
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('home-btn')?.addEventListener('click', () => {
      void this.app.showHome();
    });

    document.getElementById('reStore-btn')?.addEventListener('click', () => {
      void this.app.navigate('store', { prefillItem: item }, true);
    });
  }

  destroy(): void {}
}
