# CLAUDE.md — Health & Lifestyle Project

## Pillar Page Hero Pattern

All pillar detail pages (A–F) use this standard hero layout.

### Structure (top → bottom)

1. **Breadcrumb** — `to="/pillars"`, text "← 6 Trụ Cột"
2. **Hero row** — `flex items-start gap-6`, `mb-10 relative`:
   - Ambient glow blob: `absolute -top-8 -left-8 w-64 h-64 bg-{color}/5 rounded-full blur-3xl`
   - **Icon**: `w-20 h-20 rounded-3xl text-5xl bg-surface border border-{color}/20 shrink-0 animate-float`
   - **Content div**:
     - `<h1>`: `text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up`
     - **Badge**: `inline-block text-xs font-bold uppercase tracking-widest text-{color} mt-3 mb-4 px-3 py-1 bg-{color}/10 border border-{color}/20 rounded-full`
     - **Description**: `text-muted text-base leading-relaxed max-w-2xl`
3. **Wide image with orbit glow border** — `{px}-orbit-ring rounded-3xl p-[1.5px] mb-12`:
   - Inner: `relative rounded-3xl overflow-hidden h-52 md:h-72`
   - Gradient overlay: `absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent`
   - Caption badge: `bottom-4 left-6`, `text-{color} text-xs font-bold uppercase tracking-widest bg-bg/60 px-3 py-1 rounded-full border border-{color}/20`
4. **Divider**: `h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10`

### Orbit Ring CSS

Each pillar injects its own `<style>` tag via `useEffect` (id: `p{a-f}-orbit-kf`).

```
@property --p{x}-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
@keyframes p{x}OrbitSpin { to { --p{x}-orbit-angle: 360deg; } }
.p{x}-orbit-ring {
  background: conic-gradient(
    from var(--p{x}-orbit-angle),
    transparent 0deg, transparent 55deg,
    rgba(R,G,B,0.0) 65deg, rgba(R,G,B,0.75) 85deg,
    rgba(255,255,255,0.9) 92deg, rgba(R,G,B,0.75) 99deg,
    rgba(R,G,B,0.0) 115deg, transparent 125deg, transparent 360deg
  );
  animation: p{x}OrbitSpin 3.5s linear infinite;
}
```

### Pillar Color Map

| Pillar | Page | Color | RGB |
|--------|------|-------|-----|
| A | Exercise | green | `34,197,94` |
| B | Nutrition | lime | `132,204,22` |
| C | Lifestyle | teal | `20,184,166` |
| D | Mind | purple | `168,85,247` |
| E | Knowledge | blue | `59,130,246` |
| F | Tools | orange | `249,115,22` |

## Click-to-Expand Detail Modal Pattern

Used for card grids where clicking a card shows a full-screen detail overlay (e.g. MantraCards on PillarB, WHY_ITEMS on Home).

### Critical Rule — Position Fixed + RevealBlock

`RevealBlock` applies `transform: translateY(...)` which creates a CSS containing block. Any `position: fixed` descendant will be constrained to that element's bounds, not the viewport — making the modal invisible or clipped.

**Fix:** Always render the modal component **outside all `RevealBlock` wrappers**, as the last child of the outermost component `<div>`.

```jsx
// ✅ CORRECT — outside RevealBlock
function MyPage() {
  const [activeIdx, setActiveIdx] = useState(null);
  return (
    <div className="max-w-5xl mx-auto">
      <RevealBlock>
        {ITEMS.map((item, i) => (
          <Card key={i} item={item} onOpen={() => setActiveIdx(i)} />
        ))}
      </RevealBlock>

      {/* Modal here — NOT inside RevealBlock */}
      {activeIdx !== null && (
        <DetailModal
          item={ITEMS[activeIdx]}
          onClose={() => setActiveIdx(null)}
          onPrev={() => setActiveIdx(i => Math.max(0, i - 1))}
          onNext={() => setActiveIdx(i => Math.min(ITEMS.length - 1, i + 1))}
          hasPrev={activeIdx > 0}
          hasNext={activeIdx < ITEMS.length - 1}
        />
      )}
    </div>
  );
}

// ❌ WRONG — inside RevealBlock, position:fixed breaks
<RevealBlock>
  {ITEMS.map(...)}
  {activeIdx !== null && <DetailModal ... />}  {/* broken */}
</RevealBlock>
```

### Modal Component Template

```jsx
function DetailModal({ item, onClose, onPrev, onNext, hasPrev, hasNext, color = '#84cc16', rgb = '132,204,22' }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${rgb},0.28)`, boxShadow: `0 0 80px rgba(${rgb},0.15)` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          {/* Icon */}
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${rgb},0.18)`, border: `2px solid rgba(${rgb},0.45)` }}>
            {item.icon}
          </div>
          {/* Close */}
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-1" style={{ color }}>{item.title}</h2>
          <p className="font-semibold text-base mb-6" style={{ color: `rgba(${rgb},0.7)` }}>{item.subtitle}</p>

          {/* Numbered detail list */}
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-base text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${rgb},0.14)`, color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* Key points 2-col grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${rgb},0.06)`, border: `1px solid rgba(${rgb},0.15)` }}>
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Prev / Next */}
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}
            >← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.num} / {ITEMS.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}
```

### Data shape expected by the template

```js
const ITEMS = [
  {
    num: '01',           // display counter (string)
    icon: '🧬',
    title: 'Card Title',
    subtitle: 'Supporting line',
    img: 'https://images.unsplash.com/...?w=800&q=75',
    details: [           // numbered paragraphs shown in modal
      'First detail sentence...',
      'Second detail sentence...',
    ],
    points: [            // 2-col key point grid in modal
      { icon: '🔬', label: 'Short label', note: 'One line note' },
    ],
  },
];
```

### Pages using this pattern

| Page | Section | State var | Color |
|------|---------|-----------|-------|
| `Home.jsx` | WHY_ITEMS (4 cards) | `expandedWhy` | per-item |
| `PillarB.jsx` | MantraCards (7 cards) | `mantraIdx` | lime `#84cc16` |
| `Program.jsx` | DAILY_BLOCKS, DAILY_PRINCIPLES, weekly items, success tips | `activeDailyBlock`, `activeWeeklyItem`, `activeSuccessTip` | purple `#a855f7` |
| `SamplePrograms.jsx` | Phase info cards (focus/nutrition/milestone) + 7 day-cards | `activeItem` inside `ProgramDetail` | per-phase color |
| `Pillars.jsx` | All pillar section cards (A–F, 3–8 sections each) | `activeSection` | per-pillar accent |

---

### Critical Rule — animate-fade-in-up (same as RevealBlock)

`animate-fade-in-up` also uses `transform: translateY()`, creating the same CSS containing-block issue.

**Fix:** Render modal OUTSIDE the `<div className="animate-fade-in-up">` wrapper using a React Fragment.

```jsx
// ✅ CORRECT — Fragment wraps the animated div + modal side by side
function ProgramDetail({ ... }) {
  const [activeItem, setActiveItem] = useState(null);
  // useState MUST be declared BEFORE any early return
  if (!goal || !curPhase) return null;

  return (
    <>
      <div className="animate-fade-in-up">
        {/* all content, clickable cards */}
      </div>
      {activeItem && <DailyBlockModal block={activeItem} onClose={() => setActiveItem(null)} />}
    </>
  );
}
```

**Gotcha with hooks + early return:** If the component has an early `return null`, declare `useState` BEFORE the early return to avoid React hooks order violation.

---

### DailyBlockModal — Compact Variant (no prev/next)

Used when cards are independent (not a sequential list). Lighter than the full `DetailModal`.

```jsx
function DailyBlockModal({ block, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${block.rgb},0.28)`, boxShadow: `0 0 80px rgba(${block.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        {/* Hero */}
        <div className="relative h-44 rounded-t-3xl overflow-hidden">
          <img src={block.img} alt={block.name} className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${block.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${block.color}, transparent)` }} />
          <div className="absolute bottom-4 left-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${block.rgb},0.18)`, border: `2px solid rgba(${block.rgb},0.4)` }}>
              {block.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: block.color }}>{block.time || 'CHI TIẾT'}</p>
              <h2 className="font-bold text-white text-lg leading-tight max-w-xs">{block.name}</h2>
            </div>
          </div>
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        {/* Content */}
        <div className="p-5 md:p-7">
          {/* Numbered detail list */}
          <ul className="space-y-2.5 mb-5">
            {block.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${block.rgb},0.14)`, color: block.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          {/* Quick links */}
          <div className="mb-5 pb-5" style={{ borderBottom: `1px solid rgba(${block.rgb},0.12)` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: `rgba(${block.rgb},0.5)` }}>Khám Phá Chi Tiết</p>
            <div className="flex flex-wrap gap-2">
              {block.links.map((lk, li) => (
                <Link key={li} to={lk.to} onClick={onClose}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-150 hover:opacity-90 hover:scale-105"
                  style={{ color: block.color, background: `rgba(${block.rgb},0.1)`, border: `1px solid rgba(${block.rgb},0.22)` }}>
                  <span>{lk.icon}</span> {lk.label} →
                </Link>
              ))}
            </div>
          </div>
          {/* Key points 2-col grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {block.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-2.5 rounded-xl p-3.5"
                style={{ background: `rgba(${block.rgb},0.06)`, border: `1px solid rgba(${block.rgb},0.14)` }}>
                <span className="text-xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}
```

### Block data shape for DailyBlockModal

```js
const block = {
  icon: '🏋️',
  name: 'Card Title',          // modal heading
  time: 'THỨ 2',              // small label above heading (day, intensity, category, etc.)
  color: '#22c55e',            // hex accent color
  rgb: '34,197,94',            // rgb string for rgba()
  img: 'https://images.unsplash.com/...?w=800&q=80',
  details: [                   // numbered list (3–5 sentences)
    'First sentence...',
    'Second sentence...',
    'Third sentence...',
  ],
  points: [                    // 2-col key highlights (4 items)
    { icon: '🔄', label: 'Short label', note: 'One-line explanation' },
    { icon: '✅', label: 'Short label', note: 'One-line explanation' },
    { icon: '⏱️', label: 'Short label', note: 'One-line explanation' },
    { icon: '🎯', label: 'Short label', note: 'One-line explanation' },
  ],
  links: [                     // quick navigation links (1–3)
    { icon: '🏋️', label: 'Link label', to: '/pillar/a' },
  ],
};
```

---

### SectionModal — For i18n-Driven Section Grids

Used when section data comes from i18n JSON (no hardcoded `details`/`points`). Auto-generates key points from item text via `makePoints()`.

```jsx
/* ── Helper: auto-derive 4 key points from section items ── */
function makePoints(items) {
  const icons = ['📌', '✅', '🎯', '💡'];
  return (items || []).slice(0, 4).map((item, i) => {
    const match = item.match(/^(.+?)\s*[—–]\s*(.+)$/);
    if (match) return { icon: icons[i], label: match[1].trim(), note: match[2].trim() };
    const words = item.split(' ');
    const cut = Math.min(Math.ceil(words.length / 2), 5);
    return { icon: icons[i], label: words.slice(0, cut).join(' '), note: words.slice(cut).join(' ') || '—' };
  });
}

function SectionModal({ section, meta, pillarTitle, pillarIcon, onClose }) {
  useEffect(() => { /* same ESC + overflow pattern */ }, [onClose]);
  const points = makePoints(section.items);

  return (
    // same DailyBlockModal structure but:
    // - icon = pillarIcon, name = section.title, time = pillarTitle
    // - details = section.items (ALL items, not just 4)
    // - points = makePoints(section.items)
    // - links = [{ icon: pillarIcon, label: pillarTitle, to: /pillar/${meta.id} }]
  );
}
```

**Usage in Pillars.jsx:**
```jsx
// 1. Add rgb to PILLAR_META entries
const PILLAR_META = [
  { ..., accent: '#22c55e', rgb: '34,197,94' },   // A
  { ..., accent: '#84cc16', rgb: '132,204,22' },  // B
  { ..., accent: '#14b8a6', rgb: '20,184,166' },  // C
  { ..., accent: '#a855f7', rgb: '168,85,247' },  // D
  { ..., accent: '#3b82f6', rgb: '59,130,246' },  // E
  { ..., accent: '#f97316', rgb: '249,115,22' },  // F
];

// 2. State + click on card
const [activeSection, setActiveSection] = useState(null);
// on card: onClick={() => setActiveSection({ section, idx: i })}

// 3. Modal OUTSIDE animate-fade-in-up
<div key={activeTab} className="animate-fade-in-up">
  {/* section cards */}
</div>
{activeSection && (
  <SectionModal
    section={activeSection.section}
    meta={m}
    pillarTitle={p?.title || ''}
    pillarIcon={p?.icon || ''}
    onClose={() => setActiveSection(null)}
  />
)}
```

**Hover hint on cards:**
```jsx
<div className="... cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
  onClick={() => setActiveSection({ section, idx: i })}>
  {/* existing card content */}
  <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
    <span className="text-[10px] text-muted/50 uppercase tracking-wider">{section.items?.length || 0} mục</span>
    <span className={`text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${m.textColor}`}>
      Xem chi tiết →
    </span>
  </div>
</div>
```

---

### programData.js — Enriching WEEKLY_SCHEDULE for Modals

When day-cards need click-to-expand, add these fields to each entry in `WEEKLY_SCHEDULE`:

```js
// D object must include hex + rgb (not just Tailwind classes)
const D = {
  green:  { bg:'bg-green-500/10 border-green-500/25 text-green-400', dot:'bg-green-400', hex:'#22c55e', rgb:'34,197,94'   },
  teal:   { bg:'bg-teal-500/10 ...',  dot:'bg-teal-400',   hex:'#14b8a6', rgb:'20,184,166'  },
  blue:   { bg:'bg-blue-500/10 ...',  dot:'bg-blue-400',   hex:'#3b82f6', rgb:'59,130,246'  },
  purple: { bg:'bg-purple-500/10 ...', dot:'bg-purple-400', hex:'#a855f7', rgb:'168,85,247' },
  orange: { bg:'bg-orange-500/10 ...', dot:'bg-orange-400', hex:'#f97316', rgb:'249,115,22' },
  yellow: { bg:'bg-yellow-500/10 ...', dot:'bg-yellow-400', hex:'#eab308', rgb:'234,179,8'  },
  red:    { bg:'bg-red-500/10 ...',   dot:'bg-red-400',    hex:'#ef4444', rgb:'239,68,68'   },
  gray:   { bg:'bg-surface ...',      dot:'bg-muted/40',   hex:'#6b7280', rgb:'107,114,128' },
};

// Each WEEKLY_SCHEDULE entry enriched shape:
{
  day: 'T2', type: 'Strength A', icon: '🏋️', c: D.green,
  detail: 'Short summary shown in card',       // existing compact text
  img: 'https://images.unsplash.com/...?w=800&q=80',  // NEW
  details: [                                           // NEW — 3 sentences
    'Sentence 1 explaining the full workout...',
    'Sentence 2 with technique tips...',
    'Sentence 3 with progression notes...',
  ],
  points: [                                            // NEW — 4 key points
    { icon: '🔄', label: '2–3 hiệp × 8–12 reps', note: 'Nghỉ 60s giữa các hiệp' },
    { icon: '✅', label: 'Form trước thể lực',    note: '6 reps đúng > 12 reps sai' },
    { icon: '⏱️', label: '20–25 phút',           note: 'Không kể khởi động 5 phút' },
    { icon: '🎯', label: 'RPE 5–6/10',           note: 'Còn nói chuyện thoải mái' },
  ],
  links: [{ icon: '🏋️', label: '6 Mẫu Vận Động', to: '/pillar/a/movements' }],  // NEW
}
```

**Wiring up in the component:**
```jsx
// PHASE_COLORS_HEX parallel to PHASE_COLORS
const PHASE_COLORS_HEX = [
  { hex: '#22c55e', rgb: '34,197,94'  },
  { hex: '#84cc16', rgb: '132,204,22' },
  { hex: '#14b8a6', rgb: '20,184,166' },
  { hex: '#3b82f6', rgb: '59,130,246' },
  { hex: '#a855f7', rgb: '168,85,247' },
  { hex: '#ec4899', rgb: '236,72,153' },
];
const phHex = PHASE_COLORS_HEX[phIdx] || PHASE_COLORS_HEX[0];

// Day-card click handler
onClick={() => s.details && setActiveItem({
  icon: s.icon, name: s.type, time: s.day,
  color: s.c.hex, rgb: s.c.rgb,
  img: s.img || SCHEDULE_IMAGES[s.icon] || 'fallback-url',
  details: s.details,
  points: s.points,
  links: s.links,
})}

// Phase info card click handler (built dynamically from curPhase)
onClick={() => setActiveItem({
  icon: curPhase.icon, name: `${curPhase.name} — Tập Trọng Tâm`, time: curPhase.intensity,
  color: phHex.hex, rgb: phHex.rgb,
  img: curPhase.image || 'fallback-url',
  details: [curPhase.focus, curPhase.desc, `Giai đoạn ${curPhase.tag}: tuần ${curPhase.range[0]}–${curPhase.range[1]}`],
  points: [
    { icon: '🎯', label: 'Mức độ',    note: curPhase.intensity },
    { icon: '📅', label: 'Giai đoạn', note: `Tuần ${curPhase.range[0]}–${curPhase.range[1]}` },
    { icon: '🏷️', label: 'Phân loại', note: curPhase.tag },
    { icon: '📈', label: 'Tiến bộ',   note: 'Tăng nhẹ mỗi tuần, lắng nghe cơ thể' },
  ],
  links: [{ icon: '🏋️', label: 'Vận Động & Tập Luyện', to: '/pillar/a' }],
})}
```

---

## ThoughtBubble Tooltip Pattern

Reusable animated cloud tooltip for hover-state stat/metric explanations.

### Component

`src/components/ThoughtBubble.jsx` — accepts `text`, `idx` (unique string/number), `color` (hex, default `#84cc16`).

- Cloud shape auto-scales to text via hidden measurement div (`position: fixed; left: -9999px`)
- SVG parametric bezier cloud: 4 bumps on top, 3 on bottom, adapts to any W×H
- Animated spark: `stroke-dasharray` + `stroke-dashoffset` keyframe on the cloud path
- Text color: per-pillar light tint (`LIGHT_TEXT` map in component)

### Usage pattern

```jsx
import ThoughtBubble from '../components/ThoughtBubble';

// Wrap the stat element in a named group:
<div className="group/stat relative">
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none
    opacity-0 group-hover/stat:opacity-100
    scale-90 group-hover/stat:scale-100
    -translate-y-1 group-hover/stat:translate-y-0
    transition-all duration-200 origin-bottom">
    <ThoughtBubble text="Tooltip text here" idx="unique-id" color="#22c55e" />
  </div>
  {/* stat content */}
</div>
```

### Pages using it

| Page | Elements | Color |
|------|----------|-------|
| Home.jsx | Hero stats row (3 items) | `#22c55e` green |
| PillarA.jsx | Tab stats overlay (4 tabs × 3 stats) | per-tab color |
| PillarB.jsx | Stats row (4 items) | `#84cc16` lime |
| PillarE.jsx | Health metrics cards (5 items) | `#3b82f6` blue |
| Program.jsx | Hero badge stats (4 items) | `#a855f7` purple |

### Rules
- `idx` must be unique per page to avoid SVG filter ID collisions
- Tooltip text is hardcoded in each page as a constant (not i18n) — keep in Vietnamese
- Do NOT add `overflow-hidden` to any ancestor of a tooltip container

## Tech Stack

- Vite 5 + React 18 + Tailwind CSS v3 (dark theme `#0a0a0a`)
- HashRouter — custom domain `healthandlifestyle.io.vn`, `base: '/'`
- react-i18next — VI (primary) / EN / DE translations in `src/i18n/{vi,en,de}/`
- PWA via vite-plugin-pwa

## Translation Files

- `src/i18n/{vi,en,de}/common.json` — shared UI strings
- `src/i18n/{vi,en,de}/pillars.json` — pillar page content

All user-visible strings must have keys in all 3 languages.

---

## Pillar B (Nutrition) — Architecture Reference

This is the most complex pillar. Use it as the template for building other rich pillar pages.

### Page Structure

```
PillarB.jsx          — main hub (8 tabs B0–B7) + sub-page teaser grid
  ├── B0: TDEE Calculator    (personalization input — writes to localStorage)
  ├── B1: Nền Tảng           (7 principles, macro table, interactive selectors)
  ├── B2: Đĩa Ăn             (plate model, portion guide, meal timing)
  ├── B3: Mục Tiêu           (3 goal tracks with full meal plans)
  ├── B4: Thực Đơn           (meal rules, frequency, example meals)
  ├── B5: Theo Dõi           (checklist preview → link to NutritionChecklistPage)
  ├── B6: 7 Ngày             (preview → link to NutritionSevenDayPage)
  └── B7: Nâng Cao           (preview → link to NutritionAdvancedPlanPage)
```

Sub-pages (15 total, all under `/pillar/b/*`):

| Route | File | Orbit ID | Color |
|-------|------|----------|-------|
| `/roadmap` | NutritionRoadmapPage.jsx | `rm-orbit-kf` | lime `#84cc16` |
| `/content` | NutritionContentPage.jsx | `nc-orbit-kf` | lime |
| `/data` | NutritionDataPage.jsx | `nd-orbit-kf` | lime |
| `/formula` | NutritionFormulaPage.jsx | `nf-orbit-kf` | lime |
| `/protein` | NutritionProteinPage.jsx | `np-orbit-kf` | lime |
| `/meals` | NutritionMealRulesPage.jsx | `mr-orbit-kf` | lime |
| `/7day` | NutritionSevenDayPage.jsx | `s7d-orbit-kf` | lime |
| `/goal-plan` | NutritionGoalPlanPage.jsx | `gp-orbit-kf` | lime |
| `/advanced-plan` | NutritionAdvancedPlanPage.jsx | `ap-orbit-kf` | lime |
| `/12week` | NutritionTwelveWeekPage.jsx | `12w-orbit-kf` | lime |
| `/24week` | NutritionTwentyFourWeekPage.jsx | `24w-orbit-kf` | lime |
| `/checklist` | NutritionChecklistPage.jsx | `cl-orbit-kf` | lime |
| `/template` | NutritionTemplatePage.jsx | `nt-orbit-kf` | lime |
| `/mealprep` | NutritionMealPrepPage.jsx | `mp-orbit-kf` | indigo `#6366f1` |
| `/safety` | NutritionSafetyPage.jsx | `sf-orbit-kf` | sky `#0ea5e9` |

### B0 localStorage Schema (Canonical)

Key: `healthapp_b0_inputs`

```js
{
  weight:      number,   // kg, e.g. 70
  height:      number,   // cm, e.g. 170
  age:         number,   // years, e.g. 30
  sex:         string,   // 'male' | 'female'
  activityKey: string,   // 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goalKey:     string,   // 'loss' | 'recomp' | 'gain'
}
```

Written by: `PillarB.jsx` B0 tab (useEffect on every input change).
Read by: all 15 sub-pages to personalize their content.

### TDEE Formula (Mifflin-St Jeor)

```js
// Canonical constants — use these exact values everywhere
const ACTIVITY_LEVELS = [
  { key: 'sedentary',  mult: 1.2   },
  { key: 'light',      mult: 1.375 },
  { key: 'moderate',   mult: 1.55  },
  { key: 'active',     mult: 1.725 },
  { key: 'very_active',mult: 1.9   },  // ← underscore, NOT 'veryactive'
];

const GOAL_DELTAS = {
  loss:   -400,  // kcal deficit
  recomp:    0,
  gain:   +300,  // kcal surplus  ← NOT +250
};

// BMR (Mifflin-St Jeor)
const bmr = sex === 'female'
  ? 10 * weight + 6.25 * height - 5 * age - 161
  : 10 * weight + 6.25 * height - 5 * age + 5;

const tdee = Math.round(bmr * activityMult);
const targetKcal = tdee + GOAL_DELTAS[goalKey];
const proteinG = Math.round(weight * (goalKey === 'loss' || goalKey === 'gain' ? 2.0 : 1.6));
const fatG = Math.round(targetKcal * 0.25 / 9);
const carbG = Math.round((targetKcal - proteinG * 4 - fatG * 9) / 4);
const waterMl = Math.round(weight * 35);
```

**Critical rule:** Every sub-page that reads B0 from localStorage MUST use `inp.weight/height/age/sex/activityKey/goalKey` — never `inp.w/h/a/sx/goal` (legacy names, now fixed).

### Sub-page Template

Every Nutrition sub-page follows this exact structure:

```
1. Orbit-ring CSS injected via useEffect (unique id + CSS class per page)
2. RevealBlock (IntersectionObserver scroll-fade-up, threshold 0.07–0.08)
3. Container: px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24
4. Breadcrumb: ← Nutrition & Meal Plans (to="/pillar/b")
5. Hero:
   a. Ambient glow blob (absolute, blur-3xl)
   b. Icon (w-20 h-20 rounded-3xl, float animation)
   c. Title h1 + badge + description
6. Wide hero image (orbit-ring border, h-52 md:h-72, gradient overlay + caption)
7. Divider (h-px gradient)
8. [Optional] PersonalizedBanner — reads from localStorage B0
9. Content sections wrapped in RevealBlock
10. Breadcrumb footer (← back link)
```

### Key Components in PillarB.jsx

#### `RevealBlock`
```jsx
function RevealBlock({ children, delay = 0, className = '' }) { ... }
// Uses IntersectionObserver, threshold 0.07
// opacity + translateY(26px) → visible on scroll
```

#### `PersonalizedBar`
```jsx
<PersonalizedBar
  panelId="b1"          // unique prefix for tooltip idx
  color="#84cc16"
  source="B0 (TDEE Calculator)"
  selectedKey={selectedMetric}
  onSelect={setSelectedMetric}
  items={[
    { label: 'TDEE', value: `${s.tdee} kcal`, note: 'Tổng năng lượng/ngày', key: 'tdee', tip: '...' },
    // tip → ThoughtBubble on hover; key+onSelect → clickable to expand MetricDetailCard
  ]}
/>
```
Positioned below the B0 PersonalizedBar tooltip (direction: `top-full`, NOT `bottom-full`) to avoid tab bar overlap.

#### `TeaserCard` (sub-page link cards on main PillarB page)
```jsx
<TeaserCard
  to="/pillar/b/roadmap"
  color="#84cc16" rgb="132,204,22"
  icon="🗺️"
  category="Nền Tảng"
  title="Lộ Trình Dinh Dưỡng"
  accent="12 tuần · Có lộ trình rõ ràng"
  desc="Mô tả ngắn 1–2 câu..."
  features={['bullet 1', 'bullet 2', 'bullet 3']}
  stats={[{ v: '12', l: 'Tuần' }, { v: '3', l: 'Giai đoạn' }]}
  image="https://images.unsplash.com/photo-...?w=800&q=80"
  imageAlt="alt text"
  cta="Xem lộ trình →"
/>
```
Layout: content 60% left / image 42% right (desktop). Image opacity 0.30 with gradient fade. Mobile: image banner on top.
Grouped by `TeaserSection` dividers (4 groups: Nền Tảng & Cấu Trúc / Kế Hoạch Thực Đơn / Công Cụ Hằng Ngày / Lộ Trình Dài Hạn).

#### `MetricDetailCard`
Expandable detail panel triggered by clicking a PersonalizedBar item.
Props: `{ detail: { title, value, note, params[], analysis, evaluation, suggestions[], pros[], cons[] }, color, onClose }`.

### Data Pattern

All repeatable content is defined as top-level constant arrays of objects before the component, never inline in JSX:

```js
const SECTION_DATA = [
  { id: 'unique-key', label: '...', color: '#...', icon: '...', content: '...', tips: [...] },
  // ...
];
// Then in JSX: {SECTION_DATA.map(item => <Card key={item.id} {...item} />)}
```

This pattern applies to: principles, macros, goals, meal plans, checklists, tab content, timeline steps, etc.

### Tab Frame Animations

Each tab has a `frameClass` (e.g. `pb-frame-0`) for an animated CSS frame injected in the orbit CSS block. Used as a border animation on the tab's content panel. Defined in the `TABS` array and the injected `<style>` block.

### Content Sections Pattern

Rich content sections use a consistent layout:

```jsx
<RevealBlock className="mb-10 md:mb-14">
  <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: PILLAR_COLOR }}>
    Section Title
  </h2>
  <p className="text-muted text-sm mb-6">Supporting text</p>
  {/* content */}
</RevealBlock>
```

Section cards: `rounded-2xl border border-border bg-surface p-5` with hover glow `hover:border-{color}/30`.

### Image Sources

All images use Unsplash with parameters `?w=800&q=80&auto=format&fit=crop` (hero images) or `?w=600&q=70` (smaller cards). Never rely on local image files for content pages — use Unsplash URLs.

### Sub-page Personalization Banner Pattern

For sub-pages that show B0-derived stats:

```jsx
const B0_KEY = 'healthapp_b0_inputs';
// In component:
const [b0] = useState(() => { try { return JSON.parse(localStorage.getItem(B0_KEY)) || {}; } catch { return {}; } });
const stats = b0.weight ? computeStats(b0) : null;

// In JSX (only render if stats exists):
{stats && (
  <RevealBlock className="mb-10">
    <div className="rounded-2xl border p-4 md:p-5" style={{ borderColor: `${COLOR}22`, background: `${COLOR}07` }}>
      <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>
        ✦ Cá Nhân Hóa Cho Bạn (B0)
      </div>
      <p className="text-xs text-muted">
        {b0.weight}kg · {b0.height}cm · {b0.age} tuổi →
        <strong style={{ color: COLOR }}> {stats.targetKcal} kcal/ngày</strong>
      </p>
    </div>
  </RevealBlock>
)}
```

### Template for Other Pillars (C–F)

When building sub-pages for other pillars (C, D, E, F), follow the same pattern:
1. **One main pillar page** with tab navigation (use `TABS` array pattern from PillarB)
2. **Sub-pages** for deep content (route `/pillar/{x}/{slug}`)
3. **Teaser grid** on main page linking to all sub-pages (use `TeaserCard` + `TeaserSection`)
4. **No i18n** on sub-pages — Vietnamese only, hardcoded strings
5. **Unique orbit ring ID** per page (see table above for used IDs, do not reuse)
6. **RevealBlock** on every major content section
7. **Personalization** via shared localStorage key if the pillar has a calculator
