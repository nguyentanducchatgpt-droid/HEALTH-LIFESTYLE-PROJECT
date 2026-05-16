# Phase 02 — i18n Foundation
**Parent**: [plan.md](plan.md) | **Status**: ⬜ Pending | **Priority**: HIGH (blocks Phase 03+)

## Overview
Setup react-i18next + i18next. Create VI/EN/DE translation JSON files for all content (6 trụ cột).

## Requirements
- Language priority: localStorage → browser Accept-Language → default `vi`
- Namespaces: `common` (UI strings) + `pillars` (content)
- VI = viết tay; EN + DE = machine translate từ VI
- Switch language không reload page

## Architecture

```
src/i18n/
├── index.js          → init i18next, configure detection
├── vi/common.json    → nav, footer, contact, donate, buttons, hero
├── vi/pillars.json   → 6 trụ cột content (primary)
├── en/common.json    → English UI
├── en/pillars.json   → English pillar content
├── de/common.json    → Deutsch UI
└── de/pillars.json   → Deutsch pillar content
```

## Files to Create

| File | Action |
|------|--------|
| `src/i18n/index.js` | CREATE |
| `src/i18n/vi/common.json` | CREATE |
| `src/i18n/vi/pillars.json` | CREATE |
| `src/i18n/en/common.json` | CREATE |
| `src/i18n/en/pillars.json` | CREATE |
| `src/i18n/de/common.json` | CREATE |
| `src/i18n/de/pillars.json` | CREATE |

## Implementation Steps

### 1. src/i18n/index.js
```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import viCommon from './vi/common.json';
import viPillars from './vi/pillars.json';
import enCommon from './en/common.json';
import enPillars from './en/pillars.json';
import deCommon from './de/common.json';
import dePillars from './de/pillars.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: { common: viCommon, pillars: viPillars },
      en: { common: enCommon, pillars: enPillars },
      de: { common: deCommon, pillars: dePillars },
    },
    lng: 'vi',
    fallbackLng: 'vi',
    supportedLngs: ['vi', 'en', 'de'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    ns: ['common', 'pillars'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });

export default i18n;
```

### 2. src/i18n/vi/common.json (PRIMARY — viết tay đầy đủ)
```json
{
  "lang": { "vi": "Tiếng Việt", "en": "English", "de": "Deutsch" },
  "nav": {
    "home": "Trang Chủ",
    "pillars": "6 Trụ Cột",
    "videos": "Video",
    "contact": "Liên Hệ",
    "donate": "Ủng Hộ"
  },
  "hero": {
    "title": "Sức Khỏe và Đời Sống",
    "subtitle": "Hệ sinh thái sống khỏe đơn giản, khoa học, dễ áp dụng mỗi ngày",
    "cta": "Bắt Đầu Ngay",
    "pillars_title": "6 Trụ Cột Sống Khỏe"
  },
  "contact": {
    "title": "Liên Hệ",
    "email_label": "Email",
    "zalo_label": "Zalo",
    "email": "nguyentanducchatgpt@gmail.com",
    "zalo": "0913723667"
  },
  "donate": {
    "title": "Ủng Hộ Tác Giả",
    "subtitle": "Nếu nội dung có ích, bạn có thể ủng hộ để tác giả tiếp tục tạo nội dung chất lượng.",
    "placeholder": "Thông tin tài khoản ngân hàng sẽ được cập nhật sớm.",
    "thanks": "Cảm ơn sự ủng hộ của bạn!"
  },
  "footer": {
    "copyright": "© 2026 Sức Khỏe và Đời Sống. Mọi quyền được bảo lưu.",
    "disclaimer": "Nội dung mang tính phổ thông, không thay thế tư vấn y tế chuyên nghiệp."
  },
  "video": {
    "title": "Thư Viện Video",
    "local_section": "Video Hướng Dẫn Bài Tập",
    "youtube_section": "Video YouTube",
    "youtube_placeholder": "Video YouTube sẽ được cập nhật sớm.",
    "squat": "Squat — Kỹ thuật cơ bản",
    "push": "Push — Chống đẩy đúng cách",
    "pull": "Pull — Kéo đúng cách",
    "hinge": "Hinge — Gập hông đúng cách",
    "core": "Core — Lõi cơ thể",
    "breath": "Breath — Kỹ thuật thở"
  },
  "common": {
    "learn_more": "Tìm Hiểu Thêm",
    "back": "Quay Lại",
    "loading": "Đang tải...",
    "safety_note": "⚠️ Dừng ngay nếu có đau ngực, chóng mặt, khó thở — hãy đi khám ngay."
  }
}
```

### 3. src/i18n/vi/pillars.json (PRIMARY — nội dung đầy đủ từ document)
```json
{
  "pillarA": {
    "id": "A",
    "title": "Vận Động & Tập Luyện",
    "subtitle": "Daily Training",
    "description": "Xây dựng thói quen vận động khoa học, phù hợp mọi cấp độ.",
    "icon": "🏃",
    "color": "green",
    "sections": [
      {
        "title": "Nền Tảng",
        "items": [
          "Khởi động & giãn cơ đúng cách",
          "Kỹ thuật cơ bản: Squat, Hinge, Push, Pull, Core, Thở",
          "Chọn mức độ phù hợp: RPE, nhịp tim, test nói chuyện"
        ]
      },
      {
        "title": "Lộ Trình Theo Mục Tiêu",
        "items": [
          "Giảm mỡ — cardio + thâm hụt calo",
          "Tăng cơ — sức mạnh + đủ protein",
          "Tăng sức bền — cardio/chạy bộ tiến dần",
          "Dẻo dai & mobility",
          "Phòng/giảm đau cổ vai gáy, lưng, gối"
        ]
      },
      {
        "title": "Chương Trình Theo Bối Cảnh",
        "items": [
          "10 phút/ngày (siêu bận)",
          "20–30 phút/ngày (chuẩn)",
          "Tập tại nhà không dụng cụ",
          "Tập với tạ đơn/dây kháng lực",
          "Tập ngoài trời"
        ]
      },
      {
        "title": "Theo Dõi Tiến Bộ",
        "items": [
          "Tăng dần (progressive overload)",
          "Test hàng tháng: sức bền, sức mạnh, linh hoạt",
          "Nhật ký tập luyện"
        ]
      }
    ],
    "videos": ["SQUAT", "PUSH", "PULL", "HINGE", "CORE"]
  },
  "pillarB": {
    "id": "B",
    "title": "Dinh Dưỡng & Thực Đơn",
    "subtitle": "Nutrition",
    "description": "Ăn đúng, đủ, cân bằng — không cần nhịn hay ăn kiêng cực đoan.",
    "icon": "🥗",
    "color": "lime",
    "sections": [
      {
        "title": "Kiến Thức Nền",
        "items": [
          "Năng lượng: TDEE, thâm hụt/duy trì/thặng dư",
          "Macro: Protein – Carb – Fat",
          "Chất xơ, nước, vi chất"
        ]
      },
      {
        "title": "Ứng Dụng Thực Tế",
        "items": [
          "Đĩa ăn lành mạnh — ½ rau, ¼ đạm, ¼ tinh bột",
          "Ăn theo mục tiêu: giảm mỡ / tăng cơ / sức bền",
          "Meal prep cho người bận",
          "Thực đơn ăn ngoài quán vẫn khỏe"
        ]
      },
      {
        "title": "Thói Quen Ăn Uống",
        "items": [
          "Ăn chậm, đúng giờ, kiểm soát đồ ngọt",
          "Xử lý bữa ăn lỡ tay",
          "Thực đơn tiết kiệm, dễ mua"
        ]
      }
    ],
    "videos": []
  },
  "pillarC": {
    "id": "C",
    "title": "Lối Sống Khỏe",
    "subtitle": "Lifestyle",
    "description": "Những thói quen nhỏ tạo nên sức khỏe bền vững mỗi ngày.",
    "icon": "🌿",
    "color": "teal",
    "sections": [
      {
        "title": "Giấc Ngủ",
        "items": [
          "Vệ sinh giấc ngủ — môi trường, nhiệt độ, ánh sáng",
          "Routine trước ngủ 30–60 phút",
          "Cách sửa thói quen ngủ muộn"
        ]
      },
      {
        "title": "Năng Lượng & Nhịp Sống",
        "items": [
          "Thói quen buổi sáng",
          "NEAT — đi bộ, đứng, cử động nhỏ",
          "Ánh nắng và nhịp sinh học"
        ]
      },
      {
        "title": "Phục Hồi",
        "items": [
          "Deload và nghỉ ngơi chủ động",
          "Thở, giãn cơ, massage cơ bản"
        ]
      }
    ],
    "videos": ["BREATH"]
  },
  "pillarD": {
    "id": "D",
    "title": "Tâm Trí An Nhiên",
    "subtitle": "Mind & Calm",
    "description": "Quản lý stress, xây dựng tư duy tích cực và kỷ luật mềm.",
    "icon": "🧘",
    "color": "purple",
    "sections": [
      {
        "title": "Nền Tảng",
        "items": [
          "Stress là gì và cơ chế cơ bản",
          "Vòng lặp lo âu — thói quen"
        ]
      },
      {
        "title": "Thực Hành",
        "items": [
          "Thiền 3–10 phút/ngày",
          "Journaling: 5 dòng mỗi ngày",
          "Box breathing (4-4-4-4) và thở 4-7-8",
          "Digital detox"
        ]
      },
      {
        "title": "Tư Duy Sống Tốt",
        "items": [
          "Tối giản mục tiêu",
          "Kỷ luật mềm (gentle discipline)",
          "Xây thói quen nhỏ nhưng bền"
        ]
      }
    ],
    "videos": ["BREATH"]
  },
  "pillarE": {
    "id": "E",
    "title": "Kiến Thức Sức Khỏe",
    "subtitle": "Health Literacy",
    "description": "Hiểu cơ thể, nhận biết dấu hiệu, phòng bệnh chủ động.",
    "icon": "📚",
    "color": "blue",
    "sections": [
      {
        "title": "Chỉ Số Cần Biết",
        "items": [
          "BMI và vòng eo",
          "Huyết áp bình thường",
          "Đường huyết và mỡ máu cơ bản"
        ]
      },
      {
        "title": "Dấu Hiệu Cần Đi Khám",
        "items": [
          "Đau ngực, khó thở nhiều",
          "Chóng mặt khi vận động",
          "Chấn thương cấp — dừng ngay"
        ]
      },
      {
        "title": "Phòng Bệnh",
        "items": [
          "Vận động đều đặn",
          "Dinh dưỡng cân bằng",
          "Ngủ đủ giấc",
          "Quản lý stress"
        ]
      }
    ],
    "videos": []
  },
  "pillarF": {
    "id": "F",
    "title": "Công Cụ & Tài Nguyên",
    "subtitle": "Tools",
    "description": "Checklist, template và bộ test để theo dõi hành trình sống khỏe.",
    "icon": "🛠️",
    "color": "orange",
    "sections": [
      {
        "title": "Checklist Hàng Ngày",
        "items": [
          "10–20 phút vận động",
          "2 nắm rau/bữa",
          "1 nguồn đạm/bữa chính",
          "Ngủ sớm hơn 30 phút",
          "1 phút thở/thiền"
        ]
      },
      {
        "title": "Template",
        "items": [
          "Nhật ký tập luyện tuần",
          "Template lên thực đơn 7 ngày",
          "Routine buổi sáng/tối"
        ]
      },
      {
        "title": "Bộ Test Tiến Bộ 4 Tuần",
        "items": [
          "Test sức bền: đi bộ nhanh 6 phút",
          "Test sức mạnh: max squat / chống đẩy",
          "Test linh hoạt: chạm ngón tay sàn",
          "Đo vòng eo, cân nặng"
        ]
      }
    ],
    "videos": []
  }
}
```

### 4–7. EN / DE translations
Full translation content — generated from VI via machine translation. See implementation note below.

**en/common.json** — English equivalent of vi/common.json keys
**en/pillars.json** — English equivalent of vi/pillars.json
**de/common.json** — Deutsch equivalent
**de/pillars.json** — Deutsch equivalent

> **Implementation note**: During coding phase, implementer generates EN/DE JSON by translating VI content. All key structure identical to VI — only values differ.

## Todo List
- [ ] Create `src/i18n/index.js`
- [ ] Create `src/i18n/vi/common.json`
- [ ] Create `src/i18n/vi/pillars.json`
- [ ] Create `src/i18n/en/common.json`
- [ ] Create `src/i18n/en/pillars.json`
- [ ] Create `src/i18n/de/common.json`
- [ ] Create `src/i18n/de/pillars.json`
- [ ] Verify `useTranslation()` works in a test component

## Success Criteria
- Language switches without page reload
- `localStorage` persists language choice
- All 6 pillar keys resolve in all 3 languages
- Fallback to `vi` when key missing in EN/DE

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| Missing translation keys → blank UI | Ensure fallbackLng = 'vi' in i18n config |
| JSON syntax errors | Validate JSON before save |
| Large pillars.json → slow parse | File is ~10KB, negligible |

## Security Considerations
- No user data in i18n — pure static strings
- No dynamic key construction (XSS risk) — all keys hardcoded
