import QRCode from 'qrcode';

/**
 * Generate an SVG string for a QR code that encodes the given URL.
 * Returns a raw SVG string suitable for direct innerHTML embedding.
 */
export async function generateQRCodeSVG(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: 'svg',
    width: 220,
    margin: 1,
    color: {
      dark: '#0a1020',
      light: '#f0f7ff',
    },
  });
}

/**
 * Build the URL that encodes the "remove this item" action.
 * Uses window.location.origin + pathname so it works for both
 * GitHub Pages (e.g. https://user.github.io/freezer-inventory/) and
 * a local server (e.g. http://192.168.1.5:3000/).
 */
export function buildRemoveUrl(itemId: string): string {
  const base = window.location.origin + window.location.pathname;
  // Ensure the base URL doesn't already have query params
  const cleanBase = base.split('?')[0];
  return `${cleanBase}?action=remove&id=${encodeURIComponent(itemId)}`;
}

/**
 * Open a new popup window containing just the QR code and item name,
 * then trigger the browser's print dialog.
 */
export function printQRCode(
  svgContent: string,
  itemName: string,
  itemId: string
): void {
  const win = window.open('', '_blank', 'width=420,height=480,menubar=no');
  if (!win) {
    alert('Please allow pop-ups for this site to print labels.');
    return;
  }

  const escapedName = itemName.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Freezer Label — ${escapedName}</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      font-family: system-ui, -apple-system, sans-serif;
      text-align: center;
      background: #fff;
      color: #111;
    }
    h2 {
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 12px;
    }
    .qr-wrap {
      display: inline-block;
      padding: 8px;
      background: #f0f7ff;
      border-radius: 8px;
    }
    .qr-wrap svg { display: block; }
    .item-id {
      margin-top: 10px;
      font-size: 9px;
      color: #666;
      font-family: monospace;
      word-break: break-all;
    }
    .scan-hint {
      margin-top: 6px;
      font-size: 11px;
      color: #888;
    }
    @media print {
      @page { margin: 0.5cm; }
    }
  </style>
</head>
<body>
  <h2>${escapedName}</h2>
  <div class="qr-wrap">${svgContent}</div>
  <p class="scan-hint">Scan to remove from inventory</p>
  <p class="item-id">ID: ${itemId}</p>
  <script>window.onload = function() { window.print(); };<\/script>
</body>
</html>`);
  win.document.close();
}
