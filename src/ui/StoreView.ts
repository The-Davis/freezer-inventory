import type { App } from './App';
import type { FreezerItem } from '../models/Item';
import { generateId, CATEGORIES } from '../models/Item';
import { esc, renderHeader, bindBackButton, showModal, removeModal } from './common';
import {
  generateQRCodeSVG,
  buildRemoveUrl,
  printQRCode,
} from '../utils/qr';

export class StoreView {
  private shelfCount = 4;
  private selectedCategory = '';
  private selectedShelf = 1;

  constructor(
    private container: HTMLElement,
    private app: App,
    private prefillItem?: FreezerItem
  ) {}

  async render(): Promise<void> {
    const settings = await this.app.storage.getSettings();
    this.shelfCount = settings.shelfCount;

    if (this.prefillItem) {
      this.selectedCategory = this.prefillItem.category ?? '';
      this.selectedShelf = Math.min(
        this.prefillItem.shelf,
        this.shelfCount
      );
    }

    const title = this.prefillItem ? 'Re-store Item' : 'Store Item';

    this.container.innerHTML = `
      <div class="view store-view">
        ${renderHeader(title, this.app)}
        <div class="scroll-view">
          <form class="form-container" id="store-form" novalidate>

            <!-- Name -->
            <div class="form-group">
              <label class="form-label required" for="f-name">Name</label>
              <input
                type="text"
                id="f-name"
                class="form-input"
                placeholder="e.g. Ground Beef"
                value="${esc(this.prefillItem?.name ?? '')}"
                required
                autocomplete="off"
              >
            </div>

            <!-- Shelf -->
            <div class="form-group">
              <label class="form-label required">Shelf</label>
              <div class="shelf-chip-group" id="shelf-chips">
                ${Array.from({ length: this.shelfCount }, (_, i) => i + 1)
                  .map(
                    (n) =>
                      `<button type="button"
                               class="chip ${n === this.selectedShelf ? 'selected' : ''}"
                               id="shelf-chip-${n}"
                               data-shelf="${n}">
                         Shelf ${n}
                       </button>`
                  )
                  .join('')}
              </div>
            </div>

            <!-- Category -->
            <div class="form-group">
              <label class="form-label">Category</label>
              <div class="chip-group" id="category-chips">
                ${CATEGORIES.map(
                  (cat) =>
                    `<button type="button"
                             class="chip ${cat === this.selectedCategory ? 'selected' : ''}"
                             data-category="${esc(cat)}">
                       ${esc(cat)}
                     </button>`
                ).join('')}
              </div>
            </div>

            <!-- Brand -->
            <div class="form-group">
              <label class="form-label" for="f-brand">Brand</label>
              <input
                type="text"
                id="f-brand"
                class="form-input"
                placeholder="e.g. Kirkland"
                value="${esc(this.prefillItem?.brand ?? '')}"
                autocomplete="off"
              >
            </div>

            <!-- Weight & Volume -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="f-weight">Weight (oz)</label>
                <input
                  type="number"
                  id="f-weight"
                  class="form-input"
                  placeholder="0"
                  min="0"
                  step="0.1"
                  value="${this.prefillItem?.weightOz != null ? this.prefillItem.weightOz : ''}"
                >
              </div>
              <div class="form-group">
                <label class="form-label" for="f-volume">Volume (fl oz)</label>
                <input
                  type="number"
                  id="f-volume"
                  class="form-input"
                  placeholder="0"
                  min="0"
                  step="0.1"
                  value="${this.prefillItem?.volumeOz != null ? this.prefillItem.volumeOz : ''}"
                >
              </div>
            </div>

            <!-- Expiration Date -->
            <div class="form-group">
              <label class="form-label" for="f-expiry">Expiration Date</label>
              <input
                type="date"
                id="f-expiry"
                class="form-input"
                value="${esc(this.prefillItem?.expirationDate ?? '')}"
              >
              <span class="form-hint">Used by the Expiring Soon filter</span>
            </div>

            <!-- Notes -->
            <div class="form-group">
              <label class="form-label" for="f-notes">Notes</label>
              <textarea
                id="f-notes"
                class="form-input"
                placeholder="Any additional details…"
                rows="3"
              >${esc(this.prefillItem?.notes ?? '')}</textarea>
            </div>

            <!-- Error message -->
            <div class="form-error hidden" id="form-error"></div>

            <!-- Submit -->
            <button type="submit" class="btn btn-primary btn-lg" id="save-btn">
              Save &amp; Generate QR Code
            </button>
          </form>
        </div>
      </div>
    `;

    bindBackButton(this.app);
    this.bindFormListeners();
  }

  private bindFormListeners(): void {
    // Shelf chip selection
    document.getElementById('shelf-chips')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-shelf]');
      if (!btn) return;
      this.selectedShelf = parseInt(btn.dataset['shelf'] ?? '1', 10);
      document.querySelectorAll('#shelf-chips .chip').forEach((el) => {
        el.classList.toggle('selected', el === btn);
      });
    });

    // Category chip selection (toggle)
    document.getElementById('category-chips')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-category]');
      if (!btn) return;
      const cat = btn.dataset['category'] ?? '';
      if (this.selectedCategory === cat) {
        this.selectedCategory = '';
        btn.classList.remove('selected');
      } else {
        this.selectedCategory = cat;
        document.querySelectorAll('#category-chips .chip').forEach((el) => {
          el.classList.toggle('selected', el === btn);
        });
      }
    });

    // Form submit
    document.getElementById('store-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      void this.handleSubmit();
    });
  }

  private async handleSubmit(): Promise<void> {
    const nameEl = document.getElementById('f-name') as HTMLInputElement;
    const brandEl = document.getElementById('f-brand') as HTMLInputElement;
    const weightEl = document.getElementById('f-weight') as HTMLInputElement;
    const volumeEl = document.getElementById('f-volume') as HTMLInputElement;
    const expiryEl = document.getElementById('f-expiry') as HTMLInputElement;
    const notesEl = document.getElementById('f-notes') as HTMLTextAreaElement;
    const errorEl = document.getElementById('form-error')!;
    const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;

    const name = nameEl.value.trim();
    if (!name) {
      errorEl.textContent = 'Please enter an item name.';
      errorEl.classList.remove('hidden');
      nameEl.focus();
      return;
    }

    errorEl.classList.add('hidden');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';

    const item: FreezerItem = {
      id: generateId(),
      name,
      shelf: this.selectedShelf,
      storedAt: new Date().toISOString(),
      brand: brandEl.value.trim() || undefined,
      category: this.selectedCategory || undefined,
      weightOz:
        weightEl.value !== '' ? parseFloat(weightEl.value) : undefined,
      volumeOz:
        volumeEl.value !== '' ? parseFloat(volumeEl.value) : undefined,
      expirationDate: expiryEl.value || undefined,
      notes: notesEl.value.trim() || undefined,
    };

    try {
      await this.app.storage.saveItem(item);
      // Clear recently removed if we just re-stored the same item by name
      const recent = await this.app.storage.getRecentlyRemoved();
      if (recent && recent.name === item.name) {
        await this.app.storage.saveRecentlyRemoved(null);
      }
      await this.showQRModal(item);
    } catch (err) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save & Generate QR Code';
      errorEl.textContent = `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`;
      errorEl.classList.remove('hidden');
    }
  }

  private async showQRModal(item: FreezerItem): Promise<void> {
    const url = buildRemoveUrl(item.id);
    let svgContent: string;

    try {
      svgContent = await generateQRCodeSVG(url);
    } catch {
      svgContent = '<p style="color:#f87171">QR generation failed</p>';
    }

    const overlay = showModal(`
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div class="modal-header">
          <div class="modal-title">✅ Stored!</div>
        </div>
        <div class="modal-body">
          <div class="qr-container">
            <div class="qr-item-name">${esc(item.name)}</div>
            <div class="qr-shelf-label">Shelf ${item.shelf}</div>
            <div class="qr-frame" id="qr-frame">
              ${svgContent}
            </div>
            <p class="qr-hint">Scan this label to remove the item when you take it out of the freezer.</p>
            <div class="qr-id">ID: ${item.id}</div>
            <div class="qr-actions">
              <button class="btn btn-secondary" id="qr-print-btn">
                🖨 Print Label
              </button>
              <button class="btn btn-primary" id="qr-done-btn">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    `);

    document.getElementById('qr-print-btn')?.addEventListener('click', () => {
      printQRCode(svgContent, item.name, item.id);
    });

    document.getElementById('qr-done-btn')?.addEventListener('click', () => {
      removeModal(overlay);
      void this.app.showHome();
    });
  }

  destroy(): void {}
}
