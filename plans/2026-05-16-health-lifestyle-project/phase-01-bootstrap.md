# Phase 01 — Project Bootstrap
**Parent**: [plan.md](plan.md) | **Status**: ⬜ Pending | **Priority**: CRITICAL (blocks all)

## Overview
Init Vite + React project scaffold: package.json, vite.config.js, tailwind, postcss, index.html, .gitignore.

## Requirements
- Vite 5 + React 18 SPA với base path `/HEALTH-LIFESTYLE-PROJECT/`
- Tailwind CSS v3 (dark theme primary)
- PWA via vite-plugin-pwa
- Be Vietnam Pro font (Google Fonts)
- GA4 script placeholder
- Hash router compatible (no server-side routing needed)

## Architecture

```
Root config files:
package.json          → deps + scripts
vite.config.js        → base, react plugin, PWA plugin, 404 copy hook
tailwind.config.js    → dark theme colors, font
postcss.config.js     → tailwind + autoprefixer
index.html            → font link, GA4 script, meta, div#root
.gitignore            → node_modules, dist, .env
```

## Files to Create

| File | Action |
|------|--------|
| `package.json` | CREATE |
| `vite.config.js` | CREATE |
| `tailwind.config.js` | CREATE |
| `postcss.config.js` | CREATE |
| `index.html` | CREATE |
| `.gitignore` | CREATE |

## Implementation Steps

### 1. package.json
```json
{
  "name": "health-lifestyle-project",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "react-i18next": "^15.0.2",
    "i18next": "^23.15.1",
    "i18next-browser-languagedetector": "^8.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.2",
    "vite": "^5.4.11",
    "vite-plugin-pwa": "^0.21.1",
    "tailwindcss": "^3.4.14",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47"
  }
}
```

### 2. vite.config.js
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

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
    }),
    // Copy index.html → 404.html for GitHub Pages SPA fallback
    {
      name: 'github-pages-spa',
      closeBundle() {
        const fs = require('fs');
        const path = require('path');
        const dist = path.resolve(__dirname, 'dist');
        fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'));
        fs.writeFileSync(path.join(dist, '.nojekyll'), '');
      },
    },
  ],
  build: { outDir: 'dist', sourcemap: false },
});
```

### 3. tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        surface: '#111111',
        border: '#1f1f1f',
        accent: '#22c55e',       // green-500
        'accent-hover': '#16a34a',
        text: '#e5e7eb',
        muted: '#6b7280',
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

### 4. postcss.config.js
```javascript
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

### 5. index.html
```html
<!DOCTYPE html>
<html lang="vi" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sức Khỏe và Đời Sống</title>
  <meta name="description" content="Hệ sinh thái sống khỏe — Health & Lifestyle" />
  <link rel="manifest" href="manifest.webmanifest" />
  <meta name="theme-color" content="#0a0a0a" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <!-- Google Analytics 4 — replace G-XXXXXXXXXX with real ID -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
</head>
<body class="bg-bg text-text font-sans antialiased">
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### 6. .gitignore
```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
```

## Todo List
- [ ] Create `package.json`
- [ ] Create `vite.config.js`
- [ ] Create `tailwind.config.js`
- [ ] Create `postcss.config.js`
- [ ] Create `index.html`
- [ ] Create `.gitignore`
- [ ] Run `npm install` to verify deps resolve

## Success Criteria
- `npm run dev` starts without errors
- `npm run build` produces `dist/` with correct base path
- Tailwind classes compile in browser dev tools
- Font Be Vietnam Pro loads from Google Fonts

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| vite-plugin-pwa requires `require()` (CJS) in closeBundle | Medium | Use `createRequire` or import fs directly |
| Base path mismatch on local dev | Low | Dev server serves from `/`, prod uses base |

## Notes
- `vite.config.js` closeBundle hook: Vite 5 + ESM — use `import fs from 'fs'` at top, not `require()`
- Tailwind v3: content must include `./src/**/*.{js,jsx}` for purging
