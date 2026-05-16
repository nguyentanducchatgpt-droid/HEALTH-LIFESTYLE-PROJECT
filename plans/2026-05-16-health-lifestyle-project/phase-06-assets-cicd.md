# Phase 06 — Public Assets + CI/CD
**Parent**: [plan.md](plan.md) | **Can run parallel with**: Phase 05 | **Status**: ⬜ Pending | **Priority**: HIGH

## Overview
Copy video assets, create 404.html SPA redirect, .nojekyll, and GitHub Actions deployment workflow.

## Files to Create/Copy

| File | Action |
|------|--------|
| `public/videos/SQUAT.mp4` | COPY from `Documents/Video/` |
| `public/videos/PUSH.mp4` | COPY |
| `public/videos/PULL.mp4` | COPY |
| `public/videos/HINGE.mp4` | COPY |
| `public/videos/CORE.mp4` | COPY |
| `public/videos/BREATH.mp4` | COPY |
| `public/404.html` | CREATE — SPA redirect |
| `public/.nojekyll` | CREATE — empty file |
| `.github/workflows/deploy.yml` | CREATE — CI/CD |

## Implementation Steps

### 1. Copy video files
```bash
cp "Documents/Video/SQUAT.mp4" "public/videos/SQUAT.mp4"
cp "Documents/Video/PUSH.mp4"  "public/videos/PUSH.mp4"
cp "Documents/Video/PULL.mp4"  "public/videos/PULL.mp4"
cp "Documents/Video/HINGE.mp4" "public/videos/HINGE.mp4"
cp "Documents/Video/CORE.mp4"  "public/videos/CORE.mp4"
cp "Documents/Video/BREATH.mp4" "public/videos/BREATH.mp4"
```
Total: ~14MB — safe for GitHub repo (well under 100MB/file limit).

### 2. public/404.html — SPA Redirect (từ claude_ver17 v3.3)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Đang chuyển hướng...</title>
  <script>
    var repo = 'HEALTH-LIFESTYLE-PROJECT';
    var path = window.location.pathname.replace('/' + repo, '') || '/';
    var query = window.location.search;
    window.location.replace(
      window.location.origin + '/' + repo + '/?redirect=' + encodeURIComponent(path + query)
    );
  </script>
</head>
<body><p>Đang chuyển hướng...</p></body>
</html>
```

**Note**: Với hash router (`#/path`), trang 404.html hiếm khi trigger vì mọi navigation đều thay đổi hash, không phải path. Tuy nhiên vẫn cần cho trường hợp user bookmark hoặc share URL trực tiếp.

### 3. public/.nojekyll
Empty file — ngăn GitHub Pages process Jekyll (which strips files starting with `_`).

### 4. .github/workflows/deploy.yml
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'public/**'
      - 'index.html'
      - 'vite.config.js'
      - 'package.json'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 5. GitHub Repo Setup Checklist (manual steps)
1. Push code to `main` branch of `https://github.com/nguyentanducchatgpt-droid/HEALTH-LIFESTYLE-PROJECT`
2. Go to: `Settings → Pages → Source: GitHub Actions`
3. Push → Actions auto-trigger → deploy
4. Verify URL: `https://nguyentanducchatgpt-droid.github.io/HEALTH-LIFESTYLE-PROJECT/`

### 6. vite.config.js — ESM-compatible closeBundle hook (fix từ Phase 01)
```javascript
// Phase 01 dùng require() — không hoạt động trong ESM.
// Sửa lại:
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
    VitePWA({ /* ...same config... */ }),
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
  build: { outDir: 'dist', sourcemap: false },
});
```

## Todo List
- [ ] Create `public/videos/` directory
- [ ] Copy 6 MP4 files from `Documents/Video/` → `public/videos/`
- [ ] Create `public/404.html`
- [ ] Create `public/.nojekyll`
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Fix `vite.config.js` to use ESM imports (not `require`)
- [ ] Run `npm run build` locally → verify `dist/` has 404.html + .nojekyll
- [ ] Push to GitHub → verify Actions workflow runs
- [ ] Open GitHub Pages URL → verify site loads

## Success Criteria
- `npm run build` produces `dist/` containing: `index.html`, `404.html`, `.nojekyll`, `videos/*.mp4`
- GitHub Actions workflow completes without errors
- `https://nguyentanducchatgpt-droid.github.io/HEALTH-LIFESTYLE-PROJECT/` loads correctly
- Videos play from Pages URL (no CORS issues — same origin)
- Refresh on any hash route → stays on correct page

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| Videos not included in dist (Vite ignores public?) | `public/` is auto-copied to `dist/` by Vite — verify with build |
| `npm ci` fails on ubuntu (package-lock.json missing) | Run `npm install` locally first to generate lock file, commit it |
| GitHub Actions `pages` permission error | Ensure `Settings → Pages → Source: GitHub Actions` is set |
| 14MB videos slow first load | `preload="metadata"` on video tags — only downloads thumbnail |
| closeBundle in ESM using `require` → runtime error | Use ESM imports as shown above |

## Security Considerations
- No secrets in workflow — build is purely static
- Videos served from same github.io origin — no CORS issues
- PWA service worker scope limited to `/HEALTH-LIFESTYLE-PROJECT/`

## Next Steps (post-deploy)
- Add GA4 Measurement ID (replace `G-XXXXXXXXXX`)
- Add YouTube video IDs when available
- Add bank QR code for Donate section
- Consider custom domain `suckhoe.vn` (update base to `/` and workflow CNAME)
