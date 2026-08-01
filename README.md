# 🧊 Freezer Inventory

A mobile-first freezer inventory tracker with QR code label support.
Store items, search, track expiration dates, and scan labels to remove items
as you take them out of the freezer.

---

## Features

- **Visual freezer** — shelf-by-shelf view with at-a-glance item-count dots
- **Store items** — name, shelf, category, brand, weight, volume, expiration date, notes
- **QR code labels** — each item gets a unique ID and printable QR code; scan it to remove instantly
- **Find** — live full-text search across all fields
- **Expiring Soon** — items sorted and colour-coded by urgency
- **Recently Removed** — one-tap re-store for your last removed item
- **Two storage modes** — browser `localStorage` (no server needed) or a LAN Node.js server

---

## Quick Start — GitHub Pages (static, no server)

1. Fork / clone this repository.
2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
3. Commit the `dist/` folder and push to `main`.
4. In your repository settings → **Pages**, set the source to
   **Branch: main / folder: /dist**.
5. Open `https://<your-username>.github.io/freezer-inventory/`.

Data is stored in the browser's `localStorage` — no server required.

---

## Local Development — Windows (Node.js)

### Prerequisites
- [Node.js 18+](https://nodejs.org/) (LTS recommended)

### Install & run

```powershell
# Clone the repository
git clone https://github.com/<your-username>/freezer-inventory.git
cd freezer-inventory

# Install dependencies
npm install

# Build browser mode (outputs to dist/)
npm run build

# Type-check without building
npm run typecheck
```

### Running the LAN server locally (Windows)

1. Create `server/config.json` (presence triggers server mode):
   ```json
   { "port": 3000, "dataFile": "data/freezer.json" }
   ```
2. Build and start:
   ```powershell
   npm run build:server
   npm start
   ```
3. Open `http://localhost:3000` in a browser.

For **hot-reload during development** (uses ts-node, no build step):
```powershell
npm run dev
```

---

## Debian / Ubuntu Server Setup

Run the included install script as root on a clean Debian or Ubuntu system:

```bash
sudo bash scripts/install-debian.sh
```

The script will:
1. Install **Node.js 20 LTS** via NodeSource.
2. Install npm dependencies.
3. Build the server-mode bundle.
4. Optionally install a **systemd service** so the server starts automatically on boot.

### After installation

- **Access the app** from any device on your local network:
  `http://<server-ip>:3000`
- **Check server status**: `sudo systemctl status freezer-inventory`
- **View logs**: `sudo journalctl -u freezer-inventory -f`
- **Restart**: `sudo systemctl restart freezer-inventory`

> [!WARNING]
> The server only accepts connections from the local subnet.
> **Never expose it to the public internet.**

---

## QR Code Labels

When you store an item, a QR code is generated that encodes a URL like:

```
https://your-site/?action=remove&id=<unique-id>
```

- **Print** the label and stick it on the package.
- When you take the item out of the freezer, **scan the label** with any QR
  code reader. The app opens directly to a removal confirmation screen.

The base URL is detected automatically from `window.location` — the same
app works on GitHub Pages and on a local server without any configuration.

---

## Project Structure

```
freezer-inventory/
├── src/                  # TypeScript source
│   ├── main.ts           # Entry point
│   ├── models/Item.ts    # Data model & helpers
│   ├── storage/          # IStorage interface + adapters
│   └── ui/               # View components
├── public/               # Static assets (HTML + CSS source)
├── dist/                 # Compiled output — tracked for GitHub Pages
├── server/               # Express LAN server
│   ├── index.ts
│   └── config.json       # (create this to enable server mode — gitignored)
├── scripts/
│   ├── build.js          # Cross-platform esbuild wrapper
│   └── install-debian.sh # Debian setup script
├── data/                 # Server JSON data — gitignored
├── tsconfig.json         # Browser TypeScript config
└── tsconfig.server.json  # Server TypeScript config
```

---

## npm Scripts

| Script | Description |
|---|---|
| `npm run build` | Browser mode — bundles to `dist/app.js` + copies static assets |
| `npm run build:server` | Server mode — same as above but `SERVER_MODE=true` + compiles server |
| `npm run dev` | Start server with ts-node (no pre-build needed) |
| `npm start` | Start compiled server (`server-dist/server/index.js`) |
| `npm run typecheck` | Type-check without building |

---

## Configuration

### Server (`server/config.json`)

| Key | Default | Description |
|---|---|---|
| `port` | `3000` | TCP port the server listens on |
| `dataFile` | `"data/freezer.json"` | Path to the JSON data file (relative to project root) |

You can also set the port via the `PORT` environment variable:
```bash
PORT=8080 npm start
```

---

## Security Notes

- The server restricts access to clients on the **same IP subnet** as the
  server interface. This is a best-effort check and does **not** replace
  proper network security.
- The server trusts all data from LAN clients — no authentication is implemented.
- A bold warning is printed to the terminal every time the server starts.
- `server/config.json` and `data/` are gitignored — your data is never
  accidentally committed.

---

## License

MIT
