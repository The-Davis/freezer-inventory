import type { App } from './App';
import type { Freezer } from '../models/Freezer';
import type { AppState } from '../storage/IStorage';
import { createFreezer } from '../models/Freezer';
import { esc, renderHeader, bindBackButton, AVAILABLE_ICONS } from './common';

const MIN_SHELVES = 1;
const MAX_SHELVES = 20;

export class SettingsView {
  private freezers: Freezer[] = [];
  private itemCountMap = new Map<string, number>(); // freezerId → item count
  private appTitle = 'My Inventory';
  private appIcon = 'snowflake';

  constructor(
    private container: HTMLElement,
    private app: App
  ) {}

  async render(): Promise<void> {
    const [settings, items] = await Promise.all([
      this.app.storage.getSettings(),
      this.app.storage.getItems(),
    ]);

    this.appTitle = settings.appTitle ?? 'My Inventory';
    this.appIcon = settings.appIcon ?? 'snowflake';
    this.freezers = settings.freezers.map((f) => ({ ...f })); // shallow copy for editing

    this.itemCountMap.clear();
    for (const item of items) {
      this.itemCountMap.set(
        item.freezerId,
        (this.itemCountMap.get(item.freezerId) ?? 0) + 1
      );
    }

    this.mount();
  }

  private mount(): void {
    this.container.innerHTML = `
      <div class="view settings-view">
        ${renderHeader('Settings', this.app)}
        <div class="scroll-view">

          <!-- App Identity -->
          <div class="settings-section">
            <div class="settings-label">App Identity</div>
            <div class="settings-row">
              <input type="text" class="form-input" id="app-title-input" value="${esc(this.appTitle)}" placeholder="My Inventory">
            </div>
            <div class="settings-row" style="margin-top:12px; justify-content: flex-start; gap: 8px;">
              ${AVAILABLE_ICONS.map(ic => `
                <button class="btn ${this.appIcon === ic.id ? 'btn-primary' : 'btn-secondary'} btn-sm app-icon-btn" data-id="${ic.id}" title="${ic.label}">
                  ${ic.svg}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Container list -->
          <div class="settings-section">
            <div class="settings-label">Containers</div>
            <div id="freezer-list">
              ${this.freezers.map((f, idx) => this.renderFreezerRow(f, idx)).join('')}
            </div>
            <button class="btn btn-secondary" id="add-freezer-btn"
                    style="margin-top:12px;width:100%">
              ＋ Add Container
            </button>
          </div>

          <!-- Backup / Restore -->
          <div class="settings-section">
            <div class="settings-label">Backup & Restore</div>
            <div class="settings-row" style="justify-content: flex-start; gap: 12px">
              <button class="btn btn-secondary" id="download-btn">Download Backup</button>
              <button class="btn btn-secondary" id="upload-btn">Upload Backup</button>
              <input type="file" id="upload-input" accept=".json" class="hidden">
            </div>
            <p class="form-hint" style="margin-top:12px; line-height:1.6">
              Download your freezer inventory to a JSON file. Uploading a backup will completely overwrite your current inventory and settings.
            </p>
          </div>

          <!-- About -->
          <div class="settings-section">
            <div class="settings-label">About</div>
            <p class="form-hint" style="line-height:1.6">
              My Inventory tracks what's in your containers using browser
              storage or a local network server. Scan the QR code on a stored
              item to remove it instantly.
            </p>
          </div>

          <div style="padding:20px 16px">
            <button class="btn btn-primary btn-lg" id="save-btn">
              Save Settings
            </button>
          </div>

          <div class="save-feedback hidden" id="save-feedback">✅ Settings saved!</div>
          <div class="form-error hidden" id="save-error" style="margin:0 16px 16px"></div>
        </div>
      </div>
    `;

    bindBackButton(this.app);
    this.bindListeners();
  }

  private renderFreezerRow(freezer: Freezer, idx: number): string {
    const itemCount = this.itemCountMap.get(freezer.id) ?? 0;
    const canDelete = this.freezers.length > 1 && itemCount === 0;
    const deleteHint = this.freezers.length <= 1
      ? 'At least one container required'
      : itemCount > 0
        ? `${itemCount} item${itemCount !== 1 ? 's' : ''} — remove them first`
        : '';

    return `
      <div class="freezer-settings-row" id="freezer-row-${idx}">
        <div class="freezer-settings-name-row" style="gap: 8px;">
          <select class="form-input container-icon-select" id="freezer-icon-${idx}" style="flex-shrink: 0; width: auto; padding: 4px 8px; background-color: var(--card-bg);">
            ${AVAILABLE_ICONS.map(ic => `<option value="${ic.id}" ${freezer.icon === ic.id ? 'selected' : ''}>${ic.label}</option>`).join('')}
          </select>
          <input type="text"
                 class="form-input freezer-name-input"
                 id="freezer-name-${idx}"
                 value="${esc(freezer.name)}"
                 placeholder="Container name"
                 aria-label="Container name">
          <button class="btn btn-danger btn-sm delete-freezer-btn"
                  id="delete-freezer-${idx}"
                  data-idx="${idx}"
                  ${canDelete ? '' : 'disabled'}
                  title="${esc(deleteHint)}">
            ✕
          </button>
        </div>
        <div class="settings-row" style="margin-top:8px">
          <div>
            <div class="settings-description">Shelves</div>
            ${deleteHint && !canDelete
              ? `<div class="form-hint" style="margin-top:2px">${esc(deleteHint)}</div>`
              : ''}
          </div>
          <div class="number-stepper">
            <button class="stepper-btn dec-shelf-btn"
                    data-idx="${idx}"
                    ${freezer.shelfCount <= MIN_SHELVES ? 'disabled' : ''}>−</button>
            <span class="stepper-value" id="shelf-val-${idx}">${freezer.shelfCount}</span>
            <button class="stepper-btn inc-shelf-btn"
                    data-idx="${idx}"
                    ${freezer.shelfCount >= MAX_SHELVES ? 'disabled' : ''}>+</button>
          </div>
        </div>
      </div>
      ${idx < this.freezers.length - 1 ? '<hr class="freezer-divider">' : ''}
    `;
  }

  private bindListeners(): void {
    document.querySelectorAll('.app-icon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.appIcon = (btn as HTMLElement).dataset['id'] ?? 'snowflake';
        this.remountList(); // using remountList just to re-render the whole page for simplicity, but wait, remountList only remounts the freezer list. Let's re-render entirely.
        void this.render(); // Just re-render
      });
    });

    document.getElementById('app-title-input')?.addEventListener('input', (e) => {
      this.appTitle = (e.target as HTMLInputElement).value;
    });

    document.getElementById('add-freezer-btn')?.addEventListener('click', () => {
      this.freezers.push(createFreezer(`Container ${this.freezers.length + 1}`, 4, 'snowflake'));
      this.remountList();
    });

    document.getElementById('save-btn')?.addEventListener('click', () => {
      void this.save();
    });

    document.getElementById('download-btn')?.addEventListener('click', () => {
      void this.downloadBackup();
    });

    document.getElementById('upload-btn')?.addEventListener('click', () => {
      document.getElementById('upload-input')?.click();
    });

    document.getElementById('upload-input')?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) void this.uploadBackup(file);
    });

    this.bindListItemListeners();
  }

  private bindListItemListeners(): void {
    const list = document.getElementById('freezer-list');
    if (!list) return;

    // Name input changes
    list.querySelectorAll<HTMLInputElement>('.freezer-name-input').forEach((input, idx) => {
      input.addEventListener('input', () => {
        if (this.freezers[idx]) this.freezers[idx]!.name = input.value;
      });
    });

    // Icon select changes
    list.querySelectorAll<HTMLSelectElement>('.container-icon-select').forEach((select, idx) => {
      select.addEventListener('change', () => {
        if (this.freezers[idx]) this.freezers[idx]!.icon = select.value;
      });
    });

    // Shelf steppers
    list.querySelectorAll<HTMLButtonElement>('.dec-shelf-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset['idx'] ?? '0', 10);
        const f = this.freezers[idx];
        if (f && f.shelfCount > MIN_SHELVES) {
          f.shelfCount--;
          this.remountList();
        }
      });
    });

    list.querySelectorAll<HTMLButtonElement>('.inc-shelf-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset['idx'] ?? '0', 10);
        const f = this.freezers[idx];
        if (f && f.shelfCount < MAX_SHELVES) {
          f.shelfCount++;
          this.remountList();
        }
      });
    });

    // Delete buttons
    list.querySelectorAll<HTMLButtonElement>('.delete-freezer-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset['idx'] ?? '0', 10);
        this.freezers.splice(idx, 1);
        this.remountList();
      });
    });
  }

  /** Re-render just the freezer list (names etc stay, only list changes). */
  private remountList(): void {
    // Capture current name and icon inputs before wiping
    this.freezers.forEach((f, idx) => {
      const nameInput = document.getElementById(`freezer-name-${idx}`) as HTMLInputElement | null;
      if (nameInput) f.name = nameInput.value;
      const iconSelect = document.getElementById(`freezer-icon-${idx}`) as HTMLSelectElement | null;
      if (iconSelect) f.icon = iconSelect.value;
    });

    const listEl = document.getElementById('freezer-list');
    if (listEl) {
      listEl.innerHTML = this.freezers.map((f, idx) => this.renderFreezerRow(f, idx)).join('');
      this.bindListItemListeners();
    }
  }

  private async save(): Promise<void> {
    // Collect current name/icon values from inputs
    this.freezers.forEach((f, idx) => {
      const nameInput = document.getElementById(`freezer-name-${idx}`) as HTMLInputElement | null;
      if (nameInput) f.name = nameInput.value.trim() || f.name;
      const iconSelect = document.getElementById(`freezer-icon-${idx}`) as HTMLSelectElement | null;
      if (iconSelect) f.icon = iconSelect.value;
    });

    const errorEl   = document.getElementById('save-error')!;
    const feedbackEl = document.getElementById('save-feedback')!;

    // Validate — all names must be non-empty
    const unnamed = this.freezers.findIndex((f) => !f.name.trim());
    if (unnamed >= 0) {
      errorEl.textContent = `Container ${unnamed + 1} needs a name.`;
      errorEl.classList.remove('hidden');
      return;
    }
    errorEl.classList.add('hidden');

    await this.app.storage.saveSettings({ 
      appTitle: this.appTitle.trim() || 'My Inventory',
      appIcon: this.appIcon,
      freezers: this.freezers 
    });

    feedbackEl.classList.remove('hidden');
    setTimeout(() => feedbackEl.classList.add('hidden'), 2000);
  }

  private async downloadBackup(): Promise<void> {
    const state = await this.app.storage.exportState();
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freezer-inventory-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private async uploadBackup(file: File): Promise<void> {
    if (!confirm('This will completely overwrite your current inventory and settings. Are you sure?')) {
      // Clear the input so the same file can be selected again if needed
      (document.getElementById('upload-input') as HTMLInputElement).value = '';
      return;
    }
    try {
      const text = await file.text();
      const state = JSON.parse(text) as AppState;
      if (!state.settings || !state.items) {
        throw new Error('Invalid backup file format');
      }
      await this.app.storage.importState(state);
      alert('Backup restored successfully!');
      void this.app.showHome();
    } catch (err) {
      alert(`Failed to restore backup: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      (document.getElementById('upload-input') as HTMLInputElement).value = '';
    }
  }

  destroy(): void {}
}
