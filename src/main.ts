import { LocalStorageAdapter } from './storage/LocalStorage';
import { ServerStorageAdapter } from './storage/ServerStorage';
import { App } from './ui/App';

async function init(): Promise<void> {
  const appEl = document.getElementById('app');
  if (!appEl) throw new Error('#app element not found');

  // SERVER_MODE is replaced at build time by esbuild --define.
  // The unused branch is tree-shaken, keeping the bundle lean.
  const storage = SERVER_MODE
    ? new ServerStorageAdapter()
    : new LocalStorageAdapter();

  const app = new App(appEl, storage);

  // Check for QR code action in the URL query string
  const params = new URLSearchParams(window.location.search);
  const action = params.get('action');
  const id = params.get('id');

  if (action === 'remove' && id) {
    await app.handleQRRemove(id);
  } else {
    await app.showHome();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  init().catch((err: unknown) => {
    console.error('Failed to initialise Freezer Inventory:', err);
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;
                    justify-content:center;height:100vh;gap:12px;padding:24px;text-align:center;">
          <div style="font-size:40px">⚠️</div>
          <div style="font-size:16px;font-weight:600;color:#f0f6ff;">
            Failed to load Freezer Inventory
          </div>
          <div style="font-size:13px;color:rgba(180,215,255,0.6);">
            ${err instanceof Error ? err.message : 'Unknown error'}
          </div>
        </div>`;
    }
  });
});
