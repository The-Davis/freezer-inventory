import { generateQRCodeSVG, buildRemoveUrl, printQRCode } from '../utils/qr';
import { showModal, removeModal, esc } from './common';
import type { FreezerItem } from '../models/Item';

export async function showPrintModal(
  item: FreezerItem,
  freezerName: string,
  titleText: string,
  onDone?: () => void
): Promise<void> {
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
      <div class="modal-header"><div class="modal-title">${esc(titleText)}</div></div>
      <div class="modal-body">
        <div class="qr-container">
          <div class="qr-item-name">${esc(item.name)}</div>
          <div class="qr-shelf-label">${esc(freezerName)} — Shelf ${item.shelf}</div>
          <div class="qr-frame">${svgContent}</div>
          <p class="qr-hint">Scan this label to remove the item when you take it out.</p>
          <div class="qr-id">ID: ${item.id}</div>
          <div class="qr-actions">
            <button class="btn btn-secondary" id="qr-print-btn">🖨 Print Label</button>
            <button class="btn btn-primary"   id="qr-done-btn">Done</button>
          </div>
        </div>
      </div>
    </div>
  `);

  document.getElementById('qr-print-btn')?.addEventListener('click', () =>
    printQRCode(svgContent, item.name, item.id)
  );
  document.getElementById('qr-done-btn')?.addEventListener('click', () => {
    removeModal(overlay);
    if (onDone) onDone();
  });
}
