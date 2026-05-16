# Phase 05 — Pages
**Parent**: [plan.md](plan.md) | **Depends on**: Phase 03, 04 | **Status**: ⬜ Pending | **Priority**: HIGH

## Overview
Build all 9 page components: Home (hero + pillar overview + contact + donate), 6 Pillar detail pages, VideoLibrary.

## Architecture

```
Pages:
├── Home.jsx         → hero + 6 PillarCards + ContactSection + DonateSection
├── PillarA.jsx      → pillar content + 5 local video cards (SQUAT/PUSH/PULL/HINGE/CORE)
├── PillarB.jsx      → pillar content only
├── PillarC.jsx      → pillar content + BREATH video
├── PillarD.jsx      → pillar content + BREATH video
├── PillarE.jsx      → pillar content only
├── PillarF.jsx      → pillar content only
└── VideoLibrary.jsx → all 6 local videos + YouTube embed placeholders
```

## Files to Create

| File | Action |
|------|--------|
| `src/pages/Home.jsx` | CREATE |
| `src/pages/PillarA.jsx` | CREATE |
| `src/pages/PillarB.jsx` | CREATE |
| `src/pages/PillarC.jsx` | CREATE |
| `src/pages/PillarD.jsx` | CREATE |
| `src/pages/PillarE.jsx` | CREATE |
| `src/pages/PillarF.jsx` | CREATE |
| `src/pages/VideoLibrary.jsx` | CREATE |

## Implementation Steps

### 1. src/pages/Home.jsx
```jsx
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PillarCard from '../components/PillarCard';
import ContactSection from '../components/ContactSection';
import DonateSection from '../components/DonateSection';

const PILLARS = ['pillarA', 'pillarB', 'pillarC', 'pillarD', 'pillarE', 'pillarF'];

export default function Home() {
  const { t } = useTranslation();
  return (
    <div>
      {/* Hero */}
      <section className="py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-text leading-tight">
          {t('hero.title')}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#pillars"
            className="px-6 py-3 bg-accent hover:bg-accent-hover text-bg font-semibold rounded-lg transition-colors"
          >
            {t('hero.cta')}
          </a>
          <Link
            to="/videos"
            className="px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-bg font-semibold rounded-lg transition-colors"
          >
            {t('nav.videos')} →
          </Link>
        </div>
      </section>

      {/* Safety note */}
      <div className="bg-surface border border-yellow-500/30 rounded-lg p-4 mb-12 text-sm text-yellow-400 text-center">
        {t('common.safety_note')}
      </div>

      {/* 6 Pillars grid */}
      <section id="pillars" className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">{t('hero.pillars_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((key) => (
            <PillarCard key={key} pillarKey={key} />
          ))}
        </div>
      </section>

      <ContactSection />
      <DonateSection />
    </div>
  );
}
```

### 2. Pillar Page Template (dùng cho tất cả 6 pillar pages)

Tạo shared PillarPage component pattern — mỗi pillar page đều theo cùng layout:

```jsx
// src/pages/PillarA.jsx  (tương tự cho B, C, D, E, F)
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LocalVideoCard from '../components/LocalVideoCard';

export default function PillarA() {
  const { t } = useTranslation('pillars');
  const pillar = t('pillarA', { returnObjects: true });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/" className="text-muted hover:text-accent text-sm">← {t('common.back', { ns: 'common' })}</Link>
      </div>

      {/* Header */}
      <div className="mb-10">
        <div className="text-5xl mb-3">{pillar.icon}</div>
        <h1 className="text-3xl md:text-4xl font-bold text-text">{pillar.title}</h1>
        <p className="text-accent text-sm uppercase tracking-wider mt-1">{pillar.subtitle}</p>
        <p className="text-muted mt-4 text-base leading-relaxed">{pillar.description}</p>
      </div>

      {/* Sections */}
      <div className="space-y-8 mb-12">
        {pillar.sections?.map((section, i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-6">
            <h2 className="font-semibold text-text text-lg mb-4 text-accent">{section.title}</h2>
            <ul className="space-y-2">
              {section.items?.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-muted">
                  <span className="text-accent mt-0.5 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Videos — PillarA has SQUAT, PUSH, PULL, HINGE, CORE */}
      {pillar.videos?.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-text">{t('video.local_section', { ns: 'common' })}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pillar.videos.map((videoKey) => (
              <LocalVideoCard
                key={videoKey}
                src={videoKey}
                title={t(`video.${videoKey.toLowerCase()}`, { ns: 'common' })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

**Pillar B, E, F** (no videos): same template, `pillar.videos` = [] → video section không render.
**Pillar C, D** (BREATH video): same template, `pillar.videos = ['BREATH']`.

### 3. src/pages/VideoLibrary.jsx
```jsx
import { useTranslation } from 'react-i18next';
import LocalVideoCard from '../components/LocalVideoCard';
import YoutubeEmbed from '../components/YoutubeEmbed';

const LOCAL_VIDEOS = [
  { key: 'SQUAT', labelKey: 'video.squat' },
  { key: 'PUSH',  labelKey: 'video.push' },
  { key: 'PULL',  labelKey: 'video.pull' },
  { key: 'HINGE', labelKey: 'video.hinge' },
  { key: 'CORE',  labelKey: 'video.core' },
  { key: 'BREATH',labelKey: 'video.breath' },
];

// YouTube video IDs — null = placeholder (URLs chưa có)
const YOUTUBE_VIDEOS = [
  { id: null, title: 'YouTube 1' },
  { id: null, title: 'YouTube 2' },
];

export default function VideoLibrary() {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{t('video.title')}</h1>

      {/* Local videos */}
      <h2 className="text-xl font-semibold text-accent mt-10 mb-6">{t('video.local_section')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {LOCAL_VIDEOS.map(({ key, labelKey }) => (
          <LocalVideoCard
            key={key}
            src={key}
            title={t(labelKey)}
          />
        ))}
      </div>

      {/* YouTube section */}
      <h2 className="text-xl font-semibold text-accent mb-6">{t('video.youtube_section')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {YOUTUBE_VIDEOS.map((video, i) => (
          <YoutubeEmbed key={i} videoId={video.id} title={video.title} />
        ))}
      </div>
    </div>
  );
}
```

## Todo List
- [ ] Create `src/pages/Home.jsx`
- [ ] Create `src/pages/PillarA.jsx` (5 videos: SQUAT, PUSH, PULL, HINGE, CORE)
- [ ] Create `src/pages/PillarB.jsx` (no videos)
- [ ] Create `src/pages/PillarC.jsx` (BREATH video)
- [ ] Create `src/pages/PillarD.jsx` (BREATH video)
- [ ] Create `src/pages/PillarE.jsx` (no videos)
- [ ] Create `src/pages/PillarF.jsx` (no videos)
- [ ] Create `src/pages/VideoLibrary.jsx`
- [ ] Verify each pillar page shows correct sections from pillars.json
- [ ] Verify safety note shows on Home

## Success Criteria
- Home renders hero, 6 pillar cards, contact, donate sections
- Clicking PillarCard navigates to correct pillar page
- PillarA shows 5 video cards; C/D show 1; B/E/F show none
- VideoLibrary shows 6 local videos + YouTube placeholders
- Responsive grid: 1 col mobile → 2 col iPad → 3 col laptop

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| `t('pillarA', { returnObjects: true })` returns undefined | Check namespace 'pillars' in useTranslation |
| Video grid overflow on small screens | Use `grid-cols-1 md:grid-cols-2` |
| Pillar section items empty array | Guard with `section.items?.map()` optional chaining |

## Security Considerations
- All content from static JSON — no user input rendered
- No `dangerouslySetInnerHTML` usage anywhere
