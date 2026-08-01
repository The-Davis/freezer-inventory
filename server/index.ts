import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';

// ── Configuration ─────────────────────────────────────────────
const configPath = path.join(__dirname, '..', 'server', 'config.json');
let config = { port: 3000, dataFile: 'data/freezer.json' };
if (fs.existsSync(configPath)) {
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    config = { ...config, ...JSON.parse(raw) };
  } catch {
    // Use defaults
  }
}

const PORT = parseInt(process.env.PORT ?? String(config.port), 10);
const DATA_FILE = path.resolve(config.dataFile);

// ── Data helpers ──────────────────────────────────────────────
interface DataStore {
  items: Record<string, unknown>[];
  settings: { shelfCount: number };
  recent: Record<string, unknown> | null;
}

function loadData(): DataStore {
  if (!fs.existsSync(DATA_FILE)) {
    return { items: [], settings: { shelfCount: 4 }, recent: null };
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as DataStore;
  } catch {
    return { items: [], settings: { shelfCount: 4 }, recent: null };
  }
}

function saveData(data: DataStore): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ── LAN subnet guard ──────────────────────────────────────────
function getLocalInterfaces(): Array<{ address: string; netmask: string }> {
  const nets = os.networkInterfaces();
  const result: Array<{ address: string; netmask: string }> = [];
  for (const ifaces of Object.values(nets)) {
    for (const iface of ifaces ?? []) {
      if (!iface.internal && iface.family === 'IPv4') {
        result.push({ address: iface.address, netmask: iface.netmask });
      }
    }
  }
  return result;
}

function ipToUint32(ip: string): number {
  const parts = ip.split('.').map(Number);
  return (
    (((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>>
      0)
  );
}

function isOnLocalNetwork(remoteAddress: string): boolean {
  if (!remoteAddress) return false;
  // Strip IPv4-in-IPv6 prefix
  const ip = remoteAddress.replace(/^::ffff:/, '');

  // Always allow loopback
  if (ip === '127.0.0.1' || ip === '::1') return true;

  for (const { address, netmask } of getLocalInterfaces()) {
    const mask = ipToUint32(netmask);
    if ((ipToUint32(ip) & mask) === (ipToUint32(address) & mask)) {
      return true;
    }
  }
  return false;
}

function lanGuard(req: Request, res: Response, next: NextFunction): void {
  const remote =
    req.socket.remoteAddress ??
    req.headers['x-forwarded-for']?.toString().split(',')[0] ??
    '';

  if (!isOnLocalNetwork(remote)) {
    res.status(403).json({ error: 'Access restricted to local network' });
    return;
  }
  next();
}

// ── Express app ───────────────────────────────────────────────
const app = express();
app.use(express.json());

// Serve static files from dist/
app.use(express.static(path.join(__dirname, '..', 'dist')));

// All API routes are LAN-only
app.use('/api', lanGuard);

// Items
app.get('/api/items', (_req, res) => {
  res.json(loadData().items);
});

app.post('/api/items', (req, res) => {
  const data = loadData();
  data.items.push(req.body as Record<string, unknown>);
  saveData(data);
  res.status(201).json({ ok: true });
});

app.put('/api/items/:id', (req, res) => {
  const data = loadData();
  const idx = data.items.findIndex(
    (i) => (i as { id?: string }).id === req.params['id']
  );
  if (idx < 0) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }
  data.items[idx] = req.body as Record<string, unknown>;
  saveData(data);
  res.json({ ok: true });
});

app.delete('/api/items/:id', (req, res) => {
  const data = loadData();
  data.items = data.items.filter(
    (i) => (i as { id?: string }).id !== req.params['id']
  );
  saveData(data);
  res.status(204).send();
});

// Settings
app.get('/api/settings', (_req, res) => {
  res.json(loadData().settings);
});

app.put('/api/settings', (req, res) => {
  const data = loadData();
  data.settings = req.body as { shelfCount: number };
  saveData(data);
  res.json({ ok: true });
});

// Recently removed
app.get('/api/recent', (_req, res) => {
  res.json(loadData().recent);
});

app.put('/api/recent', (req, res) => {
  const data = loadData();
  data.recent = (req.body as Record<string, unknown> | null) ?? null;
  saveData(data);
  res.json({ ok: true });
});

// SPA fallback — serve index.html for any non-API route
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  const interfaces = getLocalInterfaces();

  // ⚠️  Security warning — always displayed on startup
  console.log('\x1b[1m\x1b[33m');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  ⚠️   SECURITY WARNING                                    ║');
  console.log('║                                                          ║');
  console.log('║  This server is intended for LOCAL NETWORK USE ONLY.    ║');
  console.log('║  It performs minimal input validation and trusts all     ║');
  console.log('║  clients on your LAN.                                   ║');
  console.log('║                                                          ║');
  console.log('║  DO NOT expose this server to the public internet,      ║');
  console.log('║  a commercial network, or any untrusted environment.    ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('\x1b[0m');

  console.log(`\x1b[36m🧊 Freezer Inventory server running on port ${PORT}\x1b[0m`);
  console.log('\nAvailable at:');
  console.log(`  http://localhost:${PORT}`);
  for (const { address } of interfaces) {
    console.log(`  http://${address}:${PORT}`);
  }
  console.log('\nData stored at:', DATA_FILE, '\n');
});
