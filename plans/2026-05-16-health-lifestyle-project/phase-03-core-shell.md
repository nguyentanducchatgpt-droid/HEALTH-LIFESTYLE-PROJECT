# Phase 03 — Core Shell
**Parent**: [plan.md](plan.md) | **Depends on**: Phase 01, 02 | **Status**: ⬜ Pending | **Priority**: HIGH

## Overview
App entry point + routing + layout shell. Includes: main.jsx, App.jsx, Layout, Navbar, LanguageSwitcher.

## Architecture

```
main.jsx
  └── <React.StrictMode>
        └── <App />   (imports i18n, wraps in HashRouter)
              └── <Layout>
                    ├── <Navbar>
                    │     └── <LanguageSwitcher>
                    ├── <main> → <Routes> → <Page />
                    └── <footer>
```

**Routing** (hash-based — `#/path`):
```
#/              → Home
#/pillar/a      → PillarA
#/pillar/b      → PillarB
#/pillar/c      → PillarC
#/pillar/d      → PillarD
#/pillar/e      → PillarE
#/pillar/f      → PillarF
#/videos        → VideoLibrary
```
Contact & Donate → sections on Home page (scroll anchor)

## Files to Create

| File | Action |
|------|--------|
| `src/main.jsx` | CREATE |
| `src/App.jsx` | CREATE |
| `src/components/Layout.jsx` | CREATE |
| `src/components/Navbar.jsx` | CREATE |
| `src/components/LanguageSwitcher.jsx` | CREATE |
| `src/index.css` | CREATE (Tailwind directives) |

## Implementation Steps

### 1. src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Smooth scroll for anchor links */
html { scroll-behavior: smooth; }

/* Custom scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0a0a0a; }
::-webkit-scrollbar-thumb { background: #22c55e; border-radius: 3px; }
```

### 2. src/main.jsx
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n/index.js';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 3. src/App.jsx
```jsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PillarA from './pages/PillarA';
import PillarB from './pages/PillarB';
import PillarC from './pages/PillarC';
import PillarD from './pages/PillarD';
import PillarE from './pages/PillarE';
import PillarF from './pages/PillarF';
import VideoLibrary from './pages/VideoLibrary';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pillar/a" element={<PillarA />} />
          <Route path="/pillar/b" element={<PillarB />} />
          <Route path="/pillar/c" element={<PillarC />} />
          <Route path="/pillar/d" element={<PillarD />} />
          <Route path="/pillar/e" element={<PillarE />} />
          <Route path="/pillar/f" element={<PillarF />} />
          <Route path="/videos" element={<VideoLibrary />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
```

### 4. src/components/Layout.jsx
```jsx
import Navbar from './Navbar';
import { useTranslation } from 'react-i18next';

export default function Layout({ children }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:px-8">
        {children}
      </main>
      <footer className="border-t border-border py-6 text-center text-muted text-sm">
        <p>{t('footer.copyright')}</p>
        <p className="mt-1 text-xs max-w-xl mx-auto">{t('footer.disclaimer')}</p>
      </footer>
    </div>
  );
}
```

### 5. src/components/Navbar.jsx
```jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_LINKS = [
  { key: 'nav.home', to: '/' },
  { key: 'nav.videos', to: '/videos' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (to) => location.pathname === to;

  return (
    <nav className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-accent text-lg">
          🌿 Sức Khỏe & Đời Sống
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ key, to }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive(to) ? 'text-accent' : 'text-muted'
              }`}
            >
              {t(key)}
            </Link>
          ))}
          {/* Scroll anchors */}
          <a href="#contact" className="text-sm font-medium text-muted hover:text-accent transition-colors">
            {t('nav.contact')}
          </a>
          <a href="#donate" className="text-sm font-medium text-muted hover:text-accent transition-colors">
            {t('nav.donate')}
          </a>
          <LanguageSwitcher />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-muted hover:text-accent"
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface border-b border-border px-4 pb-4 flex flex-col gap-3">
          {NAV_LINKS.map(({ key, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-muted hover:text-accent"
            >
              {t(key)}
            </Link>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="text-sm text-muted hover:text-accent">
            {t('nav.contact')}
          </a>
          <a href="#donate" onClick={() => setOpen(false)} className="text-sm text-muted hover:text-accent">
            {t('nav.donate')}
          </a>
          <LanguageSwitcher />
        </div>
      )}
    </nav>
  );
}
```

### 6. src/components/LanguageSwitcher.jsx
```jsx
import { useTranslation } from 'react-i18next';

const LANGS = ['vi', 'en', 'de'];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.slice(0, 2) || 'vi';

  return (
    <div className="flex gap-1">
      {LANGS.map((lang) => (
        <button
          key={lang}
          onClick={() => i18n.changeLanguage(lang)}
          className={`px-2 py-1 text-xs rounded font-medium uppercase transition-colors ${
            current === lang
              ? 'bg-accent text-bg'
              : 'bg-border text-muted hover:text-accent'
          }`}
          aria-label={`Switch to ${lang}`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
```

## Todo List
- [ ] Create `src/index.css`
- [ ] Create `src/main.jsx`
- [ ] Create `src/App.jsx`
- [ ] Create `src/components/Layout.jsx`
- [ ] Create `src/components/Navbar.jsx`
- [ ] Create `src/components/LanguageSwitcher.jsx`
- [ ] Verify hash routing works: navigate to `#/videos` → VideoLibrary renders

## Success Criteria
- Navbar shows on all pages, sticky at top
- Mobile hamburger opens/closes correctly on <768px
- Language buttons switch i18n instantly without reload
- Footer disclaimer shows in correct language

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| Hash anchor `#contact` conflicts with hash router | Use `window.location.hash` directly or scroll-to-id function |
| Mobile nav not closing on link click | `onClick={() => setOpen(false)}` on each link |
| i18n not initialized before first render | import i18n in main.jsx before App render |

## Security Considerations
- All nav links internal — no external URL injection
- No `dangerouslySetInnerHTML` usage
