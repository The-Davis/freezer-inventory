import type { App } from './App';
import type { FreezerItem } from '../models/Item';
import {
  expiryStatus,
  daysUntilExpiry,
  formatExpiryDate,
  formatStoredDate,
} from '../models/Item';
import { esc, renderHeader, bindBackButton } from './common';

export class ExpiringView {
  constructor(
    private container: HTMLElement,
    private app: App
  ) {}

  async render(): Promise<void> {
    const items = await this.app.storage.getItems();

    // Only items that have an expiration date, sorted soonest-first
    const withExpiry = items
      .filter((i) => !!i.expirationDate)
      .sort((a, b) => {
        const da = new Date(a.expirationDate! + 'T00:00:00').getTime();
        const db = new Date(b.expirationDate! + 'T00:00:00').getTime();
        return da - db;
      });

    const expiredItems = withExpiry.filter(
      (i) => expiryStatus(i.expirationDate!) === 'expired'
    );
    const dangerItems = withExpiry.filter(
      (i) => expiryStatus(i.expirationDate!) === 'danger'
    );
    const warningItems = withExpiry.filter(
      (i) => expiryStatus(i.expirationDate!) === 'warning'
    );
    const okItems = withExpiry.filter(
      (i) => expiryStatus(i.expirationDate!) === 'ok'
    );

    this.container.innerHTML = `
      <div class="view expiring-view">
        ${renderHeader('Expiring Soon', this.app)}
        <div class="scroll-view">
          ${
            withExpiry.length === 0
              ? `<div class="empty-state">
                   <div class="empty-icon">📅</div>
                   <div class="empty-title">No expiration dates set</div>
                   <div class="empty-description">
                     Add an expiration date when storing items to track them here.
                   </div>
                 </div>`
              : `
                ${this.renderSection('🔴 Expired', expiredItems, 'danger')}
                ${this.renderSection('🟠 Expiring Within 3 Days', dangerItems, 'danger')}
                ${this.renderSection('🟡 Expiring Within 14 Days', warningItems, 'warning')}
                ${this.renderSection('✅ Coming Up', okItems, 'ok')}
              `
          }
        </div>
      </div>
    `;

    bindBackButton(this.app);
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

  private renderCard(
    item: FreezerItem,
    severity: 'danger' | 'warning' | 'ok'
  ): string {
    const days = daysUntilExpiry(item.expirationDate!);
    const dateStr = formatExpiryDate(item.expirationDate!);

    let expiryText: string;
    let expiryClass: string;
    if (days < 0) {
      expiryText = `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`;
      expiryClass = 'tag expiry-danger';
    } else if (days === 0) {
      expiryText = 'Expires today!';
      expiryClass = 'tag expiry-danger';
    } else {
      expiryText = `Expires in ${days} day${days !== 1 ? 's' : ''} (${dateStr})`;
      expiryClass =
        severity === 'danger' ? 'tag expiry-danger' : 'tag expiry-warning';
    }

    const cardClass =
      severity === 'danger'
        ? 'expiring-danger'
        : severity === 'warning'
        ? 'expiring-warning'
        : '';

    return `
      <div class="item-card ${cardClass}">
        <div class="item-name">${esc(item.name)}</div>
        <div class="item-meta">
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
