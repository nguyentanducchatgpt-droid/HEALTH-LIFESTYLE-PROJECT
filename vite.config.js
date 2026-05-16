import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { copyFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const BASE = '/HEALTH-LIFESTYLE-PROJECT/';

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sức Khỏe và Đời Sống',
        short_name: 'SứcKhỏe',
        description: 'Hệ sinh thái sống khỏe — Health & Lifestyle',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        start_url: BASE,
        scope: BASE,
        icons: [
          { src: `${BASE}icon-192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${BASE}icon-512.png`, sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: null,
      },
    }),
    {
      name: 'github-pages-spa',
      closeBundle() {
        const dist = resolve(__dirname, 'dist');
        const src = join(dist, 'index.html');
        if (existsSync(src)) {
          copyFileSync(src, join(dist, '404.html'));
          writeFileSync(join(dist, '.nojekyll'), '');
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
  },
});
