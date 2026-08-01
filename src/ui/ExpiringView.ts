import type { App } from './App';
import type { FreezerItem } from '../models/Item';
import {
  expiryStatus,
  daysUntilExpiry,
  formatExpiryDate,
  formatStoredDate,
} from '../models/Item';
import type { Freezer } from '../models/Freezer';
import { esc, renderHeader, bindBackButton } from './common';

export class ExpiringView {
  private freezers: Freezer[] = [];

  constructor(
    private container: HTMLElement,
    private app: App
  ) {}

  async render(): Promise<void> {
    const [items, settings] = await Promise.all([
      this.app.storage.getItems(),
      this.app.storage.getSettings(),
    ]);

    this.freezers = settings.freezers;

    const withExpiry = items
      .filter((i) => !!i.expirationDate)
      .sort((a, b) => {
        const da = new Date(a.expirationDate! + 'T00:00:00').getTime();
        const db = new Date(b.expirationDate! + 'T00:00:00').getTime();
        return da - db;
      });

    const expired  = withExpiry.filter((i) => expiryStatus(i.expirationDate!) === 'expired');
    const danger   = withExpiry.filter((i) => expiryStatus(i.expirationDate!) === 'danger');
    const warning  = withExpiry.filter((i) => expiryStatus(i.expirationDate!) === 'warning');
    const ok       = withExpiry.filter((i) => expiryStatus(i.expirationDate!) === 'ok');

    this.container.innerHTML = `
      <div class="view expiring-view">
        ${renderHeader('Expiring Soon', this.app)}
        <div class="scroll-view">
          ${withExpiry.length === 0
            ? `<div class="empty-state">
                 <div class="empty-icon">📅</div>
                 <div class="empty-title">No expiration dates set</div>
                 <div class="empty-description">
                   Add an expiration date when storing items to track them here.
                 </div>
               </div>`
            : `${this.renderSection('🔴 Expired',               expired, 'danger')}
               ${this.renderSection('🟠 Expiring Within 3 Days',  danger,  'danger')}
               ${this.renderSection('🟡 Expiring Within 14 Days', warning, 'warning')}
               ${this.renderSection('✅ Coming Up',               ok,      'ok')}`
          }
        </div>
      </div>
    `;

    bindBackButton(this.app);
  }

  private freezerName(freezerId: string): string {
    return this.freezers.find((f) => f.id === freezerId)?.name ?? 'Container';
  }

  private renderSection(
    title: string,
    items: FreezerItem[],
    severity: 'danger' | 'warning' | 'ok'
  ): string {
    if (items.length === 0) return '';
    return `
      <div class="section-header">${title}</div>
      <div class="item-list">
        ${items.map((item) => this.renderCard(item, severity)).join('')}
      </div>
    `;
  }

  private renderCard(item: FreezerItem, severity: 'danger' | 'warning' | 'ok'): string {
    const days    = daysUntilExpiry(item.expirationDate!);
    const dateStr = formatExpiryDate(item.expirationDate!);

    let expiryText: string;
    let expiryClass: string;
    if (days < 0) {
      expiryText  = `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`;
      expiryClass = 'tag expiry-danger';
    } else if (days === 0) {
      expiryText  = 'Expires today!';
      expiryClass = 'tag expiry-danger';
    } else {
      expiryText  = `Expires in ${days} day${days !== 1 ? 's' : ''} (${dateStr})`;
      expiryClass = severity === 'danger' ? 'tag expiry-danger' : 'tag expiry-warning';
    }

    const cardClass = severity === 'danger'
      ? 'expiring-danger'
      : severity === 'warning' ? 'expiring-warning' : '';

    return `
      <div class="item-card ${cardClass}">
        <div class="item-name">${esc(item.name)}</div>
        <div class="item-meta">
          <span class="tag freezer-tag">${esc(this.freezerName(item.freezerId))}</span>
          <span class="tag shelf-tag">Shelf ${item.shelf}</span>
          ${item.category ? `<span class="tag category-tag">${esc(item.category)}</span>` : ''}
          <span class="${expiryClass}">${expiryText}</span>
          <span class="tag date-tag">Stored ${formatStoredDate(item.storedAt)}</span>
        </div>
      </div>
    `;
  }

  destroy(): void {}
}
