import fs from 'fs';
import path from 'path';

const root = process.cwd();
const dist = path.join(root, 'dist');

for (const file of ['index.html', 'favicon.ico', 'favicon.svg', '.nojekyll']) {
  const src = path.join(dist, file);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(root, file));
}

const assetsSrc = path.join(dist, 'assets');
const assetsDest = path.join(root, 'assets');
if (fs.existsSync(assetsSrc)) {
  fs.rmSync(assetsDest, { recursive: true, force: true });
  fs.cpSync(assetsSrc, assetsDest, { recursive: true });
}

console.log('Synced build output to repo root for GitHub Pages');
