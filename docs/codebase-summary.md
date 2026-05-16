# Sức Khỏe và Đời Sống — Health & Lifestyle Project

## Project Overview
Pure static Single Page Application (SPA) promoting holistic health through 6 foundational pillars. No backend services required. Built with Vite 5 for rapid development and optimized production builds.

**Live Deployment**: [GitHub Pages](https://nguyentanducchatgpt-droid.github.io/HEALTH-LIFESTYLE-PROJECT/)  
**Repository**: Health & Lifestyle Project  
**Contact**: nguyentanducchatgpt@gmail.com | Zalo: 0913723667

## Tech Stack
- **Framework**: React 18 with Vite 5 (dev/build tooling)
- **Routing**: React Router v6 (HashRouter for GitHub Pages)
- **Styling**: Tailwind CSS v3 + PostCSS + Autoprefixer
- **i18n**: react-i18next v15 + i18next v23 (language detection)
- **PWA**: vite-plugin-pwa v0.21 (offline-capable + auto-updates)
- **Language Support**: Vietnamese (primary), English, German (machine-translated)

## Project Structure

```
src/
├── i18n/
│   ├── index.js                 # i18next config + language detector
│   ├── vi/ { common.json, pillars.json }
│   ├── en/ { common.json, pillars.json }
│   └── de/ { common.json, pillars.json }
├── components/
│   ├── Layout.jsx               # App wrapper + Navbar + Footer
│   ├── Navbar.jsx               # Navigation + LanguageSwitcher
│   ├── LanguageSwitcher.jsx     # VI/EN/DE selector
│   ├── PillarCard.jsx           # Pillar preview card
│   ├── PillarPage.jsx           # Pillar detail template
│   ├── LocalVideoCard.jsx       # Local MP4 video player
│   ├── YoutubeEmbed.jsx         # YouTube iframe renderer
│   ├── ContactSection.jsx       # Email + Zalo contact info
│   └── DonateSection.jsx        # Bank transfer donation UI
├── pages/
│   ├── Home.jsx                 # Landing page (pillar grid)
│   ├── PillarA.jsx              # Exercise (with SQUAT, PUSH, PULL demos)
│   ├── PillarB.jsx              # Nutrition
│   ├── PillarC.jsx              # Lifestyle
│   ├── PillarD.jsx              # Mind (Mental Health)
│   ├── PillarE.jsx              # Health Literacy
│   ├── PillarF.jsx              # Tools
│   ├── VideoLibrary.jsx         # Full video index
│   └── App.jsx                  # Router setup
├── main.jsx                     # React root mount
└── index.css                    # Global styles + Tailwind directives

public/
├── videos/                      # Local exercise demos (MP4)
│   ├── SQUAT.mp4                # ~2.9 MB
│   ├── PUSH.mp4                 # ~3.0 MB
│   ├── PULL.mp4                 # ~3.3 MB
│   ├── HINGE.mp4                # ~2.5 MB
│   ├── CORE.mp4                 # ~2.3 MB
│   └── BREATH.mp4               # ~1.0 MB
├── 404.html                     # SPA fallback (GitHub Pages)
└── .nojekyll                    # Disable Jekyll processing
```

## Core Routes & Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | 6-pillar grid landing page |
| `/pillar/a` | PillarA | Exercise: Strength training movements |
| `/pillar/b` | PillarB | Nutrition: Diet & macro guidance |
| `/pillar/c` | PillarC | Lifestyle: Sleep, stress, habits |
| `/pillar/d` | PillarD | Mind: Mental health & meditation |
| `/pillar/e` | PillarE | Health Literacy: Education content |
| `/pillar/f` | PillarF | Tools: Calculators, trackers |
| `/videos` | VideoLibrary | All local exercise videos |

## Build & Deployment

**Development**: `npm run dev` (localhost:5173)  
**Production Build**: `npm run build` → `dist/` folder  
**CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`)
- Triggers: Push to `main` + manual workflow_dispatch
- Runs: `npm ci` → `npm run build` → Upload & deploy to GitHub Pages
- Base URL: `/HEALTH-LIFESTYLE-PROJECT/`
- PWA manifest: Automatically generated, standalone display mode

## i18n Configuration
- **Namespaces**: `common` (shared strings), `pillars` (pillar-specific content)
- **Detection Order**: Browser language → localStorage → Vietnamese default
- **Namespace Structure**: Enables loading only required translations per route
- **JSON Format**: Nested objects for organized keys

## Key Features

**Responsive Design**: Tailwind grid + flexbox auto-layout  
**Dark Theme**: Theme color `#0a0a0a` (dark background)  
**Offline Support**: Service Worker (PWA) caches assets & videos  
**GitHub Pages Hosting**: 404.html fallback routes all URLs to index.html  
**Multi-language SEO**: Language switcher + localStorage persistence

## Pending Configuration
- GA4 Tracking ID: `G-XXXXXXXXXX` (placeholder)
- YouTube URLs: Currently null/placeholder in content
- Bank Donation Info: Fields defined, awaiting bank details

## Contact & Support
- **Email**: nguyentanducchatgpt@gmail.com
- **Phone/Zalo**: 0913723667
- **Issues**: Create GitHub issue or contact above
