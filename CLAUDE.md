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
