# Phase 04 — Feature Components
**Parent**: [plan.md](plan.md) | **Depends on**: Phase 01, 02, 03 | **Status**: ⬜ Pending | **Priority**: HIGH

## Overview
Build reusable components: video players, pillar cards, contact section, donate section.

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/LocalVideoCard.jsx` | HTML5 video player cho 6 MP4 clips |
| `src/components/YoutubeEmbed.jsx` | YouTube iframe lazy loader |
| `src/components/PillarCard.jsx` | Card cho mỗi trụ cột → link to pillar page |
| `src/components/ContactSection.jsx` | Email + Zalo contact |
| `src/components/DonateSection.jsx` | Donate placeholder |

## Implementation Steps

### 1. src/components/LocalVideoCard.jsx
```jsx
export default function LocalVideoCard({ src, title, description }) {
  const basePath = import.meta.env.BASE_URL; // '/HEALTH-LIFESTYLE-PROJECT/'
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <video
        className="w-full aspect-video object-cover"
        autoPlay
        loop
        muted
        playsInline
        controls
        preload="metadata"
        src={`${basePath}videos/${src}.mp4`}
        aria-label={title}
      />
      <div className="p-4">
        <h3 className="font-semibold text-text">{title}</h3>
        {description && <p className="text-sm text-muted mt-1">{description}</p>}
      </div>
    </div>
  );
}
```

**Key points**:
- `import.meta.env.BASE_URL` = `/HEALTH-LIFESTYLE-PROJECT/` in prod, `/` in dev
- `muted` + `playsInline` bắt buộc cho autoplay trên iOS Safari
- `controls` cho user manual play/pause
- `preload="metadata"` — load thumbnail only, not full video

### 2. src/components/YoutubeEmbed.jsx
```jsx
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function YoutubeEmbed({ videoId, title }) {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!videoId) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setLoaded(true); },
      { rootMargin: '200px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [videoId]);

  // Placeholder when no video URL yet
  if (!videoId) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center text-muted aspect-video flex items-center justify-center">
        <div>
          <div className="text-4xl mb-3">▶️</div>
          <p>{t('video.youtube_placeholder')}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="bg-surface border border-border rounded-xl overflow-hidden aspect-video">
      {loaded ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-surface">
          <div className="text-4xl">⏳</div>
        </div>
      )}
    </div>
  );
}
```

**Key points**:
- IntersectionObserver với `rootMargin: '200px'` — preload trước khi visible
- `videoId = null` → show placeholder text (YouTube URLs chưa có)
- `rel=0` — không show suggested videos của YouTube khi kết thúc

### 3. src/components/PillarCard.jsx
```jsx
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const COLOR_MAP = {
  green:  'border-green-500/30 hover:border-green-500',
  lime:   'border-lime-500/30 hover:border-lime-500',
  teal:   'border-teal-500/30 hover:border-teal-500',
  purple: 'border-purple-500/30 hover:border-purple-500',
  blue:   'border-blue-500/30 hover:border-blue-500',
  orange: 'border-orange-500/30 hover:border-orange-500',
};

export default function PillarCard({ pillarKey }) {
  const { t } = useTranslation('pillars');
  const pillar = t(pillarKey, { returnObjects: true });

  return (
    <Link
      to={`/pillar/${pillar.id.toLowerCase()}`}
      className={`block bg-surface border ${COLOR_MAP[pillar.color] || 'border-border hover:border-accent'} 
        rounded-xl p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg`}
    >
      <div className="text-4xl mb-3">{pillar.icon}</div>
      <h3 className="text-lg font-semibold text-text">{pillar.title}</h3>
      <p className="text-xs text-muted mt-0.5 uppercase tracking-wider">{pillar.subtitle}</p>
      <p className="text-sm text-muted mt-3 leading-relaxed">{pillar.description}</p>
    </Link>
  );
}
```

### 4. src/components/ContactSection.jsx
```jsx
import { useTranslation } from 'react-i18next';

export default function ContactSection() {
  const { t } = useTranslation();
  return (
    <section id="contact" className="py-16 border-t border-border">
      <h2 className="text-2xl font-bold text-text mb-8 text-center">{t('contact.title')}</h2>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a
          href={`mailto:${t('contact.email')}`}
          className="flex items-center gap-3 bg-surface border border-border hover:border-accent 
            rounded-xl px-6 py-4 transition-colors group"
        >
          <span className="text-2xl">✉️</span>
          <div>
            <p className="text-xs text-muted">{t('contact.email_label')}</p>
            <p className="text-sm font-medium text-text group-hover:text-accent transition-colors">
              {t('contact.email')}
            </p>
          </div>
        </a>
        <a
          href={`https://zalo.me/${t('contact.zalo')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-surface border border-border hover:border-accent 
            rounded-xl px-6 py-4 transition-colors group"
        >
          <span className="text-2xl">💬</span>
          <div>
            <p className="text-xs text-muted">{t('contact.zalo_label')}</p>
            <p className="text-sm font-medium text-text group-hover:text-accent transition-colors">
              {t('contact.zalo')}
            </p>
          </div>
        </a>
      </div>
    </section>
  );
}
```

### 5. src/components/DonateSection.jsx
```jsx
import { useTranslation } from 'react-i18next';

export default function DonateSection() {
  const { t } = useTranslation();
  return (
    <section id="donate" className="py-16 border-t border-border">
      <div className="max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold text-text mb-3">{t('donate.title')}</h2>
        <p className="text-muted text-sm mb-6">{t('donate.subtitle')}</p>
        {/* Placeholder — bank QR và số TK sẽ thêm sau */}
        <div className="bg-surface border border-border rounded-xl p-8">
          <div className="text-5xl mb-4">🙏</div>
          <p className="text-muted text-sm">{t('donate.placeholder')}</p>
          <p className="text-accent text-sm mt-3 font-medium">{t('donate.thanks')}</p>
        </div>
      </div>
    </section>
  );
}
```

## Todo List
- [ ] Create `src/components/LocalVideoCard.jsx`
- [ ] Create `src/components/YoutubeEmbed.jsx`
- [ ] Create `src/components/PillarCard.jsx`
- [ ] Create `src/components/ContactSection.jsx`
- [ ] Create `src/components/DonateSection.jsx`

## Success Criteria
- LocalVideoCard: video plays muted/autoloop on mobile Safari
- YoutubeEmbed: shows placeholder when `videoId=null`; loads iframe on scroll-into-view
- PillarCard: hover animation works; color matches pillar color
- ContactSection: email link opens mail client; Zalo link goes to `zalo.me`
- DonateSection: shows placeholder text cleanly

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| `import.meta.env.BASE_URL` undefined in test | Always test with `npm run build && npm run preview` |
| IntersectionObserver not supported (old browsers) | `if (!videoId) return` guard; observer disconnect on cleanup |
| `t(pillarKey, { returnObjects: true })` returns string | Ensure pillars.json has object at pillarKey, not string |

## Security Considerations
- Zalo deep link: `rel="noopener noreferrer"` on all `target="_blank"` links
- YouTube embed: no user-controlled URL injection — videoId comes from static data only
