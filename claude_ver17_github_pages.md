# CLAUDE.md — PATCH v3.3 — Deploy Frontend trên GitHub Pages

> Chuyển hosting frontend: Cloudflare Pages → **GitHub Pages**
> Ảnh hưởng: Vite config, routing, CORS, cookies, CI/CD, PWA, env

---

## PHÂN TÍCH TÁC ĐỘNG

```
╔═══════════════════════════════════════════════════════════════════╗
║  GITHUB PAGES — ĐẶC ĐIỂM & HẠN CHẾ                             ║
║                                                                   ║
║  ✅ Static hosting miễn phí, tích hợp GitHub repo                ║
║  ✅ HTTPS tự động (*.github.io hoặc custom domain)               ║
║  ✅ GitHub Actions CI/CD built-in                                ║
║  ✅ Hash router (#/) hoạt động tốt — không cần server config     ║
║                                                                   ║
║  ⚠️ URL mặc định: https://username.github.io/repo-name/          ║
║     → Có subdirectory → Vite cần set `base: '/repo-name/'`       ║
║  ⚠️ Không có server-side routing → SPA cần 404.html trick        ║
║  ⚠️ Cross-origin với backend (github.io ≠ railway.app)           ║
║     → Cookie sameSite: 'none' BẮT BUỘC                          ║
║  ⚠️ Env vars: không có runtime env → phải bake vào build time   ║
║  ⚠️ Bandwidth limit: 100GB/tháng (dư sức cho app nhỏ-vừa)      ║
╚═══════════════════════════════════════════════════════════════════╝

  THAY ĐỔI CẦN LÀM:

  ┌──────────────────────────┬───────────────────────────────────┐
  │ File                     │ Thay đổi                          │
  ├──────────────────────────┼───────────────────────────────────┤
  │ vite.config.js           │ base, env, 404 copy               │
  │ .github/workflows/      │ THÊM MỚI: deploy.yml              │
  │ public/404.html          │ THÊM MỚI: SPA redirect            │
  │ index.html               │ Sửa asset paths                   │
  │ .env.production          │ THÊM MỚI: bake-time env           │
  │ api.js                   │ API_URL từ env                     │
  │ socket.js                │ WS_URL từ env                     │
  │ BE: CORS config          │ Thêm github.io origin             │
  │ BE: cookie config        │ COOKIE_CROSS_ORIGIN=true          │
  │ package.json             │ Thêm deploy script                │
  │ PWA manifest             │ Sửa start_url, scope              │
  └──────────────────────────┴───────────────────────────────────┘
```

---

## 2.1 Tech Stack — Cập nhật Infrastructure

```
├─────────────────────────────────────────────────────────┤
│                   INFRASTRUCTURE                        │
│  ★ GitHub Pages (Frontend — static SPA)                 │
│    URL: https://<user>.github.io/<repo>/                │
│    hoặc custom domain: https://suckhoe.vn               │
│  ★ GitHub Actions (CI/CD — auto build + deploy)         │
│  Railway/Render (Backend API server)                    │
│  Supabase/Neon (PostgreSQL) + Upstash (Redis)           │
│  Cloudflare R2 (media storage)                          │
│  JetBrains DataGrip (database management)               │
│  Sentry (error tracking) + PostHog (analytics)          │
└─────────────────────────────────────────────────────────┘
```

---

## 3.11 Vite Configuration — GitHub Pages (SỬA)

```javascript
// apps/web/vite.config.js
// ★ v3.3: Cấu hình cho GitHub Pages deployment

import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// ★ GitHub Pages: subdirectory = tên repo
// VD: repo "suc-khoe-doi-song" → URL: https://user.github.io/suc-khoe-doi-song/
// Nếu custom domain → base = '/'
const REPO_NAME = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
const BASE_PATH = process.env.CUSTOM_DOMAIN ? '/' : `/${REPO_NAME}/`;

export default defineConfig({
  root: '.',
  publicDir: 'public',

  // ★ QUAN TRỌNG: base path cho GitHub Pages subdirectory
  base: BASE_PATH,

  server: {
    port: 3000,
    proxy: {
      '/trpc': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
    },
    chunkSizeWarningLimit: 500,
    sourcemap: false,                    // Không cần sourcemap trên production
  },

  // ★ Environment variables — bake vào build time
  // Chỉ biến bắt đầu bằng VITE_ mới expose ra client
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version || '0.0.0'),
  },

  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sức Khỏe và Đời Sống',
        short_name: 'SứcKhỏe',
        description: 'Hệ sinh thái sống khỏe cho người Việt',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        start_url: BASE_PATH,            // ★ SỬA: dùng base path
        scope: BASE_PATH,               // ★ THÊM: giới hạn PWA scope
        icons: [
          { src: `${BASE_PATH}assets/icon-192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${BASE_PATH}assets/icon-512.png`, sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // ★ NavigateFallback cho SPA — trả index.html cho mọi route
        navigateFallback: `${BASE_PATH}index.html`,
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
          },
          {
            // ★ Cache API calls — domain backend
            urlPattern: ({ url }) => url.pathname.startsWith('/trpc'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 300 },
            },
          },
        ],
      },
    }),

    // ★ THÊM: Copy index.html → 404.html cho GitHub Pages SPA routing
    {
      name: 'github-pages-spa',
      closeBundle() {
        const fs = require('fs');
        const path = require('path');
        const distDir = path.resolve(__dirname, 'dist');
        const indexPath = path.join(distDir, 'index.html');
        const notFoundPath = path.join(distDir, '404.html');
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, notFoundPath);
          console.log('✅ Copied index.html → 404.html (GitHub Pages SPA fallback)');
        }
        // ★ THÊM: .nojekyll file (GitHub Pages không process Jekyll)
        fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
        console.log('✅ Created .nojekyll');
      },
    },
  ],
});
```

---

## THÊM MỚI: public/404.html — SPA Redirect cho GitHub Pages

```html
<!-- apps/web/public/404.html -->
<!-- ★ GitHub Pages trả 404 cho mọi route ngoài index.html
     Script này redirect về index.html với path gốc trong query string
     → main.js đọc và navigate đúng route -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Đang chuyển hướng...</title>
  <script>
    // Redirect đến index.html, giữ nguyên path
    // VD: /suc-khoe-doi-song/dashboard → /suc-khoe-doi-song/?redirect=/dashboard
    var pathSegmentsToKeep = window.location.pathname.split('/').length - 1;
    var repo = window.location.pathname.split('/')[1] || '';
    var path = window.location.pathname.replace('/' + repo, '') || '/';
    var query = window.location.search;
    window.location.replace(
      window.location.origin + '/' + repo + '/?redirect=' + encodeURIComponent(path + query)
    );
  </script>
</head>
<body>
  <p>Đang chuyển hướng...</p>
</body>
</html>
```

```javascript
// ★ apps/web/src/main.js — THÊM vào đầu boot():
// Xử lý redirect từ 404.html (GitHub Pages SPA fallback)

async function boot() {
  // ★ GitHub Pages SPA redirect handling
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');
  if (redirect) {
    // Xóa query string và navigate đến route gốc
    window.history.replaceState(null, '', window.location.pathname);
    window.location.hash = `#${redirect}`;
  }

  await initAuth();
  initRouter();
}
```

---

## THÊM MỚI: .env files

```bash
# apps/web/.env.development
# ★ Dùng khi chạy local: npm run dev

VITE_API_URL=http://localhost:4000
VITE_WS_URL=http://localhost:4000
```

```bash
# apps/web/.env.production
# ★ Bake vào build time khi GitHub Actions build
# Giá trị thực sẽ được set trong GitHub Secrets → workflow inject

VITE_API_URL=https://api-suckhoe.railway.app
VITE_WS_URL=https://api-suckhoe.railway.app
```

```bash
# ★ Nếu dùng custom domain:
# apps/web/.env.production (custom domain)
# VITE_API_URL=https://api.suckhoe.vn
# VITE_WS_URL=https://api.suckhoe.vn
# CUSTOM_DOMAIN=true
```

---

## THÊM MỚI: GitHub Actions — CI/CD Auto Deploy

```yaml
# .github/workflows/deploy-frontend.yml
# ★ Auto build + deploy frontend lên GitHub Pages khi push vào main

name: Deploy Frontend to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'apps/web/**'        # Chỉ trigger khi FE thay đổi
      - 'packages/shared/**'  # Hoặc shared schemas thay đổi
  workflow_dispatch:          # Cho phép trigger thủ công

# Quyền để deploy lên GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Chỉ cho phép 1 deployment chạy cùng lúc
concurrency:
  group: "pages"
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

      # ★ Build shared package trước (Zod schemas)
      - name: Build shared package
        run: npm run build --workspace=packages/shared

      # ★ Build frontend với env variables từ GitHub Secrets
      - name: Build frontend
        working-directory: apps/web
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_WS_URL: ${{ secrets.VITE_WS_URL }}
          CUSTOM_DOMAIN: ${{ secrets.CUSTOM_DOMAIN }}
        run: npm run build

      # ★ Upload artifact cho Pages deployment
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: apps/web/dist

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

```yaml
# .github/workflows/deploy-backend.yml
# ★ Auto deploy backend lên Railway khi push vào main

name: Deploy Backend to Railway

on:
  push:
    branches: [main]
    paths:
      - 'apps/api/**'
      - 'packages/shared/**'
      - 'prisma/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: api-server
```

---

## THÊM MỚI: GitHub Secrets cần thiết

```
  ┌─────────────────────────────────────────────────────────────────┐
  │  GITHUB REPO → Settings → Secrets and variables → Actions      │
  │                                                                 │
  │  Repository Secrets cần tạo:                                    │
  │                                                                 │
  │  ┌───────────────────────┬─────────────────────────────────┐   │
  │  │ Secret Name           │ Giá trị mẫu                     │   │
  │  ├───────────────────────┼─────────────────────────────────┤   │
  │  │ VITE_API_URL          │ https://api-suckhoe.railway.app │   │
  │  │ VITE_WS_URL           │ https://api-suckhoe.railway.app │   │
  │  │ CUSTOM_DOMAIN         │ (để trống nếu dùng github.io)   │   │
  │  │ RAILWAY_TOKEN         │ (từ Railway dashboard)           │   │
  │  └───────────────────────┴─────────────────────────────────┘   │
  │                                                                 │
  │  ★ Nếu dùng custom domain (suckhoe.vn):                       │
  │  1. Repo → Settings → Pages → Custom domain → suckhoe.vn      │
  │  2. DNS: CNAME record: suckhoe.vn → username.github.io        │
  │  3. Secret CUSTOM_DOMAIN = true                                │
  │  4. Secret VITE_API_URL = https://api.suckhoe.vn               │
  └─────────────────────────────────────────────────────────────────┘
```

---

## SỬA: Backend CORS — Thêm GitHub Pages origin

```typescript
// apps/api/src/index.ts — ★ SỬA CORS origins

app.use(cors({
  origin: [
    'http://localhost:3000',                         // Dev (Vite)
    'http://localhost:5173',                         // Dev (Vite default)
    process.env.FRONTEND_URL!,                       // Prod URL từ env
    // ★ GitHub Pages patterns:
    /^https:\/\/[\w-]+\.github\.io$/,                // https://user.github.io
    /^https:\/\/[\w-]+\.github\.io\/[\w-]+$/,        // https://user.github.io/repo
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
}));

// Socket.io CORS cũng cập nhật
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      process.env.FRONTEND_URL!,
      /^https:\/\/[\w-]+\.github\.io(\/[\w-]+)?$/,
    ],
    credentials: true,
  },
});
```

```bash
# Backend .env — ★ SỬA:
FRONTEND_URL=https://username.github.io/suc-khoe-doi-song
# Hoặc nếu custom domain:
# FRONTEND_URL=https://suckhoe.vn

# ★ BẮT BUỘC = true vì github.io ≠ railway.app (cross-origin)
COOKIE_CROSS_ORIGIN=true
```

---

## SỬA: index.html — Asset paths tương thích base path

```html
<!-- apps/web/index.html -->
<!-- ★ v3.3: Asset paths dùng relative thay vì absolute -->
<!DOCTYPE html>
<html lang="vi" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sức Khỏe và Đời Sống — Hệ sinh thái sống khỏe cho người Việt</title>

  <meta name="description" content="Hệ sinh thái sống khỏe đơn giản, khoa học, bền vững cho người Việt Nam." />

  <!-- Open Graph — dùng absolute URL (inject bởi build) -->
  <meta property="og:title" content="Sức Khỏe và Đời Sống" />
  <meta property="og:description" content="Hệ sinh thái sống khỏe cho người Việt" />
  <meta property="og:type" content="website" />

  <!-- Fonts — absolute URL, không ảnh hưởng bởi base path -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

  <!-- PWA — Vite sẽ inject đúng base path khi build -->
  <link rel="manifest" href="manifest.webmanifest" />
  <meta name="theme-color" content="#0a0a0a" />

  <!-- ★ Favicon: relative path (Vite resolves) -->
  <link rel="icon" type="image/x-icon" href="favicon.ico" />
</head>
<body>
  <div id="app">
    <div class="initial-loader">
      <div class="initial-loader__ring"></div>
      <p>Đang tải...</p>
    </div>
  </div>

  <!-- ★ Vite sẽ tự thêm base path cho module script khi build -->
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

---

## SỬA: App Shell — Sidebar links dùng hash router (không ảnh hưởng base path)

```javascript
// ★ KIỂM TRA: Sidebar links đang dùng hash (#/dashboard, #/chat...)
// → Hash router KHÔNG bị ảnh hưởng bởi GitHub Pages subdirectory
// → KHÔNG CẦN SỬA

// VD: https://user.github.io/suc-khoe-doi-song/#/dashboard
//     Base path: /suc-khoe-doi-song/
//     Hash: #/dashboard
//     → Router đọc hash → OK

// ★ NHƯNG: navigate() cần kiểm tra
// navigate('/dashboard') → window.location.hash = '#/dashboard'
// → Chỉ set hash, KHÔNG touch pathname → OK ✅
```

---

## SỬA: package.json — Scripts

```json
{
  "name": "suc-khoe-doi-song",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "npm run dev --workspace=apps/web",
    "dev:api": "npm run dev --workspace=apps/api",
    "dev:all": "concurrently \"npm run dev\" \"npm run dev:api\"",

    "build": "npm run build --workspace=packages/shared && npm run build --workspace=apps/web",
    "build:api": "npm run build --workspace=packages/shared && npm run build --workspace=apps/api",

    "preview": "npm run preview --workspace=apps/web",

    "type-check": "tsc --noEmit --workspace=apps/api",

    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

```json
// apps/web/package.json
{
  "name": "@suckhoe/web",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "chart.js": "^4.4.0",
    "socket.io-client": "^4.7.0",
    "superjson": "^2.2.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "vite-plugin-pwa": "^0.20.0"
  }
}
```

---

## THÊM MỚI: Hướng dẫn Deploy lần đầu

```
═══════════════════════════════════════════════════════════════
  HƯỚNG DẪN DEPLOY FRONTEND LÊN GITHUB PAGES
═══════════════════════════════════════════════════════════════

  BƯỚC 1: Chuẩn bị GitHub Repo
  ─────────────────────────────
  $ git init
  $ git remote add origin https://github.com/<user>/suc-khoe-doi-song.git
  $ git push -u origin main

  BƯỚC 2: Bật GitHub Pages
  ────────────────────────
  Repo → Settings → Pages
  → Source: "GitHub Actions" (KHÔNG phải "Deploy from a branch")

  BƯỚC 3: Tạo Secrets
  ───────────────────
  Repo → Settings → Secrets and variables → Actions → New repository secret
  → VITE_API_URL = https://api-suckhoe.railway.app
  → VITE_WS_URL  = https://api-suckhoe.railway.app
  → RAILWAY_TOKEN = (từ Railway dashboard)

  BƯỚC 4: Push code → Auto deploy
  ────────────────────────────────
  $ git add .
  $ git commit -m "feat: initial frontend"
  $ git push origin main
  → GitHub Actions tự chạy → build → deploy
  → URL: https://<user>.github.io/suc-khoe-doi-song/

  BƯỚC 5: Kiểm tra
  ────────────────
  → Mở URL → Landing page hiển thị
  → Click "Đăng ký" → form hoạt động
  → F12 Console → không có CORS errors
  → Ctrl+R (reload) → SPA redirect OK (404.html trick)

  BƯỚC 6 (Tùy chọn): Custom Domain
  ──────────────────────────────────
  1. Mua domain (VD: suckhoe.vn)
  2. DNS: thêm CNAME record
     suckhoe.vn → <user>.github.io
  3. Repo → Settings → Pages → Custom domain → suckhoe.vn
  4. Cập nhật Secrets:
     VITE_API_URL = https://api.suckhoe.vn
     CUSTOM_DOMAIN = true
  5. Cập nhật Backend .env:
     FRONTEND_URL = https://suckhoe.vn
     COOKIE_CROSS_ORIGIN = false  (nếu api.suckhoe.vn cùng eTLD+1)
  6. Push → auto redeploy

  ★ KHUYẾN NGHỊ: Dùng custom domain để:
  - Cookie sameSite:'strict' hoạt động (an toàn hơn)
  - URL chuyên nghiệp hơn
  - SEO tốt hơn
═══════════════════════════════════════════════════════════════
```

---

## TRACE LẠI: GitHub Pages ảnh hưởng luồng dữ liệu?

```
  ĐIỂM KIỂM TRA          │ github.io (no custom domain) │ Custom domain
══════════════════════════╪══════════════════════════════╪══════════════════
  SPA Routing             │ ✅ Hash router không ảnh      │ ✅ Tương tự
  (#/dashboard, #/chat)   │    hưởng bởi subdirectory    │
──────────────────────────┼──────────────────────────────┼──────────────────
  Asset loading           │ ✅ Vite base path xử lý      │ ✅ base = '/'
  (JS, CSS, images)       │    /repo-name/ prefix        │
──────────────────────────┼──────────────────────────────┼──────────────────
  API calls               │ ✅ Absolute URL (VITE_API_URL)│ ✅ Tương tự
  (tRPC fetch)            │    Không phụ thuộc base path │
──────────────────────────┼──────────────────────────────┼──────────────────
  WebSocket               │ ✅ Absolute URL (VITE_WS_URL) │ ✅ Tương tự
  (Socket.io)             │    withCredentials: true     │
──────────────────────────┼──────────────────────────────┼──────────────────
  CORS                    │ ✅ Backend whitelist          │ ✅ Tương tự
                          │    *.github.io pattern       │
──────────────────────────┼──────────────────────────────┼──────────────────
  Refresh token cookie    │ ⚠️ sameSite:'none' bắt buộc  │ ✅ sameSite:
                          │    (cross-origin)            │    'strict' OK
                          │    COOKIE_CROSS_ORIGIN=true  │    (cùng eTLD+1)
──────────────────────────┼──────────────────────────────┼──────────────────
  Page refresh / reload   │ ✅ 404.html → redirect →     │ ✅ Tương tự
                          │    index.html → hash route   │
──────────────────────────┼──────────────────────────────┼──────────────────
  PWA install             │ ✅ manifest scope =           │ ✅ scope = '/'
                          │    /repo-name/               │
──────────────────────────┼──────────────────────────────┼──────────────────
  Chatbot data flow       │ ✅ KHÔNG ẢNH HƯỞNG           │ ✅ Tương tự
  (FE→BE→buildContext     │    (chỉ hosting thay đổi,    │
  →Claude→WS)             │    logic code giữ nguyên)    │
──────────────────────────┼──────────────────────────────┼──────────────────
  LUỒNG DỮ LIỆU          │ ✅ THÔNG SUỐT                │ ✅ THÔNG SUỐT
══════════════════════════╧══════════════════════════════╧══════════════════
```

---

## TOÀN BỘ FILE HỆ THỐNG SAU v3.3

```
suc-khoe-doi-song/
├── .github/
│   └── workflows/
│       ├── deploy-frontend.yml     ★ THÊM MỚI — auto deploy FE
│       └── deploy-backend.yml      ★ THÊM MỚI — auto deploy BE
├── apps/
│   ├── web/                        (Frontend — deploy lên GitHub Pages)
│   │   ├── index.html              ★ SỬA — relative asset paths
│   │   ├── vite.config.js          ★ SỬA — base path + 404 copy
│   │   ├── .env.development        ★ THÊM — local dev env
│   │   ├── .env.production         ★ THÊM — prod env (override by secrets)
│   │   ├── public/
│   │   │   ├── 404.html            ★ THÊM — SPA redirect trick
│   │   │   ├── .nojekyll           ★ THÊM — disable Jekyll processing
│   │   │   ├── favicon.ico
│   │   │   ├── manifest.json       (auto-gen bởi vite-plugin-pwa)
│   │   │   └── assets/
│   │   ├── src/
│   │   │   ├── main.js             ★ SỬA — redirect handling từ 404.html
│   │   │   ├── router.js           (giữ nguyên — hash router)
│   │   │   ├── store.js            (giữ nguyên)
│   │   │   ├── api.js              (giữ nguyên — dùng VITE_API_URL)
│   │   │   ├── socket.js           (giữ nguyên — dùng VITE_WS_URL)
│   │   │   ├── pages/              (giữ nguyên)
│   │   │   ├── components/         (giữ nguyên)
│   │   │   ├── validators/         (giữ nguyên)
│   │   │   └── styles/             (giữ nguyên)
│   │   └── package.json            ★ SỬA — scripts
│   │
│   └── api/                        (Backend — deploy lên Railway)
│       ├── src/
│       │   ├── index.ts            ★ SỬA — CORS origins
│       │   ├── lib/
│       │   │   └── cookie.ts       (giữ nguyên v3.2 — sameSite dynamic)
│       │   └── ...                 (giữ nguyên)
│       └── .env                    ★ SỬA — FRONTEND_URL + COOKIE_CROSS_ORIGIN
│
├── packages/
│   └── shared/                     (giữ nguyên)
│
├── package.json                    ★ SỬA — workspace scripts
├── .gitignore
└── claude.md
```

---

> **Phiên bản**: 3.3 — Deploy Frontend trên GitHub Pages
> **Thay đổi so với v3.2**: Hosting, CI/CD, env vars, CORS origins
> **Luồng dữ liệu**: KHÔNG ẢNH HƯỞNG — hash router + absolute API URLs = hoạt động giống hệt
> **Khuyến nghị**: Dùng custom domain (suckhoe.vn + api.suckhoe.vn) để cookie sameSite:'strict' hoạt động an toàn nhất
