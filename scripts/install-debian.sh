#!/usr/bin/env bash
# =============================================================================
# install-debian.sh — Freezer Inventory LAN Server Setup (Debian/Ubuntu)
#
# Usage:
#   chmod +x scripts/install-debian.sh
#   sudo bash scripts/install-debian.sh
#
# What this script does:
#   1. Installs Node.js 20 LTS via NodeSource
#   2. Installs npm project dependencies
#   3. Builds the server-mode bundle
#   4. (Optional) Installs a systemd service for auto-start on boot
# =============================================================================
set -e

# ── Colour helpers ────────────────────────────────────────────────────────────
RED='\033[0;31m'; YELLOW='\033[1;33m'; GREEN='\033[0;32m'; NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# ── Root check ────────────────────────────────────────────────────────────────
if [[ $EUID -ne 0 ]]; then
  error "Please run this script as root: sudo bash scripts/install-debian.sh"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# ── Security warning ──────────────────────────────────────────────────────────
echo
echo -e "${YELLOW}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║  ⚠️   SECURITY WARNING                                    ║${NC}"
echo -e "${YELLOW}║                                                          ║${NC}"
echo -e "${YELLOW}║  Freezer Inventory is designed for LOCAL NETWORK use.    ║${NC}"
echo -e "${YELLOW}║  The server performs only subnet-level access control.   ║${NC}"
echo -e "${YELLOW}║  DO NOT expose it to the internet or any public network. ║${NC}"
echo -e "${YELLOW}╚══════════════════════════════════════════════════════════╝${NC}"
echo

read -r -p "Continue with installation? [y/N] " confirm
[[ "$confirm" =~ ^[Yy]$ ]] || { info "Aborted."; exit 0; }

# ── System dependencies ───────────────────────────────────────────────────────
info "Updating package lists…"
apt-get update -qq

info "Installing prerequisites…"
apt-get install -y -qq curl ca-certificates gnupg

# ── Node.js 20 LTS via NodeSource ─────────────────────────────────────────────
if ! command -v node &>/dev/null || [[ "$(node -e 'process.stdout.write(process.versions.node.split(".")[0])')" -lt 18 ]]; then
  info "Installing Node.js 20 LTS…"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
else
  info "Node.js $(node --version) already installed — skipping."
fi

info "Node.js version: $(node --version)"
info "npm version:     $(npm --version)"

# ── npm install ───────────────────────────────────────────────────────────────
info "Installing npm dependencies…"
cd "$PROJECT_DIR"
npm install --omit=dev 2>&1 | tail -5
npm install 2>&1 | tail -5   # dev deps needed for build

# ── Build (server mode) ───────────────────────────────────────────────────────
info "Building server-mode bundle…"
npm run build:server

# ── Data directory ────────────────────────────────────────────────────────────
mkdir -p "$PROJECT_DIR/data"
chown -R "$SUDO_USER":"$SUDO_USER" "$PROJECT_DIR/data" 2>/dev/null || true

# ── Optional systemd service ──────────────────────────────────────────────────
echo
read -r -p "Install systemd service (auto-start on boot)? [y/N] " install_service

if [[ "$install_service" =~ ^[Yy]$ ]]; then
  RUN_USER="${SUDO_USER:-$(whoami)}"
  SERVICE_FILE="/etc/systemd/system/freezer-inventory.service"

  cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=Freezer Inventory LAN Server
After=network.target

[Service]
Type=simple
User=${RUN_USER}
WorkingDirectory=${PROJECT_DIR}
ExecStart=/usr/bin/node server/index.js
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable freezer-inventory
  systemctl start  freezer-inventory

  info "Service installed and started."
  info "Check status: sudo systemctl status freezer-inventory"
  info "View logs:    sudo journalctl -u freezer-inventory -f"
else
  info "Skipping systemd service."
  echo
  echo -e "${GREEN}To start the server manually:${NC}"
  echo "  cd $PROJECT_DIR"
  echo "  node server/index.js"
fi

echo
echo -e "${GREEN}✅ Installation complete!${NC}"

# Print LAN address
IP=$(hostname -I | awk '{print $1}')
echo -e "\nFreezer Inventory will be available at:"
echo -e "  ${GREEN}http://${IP}:3000${NC}"
echo
