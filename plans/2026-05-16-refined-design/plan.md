# Plan: Refined Design + Content Expansion
**Date:** 2026-05-16  
**Status:** IN_PROGRESS

## Overview
Redesign the Health & Lifestyle website with more refined visuals, real flag images in language switcher, and substantial content expansion from 3 source documents.

## Phases

| # | Phase | Status | Priority |
|---|-------|--------|----------|
| 01 | [Flag Images + Design Polish](./phase-01-flags-design.md) | PLANNED | HIGH |
| 02 | [Content Expansion from Documents](./phase-02-content-expansion.md) | PLANNED | HIGH |
| 03 | [New Exercise Detail Sections](./phase-03-exercise-detail.md) | PLANNED | MEDIUM |

## Source Documents
- `Documents/suc khoe va doi song.docx` — 6-pillar framework (52k chars)
- `Documents/lo_trinh_30_ngay_Nam_1m75_77kg_48tuoi.docx` — 30-day personal program (male, 48y, 1m75, 77kg)
- `Documents/các bài tập theo trụ cột A.docx` — Detailed exercise techniques for all 6 movements

## Key Design Direction
- Style: Premium dark wellness brand — think Whoop, Eight Sleep, Huel dark landing pages
- Typography: Be Vietnam Pro (current) — large headings, tight tracking, mixed weights
- Color: #22c55e accent on pure #0a0a0a black with multi-layer surface hierarchy
- Effects: Glassmorphism nav, colored glow on cards, animated gradient orbs, staggered reveals
- Flags: Real SVG images from flagcdn.com CDN (vn/gb/de) replacing emoji/text codes

## Affected Files
- `src/components/LanguageSwitcher.jsx`
- `src/i18n/vi/pillars.json`, `en/pillars.json`, `de/pillars.json`
- `src/i18n/vi/common.json`, `en/common.json`, `de/common.json`
- `src/pages/PillarA.jsx` → PillarPage content
- `src/pages/Home.jsx`
- `src/index.css`
- `tailwind.config.js`
