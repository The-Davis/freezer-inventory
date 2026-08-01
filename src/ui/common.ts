import type { App } from './App';

/** Escape a string for safe HTML insertion. */
export function esc(str: string): string {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/**
 * Render the standard app header bar.
 * @param title   - Displayed page title.
 * @param app     - App instance (used to check canGoBack).
 * @param rightBtn - Optional right-side action button HTML string.
 */
export function renderHeader(
  title: string,
  app: App,
  rightBtn = '<div class="header-spacer"></div>'
): string {
  const canGoBack = app.canGoBack();
  return `
    <header class="app-header">
      ${
        canGoBack
          ? `<button class="back-btn" id="back-btn" aria-label="Go back">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                 <polyline points="15 18 9 12 15 6"></polyline>
               </svg>
             </button>`
          : '<div class="header-spacer"></div>'
      }
      <h1 class="header-title">${esc(title)}</h1>
      ${rightBtn}
    </header>
  `;
}

/** Wire up the #back-btn element (if present) to app.goBack(). */
export function bindBackButton(app: App): void {
  document.getElementById('back-btn')?.addEventListener('click', () => {
    void app.goBack();
  });
}

/**
 * Append a full-screen modal overlay to <body> and return the overlay element.
 * The caller is responsible for removing it (via removeModal or click handling).
 */
export function showModal(innerHtml: string, centerAlign = false): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay' + (centerAlign ? ' center' : '');
  overlay.innerHTML = innerHtml;
  document.body.appendChild(overlay);
  return overlay;
}

/** Fade out and remove a modal overlay element. */
export function removeModal(overlay: HTMLElement): void {
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.2s ease';
  setTimeout(() => overlay.remove(), 200);
}

/** SVG icon: settings gear */
export const ICON_SETTINGS = `
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06
             a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09
             A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83
             l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09
             A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83
             l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09
             a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83
             l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09
             a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>`;

/** SVG icon: search magnifier */
export const ICON_SEARCH = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>`;

/** SVG icon: snowflake */
export const ICON_SNOWFLAKE = `
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"></line>
    <path d="M17 5l-5 5-5-5"></path>
    <path d="M17 19l-5-5-5 5"></path>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M5 7l5 5-5 5"></path>
    <path d="M19 7l-5 5 5 5"></path>
  </svg>`;
