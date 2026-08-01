import type { App } from './App';
import { renderHeader, bindBackButton } from './common';

const MIN_SHELVES = 1;
const MAX_SHELVES = 20;

export class SettingsView {
  private shelfCount = 4;

  constructor(
    private container: HTMLElement,
    private app: App
  ) {}

  async render(): Promise<void> {
    const settings = await this.app.storage.getSettings();
    this.shelfCount = settings.shelfCount;

    this.container.innerHTML = `
      <div class="view settings-view">
        ${renderHeader('Settings', this.app)}

        <div class="scroll-view">
          <div class="settings-section">
            <div class="settings-label">Freezer Configuration</div>

            <div class="settings-row">
              <div>
                <div class="settings-description">Number of Shelves</div>
                <div class="form-hint" style="margin-top:2px">
                  ${MIN_SHELVES}–${MAX_SHELVES} shelves supported
                </div>
              </div>
              <div class="number-stepper">
                <button
                  class="stepper-btn"
                  id="dec-btn"
                  aria-label="Decrease shelf count"
                  ${this.shelfCount <= MIN_SHELVES ? 'disabled' : ''}
                >−</button>
                <span class="stepper-value" id="shelf-value">${this.shelfCount}</span>
                <button
                  class="stepper-btn"
                  id="inc-btn"
                  aria-label="Increase shelf count"
                  ${this.shelfCount >= MAX_SHELVES ? 'disabled' : ''}
                >+</button>
              </div>
            </div>
          </div>

          <div class="settings-section">
            <div class="settings-label">About</div>
            <p class="form-hint" style="line-height:1.6">
              Freezer Inventory tracks what's in your freezer using browser
              storage or a local network server. Scan the QR code on a stored
              item to remove it instantly.
            </p>
          </div>

          <div style="padding:20px 16px">
            <button class="btn btn-primary btn-lg" id="save-btn">
              Save Settings
            </button>
          </div>

          <div class="save-feedback hidden" id="save-feedback">
            ✅ Settings saved!
          </div>
        </div>
      </div>
    `;

    bindBackButton(this.app);
    this.bindListeners();
  }

  private bindListeners(): void {
    const valueEl = document.getElementById('shelf-value')!;
    const decBtn = document.getElementById('dec-btn') as HTMLButtonElement;
    const incBtn = document.getElementById('inc-btn') as HTMLButtonElement;

    const update = (): void => {
      valueEl.textContent = String(this.shelfCount);
      decBtn.disabled = this.shelfCount <= MIN_SHELVES;
      incBtn.disabled = this.shelfCount >= MAX_SHELVES;
    };

    decBtn.addEventListener('click', () => {
      if (this.shelfCount > MIN_SHELVES) {
        this.shelfCount--;
        update();
      }
    });

    incBtn.addEventListener('click', () => {
      if (this.shelfCount < MAX_SHELVES) {
        this.shelfCount++;
        update();
      }
    });

    document.getElementById('save-btn')?.addEventListener('click', () => {
      void this.save();
    });
  }

  private async save(): Promise<void> {
    await this.app.storage.saveSettings({ shelfCount: this.shelfCount });
    const feedback = document.getElementById('save-feedback');
    if (feedback) {
      feedback.classList.remove('hidden');
      setTimeout(() => feedback.classList.add('hidden'), 2000);
    }
  }

  destroy(): void {}
}
