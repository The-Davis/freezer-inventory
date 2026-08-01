// scripts/build.js
// Cross-platform build script for browser (default) and server modes.
// Usage:
//   node scripts/build.js            → browser mode (localStorage)
//   node scripts/build.js --server   → server mode (fetch API)

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const isServer = args.includes('--server');
const serverMode = isServer ? 'true' : 'false';

const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');

console.log(`\n🧊 Freezer Inventory — ${isServer ? 'SERVER' : 'BROWSER'} build\n`);

// Ensure dist/ exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Bundle TypeScript with esbuild
const esbuildCmd = [
  'npx esbuild src/main.ts',
  '--bundle',
  '--outfile=dist/app.js',
  `--define:SERVER_MODE=${serverMode}`,
  '--platform=browser',
  '--target=es2020',
  '--minify',
  '--sourcemap',
].join(' ');

console.log('Bundling TypeScript...');
execSync(esbuildCmd, { stdio: 'inherit', cwd: rootDir });

// Copy public/ assets to dist/
console.log('Copying static assets...');
const publicFiles = fs.readdirSync(publicDir);
for (const file of publicFiles) {
  const src = path.join(publicDir, file);
  const dest = path.join(distDir, file);
  fs.copyFileSync(src, dest);
  console.log(`  → dist/${file}`);
}

console.log('\n✅ Build complete! Output in dist/\n');
