# Phase 01: Flag Images + Design Polish

## Overview
- **Date:** 2026-05-16
- **Priority:** HIGH
- **Status:** PLANNED

## Requirements
1. Replace emoji/text codes in LanguageSwitcher with real flag images (flagcdn.com PNG)
2. Show flag on mobile (currently shows "VI/EN/DE" text codes — unacceptable)
3. Refine overall design: better surface hierarchy, more animated micro-interactions

## Flag Image Sources
- Vietnam: `https://flagcdn.com/w40/vn.png`
- UK/English: `https://flagcdn.com/w40/gb.png`
- Germany: `https://flagcdn.com/w40/de.png`
- Render as `<img>` 20x15px with `rounded-sm object-cover`

## Design Polish Items
- Hero: Gradient subtitle text (green shimmer)
- Cards: Subtle inner gradient on surface, not just flat bg
- Navbar: Current glass works well — add logo glow on brand color
- PillarCard: Better icon display with pillar-colored ring
- Footer: Add green line under logo
- CTA buttons: Improved with icon + spacing
- Section dividers: Gradient lines with glow

## Implementation Steps
1. Update LanguageSwitcher — `<img>` tags for flags, show flag on mobile too
2. Fix shimmer text in hero (subtitle)
3. Improve PillarCard icon ring
4. Refine button micro-interactions

## Success Criteria
- Flags visible in both desktop dropdown and mobile button
- No layout shift when flag images load (fixed dimensions)
- Design feels premium, not flat
