import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const root = dirname(fileURLToPath(import.meta.url));

function sitePlugin() {
  return {
    name: 'site-entry',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/' || req.url === '/index.html') req.url = '/dev.html';
        next();
      });
    },
    closeBundle() {
      const dist = resolve(root, 'dist');
      const dev = resolve(dist, 'dev.html');
      const index = resolve(dist, 'index.html');
      if (fs.existsSync(dev)) fs.renameSync(dev, index);
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), sitePlugin()],
  build: {
    rollupOptions: {
      input: resolve(root, 'dev.html'),
    },
  },
});
