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
    console.error('Failed to initialise My Inventory:', err);
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;
                    justify-content:center;height:100vh;gap:12px;padding:24px;text-align:center;">
          <div style="font-size:40px">⚠️</div>
          <div style="font-size:16px;font-weight:600;color:#f0f6ff;">
            Failed to load My Inventory
          </div>
          <div style="font-size:13px;color:rgba(180,215,255,0.6);margin-bottom:12px;">
            ${err instanceof Error ? err.message : 'Unknown error'}
          </div>
          <p style="font-size:13px;color:rgba(180,215,255,0.8);max-width:300px;">
            This may be due to a corrupt or outdated storage version.
          </p>
          <button id="reset-app-btn" class="btn btn-danger" style="margin-top:8px;">Wipe Data & Reset</button>
        </div>`;

      document.getElementById('reset-app-btn')?.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to completely wipe all inventory data and settings? This cannot be undone.')) {
          return;
        }

        try {
          if (SERVER_MODE) {
            await fetch('/api/state', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                settings: { freezers: [{ id: 'f_default', name: 'Container 1', shelfCount: 4, icon: 'snowflake' }] },
                items: [],
                recent: null
              })
            });
          } else {
            localStorage.clear();
          }
          window.location.href = window.location.pathname; // Reload without query params
        } catch (e) {
          alert('Failed to reset data. You may need to manually clear your browser storage or delete the server data file.');
        }
      });
    }
  });
});
