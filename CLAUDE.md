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
