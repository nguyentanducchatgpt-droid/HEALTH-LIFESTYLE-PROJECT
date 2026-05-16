# Brainstorm Report: Health & Lifestyle Project — Multilingual, Multi-platform, GitHub Pages
**Date**: 2026-05-16  
**Status**: Agreed ✅

---

## Problem Statement

Xây dựng website "Sức Khỏe và Đời Sống" — nền tảng nội dung sức khỏe thuần tĩnh (phase MCP), deploy lên GitHub Pages, hỗ trợ:
- 3 ngôn ngữ: Tiếng Việt (primary) · English · Deutsch
- Đa nền tảng: Mobile / iPad / Laptop
- Video: 6 clip demo ngắn (4–8s, ~14MB tổng) + YouTube embeds
- Tính năng: Đếm lượt truy cập · Liên hệ · Donate

---

## Context từ tài liệu

### 6 Trụ cột nội dung (từ `Documents/suc khoe va doi song.docx`)
| Trụ cột | Nội dung |
|---|---|
| A — Vận động & Tập luyện | Warm-up, squat/hinge/push/pull/core, lộ trình theo mục tiêu |
| B — Dinh dưỡng | TDEE, macro, thực đơn mẫu, meal prep |
| C — Lối sống | Giấc ngủ, NEAT, nhịp sinh học |
| D — Tâm trí | Thiền, breathing, journaling, tư duy |
| E — Kiến thức phổ thông | BMI, huyết áp, dấu hiệu cần khám |
| F — Công cụ | Checklist, template nhật ký, bộ test tiến bộ |

### Video assets hiện có (`Documents/Video/`)
| File | Kích thước |
|---|---|
| SQUAT.mp4 | 2.77 MB |
| PUSH.mp4 | 2.91 MB |
| PULL.mp4 | 3.16 MB |
| HINGE.mp4 | 2.36 MB |
| CORE.mp4 | 2.19 MB |
| BREATH.mp4 | 0.98 MB |
| **Tổng** | **~14 MB** |

→ Đủ nhỏ để commit thẳng vào repo, không cần LFS hay external storage.

### Infrastructure blueprint: `claude_ver17_github_pages.md` (v3.3)
Đã có sẵn: Vite config + GitHub Actions workflow + SPA 404.html trick + CORS setup.

---

## Phương án đã đánh giá

| Phương án | Stack | Kết luận |
|---|---|---|
| 1 — Vanilla JS + i18next | Vite + plain JS + i18next | Loại bỏ: scale kém với 6 pillars × 3 ngôn ngữ |
| **2 — React + react-i18next** | Vite + React 18 + Tailwind | **CHỌN: cân bằng tốt nhất** |
| 3 — Astro SSG | Astro + React islands | Loại bỏ: overkill cho phase MCP |

---

## Kiến trúc đã thống nhất

### Tech Stack
```
Frontend:   Vite 5 + React 18
i18n:       react-i18next (VI / EN / DE)
Styling:    Tailwind CSS v3
Routing:    React Router v6 (hash-based — GitHub Pages compatible)
Analytics:  Google Analytics 4 (visit tracking)
Deploy:     GitHub Pages via GitHub Actions (blueprint từ claude_ver17 v3.3)
```

### Tính năng Phase MCP
1. Landing/Hero — giới thiệu dự án
2. 6 trang trụ cột (A–F) — nội dung theo document
3. Video Library — 6 clip MP4 local + YouTube embed
4. Language Switcher — VI / EN / DE (top nav)
5. Contact Section — email: `nguyentanducchatgpt@gmail.com` · Zalo: `0913723667`
6. Donate Section — QR code ngân hàng (số tài khoản gửi sau)
7. Visit counter — GA4 (admin xem dashboard, không hiển thị public)

### Cấu trúc thư mục
```
suc-khoe-doi-song/
├── .github/workflows/
│   └── deploy-frontend.yml         # Từ claude_ver17 v3.3
├── src/
│   ├── i18n/
│   │   ├── vi/
│   │   │   ├── common.json         # Nav, footer, contact, donate
│   │   │   └── pillars.json        # Nội dung 6 trụ cột
│   │   ├── en/
│   │   │   ├── common.json
│   │   │   └── pillars.json
│   │   └── de/
│   │       ├── common.json         # Machine translation
│   │       └── pillars.json        # Machine translation
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── PillarA.jsx             # Vận động & Tập luyện
│   │   ├── PillarB.jsx             # Dinh dưỡng
│   │   ├── PillarC.jsx             # Lối sống
│   │   ├── PillarD.jsx             # Tâm trí
│   │   ├── PillarE.jsx             # Kiến thức
│   │   ├── PillarF.jsx             # Công cụ
│   │   └── VideoLibrary.jsx
│   ├── components/
│   │   ├── LanguageSwitcher.jsx
│   │   ├── LocalVideoCard.jsx      # HTML5 <video> cho 6 clip MP4
│   │   ├── YoutubeEmbed.jsx        # YouTube iframe embed
│   │   ├── ContactSection.jsx
│   │   └── DonateSection.jsx       # QR code + bank info
│   ├── App.jsx
│   └── main.jsx
├── public/
│   ├── videos/                     # 6 clip MP4 (~14MB tổng)
│   │   ├── SQUAT.mp4
│   │   ├── PUSH.mp4
│   │   ├── PULL.mp4
│   │   ├── HINGE.mp4
│   │   ├── CORE.mp4
│   │   └── BREATH.mp4
│   ├── 404.html                    # SPA redirect trick
│   └── .nojekyll
├── vite.config.js                  # Từ claude_ver17 v3.3
└── package.json
```

---

## Video Strategy (đã xác nhận)

### Local clips (6 file, ~14MB tổng)
- **Quyết định**: Commit thẳng vào `public/videos/` — không cần LFS, không cần external storage
- **Render**: HTML5 `<video autoplay loop muted playsInline>` — autoplay vì clip ngắn (4–8s), muted bắt buộc để autoplay hoạt động trên mobile
- **Map clip → trụ cột**: SQUAT/PUSH/PULL/HINGE → Trụ cột A; CORE → A+D; BREATH → D+C

### YouTube videos (public embed)
- **Render**: `<iframe>` embed với YouTube Player API hoặc react-youtube package
- **Lazy load**: dùng `loading="lazy"` + IntersectionObserver để tránh load hết iframe cùng lúc

---

## i18n Strategy

```
Priority: VI (primary, viết tay) → EN (machine translate) → DE (machine translate)
Tool: DeepL API hoặc Google Translate (dùng 1 lần để generate JSON)
Namespace: common (UI strings) + pillars (content dài)
Language detection: localStorage → browser Accept-Language → default VI
URL strategy: ?lang=de hoặc localStorage (không path-based, tránh phức tạp với hash router)
```

**Workflow dịch**:
1. Viết hoàn chỉnh `vi/*.json`
2. Chạy DeepL/GPT để generate `en/*.json` và `de/*.json`
3. Review EN (dễ hơn DE), DE để machine translation
4. Cập nhật khi có nội dung mới

---

## Responsive Breakpoints (Tailwind)

| Breakpoint | Device | Layout |
|---|---|---|
| `< 768px` | Mobile | 1 cột, bottom nav hoặc hamburger menu |
| `768px – 1024px` | iPad | 2 cột, collapsible sidebar |
| `> 1024px` | Laptop | 3 cột, full sidebar |

---

## Analytics & Contact

### Visit Counter
- **Công cụ**: Google Analytics 4 (free, không giới hạn)
- **Cài đặt**: Thêm GA4 script vào `index.html` — 1 dòng
- **Không hiển thị counter public** — chủ trang xem dashboard GA4
- **Lý do KISS**: visible counter cần backend/external API, không worth it ở phase MCP

### Contact
```
Email: nguyentanducchatgpt@gmail.com
Zalo:  0913723667
```
→ Static HTML, click-to-email (`mailto:`) + click-to-Zalo deep link

### Donate
- Hiển thị QR code ngân hàng (VietQR format — ảnh PNG tĩnh)
- Số tài khoản dạng text (gửi sau khi có thông tin)
- Không cần payment gateway ở phase MCP

---

## Deploy Flow (GitHub Pages)

```
Developer push → GitHub Actions trigger
→ npm ci
→ npm run build (Vite + i18n JSON baked in)
→ upload artifact (dist/)
→ deploy to GitHub Pages
→ URL: https://nguyentanducchatgpt-droid.github.io/HEALTH-LIFESTYLE-PROJECT/
```

**Thông tin repo (đã xác nhận)**:
- GitHub user: `nguyentanducchatgpt-droid`
- Repo: `HEALTH-LIFESTYLE-PROJECT`
- Pages URL: `https://nguyentanducchatgpt-droid.github.io/HEALTH-LIFESTYLE-PROJECT/`
- Vite `base`: `/HEALTH-LIFESTYLE-PROJECT/`

Theo đúng blueprint `claude_ver17_github_pages.md` v3.3:
- Hash router (#/pillar-a, #/videos, #/contact)
- 404.html SPA redirect trick
- .nojekyll để tắt Jekyll processing
- Vite `base` = `/HEALTH-LIFESTYLE-PROJECT/` (hardcode, không cần GITHUB_REPOSITORY env)

---

## Risk Assessment

| Risk | Xác suất | Ảnh hưởng | Mitigation |
|---|---|---|---|
| Video autoplay bị block trên iOS | Thấp | Thấp | Dùng `muted` + `playsInline` — Safari cho phép |
| DE translation chất lượng thấp | Trung bình | Thấp | DE không phải primary audience, acceptable |
| Donate QR code expired | Thấp | Cao | Tạo QR tĩnh từ VietQR, không expire |
| GitHub Pages bandwidth (100GB/tháng) | Rất thấp | Cao | Video ~14MB, cần 7M lượt xem mới đạt 100GB |
| YouTube iframe bị block (school networks) | Thấp | Thấp | Fallback link đến YouTube trực tiếp |

---

## Implementation Considerations

### Dependencies cần cài
```json
{
  "react": "^18",
  "react-dom": "^18",
  "react-router-dom": "^6",
  "react-i18next": "^14",
  "i18next": "^23",
  "i18next-browser-languagedetector": "^7"
}
```
```json
devDependencies: {
  "vite": "^5",
  "@vitejs/plugin-react": "^4",
  "tailwindcss": "^3",
  "autoprefixer": "^10",
  "postcss": "^8"
}
```

### Không cần (YAGNI)
- Backend / API server — phase MCP thuần static
- Database — không có user data
- Auth — không có login
- Payment gateway — donate chỉ cần QR tĩnh
- SSR / Astro — overkill
- React Query / SWR — không có async data fetching

---

## Success Metrics (Phase MCP)

- [ ] Website load < 3s trên 3G mobile
- [ ] 6 video clip play được trên Mobile/iPad/Laptop
- [ ] YouTube embed hiển thị đúng 3 platform
- [ ] Language switch VI/EN/DE hoạt động không reload page
- [ ] Contact email/Zalo link click được trên mobile
- [ ] Donate section hiển thị đúng QR code
- [ ] GA4 ghi nhận page views
- [ ] GitHub Actions tự deploy khi push main

---

## Next Steps

1. **Init project**: `npm create vite@latest` → React template → add Tailwind + react-i18next
2. **Setup i18n**: Tạo 3 namespace JSON (VI trước)
3. **Copy video assets**: `Documents/Video/*.mp4` → `public/videos/`
4. **Build components**: LanguageSwitcher → VideoCard → 6 Pillar pages → Contact → Donate
5. **Setup GitHub Actions**: Copy từ claude_ver17 v3.3, điều chỉnh repo name
6. **Add GA4**: Tạo property trên analytics.google.com → paste script vào index.html
7. **Machine translate**: Generate EN + DE JSON từ VI base
8. **Donate section**: Thêm sau khi có số tài khoản ngân hàng

---

## Unresolved Questions

- Số tài khoản ngân hàng để tạo Donate section (cung cấp sau)
- YouTube video URLs cụ thể cần embed (cung cấp sau — thêm vào VideoLibrary sau khi có link)
