import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ThoughtBubble from '../components/ThoughtBubble';

// ─── Constants ───────────────────────────────────────────────────────────────

const LIME = '#84cc16';
const LIME_GLOW = 'rgba(132,204,22,0.18)';

const HERO_STATS = [
  { n: 5,  suffix: '',  label: 'Nguyên tắc' },
  { n: 3,  suffix: '',  label: 'Cấp độ' },
  { n: 7,  suffix: '',  label: 'Ngày mẫu' },
  { n: 4,  suffix: '',  label: 'Mục tiêu' },
];

const MANTRAS = [
  {
    n: '01', icon: '⚖️', text: 'Ăn đủ', sub: 'Không ăn kiệt sức hay cắt quá mức',
    desc: 'Cơ thể cần đủ năng lượng để vận hành, phục hồi và xây dựng cơ bắp. Cắt calo quá mức làm chậm trao đổi chất và gây mất cơ ngoài ý muốn.',
    tips: ['1,600–2,400 kcal/ngày tùy hoạt động', 'Không bỏ bữa sáng liên tục', 'Ăn chậm — não cần 20 phút để cảm nhận no'],
  },
  {
    n: '02', icon: '⏰', text: 'Ăn đều', sub: 'Không theo cảm hứng, không bỏ bữa',
    desc: 'Nhịp sinh học hoạt động tốt nhất khi được nuôi đúng giờ. Ăn đều giờ ổn định đường huyết và kiểm soát cảm giác thèm ăn bất thường.',
    tips: ['3 bữa chính cùng khung giờ mỗi ngày', 'Không nhịn quá 5 tiếng liên tục', 'Chuẩn bị thực phẩm sẵn để không bỏ bữa'],
  },
  {
    n: '03', icon: '🌿', text: 'Ăn thật', sub: 'Hạn chế đồ siêu chế biến, ít phụ gia',
    desc: 'Thực phẩm nguyên dạng giữ nguyên vi chất, chất xơ và enzyme tự nhiên. Đồ siêu chế biến kích thích ăn quá mức qua cơ chế thần kinh.',
    tips: ['Ưu tiên rau củ, thịt tươi, trứng, cá', 'Đọc nhãn thành phần trước khi mua', 'Nguyên tắc: dưới 5 thành phần/sản phẩm'],
  },
  {
    n: '04', icon: '🎯', text: 'Ăn theo mục tiêu', sub: 'Không theo phong trào hay quảng cáo',
    desc: 'Keto, IF, Low-carb đều có thể hiệu quả — nhưng chỉ khi phù hợp với cơ thể, lịch sống và mục tiêu cụ thể của bạn. Không có chế độ ăn nào phù hợp cho tất cả.',
    tips: ['Xác định mục tiêu rõ ràng trước', 'Thử nghiệm nhất quán ít nhất 4 tuần', 'Đo kết quả khách quan bằng số liệu'],
  },
  {
    n: '05', icon: '💪', text: 'Protein là nền', sub: 'Rau là bạn, carb là nhiên liệu',
    desc: 'Protein (1.6–2.2g/kg thể trọng) bảo vệ cơ bắp, tăng cảm giác no lâu và đốt thêm calo qua quá trình tiêu hóa. Đây là macro quan trọng nhất trong mọi mục tiêu.',
    tips: ['1.6–2.2g protein/kg thể trọng/ngày', 'Mỗi bữa ăn đều có nguồn protein', 'Trứng, thịt, đậu, sữa chua Hy Lạp'],
  },
  {
    n: '06', icon: '🔄', text: 'Một bữa lệch', sub: 'Không phá hỏng hành trình dài hạn',
    desc: 'Một bữa pizza không làm bạn béo, giống như một bữa salad không làm bạn gầy. Kết quả đến từ thói quen hàng tuần, không phải từ một bữa ăn đơn lẻ.',
    tips: ['1–2 bữa linh hoạt/tuần là bình thường', 'Quay lại thói quen bình thường ngay sau', 'Không "bù đắp" bằng cách nhịn ăn'],
  },
  {
    n: '07', icon: '🏃', text: 'Duy trì được', sub: 'Dinh dưỡng tốt nhất là cái bạn giữ được',
    desc: 'Chế độ ăn hoàn hảo trên lý thuyết nhưng không thể duy trì trong thực tế thì bằng không. 80% nhất quán trong 1 năm luôn tốt hơn 100% hoàn hảo trong 3 tuần rồi bỏ.',
    tips: ['Bắt đầu với 1 thay đổi nhỏ nhất', 'Xây hệ thống — không phụ thuộc ý chí', 'Điều chỉnh món ăn yêu thích thay vì bỏ'],
  },
];

const TABS = [
  {
    id: 'calc', label: 'Tính TDEE', short: 'B0',
    color: '#8b5cf6', rgb: '139,92,246', frameClass: 'pb-frame-5',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/>
      </svg>
    ),
  },
  {
    id: 'foundation', label: 'Nền Tảng', short: 'B1',
    color: '#84cc16', rgb: '132,204,22', frameClass: 'pb-frame-0',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    id: 'plate', label: 'Đĩa Ăn', short: 'B2',
    color: '#22c55e', rgb: '34,197,94', frameClass: 'pb-frame-1',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M2 12h20"/>
      </svg>
    ),
  },
  {
    id: 'goals', label: 'Mục Tiêu', short: 'B3',
    color: '#f97316', rgb: '249,115,22', frameClass: 'pb-frame-2',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
  },
  {
    id: 'meals', label: 'Thực Đơn', short: 'B4',
    color: '#06b6d4', rgb: '6,182,212', frameClass: 'pb-frame-3',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/>
      </svg>
    ),
  },
  {
    id: 'tracking', label: 'Theo Dõi', short: 'B5',
    color: '#a855f7', rgb: '168,85,247', frameClass: 'pb-frame-4',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    id: 'sevenday', label: '7 Ngày', short: 'B6',
    color: '#ec4899', rgb: '236,72,153', frameClass: 'pb-frame-6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    id: 'advanced', label: 'Nâng Cao', short: 'B7',
    color: '#f59e0b', rgb: '245,158,11', frameClass: 'pb-frame-7',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
];

const MACROS = [
  {
    name: 'Protein',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    dose: '1.6–2.2 g/kg',
    role: 'Giữ cơ, no lâu, phục hồi',
    pct: 80,
    color: '#84cc16',
    bg: 'bg-lime-500',
    text: 'text-lime-400',
    border: 'border-lime-500/25',
    cardBg: 'bg-lime-500/6',
    sources: ['Thịt gà', 'Cá', 'Trứng', 'Đậu hũ', 'Whey'],
  },
  {
    name: 'Carbohydrate',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    dose: '40–55% tổng kcal',
    role: 'Năng lượng não & cơ bắp',
    pct: 55,
    color: '#f97316',
    bg: 'bg-orange-500',
    text: 'text-orange-400',
    border: 'border-orange-500/25',
    cardBg: 'bg-orange-500/6',
    sources: ['Cơm', 'Khoai lang', 'Bún', 'Yến mạch', 'Hoa quả'],
  },
  {
    name: 'Chất béo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z"/><path d="M12 8v8"/><path d="M8 12h8"/>
      </svg>
    ),
    dose: '20–35% tổng kcal',
    role: 'Nội tiết, hấp thu vitamin',
    pct: 35,
    color: '#eab308',
    bg: 'bg-yellow-500',
    text: 'text-yellow-400',
    border: 'border-yellow-500/25',
    cardBg: 'bg-yellow-500/6',
    sources: ['Dầu olive', 'Bơ', 'Hạt óc chó', 'Cá hồi', 'Hạt chia'],
  },
  {
    name: 'Chất xơ',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 22V12M12 12C12 12 7 7.5 7 4a5 5 0 0 1 10 0c0 3.5-5 8-5 8z"/>
      </svg>
    ),
    dose: '25–38 g/ngày',
    role: 'Tiêu hóa, no lâu, hệ vi sinh',
    pct: 45,
    color: '#10b981',
    bg: 'bg-emerald-500',
    text: 'text-emerald-400',
    border: 'border-emerald-500/25',
    cardBg: 'bg-emerald-500/6',
    sources: ['Rau xanh', 'Đậu lăng', 'Cải bông', 'Chuối xanh', 'Hạt lanh'],
  },
  {
    name: 'Nước',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
      </svg>
    ),
    dose: '35 ml/kg thể trọng',
    role: 'Hiệu suất, phục hồi, trao đổi chất',
    pct: 65,
    color: '#06b6d4',
    bg: 'bg-cyan-500',
    text: 'text-cyan-400',
    border: 'border-cyan-500/25',
    cardBg: 'bg-cyan-500/6',
    sources: ['Nước lọc', 'Trà xanh', 'Nước dừa', 'Canh', 'Trái cây'],
  },
];

const TDEE_MODES = [
  {
    goalKey: 'loss',
    label: 'Giảm mỡ',
    delta: '−300–500 kcal',
    note: 'Thâm hụt nhẹ, giữ protein cao',
    color: '#f97316',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/25',
    text: 'text-orange-400',
    arrow: '↓',
  },
  {
    goalKey: 'recomp',
    label: 'Duy trì',
    delta: '± 0–100 kcal',
    note: 'Ăn quanh TDEE, linh hoạt',
    color: '#84cc16',
    bg: 'bg-lime-500/10',
    border: 'border-lime-500/25',
    text: 'text-lime-400',
    arrow: '~',
  },
  {
    goalKey: 'gain',
    label: 'Tăng cơ',
    delta: '+200–300 kcal',
    note: 'Thặng dư nhỏ, tăng dần',
    color: '#22c55e',
    bg: 'bg-green-500/10',
    border: 'border-green-500/25',
    text: 'text-green-400',
    arrow: '↑',
  },
];

// i18next may return arrays as plain objects {"0":…,"1":…} when using returnObjects — normalize both forms
const toArr = v => !v ? [] : Array.isArray(v) ? v : Object.values(v);

const PLATE_SECTIONS = [
  {
    pct: 50,
    label: '½ Rau & Canh',
    detail: 'Rau luộc, salad, canh, rau xào ít dầu',
    color: '#22c55e',
    bg: 'bg-green-500',
    text: 'text-green-400',
  },
  {
    pct: 25,
    label: '¼ Đạm',
    detail: 'Thịt gà, cá, trứng, đậu hũ, tôm',
    color: '#84cc16',
    bg: 'bg-lime-500',
    text: 'text-lime-400',
  },
  {
    pct: 25,
    label: '¼ Tinh bột',
    detail: 'Cơm, bún, khoai lang, ngô, bánh mì',
    color: '#f97316',
    bg: 'bg-orange-500',
    text: 'text-orange-400',
  },
];

const GOALS = [
  {
    id: 'fat-loss',
    label: 'Giảm mỡ',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
      </svg>
    ),
    color: '#f97316',
    glow: 'rgba(249,115,22,0.15)',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/6',
    badgeBg: 'bg-orange-500/10',
    kcal: '−300–500 kcal/ngày',
    protein: '2.0–2.4 g/kg',
    carb: 'Giảm carb tinh, không uống calories',
    highlights: [
      'Thâm hụt calo bền vững, không nhịn ăn',
      'Protein cao để giữ cơ khi giảm mỡ',
      'Ưu tiên rau + đạm, hạn chế carb tinh',
      'Cardio kết hợp sức mạnh',
      'Tránh nước ngọt, nước trái cây có đường',
    ],
  },
  {
    id: 'muscle-gain',
    label: 'Tăng cơ',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="20" x2="20" y2="20"/>
      </svg>
    ),
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.15)',
    text: 'text-green-400',
    border: 'border-green-500/30',
    bg: 'bg-green-500/6',
    badgeBg: 'bg-green-500/10',
    kcal: '+200–300 kcal/ngày',
    protein: '1.8–2.2 g/kg',
    carb: 'Carb cao quanh buổi tập',
    highlights: [
      'Thặng dư nhẹ, tăng cân chậm và chất lượng',
      'Protein đều đặn mỗi bữa (4–5 bữa)',
      'Carb trước và sau tập để nạp năng lượng',
      'Ngủ đủ 7–9h — cơ phát triển khi ngủ',
      'Progressive overload song song với dinh dưỡng',
    ],
  },
  {
    id: 'endurance',
    label: 'Sức bền',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.15)',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/6',
    badgeBg: 'bg-blue-500/10',
    kcal: 'Tùy theo khối lượng tập',
    protein: '1.4–1.7 g/kg',
    carb: 'Carb cao ngày thi/tập nặng',
    highlights: [
      'Nạp carb trước sự kiện dài (>60 phút)',
      'Điện giải: natri + kali + magie',
      'Protein để phục hồi cơ sau cardio dài',
      'Không thử đồ ăn mới trước thi đấu',
      'Hydrat hóa liên tục — nước + nước dừa',
    ],
  },
  {
    id: 'maintenance',
    label: 'Duy trì',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 5 19 12"/>
      </svg>
    ),
    color: '#14b8a6',
    glow: 'rgba(20,184,166,0.15)',
    text: 'text-teal-400',
    border: 'border-teal-500/30',
    bg: 'bg-teal-500/6',
    badgeBg: 'bg-teal-500/10',
    kcal: 'Quanh TDEE ± 100',
    protein: '1.6–2.0 g/kg',
    carb: 'Linh hoạt, 80/20',
    highlights: [
      'Ăn quanh TDEE, không cần đếm chặt',
      'Áp dụng 80/20 — 80% thực phẩm lành mạnh',
      'Không cần cắt nhóm thực phẩm nào',
      'Tập trung vào chất lượng bữa ăn lâu dài',
      'Check-in cân nặng 1 lần/tuần để điều chỉnh',
    ],
  },
];

const MEAL_DAYS = [
  {
    day: 'Ngày 1', theme: 'Bắt đầu — Cân bằng', color: '#f97316',
    totalKcal: '~1.480', totalProtein: '~82g',
    analysis: {
      headline: 'Ngày đầu — thiết lập thói quen nền tảng',
      fiber: 'Rau muống + canh + chuối = ~10g chất xơ',
      highlight: 'Protein phân bổ đều 5 bữa (sáng/snack/trưa/snack/tối). Tổng ~82g đạt 90% nhu cầu cơ bản — dễ duy trì và không cảm giác đói giữa bữa.',
      tip: 'Cá kho tiêu giàu omega-3; hạt điều buổi xế cung cấp chất béo tốt + magie tự nhiên giúp thư giãn cơ bắp sau ngày dài.',
      benefits: ['Ổn định đường huyết suốt ngày nhờ 5 bữa nhỏ', 'Đạm đa dạng: trứng + cá + sữa chua', 'Nhẹ bụng về tối với cháo — dễ ngủ ngon'],
      score: { label: 'Dễ thực hiện', pct: 95 },
    },
    meals: [
      { time: 'Sáng', timeColor: '#f97316', items: ['Cơm trắng', 'Trứng luộc ×2', 'Rau muống luộc', 'Nước lọc'], note: 'Bận: bánh mì nguyên cám + trứng luộc', protein: '~20g', kcal: '~380' },
      { time: 'Snack sáng', timeColor: '#eab308', items: ['Sữa chua không đường', 'Chuối nhỏ ½'], note: 'Bận: 1 hộp sữa chua mua sẵn tiện lợi', protein: '~8g', kcal: '~120' },
      { time: 'Trưa', timeColor: '#84cc16', items: ['Cơm trắng', 'Cá kho tiêu', 'Rau cải xào tỏi', 'Canh rau'], note: 'Bận: cơm văn phòng chọn đĩa có cá/thịt + rau', protein: '~30g', kcal: '~520' },
      { time: 'Snack xế', timeColor: '#06b6d4', items: ['Hạt điều / hạnh nhân ~20g', 'Nước lọc'], note: 'Bận: gói hạt nhỏ mua sẵn giữ trong túi', protein: '~4g', kcal: '~120' },
      { time: 'Tối', timeColor: '#a855f7', items: ['Cháo yến mạch', 'Sữa chua không đường', 'Chuối 1 quả'], note: 'Bận: yến mạch instant + protein shake', protein: '~18g', kcal: '~340' },
    ],
  },
  {
    day: 'Ngày 2', theme: 'Protein nền tảng', color: '#22c55e',
    totalKcal: '~1.480', totalProtein: '~94g',
    analysis: {
      headline: 'Hôm nay ưu tiên protein cao — đa dạng nguồn',
      fiber: 'Rau sống + bắp cải + canh bí = ~11g chất xơ',
      highlight: 'Gà luộc + trứng + đậu hũ + sữa đậu nành phân bổ đạm đều 5 bữa. Protein ~94g — lý tưởng cho ngày tập nhẹ hoặc phục hồi sau tập hôm qua.',
      tip: 'Bánh mì nguyên cám sáng ổn định đường huyết đến trưa. Soup miso tối cung cấp probiotic tự nhiên và điện giải — giúp ngủ sâu và phục hồi tốt.',
      benefits: ['Đạm phong phú từ 4 nguồn khác nhau trong ngày', 'Probiotic từ miso tối hỗ trợ hệ tiêu hoá', 'Bún + đậu hũ tối nhẹ bụng — không nặng khi đi ngủ'],
      score: { label: 'Dinh dưỡng cao', pct: 92 },
    },
    meals: [
      { time: 'Sáng', timeColor: '#f97316', items: ['Bánh mì nguyên cám', 'Trứng ốp la', 'Cà chua + dưa leo', 'Sữa tươi không đường'], note: 'Bận: sandwich trứng mua ngoài', protein: '~22g', kcal: '~420' },
      { time: 'Snack sáng', timeColor: '#eab308', items: ['Trứng luộc ×1', 'Trái cây nhỏ (táo/ổi)'], note: 'Bận: trứng luộc chuẩn bị sẵn đêm trước', protein: '~7g', kcal: '~110' },
      { time: 'Trưa', timeColor: '#84cc16', items: ['Cơm trắng', 'Gà luộc sả', 'Canh bí đỏ', 'Rau sống'], note: 'Bận: cơm gà luộc — bỏ nước chấm nhiều muối', protein: '~35g', kcal: '~500' },
      { time: 'Snack xế', timeColor: '#06b6d4', items: ['Sữa đậu nành không đường 200ml'], note: 'Bận: hộp sữa đậu nành tiện lợi', protein: '~7g', kcal: '~90' },
      { time: 'Tối', timeColor: '#a855f7', items: ['Bún tươi', 'Đậu hũ chiên sả', 'Rau thơm + giá', 'Soup miso nhẹ'], note: 'Bận: bún đậu mua ngoài, ít bún thêm rau', protein: '~20g', kcal: '~360' },
    ],
  },
  {
    day: 'Ngày 3', theme: 'Tinh bột phức hợp', color: '#06b6d4',
    totalKcal: '~1.440', totalProtein: '~76g',
    analysis: {
      headline: 'Ngày tập trung vào tinh bột chất lượng cao',
      fiber: 'Yến mạch + hạt chia + rau luộc + canh chua = ~14g chất xơ',
      highlight: 'Yến mạch, gạo lứt, khoai lang — ba loại tinh bột phức hợp chỉ số GI thấp giúp năng lượng ổn định 4–5 tiếng, không đột ngột tăng rồi tụt đường huyết.',
      tip: 'Hạt chia trong yến mạch cung cấp omega-3 thực vật và tạo gel trong dạ dày giúp no lâu hơn. Cá hấp gừng nhẹ hơn chiên 40% calo — hấp thu protein tốt hơn.',
      benefits: ['Tinh bột phức hợp GI thấp tránh đột biến đường huyết', 'Omega-3 từ cá hấp + hạt chia bảo vệ tim mạch', 'Khoai lang xế chiều ngăn đói bụng trước bữa tối'],
      score: { label: 'Bền năng lượng', pct: 90 },
    },
    meals: [
      { time: 'Sáng', timeColor: '#f97316', items: ['Yến mạch rolled oats', 'Chuối 1 quả', 'Sữa hạt', 'Hạt chia 1 thìa'], note: 'Bận: overnight oats chuẩn bị tối hôm trước', protein: '~12g', kcal: '~350' },
      { time: 'Snack sáng', timeColor: '#eab308', items: ['Sữa chua Hy Lạp', 'Mật ong ¼ thìa'], note: 'Bận: hộp Greek yogurt tiện lợi bất kỳ nơi nào', protein: '~10g', kcal: '~130' },
      { time: 'Trưa', timeColor: '#84cc16', items: ['Cơm gạo lứt', 'Cá hấp gừng', 'Rau luộc chấm muối mè', 'Canh chua'], note: 'Bận: cơm phần có cá, thêm canh là đủ', protein: '~32g', kcal: '~490' },
      { time: 'Snack xế', timeColor: '#06b6d4', items: ['Khoai lang hấp nhỏ ~100g', 'Nước lọc'], note: 'Bận: khoai lang hấp chuẩn bị sẵn cho tuần', protein: '~2g', kcal: '~90' },
      { time: 'Tối', timeColor: '#a855f7', items: ['Cơm trắng nhỏ', 'Trứng chiên tỏi', 'Canh rau ngót thịt', 'Dưa leo'], note: 'Bận: cơm trứng đơn giản, thêm 1 bát canh', protein: '~22g', kcal: '~380' },
    ],
  },
  {
    day: 'Ngày 4', theme: 'Ngày nhiều rau & chất xơ', color: '#10b981',
    totalKcal: '~1.280', totalProtein: '~76g',
    analysis: {
      headline: 'Ngày tăng cường rau xanh — tiêu hoá nghỉ ngơi',
      fiber: 'Rau + trái cây + canh cải = ~16g chất xơ — vượt khuyến nghị hàng ngày',
      highlight: 'Ngày cao chất xơ giúp hệ tiêu hoá làm sạch nhẹ nhàng, ổn định vi khuẩn đường ruột và giảm cảm giác thèm đồ ngọt. Calo thấp nhất tuần — phù hợp ngày nghỉ hoặc ít vận động.',
      tip: 'Sữa chua + yến mạch sáng = probiotic + prebiotic đồng thời — bộ đôi tốt nhất cho đường ruột. Canh cải đắng trưa hỗ trợ chức năng gan nhẹ nhàng.',
      benefits: ['Chất xơ cao nhất tuần: no lâu + tiêu hoá tốt', 'Probiotic + prebiotic đồng thời từ sáng sớm', 'Ít calo phù hợp ngày nghỉ tập — không dư thừa'],
      score: { label: 'Thải độc nhẹ', pct: 88 },
    },
    meals: [
      { time: 'Sáng', timeColor: '#f97316', items: ['Sữa chua không đường', 'Yến mạch', 'Trái cây hỗn hợp', 'Hạt điều nhỏ'], note: 'Bận: parfait yến mạch + sữa chua mua sẵn', protein: '~18g', kcal: '~340' },
      { time: 'Snack sáng', timeColor: '#eab308', items: ['Trứng luộc ×1', 'Cà chua bi 5 quả'], note: 'Bận: trứng luộc + cà chua chuẩn bị sẵn', protein: '~7g', kcal: '~90' },
      { time: 'Trưa', timeColor: '#84cc16', items: ['Cơm gạo lứt', 'Đậu hũ kho nấm', 'Canh cải đắng', 'Rau sống nhiều'], note: 'Bận: cơm đậu hũ phần có nhiều rau xanh', protein: '~28g', kcal: '~480' },
      { time: 'Snack xế', timeColor: '#06b6d4', items: ['Dưa hấu / thanh long / ổi ~200g'], note: 'Bận: trái cây cắt sẵn mua ở cửa hàng tiện lợi', protein: '~1g', kcal: '~80' },
      { time: 'Tối', timeColor: '#a855f7', items: ['Súp gà rau củ', 'Bánh mì nguyên cám nhỏ', 'Sữa chua ít đường'], note: 'Bận: súp đóng hộp thêm rau + gà xé sẵn', protein: '~22g', kcal: '~340' },
    ],
  },
  {
    day: 'Ngày 5', theme: 'Ngày tập — Carb cao', color: '#f97316',
    totalKcal: '~1.800', totalProtein: '~113g',
    analysis: {
      headline: 'Ngày tập luyện — nạp carb + protein tối đa',
      fiber: 'Rau + chuối + yến mạch = ~9g chất xơ đủ dùng',
      highlight: 'Calo cao nhất tuần (+30% so với ngày nghỉ) để glycogen cơ luôn đầy trước và sau tập. Protein ~113g = 1.6g/kg (70kg) đảm bảo tổng hợp cơ tối đa trong 24–48h sau tập.',
      tip: 'Chuối trước tập 30–60 phút = fructose + glucose hấp thu nhanh, không nặng bụng. Sữa chua Hy Lạp + chuối ngay sau tập = bộ đôi protein + carb phục hồi cổ điển.',
      benefits: ['Carb cao trước tập: năng lượng bùng nổ, không bị tụt giữa set', 'Protein sau tập trong 30 phút: kích hoạt tổng hợp cơ tốt nhất', 'Cá hồi tối: omega-3 chống viêm cơ sau tập nặng'],
      score: { label: 'Tối ưu tập luyện', pct: 97 },
    },
    meals: [
      { time: 'Sáng', timeColor: '#f97316', items: ['Cơm trắng vừa', 'Trứng ×2', 'Rau xào nhẹ', 'Sữa tươi'], note: 'Bận: cơm + trứng chiên — nhanh, đủ carb', protein: '~25g', kcal: '~480' },
      { time: 'Snack trước tập', timeColor: '#eab308', items: ['Chuối 1 quả', 'Khoai lang nhỏ hoặc 1 lát bánh mì'], note: 'Bận: chuối + bánh mì sandwich nhỏ', protein: '~3g', kcal: '~180' },
      { time: 'Trưa', timeColor: '#84cc16', items: ['Cơm trắng (nhiều hơn)', 'Ức gà áp chảo', 'Bắp cải luộc', 'Canh rau'], note: 'Bận: cơm gà văn phòng — thêm cơm hơn bình thường', protein: '~40g', kcal: '~580' },
      { time: 'Snack sau tập', timeColor: '#06b6d4', items: ['Sữa chua Hy Lạp', 'Chuối 1 quả', 'Whey shake (nếu có)'], note: 'Bận: whey + chuối blender ngay sau tập', protein: '~20g', kcal: '~220' },
      { time: 'Tối', timeColor: '#a855f7', items: ['Cơm nhỏ', 'Cá hồi / cá thu kho', 'Rau luộc nhiều'], note: 'Bận: cơm cá mua ngoài, thêm rau là đủ', protein: '~30g', kcal: '~420' },
    ],
  },
  {
    day: 'Ngày 6', theme: 'Meal prep cuối tuần', color: '#a855f7',
    totalKcal: '~1.390', totalProtein: '~97g',
    analysis: {
      headline: 'Cuối tuần — chuẩn bị thực phẩm cho cả tuần tới',
      fiber: 'Rau giá + rau thơm + salad + canh = ~12g chất xơ',
      highlight: 'Ngày cuối tuần lý tưởng để meal prep: luộc trứng, nấu gà, hấp khoai, nấu cơm gạo lứt — chuẩn bị cho 2–3 ngày tới, tiết kiệm 45–60 phút mỗi ngày trong tuần.',
      tip: 'Phở/bún gà sáng là "ăn ngoài thông minh" — chọn ít bánh, nhiều rau giá, thịt gà nạc, không uống hết nước dùng béo. Cháo gà tối dễ tiêu giúp ngủ ngon.',
      benefits: ['Meal prep tiết kiệm 45–60 phút/ngày trong tuần', 'Phở gà ít chất béo bão hoà hơn phở bò ~30%', 'Kiểm soát calo tốt hơn khi chuẩn bị sẵn đồ ăn'],
      score: { label: 'Tiết kiệm & thực tế', pct: 85 },
    },
    meals: [
      { time: 'Sáng', timeColor: '#f97316', items: ['Phở/bún gà nạc', 'Thêm rau giá nhiều', 'Ít bánh phở', 'Không uống hết nước béo'], note: 'Bận: phở mua ngoài — gọi thêm rau, bỏ quẩy', protein: '~28g', kcal: '~420' },
      { time: 'Snack sáng', timeColor: '#eab308', items: ['Trái cây theo mùa', 'Hạt mixed nuts ~15g'], note: 'Bận: túi hạt nhỏ + trái cây cắt sẵn', protein: '~4g', kcal: '~110' },
      { time: 'Trưa', timeColor: '#84cc16', items: ['Cơm gạo lứt', 'Gà áp chảo (meal prep)', 'Salad rau trộn dầu olive', 'Trứng luộc ×1'], note: 'Bận: meal prep sẵn — lấy ra hâm nóng là xong', protein: '~43g', kcal: '~520' },
      { time: 'Snack xế', timeColor: '#06b6d4', items: ['Sữa chua không đường', 'Granola nhỏ ~20g'], note: 'Bận: hộp sữa chua + granola tiện lợi', protein: '~8g', kcal: '~150' },
      { time: 'Tối', timeColor: '#a855f7', items: ['Cháo gà đơn giản', 'Gừng + hành lá', 'Dưa cải muối nhẹ'], note: 'Bận: cháo ăn liền + ức gà xé sẵn từ meal prep', protein: '~22g', kcal: '~320' },
    ],
  },
  {
    day: 'Ngày 7', theme: 'Recovery — dễ tiêu', color: '#eab308',
    totalKcal: '~1.230', totalProtein: '~70g',
    analysis: {
      headline: 'Ngày phục hồi — nhẹ bụng, hệ tiêu hoá nghỉ ngơi',
      fiber: 'Cháo + rau luộc + trái cây = ~9g chất xơ nhẹ nhàng',
      highlight: 'Ngày cuối tuần hoặc ngày nghỉ tập hoàn toàn: giảm tổng calo 10–15% so với ngày tập, ưu tiên thực phẩm dễ tiêu hoá để cơ thể tập trung vào sửa chữa và phục hồi.',
      tip: 'Cháo cá/cháo yến mạch là "thực phẩm phục hồi" cổ điển Á Đông — dễ tiêu, nhẹ dạ dày, cung cấp đủ tinh bột và đạm nhẹ. Súp miso tối = điện giải + probiotic tự nhiên cho ngủ sâu.',
      benefits: ['Calo thấp nhất tuần — để cơ thể tập trung hồi phục', 'Thực phẩm mềm, dễ tiêu giúp đường ruột nghỉ ngơi', 'Reset cảm giác đói tự nhiên, sẵn sàng cho tuần mới'],
      score: { label: 'Phục hồi tối ưu', pct: 82 },
    },
    meals: [
      { time: 'Sáng', timeColor: '#f97316', items: ['Cháo yến mạch loãng', 'Trứng luộc ×1', 'Rau thơm', 'Nước lọc ấm'], note: 'Bận: cháo instant nhẹ + trứng luộc', protein: '~15g', kcal: '~300' },
      { time: 'Snack sáng', timeColor: '#eab308', items: ['Táo / lê / ổi 1 quả vừa'], note: 'Bận: trái cây cắt sẵn dễ mang theo', protein: '~1g', kcal: '~70' },
      { time: 'Trưa', timeColor: '#84cc16', items: ['Cơm trắng nhỏ', 'Thịt heo luộc nạc', 'Rau muống / cải thìa luộc', 'Canh bí'], note: 'Bận: cơm văn phòng phần nhỏ hơn bình thường', protein: '~28g', kcal: '~430' },
      { time: 'Snack xế', timeColor: '#06b6d4', items: ['Sữa chua ít béo', 'Mật ong ¼ thìa'], note: 'Bận: sữa chua tiện lợi mua sẵn', protein: '~8g', kcal: '~110' },
      { time: 'Tối', timeColor: '#a855f7', items: ['Súp miso + đậu hũ mềm', 'Cơm trắng rất nhỏ', 'Rau luộc'], note: 'Bận: súp miso gói + đậu hũ non mua sẵn', protein: '~18g', kcal: '~320' },
    ],
  },
];

const TRACKING_DAILY = [
  { label: 'Có protein trong mỗi bữa', color: '#84cc16' },
  { label: 'Ăn ít nhất 2 phần rau/ngày', color: '#22c55e' },
  { label: 'Uống đủ nước (~2L)', color: '#06b6d4' },
  { label: 'Không bỏ bữa chính', color: '#10b981' },
  { label: 'Hạn chế đồ chiên/đường', color: '#f97316' },
  { label: 'Ăn đủ kcal, không thiếu quá 500', color: '#eab308' },
  { label: 'Nhận thức được cảm giác no/đói', color: '#a855f7' },
];

const TRACKING_WEEKLY = [
  { label: 'Cân nặng (buổi sáng, sau vệ sinh)', icon: '⚖' },
  { label: 'Vòng eo (đo lúc đói)', icon: '📏' },
  { label: 'Mức năng lượng 1–10', icon: '⚡' },
  { label: 'Chất lượng giấc ngủ', icon: '💤' },
  { label: 'Hiệu suất buổi tập', icon: '🏋' },
  { label: 'Tâm trạng & Tiêu hóa', icon: '😊' },
];

const TIERS = [
  {
    level: 'Người mới',
    sub: 'Tuần 1–4',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.15)',
    text: 'text-green-400',
    border: 'border-green-500/30',
    bg: 'bg-green-500/5',
    badge: 'bg-green-500/10 border-green-500/20',
    steps: [
      'Mỗi bữa có ít nhất 1 nguồn đạm',
      'Thêm rau vào 2/3 bữa chính',
      'Uống 6–8 ly nước mỗi ngày',
      'Không cần đếm calo — chỉ cần nhận thức',
      'Giảm nước ngọt và đồ ăn vặt siêu chế biến',
    ],
  },
  {
    level: 'Tiêu Chuẩn',
    sub: 'Tuần 5–12',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.15)',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    badge: 'bg-blue-500/10 border-blue-500/20',
    steps: [
      'Áp dụng đĩa ăn ½–¼–¼ mỗi bữa chính',
      'Meal prep 1–2 lần/tuần tiết kiệm thời gian',
      'Ưu tiên thực phẩm chế biến tối thiểu',
      'Theo dõi protein hàng ngày (~1.6–2g/kg)',
      'Học đọc nhãn dinh dưỡng cơ bản',
    ],
  },
  {
    level: 'Nâng Cao',
    sub: 'Tháng 3+',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.15)',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/5',
    badge: 'bg-purple-500/10 border-purple-500/20',
    steps: [
      'Tính TDEE và macro theo mục tiêu cụ thể',
      'Carb cycling: cao ngày tập, thấp ngày nghỉ',
      'Timing dinh dưỡng: pre/intra/post workout',
      'Theo dõi body composition (cân Inbody)',
      'Điều chỉnh kế hoạch 4–6 tuần/lần',
    ],
  },
];

const PHILOSOPHY_7 = [
  { icon: '✋', title: 'Ăn đủ, không ăn kiệt sức', body: 'Cơ thể cần đủ calo để tập, làm việc và phục hồi. Ăn quá ít liên tục làm giảm chuyển hóa cơ bản và mất cơ bắp.' },
  { icon: '🔄', title: 'Ăn đều, không theo cảm hứng', body: 'Bữa ăn đúng giờ giữ đường huyết ổn định, giảm cơn thèm và tránh ăn bù quá mức khi đói dồn dập.' },
  { icon: '🥦', title: 'Ăn thật, hạn chế siêu chế biến', body: 'Thực phẩm nguyên dạng — thịt, cá, trứng, rau, gạo — cung cấp vi chất và no lâu tốt hơn đồ đóng gói.' },
  { icon: '🎯', title: 'Ăn theo mục tiêu, không theo phong trào', body: 'Người giảm mỡ ăn khác người tập sức bền. Không có thực đơn đúng cho tất cả — chỉ có thực đơn phù hợp với bạn.' },
  { icon: '🧩', title: 'Protein là nền, rau là bạn, carb là nhiên liệu', body: 'Ba nhóm đều cần thiết. Cắt bỏ hoàn toàn bất kỳ nhóm nào đều làm mất cân bằng và khó duy trì lâu dài.' },
  { icon: '🔁', title: 'Một bữa lệch không phá hỏng hành trình', body: 'Điều phá hỏng là tâm lý "lỡ rồi bỏ luôn". Biết cách quay lại bữa kế tiếp mới là kỹ năng quan trọng nhất.' },
  { icon: '📏', title: 'Đo để điều chỉnh, không để tự phán xét', body: 'Số liệu là bản đồ, không phải bản án. Dùng TDEE và macro để hiểu cơ thể — không để gây áp lực.' },
];

const MEAL_CHECK_QUESTIONS = [
  { icon: '🥩', q: 'Bữa này có đạm chưa?', color: '#84cc16', example: 'Thịt, cá, trứng, đậu hũ, sữa chua' },
  { icon: '🥬', q: 'Có rau hoặc canh chưa?', color: '#22c55e', example: 'Ít nhất 1–2 nắm rau luộc, xào hoặc canh' },
  { icon: '🍚', q: 'Tinh bột có vừa với mức vận động?', color: '#f97316', example: 'Ngày tập: thêm cơm. Ngày nghỉ: bớt cơm' },
  { icon: '🚫', q: 'Không quá nhiều chiên/ngọt/nước ngọt?', color: '#ef4444', example: 'Nếu có → cân bằng ở bữa tiếp theo' },
];

const FOOD_SWAP_TABLE = {
  protein: {
    label: 'Đạm', color: '#84cc16', icon: '🥩',
    items: [
      { main: 'Ức gà 150g', swap: 'Đùi gà 130g', protein: '~32g', kcal: '~165', note: 'Đùi có fat cao hơn một chút' },
      { main: 'Cá hồi 120g', swap: 'Cá thu 130g', protein: '~28g', kcal: '~180', note: 'Cá thu rẻ hơn 3–4 lần' },
      { main: '3 quả trứng', swap: 'Đậu hũ 200g', protein: '~18g', kcal: '~145', note: 'Đậu hũ ít fat, có xơ' },
      { main: 'Thịt bò nạc 120g', swap: 'Tôm 150g', protein: '~26g', kcal: '~130', note: 'Tôm ít calo hơn nhiều' },
      { main: 'Whey 1 muỗng', swap: 'Sữa chua Hy Lạp 200g', protein: '~22g', kcal: '~120', note: 'Có thêm men vi sinh' },
    ],
  },
  carb: {
    label: 'Tinh bột', color: '#f97316', icon: '🍚',
    items: [
      { main: 'Cơm trắng 150g', swap: 'Cơm gạo lứt 150g', protein: '4g', kcal: '~175', note: 'Nhiều xơ hơn 3 lần' },
      { main: 'Cơm trắng 150g', swap: 'Khoai lang 200g', protein: '3g', kcal: '~160', note: 'Chỉ số GI thấp hơn' },
      { main: 'Bún 150g', swap: 'Yến mạch 60g khô', protein: '8g', kcal: '~220', note: 'No lâu hơn nhiều' },
      { main: 'Bánh mì trắng 2 lát', swap: 'Bánh mì nguyên cám 2 lát', protein: '7g', kcal: '~160', note: 'Nhiều xơ và vi chất' },
      { main: 'Mì tôm 1 gói', swap: 'Phở bò ít bún thêm thịt', protein: '15g+', kcal: '~280', note: 'Nhiều đạm hơn đáng kể' },
    ],
  },
  veg: {
    label: 'Rau củ', color: '#22c55e', icon: '🥦',
    items: [
      { main: 'Bông cải xanh', swap: 'Súp lơ trắng / bắp cải', protein: '~3g', kcal: '~25', note: 'Đều giàu xơ như nhau' },
      { main: 'Rau muống', swap: 'Rau cải ngọt / rau lang', protein: '~2g', kcal: '~20', note: 'Rau Việt dễ kiếm, rẻ' },
      { main: 'Cà chua', swap: 'Ớt chuông / dưa leo', protein: '~1g', kcal: '~20', note: 'Giàu vitamin C' },
      { main: 'Đậu que', swap: 'Đậu bắp / bí zucchini', protein: '~2g', kcal: '~30', note: 'Chất xơ hòa tan tốt' },
      { main: 'Cà rốt', swap: 'Bí đỏ / su hào', protein: '~1g', kcal: '~35', note: 'Ngọt tự nhiên, ít GI' },
    ],
  },
};

const EATING_OUT_GUIDE = [
  {
    name: 'Cơm văn phòng / cơm bình dân',
    icon: '🍱', color: '#22c55e',
    rules: ['Chọn 1–2 món có đạm (cá kho, thịt luộc, trứng bác)', 'Xin thêm rau luộc hoặc canh thay vì thêm cơm', 'Giảm hoặc bỏ nước sốt mặn/ngọt'],
    avoid: 'Tránh combo thịt chiên + cơm nhiều + nước ngọt',
  },
  {
    name: 'Bún / Phở / Hủ tiếu',
    icon: '🍜', color: '#f97316',
    rules: ['Gọi "ít bún/phở" và nhiều thịt nạc', 'Thêm rau giá sống / rau thơm tự do', 'Gọi nước dùng trong thay vì loại đặc béo'],
    avoid: 'Không thêm sa tế/tương ngọt quá nhiều — natri và đường ẩn cao',
  },
  {
    name: 'Cơm tấm / Cơm sườn',
    icon: '🥩', color: '#06b6d4',
    rules: ['Chọn sườn nạc, bỏ qua bì chả nhiều fat', 'Xin thêm dưa leo/canh thay vì thêm trứng ốp', 'Ăn chậm — cơm tấm dễ ăn nhanh vì ngon'],
    avoid: 'Hạn chế mỡ hành và nước mắm ngọt — calo ẩn đáng kể',
  },
  {
    name: 'Gà rán / FastFood',
    icon: '🍗', color: '#eab308',
    rules: ['Gọi gà nướng thay gà rán (giảm 40% calo)', 'Thay khoai chiên bằng salad hoặc ngô luộc', 'Nước lọc hoặc trà không đường thay nước ngọt'],
    avoid: 'Combo burger lớn + khoai chiên + nước ngọt ≈ gần TDEE cả ngày',
  },
];

const OFF_PLAN_RULES = [
  { icon: '🚫', rule: 'Không bỏ bữa sau để "trả nợ"', reason: 'Nhịn bù làm đói dồn dập → ăn bù quá mức và cảm giác thất bại chồng chất.' },
  { icon: '🏋️', rule: 'Không tập phạt cơ thể sau khi ăn lỡ', reason: '"Tập để xóa calo" là tư duy sai — tập vì cơ thể cần, không phải để trừng phạt.' },
  { icon: '⏭️', rule: 'Không buông cả ngày còn lại vì lỡ 1 bữa', reason: 'Một bữa ăn sai không phá hỏng kết quả. Buông toàn ngày mới là điều thực sự phá kế hoạch.' },
];

const EATING_HABITS = [
  {
    icon: '🐌', title: 'Ăn Chậm — No Đúng Lúc',
    color: '#22c55e',
    tips: [
      'Ăn trong 15–20 phút — não cần 15 phút mới nhận được tín hiệu no từ dạ dày.',
      'Đặt đũa xuống sau mỗi vài miếng, không cầm liên tục.',
      'Dừng ở mức no 7/10 — không ăn đến khi căng bụng.',
    ],
    note: 'Nghiên cứu: ăn chậm giúp giảm tổng lượng calo trong bữa 10–15% không cần nỗ lực.',
  },
  {
    icon: '⏰', title: 'Ăn Đúng Giờ Tương Đối',
    color: '#06b6d4',
    tips: [
      'Không cần đúng giờ tuyệt đối, nhưng nên có nhịp: sáng 7–9h, trưa 11–13h, tối 17–19h.',
      'Khoảng cách bữa tốt nhất là 3–5 giờ — đủ tiêu hóa, không đói quá.',
      'Không bỏ bữa rồi ăn bù quá nhiều — mất ổn định đường huyết cả ngày.',
    ],
    note: 'Ăn đúng nhịp giúp duy trì insulin ổn định và giảm thèm ăn vặt buổi chiều.',
  },
  {
    icon: '🍬', title: 'Kiểm Soát Đồ Ngọt Thông Minh',
    color: '#f59e0b',
    tips: [
      'Không cấm tuyệt đối — cấm tạo cơn thèm dồn nén. Cho phép 1–2 lần/tuần.',
      'Ăn đồ ngọt sau bữa chính thay vì khi đói — insulin đã tăng sẵn, tác động nhỏ hơn.',
      'Giảm tần suất trước khi giảm lượng — bước nhỏ dễ duy trì hơn.',
    ],
    note: 'Mục tiêu thực tế: từ 7 lần/tuần → 3–4 lần → 1–2 lần/tuần trong 4–6 tuần.',
  },
];

const TRACKING_SECTIONS = [
  {
    id: 'daily',
    label: 'Checklist Hàng Ngày',
    badge: '7 mục tiêu',
    emoji: '✅',
    color: '#84cc16',
    orbitClass: 'bt-orbit-lime',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=70',
    desc: 'Theo dõi 7 thói quen dinh dưỡng mỗi ngày để xây nền tảng vững chắc',
  },
  {
    id: 'weekly',
    label: 'Theo Dõi Hàng Tuần',
    badge: '6 chỉ số',
    emoji: '📊',
    color: '#06b6d4',
    orbitClass: 'bt-orbit-cyan',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=70',
    desc: 'Đo lường 6 chỉ số quan trọng mỗi tuần để theo dõi tiến độ thực sự',
  },
  {
    id: 'adjust',
    label: 'Điều Chỉnh & Tối Ưu',
    badge: 'Không tiến bộ?',
    emoji: '⚡',
    color: '#f97316',
    orbitClass: 'bt-orbit-orange',
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&q=70',
    desc: 'Hướng dẫn điều chỉnh khi kết quả không như mong đợi sau 2–4 tuần',
  },
];

const TRACKING_WEEKLY_RICH = [
  { label: 'Cân nặng', sub: 'Buổi sáng, sau vệ sinh', icon: '⚖️', color: '#84cc16', tip: 'Biến động ±1kg/tuần là bình thường' },
  { label: 'Vòng eo', sub: 'Đo lúc đói', icon: '📏', color: '#06b6d4', tip: 'Giảm 0.5–1cm/tuần là tiến độ tốt' },
  { label: 'Mức năng lượng', sub: 'Thang điểm 1–10', icon: '⚡', color: '#f97316', tip: 'Dưới 5 liên tục → cần xem lại calo/ngủ' },
  { label: 'Giấc ngủ', sub: 'Chất lượng & thời gian', icon: '💤', color: '#a855f7', tip: '7–9h mỗi đêm là mục tiêu tối ưu' },
  { label: 'Hiệu suất tập', sub: 'So với tuần trước', icon: '🏋️', color: '#22c55e', tip: 'Tăng được 1 rep/set là tiến bộ rõ' },
  { label: 'Tâm trạng & Tiêu hóa', sub: 'Tổng quan hàng tuần', icon: '😊', color: '#eab308', tip: 'Tiêu hóa kém → kiểm tra chất xơ & nước' },
];

const ADJUST_STEPS = [
  { n: '01', color: '#f97316', text: 'Kiểm tra lại TDEE — cân nặng thay đổi thì nhu cầu calo cũng thay đổi theo' },
  { n: '02', color: '#eab308', text: 'Protein đủ chưa? Thử tăng lên 2g/kg và duy trì nhất quán 2 tuần' },
  { n: '03', color: '#a855f7', text: 'Ngủ đủ giấc chưa? 7–9h mỗi đêm — thiếu ngủ cản giảm mỡ và tăng cơ' },
  { n: '04', color: '#22c55e', text: 'Tập luyện đang tăng tải dần chưa? Progressive overload là chìa khóa' },
  { n: '05', color: '#06b6d4', text: 'Stress cao không? Cortisol cao kéo dài làm cơ thể giữ mỡ bụng cứng đầu' },
  { n: '06', color: '#84cc16', text: 'Kiên nhẫn: thay đổi thấy rõ cần 4–8 tuần — đừng đánh giá quá sớm' },
];

// ── B0: TDEE Calculator data ──
const ACTIVITY_LEVELS = [
  { key: 'sedentary',   label: 'Ít vận động',         mult: 1.2   },
  { key: 'light',       label: 'Nhẹ (1–3 ngày/tuần)', mult: 1.375 },
  { key: 'moderate',    label: 'Vừa (3–5 ngày/tuần)', mult: 1.55  },
  { key: 'active',      label: 'Nhiều (6–7 ngày)',     mult: 1.725 },
  { key: 'very_active', label: 'Rất nhiều / 2 buổi',  mult: 1.9   },
];
const GOAL_MODIFIERS = [
  { key: 'loss',   label: 'Giảm mỡ',  delta: -400, color: '#f97316', note: 'Thâm hụt 300–500 kcal' },
  { key: 'recomp', label: 'Duy trì',  delta:    0, color: '#84cc16', note: 'Ăn quanh TDEE ± 100'  },
  { key: 'gain',   label: 'Tăng cơ',  delta: +300, color: '#22c55e', note: 'Thặng dư 200–400 kcal' },
];
// Bidirectional mapping: goalKey (B0/B1) ↔ activeGoal id (B3)
const GOAL_KEY_TO_ID = { loss: 'fat-loss', gain: 'muscle-gain', recomp: 'maintenance' };
const GOAL_ID_TO_KEY = { 'fat-loss': 'loss', 'muscle-gain': 'gain', 'endurance': 'recomp', 'maintenance': 'recomp' };
const MEAL_SPLIT_RULES = [
  { n: '1', title: 'Không bỏ bữa sáng',      desc: 'Bữa sáng kích hoạt trao đổi chất và ổn định đường huyết cả ngày.' },
  { n: '2', title: 'Mỗi bữa có protein',      desc: 'Protein giúp no lâu, bảo vệ cơ và đốt thêm calo khi tiêu hóa.' },
  { n: '3', title: 'Ăn rau trước carb',        desc: 'Rau làm chậm hấp thu đường, giảm đỉnh insulin sau bữa ăn.' },
  { n: '4', title: 'Khoảng cách bữa hợp lý',  desc: 'Không nhịn quá 5 tiếng — tránh ăn bù quá nhiều ở bữa kế.' },
  { n: '5', title: 'Bữa tối dễ tiêu',          desc: 'Giảm tinh bột buổi tối nếu không tập, tăng rau và protein.' },
];

// ── B6: 7-Day Meal Plan data ──
const SEVEN_DAY_PLAN = [
  {
    day: 'Ngày 1', theme: 'Bắt đầu — Đủ bữa', color: '#84cc16',
    meals: [
      { time: 'Sáng',       items: ['Cháo yến mạch + sữa không đường', 'Trứng luộc ×2', 'Chuối nhỏ'], kcal: '~380', protein: '~20g' },
      { time: 'Phụ sáng',  items: ['Sữa chua không đường'], kcal: '~80',  protein: '~5g'  },
      { time: 'Trưa',       items: ['Cơm trắng', 'Cá kho tiêu', 'Rau cải luộc', 'Canh rau'], kcal: '~520', protein: '~30g' },
      { time: 'Phụ chiều', items: ['1 quả táo hoặc ổi'], kcal: '~70',  protein: '~1g'  },
      { time: 'Tối',        items: ['Ức gà luộc', 'Rau xào ít dầu', 'Khoai lang hấp'], kcal: '~420', protein: '~35g' },
    ],
    note: 'Đủ bữa, đủ đạm — không cần tính calo hôm nay.',
  },
  {
    day: 'Ngày 2', theme: 'Sáng no lâu', color: '#22c55e',
    meals: [
      { time: 'Sáng',       items: ['Yến mạch rolled oats + sữa', 'Chuối + hạt chia', 'Trứng ốp la ×1'], kcal: '~420', protein: '~22g' },
      { time: 'Phụ sáng',  items: ['Sữa đậu nành không đường'], kcal: '~90',  protein: '~6g'  },
      { time: 'Trưa',       items: ['Cơm trắng', 'Gà luộc sả', 'Canh bí đỏ', 'Rau sống'], kcal: '~500', protein: '~35g' },
      { time: 'Phụ chiều', items: ['Sữa chua + 1 quả cam'], kcal: '~120', protein: '~5g'  },
      { time: 'Tối',        items: ['Bún tươi ít', 'Đậu hũ sốt cà', 'Rau thơm + giá', 'Soup nhẹ'], kcal: '~360', protein: '~20g' },
    ],
    note: 'Yến mạch sáng giúp no tới tận trưa, hạn chế thèm đường buổi xế.',
  },
  {
    day: 'Ngày 3', theme: 'Ăn ngoài thông minh', color: '#06b6d4',
    meals: [
      { time: 'Sáng',         items: ['Bánh mì nguyên cám', 'Trứng ốp la', 'Cà chua + dưa leo', 'Sữa tươi'], kcal: '~420', protein: '~22g' },
      { time: 'Trưa (ngoài)', items: ['Phở bò nạc', 'Thêm rau/giá', 'Ít bánh phở'], kcal: '~480', protein: '~30g' },
      { time: 'Phụ chiều',   items: ['Hạt điều nhỏ + sữa chua'], kcal: '~130', protein: '~6g' },
      { time: 'Tối',          items: ['Cơm gạo lứt nhỏ', 'Cá hấp gừng', 'Canh rau ngót', 'Dưa leo'], kcal: '~380', protein: '~28g' },
    ],
    note: 'Ăn ngoài: chọn đạm + rau + tinh bột vừa. Không uống nước ngọt.',
  },
  {
    day: 'Ngày 4', theme: 'Ngày nhiều rau', color: '#10b981',
    meals: [
      { time: 'Sáng',       items: ['Sữa chua không đường', 'Yến mạch', 'Trái cây + hạt'], kcal: '~340', protein: '~18g' },
      { time: 'Phụ sáng',  items: ['Trứng luộc ×1'], kcal: '~80', protein: '~6g' },
      { time: 'Trưa',       items: ['Cơm vừa', 'Cá kho nhạt', 'Canh chua', 'Rau luộc ×2 phần'], kcal: '~490', protein: '~32g' },
      { time: 'Phụ chiều', items: ['Ổi / thanh long'], kcal: '~70', protein: '~1g' },
      { time: 'Tối',        items: ['Salad lớn: rau + trứng + gà', 'Khoai lang hoặc bắp'], kcal: '~380', protein: '~28g' },
    ],
    note: 'Ngày tăng chất xơ. Nếu đói tối, thêm đạm — không thêm bánh kẹo.',
  },
  {
    day: 'Ngày 5', theme: 'Ngày tập luyện', color: '#f97316',
    meals: [
      { time: 'Sáng',       items: ['Cơm nhỏ / bánh mì nguyên cám', 'Trứng + rau'], kcal: '~380', protein: '~20g' },
      { time: 'Trước tập',  items: ['1 quả chuối hoặc khoai nhỏ'], kcal: '~90', protein: '~1g' },
      { time: 'Trưa',       items: ['Cơm + gà/cá/thịt nạc', 'Rau xào ít dầu', 'Canh'], kcal: '~520', protein: '~35g' },
      { time: 'Phụ chiều', items: ['Sữa chua + trái cây'], kcal: '~130', protein: '~5g' },
      { time: 'Tối',        items: ['Tôm / cá / gà', 'Nhiều rau', 'Cơm/khoai vừa'], kcal: '~440', protein: '~32g' },
    ],
    note: 'Ngày tập: không nhịn tinh bột. Carb đúng lúc cho năng lượng tập tốt hơn.',
  },
  {
    day: 'Ngày 6', theme: 'Meal prep cuối tuần', color: '#a855f7',
    meals: [
      { time: 'Sáng',       items: ['Bún/phở gà nạc', 'Thêm rau giá', 'Không uống hết nước béo'], kcal: '~420', protein: '~28g' },
      { time: 'Phụ sáng',  items: ['Trái cây'], kcal: '~70', protein: '~1g' },
      { time: 'Trưa',       items: ['Cơm nhà: thịt/cá/đậu hũ', '2 loại rau', 'Canh'], kcal: '~500', protein: '~30g' },
      { time: 'Phụ chiều', items: ['Hạt + sữa chua hoặc sữa'], kcal: '~130', protein: '~6g' },
      { time: 'Tối',        items: ['Lẩu rau/nấm/đậu hũ/thịt nạc', 'Hạn chế viên thả lẩu'], kcal: '~400', protein: '~28g' },
    ],
    note: 'Chuẩn bị trước cho 2–3 ngày: trứng luộc, gà áp chảo, khoai hấp, cơm sẵn.',
  },
  {
    day: 'Ngày 7', theme: 'Recovery — dễ tiêu', color: '#eab308',
    meals: [
      { time: 'Sáng',       items: ['Cháo yến mạch / cháo cá', 'Rau thơm'], kcal: '~300', protein: '~15g' },
      { time: 'Phụ sáng',  items: ['1 quả trái cây'], kcal: '~70', protein: '~1g' },
      { time: 'Trưa',       items: ['Cơm', 'Cá/đậu hũ', 'Canh rau', 'Rau luộc'], kcal: '~460', protein: '~28g' },
      { time: 'Phụ chiều', items: ['Sữa chua không đường'], kcal: '~80', protein: '~5g' },
      { time: 'Tối',        items: ['Trứng/đậu hũ/cá', 'Nhiều rau', 'Ít cơm/khoai'], kcal: '~350', protein: '~22g' },
    ],
    note: 'Ngày hồi phục: dễ tiêu, ngủ tốt, chuẩn bị tuần mới. Không ăn quá ít.',
  },
];
const SHOPPING_GROUPS = [
  { name: 'Đạm', color: '#84cc16', tip: '~220.000₫',
    items: ['Trứng 10–14 quả (~1 vỉ)', 'Ức gà / đùi gà bỏ da (400–500g)', 'Cá basa / cá thu / cá hồi (400g)', 'Thịt nạc heo hoặc bò (300g)', 'Tôm tươi (200g, tùy chọn)', 'Đậu hũ 2 miếng', 'Sữa chua không đường 4 hũ (400g)', 'Sữa tươi không đường (500ml)'] },
  { name: 'Tinh bột', color: '#f97316', tip: '~80.000₫',
    items: ['Gạo trắng / gạo lứt (1kg)', 'Khoai lang 4–6 củ (~600g)', 'Yến mạch rolled oats (250g)', 'Bánh mì nguyên cám 1 ổ', 'Bún / phở / miến (khi cần)'] },
  { name: 'Rau', color: '#22c55e', tip: '~60.000₫',
    items: ['Cải xanh, cải thìa, rau muống (3 bó)', 'Dưa leo 4 quả, cà chua 5–6 quả', 'Bí đỏ 1 quả nhỏ, cà rốt 2–3 củ', 'Nấm các loại (200g)', 'Rau thơm, hành lá, giá đỗ'] },
  { name: 'Trái cây', color: '#06b6d4', tip: '~60.000₫',
    items: ['Chuối 1 nải (~8 quả)', 'Táo 4–5 quả', 'Cam / quýt 4–5 quả', 'Ổi 3–4 quả', 'Thanh long / đu đủ (1 quả nhỏ)'] },
  { name: 'Chất béo tốt', color: '#eab308', tip: '~70.000₫',
    items: ['Hạt điều / hạnh nhân (100g)', 'Dầu olive hoặc dầu nành (250ml, dùng 3–4 tuần)', 'Bơ đậu phộng ít đường (1 hũ nhỏ)', 'Mè / vừng (50g)'] },
];
const MEAL_PREP_STEPS = [
  { icon: '🥚', text: 'Luộc 6–8 quả trứng để sẵn trong tủ', color: '#84cc16', tip: 'Để nguyên vỏ — bảo quản được 1 tuần trong tủ lạnh.' },
  { icon: '🍠', text: 'Hấp 4–6 củ khoai lang nhỏ', color: '#f97316', tip: 'Hộp kín — để được 4–5 ngày. Ăn nóng hoặc nguội đều ổn.' },
  { icon: '🍗', text: 'Áp chảo / nướng 3–4 phần gà hoặc cá', color: '#22c55e', tip: 'Ướp trước 30 phút — chia sẵn ~150g/hộp, bảo quản 3–4 ngày.' },
  { icon: '🥦', text: 'Rửa, cắt sẵn rau sống đựng trong hộp', color: '#10b981', tip: 'Giấy bếp lót đáy hộp hút ẩm — rau tươi 3–4 ngày.' },
  { icon: '🍚', text: 'Nấu sẵn 2–3 phần cơm đựng hộp kín', color: '#06b6d4', tip: 'Để nguội hoàn toàn trước khi đậy nắp — không bị ướt hơi.' },
  { icon: '🫙', text: 'Chuẩn bị 3 hộp snack: trái cây + sữa chua + hạt', color: '#a855f7', tip: 'Chia sẵn 3 hộp cho T2–T4 = không đói khi ra ngoài.' },
];

// ── B7: Advanced Performance data ──
const TRAINING_DAY_TYPES = [
  {
    type: 'Rất nặng', sub: 'Double/Triple Training',
    color: '#ef4444', bg: '#ef444410', border: '#ef444430',
    kcal: '3.000–3.300', protein: '150–170g', carb: '380–460g', fat: '80–100g', water: '3–4.5L',
    desc: 'Sáng đạp xe / chạy interval — chiều gym — tối bơi kỹ thuật.',
  },
  {
    type: 'Nặng vừa', sub: 'Strength + Cardio',
    color: '#f97316', bg: '#f9731610', border: '#f9731630',
    kcal: '2.700–3.000', protein: '150–165g', carb: '320–400g', fat: '75–95g', water: '2.5–3.5L',
    desc: 'Sáng gym lower / full body — chiều bơi 45–60ph hoặc chạy nhẹ 40ph.',
  },
  {
    type: 'Sức bền dài', sub: 'Long Ride / Long Run',
    color: '#eab308', bg: '#eab30810', border: '#eab30830',
    kcal: '3.000–3.500', protein: '140–160g', carb: '430–550g', fat: '70–95g', water: '3.5–5L',
    desc: 'Đạp xe 2–4 giờ / Chạy dài 75–120ph. Nạp 30–60g carb/giờ trong buổi.',
  },
  {
    type: 'Hồi phục', sub: 'Recovery Day',
    color: '#22c55e', bg: '#22c55e10', border: '#22c55e30',
    kcal: '2.300–2.600', protein: '150–165g', carb: '220–300g', fat: '80–95g', water: '2–3L',
    desc: 'Đi bộ / Đạp Zone 1–2 / Bơi thả lỏng / Mobility. Không cắt protein.',
  },
];
const TIMING_SCHEDULE = [
  { time: '05:30',       label: 'Trước đạp/chạy',   foods: 'Chuối + cà phê / sữa + nước', color: '#f97316' },
  { time: '06:00–07:30', label: 'Trong buổi tập',    foods: 'Nước + điện giải + carb nếu >60 phút', color: '#eab308' },
  { time: '08:00',       label: 'Sau buổi sáng',     foods: 'Cơm/yến mạch/bánh mì + trứng / sữa / gà', color: '#22c55e' },
  { time: '12:00',       label: 'Bữa trưa',          foods: 'Cơm/khoai + thịt/cá/đậu + rau + canh', color: '#84cc16' },
  { time: '15:30',       label: 'Trước gym/bơi',     foods: 'Sữa chua + trái cây hoặc bánh mì + trứng', color: '#06b6d4' },
  { time: '18:30',       label: 'Sau tập chiều',      foods: 'Bữa tối đủ carb + protein nạc + rau', color: '#8b5cf6' },
  { time: '21:30',       label: 'Trước ngủ',          foods: 'Sữa chua Hy Lạp / sữa / đậu hũ non nếu cần', color: '#a855f7' },
];
const ATHLETE_PRINCIPLES = [
  { icon: '⚡', title: 'Periodized Nutrition',   desc: 'Ngày tập nặng ăn nhiều hơn, ngày nhẹ ăn vừa, ngày nghỉ vẫn đủ protein & vi chất.' },
  { icon: '💪', title: 'Protein không cắt',      desc: 'Ngày recovery vẫn phải đủ protein 1.8–2.2g/kg — cơ phục hồi và xây dựng khi nghỉ.' },
  { icon: '🔋', title: 'Carb là nhiên liệu',     desc: 'Sợ carb → tập hụt hơi, pace giảm, gym không tăng lực, dễ thèm ngọt tối.' },
  { icon: '💧', title: 'Điện giải quan trọng',   desc: 'Mồ hôi nhiều → bổ sung natri + kali + magie, không chỉ uống nước lọc.' },
  { icon: '😴', title: 'Ngủ = thuốc phục hồi',  desc: '7–9h mỗi đêm. Thiếu ngủ cản phục hồi cơ, tăng cortisol, giảm hiệu suất tập.' },
];

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function RevealBlock({ children, delay = 0, className = '' }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Teaser Section Divider ───────────────────────────────────────────────────

function TeaserSection({ label, count }) {
  return (
    <div className="flex items-center gap-4 mb-6 mt-10">
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.07))' }} />
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600 whitespace-nowrap">{label}</span>
      {count && <span className="text-[9px] font-bold text-gray-700 bg-white/5 px-2 py-0.5 rounded-full">{count}</span>}
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.07))' }} />
    </div>
  );
}

// ─── Elegant Teaser Card ──────────────────────────────────────────────────────

function TeaserCard({ to, color, rgb, icon, category, title, accent, desc, features, stats, image, imageAlt, cta }) {
  return (
    <RevealBlock className="mb-7">
      <Link
        to={to}
        className="group block relative rounded-3xl overflow-hidden border transition-all duration-500 hover:-translate-y-0.5"
        style={{ borderColor: `rgba(${rgb},0.18)`, background: 'rgba(10,10,10,0.95)' }}
      >
        {/* Desktop image panel — right 42% */}
        <div className="hidden md:block absolute inset-y-0 right-0 w-[42%] overflow-hidden pointer-events-none">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ opacity: 0.3 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(10,10,10,1) 0%, rgba(10,10,10,0.55) 38%, rgba(10,10,10,0.1) 100%)' }}
          />
        </div>

        {/* Mobile image banner */}
        <div className="md:hidden relative h-28 overflow-hidden">
          <img src={image} alt={imageAlt} className="w-full h-full object-cover" style={{ opacity: 0.22 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.97) 100%)' }} />
        </div>

        {/* Content area */}
        <div className="relative md:w-[60%] px-7 py-8 md:px-10 md:py-10">
          {/* Category chip */}
          <div className="mb-5">
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full"
              style={{ color, background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.22)` }}
            >
              {icon} {category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-black text-white leading-snug mb-3">
            {title}{accent && <> <span style={{ color }}>{accent}</span></>}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-lg">{desc}</p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mb-7">
            {features.map((f, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ color, background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.14)` }}
              >
                {f.icon} {f.text}
              </span>
            ))}
          </div>

          {/* CTA + Stats row */}
          <div className="flex items-center gap-7 flex-wrap">
            <span
              className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300 group-hover:gap-3 shrink-0"
              style={{ color, background: `rgba(${rgb},0.12)`, border: `1px solid rgba(${rgb},0.28)` }}
            >
              {cta} <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </span>
            <div className="flex gap-6">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl md:text-2xl font-black leading-none" style={{ color }}>{s.value}</div>
                  <div className="text-[9px] text-gray-600 uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hover glow ring */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ boxShadow: `inset 0 0 0 1px rgba(${rgb},0.38), 0 4px 40px rgba(${rgb},0.06)` }}
        />
      </Link>
    </RevealBlock>
  );
}

// ─── Animated Hero Counter ────────────────────────────────────────────────────

function HeroCounter({ n, suffix, label }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const t0 = performance.now();
    const delay = setTimeout(() => {
      const tick = (now) => {
        const p = Math.min((now - t0) / 1000, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * n));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, 500);
    return () => { clearTimeout(delay); cancelAnimationFrame(raf); };
  }, [n]);

  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl md:text-4xl font-black text-lime-400 leading-none">
        {val}{suffix}
      </span>
      <span className="text-[10px] text-muted mt-1 uppercase tracking-widest font-medium">{label}</span>
    </div>
  );
}

// ─── AnimatedVal — smooth counter on value change ─────────────────────────────
function AnimatedVal({ value, duration = 520, suffix = '', prefix = '' }) {
  const [disp, setDisp] = useState(value);
  const fromRef = useRef(value);
  const rafRef  = useRef(null);
  useEffect(() => {
    const from = fromRef.current;
    const to   = value;
    if (from === to) return;
    cancelAnimationFrame(rafRef.current);
    let startTs = null;
    const tick = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setDisp(Math.round(from + (to - from) * e));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);
  return <>{prefix}{disp.toLocaleString()}{suffix}</>;
}

// ─── MacroRatioBar — animated stacked P:C:F bar ───────────────────────────────
function MacroRatioBar({ pW, cW, fW }) {
  const [ws, setWs] = useState([0, 0, 0]);
  useEffect(() => {
    const t = setTimeout(() => setWs([pW, cW, fW]), 60);
    return () => clearTimeout(t);
  }, [pW, cW, fW]);
  const segs = [
    { key: 'P', label: 'Protein', color: '#84cc16', target: pW, w: ws[0] },
    { key: 'C', label: 'Carb',    color: '#f97316', target: cW, w: ws[1] },
    { key: 'F', label: 'Fat',     color: '#eab308', target: fW, w: ws[2] },
  ];
  return (
    <div>
      <div className="h-4 rounded-full overflow-hidden flex gap-[2px] bg-white/4">
        {segs.map((s, i) => (
          <div key={s.key}
            className={`h-full ${i === 0 ? 'rounded-l-full' : ''} ${i === 2 ? 'rounded-r-full' : ''}`}
            style={{ width: `${s.w}%`, background: s.color, transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
        ))}
      </div>
      <div className="flex items-center mt-2 gap-3">
        {segs.map(s => (
          <div key={s.key} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-[9px] font-bold" style={{ color: `${s.color}90` }}>{s.label} {s.target}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── InteractiveMacroCard ─────────────────────────────────────────────────────
const MACRO_QUICK_FACTS = {
  'Protein':      { icon: '💪', tip: 'Phân bổ đều 4–5 bữa, tối thiểu 20g/bữa để kích hoạt tổng hợp cơ (MPS).' },
  'Carbohydrate': { icon: '⚡', tip: 'Ăn nhiều carb trước & sau tập. Gạo lứt, khoai lang, yến mạch là tốt nhất.' },
  'Chất béo':     { icon: '🟡', tip: 'Omega-3 từ cá hồi, cá thu 2–3 lần/tuần. Fat giúp hấp thu vitamin tan trong dầu.' },
  'Chất xơ':      { icon: '🌿', tip: 'Tăng dần từ 15g → 38g để tránh đầy bụng. Kết hợp uống đủ nước.' },
  'Nước':         { icon: '💧', tip: 'Uống 1 ly (250ml) trước mỗi bữa. Nước lọc tốt nhất; trà xanh không đường.' },
};
function InteractiveMacroCard({ macro, delay = 0, highlighted = false, expanded = false, onToggle }) {
  const { t: tPillars } = useTranslation('pillars');
  const b1tr = tPillars('pillarB.b1', { returnObjects: true }) || {};
  const [width, setWidth] = useState(0);
  const [ref, visible] = useScrollReveal(0.15);
  const fact = MACRO_QUICK_FACTS[macro.name] ?? { icon: '•', tip: '' };
  const displayName = macro.displayName || macro.name;
  const displayRole = macro.displayRole || macro.role;
  const displayDose = macro.displayDose || macro.dose;

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setWidth(macro.pct), delay + 80);
    return () => clearTimeout(t);
  }, [visible, delay]);

  useEffect(() => {
    setWidth(0);
    const t = setTimeout(() => setWidth(macro.pct), 100);
    return () => clearTimeout(t);
  }, [macro.pct]);

  return (
    <div
      ref={ref}
      className={`rounded-2xl border ${highlighted || expanded ? '' : `${macro.border} ${macro.cardBg}`} p-5 transition-all duration-300 cursor-pointer select-none hover:scale-[1.015]`}
      style={{
        borderColor: highlighted ? `${macro.color}65` : expanded ? `${macro.color}40` : undefined,
        background: highlighted ? `${macro.color}12` : expanded ? `${macro.color}08` : undefined,
        boxShadow: highlighted
          ? `0 0 28px ${macro.color}35, 0 4px 20px ${macro.color}15`
          : expanded ? `0 0 16px ${macro.color}18` : undefined,
      }}
      onClick={onToggle}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${macro.text} ${macro.border}`}
            style={{ background: `${macro.color}${highlighted ? '20' : '10'}` }}>
            {macro.icon}
          </div>
          <div>
            <p className={`text-sm font-bold ${macro.text}`}>{displayName}</p>
            <p className="text-[10px] text-muted leading-none mt-0.5">{displayDose}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-base font-black ${macro.text} leading-none`}>
            <AnimatedVal value={macro.gram ?? macro.pct} /><span className="text-[10px] font-normal ml-0.5">{macro.gramUnit ?? '%'}</span>
          </p>
          <p className="text-[8px] text-muted mt-0.5">{b1tr.per_day || '/ngày'} · {expanded ? `▲ ${b1tr.hide || 'ẩn'}` : `▼ ${b1tr.show || 'xem'}`}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
        <div className={`h-full rounded-full ${macro.bg}`}
          style={{ width: `${width}%`, transition: `width 0.9s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms` }} />
      </div>

      {/* Role */}
      <p className="text-[11px] text-muted mb-3 leading-relaxed">{displayRole}</p>

      {/* Sources */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {(macro.displaySources || macro.sources).map(src => (
          <span key={src} className={`text-[10px] px-2 py-0.5 rounded-full border ${macro.border} ${macro.text}`}
            style={{ background: `${macro.color}06` }}>{src}</span>
        ))}
      </div>

      {/* Expanded insight */}
      {expanded && (
        <div className="border-t pt-3 mt-1 animate-fade-in-up" style={{ borderColor: `${macro.color}20` }}>
          <div className="flex items-start gap-2">
            <span className="text-base shrink-0">{fact.icon}</span>
            <p className="text-[11px] leading-relaxed" style={{ color: `${macro.color}cc` }}>{fact.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Macro Bar (animates on mount) ───────────────────────────────────────────

function MacroBar({ macro, delay = 0, highlighted = false }) {
  const [width, setWidth] = useState(0);
  const [ref, visible] = useScrollReveal(0.2);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setWidth(macro.pct), delay + 80);
    return () => clearTimeout(t);
  }, [visible, macro.pct, delay]);

  // Re-animate bar when pct changes (e.g. metric selected recalculates)
  useEffect(() => {
    setWidth(0);
    const t = setTimeout(() => setWidth(macro.pct), 120);
    return () => clearTimeout(t);
  }, [macro.pct]);

  return (
    <div
      ref={ref}
      className={`rounded-2xl border ${highlighted ? '' : `${macro.border} ${macro.cardBg}`} p-5 transition-all duration-300 hover:scale-[1.02] cursor-default`}
      style={{
        borderColor: highlighted ? `${macro.color}60` : undefined,
        background: highlighted ? `${macro.color}10` : undefined,
        boxShadow: highlighted
          ? `0 0 24px ${macro.color}30, 0 4px 20px ${macro.color}12`
          : visible ? `0 4px 20px ${macro.color}08` : 'none',
        transition: 'box-shadow 0.4s, border-color 0.3s, background 0.3s',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${macro.text} ${macro.border}`}
            style={{ background: `${macro.color}${highlighted ? '20' : '10'}` }}
          >
            {macro.icon}
          </div>
          <div>
            <p className={`text-sm font-bold ${macro.text}`}>{displayName}</p>
            <p className="text-[10px] text-muted">{displayDose}</p>
          </div>
        </div>
        <span className={`text-xs font-black ${macro.text}`}>{macro.pct}%</span>
      </div>

      {/* Bar */}
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full ${macro.bg}`}
          style={{ width: `${width}%`, transition: `width 0.9s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms` }}
        />
      </div>

      <p className="text-[11px] text-muted mb-3 leading-relaxed">{displayRole}</p>

      <div className="flex flex-wrap gap-1.5">
        {macro.sources.map(s => (
          <span
            key={s}
            className={`text-[10px] px-2 py-0.5 rounded-full border ${macro.border} ${macro.text}`}
            style={{ background: `${macro.color}06` }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Plate Diagram (CSS-only) ─────────────────────────────────────────────────

function PlateDiagram({ animate }) {
  const { t: tPillars } = useTranslation('pillars');
  const pillarB = tPillars('pillarB', { returnObjects: true }) || {};
  const b2tr = pillarB.b2 || {};
  const [bars, setBars] = useState(PLATE_SECTIONS.map(() => 0));

  useEffect(() => {
    if (!animate) return;
    PLATE_SECTIONS.forEach((s, i) => {
      setTimeout(() => {
        setBars(prev => {
          const next = [...prev];
          next[i] = s.pct;
          return next;
        });
      }, i * 200 + 100);
    });
  }, [animate]);

  return (
    <div className="flex flex-col gap-4">
      {/* Visual plate */}
      <div className="relative mx-auto" style={{ width: 220, height: 220 }}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-white/8" />
        <div className="absolute inset-[8px] rounded-full overflow-hidden">
          {/* Half-plate (rau) */}
          <div
            className="absolute inset-0"
            style={{
              background: `conic-gradient(
                #22c55e 0deg 180deg,
                #84cc16 180deg 270deg,
                #f97316 270deg 360deg
              )`,
              borderRadius: '50%',
              opacity: animate ? 1 : 0,
              transition: 'opacity 0.8s ease 0.2s',
            }}
          />
          {/* Divider lines */}
          <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(transparent 0deg 179.5deg, rgba(10,10,10,0.9) 179.5deg 180.5deg, transparent 180.5deg 269.5deg, rgba(10,10,10,0.9) 269.5deg 270.5deg, transparent 270.5deg)' }} />
          {/* Center circle */}
          <div className="absolute inset-[30%] rounded-full bg-bg/60 backdrop-blur-sm border border-white/8 flex items-center justify-center">
            <div className="text-center">
              <p className="text-[8px] font-bold text-white/60 leading-tight">{b2tr.plate_center_1 || 'ĐĨA'}</p>
              <p className="text-[8px] font-bold text-white/60 leading-tight">{b2tr.plate_center_2 || 'ĂN'}</p>
            </div>
          </div>
        </div>

        {/* Labels outside */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-1">
          <span className="text-[9px] font-bold text-green-400 bg-bg/80 px-1.5 py-0.5 rounded whitespace-nowrap">{b2tr.plate_label_veg || '½ Rau'}</span>
        </div>
        <div className="absolute bottom-[22%] right-[-8px]">
          <span className="text-[9px] font-bold text-lime-400 bg-bg/80 px-1.5 py-0.5 rounded whitespace-nowrap">{b2tr.plate_label_protein || '¼ Đạm'}</span>
        </div>
        <div className="absolute bottom-[22%] left-[-20px]">
          <span className="text-[9px] font-bold text-orange-400 bg-bg/80 px-1.5 py-0.5 rounded whitespace-nowrap">{b2tr.plate_label_carb || '¼ Tinh bột'}</span>
        </div>
      </div>

      {/* Bar breakdown */}
      <div className="space-y-3 mt-2">
        {PLATE_SECTIONS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${s.bg} shrink-0`} />
            <span className={`text-xs font-semibold ${s.text} w-28 shrink-0`}>{tPillars(`pillarB.plate_sections.${i}.label`, { defaultValue: s.label })}</span>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${s.bg}`}
                style={{ width: `${bars[i]}%`, transition: `width 0.9s cubic-bezier(0.34,1.56,0.64,1) ${i * 180}ms` }}
              />
            </div>
            <span className={`text-[10px] font-bold ${s.text} w-8 text-right shrink-0`}>{s.pct}%</span>
          </div>
        ))}
      </div>

      {/* Fat note */}
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 mt-1">
        <p className="text-[11px] text-yellow-300/80 leading-relaxed">
          <span className="font-bold text-yellow-400">{b2tr.fat_label || '+ Chất béo tốt:'}</span>{' '}{b2tr.fat_desc || 'Thêm một ít dầu olive, bơ, hay hạt — hấp thu vitamin tan trong dầu tốt hơn.'}
        </p>
      </div>
    </div>
  );
}

// ─── Goal Card ────────────────────────────────────────────────────────────────

function GoalCard({ goal, active, onClick }) {
  const { t: tPillars } = useTranslation('pillars');
  const b3tr = tPillars('pillarB.b3', { returnObjects: true }) || {};
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-left rounded-2xl border p-5 transition-all duration-300 focus:outline-none w-full
        ${active
          ? `${goal.border} ${goal.bg}`
          : 'border-border/40 bg-surface/20 hover:border-border/70 hover:bg-surface/35 hover:-translate-y-0.5'
        }`}
      style={active ? { boxShadow: `0 4px 28px ${goal.glow}` } : undefined}
    >
      {active && (
        <div className="absolute top-0 left-4 right-4 h-[1.5px] rounded-full" style={{ background: goal.color }} />
      )}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${goal.text} ${goal.border}`}
          style={{ background: `${goal.color}12` }}
        >
          {goal.icon}
        </div>
        <div>
          <p className={`text-sm font-bold ${active ? goal.text : 'text-text'}`}>{goal.label}</p>
          <p className="text-[10px] text-muted">{goal.kcal}</p>
        </div>
        {active && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: goal.color }} />
        )}
      </div>

      {active && (
        <div className="animate-fade-in-up">
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            {[
              { k: b3tr.col_calo || 'Calo', v: goal.kcal },
              { k: 'Protein', v: goal.protein },
              { k: 'Carb', v: goal.carb },
            ].map(item => (
              <div key={item.k} className={`rounded-lg p-2 border ${goal.border}`} style={{ background: `${goal.color}08` }}>
                <p className={`text-[9px] font-bold ${goal.text} mb-0.5`}>{item.k}</p>
                <p className="text-[10px] text-muted leading-tight">{item.v}</p>
              </div>
            ))}
          </div>
          <ul className="space-y-2">
            {goal.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                <span className="shrink-0 mt-0.5 font-bold" style={{ color: goal.color }}>✓</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </button>
  );
}

// ─── PersonalizedBar ─────────────────────────────────────────────────────────

function PersonalizedBar({ items, color = '#84cc16', label = 'Dựa trên thông số của bạn', source, panelId = 'p', selectedKey, onSelect }) {
  return (
    <div className="rounded-xl border mb-6 px-4 py-3.5" style={{ borderColor: `${color}22`, background: `${color}07` }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: `${color}80` }}>{label}</p>
        {source && <p className="text-[9px] text-muted/40 font-medium">← Tính từ {source}</p>}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-3">
        {items.map((item, i) => {
          const isSelected = selectedKey && item.key && selectedKey === item.key;
          const clickable = onSelect && item.key;
          return (
            <div
              key={item.label}
              className="group/pbitem relative"
              onClick={clickable ? () => onSelect(isSelected ? null : item.key) : undefined}
            >
              {item.tip && !clickable && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 pointer-events-none opacity-0 group-hover/pbitem:opacity-100 scale-90 group-hover/pbitem:scale-100 translate-y-1 group-hover/pbitem:translate-y-0 transition-all duration-200 origin-top">
                  <ThoughtBubble text={item.tip} idx={`${panelId}pb${i}`} color={color} />
                </div>
              )}
              <div
                className={`flex items-start gap-1.5 rounded-lg px-2 py-1.5 transition-all duration-200 ${
                  clickable ? 'cursor-pointer' : item.tip ? 'cursor-help' : ''
                } ${isSelected ? 'ring-1' : clickable ? 'hover:bg-white/5' : ''}`}
                style={isSelected ? { background: `${color}18`, ringColor: color, outline: `1px solid ${color}50` } : undefined}
              >
                <div>
                  <p className="text-[15px] font-black leading-none" style={{ color: isSelected ? color : color }}>{item.value}</p>
                  {item.note && <p className="text-[9px] leading-none mt-0.5" style={{ color: `${color}70` }}>{item.note}</p>}
                </div>
                <div>
                  <p className="text-[10px] text-muted/80 leading-none pt-0.5">{item.label}</p>
                  {clickable && <p className="text-[8px] leading-none mt-0.5" style={{ color: `${color}50` }}>{isSelected ? '▲ ẩn' : '▼ chi tiết'}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MetricDetailCard ─────────────────────────────────────────────────────────

function MetricDetailCard({ detail, color, onClose }) {
  if (!detail) return null;
  const { title, value, note, params = [], analysis, evaluation, suggestions = [], pros = [], cons = [] } = detail;
  return (
    <div className="rounded-2xl border mb-6 overflow-hidden animate-fade-in-up" style={{ borderColor: `${color}30`, background: `${color}05` }}>
      <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${color}90, ${color}20, transparent)` }} />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: `${color}80` }}>Chi Tiết Chỉ Số</p>
            <p className="text-lg font-black" style={{ color }}>{value}</p>
            <p className="text-sm font-bold text-text">{title}</p>
            {note && <p className="text-[10px] text-muted mt-0.5">{note}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-border/40 text-muted hover:text-text hover:border-border flex items-center justify-center text-sm transition-all duration-150 shrink-0 cursor-pointer"
          >✕</button>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Left: Params + Analysis */}
          <div className="space-y-4">
            {params.length > 0 && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted mb-3">Thông Số</p>
                <div className="space-y-2.5">
                  {params.map((p, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-muted">{p.label}</span>
                        <span className="text-[11px] font-bold" style={{ color: p.color || color }}>{p.value}</span>
                      </div>
                      {p.pct != null && (
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, p.pct)}%`, background: p.color || color, opacity: 0.7 }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted mb-2">Phân Tích</p>
                <p className="text-[11px] text-muted leading-relaxed">{analysis}</p>
              </div>
            )}
          </div>

          {/* Right: Evaluation + Suggestions + Pros/Cons */}
          <div className="space-y-4">
            {evaluation && (
              <div className="rounded-xl p-3 border" style={{ borderColor: `${evaluation.color}30`, background: `${evaluation.color}08` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base">{evaluation.icon}</span>
                  <span className="text-xs font-bold" style={{ color: evaluation.color }}>{evaluation.label}</span>
                </div>
                <p className="text-[10px] text-muted leading-relaxed">{evaluation.text}</p>
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted mb-2">Gợi Ý</p>
                <ul className="space-y-1.5">
                  {suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-[10px] text-muted">
                      <span className="shrink-0 font-bold mt-0.5" style={{ color }}>→</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(pros.length > 0 || cons.length > 0) && (
              <div className="grid grid-cols-2 gap-3">
                {pros.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-green-400/60 mb-2">Ưu Điểm</p>
                    <ul className="space-y-1">
                      {pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[10px] text-muted">
                          <span className="text-green-400 shrink-0 font-bold mt-0.5">+</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {cons.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-red-400/60 mb-2">Hạn Chế</p>
                    <ul className="space-y-1">
                      {cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[10px] text-muted">
                          <span className="text-red-400 shrink-0 font-bold mt-0.5">−</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab Panels ──────────────────────────────────────────────────────────────

function b1MetricDetail(key, s) {
  const map = {
    tdee: {
      title: 'TDEE — Tổng Calo Tiêu Thụ Ngày', value: `${s.tdee.toLocaleString()} kcal`, note: 'duy trì cân nặng',
      params: [
        { label: 'BMR (nghỉ ngơi hoàn toàn)', value: `${s.bmr.toLocaleString()} kcal`, pct: Math.round(s.bmr/s.tdee*100) },
        { label: `Hoạt động (×${s.activity.mult})`, value: `+${(s.tdee - s.bmr).toLocaleString()} kcal`, pct: Math.round((s.tdee - s.bmr)/s.tdee*100) },
        { label: 'TEF (tiêu hóa ~10%)', value: `~${Math.round(s.tdee*0.1)} kcal`, pct: 10 },
      ],
      analysis: `BMR của bạn là ${s.bmr.toLocaleString()} kcal — đây là năng lượng tối thiểu để duy trì sự sống. Nhân với hệ số hoạt động ${s.activity.mult} (${s.activity.label}) ra TDEE = ${s.tdee.toLocaleString()} kcal/ngày. Ăn bằng con số này giữ nguyên cân nặng.`,
      evaluation: { icon: '📊', label: 'Điểm tham chiếu', color: '#84cc16', text: `TDEE có sai số ±10–15%. Dùng làm điểm xuất phát, theo dõi cân 2 tuần để xác nhận con số thực tế.` },
      suggestions: [`Ăn ${s.tdee.toLocaleString()} kcal để giữ cân`, 'Theo dõi cân nặng buổi sáng mỗi tuần', 'Tính lại TDEE sau mỗi 4–5kg thay đổi'],
      pros: ['Nền tảng khoa học của mọi kế hoạch', 'Cá nhân hóa theo thể trạng của bạn'],
      cons: ['Sai số ±15% do không đo tỷ lệ cơ/mỡ', 'Thay đổi theo tuổi và cân nặng'],
    },
    target: {
      title: `Mục Tiêu Calo — ${s.goal.label}`, value: `${s.targetKcal.toLocaleString()} kcal`, note: s.goal.label,
      params: [
        { label: 'TDEE nền', value: `${s.tdee.toLocaleString()} kcal`, pct: 100 },
        { label: `Điều chỉnh (${s.goal.label})`, value: `${s.goal.delta >= 0 ? '+' : ''}${s.goal.delta} kcal`, pct: Math.round(Math.abs(s.goal.delta)/s.tdee*100), color: s.goal.color },
        { label: 'Mục tiêu cuối', value: `${s.targetKcal.toLocaleString()} kcal`, pct: 100 },
      ],
      analysis: `${s.goal.label}: TDEE (${s.tdee.toLocaleString()}) ${s.goal.delta >= 0 ? '+' : ''}${s.goal.delta} = ${s.targetKcal.toLocaleString()} kcal/ngày. ${s.goal.note}. ${s.kgPerWeek > 0 ? `Tốc độ thay đổi ước tính ~${s.kgPerWeek}kg/tuần.` : 'Duy trì cân nặng hiện tại.'}`,
      evaluation: { icon: s.goalKey === 'loss' ? '🔥' : s.goalKey === 'gain' ? '💪' : '⚖️', label: s.goal.label, color: s.goal.color, text: `Khoảng điều chỉnh ${s.goal.delta >= 0 ? '+' : ''}${s.goal.delta} kcal là an toàn và bền vững cho mục tiêu ${s.goal.label.toLowerCase()}.` },
      suggestions: [`Ăn đúng ${s.targetKcal.toLocaleString()} kcal mỗi ngày`, 'Sai số ±100 kcal/ngày là chấp nhận được', 'Điều chỉnh ±100 kcal mỗi 2 tuần nếu cần'],
      pros: ['Thâm hụt/thặng dư vừa phải, bền vững', 'Giữ được cơ bắp trong quá trình thay đổi'],
      cons: ['Cần kiên trì theo dõi', 'Kết quả thấy rõ sau 4–6 tuần'],
    },
    protein: {
      title: 'Protein — Bảo Vệ Cơ Bắp', value: `${s.proteinG}g`, note: `${(s.proteinG/s.weight).toFixed(1)}g/kg`,
      params: [
        { label: 'Tổng protein/ngày', value: `${s.proteinG}g`, pct: Math.round(s.proteinG/s.weight*100/2.2) },
        { label: `Tỷ lệ g/kg (${s.weight}kg)`, value: `${(s.proteinG/s.weight).toFixed(1)}g/kg`, pct: Math.round((s.proteinG/s.weight)/2.4*100) },
        { label: '% tổng calo', value: `${s.proteinPct}%`, pct: s.proteinPct },
      ],
      analysis: `${s.proteinG}g = ${s.weight}kg × ${(s.proteinG/s.weight).toFixed(1)}g/kg. ${s.goalKey === 'loss' ? 'Protein cao (2.0g/kg) khi giảm mỡ để giữ cơ bắp.' : 'Đủ để duy trì và phát triển cơ.'} Phân bổ: sáng ${s.breakfastProteinG}g / trưa ${s.lunchProteinG}g / tối ${s.dinnerProteinG}g / snack ${s.snackProteinG}g.`,
      evaluation: { icon: '✅', label: (s.proteinG/s.weight) >= 1.6 ? 'Đạt chuẩn' : 'Cần tăng', color: (s.proteinG/s.weight) >= 1.6 ? '#22c55e' : '#f97316', text: `Khuyến nghị 1.6–2.2g/kg. Bạn đang ở ${(s.proteinG/s.weight).toFixed(1)}g/kg — ${(s.proteinG/s.weight) >= 1.6 ? 'trong ngưỡng tốt.' : 'dưới mức tối thiểu.'}` },
      suggestions: [`Đạt ${s.proteinG}g mỗi ngày, chia đều ${s.mealsPerDay} bữa`, 'Mỗi bữa ít nhất 1 nguồn protein', 'Ưu tiên: thịt gà, cá, trứng, đậu hũ, sữa chua'],
      pros: ['Tăng cảm giác no lâu', 'Bảo vệ cơ khi giảm mỡ', 'TEF cao — đốt calo khi tiêu hóa'],
      cons: ['Cần đa dạng nguồn để đủ amino acids', 'Thận trọng nếu có vấn đề thận'],
    },
    carb: {
      title: 'Carbohydrate — Nhiên Liệu Chính', value: `${s.carbG}g`, note: `${s.carbPct}% kcal`,
      params: [
        { label: 'Carb/ngày', value: `${s.carbG}g`, pct: s.carbPct },
        { label: '% tổng calo', value: `${s.carbPct}%`, pct: s.carbPct },
        { label: 'Calo từ carb', value: `${s.carbG * 4} kcal`, pct: s.carbPct },
      ],
      analysis: `Carb = (${s.targetKcal} − ${s.proteinG}×4 − ${s.fatG}×9) ÷ 4 = ${s.carbG}g/ngày. Phân bổ: sáng ${s.breakfastCarbG}g / trưa ${s.lunchCarbG}g (nhiều nhất) / tối ${s.dinnerCarbG}g. Ưu tiên carb phức hợp có chỉ số đường huyết thấp.`,
      evaluation: { icon: '⚡', label: 'Nhiên liệu cơ bắp', color: '#f97316', text: `${s.carbPct}% calo từ carb — ${s.carbPct >= 40 ? 'đủ năng lượng cho tập luyện' : 'khá thấp, phù hợp mục tiêu giảm mỡ'}.` },
      suggestions: ['Ưu tiên cơm, khoai lang, yến mạch, trái cây', `Carb nhiều nhất vào bữa trưa (${s.lunchCarbG}g)`, 'Giảm carb tối nếu không tập buổi chiều'],
      pros: ['Năng lượng cho não và cơ bắp', 'Glycogen hỗ trợ hiệu suất tập'],
      cons: ['Carb tinh chế tăng đường huyết nhanh', 'Dễ ăn vượt nếu không chú ý'],
    },
    fat: {
      title: 'Chất Béo — Thiết Yếu Cho Hormone', value: `${s.fatG}g`, note: `${s.fatPct}% kcal`,
      params: [
        { label: 'Fat/ngày', value: `${s.fatG}g`, pct: s.fatPct },
        { label: '% tổng calo', value: `${s.fatPct}%`, pct: s.fatPct },
        { label: 'Tối thiểu an toàn', value: `${Math.round(s.weight*0.5)}g (0.5g/kg)`, pct: Math.round(s.weight*0.5/s.fatG*100) },
      ],
      analysis: `Fat = ${s.targetKcal} × 25% ÷ 9 = ${s.fatG}g/ngày. Thiết yếu cho hormone sinh dục, hấp thu vitamin A/D/E/K và bảo vệ não. Không nên cắt dưới ${Math.round(s.weight*0.5)}g (0.5g/kg) để tránh rối loạn hormone.`,
      evaluation: { icon: '🟡', label: s.fatPct >= 20 && s.fatPct <= 35 ? 'Cân bằng' : 'Cần kiểm tra', color: '#eab308', text: `${s.fatPct}% calo từ fat — ${s.fatPct >= 20 && s.fatPct <= 35 ? 'trong ngưỡng khuyến nghị 20–35%.' : 'ngoài ngưỡng tối ưu.'}` },
      suggestions: ['Ưu tiên chất béo không bão hòa đơn', 'Dầu olive, cá béo, hạt, bơ là tốt nhất', 'Hạn chế chất béo bão hòa và trans fat'],
      pros: ['Hỗ trợ hormone testosterone và estrogen', 'No lâu hơn', 'Hấp thu vitamin tan trong dầu'],
      cons: ['9 kcal/g — cần kiểm soát lượng', 'Chất béo xấu (trans) có hại tim mạch'],
    },
    water: {
      title: 'Nước — Hiệu Suất & Trao Đổi Chất', value: `${s.waterMl}ml`, note: `${Math.round(s.waterMl/250)} ly 250ml`,
      params: [
        { label: 'Tổng cần/ngày', value: `${s.waterMl}ml`, pct: 100 },
        { label: `${s.weight}kg × 35ml/kg`, value: `${s.waterMl}ml`, pct: 100 },
        { label: 'Khi tập +400–600ml/giờ', value: `${s.waterMl + 500}ml tập`, pct: Math.round((s.waterMl+500)/3000*100) },
      ],
      analysis: `${s.waterMl}ml = ${s.weight}kg × 35ml/kg. Đây là lượng tối thiểu khi nghỉ ngơi ở nhiệt độ bình thường. Thiếu nước 1–2% thể trọng làm giảm hiệu suất tập 10–20% và ảnh hưởng nhận thức.`,
      evaluation: { icon: '💧', label: `${Math.round(s.waterMl/250)} ly/ngày`, color: '#06b6d4', text: `Chia đều trong ngày. Không uống ồ ạt một lần — thận chỉ xử lý được ~700–900ml/giờ.` },
      suggestions: [`Uống ${Math.round(s.waterMl/250)} ly 250ml trải đều trong ngày`, 'Uống 1 ly khi thức dậy và trước mỗi bữa', 'Tăng thêm khi tập hoặc trời nóng'],
      pros: ['Cải thiện hiệu suất tập', 'Hỗ trợ trao đổi chất và tiêu hóa', 'Giảm cảm giác đói giả'],
      cons: ['Uống quá nhiều loãng điện giải', 'Khó nhớ nếu không có thói quen'],
    },
    fiber: {
      title: 'Chất Xơ — Tiêu Hóa & Vi Sinh', value: `${s.fiberG}g`, note: '/ngày',
      params: [
        { label: `Mục tiêu ${s.sex === 'male' ? 'nam' : 'nữ'}`, value: `${s.fiberG}g`, pct: 100 },
        { label: 'Xơ hòa tan', value: `~${Math.round(s.fiberG*0.35)}g`, pct: 35 },
        { label: 'Xơ không tan', value: `~${Math.round(s.fiberG*0.65)}g`, pct: 65 },
      ],
      analysis: `${s.fiberG}g/ngày là mức khuyến nghị cho ${s.sex === 'male' ? 'nam' : 'nữ'} trưởng thành. Chất xơ hòa tan (rau, đậu) làm chậm hấp thu đường và cholesterol. Chất xơ không tan (ngũ cốc, cám) hỗ trợ tiêu hóa và phòng táo bón.`,
      evaluation: { icon: '🌿', label: 'Cần từ thực phẩm tự nhiên', color: '#10b981', text: 'Tăng chất xơ từ từ (mỗi tuần +5g) để tránh đầy hơi. Uống đủ nước khi tăng chất xơ.' },
      suggestions: ['Ăn ít nhất 2 phần rau xanh mỗi ngày', 'Thêm đậu, lăng, đậu phộng vào bữa ăn', 'Ngũ cốc nguyên cám thay ngũ cốc tinh'],
      pros: ['Giảm cholesterol xấu', 'No lâu, kiểm soát cân tốt hơn', 'Nuôi vi khuẩn có lợi đường ruột'],
      cons: ['Quá nhiều gây đầy hơi', 'Cần kết hợp với đủ nước'],
    },
  };
  return map[key] || null;
}

const METRIC_TO_MACRO = {
  protein: 'Protein',
  carb:    'Carbohydrate',
  fat:     'Chất béo',
  water:   'Nước',
  fiber:   'Chất xơ',
};

function buildDynamicMacros(s, kcal) {
  const proteinG   = Math.round(s.weight * 1.8);
  const fatG       = Math.round(kcal * 0.25 / 9);
  const carbG      = Math.max(0, Math.round((kcal - proteinG * 4 - fatG * 9) / 4));
  const proteinPct = Math.round(proteinG * 4 / kcal * 100);
  const carbPct    = Math.round(carbG * 4 / kcal * 100);
  const fatPct     = Math.max(0, 100 - proteinPct - carbPct);
  const waterMl    = Math.round(s.weight * 35);
  const fiberG     = s.sex === 'male' ? 38 : 25;
  return MACROS.map(m => {
    switch (m.name) {
      case 'Protein':
        return { ...m,
          dose: `${(proteinG / s.weight).toFixed(1)}g/kg · ${proteinPct}% kcal`,
          pct: Math.min(98, Math.round((proteinG / s.weight) / 2.2 * 100)),
          gram: proteinG, gramUnit: 'g', kcalPct: `${proteinPct}%`,
        };
      case 'Carbohydrate':
        return { ...m,
          dose: `${carbPct}% kcal · tinh bột phức hợp`,
          pct: carbPct,
          gram: carbG, gramUnit: 'g', kcalPct: `${carbPct}%`,
        };
      case 'Chất béo':
        return { ...m,
          dose: `${fatPct}% kcal · chất béo lành mạnh`,
          pct: fatPct,
          gram: fatG, gramUnit: 'g', kcalPct: `${fatPct}%`,
        };
      case 'Chất xơ':
        return { ...m,
          dose: `${s.sex === 'male' ? '38g khuyến nghị nam' : '25g khuyến nghị nữ'}`,
          pct: Math.min(98, Math.round(fiberG / 38 * 100)),
          gram: fiberG, gramUnit: 'g', kcalPct: null,
        };
      case 'Nước':
        return { ...m,
          dose: `${s.weight}kg × 35ml · ${Math.round(waterMl / 250)} ly/ngày`,
          pct: Math.min(98, Math.round(waterMl / (s.weight * 40) * 100)),
          gram: waterMl, gramUnit: 'ml', kcalPct: null,
        };
      default: return m;
    }
  });
}

function FoundationPanel({ s, onGoalKeyChange }) {
  const { t: tPillars } = useTranslation('pillars');
  const pillarB = tPillars('pillarB', { returnObjects: true }) || {};
  const b1tr = pillarB.b1 || {};
  const translatedModes = TDEE_MODES.map((m, i) => ({
    ...m,
    label: tPillars(`pillarB.tdee_modes.${i}.label`, { defaultValue: m.label }),
    delta: tPillars(`pillarB.tdee_modes.${i}.delta`, { defaultValue: m.delta }),
    note:  tPillars(`pillarB.tdee_modes.${i}.note`,  { defaultValue: m.note }),
  }));
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [previewGoalKey, setPreviewGoalKey] = useState(s.goalKey ?? 'recomp');
  const [expandedMacro, setExpandedMacro]   = useState(null);
  const detail = selectedMetric ? b1MetricDetail(selectedMetric, s) : null;

  useEffect(() => { setPreviewGoalKey(s.goalKey ?? 'recomp'); }, [s.goalKey]);

  const previewGoal    = GOAL_MODIFIERS.find(g => g.key === previewGoalKey) ?? GOAL_MODIFIERS[1];
  const pgIdx = GOAL_MODIFIERS.indexOf(previewGoal);
  const translatedPreviewGoal = {
    ...previewGoal,
    label: tPillars(`pillarB.goal_modifiers.${pgIdx}.label`, { defaultValue: previewGoal.label }),
    note:  tPillars(`pillarB.goal_modifiers.${pgIdx}.note`,  { defaultValue: previewGoal.note }),
  };
  const previewKcal    = selectedMetric === 'tdee' ? s.tdee : s.tdee + previewGoal.delta;
  const dynMacros      = useMemo(() => buildDynamicMacros(s, previewKcal), [s, previewKcal]);
  const activeMacroKey = METRIC_TO_MACRO[selectedMetric] ?? null;

  const translatedDynMacros = dynMacros.map((m, i) => ({
    ...m,
    displayName:    tPillars(`pillarB.macros.${i}.name`,    { defaultValue: m.name }),
    displayRole:    tPillars(`pillarB.macros.${i}.role`,    { defaultValue: m.role }),
    displayDose:    tPillars(`pillarB.macros.${i}.dose`,    { defaultValue: m.dose }),
    displaySources: tPillars(`pillarB.macros.${i}.sources`, { defaultValue: m.sources }),
  }));

  const mP = dynMacros.find(m => m.name === 'Protein');
  const mC = dynMacros.find(m => m.name === 'Carbohydrate');
  const mF = dynMacros.find(m => m.name === 'Chất béo');
  const pG = parseInt(mP?.gram) || 0;
  const cG = parseInt(mC?.gram) || 0;
  const fG = parseInt(mF?.gram) || 0;
  const totalKcalMacro = pG * 4 + cG * 4 + fG * 9 || 1;
  const pW = Math.round(pG * 4 / totalKcalMacro * 100);
  const cW = Math.round(cG * 4 / totalKcalMacro * 100);
  const fW = Math.max(0, 100 - pW - cW);

  return (
    <div className="space-y-7">

      {/* ── PersonalizedBar ─────────────────────────────── */}
      <PersonalizedBar panelId="b1" color="#84cc16" source="B0 (TDEE Calculator)" label={b1tr.based_on || 'Dựa trên thông số của bạn'}
        selectedKey={selectedMetric} onSelect={setSelectedMetric}
        items={[
        { key: 'tdee',    label: 'TDEE',                             value: `${s.tdee.toLocaleString()} kcal`, note: b1tr.tdee_note || 'duy trì cân',                       tip: `TDEE = BMR (${s.bmr.toLocaleString()} kcal) × hệ số hoạt động (${s.activity.mult}). Đây là lượng calo cơ thể đốt nếu bạn giữ nguyên mức vận động hiện tại. Ăn bằng con số này = giữ cân.` },
        { key: 'target',  label: b1tr.target_label || 'Mục tiêu',  value: `${s.targetKcal.toLocaleString()} kcal`, note: translatedPreviewGoal.label.toLowerCase(), tip: `${s.goal.label}: TDEE ${s.goal.delta >= 0 ? '+' : ''}${s.goal.delta} kcal = ${s.targetKcal.toLocaleString()} kcal/ngày. ${s.goal.note}` },
        { key: 'protein', label: 'Protein',   value: `${s.proteinG}g`,   note: `${(s.proteinG/s.weight).toFixed(1)}g/kg`,            tip: `${s.proteinG}g = ${(s.proteinG/s.weight).toFixed(1)}g × ${s.weight}kg cân nặng.` },
        { key: 'carb',    label: 'Carb',      value: `${s.carbG}g`,      note: `${s.carbPct}% kcal`,                                 tip: `Carb = (${s.targetKcal} - ${s.proteinG}×4 - ${s.fatG}×9) ÷ 4 = ${s.carbG}g/ngày.` },
        { key: 'fat',     label: 'Fat',       value: `${s.fatG}g`,       note: `${s.fatPct}% kcal`,                                  tip: `Fat = ${s.targetKcal} × 25% ÷ 9 = ${s.fatG}g/ngày.` },
        { key: 'water',   label: b1tr.water || 'Nước',      value: `${s.waterMl}ml`,   note: `${Math.round(s.waterMl/250)} ly`,               tip: `${s.waterMl}ml = ${s.weight}kg × 35ml.` },
        { key: 'fiber',   label: b1tr.fiber || 'Chất xơ',  value: `${s.fiberG}g`,     note: '/ngày',                                         tip: `${s.fiberG}g/ngày theo khuyến nghị ${s.sex === 'male' ? 'nam' : 'nữ'} trưởng thành.` },
      ]} />
      {detail && <MetricDetailCard detail={detail} color="#84cc16" onClose={() => setSelectedMetric(null)} />}

      {/* ── SECTION 1: TDEE Flow + Goal Selector ─────────── */}
      <RevealBlock>
        <div className="rounded-2xl border border-border/30 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>

          {/* TDEE info strip */}
          <div className="px-5 py-3.5 border-b border-white/5 flex flex-wrap items-center gap-x-6 gap-y-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 rounded-full bg-lime-500/60" />
              <div>
                <p className="text-[9px] text-muted uppercase tracking-widest font-bold">{b1tr.your_tdee || 'TDEE của bạn'}</p>
                <p className="text-base font-black text-lime-400 leading-none">{s.tdee.toLocaleString()} kcal<span className="text-[9px] text-muted font-normal ml-1">/ngày</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted">
              <span>BMR <span className="text-text font-semibold">{s.bmr.toLocaleString()}</span></span>
              <span className="text-muted/40">×</span>
              <span>{b1tr.factor || 'Hệ số'} <span className="text-text font-semibold">{s.activity.mult}</span></span>
              <span className="text-muted/40">=</span>
              <span className="font-bold text-lime-400">{s.tdee.toLocaleString()} kcal</span>
            </div>
          </div>

          {/* Goal selector header */}
          <div className="px-5 pt-4 pb-2">
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.18em]">{b1tr.goal_title || 'Chọn Mục Tiêu — Macro Tự Cập Nhật'}</p>
          </div>

          {/* 3 goal cards */}
          <div className="px-4 pb-4 grid grid-cols-3 gap-3">
            {translatedModes.map(m => {
              const isActive = previewGoalKey === m.goalKey;
              const DELTAS = { loss: -400, recomp: 0, gain: 300 };
              const kcal = s.tdee + DELTAS[m.goalKey];
              return (
                <button key={m.goalKey} type="button"
                  onClick={() => { setPreviewGoalKey(m.goalKey); onGoalKeyChange?.(m.goalKey); }}
                  className={`relative rounded-xl border overflow-hidden p-4 text-center cursor-pointer focus:outline-none group transition-all duration-300`}
                  style={{
                    borderColor: isActive ? `${m.color}70` : `${m.color}22`,
                    background: isActive ? `${m.color}14` : `${m.color}05`,
                    boxShadow: isActive ? `0 0 28px ${m.color}28, 0 2px 12px ${m.color}18, inset 0 1px 0 ${m.color}28` : 'none',
                    transform: isActive ? 'translateY(-3px) scale(1.025)' : 'translateY(0) scale(1)',
                  }}
                >
                  {/* Shimmer */}
                  {isActive && <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                    <div className="absolute top-0 left-[-40%] w-[40%] h-full bg-white/5 skew-x-[-20deg] blur-sm" />
                  </div>}
                  {/* Check */}
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black transition-all duration-200"
                    style={{ background: isActive ? m.color : 'transparent', color: '#0a0a0a', opacity: isActive ? 1 : 0, transform: isActive ? 'scale(1)' : 'scale(0.4)' }}>✓</div>
                  {/* Arrow */}
                  <div className="text-3xl font-black mb-1 transition-transform duration-200 group-hover:scale-110" style={{ color: m.color }}>{m.arrow}</div>
                  {/* Label */}
                  <p className="text-xs font-black mb-1" style={{ color: m.color }}>{m.label}</p>
                  {/* Animated kcal */}
                  <p className="text-sm font-black text-text leading-none mb-0.5">
                    <AnimatedVal value={kcal} /><span className="text-[9px] text-muted font-normal ml-0.5">kcal</span>
                  </p>
                  {/* Delta */}
                  <p className="text-[9px] text-muted">{m.delta}</p>
                </button>
              );
            })}
          </div>

          {/* Active goal insight */}
          <div className="mx-4 mb-4 rounded-xl px-4 py-2.5 transition-all duration-400"
            style={{ background: `${previewGoal.color}08`, border: `1px solid ${previewGoal.color}22` }}>
            <p className="text-[11px] text-muted leading-relaxed">
              <span className="font-bold" style={{ color: previewGoal.color }}>{translatedPreviewGoal.label}: </span>
              {translatedPreviewGoal.note}
              {' — '}<span className="font-black" style={{ color: previewGoal.color }}>
                <AnimatedVal value={previewKcal} /> {b1tr.kcal_day || 'kcal/ngày'}
              </span>
            </p>
          </div>
        </div>
      </RevealBlock>

      {/* ── SECTION 2: Macro Live Summary ────────────────── */}
      <RevealBlock delay={50}>
        <div className="rounded-2xl border border-border/25 p-5" style={{ background: 'rgba(255,255,255,0.015)' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.18em]">{b1tr.macro_daily || 'Phân Bổ Macro Hàng Ngày'}</p>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full transition-all duration-300"
              style={{ color: previewGoal.color, background: `${previewGoal.color}12`, border: `1px solid ${previewGoal.color}28` }}>
              <AnimatedVal value={previewKcal} /> kcal
            </span>
          </div>

          {/* Animated ratio bar */}
          <MacroRatioBar pW={pW} cW={cW} fW={fW} />

          {/* 3 macro numbers with animation */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: 'Protein',  gram: pG, pct: pW, color: '#84cc16', note: `${(pG/s.weight).toFixed(1)}g/kg · MPS` },
              { label: 'Carb',     gram: cG, pct: cW, color: '#f97316', note: b1tr.fuel_note || 'Nhiên liệu chính' },
              { label: b1tr.fat || 'Chất béo', gram: fG, pct: fW, color: '#eab308', note: b1tr.hormone_note || 'Nội tiết · Vitamin' },
            ].map(m => {
              const isHighlighted = activeMacroKey === (m.label === 'Carb' ? 'Carbohydrate' : m.label);
              return (
                <div key={m.label}
                  className="rounded-xl p-3 text-center transition-all duration-300"
                  style={{
                    background: isHighlighted ? `${m.color}14` : `${m.color}07`,
                    border: `1px solid ${isHighlighted ? m.color + '50' : m.color + '18'}`,
                    boxShadow: isHighlighted ? `0 0 16px ${m.color}22` : 'none',
                  }}>
                  <p className="text-xl font-black leading-none" style={{ color: m.color }}>
                    <AnimatedVal value={m.gram} /><span className="text-[10px] ml-0.5">g</span>
                  </p>
                  <p className="text-[9px] font-bold mt-0.5" style={{ color: m.color }}>{m.label}</p>
                  <p className="text-[8px] text-muted mt-0.5">{m.pct}% · {m.note}</p>
                </div>
              );
            })}
          </div>
        </div>
      </RevealBlock>

      {/* ── SECTION 3: 5 Nhóm Dinh Dưỡng Cốt Lõi ──────── */}
      <RevealBlock delay={90}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.18em]">{b1tr.groups_5 || '5 Nhóm Dinh Dưỡng Cốt Lõi'}</p>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full transition-all duration-300"
            style={{ color: previewGoal.color, background: `${previewGoal.color}10`, border: `1px solid ${previewGoal.color}25` }}>
            {selectedMetric === 'tdee' ? `TDEE — ${s.tdee.toLocaleString()} kcal` : `${translatedPreviewGoal.label} — ${previewKcal.toLocaleString()} kcal`}
          </span>
        </div>
        <p className="text-[10px] text-muted mb-4">{b1tr.click_hint || 'Nhấn vào mỗi thẻ để xem gợi ý thực hành.'}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {translatedDynMacros.map((m, i) => (
            <InteractiveMacroCard
              key={m.name}
              macro={m}
              delay={i * 90}
              highlighted={activeMacroKey === m.name}
              expanded={expandedMacro === m.name}
              onToggle={() => setExpandedMacro(prev => prev === m.name ? null : m.name)}
            />
          ))}
        </div>
      </RevealBlock>

      {/* ── SECTION 4: 7 Triết Lý Dinh Dưỡng ─────────────── */}
      <RevealBlock delay={130}>
        <div className="mt-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-lime-500/12 border border-lime-500/25 flex items-center justify-center text-xl shrink-0">💎</div>
            <div>
              <p className="text-sm font-bold text-text">{b1tr.philosophy_title || '7 Công Thức Triết Lý Dinh Dưỡng'}</p>
              <p className="text-[10px] text-muted">{b1tr.philosophy_sub || 'Nền tảng tư duy để duy trì bền vững — không phụ thuộc ý chí'}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-lime-500/20 bg-lime-500/5 px-5 py-3.5 mb-5 text-center">
            <p className="text-sm font-bold text-lime-400 italic leading-relaxed">
              "{b1tr.philosophy_quote1 || 'Ăn đủ — ăn đều — ăn thật — ăn theo mục tiêu — sống được lâu dài.'}"
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {PHILOSOPHY_7.map((p, i) => (
              <RevealBlock key={i} delay={i * 55}>
                <div className="rounded-xl border border-white/6 bg-white/[0.018] p-4 flex items-start gap-3 hover:bg-white/[0.035] hover:border-lime-500/20 transition-all duration-200">
                  <span className="text-xl shrink-0 mt-0.5">{p.icon || '•'}</span>
                  <div>
                    <p className="text-[11px] font-bold text-text mb-1">{tPillars(`pillarB.b1.philosophy_7.${i}.title`, { defaultValue: p.title })}</p>
                    <p className="text-[10px] text-muted leading-relaxed">{tPillars(`pillarB.b1.philosophy_7.${i}.body`, { defaultValue: p.body })}</p>
                  </div>
                </div>
              </RevealBlock>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-lime-500/15 bg-lime-500/5 p-4 text-center">
            <p className="text-[11px] font-bold text-lime-400 italic">
              "{b1tr.philosophy_quote2 || 'Dinh dưỡng tốt nhất là dinh dưỡng bạn hiểu, thích nghi được, và duy trì được.'}"
            </p>
          </div>
        </div>
      </RevealBlock>
    </div>
  );
}

function b2MetricDetail(key, s) {
  const map = {
    meal_protein: {
      title: 'Protein Mỗi Bữa', value: `${s.perMealProteinG}g`, note: `≈${s.chickenG}g ức gà`,
      params: [
        { label: 'Protein/ngày', value: `${s.proteinG}g`, pct: 100 },
        { label: `÷ ${s.mealsPerDay} bữa`, value: `${s.perMealProteinG}g/bữa`, pct: Math.round(s.perMealProteinG/s.proteinG*100) },
        { label: 'Quy đổi ức gà', value: `~${s.chickenG}g`, pct: Math.min(100, Math.round(s.chickenG/200*100)) },
      ],
      analysis: `${s.proteinG}g protein/ngày ÷ ${s.mealsPerDay} bữa = ${s.perMealProteinG}g/bữa. Phân đều protein qua các bữa kích thích tổng hợp cơ liên tục (MPS) tốt hơn dồn vào 1–2 bữa. Tối thiểu 20–40g/bữa để kích hoạt MPS hiệu quả.`,
      evaluation: { icon: s.perMealProteinG >= 20 ? '✅' : '⚠️', label: s.perMealProteinG >= 20 ? 'Đạt ngưỡng MPS' : 'Dưới ngưỡng MPS', color: s.perMealProteinG >= 20 ? '#22c55e' : '#f97316', text: `Ngưỡng kích hoạt tổng hợp cơ (MPS): 20–40g/bữa. Bạn đang ở ${s.perMealProteinG}g — ${s.perMealProteinG >= 20 ? 'đạt tiêu chuẩn.' : 'có thể tăng thêm.'}` },
      suggestions: [`${s.chickenG}g ức gà, hoặc ${Math.round(s.perMealProteinG/0.13)}g trứng (~${Math.round(s.perMealProteinG/0.13/50)} quả)`, 'Kết hợp đạm động vật + thực vật mỗi ngày', 'Protein shake nếu khó đạt qua thức ăn'],
      pros: ['MPS liên tục cả ngày', 'No lâu mỗi bữa', 'Dễ đạt mục tiêu ngày'],
      cons: ['Cần đa dạng nguồn', 'Khó khi bận và ăn ngoài'],
    },
    meal_carb: {
      title: 'Carb Mỗi Bữa', value: `${s.perMealCarbG}g`, note: `≈${s.riceG}g cơm`,
      params: [
        { label: 'Carb/ngày', value: `${s.carbG}g`, pct: 100 },
        { label: 'Bữa sáng', value: `${s.breakfastCarbG}g`, pct: Math.round(s.breakfastCarbG/s.carbG*100) },
        { label: 'Bữa trưa (nhiều nhất)', value: `${s.lunchCarbG}g`, pct: Math.round(s.lunchCarbG/s.carbG*100), color: '#22c55e' },
        { label: 'Bữa tối', value: `${s.dinnerCarbG}g`, pct: Math.round(s.dinnerCarbG/s.carbG*100) },
      ],
      analysis: `Trung bình ${s.perMealCarbG}g carb/bữa ≈ ${s.riceG}g cơm đã nấu. Thực tế nên phân bổ không đều: trưa nhiều nhất (${s.lunchCarbG}g), tối ít hơn (${s.dinnerCarbG}g). Ngày tập nên tăng carb trước và sau buổi tập.`,
      evaluation: { icon: '⚡', label: 'Nhiên liệu theo bữa', color: '#f97316', text: `Carb trước tập giúp hiệu suất, carb sau tập phục hồi glycogen. Bữa tối ít carb hơn nếu không tập buổi chiều.` },
      suggestions: [`Bữa trưa ưu tiên nhiều carb nhất: ${s.lunchCarbG}g`, 'Ưu tiên carb phức hợp: cơm, khoai lang, yến mạch', `Bữa tối hạn chế tinh bột: ~${s.dinnerCarbG}g là hợp lý`],
      pros: ['Năng lượng ổn định cả ngày', 'Hỗ trợ hiệu suất tập luyện'],
      cons: ['Dễ vượt mức nếu không chú ý', 'Carb tinh chế tăng đường huyết nhanh'],
    },
    meal_fat: {
      title: 'Fat Mỗi Bữa', value: `${s.perMealFatG}g`, note: `≈${s.oliveOilMl}ml dầu`,
      params: [
        { label: 'Fat/ngày', value: `${s.fatG}g`, pct: 100 },
        { label: `÷ ${s.mealsPerDay} bữa`, value: `${s.perMealFatG}g/bữa`, pct: Math.round(s.perMealFatG/s.fatG*100) },
        { label: 'Quy đổi dầu olive', value: `~${s.oliveOilMl}ml`, pct: 50 },
      ],
      analysis: `${s.fatG}g fat/ngày ÷ ${s.mealsPerDay} bữa = ${s.perMealFatG}g/bữa. Không cần đo chính xác — fat tự nhiên trong thực phẩm (cá, trứng, hạt) thường đủ. Tránh thêm nhiều dầu khi nấu.`,
      evaluation: { icon: '🟡', label: 'Từ thực phẩm tự nhiên', color: '#eab308', text: `Không cần thêm dầu riêng nếu ăn đủ cá, trứng, hạt mỗi ngày. Fat trong thực phẩm nguyên dạng kèm vi chất tốt hơn dầu tinh chế.` },
      suggestions: ['Fat từ cá, trứng, hạt — không cần đo', `Hạn chế dầu chiên: ${s.perMealFatG}g ≈ ${s.oliveOilMl}ml dầu/bữa`, 'Omega-3 từ cá hồi, cá thu 2–3 lần/tuần'],
      pros: ['Fat chậm tiêu — no lâu hơn', 'Hỗ trợ hấp thu vitamin A, D, E, K'],
      cons: ['9 kcal/g — nhiều calo hơn protein/carb', 'Dễ vượt mức khi ăn đồ chiên'],
    },
    meal_kcal: {
      title: 'Calo Mỗi Bữa', value: `${s.perMealKcal}`, note: 'kcal trung bình',
      params: [
        { label: 'Bữa sáng (25%)', value: `${s.breakfastKcal} kcal`, pct: 25 },
        { label: 'Bữa trưa (35%)', value: `${s.lunchKcal} kcal`, pct: 35, color: '#22c55e' },
        { label: 'Bữa tối (30%)', value: `${s.dinnerKcal} kcal`, pct: 30 },
        { label: 'Snack (10%)', value: `${s.snackKcal} kcal`, pct: 10 },
      ],
      analysis: `Tổng ${s.targetKcal.toLocaleString()} kcal/ngày chia 4 bữa. Bữa trưa lớn nhất (${s.lunchKcal} kcal) vì cơ thể cần năng lượng cho buổi chiều. Bữa tối vừa phải (${s.dinnerKcal} kcal). Snack (${s.snackKcal} kcal) giữ ổn định đường huyết giữa các bữa.`,
      evaluation: { icon: '📊', label: 'Phân bổ hợp lý', color: '#06b6d4', text: `Bữa trưa lớn nhất theo nhịp sinh học — insulin nhạy hơn ban ngày giúp dung nạp carb hiệu quả hơn bữa tối.` },
      suggestions: [`Sáng ~${s.breakfastKcal} kcal, trưa ~${s.lunchKcal} kcal`, 'Không bỏ bữa sáng — làm chậm trao đổi chất', `Snack ~${s.snackKcal} kcal: sữa chua + trái cây`],
      pros: ['Ổn định đường huyết cả ngày', 'Kiểm soát tổng calo tốt hơn'],
      cons: ['Cần chuẩn bị bữa ăn có kế hoạch', 'Khó duy trì khi lịch bận'],
    },
  };
  return map[key] || null;
}

function PlatePanel({ s }) {
  const { t: tPillars } = useTranslation('pillars');
  const pillarB = tPillars('pillarB', { returnObjects: true }) || {};
  const b2tr = pillarB.b2 || {};
  const [ref, visible] = useScrollReveal(0.15);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [proteinBars, setProteinBars] = useState([0, 0, 0, 0]);
  const [carbBars, setCarbBars] = useState([0, 0, 0, 0]);
  const detail = selectedMetric ? b2MetricDetail(selectedMetric, s) : null;

  const mealTimesTr    = toArr(b2tr.meal_times).length    ? toArr(b2tr.meal_times)    : ['🌅 Sáng', '☀️ Trưa', '🌙 Tối', '🍎 Snack'];
  const proteinNotesTr = toArr(b2tr.protein_notes).length ? toArr(b2tr.protein_notes) : ['trứng + sữa chua', 'ức gà / cá / đậu hũ', 'cá / thịt / trứng', 'sữa chua Hy Lạp'];
  const carbNotesTr    = toArr(b2tr.carb_notes).length    ? toArr(b2tr.carb_notes)    : ['ổn định đường huyết', 'năng lượng cao nhất', 'giảm nếu không tập tối', 'trái cây, yến mạch'];
  const portionsTr     = toArr(b2tr.portions);

  const proteinRows = [
    { meal: mealTimesTr[0], g: s.breakfastProteinG, pct: 25, note: proteinNotesTr[0] },
    { meal: mealTimesTr[1], g: s.lunchProteinG,     pct: 35, note: proteinNotesTr[1] },
    { meal: mealTimesTr[2], g: s.dinnerProteinG,    pct: 30, note: proteinNotesTr[2] },
    { meal: mealTimesTr[3], g: s.snackProteinG,     pct: 10, note: proteinNotesTr[3] },
  ];
  const carbRows = [
    { meal: mealTimesTr[0], g: s.breakfastCarbG, pct: 25, note: carbNotesTr[0] },
    { meal: mealTimesTr[1], g: s.lunchCarbG,     pct: 40, note: carbNotesTr[1], hi: true },
    { meal: mealTimesTr[2], g: s.dinnerCarbG,    pct: 25, note: carbNotesTr[2] },
    { meal: mealTimesTr[3], g: s.snackCarbG,     pct: 10, note: carbNotesTr[3] },
  ];

  // animate bars on mount
  useEffect(() => {
    const t = setTimeout(() => {
      setProteinBars(proteinRows.map(r => r.pct));
      setCarbBars(carbRows.map(r => r.pct));
    }, 300);
    return () => clearTimeout(t);
  }, [s]);

  return (
    <div>
      <PersonalizedBar panelId="b2" color="#22c55e" source="B0 + B1 (TDEE & Macros)" label={b2tr.based_on || 'Dựa trên thông số của bạn'}
        selectedKey={selectedMetric} onSelect={setSelectedMetric}
        items={[
        { key: 'meal_protein', label: 'Protein/bữa', value: `${s.perMealProteinG}g`, note: `≈${s.chickenG}g ức gà`, tip: `${s.proteinG}g protein/ngày ÷ ${s.mealsPerDay} bữa = ${s.perMealProteinG}g/bữa.` },
        { key: 'meal_carb',    label: 'Carb/bữa', value: `${s.perMealCarbG}g`, note: `≈${s.riceG}g cơm`, tip: `${s.carbG}g carb/ngày ÷ ${s.mealsPerDay} bữa = ${s.perMealCarbG}g/bữa.` },
        { key: 'meal_fat',     label: 'Fat/bữa', value: `${s.perMealFatG}g`, note: `≈${s.oliveOilMl}ml dầu`, tip: `${s.fatG}g fat/ngày ÷ ${s.mealsPerDay} bữa = ${s.perMealFatG}g/bữa.` },
        { key: 'meal_kcal',    label: 'Kcal/bữa', value: `${s.perMealKcal}`, note: 'kcal', tip: `${s.targetKcal.toLocaleString()} kcal/ngày ÷ ${s.mealsPerDay} bữa = ${s.perMealKcal} kcal/bữa.` },
      ]} />
      {detail && <MetricDetailCard detail={detail} color="#22c55e" onClose={() => setSelectedMetric(null)} />}

      {/* ── Diagram + Tips ───────────────────────────────────────────── */}
      <div ref={ref} className="grid md:grid-cols-2 gap-8 items-start mb-10">
        <div>
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-5">{b2tr.plate_method || 'Phương Pháp Đĩa Ăn'}</p>
          <PlateDiagram animate={visible} />
        </div>
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-5">{b2tr.apply_title || 'Áp Dụng Thực Tế'}</p>
          <div className="rounded-2xl border border-lime-500/20 bg-lime-500/5 p-5">
            <p className="text-xs font-bold text-lime-400 mb-3">{b2tr.at_home || '🏠 Tại nhà'}</p>
            <ul className="space-y-2">
              {(toArr(b2tr.at_home_tips).length ? toArr(b2tr.at_home_tips) : ['Dùng đĩa 23–26cm làm chuẩn', 'Bắt đầu bằng rau trước khi thêm carb', 'Đạm = lòng bàn tay của bạn', 'Cơm = nắm tay của bạn']).map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                  <span className="text-lime-400 font-bold shrink-0">✓</span>{tip}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
            <p className="text-xs font-bold text-orange-400 mb-3">{b2tr.eating_out || '🍜 Ăn ngoài hàng'}</p>
            <ul className="space-y-2">
              {(toArr(b2tr.eating_out_tips).length ? toArr(b2tr.eating_out_tips) : ['Chọn phần có cả đạm + rau + carb', 'Gọi thêm rau hoặc salad riêng', 'Tránh nước chấm nhiều muối/đường', 'Bún/phở: ít bún, nhiều rau, thêm trứng']).map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                  <span className="text-orange-400 font-bold shrink-0">✓</span>{tip}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <p className="text-xs font-bold text-cyan-400 mb-3">{b2tr.meal_prep || '📦 Meal Prep bận rộn'}</p>
            <ul className="space-y-2">
              {(toArr(b2tr.meal_prep_tips).length ? toArr(b2tr.meal_prep_tips) : ['Chuẩn bị đạm cho cả tuần (gà, trứng, đậu hũ)', 'Nấu lượng cơm 2–3 ngày một lần', 'Rau luộc sẵn, bảo quản tủ lạnh 3 ngày', 'Yến mạch overnight cho sáng bận rộn']).map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                  <span className="text-cyan-400 font-bold shrink-0">✓</span>{tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Contextual image banner ───────────────────────────────────── */}
      <RevealBlock>
        <div className="rounded-2xl overflow-hidden mb-8 relative h-44 md:h-56">
          <img
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=70"
            alt="Healthy balanced meal prep"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.92) 40%, rgba(10,10,10,0.3) 100%)' }} />
          <div className="absolute inset-y-0 left-0 px-7 flex flex-col justify-center max-w-sm">
            <span className="text-[9px] font-bold text-green-400 uppercase tracking-[0.25em] mb-1.5">{b2tr.golden_rule || 'Nguyên tắc vàng'}</span>
            <p className="text-xl font-black text-text leading-tight mb-1.5">{b2tr.golden_title || 'Đạm → Rau → Tinh bột'}</p>
            <p className="text-[11px] text-muted leading-relaxed">{b2tr.golden_desc || 'Thứ tự ăn quyết định tốc độ tăng đường huyết — ăn đạm và rau trước giúp hấp thu tinh bột chậm hơn.'}</p>
          </div>
        </div>
      </RevealBlock>

      {/* ── Hand portion formula ─────────────────────────────────────── */}
      <RevealBlock delay={40}>
        <div className="rounded-2xl border border-border/25 p-6 mb-8" style={{ background: 'rgba(255,255,255,0.015)' }}>
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-lime-500/15 border border-lime-500/25 flex items-center justify-center text-xl shrink-0">✋</div>
            <div>
              <h3 className="text-sm font-bold text-text">{b2tr.hand_title || 'Công Thức Khẩu Phần Theo Tay — Không Cần Cân'}</h3>
              <p className="text-[10px] text-muted mt-0.5">{b2tr.hand_subtitle || 'Ước lượng khẩu phần từng bữa dựa trên kích thước bàn tay bạn'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { hand: '🤜', label: portionsTr[0]?.label || 'Đạm',      portion: portionsTr[0]?.portion || '1 lòng bàn tay', calc: `≈ ${s.perMealProteinG}g protein`,                             example: `${s.chickenG}${portionsTr[0]?.example_dyn || 'g ức gà'}`,      color: '#84cc16' },
              { hand: '✊', label: portionsTr[1]?.label || 'Tinh bột', portion: portionsTr[1]?.portion || '1 nắm tay',      calc: `≈ ${s.riceG}${portionsTr[1]?.calc_unit ? ' ' + portionsTr[1].calc_unit : 'g cơm'}`, example: portionsTr[1]?.example || 'hoặc 1 củ khoai lang', color: '#f97316' },
              { hand: '🤲', label: portionsTr[2]?.label || 'Rau xanh', portion: portionsTr[2]?.portion || '2 nắm tay',     calc: portionsTr[2]?.calc_static || '≈ 150–200g rau',                example: portionsTr[2]?.example || 'luộc hoặc xào ít dầu',                color: '#22c55e' },
              { hand: '👍', label: portionsTr[3]?.label || 'Chất béo', portion: portionsTr[3]?.portion || '1 ngón cái',    calc: `≈ ${s.perMealFatG}g fat`,                                      example: portionsTr[3]?.example || 'dầu olive / bơ / hạt',                color: '#eab308' },
            ].map((p, i) => (
              <div key={i} className="rounded-xl border p-3.5 text-center" style={{ borderColor: `${p.color}28`, background: `${p.color}07` }}>
                <div className="text-3xl mb-2">{p.hand}</div>
                <p className="text-[11px] font-bold mb-0.5" style={{ color: p.color }}>{p.label}</p>
                <p className="text-[9px] text-muted mb-1.5 leading-snug">{p.portion}</p>
                <p className="text-[11px] font-black text-text">{p.calc}</p>
                <p className="text-[9px] text-muted/70 mt-0.5">{p.example}</p>
              </div>
            ))}
          </div>
          {/* Personalized formula bar */}
          <div className="rounded-xl px-4 py-3 border" style={{ background: 'rgba(132,204,22,0.05)', borderColor: 'rgba(132,204,22,0.18)' }}>
            <p className="text-[10px] text-muted mb-0.5">
              <span className="text-lime-400 font-bold">{b2tr.formula_title || 'Công thức bữa của bạn'}</span>
              <span className="text-muted/60 ml-1">({s.perMealKcal} {b2tr.kcal_meal || 'kcal/bữa'} · {s.mealsPerDay} {b2tr.meals_day || 'bữa/ngày'})</span>
            </p>
            <p className="text-[11px] text-text font-semibold leading-relaxed">
              {s.chickenG}{b2tr.formula_chicken || 'g ức gà'} <span className="text-lime-400">({s.perMealProteinG}{b2tr.formula_protein_unit || 'g đạm'})</span>
              {' + '}{s.riceG}{b2tr.formula_rice_unit || 'g cơm'} <span className="text-orange-400">({s.perMealCarbG}g carb)</span>
              {' + '}<span className="text-green-400">2 {b2tr.formula_veggie || 'nắm rau'}</span>
              {' + '}{s.perMealFatG}{b2tr.formula_fat_unit ? ' ' + b2tr.formula_fat_unit : 'g chất béo tốt'}
            </p>
          </div>
        </div>
      </RevealBlock>

      {/* ── Protein anchor + Carb timing 2-col ──────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        {/* Protein anchor */}
        <RevealBlock delay={60}>
          <div className="rounded-2xl border border-lime-500/20 bg-lime-500/5 p-5 h-full">
            <h3 className="text-sm font-bold text-lime-400 mb-0.5 flex items-center gap-2">{b2tr.protein_anchor_title || '💪 Protein — "Neo" Mỗi Bữa'}</h3>
            <p className="text-[10px] text-muted mb-4">{b2tr.protein_anchor_sub || 'Xây bữa ăn từ đạm trước, sau đó thêm carb và rau'}</p>
            <div className="space-y-3">
              {proteinRows.map((r, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-text">{r.meal}</span>
                    <span className="text-[10px] text-muted">{r.note}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-lime-500" style={{ width: `${proteinBars[i]}%`, transition: `width 0.8s cubic-bezier(0.34,1.56,0.64,1) ${i * 120}ms` }} />
                    </div>
                    <span className="text-[11px] font-black text-lime-400 w-10 text-right shrink-0">{r.g}g</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-lime-500/10 flex items-center justify-between">
              <p className="text-[10px] text-muted">{b2tr.total_protein || 'Tổng protein'}</p>
              <p className="text-[11px] font-black text-lime-400">{s.proteinG}g/ngày · {(s.proteinG/s.weight).toFixed(1)}g/kg</p>
            </div>
          </div>
        </RevealBlock>

        {/* Carb timing */}
        <RevealBlock delay={100}>
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5 h-full">
            <h3 className="text-sm font-bold text-orange-400 mb-0.5 flex items-center gap-2">{b2tr.carb_timing_title || '⚡ Carb Đúng Thời Điểm'}</h3>
            <p className="text-[10px] text-muted mb-4">{b2tr.carb_timing_sub || 'Ưu tiên tinh bột vào bữa trưa — giảm dần về tối'}</p>
            <div className="space-y-3">
              {carbRows.map((r, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-text">{r.meal}</span>
                    <span className="text-[9px] text-muted">{r.note}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ background: r.hi ? '#f97316' : 'rgba(249,115,22,0.55)', width: `${carbBars[i] * 2}%`, transition: `width 0.8s cubic-bezier(0.34,1.56,0.64,1) ${i * 120}ms` }} />
                    </div>
                    <span className={`text-[11px] font-black w-10 text-right shrink-0 ${r.hi ? 'text-orange-300' : 'text-orange-400/70'}`}>{r.g}g</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-orange-500/10 flex items-center justify-between">
              <p className="text-[10px] text-muted">{b2tr.total_carb || 'Tổng carb'}</p>
              <p className="text-[11px] font-black text-orange-400">{s.carbG}g/ngày · {b2tr.lunch_label || 'Trưa'}: {s.lunchCarbG}g</p>
            </div>
          </div>
        </RevealBlock>
      </div>

      {/* ── 80/20 rule ───────────────────────────────────────────────── */}
      <RevealBlock delay={120}>
        <div className="rounded-2xl border border-white/8 p-6 mb-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl border flex items-center justify-center text-xl shrink-0" style={{ background: 'rgba(168,85,247,0.12)', borderColor: 'rgba(168,85,247,0.25)' }}>🎯</div>
            <div>
              <h3 className="text-sm font-bold text-text">{b2tr.rule_8020_title || 'Nguyên Tắc 80/20 — Linh Hoạt Để Bền Vững'}</h3>
              <p className="text-[10px] text-muted">{b2tr.rule_8020_sub || 'Kỷ luật không phải là cấm tất cả — là biết cách quay lại'}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1.5 w-full rounded-full bg-green-500/25 overflow-hidden">
                  <div className="h-full rounded-full bg-green-500 w-4/5" />
                </div>
                <span className="text-xs font-black text-green-400 shrink-0">80%</span>
              </div>
              <p className="text-[10px] font-bold text-green-400 uppercase tracking-wider mb-2.5">{b2tr.rule_80_label || 'Ăn đúng nền tảng'}</p>
              <ul className="space-y-1.5">
                {(toArr(b2tr.rule_80_items).length
                  ? toArr(b2tr.rule_80_items).map(t => t.replace('{kcal}', s.targetKcal.toLocaleString()))
                  : ['Đủ đạm, đủ rau, đủ nước mỗi bữa', `Ăn đúng ${s.targetKcal.toLocaleString()} kcal ±100`, 'Hạn chế đồ uống có đường', 'Meal prep 1–2 lần/tuần']
                ).map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                    <span className="text-green-400 font-bold shrink-0 mt-px">✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1.5 w-full rounded-full bg-purple-500/25 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-500 w-1/5" />
                </div>
                <span className="text-xs font-black text-purple-400 shrink-0">20%</span>
              </div>
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2.5">{b2tr.rule_20_label || 'Linh hoạt đời thực'}</p>
              <ul className="space-y-1.5">
                {(toArr(b2tr.rule_20_items).length
                  ? toArr(b2tr.rule_20_items)
                  : ['Ăn ngoài, tiệc, sum họp gia đình', 'Món yêu thích 1–2 lần/tuần', 'Khi lỡ ăn nhiều — chỉnh bữa sau', 'Không tự trách bản thân']
                ).map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                    <span className="text-purple-400 shrink-0 mt-px">●</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-xl border px-4 py-3" style={{ background: 'rgba(168,85,247,0.05)', borderColor: 'rgba(168,85,247,0.18)' }}>
            <p className="text-[11px] text-muted/80 italic leading-relaxed">
              "{b2tr.rule_8020_q_part1 || 'Một bữa lệch kế hoạch'} <span className="text-purple-400 font-semibold not-italic">{b2tr.rule_8020_q_part2 || 'không phá hỏng hành trình'}</span>{b2tr.rule_8020_q_part3 || '. Điều phá hỏng hành trình là tâm lý'} <span className="text-red-400 font-semibold not-italic">{b2tr.rule_8020_q_part4 || "'lỡ rồi bỏ luôn'"}</span>."
            </p>
          </div>
        </div>
      </RevealBlock>

      {/* ── 4 Câu Hỏi Kiểm Tra Mỗi Bữa ─────────────────────── */}
      <RevealBlock delay={140}>
        <div className="rounded-2xl border border-border/25 p-6 mb-8" style={{ background: 'rgba(255,255,255,0.015)' }}>
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-green-500/12 border border-green-500/20 flex items-center justify-center text-xl shrink-0">❓</div>
            <div>
              <h3 className="text-sm font-bold text-text">{b2tr.check_q_title || '4 Câu Hỏi Kiểm Tra Mỗi Bữa'}</h3>
              <p className="text-[10px] text-muted mt-0.5">{b2tr.check_q_sub || 'Thói quen đơn giản để mỗi bữa đều đạt chuẩn dinh dưỡng — không cần đếm calo'}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {(toArr(b2tr.check_questions).length ? toArr(b2tr.check_questions) : MEAL_CHECK_QUESTIONS).map((q, i) => (
              <RevealBlock key={i} delay={i * 50}>
                <div className="rounded-xl border p-4 flex items-start gap-3" style={{ borderColor: `${MEAL_CHECK_QUESTIONS[i]?.color || '#84cc16'}25`, background: `${MEAL_CHECK_QUESTIONS[i]?.color || '#84cc16'}06` }}>
                  <span className="text-2xl shrink-0">{MEAL_CHECK_QUESTIONS[i]?.icon || '•'}</span>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-text mb-1.5">{q.q}</p>
                    <p className="text-[10px] leading-relaxed" style={{ color: MEAL_CHECK_QUESTIONS[i]?.color || '#84cc16' }}>{q.example}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center" style={{ borderColor: `${MEAL_CHECK_QUESTIONS[i]?.color || '#84cc16'}50` }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: `${MEAL_CHECK_QUESTIONS[i]?.color || '#84cc16'}60` }} />
                  </div>
                </div>
              </RevealBlock>
            ))}
          </div>
          <div className="mt-4 rounded-xl px-4 py-3 border border-green-500/15 bg-green-500/5">
            <p className="text-[10px] text-muted leading-relaxed">
              <span className="font-bold text-green-400">💡 {b2tr.check_q_tip_label || 'Cách dùng'}:</span> {b2tr.check_q_tip || 'Trước mỗi bữa ăn, hỏi qua 4 câu này. Nếu bữa hiện tại thiếu một điều gì đó — bổ sung ngay hoặc điều chỉnh ở bữa tiếp theo. Không cần hoàn hảo, chỉ cần nhận thức.'}
            </p>
          </div>
        </div>
      </RevealBlock>

      {/* ── Bảng Thay Thế Thực Phẩm ─────────────────────────── */}
      <RevealBlock delay={160}>
        <div className="mb-8">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/12 border border-cyan-500/20 flex items-center justify-center text-xl shrink-0">🔀</div>
            <div>
              <h3 className="text-sm font-bold text-text">{b2tr.swap_title || 'Bảng Thay Thế Thực Phẩm'}</h3>
              <p className="text-[10px] text-muted mt-0.5">{b2tr.swap_sub || 'Hoán đổi linh hoạt khi không có nguyên liệu — giữ nguyên lượng đạm và calo'}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(FOOD_SWAP_TABLE).map(([key, group]) => {
              const labelMap = { protein: b2tr.swap_protein_label, carb: b2tr.swap_carb_label, veg: b2tr.swap_veg_label };
              const translatedLabel = labelMap[key] || group.label;
              return (
              <RevealBlock key={group.label}>
                <div className="rounded-2xl border p-4 h-full" style={{ borderColor: `${group.color}25`, background: `${group.color}05` }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">{group.icon}</span>
                    <p className="text-xs font-bold" style={{ color: group.color }}>{translatedLabel}</p>
                  </div>
                  <div className="space-y-3">
                    {group.items.map((item, j) => {
                      return (
                      <div key={j} className="rounded-xl border p-2.5" style={{ borderColor: `${group.color}15`, background: `${group.color}04` }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold text-text">{tPillars(`pillarB.b2.swap_${key}_items.${j}.main`, { defaultValue: item.main })}</span>
                          <span className="text-muted/40 text-[9px]">→</span>
                          <span className="text-[10px] font-bold" style={{ color: group.color }}>{tPillars(`pillarB.b2.swap_${key}_items.${j}.swap`, { defaultValue: item.swap })}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] text-muted">
                          <span>P: <b className="text-text">{item.protein}</b></span>
                          <span>Kcal: <b className="text-text">{item.kcal}</b></span>
                        </div>
                        <p className="text-[9px] text-muted/60 mt-1 italic">{tPillars(`pillarB.b2.swap_${key}_items.${j}.note`, { defaultValue: item.note })}</p>
                      </div>
                      );
                    })}
                  </div>
                </div>
              </RevealBlock>
              );
            })}
          </div>
        </div>
      </RevealBlock>

      {/* ── Ăn Ngoài Khỏe Với 3 Quy Tắc ────────────────────── */}
      <RevealBlock delay={180}>
        <div className="mb-2">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/12 border border-orange-500/20 flex items-center justify-center text-xl shrink-0">🏪</div>
            <div>
              <h3 className="text-sm font-bold text-text">{b2tr.eating_out_title || 'Ăn Ngoài Vẫn Khỏe — Quy Tắc 3 Chọn'}</h3>
              <p className="text-[10px] text-muted mt-0.5">{b2tr.eating_out_sub || 'Khi ăn ngoài: chọn đạm trước → thêm rau/canh → điều chỉnh tinh bột theo mục tiêu'}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {EATING_OUT_GUIDE.map((g, i) => {
              const gtr = toArr(b2tr.eating_out_guide)[i] || {};
              const name = gtr.name || g.name;
              const rules = toArr(gtr.rules).length ? toArr(gtr.rules) : g.rules;
              const avoid = gtr.avoid || g.avoid;
              return (
              <RevealBlock key={i} delay={i * 60}>
                <div className="rounded-2xl border p-4 h-full" style={{ borderColor: `${g.color}22`, background: `${g.color}05` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{g.icon}</span>
                    <p className="text-xs font-bold text-text">{name}</p>
                  </div>
                  <ul className="space-y-1.5 mb-3">
                    {rules.map((r, j) => (
                      <li key={j} className="flex items-start gap-2 text-[10px] text-muted">
                        <span className="font-bold shrink-0 mt-px" style={{ color: g.color }}>✓</span>{r}
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-lg px-2.5 py-1.5 border text-[9px] text-muted/70" style={{ borderColor: `${g.color}15`, background: `${g.color}08` }}>
                    ⚠️ {avoid}
                  </div>
                </div>
              </RevealBlock>
              );
            })}
          </div>
        </div>
      </RevealBlock>
    </div>
  );
}

function b3MetricDetail(key, s) {
  const map = {
    goal: {
      title: `Mục Tiêu — ${s.goal.label}`, value: s.goal.label, note: s.goal.note,
      params: [
        { label: 'TDEE nền', value: `${s.tdee.toLocaleString()} kcal`, pct: 100 },
        { label: 'Điều chỉnh', value: `${s.goal.delta >= 0 ? '+' : ''}${s.goal.delta} kcal`, pct: Math.round(Math.abs(s.goal.delta)/s.tdee*100), color: s.goal.color },
        { label: 'Mục tiêu kcal/ngày', value: `${s.targetKcal.toLocaleString()} kcal`, pct: 100 },
      ],
      analysis: `Mục tiêu ${s.goal.label} tạo ra thâm hụt/thặng dư ${Math.abs(s.goal.delta)} kcal/ngày so với TDEE. ${s.kgPerWeek > 0 ? `Tốc độ thay đổi ước tính: ~${s.kgPerWeek}kg/tuần — trong ngưỡng an toàn 0.25–0.75kg/tuần.` : 'Duy trì cân nặng hiện tại — không cần thay đổi lớn.'}`,
      evaluation: { icon: s.goalKey === 'loss' ? '🔥' : s.goalKey === 'gain' ? '💪' : '⚖️', label: 'Mục tiêu hiện tại', color: s.goal.color, text: `Mức điều chỉnh ${Math.abs(s.goal.delta)} kcal/ngày là bền vững. Đánh giá lại sau 4–6 tuần.` },
      suggestions: [`Ăn đúng ${s.targetKcal.toLocaleString()} kcal/ngày`, 'Cân vào buổi sáng cùng ngày mỗi tuần', 'Điều chỉnh ±100 kcal mỗi 2 tuần nếu cần'],
      pros: ['Mức thay đổi bền vững, ít mất cơ', 'Đủ thời gian cơ thể thích nghi'],
      cons: ['Kết quả chậm đòi hỏi kiên nhẫn', 'Cần theo dõi định kỳ'],
    },
    adjust: {
      title: 'Điều Chỉnh Calo', value: `${s.goal.delta >= 0 ? '+' : ''}${s.goal.delta} kcal`, note: 'so với TDEE',
      params: [
        { label: 'TDEE', value: `${s.tdee.toLocaleString()} kcal`, pct: 100 },
        { label: 'Mục tiêu', value: `${s.targetKcal.toLocaleString()} kcal`, pct: Math.round(s.targetKcal/s.tdee*100), color: s.goal.color },
        { label: 'Delta/tuần', value: `${Math.abs(s.goal.delta * 7).toLocaleString()} kcal`, pct: Math.round(Math.abs(s.goal.delta)/500*100) },
      ],
      analysis: `${s.goal.delta >= 0 ? '+' : ''}${s.goal.delta} kcal/ngày = ${s.goal.delta * 7 >= 0 ? '+' : ''}${(s.goal.delta * 7).toLocaleString()} kcal/tuần. ${s.kgPerWeek > 0 ? `Tương đương thay đổi ~${s.kgPerWeek}kg/tuần (7700 kcal = 1kg mỡ cơ thể).` : 'Cân bằng năng lượng — không tăng không giảm.'}`,
      evaluation: { icon: '📐', label: 'Điều chỉnh vừa phải', color: '#f97316', text: `${Math.abs(s.goal.delta)} kcal/ngày là mức an toàn. Quá thấp (<200 kcal) khó thấy kết quả; quá cao (>600 kcal) dễ mất cơ.` },
      suggestions: ['Không thay đổi đột ngột quá 200 kcal/lần', 'Điều chỉnh từng bước nhỏ mỗi 2 tuần', 'Theo dõi cân + vòng eo để đánh giá'],
      pros: ['Kiểm soát chính xác theo mục tiêu', 'Linh hoạt điều chỉnh theo tiến độ'],
      cons: ['Sai số ±15% TDEE ảnh hưởng kết quả', 'Cần kiên trì theo dõi'],
    },
    speed: {
      title: 'Tốc Độ Thay Đổi', value: s.kgPerWeek > 0 ? `~${s.kgPerWeek}kg/tuần` : '±100 kcal', note: s.kgPerWeek > 0 ? 'ước tính' : 'duy trì',
      params: [
        { label: 'Thâm hụt/ngày', value: `${Math.abs(s.goal.delta)} kcal`, pct: Math.round(Math.abs(s.goal.delta)/500*100) },
        { label: 'Thâm hụt/tuần', value: `${Math.abs(s.goal.delta * 7).toLocaleString()} kcal`, pct: Math.round(Math.abs(s.goal.delta * 7)/3500*100) },
        { label: 'Tốc độ', value: `${s.kgPerWeek}kg/tuần`, pct: Math.round(s.kgPerWeek/0.75*100) },
      ],
      analysis: s.kgPerWeek > 0 ? `${Math.abs(s.goal.delta * 7).toLocaleString()} kcal/tuần ÷ 7700 kcal/kg = ${s.kgPerWeek}kg/tuần. Ngưỡng an toàn: 0.25–0.75kg/tuần. ${s.kgPerWeek > 0.75 ? 'Tốc độ này khá cao — có thể cần điều chỉnh để giảm mất cơ.' : 'Tốc độ an toàn, bảo toàn cơ bắp tốt.'}` : 'Mục tiêu duy trì — không thay đổi cân nặng đáng kể. Tốt để ổn định kết quả.',
      evaluation: { icon: s.kgPerWeek > 0 && s.kgPerWeek <= 0.75 ? '✅' : '⚠️', label: s.kgPerWeek > 0 && s.kgPerWeek <= 0.75 ? 'Tốc độ an toàn' : 'Cần theo dõi', color: s.kgPerWeek > 0 && s.kgPerWeek <= 0.75 ? '#22c55e' : '#f97316', text: `0.25–0.75kg/tuần là ngưỡng tối ưu để mất mỡ mà giữ cơ. Bạn đang ở ${s.kgPerWeek}kg/tuần.` },
      suggestions: ['Cân đo vào sáng thứ 2 mỗi tuần', 'Trung bình 4 tuần để đánh giá xu hướng', 'Điều chỉnh ±100 kcal nếu tốc độ không như mong muốn'],
      pros: ['Có thể dự đoán thời gian đạt mục tiêu', 'Bền vững và ít stress sinh lý'],
      cons: ['Ước tính — thực tế có thể khác ±30%', 'Cơ thể thích nghi làm chậm dần'],
    },
    weekly_protein: {
      title: 'Protein Tuần', value: `${s.weeklyProteinG}g`, note: `${s.proteinG}g × 7 ngày`,
      params: [
        { label: 'Mục tiêu/ngày', value: `${s.proteinG}g`, pct: 100 },
        { label: 'Tổng tuần', value: `${s.weeklyProteinG}g`, pct: 100 },
        { label: '% tổng calo tuần', value: `${s.proteinPct}%`, pct: s.proteinPct },
      ],
      analysis: `${s.weeklyProteinG}g protein trong 7 ngày. Nếu 1–2 ngày ăn ít hơn, có thể bù vào ngày khác — nhưng tốt nhất đạt đều đặn để tổng hợp cơ (MPS) liên tục. Ngày tập nên đạt đủ hoặc hơn mục tiêu.`,
      evaluation: { icon: '💪', label: 'Ưu tiên hàng đầu', color: '#84cc16', text: `Đạt đủ protein hàng tuần quan trọng hơn đếm calo. Nếu chỉ theo dõi một chỉ số, hãy theo dõi protein.` },
      suggestions: [`Mỗi ngày đạt ${s.proteinG}g protein`, 'Chuẩn bị đạm sẵn: luộc trứng, áp chảo gà', 'Sữa chua Hy Lạp là nguồn protein nhanh và tiện'],
      pros: ['Protein đủ = giữ cơ và tăng no', 'Dễ theo dõi hơn tổng calo'],
      cons: ['Cần đa dạng nguồn đạm', 'Chi phí cao hơn carb'],
    },
  };
  return map[key] || null;
}

const GOAL_PREVIEW_MAP = {
  'fat-loss':    { delta: -400, proteinMult: 2.0, sign: '−', kLabel: 'Thâm hụt' },
  'muscle-gain': { delta: +300, proteinMult: 1.8, sign: '+', kLabel: 'Thặng dư' },
  'endurance':   { delta: 0,    proteinMult: 1.5, sign: '±', kLabel: 'Cân bằng' },
  'maintenance': { delta: 0,    proteinMult: 1.7, sign: '±', kLabel: 'Cân bằng' },
};

const GOAL_ANALYSIS = {
  'fat-loss': {
    headline: 'Đốt mỡ bền vững — giữ trọn cơ bắp',
    science: 'Thâm hụt 300–500 kcal/ngày là vùng tối ưu: đủ nhanh để thấy kết quả trong 4 tuần, đủ nhỏ để cơ thể không phá cơ làm năng lượng.',
    benefits: [
      { icon: '🔥', title: 'Tốc độ giảm lý tưởng', desc: 'Thâm hụt −400 kcal = ~0.37kg mỡ/tuần. Bền vững hơn ép cân cấp tốc mà không kiệt sức.' },
      { icon: '💪', title: 'Protein cao bảo vệ cơ', desc: '2.0g/kg đảm bảo cơ thể ưu tiên đốt mỡ thay vì phá cơ khi năng lượng thiếu hụt.' },
      { icon: '🩸', title: 'Ổn định đường huyết', desc: 'Giảm carb tinh, tăng chất xơ → insulin ổn định → giảm tích mỡ mới sau bữa ăn.' },
      { icon: '⚡', title: 'Vẫn đủ sức tập', desc: 'Không cắt calo quá sâu — duy trì được cường độ cardio và gym để tối ưu đốt mỡ.' },
    ],
    caution: 'Không nên thâm hụt >600 kcal/ngày — nguy cơ mất cơ, rụng tóc và mệt mỏi mãn tính cao.',
    timeframe: '4–8 tuần thấy kết quả rõ trên cân và gương.',
  },
  'muscle-gain': {
    headline: 'Tăng cơ chất lượng — ít tích mỡ',
    science: 'Thặng dư +200–300 kcal/ngày là "lean bulk" — cung cấp đủ vật liệu xây cơ trong khi hạn chế tích mỡ thừa.',
    benefits: [
      { icon: '🏗️', title: 'Lean bulk hiệu quả', desc: '+250 kcal thặng dư nhẹ giúp tăng cơ từ từ và chất lượng, không kéo theo tăng mỡ nhanh.' },
      { icon: '🍚', title: 'Carb quanh buổi tập', desc: 'Nạp carb trước tập (năng lượng) và sau tập (phục hồi glycogen) tối đa hóa tổng hợp cơ.' },
      { icon: '😴', title: 'Cơ lớn khi ngủ', desc: 'GH và testosterone đỉnh điểm trong giấc ngủ sâu 7–9h. Thiếu ngủ cản quá trình tăng cơ.' },
      { icon: '📈', title: 'Progressive overload là chìa khoá', desc: 'Tăng tải dần mỗi tuần song song với dinh dưỡng đủ — không có tải tăng thì cơ không có lý do lớn.' },
    ],
    caution: 'Protein nên chia đều 4–5 bữa/ngày (20–40g/bữa) — quan trọng hơn tổng lượng ăn dồn 1–2 bữa.',
    timeframe: '8–12 tuần thấy thay đổi rõ về cơ bắp và sức mạnh cơ.',
  },
  'endurance': {
    headline: 'Tối ưu sức bền — hiệu suất đường dài',
    science: 'Carbohydrate là nhiên liệu ưu tiên cho hoạt động cardio >60 phút. Thiếu carb = chuột rút, tụt đường huyết, kiệt sức sớm.',
    benefits: [
      { icon: '🚴', title: 'Carb = nhiên liệu tốc độ', desc: 'Tăng carb vào ngày tập nặng để glycogen cơ và gan luôn đầy trước sự kiện dài.' },
      { icon: '💧', title: 'Điện giải quyết định hiệu suất', desc: 'Natri + kali + magie giữ co cơ ổn định, ngăn chuột rút và duy trì sức bền.' },
      { icon: '🔧', title: 'Protein phục hồi sau cardio', desc: '1.5g/kg đủ để sửa chữa vi tổn thương sợi cơ sau cardio dài mà không nặng bụng hay làm chậm tiêu hoá.' },
      { icon: '🧪', title: 'Không thử đồ mới trước thi', desc: 'Giữ chế độ ăn quen thuộc 48h trước thi đấu — đồ ăn lạ có thể gây rối loạn tiêu hoá.' },
    ],
    caution: 'Cắt carb khi đang luyện sức bền cường độ cao gây kiệt sức và giảm hiệu suất nghiêm trọng.',
    timeframe: '6–10 tuần cải thiện rõ về sức bền và thời gian phục hồi giữa các buổi.',
  },
  'maintenance': {
    headline: 'Duy trì lâu dài — tự do không lo sợ',
    science: 'Giai đoạn duy trì thường bị bỏ qua nhưng cực kỳ quan trọng: giúp cơ thể "thiết lập lại" set point và hormone sau phase giảm/tăng.',
    benefits: [
      { icon: '⚖️', title: 'Ổn định cân nặng thật', desc: 'Ăn quanh TDEE ±100 kcal giúp cơ thể giữ cân bằng nội môi và chuyển hoá không bị ức chế.' },
      { icon: '🧘', title: 'Không áp lực số calo', desc: '80/20 rule: 80% thực phẩm lành mạnh, 20% linh hoạt — đủ để sống được lâu dài không mệt mỏi.' },
      { icon: '📊', title: 'Check-in định kỳ đủ rồi', desc: 'Cân 1 lần/tuần cùng giờ cùng điều kiện — chỉ cần phát hiện xu hướng lệch ±2kg để điều chỉnh sớm.' },
      { icon: '🌱', title: 'Nền tảng cho mục tiêu tiếp', desc: 'Duy trì tốt 8–12 tuần tạo "sàn" ổn định trước khi bước vào phase giảm hoặc tăng tiếp theo.' },
    ],
    caution: 'Duy trì không có nghĩa là "ăn gì cũng được" — cần giữ thói quen nền: protein đủ, rau đủ, ít đường lỏng.',
    timeframe: 'Nên duy trì ít nhất 8–12 tuần sau mỗi phase giảm/tăng trước khi bắt đầu chu kỳ mới.',
  },
};

const GOAL_MEAL_ADAPTATIONS = {
  'fat-loss': {
    color: '#f97316',
    label: '🔥 Giảm Mỡ',
    headline: 'Điều chỉnh thực đơn cho mục tiêu Giảm Mỡ',
    summary: 'Thâm hụt ~400 kcal. Tăng protein, giảm carb tinh, ưu tiên chất xơ và rau để no lâu hơn với ít calo hơn.',
    tweaks: [
      { meal: '🌅 Sáng', icon: '⬇️', text: 'Bỏ hoặc giảm cơm/bánh mì — thay bằng trứng + rau xào. Ưu tiên protein để no lâu.' },
      { meal: '🍎 Snack', icon: '✅', text: 'Giữ snack nhẹ: 1 quả trứng luộc / hũ sữa chua Hy Lạp không đường. Tránh hoa quả nhiều đường.' },
      { meal: '☀️ Trưa', icon: '⬇️', text: 'Giảm cơm 1/3 khẩu phần. Tăng rau hấp/luộc. Protein giữ nguyên hoặc tăng nhẹ.' },
      { meal: '🍵 Snack xế', icon: '⬇️', text: 'Chỉ nên uống nước ấm / trà xanh không đường nếu không đói thật sự.' },
      { meal: '🌙 Tối', icon: '⬆️', text: 'Không ăn carb sau 19h — chỉ protein + rau. Ức đùi gà hấp + salad rau + súp rong biển.' },
    ],
    note: 'Tổng kcal thực tế nên thấp hơn TDEE của bạn ~400 kcal. Điều chỉnh khẩu phần theo số tính từ B0.',
  },
  'muscle-gain': {
    color: '#22c55e',
    label: '💪 Tăng Cơ',
    headline: 'Điều chỉnh thực đơn cho mục tiêu Tăng Cơ',
    summary: 'Thặng dư ~250 kcal. Tăng carb chất lượng quanh buổi tập, giữ protein cao, đảm bảo 4–5 bữa protein/ngày.',
    tweaks: [
      { meal: '🌅 Sáng', icon: '⬆️', text: 'Thêm 1 bát cháo yến mạch hoặc 1 phần bánh mì nguyên cám. Uống sữa tươi hoặc protein shake.' },
      { meal: '🍎 Snack sáng', icon: '⬆️', text: '1 nắm hạt hỗn hợp + 2 lát phô mai. Cung cấp chất béo tốt và protein cho buổi tập.' },
      { meal: '☀️ Trưa', icon: '⬆️', text: 'Tăng cơm lên 1.5 bát. Thêm nguồn protein thứ 2: đậu phụ hoặc cá ngừ bên cạnh thịt.' },
      { meal: '🍵 Snack xế', icon: '⬆️', text: 'Trước tập: chuối + 1 muỗng bơ đậu phộng / hoặc protein shake. Sau tập: sữa tươi không đường.' },
      { meal: '🌙 Tối', icon: '⬆️', text: 'Vẫn cần carb vừa sau tập chiều. Cơm gạo lứt + thịt bò / ức gà + bông cải xào tỏi.' },
    ],
    note: 'Mỗi bữa cần ≥20g protein. Chia protein đều 4–5 bữa hiệu quả hơn gộp vào 1–2 bữa.',
  },
  'endurance': {
    color: '#06b6d4',
    label: '🚴 Sức Bền',
    headline: 'Điều chỉnh thực đơn cho mục tiêu Sức Bền',
    summary: 'Cân bằng calo. Tăng carb phức vào ngày tập nặng, bổ sung điện giải, protein vừa đủ để phục hồi cơ.',
    tweaks: [
      { meal: '🌅 Sáng', icon: '⬆️', text: 'Carb phức là ưu tiên số 1: cháo yến mạch + chuối + mật ong. Tránh đồ chiên rán nặng bụng.' },
      { meal: '🍎 Snack sáng', icon: '✅', text: '1 gói nho khô / 1 miếng bánh nướng nguyên cám. Nạp nhanh glucose cho buổi tập dài.' },
      { meal: '☀️ Trưa', icon: '⬆️', text: 'Bữa chính nhất: cơm gạo lứt đầy đủ + protein + rau đa dạng + canh điện giải (muối + kali).' },
      { meal: '🍵 Snack xế', icon: '⬆️', text: 'Trong/sau tập dài >60 phút: uống nước điện giải + ăn 1 chuối mỗi 45 phút.' },
      { meal: '🌙 Tối', icon: '✅', text: 'Phục hồi: protein nhẹ + carb phức nhỏ + nhiều rau. Sữa chua Hy Lạp + granola trước ngủ.' },
    ],
    note: 'Ngày thi/tập dài >90 phút: tăng carb thêm 20–30%. Không thử đồ mới trước ngày thi đấu.',
  },
  'maintenance': {
    color: '#84cc16',
    label: '⚖️ Duy Trì',
    headline: 'Điều chỉnh thực đơn cho mục tiêu Duy Trì',
    summary: 'Cân bằng TDEE. Tập trung vào chất lượng và đa dạng thực phẩm, linh hoạt 80/20, không cần đếm calo chặt chẽ.',
    tweaks: [
      { meal: '🌅 Sáng', icon: '✅', text: 'Bữa sáng đa dạng mỗi ngày: thay đổi giữa trứng / cháo / bún / phở. Giữ thói quen ăn sáng đúng giờ.' },
      { meal: '🍎 Snack sáng', icon: '✅', text: '1 loại trái cây tươi theo mùa. Không cần tính calo — ưu tiên thực phẩm tự nhiên, ít chế biến.' },
      { meal: '☀️ Trưa', icon: '✅', text: 'Bữa cơm đầy đủ. 80/20 rule: 80% lành mạnh, 20% linh hoạt (có thể ăn nhà hàng 1–2 lần/tuần).' },
      { meal: '🍵 Snack xế', icon: '✅', text: 'Trà / cà phê đen / sữa chua. Ăn khi thật sự đói — không ăn vì thói quen hay buồn chán.' },
      { meal: '🌙 Tối', icon: '✅', text: 'Tối nhẹ hơn trưa. Ít carb tinh, nhiều rau và protein. Tránh ăn khuya sau 21h.' },
    ],
    note: 'Cân 1 lần/tuần, cùng giờ, cùng điều kiện. Nếu cân tăng/giảm >2kg liên tục → điều chỉnh khẩu phần.',
  },
};

function GoalsPanel({ s, activeGoal, onActiveGoalChange }) {
  const { t: tPillars } = useTranslation('pillars');
  const pillarB = tPillars('pillarB', { returnObjects: true }) || {};
  const b3tr = pillarB.b3 || {};
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [macroBars, setMacroBars] = useState([0, 0, 0]);
  const detail = selectedMetric ? b3MetricDetail(selectedMetric, s) : null;

  const preview = useMemo(() => {
    const gm = GOAL_PREVIEW_MAP[activeGoal] || GOAL_PREVIEW_MAP['maintenance'];
    const targetKcal = Math.max(1200, s.tdee + gm.delta);
    const proteinG = Math.round(s.weight * gm.proteinMult);
    const fatG = Math.round(targetKcal * 0.25 / 9);
    const carbG = Math.max(0, Math.round((targetKcal - proteinG * 4 - fatG * 9) / 4));
    const proteinPct = Math.round(proteinG * 4 / targetKcal * 100);
    const fatPct = Math.round(fatG * 9 / targetKcal * 100);
    const carbPct = Math.max(0, 100 - proteinPct - fatPct);
    const kgPerWeek = gm.delta !== 0 ? parseFloat((Math.abs(gm.delta * 7) / 7700).toFixed(2)) : 0;
    return { ...gm, targetKcal, proteinG, fatG, carbG, proteinPct, fatPct, carbPct, kgPerWeek };
  }, [activeGoal, s.tdee, s.weight]);

  useEffect(() => {
    setMacroBars([0, 0, 0]);
    const t = setTimeout(() => setMacroBars([preview.proteinPct, preview.carbPct, preview.fatPct]), 80);
    return () => clearTimeout(t);
  }, [preview]);

  const translatedGoals = GOALS.map((g, i) => ({
    ...g,
    label: tPillars(`pillarB.b3.goals.${i}.label`, { defaultValue: g.label }),
    kcal:  tPillars(`pillarB.b3.goals.${i}.kcal`,  { defaultValue: g.kcal }),
    carb:  tPillars(`pillarB.b3.goals.${i}.carb`,  { defaultValue: g.carb }),
    highlights: toArr(tPillars(`pillarB.b3.goals.${i}.highlights`, { returnObjects: true, defaultValue: g.highlights })),
  }));

  const activeG = translatedGoals.find(g => g.id === activeGoal) || GOALS.find(g => g.id === activeGoal);
  const analysis = (b3tr.goal_analysis && b3tr.goal_analysis[activeGoal]) || GOAL_ANALYSIS[activeGoal];

  const macroRows = [
    { label: 'Protein', g: preview.proteinG, pct: preview.proteinPct, color: '#f97316', formula: `${s.weight}kg × ${preview.proteinMult}g/kg`, example: b3tr.macro_protein_ex || 'ức gà, cá, trứng, đậu hũ' },
    { label: 'Carbohydrate', g: preview.carbG, pct: preview.carbPct, color: '#22c55e', formula: `(${preview.targetKcal} − P×4 − F×9) ÷ 4`, example: b3tr.macro_carb_ex || 'cơm, khoai, yến mạch' },
    { label: b3tr.fat_label || 'Chất béo', g: preview.fatG, pct: preview.fatPct, color: '#a855f7', formula: `${preview.targetKcal} × 25% ÷ 9 kcal/g`, example: b3tr.macro_fat_ex || 'dầu olive, hạt, cá béo' },
  ];

  const milestones = preview.kgPerWeek > 0
    ? [1, 2, 5, 10].map(kg => ({ kg, weeks: Math.round(kg / preview.kgPerWeek), months: parseFloat((kg / preview.kgPerWeek / 4.3).toFixed(1)) }))
    : [];

  const secDivider = (label, hex = '#f97316') => {
    const rgb = hex === '#22c55e' ? '34,197,94' : hex === '#3b82f6' ? '59,130,246' : hex === '#14b8a6' ? '20,184,166' : '249,115,22';
    return (
      <div className="flex items-center gap-3 my-7">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, rgba(${rgb},0.3))` }} />
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] whitespace-nowrap shrink-0" style={{ color: `rgba(${rgb},0.65)` }}>{label}</p>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, rgba(${rgb},0.3))` }} />
      </div>
    );
  };

  return (
    <div>
      <PersonalizedBar panelId="b3" color="#f97316" source="B0 + B1 + B2 (Inputs & Macros & Plate)"
        selectedKey={selectedMetric} onSelect={setSelectedMetric}
        items={[
        { key: 'goal',    label: b3tr.bar_goal || 'Mục tiêu', value: s.goal.label, tip: `Mục tiêu đang chọn ở B0.` },
        { key: 'adjust',  label: b3tr.bar_adjust || 'Điều chỉnh', value: `${s.goal.delta > 0 ? '+' : ''}${s.goal.delta} kcal`, note: 'vs TDEE', tip: `TDEE (${s.tdee.toLocaleString()}) ${s.goal.delta >= 0 ? '+' : ''}${s.goal.delta} = ${s.targetKcal.toLocaleString()} kcal/day.` },
        ...(s.kgPerWeek > 0
          ? [{ key: 'speed', label: b3tr.bar_speed || 'Tốc độ', value: `~${s.kgPerWeek}kg`, note: '/week', tip: `${Math.abs(s.goal.delta * 7).toLocaleString()} kcal/week ÷ 7700 = ${s.kgPerWeek}kg/week.` }]
          : [{ key: 'speed', label: b3tr.bar_balance || 'Cân bằng', value: '±100 kcal', note: 'flexible', tip: `Maintenance = eat around TDEE ±100 kcal/day.` }]),
        ...(s.weeksTo5kg ? [{ label: b3tr.bar_to_5kg || 'Đến -5kg', value: `~${s.weeksTo5kg} tuần`, note: `≈${Math.round(s.weeksTo5kg/4.3)} tháng`, tip: `Ở tốc độ ${s.kgPerWeek}kg/tuần, cần ~${s.weeksTo5kg} tuần.` }] : []),
        { key: 'weekly_protein', label: b3tr.bar_weekly_protein || 'Protein/tuần', value: `${s.weeklyProteinG}g`, note: `${s.proteinG}g × 7`, tip: `Tổng protein cần đạt trong 7 ngày.` },
      ]} />
      {detail && <MetricDetailCard detail={detail} color="#f97316" onClose={() => setSelectedMetric(null)} />}

      {/* ── Goal selector ── */}
      <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-5">{b3tr.choose_goal || 'Chọn Mục Tiêu Của Bạn'}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {translatedGoals.map(g => (
          <GoalCard key={g.id} goal={g} active={activeGoal === g.id} onClick={() => onActiveGoalChange(g.id)} />
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-white/6 bg-white/[0.015] p-4">
        <p className="text-[11px] text-muted leading-relaxed">
          <span className="text-lime-400 font-bold">{b3tr.note_label || 'Lưu ý'}:</span> {b3tr.note || 'Các con số là điểm xuất phát, không phải quy tắc cứng nhắc. Cơ thể của mỗi người phản ứng khác nhau — theo dõi 2–4 tuần rồi điều chỉnh là cách tốt nhất.'}
        </p>
      </div>

      {/* ── Goal analysis ── */}
      {secDivider(b3tr.div_effects || 'Hiệu quả & Lợi ích', activeG?.color)}
      <div key={activeGoal} className="animate-fade-in-up">
        <div className="rounded-2xl border p-5 mb-4" style={{ borderColor: `${activeG?.color}22`, background: `${activeG?.color}05` }}>
          <p className="text-sm font-bold text-text mb-1.5">{analysis.headline}</p>
          <p className="text-[10px] text-muted leading-relaxed">{analysis.science}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {analysis.benefits.map((b, i) => (
            <div key={i} className="rounded-xl border p-3.5" style={{ borderColor: `${activeG?.color}18`, background: `${activeG?.color}04` }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base leading-none">{b.icon}</span>
                <p className="text-[11px] font-bold text-text">{b.title}</p>
              </div>
              <p className="text-[10px] text-muted leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 items-start rounded-xl border p-3.5 mb-2" style={{ borderColor: 'rgba(234,179,8,0.2)', background: 'rgba(234,179,8,0.04)' }}>
          <span className="text-sm shrink-0 mt-0.5">⚠️</span>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wide text-yellow-400 mb-0.5">{b3tr.warning_label || 'Lưu ý quan trọng'}</p>
            <p className="text-[10px] text-muted leading-relaxed">{analysis.caution}</p>
          </div>
        </div>
        <p className="text-[9px] text-muted/50 text-right">⏱ {analysis.timeframe}</p>
      </div>

      {/* ── Energy balance formula ── */}
      {secDivider(b3tr.div_formula || 'Công thức năng lượng')}
      <div className="rounded-2xl border p-5 mb-2" style={{ borderColor: 'rgba(249,115,22,0.2)', background: 'rgba(249,115,22,0.03)' }}>
        <p className="text-[10px] text-muted mb-4 text-center">{b3tr.formula_note || 'Cách tính calo mục tiêu theo'} <span className="font-bold" style={{ color: activeG?.color }}>{activeG?.label}</span> — B0</p>
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          {/* BMR */}
          <div className="flex-1 text-center rounded-xl border p-3.5" style={{ borderColor: 'rgba(249,115,22,0.2)', background: 'rgba(249,115,22,0.05)' }}>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted mb-1.5">BMR</p>
            <p className="text-2xl font-black leading-none" style={{ color: '#f97316' }}>{s.bmr.toLocaleString()}</p>
            <p className="text-[9px] text-muted mt-1">{b3tr.bmr_per_day || 'kcal cơ bản/ngày'}</p>
            <div className="mt-2 text-[8px] text-muted/50 leading-relaxed border-t border-white/5 pt-2">
              Mifflin-StJeor<br/>
              {s.sex === 'male'
                ? `10×${s.weight} + 6.25×${s.height} − 5×${s.age} + 5`
                : `10×${s.weight} + 6.25×${s.height} − 5×${s.age} − 161`}
            </div>
          </div>
          {/* Arrow 1 */}
          <div className="flex sm:flex-col items-center justify-center px-1 py-1 sm:py-0">
            <div className="text-[8px] text-muted/50 mr-1 sm:mr-0 sm:mb-0.5">×{s.activity.mult.toFixed(2)}</div>
            <div className="text-xl" style={{ color: '#f97316' }}>→</div>
            <div className="text-[8px] text-muted/40 ml-1 sm:ml-0 sm:mt-0.5 max-w-[60px] text-center leading-tight hidden sm:block">{s.activity.label}</div>
          </div>
          {/* TDEE */}
          <div className="flex-1 text-center rounded-xl border p-3.5" style={{ borderColor: 'rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.07)' }}>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted mb-1.5">TDEE</p>
            <p className="text-2xl font-black leading-none" style={{ color: '#f97316' }}>{s.tdee.toLocaleString()}</p>
            <p className="text-[9px] text-muted mt-1">{b3tr.tdee_per_day || 'kcal duy trì/ngày'}</p>
            <div className="mt-2 text-[8px] text-muted/50 leading-relaxed border-t border-white/5 pt-2">
              BMR × {s.activity.mult.toFixed(2)}<br/>
              {s.bmr.toLocaleString()} × {s.activity.mult.toFixed(2)} = {s.tdee.toLocaleString()}
            </div>
          </div>
          {/* Arrow 2 */}
          <div className="flex sm:flex-col items-center justify-center px-1 py-1 sm:py-0">
            <div className="text-[8px] font-bold mr-1 sm:mr-0 sm:mb-0.5" style={{ color: preview.delta > 0 ? '#22c55e' : preview.delta < 0 ? '#f97316' : '#84cc16' }}>
              {preview.delta > 0 ? `+${preview.delta}` : preview.delta === 0 ? '±0' : preview.delta}
            </div>
            <div className="text-xl" style={{ color: activeG?.color ?? '#f97316' }}>→</div>
            <div className="text-[8px] text-muted/40 ml-1 sm:ml-0 sm:mt-0.5 max-w-[60px] text-center leading-tight hidden sm:block">{activeG?.label}</div>
          </div>
          {/* Target */}
          <div className="flex-1 text-center rounded-xl border-2 p-3.5 transition-all duration-300" style={{ borderColor: activeG?.color ?? '#f97316', background: `${activeG?.color ?? '#f97316'}18` }}>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: activeG?.color ?? '#f97316' }}>{b3tr.target_label || 'Mục tiêu'}</p>
            <p className="text-2xl font-black leading-none text-white">{preview.targetKcal.toLocaleString()}</p>
            <p className="text-[9px] mt-1" style={{ color: `${activeG?.color ?? '#f97316'}99` }}>kcal/ngày</p>
            <div className="mt-2 text-[8px] text-muted/50 leading-relaxed border-t border-white/8 pt-2">
              {s.tdee.toLocaleString()} {preview.delta >= 0 ? '+' : ''}{preview.delta}<br/>
              = {preview.targetKcal.toLocaleString()} kcal
            </div>
          </div>
        </div>
      </div>

      {/* ── Macro phân bổ ── */}
      {secDivider(b3tr.div_macro || 'Phân bổ Macro cá nhân hóa')}
      <div className="space-y-3 mb-2">
        {macroRows.map((m, i) => (
          <div key={m.label} className="rounded-xl border p-4" style={{ borderColor: `${m.color}22`, background: `${m.color}05` }}>
            <div className="flex items-start justify-between mb-2.5">
              <div>
                <p className="text-xs font-bold text-text">{m.label}</p>
                <p className="text-[9px] text-muted/60 mt-0.5">{m.formula}</p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-0.5 justify-end">
                  <span className="text-xl font-black leading-none" style={{ color: m.color }}>{m.g}</span>
                  <span className="text-[10px] text-muted">g</span>
                </div>
                <p className="text-[9px] text-muted/50">{m.pct}% kcal</p>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 mb-2 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${macroBars[i]}%`, background: m.color, opacity: 0.8 }} />
            </div>
            <p className="text-[9px] text-muted/50">{b3tr.food_source || 'Nguồn thực phẩm:'} {m.example}</p>
          </div>
        ))}
      </div>

      {/* ── Timeline ── */}
      {milestones.length > 0 && (<>
        {secDivider(b3tr.div_timeline || 'Lộ trình ước tính')}
        <div className="rounded-2xl border p-5" style={{ borderColor: 'rgba(249,115,22,0.2)', background: 'rgba(249,115,22,0.03)' }}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-text">{b3tr.milestone_title || 'Tiến độ theo mốc cân nặng'}</p>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${activeG?.color ?? '#f97316'}18`, color: activeG?.color ?? '#f97316' }}>{preview.kgPerWeek}kg/tuần</span>
          </div>
          <p className="text-[10px] text-muted mb-5">{preview.kLabel} {Math.abs(preview.delta)} kcal/ngày → {Math.abs(preview.delta * 7).toLocaleString()} kcal/tuần ÷ 7700 = {preview.kgPerWeek}kg/tuần</p>
          {/* Progress track */}
          <div className="relative mb-5">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: '100%', background: 'linear-gradient(90deg, #f97316 0%, #fbbf24 50%, #22c55e 100%)', opacity: 0.5 }} />
            </div>
            <div className="absolute -top-0.5 flex justify-between w-full">
              {milestones.map((m, i) => (
                <div key={m.kg} className="w-2.5 h-2.5 rounded-full border-2 border-bg" style={{ background: i === milestones.length - 1 ? '#22c55e' : '#f97316' }} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {milestones.map(m => (
              <div key={m.kg} className="rounded-lg p-2.5 border" style={{ borderColor: 'rgba(249,115,22,0.15)', background: 'rgba(249,115,22,0.05)' }}>
                <p className="text-base font-black leading-none" style={{ color: activeG?.color ?? '#f97316' }}>{preview.delta < 0 ? '−' : '+'}{m.kg}kg</p>
                <p className="text-[9px] text-muted mt-1">~{m.weeks} tuần</p>
                <p className="text-[8px] text-muted/40">≈{m.months}th</p>
              </div>
            ))}
          </div>
        </div>
      </>)}

      {/* ── Contextual image ── */}
      <div className="relative rounded-3xl overflow-hidden h-40 mt-8 mb-6">
        <img
          src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=70"
          alt="meal prep"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-1" style={{ color: '#f97316' }}>{tPillars('pillarB.b3.philosophy_label', { defaultValue: 'Triết lý dự án' })}</p>
          <p className="text-sm font-bold text-white leading-snug max-w-sm italic">
            "{tPillars('pillarB.b3.philosophy_motto', { defaultValue: 'Ăn tốt hơn hôm qua một chút — đủ dễ để ngày mai còn làm tiếp.' })}"
          </p>
        </div>
      </div>

      {/* ── Consistency + 80/20 cards ── */}
      <div className="grid sm:grid-cols-2 gap-4 mb-2">
        <div className="rounded-2xl border p-4" style={{ borderColor: 'rgba(249,115,22,0.2)', background: 'rgba(249,115,22,0.04)' }}>
          <p className="text-3xl font-black leading-none mb-2" style={{ color: '#f97316' }}>70%</p>
          <p className="text-xs font-bold text-text mb-1.5">{b3tr.consistency_title || 'Kiên trì vừa phải đủ thắng'}</p>
          <p className="text-[10px] text-muted leading-relaxed">{b3tr.consistency_body || 'Người duy trì 70–80% kế hoạch trong 6 tháng thường có kết quả tốt hơn người làm 100% trong 7 ngày rồi bỏ cuộc.'}</p>
        </div>
        <div className="rounded-2xl border p-4" style={{ borderColor: 'rgba(34,197,94,0.2)', background: 'rgba(34,197,94,0.04)' }}>
          <p className="text-3xl font-black leading-none mb-2" style={{ color: '#22c55e' }}>80/20</p>
          <p className="text-xs font-bold text-text mb-1.5">{b3tr.rule_8020_title || 'Quy tắc linh hoạt bền vững'}</p>
          <p className="text-[10px] text-muted leading-relaxed">{b3tr.rule_8020_body || '80% thực phẩm lành mạnh — 20% linh hoạt. Không nhất thiết phải ăn hoàn hảo mỗi ngày để có kết quả tốt dài hạn.'}</p>
        </div>
      </div>
    </div>
  );
}

function b4MetricDetail(key, s) {
  const map = {
    breakfast: {
      title: 'Bữa Sáng — Khởi Động Ngày', value: `${s.breakfastKcal} kcal`, note: '25% tổng ngày',
      params: [
        { label: 'Calo', value: `${s.breakfastKcal} kcal`, pct: 25 },
        { label: 'Protein', value: `${s.breakfastProteinG}g`, pct: Math.round(s.breakfastProteinG/s.proteinG*100) },
        { label: 'Carb', value: `${s.breakfastCarbG}g`, pct: Math.round(s.breakfastCarbG/s.carbG*100) },
      ],
      analysis: `25% tổng calo = ${s.breakfastKcal} kcal. Bữa sáng ổn định đường huyết và trao đổi chất buổi sáng. Ví dụ: ${Math.round(s.breakfastProteinG/0.13)} g trứng (${Math.round(s.breakfastProteinG/0.13/50)} quả) + ${Math.round(s.breakfastCarbG/0.42)} g bánh mì nguyên cám.`,
      evaluation: { icon: '🌅', label: 'Bữa khởi động', color: '#f97316', text: 'Bữa sáng không cần quá lớn nhưng phải có protein — giúp no đến trưa và tránh ăn bù vào bữa sau.' },
      suggestions: ['Ưu tiên protein + chất xơ buổi sáng', `Ví dụ: trứng + yến mạch = ~${s.breakfastProteinG}g protein`, 'Chuẩn bị overnight oats tối hôm trước nếu bận'],
      pros: ['Ổn định đường huyết cả buổi sáng', 'Giảm thèm ăn buổi trưa'],
      cons: ['Nhiều người không đói sáng sớm', 'Cần thời gian chuẩn bị'],
    },
    lunch: {
      title: 'Bữa Trưa — Bữa Lớn Nhất', value: `${s.lunchKcal} kcal`, note: '35% tổng ngày',
      params: [
        { label: 'Calo', value: `${s.lunchKcal} kcal`, pct: 35, color: '#22c55e' },
        { label: 'Protein', value: `${s.lunchProteinG}g`, pct: Math.round(s.lunchProteinG/s.proteinG*100) },
        { label: 'Carb (nhiều nhất)', value: `${s.lunchCarbG}g`, pct: Math.round(s.lunchCarbG/s.carbG*100), color: '#22c55e' },
      ],
      analysis: `35% tổng calo = ${s.lunchKcal} kcal — bữa lớn nhất vì insulin nhạy cảm nhất ban ngày, tiêu hóa carb hiệu quả hơn. Carb nhiều nhất (${s.lunchCarbG}g) cung cấp năng lượng cho buổi chiều và tập luyện.`,
      evaluation: { icon: '☀️', label: 'Bữa quan trọng nhất', color: '#22c55e', text: 'Bữa trưa nên là bữa đầy đủ nhất — protein đủ, carb đủ, rau đủ. Không bỏ bữa trưa khi bận.' },
      suggestions: [`Cơm + thịt/cá + rau = ${s.lunchKcal} kcal`, 'Ăn rau trước carb để giảm đường huyết', 'Cơm văn phòng: chọn phần có đủ 3 nhóm'],
      pros: ['Thời điểm tốt nhất dung nạp carb', 'No chiều tránh ăn vặt'],
      cons: ['Khó kiểm soát khi ăn ngoài', 'Dễ ăn thừa nếu không chú ý'],
    },
    dinner: {
      title: 'Bữa Tối — Nhẹ Hơn Bữa Trưa', value: `${s.dinnerKcal} kcal`, note: '30% tổng ngày',
      params: [
        { label: 'Calo', value: `${s.dinnerKcal} kcal`, pct: 30 },
        { label: 'Protein', value: `${s.dinnerProteinG}g`, pct: Math.round(s.dinnerProteinG/s.proteinG*100) },
        { label: 'Carb (ít hơn trưa)', value: `${s.dinnerCarbG}g`, pct: Math.round(s.dinnerCarbG/s.carbG*100) },
      ],
      analysis: `30% tổng calo = ${s.dinnerKcal} kcal. Carb ít hơn bữa trưa (${s.dinnerCarbG}g vs ${s.lunchCarbG}g) vì ít vận động về tối. Tăng rau xanh và protein để no lâu qua đêm mà không nặng bụng và không tích mỡ.`,
      evaluation: { icon: '🌙', label: 'Giảm carb về tối', color: '#a855f7', text: 'Bữa tối nên tập trung vào protein + rau. Nếu tập gym buổi tối thì không cần giảm carb — tăng lên để phục hồi.' },
      suggestions: [`Protein: ${s.dinnerProteinG}g + nhiều rau xanh`, 'Giảm tinh bột nếu không tập tối', 'Ăn tối trước ngủ ít nhất 2–3 tiếng'],
      pros: ['Tổng hợp protein qua đêm', 'Ít carb giúp ngủ ngon hơn'],
      cons: ['Nếu tập tối cần tăng carb lại', 'Một số người đói và ăn đêm'],
    },
    snack: {
      title: 'Snack — Ổn Định Đường Huyết', value: `${s.snackKcal} kcal`, note: `${s.snackProteinG}g protein`,
      params: [
        { label: 'Calo snack', value: `${s.snackKcal} kcal`, pct: 10 },
        { label: 'Protein', value: `${s.snackProteinG}g`, pct: Math.round(s.snackProteinG/s.proteinG*100) },
        { label: '% tổng ngày', value: '10%', pct: 10 },
      ],
      analysis: `10% tổng calo = ${s.snackKcal} kcal giữa các bữa chính. Ăn snack đúng cách tránh đói quá mức trước bữa chính và ổn định đường huyết. Lý tưởng: 1 snack buổi sáng và 1 snack xế chiều.`,
      evaluation: { icon: '🍎', label: 'Snack thông minh', color: '#06b6d4', text: `Snack ${s.snackKcal} kcal — chia 2 lần: ~${Math.round(s.snackKcal/2)} kcal buổi sáng + ~${Math.round(s.snackKcal/2)} kcal xế chiều.` },
      suggestions: ['Sữa chua + trái cây: ~150 kcal, protein cao', `Hạt điều/hạnh nhân: ~${Math.round(s.snackKcal/6)}g cho ${Math.round(s.snackKcal/2)} kcal`, 'Tránh bánh kẹo — đường huyết lên nhanh xuống nhanh'],
      pros: ['Tránh đói quá, ít ăn bù bữa chính', 'Ổn định năng lượng cả ngày'],
      cons: ['Dễ ăn vượt nếu không đo lường', 'Cần chuẩn bị sẵn để tránh mua đồ ngọt'],
    },
    daily_total: {
      title: 'Tổng Calo Ngày', value: `${s.targetKcal.toLocaleString()} kcal`, note: 'mục tiêu/ngày',
      params: [
        { label: 'Bữa sáng', value: `${s.breakfastKcal} kcal`, pct: 25 },
        { label: 'Bữa trưa', value: `${s.lunchKcal} kcal`, pct: 35, color: '#22c55e' },
        { label: 'Bữa tối', value: `${s.dinnerKcal} kcal`, pct: 30 },
        { label: 'Snack', value: `${s.snackKcal} kcal`, pct: 10 },
      ],
      analysis: `${s.breakfastKcal} + ${s.lunchKcal} + ${s.dinnerKcal} + ${s.snackKcal} = ${s.targetKcal.toLocaleString()} kcal. Sai số ±100 kcal/ngày là bình thường. Quan trọng là trung bình cả tuần gần đúng mục tiêu — không phải chính xác từng ngày.`,
      evaluation: { icon: '📊', label: 'Mục tiêu ngày', color: '#06b6d4', text: `${s.targetKcal.toLocaleString()} kcal = ${s.goal.label}. Nếu 1 ngày ăn ít hơn, có thể bù nhẹ ngày hôm sau — không cần ép ăn thêm.` },
      suggestions: [`Mục tiêu ${s.targetKcal.toLocaleString()} kcal, chấp nhận ±100 kcal`, 'Theo dõi cân hàng tuần thay vì hàng ngày', 'Điều chỉnh ±100 kcal/ngày mỗi 2 tuần nếu cần'],
      pros: ['Kế hoạch cụ thể dễ thực hiện', 'Dễ điều chỉnh theo tiến độ'],
      cons: ['Cần theo dõi đủ protein, không chỉ calo', 'Sai số thực phẩm ±10–20%'],
    },
  };
  return map[key] || null;
}

function MealsPanel({ s, activeGoal = 'maintenance' }) {
  const { t: tPillars } = useTranslation('pillars');
  const b4tr = tPillars('pillarB.b4', { returnObjects: true }) || {};
  const [activeDay, setActiveDay] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const detail = selectedMetric ? b4MetricDetail(selectedMetric, s) : null;
  const day = MEAL_DAYS[activeDay];
  const adaptation = GOAL_MEAL_ADAPTATIONS[activeGoal] || GOAL_MEAL_ADAPTATIONS['maintenance'];

  return (
    <div>
      <PersonalizedBar panelId="b4" color="#06b6d4" label={b4tr.bar_label || 'Phân Bổ Dinh Dưỡng Theo Bữa'} source="B0 + B1 + B2 + B3"
        selectedKey={selectedMetric} onSelect={setSelectedMetric}
        items={[
        { key: 'breakfast',   label: b4tr.bar_morning || '🌅 Sáng',   value: `${s.breakfastKcal}`,  note: `${s.breakfastProteinG}g P · ${s.breakfastCarbG}g C`, tip: `25% tổng kcal = ${s.breakfastKcal} kcal.` },
        { key: 'lunch',       label: b4tr.bar_noon || '☀️ Trưa',      value: `${s.lunchKcal}`,      note: `${s.lunchProteinG}g P · ${s.lunchCarbG}g C`, tip: `35% tổng kcal = ${s.lunchKcal} kcal. Bữa lớn nhất.` },
        { key: 'dinner',      label: b4tr.bar_evening || '🌙 Tối',    value: `${s.dinnerKcal}`,     note: `${s.dinnerProteinG}g P · ${s.dinnerCarbG}g C`, tip: `30% tổng kcal = ${s.dinnerKcal} kcal. Ít carb hơn trưa.` },
        { key: 'snack',       label: b4tr.bar_snack || '🍎 Snack',    value: `${s.snackKcal}`,      note: `${s.snackProteinG}g P`, tip: `10% tổng kcal = ${s.snackKcal} kcal. Chia 2 lần xế/sáng.` },
        { key: 'daily_total', label: b4tr.bar_daily || 'Tổng/ngày',   value: `${s.targetKcal.toLocaleString()}`, note: 'kcal', tip: `${s.breakfastKcal}+${s.lunchKcal}+${s.dinnerKcal}+${s.snackKcal} = ${s.targetKcal.toLocaleString()} kcal.` },
      ]} />
      {detail && <MetricDetailCard detail={detail} color="#06b6d4" onClose={() => setSelectedMetric(null)} />}

      {/* ── Goal-adaptive meal guide ── */}
      <div key={activeGoal} className="rounded-2xl border mb-6 overflow-hidden animate-fade-in-up"
        style={{ borderColor: `${adaptation.color}30`, background: `${adaptation.color}05` }}>
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${adaptation.color}99, transparent)` }} />
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full border"
              style={{ color: adaptation.color, background: `${adaptation.color}12`, borderColor: `${adaptation.color}35` }}>
              {b4tr.goal_adaptations?.[activeGoal]?.label || adaptation.label}
            </span>
            <p className="text-[10px] font-bold text-text leading-snug">{b4tr.goal_adaptations?.[activeGoal]?.headline || adaptation.headline}</p>
          </div>
          <p className="text-[10px] text-muted leading-relaxed mb-3">{b4tr.goal_adaptations?.[activeGoal]?.summary || adaptation.summary}</p>
          <div className="space-y-2">
            {adaptation.tweaks.map((t, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-xl p-2.5"
                style={{ background: `${adaptation.color}08`, border: `1px solid ${adaptation.color}15` }}>
                <span className="text-sm shrink-0 leading-none mt-0.5">{t.icon}</span>
                <div>
                  <span className="text-[10px] font-bold mr-1.5" style={{ color: adaptation.color }}>{tPillars(`pillarB.b4.goal_adaptations.${activeGoal}.tweaks.${i}.meal`, { defaultValue: t.meal })}</span>
                  <span className="text-[10px] text-muted leading-relaxed">{tPillars(`pillarB.b4.goal_adaptations.${activeGoal}.tweaks.${i}.text`, { defaultValue: t.text })}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 mt-3 rounded-xl p-2.5 border" style={{ borderColor: 'rgba(234,179,8,0.2)', background: 'rgba(234,179,8,0.05)' }}>
            <span className="text-xs shrink-0">📌</span>
            <p className="text-[10px] text-yellow-300/70 leading-relaxed">{b4tr.goal_adaptations?.[activeGoal]?.note || adaptation.note}</p>
          </div>
        </div>
      </div>

      <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">{b4tr.menu_title || 'Thực Đơn Mẫu 7 Ngày — Có Snack'}</p>

      {/* Day selector — scrollable */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {MEAL_DAYS.map((d, i) => (
            <button
              key={d.day}
              type="button"
              onClick={() => setActiveDay(i)}
              className="px-3 py-2 rounded-xl text-[10px] font-bold transition-all duration-200 border cursor-pointer shrink-0 text-center"
              style={activeDay === i
                ? { background: `${d.color}15`, borderColor: `${d.color}50`, color: d.color }
                : { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(160,160,160,0.7)' }}
            >
              <span className="block text-[8px] opacity-60 mb-0.5">{tPillars(`pillarB.b4.meal_days.${i}.day`, { defaultValue: d.day })}</span>
              <span>{tPillars(`pillarB.b4.meal_days.${i}.theme`, { defaultValue: d.theme }).split(' — ')[0]}</span>
            </button>
        ))}
      </div>

      {/* Active day content */}
      <div key={activeDay} className="animate-fade-in-up">

        {/* Day header badge */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: day.color }} />
          <span className="text-xs font-bold text-text">{tPillars(`pillarB.b4.meal_days.${activeDay}.day`, { defaultValue: day.day })}</span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ color: day.color, background: `${day.color}12`, border: `1px solid ${day.color}30` }}>{tPillars(`pillarB.b4.meal_days.${activeDay}.theme`, { defaultValue: day.theme })}</span>
        </div>

        {/* Meals */}
        <div className="space-y-3 mb-5">
          {day.meals.map((meal, i) => (
            <div
              key={meal.time}
              className="rounded-2xl border border-border/40 bg-surface/15 overflow-hidden"
              style={{ animationDelay: `${i * 45}ms`, animationFillMode: 'both' }}
            >
              <div className="h-[1.5px]" style={{ background: `linear-gradient(90deg, ${meal.timeColor}99, transparent)` }} />
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full border"
                    style={{ color: meal.timeColor, background: `${meal.timeColor}12`, borderColor: `${meal.timeColor}35` }}>
                    {b4tr.meal_time_map?.[meal.time] || meal.time}
                  </span>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ color: '#84cc16', background: 'rgba(132,204,22,0.08)', border: '1px solid rgba(132,204,22,0.2)' }}>
                      P {meal.protein}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ color: '#f97316', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                      {meal.kcal} kcal
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {meal.items.map((item, j) => (
                    <span key={j} className="text-[11px] text-text/80 bg-white/[0.04] border border-white/8 px-2.5 py-1 rounded-lg">
                      {tPillars(`pillarB.b4.meal_days.${activeDay}.meals.${i}.items.${j}`, { defaultValue: item })}
                    </span>
                  ))}
                </div>
                <div className="flex items-start gap-2 text-[10px] text-muted">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mt-0.5 text-yellow-400 shrink-0">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                  </svg>
                  <span><span className="text-yellow-400 font-semibold">{b4tr.busy_label || 'Bận rộn:'}</span> {tPillars(`pillarB.b4.meal_days.${activeDay}.meals.${i}.note`, { defaultValue: meal.note })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily total */}
        <div className="rounded-2xl border p-4 mb-6 flex items-center gap-4 flex-wrap" style={{ borderColor: `${day.color}30`, background: `${day.color}06` }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: day.color }} />
            <span className="text-xs font-bold" style={{ color: day.color }}>{b4tr.total_label || 'Tổng ngày'}</span>
          </div>
          {[
            { k: 'Kcal', v: day.totalKcal },
            { k: 'Protein', v: day.totalProtein },
            { k: b4tr.meals_label || 'Bữa', v: `${day.meals.length} ${b4tr.meals_count || 'bữa'}` },
          ].map(item => (
            <div key={item.k}>
              <span className="text-[10px] text-muted">{item.k}: </span>
              <span className="text-[11px] font-bold text-text">{item.v}</span>
            </div>
          ))}
          <p className="text-[10px] text-muted/50 ml-auto hidden sm:block">{b4tr.adjust_note || 'Điều chỉnh lượng theo TDEE của bạn ở B0'}</p>
        </div>

        {/* Daily analysis */}
        <div className="rounded-2xl border p-5" style={{ borderColor: `${day.color}22`, background: `${day.color}04` }}>
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-bold text-text leading-snug pr-3">{tPillars(`pillarB.b4.meal_days.${activeDay}.analysis_headline`, { defaultValue: day.analysis.headline })}</p>
            <div className="shrink-0 text-right">
              <p className="text-[9px] text-muted mb-1">{tPillars(`pillarB.b4.meal_days.${activeDay}.analysis_score`, { defaultValue: day.analysis.score.label })}</p>
              <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${day.analysis.score.pct}%`, background: day.color }} />
              </div>
              <p className="text-[10px] font-black mt-0.5" style={{ color: day.color }}>{day.analysis.score.pct}%</p>
            </div>
          </div>
          <p className="text-[9px] font-bold mb-2.5" style={{ color: `${day.color}99` }}>🌿 {tPillars(`pillarB.b4.meal_days.${activeDay}.analysis_fiber`, { defaultValue: day.analysis.fiber })}</p>
          <p className="text-[10px] text-muted leading-relaxed mb-4">{tPillars(`pillarB.b4.meal_days.${activeDay}.analysis_highlight`, { defaultValue: day.analysis.highlight })}</p>
          <ul className="space-y-1.5 mb-4">
            {day.analysis.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-[10px] text-muted">
                <span className="font-bold shrink-0 mt-0.5" style={{ color: day.color }}>✓</span>
                <span>{tPillars(`pillarB.b4.meal_days.${activeDay}.analysis_benefits.${i}`, { defaultValue: b })}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-start gap-2.5 rounded-xl border p-3" style={{ borderColor: `${day.color}18`, background: `${day.color}06` }}>
            <span className="text-base shrink-0">💡</span>
            <p className="text-[10px] text-muted leading-relaxed">{tPillars(`pillarB.b4.meal_days.${activeDay}.analysis_tip`, { defaultValue: day.analysis.tip })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tracking Tab Card — orbit ring + 3D tilt + gleam ────────────────────────
function TrackingTabCard({ section, active, onClick }) {
  const ref = useRef(null);
  const [hov, setHov] = useState(false);
  const [gleam, setGleam] = useState(0);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top)  / r.height;
    el.style.setProperty('--mx', `${Math.round(x * 100)}%`);
    el.style.setProperty('--my', `${Math.round(y * 100)}%`);
    el.style.setProperty('--tx', `${(x - 0.5) * -9}deg`);
    el.style.setProperty('--ty', `${(y - 0.5) *  7}deg`);
  }, []);

  const onEnter = useCallback(() => { setHov(true); setGleam(g => g + 1); }, []);
  const onLeave = useCallback(() => {
    setHov(false);
    const el = ref.current;
    if (el) { el.style.setProperty('--tx', '0deg'); el.style.setProperty('--ty', '0deg'); }
  }, []);

  const c = section.color;
  const showOrbit = active || hov;

  // Light title color per section when active
  const titleColor = active
    ? (c === '#84cc16' ? '#bef264' : c === '#06b6d4' ? '#67e8f9' : '#fed7aa')
    : (hov ? '#f1f5f9' : '#94a3b8');

  return (
    <div
      className={`rounded-2xl p-[1.5px] cursor-pointer transition-all duration-300 ${showOrbit ? section.orbitClass : ''}`}
      style={!showOrbit ? { background: active ? `${c}30` : 'rgba(255,255,255,0.07)' } : undefined}
      onClick={onClick}
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="rounded-2xl overflow-hidden relative"
        style={{
          background: active ? `color-mix(in srgb, ${c} 6%, #0a0a0a)` : '#0d0d0d',
          transform: 'perspective(700px) rotateY(var(--tx,0deg)) rotateX(var(--ty,0deg))',
          transition: 'transform 0.15s ease-out, background 0.3s, box-shadow 0.3s',
          boxShadow: active
            ? `0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px ${c}20, 0 0 32px ${c}18`
            : hov
              ? `0 8px 24px rgba(0,0,0,0.35), 0 0 18px ${c}12`
              : 'none',
        }}
      >
        {/* Gleam sweep */}
        <div key={gleam} className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-10">
          {hov && (
            <div
              className="absolute inset-y-0"
              style={{
                width: '55%', left: '-55%',
                background: `linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.05) 50%,${c}09 55%,transparent 70%)`,
                animation: 'pbGleam 0.95s ease-out forwards',
              }}
            />
          )}
        </div>

        {/* Mouse spotlight */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl z-10 transition-opacity duration-300"
          style={{
            opacity: hov ? 1 : 0,
            background: `radial-gradient(circle at var(--mx,50%) var(--my,50%),${c}1a 0%,transparent 58%)`,
          }}
        />

        {/* Image header */}
        <div className="relative h-28 overflow-hidden">
          <img
            src={section.image}
            alt={section.label}
            className="w-full h-full object-cover transition-all duration-500"
            style={{
              filter: `brightness(${active ? 0.7 : hov ? 0.55 : 0.38}) saturate(${active ? 1.1 : 0.8})`,
              transform: hov ? 'scale(1.05)' : 'scale(1)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, transparent 30%, ${active ? c + '22' : 'rgba(13,13,13,0.88)'} 100%)` }}
          />

          {/* Emoji badge */}
          <div
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-xl flex items-center justify-center text-base transition-all duration-300"
            style={{
              background: `${c}22`,
              border: `1px solid ${c}45`,
              backdropFilter: 'blur(6px)',
              transform: active ? 'scale(1.1) rotate(-5deg)' : 'scale(1)',
            }}
          >
            {section.emoji}
          </div>

          {/* Active live dot */}
          {active && (
            <div
              className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full"
              style={{ background: `${c}20`, border: `1px solid ${c}40`, backdropFilter: 'blur(4px)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c }} />
              <span className="text-[9px] font-bold" style={{ color: c }}>ACTIVE</span>
            </div>
          )}

          {/* Bottom color bleed */}
          <div
            className="absolute bottom-0 left-0 right-0 h-8 transition-opacity duration-300"
            style={{ opacity: active ? 1 : 0, background: `linear-gradient(to top, ${c}14, transparent)` }}
          />
        </div>

        {/* Card body */}
        <div className="p-4 relative z-10">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <p className="text-xs font-bold leading-snug transition-colors duration-200" style={{ color: titleColor }}>
              {section.label}
            </p>
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 transition-all duration-200"
              style={{ color: c, background: `${c}18`, border: `1px solid ${c}35` }}
            >
              {section.badge}
            </span>
          </div>
          <p className="text-[10px] text-muted leading-relaxed">{section.desc}</p>

          {!active && (
            <div className="mt-3 flex items-center gap-1" style={{ color: `${c}70` }}>
              <span className="text-[10px] font-semibold">Xem chi tiết</span>
              <span className="text-xs">→</span>
            </div>
          )}
        </div>

        {/* Bottom accent bar */}
        <div
          className="h-[2px] transition-all duration-500"
          style={{ background: active ? `linear-gradient(90deg,${c}cc,${c}22)` : 'transparent' }}
        />
      </div>
    </div>
  );
}

// ─── Checklist Item — 3D tilt + mouse-follow glow ────────────────────────────
function ChecklistItem3D({ item, checked, onClick }) {
  const ref = useRef(null);
  const [hov, setHov] = useState(false);
  const [gleam, setGleam] = useState(0);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top)  / r.height;
    el.style.setProperty('--mx', `${Math.round(x * 100)}%`);
    el.style.setProperty('--my', `${Math.round(y * 100)}%`);
    el.style.setProperty('--tx', `${(x - 0.5) * -10}deg`);
    el.style.setProperty('--ty', `${(y - 0.5) *   7}deg`);
  }, []);

  const onEnter = useCallback(() => { setHov(true); setGleam(g => g + 1); }, []);
  const onLeave = useCallback(() => {
    setHov(false);
    const el = ref.current;
    if (el) { el.style.setProperty('--tx', '0deg'); el.style.setProperty('--ty', '0deg'); }
  }, []);

  const c = item.color;

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer overflow-hidden"
      style={{
        borderColor: hov ? `${c}70` : checked ? `${c}45` : 'rgba(255,255,255,0.08)',
        background: hov
          ? `color-mix(in srgb, ${c} 9%, #0d0d0d)`
          : checked
            ? `${c}09`
            : 'rgba(255,255,255,0.015)',
        transform: 'perspective(500px) rotateY(var(--tx,0deg)) rotateX(var(--ty,0deg))',
        transition: 'border-color 0.18s, background 0.18s, box-shadow 0.18s, transform 0.1s ease-out',
        boxShadow: hov
          ? `0 10px 28px rgba(0,0,0,0.45), 0 0 24px ${c}22, inset 0 1px 0 ${c}18`
          : checked
            ? `0 0 14px ${c}15`
            : 'none',
      }}
    >
      {/* Mouse-follow radial light */}
      {hov && (
        <div className="absolute inset-0 pointer-events-none rounded-xl z-0"
          style={{ background: `radial-gradient(circle at var(--mx,50%) var(--my,50%), ${c}22 0%, transparent 65%)` }} />
      )}

      {/* Gleam streak on enter */}
      <div key={gleam} className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden z-0"
        style={{ animation: gleam > 0 ? 'ci-gleam 0.55s ease-out forwards' : 'none' }}>
        <div className="absolute top-0 bottom-0 w-8 -skew-x-12"
          style={{ background: `linear-gradient(90deg, transparent, ${c}28, transparent)`, left: '-2rem', animation: gleam > 0 ? 'ci-streak 0.55s ease-out forwards' : 'none' }} />
      </div>

      {/* Check circle */}
      <div className="relative z-10 shrink-0 transition-all duration-200"
        style={{
          width: '20px', height: '20px', borderRadius: '50%',
          border: `2px solid ${checked ? c : hov ? `${c}90` : 'rgba(255,255,255,0.2)'}`,
          background: checked ? c : 'transparent',
          boxShadow: checked ? `0 0 10px ${c}60` : hov ? `0 0 8px ${c}35` : 'none',
          transform: checked ? 'scale(1.1)' : hov ? 'scale(1.05)' : 'scale(1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        {checked && (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '10px', height: '10px' }}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </div>

      {/* Dot + label */}
      <div className="relative z-10 flex items-center gap-2 flex-1 min-w-0">
        <div className="rounded-full shrink-0 transition-all duration-200"
          style={{
            width: hov ? '9px' : '6px',
            height: hov ? '9px' : '6px',
            background: c,
            boxShadow: hov ? `0 0 10px ${c}90` : checked ? `0 0 5px ${c}55` : 'none',
            transition: 'width 0.2s, height 0.2s, box-shadow 0.2s',
          }} />
        <span style={{
          fontSize: '11px',
          lineHeight: '1.4',
          fontWeight: hov && !checked ? 700 : 500,
          color: checked
            ? 'rgba(100,100,100,0.45)'
            : hov
              ? c
              : 'rgba(160,160,160,0.85)',
          textDecoration: checked ? 'line-through' : 'none',
          textShadow: hov && !checked ? `0 0 14px ${c}90` : 'none',
          transition: 'color 0.18s, text-shadow 0.18s, font-weight 0.18s',
        }}>
          {item.label}
        </span>
      </div>
    </button>
  );
}

// ─── Tracking Sub-Panels ──────────────────────────────────────────────────────

const DAILY_SCIENCE = [
  {
    icon: '💪', color: '#84cc16',
    title: 'Protein → TEF cao nhất',
    formula: 'TEF protein = 25–30% kcal nạp vào',
    text: 'Mỗi 100g protein nạp vào → cơ thể đốt thêm 25–30 kcal ngay khi tiêu hóa. Ăn đủ protein = đốt calo liên tục suốt ngày, không cần tập thêm.',
  },
  {
    icon: '🌿', color: '#22c55e',
    title: 'Chất xơ → no lâu tự nhiên',
    formula: '2 phần rau ≈ 6–10g chất xơ/ngày',
    text: 'Mục tiêu: 25–35g chất xơ/ngày. Chất xơ làm chậm hấp thu đường → ổn định insulin → giảm thèm ăn xế chiều. Rau củ chứa 3–5g chất xơ/100g.',
  },
  {
    icon: '💧', color: '#06b6d4',
    title: 'Nước → hiệu suất não & cơ',
    formula: 'Thiếu 1–2% nước → giảm 10–15% sức mạnh',
    text: 'Nước tiểu vàng nhạt như nước chanh nhạt = đủ nước. Vàng đậm = thiếu. Uống 1 ly ngay khi thức dậy, 1 ly trước mỗi bữa, 1 ly sau tập.',
  },
  {
    icon: '🧮', color: '#a855f7',
    title: 'Vi điều chỉnh — không đại tu',
    formula: 'Không tiến bộ 2 tuần → ±100–150 kcal',
    text: '"Đều quan trọng hơn hoàn hảo." 70–80% kế hoạch trong 6 tháng luôn tốt hơn 100% trong 7 ngày rồi bỏ. Chỉ thay đổi 1 biến tại một thời điểm.',
  },
];

const DAILY_FORMULAS = [
  { label: 'Protein mục tiêu', formula: 'Cân nặng (kg) × 1.6–2.0', unit: 'g/ngày', color: '#84cc16', example: 'VD: 70kg × 1.8 = 126g/ngày' },
  { label: 'Nước uống', formula: 'Cân nặng (kg) × 35ml', unit: 'ml/ngày', color: '#06b6d4', example: 'VD: 70kg × 35 = 2,450ml = ~10 ly' },
  { label: 'Kcal tối thiểu', formula: 'TDEE − 500 kcal', unit: 'kcal/ngày', color: '#f97316', example: 'Không nên ăn dưới TDEE − 500' },
  { label: 'Số bữa protein', formula: '4–5 bữa, mỗi bữa ≥20g', unit: 'bữa/ngày', color: '#a855f7', example: 'Phân đều tốt hơn dồn 1–2 bữa' },
];

function DailyChecklistContent({ checked, toggle, checkedCount }) {
  const { t: tPillars } = useTranslation('pillars');
  const b5tr = tPillars('pillarB.b5', { returnObjects: true }) || {};
  const allDone = checkedCount === TRACKING_DAILY.length;
  const scorePct = Math.round((checkedCount / TRACKING_DAILY.length) * 100);
  const scoreLabel = scorePct === 100 ? (b5tr.score_perfect || 'Hoàn hảo 🏆') : scorePct >= 71 ? (b5tr.score_good || 'Tốt ✅') : scorePct >= 43 ? (b5tr.score_fair || 'Khá 📈') : (b5tr.score_building || 'Đang xây dựng 🌱');
  const scoreColor = scorePct === 100 ? '#84cc16' : scorePct >= 71 ? '#22c55e' : scorePct >= 43 ? '#06b6d4' : '#f97316';

  return (
    <div className="space-y-4">
      {/* ── Checklist card ── */}
      <div className="rounded-2xl border border-lime-500/20 bg-lime-500/4 overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-lime-500/70 via-lime-500/20 to-transparent" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-lime-500/12 border border-lime-500/30 flex items-center justify-center text-sm">✅</div>
              <span className="text-sm font-bold text-text">{b5tr.checklist_title || 'Checklist Hàng Ngày'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: scoreColor, background: `${scoreColor}12`, border: `1px solid ${scoreColor}30` }}>{scoreLabel}</span>
              <span className="text-xs font-black text-lime-400 bg-lime-500/10 border border-lime-500/25 px-2.5 py-0.5 rounded-full">
                {checkedCount}/{TRACKING_DAILY.length}
              </span>
            </div>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-5">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${scorePct}%`, background: 'linear-gradient(90deg, #84cc16, #22c55e)', boxShadow: '0 0 8px rgba(132,204,22,0.4)' }} />
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {TRACKING_DAILY.map((item, i) => (
              <ChecklistItem3D key={i} item={{ ...item, label: tPillars(`pillarB.b5.checklist_items.${i}`, { defaultValue: item.label }) }} checked={!!checked[i]} onClick={() => toggle(i)} />
            ))}
          </div>
          {allDone && (
            <div className="mt-5 flex items-center gap-3 bg-lime-500/10 border border-lime-500/25 rounded-xl px-4 py-3">
              <span className="text-xl">🎉</span>
              <p className="text-sm font-bold text-lime-300">{b5tr.done_msg || 'Hoàn thành! Thói quen nhỏ mỗi ngày tạo nên kết quả lớn.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Contextual image ── */}
      <div className="relative rounded-2xl overflow-hidden h-36">
        <img
          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=75&fit=crop"
          alt="Healthy meal prep"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/85 via-bg/40 to-transparent" />
        <div className="absolute inset-0 p-5 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime-400/80 mb-1">{tPillars('pillarB.b5.core_philosophy', { defaultValue: 'Triết lý cốt lõi' })}</p>
          <p className="text-sm font-black text-text leading-snug max-w-xs">"{tPillars('pillarB.b5.philosophy_motto', { defaultValue: 'Ăn tốt hơn hôm qua một chút, đủ dễ để ngày mai còn làm tiếp.' })}"</p>
          <p className="text-[10px] text-muted/70 mt-1.5">{tPillars('pillarB.b5.consistency_note', { defaultValue: '70% nhất quán trong 6 tháng > 100% trong 7 ngày' })}</p>
        </div>
      </div>

      {/* ── Science behind each habit ── */}
      <div>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">{b5tr.science_title || 'Khoa Học Đằng Sau'}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {DAILY_SCIENCE.map((item, i) => (
            <div key={i} className="rounded-2xl border p-4 hover:scale-[1.01] transition-all duration-200"
              style={{ borderColor: `${item.color}25`, background: `${item.color}06` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{item.icon}</span>
                <p className="text-xs font-bold leading-snug" style={{ color: item.color }}>{tPillars(`pillarB.b5.science_cards.${i}.title`, { defaultValue: item.title })}</p>
              </div>
              <div className="text-[9px] font-bold px-2 py-1 rounded-lg mb-2 font-mono"
                style={{ color: item.color, background: `${item.color}12`, border: `1px solid ${item.color}20` }}>
                📐 {tPillars(`pillarB.b5.science_cards.${i}.formula`, { defaultValue: item.formula })}
              </div>
              <p className="text-[10px] text-muted leading-relaxed">{tPillars(`pillarB.b5.science_cards.${i}.text`, { defaultValue: item.text })}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick formula reference ── */}
      <div>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">{tPillars('pillarB.b5.formulas_title', { defaultValue: 'Công Thức Tham Khảo Nhanh' })}</p>
        <div className="grid grid-cols-2 gap-2">
          {DAILY_FORMULAS.map((f, i) => (
            <div key={i} className="rounded-xl border p-3" style={{ borderColor: `${f.color}22`, background: `${f.color}05` }}>
              <p className="text-[9px] text-muted mb-1">{tPillars(`pillarB.b5.daily_formulas.${i}.label`, { defaultValue: f.label })}</p>
              <p className="text-[10px] font-black font-mono mb-1" style={{ color: f.color }}>{tPillars(`pillarB.b5.daily_formulas.${i}.formula`, { defaultValue: f.formula })}</p>
              <p className="text-[8px] text-muted/60 leading-snug">{tPillars(`pillarB.b5.daily_formulas.${i}.example`, { defaultValue: f.example })}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const WEEKLY_PROTOCOL = [
  { step: '1', icon: '⏰', color: '#06b6d4', title: 'Cùng ngày, cùng giờ', text: 'Cân mỗi tuần 1 lần vào buổi sáng, sau vệ sinh, trước ăn sáng. Cùng ngày trong tuần (VD: thứ Hai).' },
  { step: '2', icon: '⚖️', color: '#84cc16', title: 'Trung bình 3 buổi', text: 'Đo 3 buổi liên tiếp (T2, T3, T4 sáng) → lấy giá trị trung bình. Giảm nhiễu do muối/nước giữ lại.' },
  { step: '3', icon: '📏', color: '#f97316', title: 'Đo vòng eo đúng điểm', text: 'Ngang rốn, thở ra nhẹ, không hút bụng. Đo 2 lần lấy trung bình. Biến đổi vòng eo đáng tin hơn cân số.' },
  { step: '4', icon: '📓', color: '#a855f7', title: 'Ghi vào 1 nơi cố định', text: 'App Notes / Google Sheets / sổ tay. Ghi: cân nặng + vòng eo + năng lượng 1–10 + ngủ mấy tiếng.' },
];

const GOAL_WEEKLY_THRESHOLDS = {
  'fat-loss': [
    {
      metric: 'Cân nặng', icon: '⚖️', color: '#84cc16',
      context: 'Cân dao động ±1–2kg/ngày do nước, muối, glycogen — hoàn toàn bình thường. Chỉ nhìn xu hướng trung bình 3–4 tuần, không đánh giá từng ngày.',
      ok: {
        range: '±1kg/tuần', label: 'Dao động bình thường', color: '#84cc16',
        desc: 'Biến động do nước, muối và chu kỳ tiêu hóa. Không phản ánh thay đổi mỡ thật — giữ nguyên kế hoạch.',
        action: '→ Tiếp tục bình thường.',
      },
      good: {
        range: '−0.3–0.5kg/tuần', label: 'Tốc độ giảm mỡ lý tưởng ✓', color: '#22c55e',
        desc: 'Thâm hụt ~400 kcal/ngày × 7 = 2,800 kcal ≈ 0.37kg mỡ/tuần. Đủ nhanh để thấy kết quả, đủ chậm để không mất cơ.',
        action: '→ Giữ nguyên. Đây là vùng giảm mỡ bền vững.',
      },
      warn: {
        range: '−1kg+/tuần', label: 'Quá nhanh — rủi ro mất cơ', color: '#f97316',
        desc: 'Phần lớn là mất nước + mất cơ, không phải mỡ. Hệ quả lâu dài: rụng tóc, mệt mỏi mãn tính, trao đổi chất chậm lại.',
        action: '→ Tăng calo 150–200 kcal/ngày. Kiểm tra lại khẩu phần.',
      },
    },
    {
      metric: 'Vòng eo', icon: '📏', color: '#06b6d4',
      context: 'Vòng eo đáng tin cậy hơn cân số vì không bị ảnh hưởng bởi nước giữ lại. Giảm eo = tín hiệu giảm mỡ nội tạng thật sự.',
      ok: {
        range: 'Không đổi 2 tuần', label: 'Cần tái đánh giá', color: '#84cc16',
        desc: 'Có thể đang recomposition (giảm mỡ + tăng cơ cùng lúc) — cân không đổi nhưng cơ thể đang thay đổi. Kiểm tra thêm ảnh và quần áo.',
        action: '→ Giữ thêm 1–2 tuần. Vẫn không đổi → giảm calo thêm 100 kcal.',
      },
      good: {
        range: '−0.5–1cm/tuần', label: 'Giảm mỡ nội tạng thật sự ✓', color: '#22c55e',
        desc: 'Đây là chỉ số trực tiếp nhất của giảm mỡ nội tạng — loại mỡ nguy hiểm nhất cho tim mạch và chuyển hóa.',
        action: '→ Tiếp tục kế hoạch. Kết hợp cardio nhẹ để duy trì tốc độ.',
      },
      warn: {
        range: 'Tăng liên tục ≥2 tuần', label: 'Ăn thừa hoặc stress cao', color: '#f97316',
        desc: 'Cortisol cao (stress mãn tính, thiếu ngủ) kích thích tích mỡ bụng ngay cả khi calo kiểm soát tốt.',
        action: '→ Giảm carb lỏng (trà sữa, nước ngọt). Ưu tiên ngủ 7–9h. Giảm stress.',
      },
    },
    {
      metric: 'Mức năng lượng', icon: '⚡', color: '#f97316',
      context: 'Năng lượng chủ quan (1–10) phản ánh calo nạp vào, chất lượng ngủ và phục hồi — dấu hiệu sớm nhất khi kế hoạch giảm mỡ đang có vấn đề.',
      ok: { range: '6–7/10', label: 'Trong vùng an toàn', color: '#84cc16', desc: 'Cơ thể đang thích nghi với thâm hụt calo. Bình thường có buổi thấp năng lượng nhưng không liên tục.', action: '→ Ổn. Đảm bảo ngủ đủ và không cắt calo quá sâu.' },
      good: { range: '8–10/10', label: 'Giảm mỡ bền vững ✓', color: '#22c55e', desc: 'Calo đủ để tập và phục hồi. Thâm hụt nhẹ đang hoạt động tốt — cơ thể không bị stress.', action: '→ Giữ nguyên nhịp.' },
      warn: { range: '<5/10 liên tục ≥3 ngày', label: 'Thâm hụt calo quá sâu', color: '#f97316', desc: 'Khi cắt calo quá nhiều, cơ thể ưu tiên phân giải cơ để tạo năng lượng — năng lượng sụt mạnh là cảnh báo.', action: '→ Tăng calo 100–150 kcal. Kiểm tra protein ≥1.6g/kg. Giảm cường độ tập.' },
    },
  ],
  'muscle-gain': [
    {
      metric: 'Cân nặng', icon: '⚖️', color: '#22c55e',
      context: 'Tăng cơ cần thặng dư calo nhẹ — cân phải tăng dần. Mục tiêu là tăng cơ, hạn chế tích mỡ. Kiểm tra cả cân nặng lẫn vòng eo để phân biệt tăng cơ vs tăng mỡ.',
      ok: {
        range: '±1kg/tuần', label: 'Dao động bình thường', color: '#84cc16',
        desc: 'Biến động do nước, glycogen cơ bắp (mỗi gram glycogen giữ 3g nước) — đặc biệt cao khi tập nặng.',
        action: '→ Tiếp tục bình thường.',
      },
      good: {
        range: '+0.2–0.4kg/tuần', label: 'Lean bulk lý tưởng ✓', color: '#22c55e',
        desc: 'Thặng dư ~300–400 kcal/ngày. Tốc độ này tối ưu: cơ thể tổng hợp protein cơ bắp hiệu quả mà không tích mỡ quá nhanh.',
        action: '→ Giữ nguyên khẩu phần và lịch tập.',
      },
      warn: {
        range: '+0.5kg+/tuần', label: 'Đang tích mỡ quá nhanh', color: '#f97316',
        desc: 'Thặng dư calo vượt ngưỡng tổng hợp cơ bắp — phần dư được chuyển thành mỡ. Kiểm tra thêm vòng eo để xác nhận.',
        action: '→ Giảm calo 100–200 kcal/ngày. Ưu tiên ăn đúng bữa quanh buổi tập.',
      },
    },
    {
      metric: 'Vòng eo', icon: '📏', color: '#06b6d4',
      context: 'Khi bulk, vòng eo là chỉ số phân biệt "tăng cơ" vs "tăng mỡ bụng". Vòng eo ổn định khi cân tăng = đang tăng cơ tốt.',
      ok: {
        range: 'Không đổi (cân đang tăng)', label: 'Đang tăng cơ thuần ✓', color: '#22c55e',
        desc: 'Cân tăng nhưng eo không tăng = cơ thể đang phân bổ calo vào cơ bắp, không vào mỡ bụng. Đây là dấu hiệu tốt nhất khi tăng cơ.',
        action: '→ Tiếp tục. Đây là vùng lý tưởng của lean bulk.',
      },
      good: {
        range: '±0.3cm/tuần', label: 'Bulk kiểm soát tốt', color: '#84cc16',
        desc: 'Biến động nhỏ trong vòng eo khi bulk là bình thường — do tăng glycogen, nước trong cơ và khối lượng bữa ăn.',
        action: '→ Theo dõi thêm 2 tuần. Nếu xu hướng tăng đều → điều chỉnh calo.',
      },
      warn: {
        range: '+1cm+/tuần', label: 'Đang tích mỡ bụng', color: '#f97316',
        desc: 'Vòng eo tăng nhanh khi bulk = thặng dư calo đang chuyển thành mỡ nội tạng nhiều hơn cơ bắp. Cần điều chỉnh ngay.',
        action: '→ Giảm calo 200 kcal/ngày. Kiểm tra lại carb, đặc biệt đường đơn và carb lỏng.',
      },
    },
    {
      metric: 'Mức năng lượng', icon: '⚡', color: '#f97316',
      context: 'Khi tăng cơ, năng lượng cao là dấu hiệu đang ăn đủ calo và protein. Mệt mỏi kéo dài khi tập nặng thường do thiếu carb trước tập hoặc ngủ không đủ.',
      ok: { range: '6–7/10', label: 'Trong vùng chấp nhận được', color: '#84cc16', desc: 'Cơ thể đang thích nghi với lịch tập nặng và khẩu phần tăng. Năng lượng có thể dao động theo ngày tập/ngày nghỉ.', action: '→ Ổn. Đảm bảo carb đủ trước tập và ngủ 7–9h.' },
      good: { range: '8–10/10', label: 'Nền tảng tăng cơ tốt nhất ✓', color: '#22c55e', desc: 'Calo và macro đủ cho tập luyện cường độ cao. Năng lượng cao = có thể tập tiến bộ hơn tuần trước.', action: '→ Đây là tín hiệu để tăng tải tập luyện (thêm tạ, thêm set).' },
      warn: { range: '<5/10 liên tục ≥3 ngày', label: 'Thiếu năng lượng khi tăng cơ', color: '#f97316', desc: '3 nguyên nhân chính: (1) thiếu carb trước tập, (2) ngủ <7h, (3) tập quá nhiều không phục hồi đủ — đều cản trở tổng hợp protein cơ bắp.', action: '→ Tăng carb trước tập. Ưu tiên ngủ. Xem lại lịch tập/nghỉ.' },
    },
  ],
  'endurance': [
    {
      metric: 'Cân nặng', icon: '⚖️', color: '#06b6d4',
      context: 'Với sức bền, cân ổn định là lý tưởng — quá nặng giảm hiệu suất tốc độ, quá nhẹ mất sức. Cân có thể giảm nhẹ khi bắt đầu chương trình nhờ giảm mỡ nhẹ.',
      ok: {
        range: '±0.5kg/tuần', label: 'Dao động bình thường', color: '#84cc16',
        desc: 'Biến động nhỏ do nước và glycogen — đặc biệt sau buổi chạy/đạp xe dài, cơ thể giữ thêm glycogen và nước.',
        action: '→ Tiếp tục bình thường.',
      },
      good: {
        range: '0 đến −0.2kg/tuần', label: 'Cân lý tưởng cho sức bền ✓', color: '#22c55e',
        desc: 'Cân ổn định hoặc giảm rất nhẹ = cơ thể đang tối ưu hóa thành phần cơ thể mà không mất năng lượng cho tập luyện.',
        action: '→ Giữ nguyên chế độ ăn. Đây là vùng hiệu suất tối ưu.',
      },
      warn: {
        range: '−0.5kg+/tuần', label: 'Giảm quá nhanh — hụt nhiên liệu', color: '#f97316',
        desc: 'Khi cân giảm nhanh, cơ thể thiếu glycogen cho buổi tập cardio dài — hiệu suất giảm rõ, dễ chóng mặt, hụt hơi sớm hơn.',
        action: '→ Tăng carb (đặc biệt trước buổi tập dài). Kiểm tra tổng calo nạp vào.',
      },
    },
    {
      metric: 'Vòng eo', icon: '📏', color: '#06b6d4',
      context: 'Cardio đều đặn là một trong những cách hiệu quả nhất để giảm mỡ nội tạng. Vòng eo giảm dần khi tập sức bền = cơ thể đang chuyển hóa tốt.',
      ok: {
        range: 'Không đổi 2 tuần', label: 'Đang giữ ổn định', color: '#84cc16',
        desc: 'Cơ thể đang thích nghi với lịch tập. Có thể đang recomposition — mỡ giảm nhưng cơ tăng bù lại.',
        action: '→ Giữ thêm 1–2 tuần. Kiểm tra bằng ảnh và cảm giác khi mặc quần áo.',
      },
      good: {
        range: '−0.5–1cm/tuần', label: 'Cardio đang có tác dụng ✓', color: '#22c55e',
        desc: 'Giảm vòng eo khi tập sức bền = đang đốt mỡ nội tạng thật sự. Mỡ nội tạng là loại đầu tiên được huy động khi cardio cường độ vừa (zone 2).',
        action: '→ Tiếp tục lịch tập và chế độ ăn hiện tại.',
      },
      warn: {
        range: 'Tăng liên tục ≥2 tuần', label: 'Ăn bù thừa sau tập', color: '#f97316',
        desc: 'Nghiên cứu cho thấy nhiều người ăn nhiều hơn sau khi tập cardio do cơn đói tăng. Kiểm tra khẩu phần sau tập, đặc biệt là đồ ngọt và nước có đường.',
        action: '→ Ghi nhật ký ăn uống sau tập 1 tuần. Giảm carb đơn sau tập.',
      },
    },
    {
      metric: 'Mức năng lượng', icon: '⚡', color: '#f97316',
      context: 'Năng lượng là chỉ số số một cho người tập sức bền. Hụt năng lượng = thiếu carb hoặc thiếu phục hồi — ảnh hưởng trực tiếp đến hiệu suất tốc độ và thời gian.',
      ok: { range: '6–7/10', label: 'Có thể tập — chưa tối ưu', color: '#84cc16', desc: 'Đủ để hoàn thành buổi tập nhưng hiệu suất không cao nhất. Kiểm tra carb trước tập và chất lượng ngủ.', action: '→ Tăng carb phức (yến mạch, gạo lứt, khoai) vào bữa trước tập.' },
      good: { range: '8–10/10', label: 'Hiệu suất sức bền tốt nhất ✓', color: '#22c55e', desc: 'Glycogen đầy, phục hồi tốt, ngủ đủ — ba yếu tố này cùng cao = năng lượng 8–10. Đây là trạng thái lý tưởng để phá kỷ lục cá nhân.', action: '→ Đây là ngày tốt nhất để chạy dài/đạp xa/tập cường độ cao.' },
      warn: { range: '<5/10 liên tục ≥3 ngày', label: 'Thiếu glycogen hoặc chưa phục hồi', color: '#f97316', desc: 'Tập sức bền cường độ cao tiêu hao glycogen rất nhanh. Nếu không nạp lại đủ carb sau tập, glycogen tích lũy thiếu hụt qua từng ngày.', action: '→ Tăng carb 50–100g/ngày. Ưu tiên ngủ 8h. Có 1 ngày nghỉ hoàn toàn trong tuần.' },
    },
  ],
  'maintenance': [
    {
      metric: 'Cân nặng', icon: '⚖️', color: '#a855f7',
      context: 'Duy trì cân nặng không có nghĩa là cố định một con số — mà là giữ trong một "vùng lành mạnh" ổn định. Biến động ±1kg là hoàn toàn bình thường.',
      ok: {
        range: '±1kg/tuần', label: 'Dao động tự nhiên ✓', color: '#22c55e',
        desc: 'Biến động trong ngưỡng này hoàn toàn bình thường. Cơ thể tự điều chỉnh theo lượng nước, muối, carb và chu kỳ sinh học.',
        action: '→ Không cần làm gì. Đây là mục tiêu duy trì đang đạt được.',
      },
      good: {
        range: '±0.5kg/tuần (trung bình 4 tuần)', label: 'Cân ổn định hoàn toàn ✓', color: '#84cc16',
        desc: 'Xu hướng trung bình không thay đổi qua 4 tuần = chế độ ăn và vận động đang cân bằng với nhu cầu cơ thể.',
        action: '→ Giữ nguyên thói quen. Đây là sự ổn định lý tưởng.',
      },
      warn: {
        range: '±1.5kg+ liên tục ≥3 tuần', label: 'Cân đang dịch chuyển', color: '#f97316',
        desc: 'Xu hướng tăng hoặc giảm liên tục qua 3 tuần = calo đang không cân bằng với mức vận động. Cần kiểm tra lại.',
        action: '→ Xem xét thay đổi nào trong khẩu phần hoặc vận động. Điều chỉnh nhẹ 100–150 kcal/ngày.',
      },
    },
    {
      metric: 'Vòng eo', icon: '📏', color: '#06b6d4',
      context: 'Khi duy trì, vòng eo ổn định là mục tiêu chính — đặc biệt quan trọng sau tuổi 35 khi mỡ bụng có xu hướng tích tụ dù cân không đổi.',
      ok: {
        range: '±0.5cm/tuần', label: 'Ổn định bình thường ✓', color: '#22c55e',
        desc: 'Biến động nhỏ trong vòng eo là bình thường. Mục tiêu duy trì là giữ xu hướng không tăng dài hạn.',
        action: '→ Tiếp tục thói quen hiện tại.',
      },
      good: {
        range: 'Không đổi qua 4 tuần', label: 'Duy trì hoàn hảo ✓', color: '#84cc16',
        desc: 'Vòng eo không thay đổi qua 4 tuần = cơ thể đang ở trạng thái cân bằng thật sự — không tích mỡ bụng dù duy trì không nhịn ăn.',
        action: '→ Đây là mục tiêu lý tưởng. Duy trì lối sống hiện tại.',
      },
      warn: {
        range: '+1cm liên tục ≥2 tuần', label: 'Đang tích mỡ bụng dần', color: '#f97316',
        desc: 'Vòng eo tăng dần dù cân không đổi = đang mất cơ và tích mỡ cùng lúc (sarcopenic obesity). Phổ biến sau tuổi 40 khi ít vận động.',
        action: '→ Tăng tập sức mạnh 2–3 lần/tuần. Kiểm tra protein ≥1.2g/kg/ngày.',
      },
    },
    {
      metric: 'Mức năng lượng', icon: '⚡', color: '#f97316',
      context: 'Khi duy trì sức khỏe, năng lượng ổn định và cao là mục tiêu lâu dài — quan trọng hơn con số cân nặng. Năng lượng thấp kéo dài là dấu hiệu chất lượng sống đang kém.',
      ok: { range: '6–7/10', label: 'Trong vùng bình thường', color: '#84cc16', desc: 'Đủ để làm việc và vận động bình thường. Có thể cải thiện bằng cách chú ý hơn đến giấc ngủ và dinh dưỡng.', action: '→ Thử thêm rau, protein và ngủ đúng giờ. Năng lượng nên tăng sau 2 tuần.' },
      good: { range: '8–10/10', label: 'Chất lượng sống tốt ✓', color: '#22c55e', desc: 'Năng lượng cao ổn định = cơ thể đang được nuôi dưỡng và vận động đúng mức. Đây là mục tiêu thật sự của duy trì sức khỏe.', action: '→ Ghi nhận thói quen đang làm tốt để duy trì lâu dài.' },
      warn: { range: '<5/10 liên tục ≥3 ngày', label: 'Sức khỏe nền đang kém', color: '#f97316', desc: 'Năng lượng thấp mãn tính khi không có lý do rõ ràng thường do: thiếu ngủ, thiếu sắt, thiếu vitamin D, hoặc quá nhiều stress tích lũy.', action: '→ Kiểm tra giấc ngủ, dinh dưỡng và cân bằng công việc/nghỉ ngơi. Nếu kéo dài >2 tuần, tham khảo bác sĩ.' },
    },
  ],
};

const WEEKLY_THRESHOLDS = GOAL_WEEKLY_THRESHOLDS['fat-loss'];

// ─── B5 SVG Charts ────────────────────────────────────────────────────────────

function ProgressLineChart() {
  const [hoverWeek, setHoverWeek] = useState(null);
  const [entered, setEntered] = useState(false);
  useEffect(() => { const t = setTimeout(() => setEntered(true), 250); return () => clearTimeout(t); }, []);

  const W = 540, H = 210;
  const PL = 42, PR = 16, PT = 32, PB = 36;
  const cw = W - PL - PR, ch = H - PT - PB;
  const WKS = 12, YMX = 0.65, YMN = -5.5, YR = YMX - YMN;
  const xs = (i) => PL + (i / WKS) * cw;
  const ys = (v) => PT + ((YMX - v) / YR) * ch;

  const ideal      = [0,-0.38,-0.75,-1.11,-1.46,-1.80,-2.13,-2.45,-2.76,-3.06,-3.35,-3.63,-3.90];
  const aggressive = [0,-0.85,-1.65,-2.38,-3.05,-3.66,-4.20,-4.68,-5.10,-5.35,-5.45,-5.48,-5.50];
  const maintain   = [0, 0.12,-0.08, 0.15,-0.05, 0.09,-0.11, 0.14,-0.07, 0.09,-0.09, 0.11,-0.05];
  const toD = (arr) => arr.map((v, i) => `${i===0?'M':'L'} ${xs(i).toFixed(1)} ${ys(Math.max(YMN,v)).toFixed(1)}`).join(' ');
  const DASH = 900;

  return (
    <div className="rounded-2xl border border-white/6 bg-[#07090a] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-sm">📉</span>
          <div>
            <p className="text-[11px] font-bold text-text leading-none">Biểu Đồ Cân Nặng — 12 Tuần</p>
            <p className="text-[9px] text-muted mt-0.5">Hover vào đường lime để xem giá trị từng tuần</p>
          </div>
        </div>
        {/* Inline legend */}
        <div className="flex flex-col gap-1 items-end">
          {[
            { c: '#84cc16', dash: false, label: 'Lý tưởng −0.38kg/T' },
            { c: '#f97316', dash: false, label: 'Cắt mạnh −0.85kg/T' },
            { c: '#06b6d4', dash: true,  label: 'Duy trì' },
          ].map((l, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {l.dash
                ? <div className="w-4 border-b border-dashed opacity-60" style={{ borderColor: l.c }} />
                : <div className="w-4 h-[1.5px] rounded-full" style={{ background: l.c }} />}
              <span className="text-[8px]" style={{ color: `${l.c}99` }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG chart — overflow-visible so nothing clips */}
      <div className="px-2 pt-1 pb-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block', overflow: 'visible' }}>
          {/* Zone fills */}
          <path d={`${toD(ideal)} L ${xs(12).toFixed(1)} ${ys(0).toFixed(1)} L ${xs(0).toFixed(1)} ${ys(0).toFixed(1)} Z`}
            fill="rgba(132,204,22,0.06)" />
          <path d={`${toD(aggressive)} L ${xs(12).toFixed(1)} ${ys(YMN).toFixed(1)} L ${xs(0).toFixed(1)} ${ys(YMN).toFixed(1)} Z`}
            fill="rgba(249,115,22,0.05)" />

          {/* Horizontal grid */}
          {[-5,-4,-3,-2,-1,0].map(v => (
            <g key={v}>
              <line x1={PL} y1={ys(v)} x2={W-PR} y2={ys(v)}
                stroke={v===0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.035)'}
                strokeWidth={v===0 ? 0.8 : 0.6} strokeDasharray={v===0 ? '0' : '2 7'} />
              <text x={PL-6} y={ys(v)+3.5} textAnchor="end" fontSize="7.5" fill="#2e2e2e" fontFamily="monospace">{v}</text>
            </g>
          ))}
          {/* Vertical grid + x-labels */}
          {[0,3,6,9,12].map(w_ => (
            <g key={w_}>
              <line x1={xs(w_)} y1={PT-4} x2={xs(w_)} y2={H-PB+4} stroke="rgba(255,255,255,0.035)" strokeWidth="0.6" />
              <text x={xs(w_)} y={H-PB+14} textAnchor="middle" fontSize="8" fill="#2e2e2e">T{w_===0?'0':w_}</text>
            </g>
          ))}
          {/* Axis unit labels */}
          <text x={PL-6} y={PT-8} textAnchor="end" fontSize="7" fill="#252525" fontFamily="monospace">kg</text>
          <text x={W-PR} y={H-PB+14} textAnchor="end" fontSize="7" fill="#252525">tuần</text>

          {/* Zone annotation text — positioned well inside SVG bounds */}
          <text x={xs(8.2)} y={ys(-1.55)} fontSize="8" fill="rgba(132,204,22,0.55)" fontStyle="italic">✦ Vùng giảm mỡ bền vững</text>
          <text x={xs(6.8)} y={ys(-4.9)} fontSize="8" fill="rgba(249,115,22,0.55)" fontStyle="italic">⚠ Vùng nguy cơ mất cơ</text>

          {/* Lines */}
          <path d={toD(maintain)} fill="none" stroke="#06b6d4" strokeWidth="1.4" strokeDasharray="3.5 5" opacity="0.45"
            style={{ strokeDashoffset: entered ? 0 : DASH, transition: 'stroke-dashoffset 1.4s ease-out 0.5s' }} />
          <path d={toD(aggressive)} fill="none" stroke="#f97316" strokeWidth="1.8" strokeDasharray={DASH}
            style={{ strokeDashoffset: entered ? 0 : DASH, transition: 'stroke-dashoffset 1.7s ease-out 0.2s' }} />
          <path d={toD(ideal)} fill="none" stroke="#84cc16" strokeWidth="2.2" strokeDasharray={DASH}
            style={{ strokeDashoffset: entered ? 0 : DASH, transition: 'stroke-dashoffset 1.5s ease-out 0.1s' }} />

          {/* Interactive dots + hover on ideal line */}
          {ideal.map((v, i) => {
            const cx = xs(i), cy = ys(v), h = hoverWeek === i;
            const tipX = cx > W - 80 ? cx - 66 : cx - 4;
            return (
              <g key={i}>
                <rect x={xs(i)-22} y={PT} width={44} height={ch}
                  fill="transparent" style={{ cursor: 'crosshair' }}
                  onMouseEnter={() => setHoverWeek(i)} onMouseLeave={() => setHoverWeek(null)} />
                {/* Dot */}
                <circle cx={cx} cy={cy} r={h ? 5 : 2.2}
                  fill={h ? '#84cc16' : 'rgba(132,204,22,0.5)'}
                  stroke={h ? 'rgba(132,204,22,0.2)' : 'none'} strokeWidth="5"
                  style={{ transition: 'r 0.1s, fill 0.1s' }} pointerEvents="none" />
                {h && (
                  <g pointerEvents="none">
                    <line x1={cx} y1={PT} x2={cx} y2={H-PB} stroke="rgba(132,204,22,0.14)" strokeWidth="1" strokeDasharray="3 4" />
                    <rect x={tipX} y={cy-42} width="66" height="32" rx="6"
                      fill="rgba(6,12,2,0.97)" stroke="rgba(132,204,22,0.45)" strokeWidth="1" />
                    <text x={tipX+33} y={cy-26} textAnchor="middle" fontSize="11" fill="#84cc16" fontWeight="bold" fontFamily="monospace">
                      {v.toFixed(2)} kg
                    </text>
                    <text x={tipX+33} y={cy-13} textAnchor="middle" fontSize="8" fill="rgba(132,204,22,0.6)">
                      Tuần {i}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Science note */}
      <div className="mx-3 mb-3 rounded-xl border border-lime-500/12 bg-lime-500/[0.035] px-3 py-2">
        <p className="text-[9px] text-muted leading-relaxed">
          <span className="text-lime-400/90 font-bold">Công thức: </span>
          Thâm hụt 400 kcal/ngày × 7 ngày = 2,800 kcal ≈ <strong className="text-lime-400">0.36 kg mỡ/tuần</strong>.
          Duy trì 12 tuần = giảm ~4.3 kg mỡ trong khi giữ nguyên cơ bắp. Cắt calo quá mạnh = cơ thể đốt thêm cơ để lấy năng lượng — thứ khó lấy lại nhất.
        </p>
      </div>
    </div>
  );
}

function EnergyBarChart() {
  const [entered, setEntered] = useState(false);
  const [hoverDay, setHoverDay] = useState(null);
  useEffect(() => { const t = setTimeout(() => setEntered(true), 350); return () => clearTimeout(t); }, []);

  const W = 500, H = 190;
  const PL = 32, PR = 48, PT = 26, PB = 32;
  const cw = W - PL - PR, ch = H - PT - PB;
  const days   = ['T2','T3','T4','T5','T6','T7','CN'];
  const values = [7, 4, 9, 6, 8, 9, 5];
  const notes  = [
    'Ổn định — ngủ đủ giấc, ăn đúng giờ',
    'Thiếu ngủ đêm trước → uể oải cả ngày',
    'Ngủ tốt + bữa sáng đầy đủ + tập nhẹ',
    'Bỏ bữa trưa → tụt đường huyết xế chiều',
    'Ngày tập nặng, carb nạp đủ → bứt phá',
    'Nghỉ ngơi tốt, meal prep sẵn sàng',
    'Stress cuối tuần + ngủ muộn → thấp',
  ];
  const barColor = (v) => v >= 8 ? '#22c55e' : v >= 6 ? '#eab308' : '#f97316';
  const zoneLabel = (v) => v >= 8 ? 'Tốt' : v >= 6 ? 'Ổn' : 'Thấp';

  const gap = cw / days.length;
  const barW = gap * 0.50;
  const xs = (i) => PL + i * gap + gap / 2;
  const barTop = (v) => PT + (1 - v / 10) * ch;
  const barH = (v) => (v / 10) * ch;

  return (
    <div className="rounded-2xl border border-white/6 bg-[#090a09] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-sm">⚡</span>
          <div>
            <p className="text-[11px] font-bold text-text leading-none">Biểu Đồ Năng Lượng 7 Ngày</p>
            <p className="text-[9px] text-muted mt-0.5">Mục tiêu: giữ mức ≥6/10 mỗi ngày — hover để xem nguyên nhân</p>
          </div>
        </div>
        {/* Zone legend */}
        <div className="flex flex-col gap-1 items-end">
          {[['#22c55e','≥8 Tốt'],['#eab308','6–7 Ổn'],['#f97316','<6 Thấp']].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ background: c, opacity: 0.8 }} />
              <span className="text-[8px]" style={{ color: `${c}99` }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG — overflow visible, no clip */}
      <div className="px-2 pt-1 pb-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block', overflow: 'visible' }}>
          {/* Zone background bands */}
          <rect x={PL} y={PT} width={cw} height={ch * 0.2} rx="0" fill="rgba(34,197,94,0.05)" />
          <rect x={PL} y={PT + ch * 0.2} width={cw} height={ch * 0.2} fill="rgba(234,179,8,0.04)" />
          <rect x={PL} y={PT + ch * 0.4} width={cw} height={ch * 0.6} fill="rgba(249,115,22,0.035)" />

          {/* Threshold lines + y-labels */}
          {[10, 8, 6].map(v => (
            <g key={v}>
              <line x1={PL} y1={barTop(v)} x2={W-PR} y2={barTop(v)}
                stroke={v===8 ? 'rgba(34,197,94,0.25)' : v===6 ? 'rgba(249,115,22,0.25)' : 'rgba(255,255,255,0.07)'}
                strokeWidth={v===10 ? 0.5 : 0.8} strokeDasharray={v===10 ? '0' : '3 6'} />
              <text x={PL-5} y={barTop(v)+3.5} textAnchor="end" fontSize="7.5" fill="#2e2e2e" fontFamily="monospace">{v}</text>
            </g>
          ))}

          {/* Zone labels — INSIDE SVG bounds, right of plot area */}
          <text x={W-PR+6} y={PT + ch*0.1 + 3} fontSize="8" fill="rgba(34,197,94,0.6)" fontWeight="600">Tốt</text>
          <text x={W-PR+6} y={PT + ch*0.3 + 3} fontSize="8" fill="rgba(234,179,8,0.6)" fontWeight="600">Ổn</text>
          <text x={W-PR+6} y={PT + ch*0.7 + 3} fontSize="8" fill="rgba(249,115,22,0.6)" fontWeight="600">Thấp</text>

          {/* Bars */}
          {values.map((v, i) => {
            const bx = xs(i) - barW / 2;
            const by = barTop(v);
            const bh = barH(v);
            const c = barColor(v);
            const hov = hoverDay === i;
            return (
              <g key={i}>
                {/* Bar body */}
                <rect x={bx} y={entered ? by : H-PB} width={barW} height={entered ? bh : 0} rx="3.5"
                  fill={c} opacity={hov ? 0.95 : 0.68}
                  style={{
                    transformBox: 'fill-box', transformOrigin: '50% 100%',
                    transform: `scaleY(${entered ? 1 : 0})`,
                    transition: `transform 0.52s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.07}s`,
                    filter: hov ? `drop-shadow(0 0 8px ${c}bb)` : 'none',
                  }} />
                {/* Top glow cap */}
                {entered && <rect x={bx+1} y={by} width={barW-2} height="2.5" rx="2" fill={c} opacity={hov ? 1 : 0.9} />}
                {/* Value */}
                {entered && (
                  <text x={xs(i)} y={by - 5} textAnchor="middle" fontSize="10" fill={c} fontWeight="bold" fontFamily="monospace"
                    style={{ filter: hov ? `drop-shadow(0 0 4px ${c})` : 'none' }}>{v}</text>
                )}
                {/* Day label */}
                <text x={xs(i)} y={H-PB+14} textAnchor="middle" fontSize="9"
                  fill={hov ? c : 'rgba(90,90,90,0.9)'} fontWeight={hov ? 'bold' : 'normal'}
                  style={{ transition: 'fill 0.12s' }}>{days[i]}</text>
                {/* Hit area */}
                <rect x={bx-5} y={PT} width={barW+10} height={ch}
                  fill="transparent" style={{ cursor: 'default' }}
                  onMouseEnter={() => setHoverDay(i)} onMouseLeave={() => setHoverDay(null)} />
                {/* Tooltip */}
                {hov && (
                  <g pointerEvents="none">
                    <line x1={xs(i)} y1={by-2} x2={xs(i)} y2={PT+6} stroke={`${c}28`} strokeWidth="1" strokeDasharray="2 3" />
                    {(() => {
                      const tx = Math.max(PL+4, Math.min(xs(i)-68, W-PR-140));
                      return (
                        <>
                          <rect x={tx} y={PT+4} width="138" height="32" rx="6"
                            fill="rgba(6,8,6,0.97)" stroke={`${c}45`} strokeWidth="1" />
                          <text x={tx+69} y={PT+18} textAnchor="middle" fontSize="9.5" fill={c} fontWeight="bold">
                            {days[i]}: {v}/10 — {zoneLabel(v)}
                          </text>
                          <text x={tx+69} y={PT+29} textAnchor="middle" fontSize="7.5" fill="rgba(110,110,110,0.9)">
                            {notes[i].length > 32 ? notes[i].substring(0,32)+'…' : notes[i]}
                          </text>
                        </>
                      );
                    })()}
                  </g>
                )}
              </g>
            );
          })}
          {/* Baseline */}
          <line x1={PL} y1={H-PB} x2={W-PR} y2={H-PB} stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Per-day annotation grid */}
      <div className="border-t border-white/5 px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {values.map((v, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-[9px] font-black w-5 shrink-0 mt-0.5 font-mono" style={{ color: barColor(v) }}>{days[i]}</span>
            <div>
              <span className="text-[8px] font-bold mr-1" style={{ color: barColor(v) }}>{v}/10</span>
              <span className="text-[8px] text-muted leading-snug">{notes[i]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BodyCompositionChart() {
  const [entered, setEntered] = useState(false);
  const [hoverBar, setHoverBar] = useState(null);
  useEffect(() => { const t = setTimeout(() => setEntered(true), 450); return () => clearTimeout(t); }, []);

  // Illustrative body composition for ~75kg person
  const scenarios = [
    { label: 'Trước', sub: 'Ban đầu — 75 kg', color: '#64748b', fat: 16.5, muscle: 35.0, water: 23.5 },
    { label: 'Cắt bền vững', sub: 'Sau 12T lý tưởng — 70.6 kg', color: '#22c55e', fat: 12.1, muscle: 35.0, water: 23.5 },
    { label: 'Cắt quá mạnh', sub: 'Sau 12T cực đoan — 64.5 kg', color: '#f97316', fat: 9.5, muscle: 31.5, water: 23.5 },
  ];

  const W = 440, H = 200;
  const PL = 14, PR = 70, PT = 28, PB = 46;
  const cw = W - PL - PR, ch = H - PT - PB;
  const maxKg = 75;
  const gap = cw / scenarios.length;
  const barW = gap * 0.52;
  const xs = (i) => PL + i * gap + gap / 2;
  const hs = (v) => (v / maxKg) * ch;
  const COLORS = { fat: '#f97316', muscle: '#84cc16', water: '#06b6d4' };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">🏗️</span>
        <p className="text-xs font-bold text-text">Thành Phần Cơ Thể — So Sánh 3 Kịch Bản</p>
      </div>
      <p className="text-[10px] text-muted leading-relaxed mb-2">
        Cùng giảm cân nhưng <span className="text-lime-400">cắt calo đúng tốc độ = giữ được toàn bộ cơ bắp</span>.
        Cắt quá mạnh = mất thêm 3.5 kg cơ bắp — thứ rất khó lấy lại.
      </p>
      <div className="rounded-xl border border-white/7 bg-[#090909]">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block', overflow: 'visible' }}>
          {/* Y axis guides */}
          {[0, 25, 50, 75].map(v => (
            <g key={v}>
              <line x1={PL} y1={H-PB-hs(v)} x2={W-PR} y2={H-PB-hs(v)}
                stroke="rgba(255,255,255,0.04)" strokeWidth="0.7" strokeDasharray="2 5" />
              <text x={W-PR+5} y={H-PB-hs(v)+3.5} fontSize="7.5" fill="#333" fontFamily="monospace">{v} kg</text>
            </g>
          ))}
          {/* Baseline */}
          <line x1={PL} y1={H-PB} x2={W-PR} y2={H-PB} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

          {scenarios.map((s, i) => {
            const total = s.fat + s.muscle + s.water;
            const waterH = hs(s.water), muscleH = hs(s.muscle), fatH = hs(s.fat);
            const totalH = hs(total);
            const bx = xs(i) - barW / 2;
            const base = H - PB;
            const hov = hoverBar === i;
            const delay = `${i * 0.1}s`;

            return (
              <g key={i}>
                {/* Water (bottom) */}
                <rect x={bx} y={base - waterH} width={barW} height={waterH}
                  fill={COLORS.water} opacity={hov ? 0.85 : 0.6}
                  style={{ transformBox: 'fill-box', transformOrigin: '50% 100%',
                    transform: `scaleY(${entered ? 1 : 0})`,
                    transition: `transform 0.65s ease-out ${delay}` }} />
                {/* Muscle (middle) */}
                <rect x={bx} y={base - waterH - muscleH} width={barW} height={muscleH}
                  fill={COLORS.muscle} opacity={hov ? 0.92 : 0.72}
                  style={{ transformBox: 'fill-box', transformOrigin: '50% 100%',
                    transform: `scaleY(${entered ? 1 : 0})`,
                    transition: `transform 0.65s ease-out ${delay}` }} />
                {/* Fat (top) */}
                <rect x={bx} y={base - waterH - muscleH - fatH} width={barW} height={fatH} rx="3"
                  fill={COLORS.fat} opacity={hov ? 0.92 : 0.72}
                  style={{ transformBox: 'fill-box', transformOrigin: '50% 100%',
                    transform: `scaleY(${entered ? 1 : 0})`,
                    transition: `transform 0.65s ease-out ${delay}` }} />

                {/* Labels inside bars */}
                {entered && fatH > 14 && (
                  <text x={xs(i)} y={base-waterH-muscleH-fatH/2+3} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.85)" fontFamily="monospace">{s.fat.toFixed(1)}</text>
                )}
                {entered && muscleH > 14 && (
                  <text x={xs(i)} y={base-waterH-muscleH/2+3} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.7)" fontFamily="monospace">{s.muscle.toFixed(1)}</text>
                )}

                {/* Total weight on top */}
                {entered && (
                  <text x={xs(i)} y={base-totalH-8} textAnchor="middle" fontSize="10" fill={s.color} fontWeight="bold" fontFamily="monospace">
                    {total.toFixed(1)} kg
                  </text>
                )}

                {/* Scenario label + hit area */}
                <rect x={bx-6} y={PT} width={barW+12} height={H-PT-PB}
                  fill="transparent" style={{ cursor: 'default' }}
                  onMouseEnter={() => setHoverBar(i)} onMouseLeave={() => setHoverBar(null)} />
                <text x={xs(i)} y={H-PB+14} textAnchor="middle" fontSize="8.5" fill={s.color} fontWeight="bold">{s.label}</text>
                <text x={xs(i)} y={H-PB+26} textAnchor="middle" fontSize="7.5" fill="rgba(80,80,80,0.85)">{s.sub}</text>

                {/* Hover tooltip */}
                {hov && entered && (
                  <g pointerEvents="none">
                    <rect x={xs(i)-60} y={base-totalH-52} width="120" height="40" rx="5"
                      fill="rgba(8,8,8,0.97)" stroke={`${s.color}50`} strokeWidth="1" />
                    <text x={xs(i)} y={base-totalH-37} textAnchor="middle" fontSize="8.5" fill={s.color} fontWeight="bold">
                      Mỡ: {s.fat.toFixed(1)} kg · Cơ: {s.muscle.toFixed(1)} kg
                    </text>
                    <text x={xs(i)} y={base-totalH-25} textAnchor="middle" fontSize="8" fill="rgba(130,130,130,0.9)">
                      Nước: {s.water.toFixed(1)} kg · Tổng: {total.toFixed(1)} kg
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Muscle loss arrow annotation */}
          {entered && (
            <g pointerEvents="none">
              <line
                x1={xs(1) + barW/2 + 3}
                y1={H - PB - hs(scenarios[1].water) - hs(scenarios[1].muscle) / 2}
                x2={xs(2) - barW/2 - 3}
                y2={H - PB - hs(scenarios[2].water) - hs(scenarios[2].muscle) / 2}
                stroke="rgba(249,115,22,0.5)" strokeWidth="1" strokeDasharray="3 3" />
              <text
                x={xs(1) + (xs(2)-xs(1))/2}
                y={H - PB - hs(scenarios[1].water) - hs(scenarios[1].muscle)/2 - 7}
                textAnchor="middle" fontSize="8" fill="rgba(249,115,22,0.75)" fontWeight="bold">
                −3.5 kg cơ ⚠
              </text>
            </g>
          )}
        </svg>
      </div>
      {/* Legend */}
      <div className="flex gap-5 mt-2.5 px-0.5 flex-wrap">
        {[
          { c: COLORS.fat,    label: 'Mỡ cơ thể' },
          { c: COLORS.muscle, label: 'Khối cơ bắp' },
          { c: COLORS.water,  label: 'Nước cơ thể' },
        ].map((l, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm opacity-75" style={{ background: l.c }} />
            <span className="text-[9px]" style={{ color: 'rgba(140,140,140,0.85)' }}>{l.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-xl border border-orange-500/15 bg-orange-500/4 px-3 py-2">
        <p className="text-[9px] text-muted leading-relaxed">
          <span className="text-orange-400 font-bold">Tại sao mất cơ khi cắt quá mạnh? </span>
          Khi thiếu hụt &gt;600 kcal/ngày, cơ thể phân giải protein cơ bắp (gluconeogenesis) để tạo glucose. Đây là lý do protein ≥1.8g/kg và tập luyện duy trì sức mạnh là BẮT BUỘC khi giảm mỡ.
        </p>
      </div>
    </div>
  );
}

function WeeklyMetricsContent({ activeGoal = 'fat-loss' }) {
  const thresholds = GOAL_WEEKLY_THRESHOLDS[activeGoal] || GOAL_WEEKLY_THRESHOLDS['fat-loss'];
  return (
    <div className="space-y-4">
      {/* ── Main metric cards ── */}
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/4 overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-cyan-500/70 via-cyan-500/20 to-transparent" />
        <div className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/12 border border-cyan-500/30 flex items-center justify-center text-sm">📊</div>
            <span className="text-sm font-bold text-text">Theo Dõi Hàng Tuần</span>
            <span className="ml-auto text-[10px] text-cyan-400/70 font-medium">Đo mỗi tuần 1 lần</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {TRACKING_WEEKLY_RICH.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-default"
                style={{ borderColor: `${item.color}30`, background: `${item.color}07` }}>
                <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-snug" style={{ color: item.color }}>{item.label}</p>
                  <p className="text-[10px] text-muted mt-0.5 mb-2">{item.sub}</p>
                  <div className="text-[10px] leading-relaxed px-2 py-1.5 rounded-lg"
                    style={{ background: `${item.color}10`, color: `${item.color}cc`, border: `1px solid ${item.color}20` }}>
                    💡 {item.tip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contextual image ── */}
      <div className="relative rounded-2xl overflow-hidden h-36">
        <img
          src="https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=900&q=75&fit=crop"
          alt="Tracking progress"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/85 via-bg/50 to-transparent" />
        <div className="absolute inset-0 p-5 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/80 mb-1">Nguyên tắc vàng</p>
          <p className="text-sm font-black text-text leading-snug max-w-xs">Đo trung bình 3 buổi sáng liên tiếp — không đánh giá bởi 1 con số duy nhất.</p>
          <p className="text-[10px] text-muted/70 mt-1.5">Cân nặng biến động ±1–2kg/ngày là bình thường do muối & nước</p>
        </div>
      </div>

      {/* ── Measurement protocol ── */}
      <div>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">Giao Thức Đo Chuẩn</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {WEEKLY_PROTOCOL.map((p, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl border"
              style={{ borderColor: `${p.color}22`, background: `${p.color}05` }}>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ color: p.color, background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                {p.step}
              </div>
              <div>
                <p className="text-[11px] font-bold mb-0.5" style={{ color: p.color }}>{p.icon} {p.title}</p>
                <p className="text-[10px] text-muted leading-relaxed">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Result interpretation ── */}
      <div>
        {/* Section heading with goal context badge */}
        <div className="flex items-center gap-2 mb-4">
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Giải Đọc Kết Quả</p>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
            style={{ color: thresholds[0].color, background: `${thresholds[0].color}12`, borderColor: `${thresholds[0].color}28` }}>
            {{ 'fat-loss': '🔥 Giảm Mỡ', 'muscle-gain': '💪 Tăng Cơ', 'endurance': '🏃 Sức Bền', 'maintenance': '⚖️ Duy Trì' }[activeGoal]}
          </span>
          <span className="text-[9px] text-muted/60 italic">Di chuột vào thẻ để xem giải thích</span>
        </div>

        <div className="space-y-5">
          {thresholds.map((t, i) => (
            <div key={i} className="rounded-2xl border" style={{ borderColor: `${t.color}18`, background: `${t.color}03` }}>

              {/* ── Metric header ── */}
              <div className="px-4 pt-4 pb-3 flex items-start gap-3" style={{ borderBottom: `1px solid ${t.color}12` }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ background: `${t.color}14`, border: `1px solid ${t.color}22` }}>
                  {t.icon}
                </div>
                <div>
                  <p className="text-xs font-black mb-0.5" style={{ color: t.color }}>{t.metric}</p>
                  <p className="text-[10px] text-muted leading-relaxed">{t.context}</p>
                </div>
              </div>

              {/* ── Spectrum bar ── */}
              <div className="px-4 pt-3 pb-1">
                <div className="flex gap-0.5 h-1 rounded-full overflow-hidden">
                  <div className="flex-1 rounded-l-full opacity-60" style={{ background: t.ok.color }} />
                  <div className="flex-[2] opacity-90" style={{ background: t.good.color }} />
                  <div className="flex-1 rounded-r-full opacity-60" style={{ background: t.warn.color }} />
                </div>
                <div className="flex justify-between mt-0.5">
                  <span className="text-[8px] text-muted/50">ổn định</span>
                  <span className="text-[8px] font-bold" style={{ color: t.good.color }}>lý tưởng</span>
                  <span className="text-[8px] text-muted/50">cảnh báo</span>
                </div>
              </div>

              {/* ── Zone cards grid ── */}
              <div className="grid grid-cols-3 gap-2 px-3 pb-3 pt-1">
                {[t.ok, t.good, t.warn].map((band, j) => (
                  <div key={j} className="group/band relative cursor-default select-none">

                    {/* ThoughtBubble tooltip — full desc + action */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none
                      opacity-0 group-hover/band:opacity-100
                      scale-90 group-hover/band:scale-100
                      -translate-y-1 group-hover/band:translate-y-0
                      transition-all duration-200 origin-bottom w-52">
                      <ThoughtBubble
                        text={`${band.desc} ${band.action}`}
                        idx={`wt-${i}-${j}`}
                        color={band.color}
                      />
                    </div>

                    {/* Zone card */}
                    <div className="rounded-xl p-2.5 transition-all duration-200
                      group-hover/band:scale-[1.03] group-hover/band:shadow-lg"
                      style={{
                        background: `${band.color}08`,
                        border: `1px solid ${band.color}${j === 1 ? '35' : '18'}`,
                        boxShadow: j === 1 ? `0 0 12px ${band.color}18` : 'none',
                      }}>

                      {/* Status indicator row */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: band.color, boxShadow: `0 0 5px ${band.color}` }} />
                        {j === 1 && (
                          <span className="text-[7px] font-black uppercase tracking-widest"
                            style={{ color: band.color }}>Lý tưởng</span>
                        )}
                        {j === 2 && (
                          <span className="text-[7px] font-black uppercase tracking-widest text-orange-400/70">Cảnh báo</span>
                        )}
                      </div>

                      {/* Range — hero number */}
                      <p className="text-[10px] font-black font-mono leading-tight mb-1.5"
                        style={{ color: band.color }}>
                        {band.range}
                      </p>

                      {/* Label badge */}
                      <span className="inline-block text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                        style={{ color: band.color, background: `${band.color}16`, border: `1px solid ${band.color}28` }}>
                        {band.label}
                      </span>

                      {/* Action — visible on hover */}
                      <p className="text-[8px] font-semibold mt-2 leading-snug
                        opacity-0 group-hover/band:opacity-100 transition-opacity duration-150 max-h-0 group-hover/band:max-h-20 overflow-hidden"
                        style={{ color: `${band.color}cc` }}>
                        {band.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4-week mini test ── */}
      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/4 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🧪</span>
          <p className="text-xs font-bold text-yellow-300">Test 4 Tuần — Đánh Giá Tiến Bộ Thực Sự</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-2 text-[10px] text-muted">
          {[
            { week: 'Tuần 1–2', text: 'Thiết lập baseline. Ghi nhận cân nặng, vòng eo, mức năng lượng. Không thay đổi gì — chỉ quan sát.', color: '#84cc16' },
            { week: 'Tuần 3–4', text: 'Áp dụng kế hoạch đầy đủ. So sánh với baseline. Chỉ điều chỉnh nếu sau 2 tuần không có thay đổi.', color: '#06b6d4' },
          ].map((w, i) => (
            <div key={i} className="rounded-xl p-3 border" style={{ borderColor: `${w.color}20`, background: `${w.color}07` }}>
              <p className="font-black text-[10px] mb-1" style={{ color: w.color }}>{w.week}</p>
              <p className="leading-relaxed">{w.text}</p>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-yellow-300/60 mt-3 flex items-start gap-1.5">
          <span>📌</span>
          <span>Công thức: "Điều chỉnh 1 biến, chờ 2 tuần, đo lại." Không thay đổi nhiều thứ cùng lúc — không biết yếu tố nào đang tác động.</span>
        </p>
      </div>

      {/* ── Charts ── */}
      <div>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">Biểu Đồ Minh Họa</p>
        <div className="space-y-6">
          <ProgressLineChart />
          <EnergyBarChart />
          <BodyCompositionChart />
        </div>
      </div>
    </div>
  );
}

const ADJUST_DECISION = [
  {
    condition: 'Cân không giảm sau 2 tuần đầy đủ',
    icon: '⚖️', color: '#f97316',
    action: 'Giảm 100–150 kcal/ngày. Không cắt 500 kcal ngay.',
    formula: 'Calo mới = TDEE hiện tại − 150 kcal',
    note: 'Cắt quá nhiều = mất cơ + mệt + không bền.',
  },
  {
    condition: 'Năng lượng <5/10 liên tục ≥3 ngày',
    icon: '⚡', color: '#eab308',
    action: 'Tăng carb buổi sáng và trước tập. Kiểm tra ngủ.',
    formula: '+50g carb phức (yến mạch / chuối) trước tập 30–60 phút',
    note: 'Thiếu carb khi tập cường độ cao = kiệt sức sớm.',
  },
  {
    condition: 'Cân giảm nhưng vòng eo không giảm',
    icon: '📏', color: '#a855f7',
    action: 'Tăng protein → 2g/kg. Giảm carb lỏng, kiểm tra ngủ & stress.',
    formula: 'Cortisol cao (stress/thiếu ngủ) → giữ mỡ bụng dai dẳng',
    note: 'Cardio thấp cường độ đều đặn (đi bộ nhanh 30 phút/ngày) giúp nhiều hơn bạn nghĩ.',
  },
  {
    condition: 'Cơ không phát triển sau 4 tuần',
    icon: '💪', color: '#22c55e',
    action: 'Kiểm tra: tải tăng mỗi tuần chưa? Calo đủ chưa? Ngủ 7–9h chưa?',
    formula: 'Calo tăng cơ = TDEE + 150–250 kcal. Protein = 1.8–2.0g/kg',
    note: 'Không có progressive overload → cơ không có lý do để lớn.',
  },
];

const NON_SCALE_VICTORIES = [
  { icon: '🧘', text: 'Ngủ ngon hơn, dễ vào giấc hơn', color: '#a855f7' },
  { icon: '⚡', text: 'Năng lượng buổi chiều ổn định hơn', color: '#eab308' },
  { icon: '💪', text: 'Tập được nhiều hơn hoặc nặng hơn tuần trước', color: '#22c55e' },
  { icon: '🍽️', text: 'Ít thèm đồ ngọt / đồ chiên hơn', color: '#f97316' },
  { icon: '🧠', text: 'Tập trung và tâm trạng tốt hơn', color: '#06b6d4' },
  { icon: '👕', text: 'Quần áo rộng hơn ở eo / bắp tay căng hơn', color: '#84cc16' },
];

function AdjustmentContent() {
  return (
    <div className="space-y-4">
      {/* ── 6-step checklist ── */}
      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/4 overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-orange-500/70 via-orange-500/20 to-transparent" />
        <div className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-xl bg-orange-500/12 border border-orange-500/30 flex items-center justify-center text-sm">⚡</div>
            <div>
              <span className="text-sm font-bold text-text">Điều Chỉnh & Tối Ưu</span>
              <p className="text-[10px] text-orange-400/70">Áp dụng khi sau 2–4 tuần không có tiến bộ</p>
            </div>
          </div>
          <div className="space-y-3">
            {ADJUST_STEPS.map((s, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] hover:-translate-y-0.5 cursor-default"
                style={{ borderColor: `${s.color}28`, background: `${s.color}06` }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                  style={{ color: s.color, background: `${s.color}18`, border: `1px solid ${s.color}35` }}>
                  {s.n}
                </div>
                <p className="text-[11px] text-muted leading-relaxed pt-1.5">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contextual image ── */}
      <div className="relative rounded-2xl overflow-hidden h-36">
        <img
          src="https://images.unsplash.com/photo-1543362906-acfc16c67564?w=900&q=75&fit=crop"
          alt="Optimization analysis"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/85 via-bg/50 to-transparent" />
        <div className="absolute inset-0 p-5 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400/80 mb-1">Quy tắc điều chỉnh</p>
          <p className="text-sm font-black text-text leading-snug max-w-xs">Thay đổi 1 biến, đợi 2 tuần, đo lại — không thay đổi nhiều thứ cùng lúc.</p>
          <p className="text-[10px] text-muted/70 mt-1.5">Vi điều chỉnh (±100–150 kcal) bền vững hơn đại tu</p>
        </div>
      </div>

      {/* ── Decision tree ── */}
      <div>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">Sơ Đồ Quyết Định — "Nếu… Thì…"</p>
        <div className="space-y-3">
          {ADJUST_DECISION.map((d, i) => (
            <div key={i} className="rounded-2xl border overflow-hidden" style={{ borderColor: `${d.color}25`, background: `${d.color}04` }}>
              <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                <span className="text-base shrink-0">{d.icon}</span>
                <p className="text-[10px] font-bold text-muted">Nếu: <span className="text-text/80">{d.condition}</span></p>
              </div>
              <div className="px-4 pb-3 space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-black shrink-0 mt-0.5" style={{ color: d.color }}>→</span>
                  <p className="text-[11px] font-semibold text-text/90">{d.action}</p>
                </div>
                <div className="rounded-lg px-3 py-2 font-mono text-[9px] font-bold"
                  style={{ color: d.color, background: `${d.color}10`, border: `1px solid ${d.color}20` }}>
                  📐 {d.formula}
                </div>
                <p className="text-[9px] text-muted/60 italic">{d.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Non-scale victories ── */}
      <div className="rounded-2xl border border-lime-500/15 bg-lime-500/3 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🏅</span>
          <p className="text-xs font-bold text-lime-300">Tiến Bộ Không Cần Cân Số</p>
          <p className="text-[9px] text-muted ml-auto">Đây mới là tiến bộ thực sự</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {NON_SCALE_VICTORIES.map((v, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl p-2.5 border"
              style={{ borderColor: `${v.color}20`, background: `${v.color}06` }}>
              <span className="text-sm shrink-0">{v.icon}</span>
              <p className="text-[9px] text-muted leading-snug">{v.text}</p>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-lime-400/50 mt-3">
          Cân là 1 công cụ trong nhiều công cụ. Tiến bộ thực sự đến từ tổng hợp nhiều chỉ số — không phải chỉ một con số trên bàn cân.
        </p>
      </div>
    </div>
  );
}

function b5MetricDetail(key, s) {
  const map = {
    daily_protein: {
      title: 'Protein/Ngày — Ưu Tiên #1', value: `${s.proteinG}g`, note: `${(s.proteinG/s.weight).toFixed(1)}g/kg`,
      params: [
        { label: `${s.weight}kg × ${(s.proteinG/s.weight).toFixed(1)}g/kg`, value: `${s.proteinG}g`, pct: 100 },
        { label: 'Sáng + Snack', value: `${s.breakfastProteinG + s.snackProteinG}g`, pct: Math.round((s.breakfastProteinG+s.snackProteinG)/s.proteinG*100) },
        { label: 'Trưa + Tối', value: `${s.lunchProteinG + s.dinnerProteinG}g`, pct: Math.round((s.lunchProteinG+s.dinnerProteinG)/s.proteinG*100), color: '#a855f7' },
      ],
      analysis: `${s.proteinG}g/ngày là chỉ số quan trọng nhất để theo dõi. Phân bổ: sáng ${s.breakfastProteinG}g / trưa ${s.lunchProteinG}g / tối ${s.dinnerProteinG}g / snack ${s.snackProteinG}g. Đạt đủ protein hàng ngày quan trọng hơn đếm chính xác calo.`,
      evaluation: { icon: '💜', label: 'Chỉ số #1 để theo dõi', color: '#a855f7', text: `Nếu chỉ theo dõi một điều, hãy theo dõi protein. Đủ protein = giữ cơ + no lâu + đốt calo tiêu hóa cao hơn.` },
      suggestions: [`Đạt ${s.proteinG}g mỗi ngày — chia đều 4 bữa`, 'Mỗi bữa ít nhất 1 nguồn đạm', 'Trứng luộc sẵn, gà áp chảo trước cho cả tuần'],
      pros: ['TEF protein cao nhất (25–30%)', 'Bảo vệ cơ khi giảm mỡ', 'Cảm giác no lâu nhất trong 3 macro'],
      cons: ['Đắt hơn carb', 'Khó đạt khi ăn chay hoàn toàn'],
    },
    water: {
      title: 'Nước Uống Ngày', value: `${s.waterMl}ml`, note: `${Math.round(s.waterMl/250)} ly`,
      params: [
        { label: `${s.weight}kg × 35ml/kg`, value: `${s.waterMl}ml`, pct: 100 },
        { label: 'Khi tập thêm', value: '+400–600ml/giờ', pct: Math.round(500/(s.waterMl+500)*100), color: '#06b6d4' },
        { label: 'Tổng ngày tập', value: `~${s.waterMl + 500}ml`, pct: Math.round((s.waterMl+500)/3000*100) },
      ],
      analysis: `${s.waterMl}ml/ngày nghỉ ngơi. Tăng 400–600ml cho mỗi giờ tập. Uống đều trong ngày: 1 ly khi thức dậy, 1 ly trước mỗi bữa, 1 ly sau tập là cách đơn giản nhất để đạt mục tiêu.`,
      evaluation: { icon: '💧', label: `${Math.round(s.waterMl/250)} ly 250ml`, color: '#06b6d4', text: `Không uống hết trong 1–2 lần — thận chỉ xử lý ~700ml/giờ. Nước tiểu màu vàng nhạt = đủ nước.` },
      suggestions: [`Uống ${Math.round(s.waterMl/250)} ly 250ml trải đều ngày`, '1 ly ngay khi thức dậy', 'Đặt chai nước trên bàn làm việc'],
      pros: ['Cải thiện hiệu suất tập', 'Hỗ trợ tiêu hóa và trao đổi chất'],
      cons: ['Dễ quên khi bận', 'Uống quá nhiều loãng điện giải'],
    },
    steps: {
      title: 'Bước Chân/Ngày', value: `${s.dailySteps.toLocaleString()}`, note: `≈${Math.round(s.dailySteps/1400)}km`,
      params: [
        { label: 'Mục tiêu bước', value: `${s.dailySteps.toLocaleString()} bước`, pct: Math.round(s.dailySteps/15000*100) },
        { label: 'Quãng đường', value: `~${Math.round(s.dailySteps/1400)}km`, pct: Math.round(s.dailySteps/15000*100) },
        { label: 'Calo đốt thêm', value: `~${Math.round(s.dailySteps*0.045)} kcal`, pct: Math.round(s.dailySteps*0.045/200*100) },
      ],
      analysis: `${s.dailySteps.toLocaleString()} bước/ngày tương ứng mức hoạt động "${s.activity.label}". Mỗi 1000 bước ≈ 40–50 kcal. Bước chân là cách dễ nhất tăng NEAT (Non-Exercise Activity Thermogenesis) mà không cần gym.`,
      evaluation: { icon: '🚶', label: s.dailySteps >= 8000 ? 'Hoạt động tốt' : 'Cần tăng thêm', color: s.dailySteps >= 8000 ? '#22c55e' : '#f97316', text: `WHO khuyến nghị 7000–10000 bước/ngày. Bạn đang mục tiêu ${s.dailySteps.toLocaleString()} — ${s.dailySteps >= 7000 ? 'trong ngưỡng khuyến nghị.' : 'dưới mức tối ưu.'}` },
      suggestions: ['Đặt nhắc 250 bước/giờ trong giờ làm việc', 'Đi thang bộ thay thang máy', 'Đỗ xe xa hơn, đi bộ thêm 5 phút'],
      pros: ['NEAT đốt calo suốt ngày', 'Tốt cho tim mạch và khớp'],
      cons: ['Khó đạt khi công việc bàn giấy', 'Đếm bước không chính xác 100%'],
    },
    workout: {
      title: 'Thời Gian Tập Luyện', value: `${s.weeklyWorkoutMins}`, note: 'phút/tuần',
      params: [
        { label: 'Phút/tuần', value: `${s.weeklyWorkoutMins} phút`, pct: Math.round(s.weeklyWorkoutMins/450*100) },
        { label: 'Buổi/tuần', value: `${s.trainingDays} buổi`, pct: Math.round(s.trainingDays/7*100) },
        { label: 'Phút/buổi', value: s.trainingDays > 0 ? `~${Math.round(s.weeklyWorkoutMins/s.trainingDays)} phút` : 'N/A', pct: s.trainingDays > 0 ? Math.round(s.weeklyWorkoutMins/s.trainingDays/90*100) : 0 },
      ],
      analysis: `${s.weeklyWorkoutMins} phút/tuần tương ứng mức hoạt động "${s.activity.label}". WHO khuyến nghị tối thiểu 150 phút vừa hoặc 75 phút mạnh/tuần. Phân đều ${s.trainingDays > 0 ? s.trainingDays : 3} buổi tốt hơn dồn vào 1–2 buổi dài.`,
      evaluation: { icon: s.weeklyWorkoutMins >= 150 ? '✅' : '⚠️', label: s.weeklyWorkoutMins >= 150 ? 'Đạt khuyến nghị WHO' : 'Dưới mức WHO', color: s.weeklyWorkoutMins >= 150 ? '#22c55e' : '#f97316', text: `WHO: tối thiểu 150 phút/tuần cường độ vừa. Bạn đang ở ${s.weeklyWorkoutMins} phút — ${s.weeklyWorkoutMins >= 150 ? 'đạt tiêu chuẩn.' : 'cần tăng thêm.'}` },
      suggestions: [`Chia ${s.trainingDays > 0 ? s.trainingDays : 3} buổi đều trong tuần`, 'Xen kẽ sức mạnh và cardio', 'Progressive overload: tăng tải dần mỗi 1–2 tuần'],
      pros: ['Cải thiện sức khỏe tim mạch', 'Tăng BMR dài hạn qua tăng cơ'],
      cons: ['Cần thời gian phục hồi giữa buổi tập', 'Quá nhiều không phải lúc nào cũng tốt hơn'],
    },
    kcal_target: {
      title: 'Kcal Mục Tiêu', value: `${s.targetKcal.toLocaleString()} kcal`, note: s.goal.label,
      params: [
        { label: 'TDEE nền', value: `${s.tdee.toLocaleString()} kcal`, pct: 100 },
        { label: `${s.goal.label} (${s.goal.delta >= 0 ? '+' : ''}${s.goal.delta})`, value: `${s.targetKcal.toLocaleString()} kcal`, pct: Math.round(s.targetKcal/s.tdee*100), color: s.goal.color },
      ],
      analysis: `${s.targetKcal.toLocaleString()} kcal/ngày là mục tiêu tổng. Theo dõi bằng cách cân vào sáng thứ 2 mỗi tuần. Nếu cân không thay đổi sau 2 tuần, điều chỉnh ±100–200 kcal.`,
      evaluation: { icon: '🎯', label: 'Điểm kiểm tra hàng tuần', color: s.goal.color, text: 'Cân nặng không thay đổi theo kỳ vọng = cần điều chỉnh kcal. Cân biến động ±1kg/tuần là bình thường do nước.' },
      suggestions: ['Cân đo sáng thứ 2, sau vệ sinh, trước ăn', 'Điều chỉnh ±100 kcal mỗi 2 tuần nếu cần', 'Tính lại TDEE sau mỗi 5kg thay đổi cân nặng'],
      pros: ['Có mục tiêu cụ thể để theo dõi', 'Linh hoạt điều chỉnh theo tiến độ'],
      cons: ['Sai số TDEE ±15%', 'Cần theo dõi đủ lâu để thấy xu hướng'],
    },
  };
  return map[key] || null;
}

function TrackingPanel({ s, activeGoal = 'fat-loss' }) {
  const { t: tPillars } = useTranslation('pillars');
  const b5tr = tPillars('pillarB.b5', { returnObjects: true }) || {};
  const [activeSection, setActiveSection] = useState(0);
  const [checked, setChecked] = useState({});
  const [selectedMetric, setSelectedMetric] = useState(null);
  const detail = selectedMetric ? b5MetricDetail(selectedMetric, s) : null;

  const toggle = useCallback((i) => {
    setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  }, []);

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <PersonalizedBar panelId="b5" color="#a855f7" source="B0 → B1 → B2 → B3 → B4"
        selectedKey={selectedMetric} onSelect={setSelectedMetric}
        items={[
        { key: 'daily_protein', label: b5tr.bar_protein || 'Protein/ngày', value: `${s.proteinG}g`, note: 'mục tiêu', tip: `${s.proteinG}g/ngày = ${(s.proteinG/s.weight).toFixed(1)}g × ${s.weight}kg.` },
        { key: 'water',         label: b5tr.bar_water || 'Nước uống', value: `${s.waterMl}ml`, note: `${Math.round(s.waterMl/250)} ly 250ml`, tip: `${s.waterMl}ml = ${s.weight}kg × 35ml/kg.` },
        { key: 'steps',         label: b5tr.bar_steps || 'Bước chân', value: `${s.dailySteps.toLocaleString()}`, note: 'bước/ngày', tip: `Tương ứng mức hoạt động ${s.activity.label}.` },
        { key: 'workout',       label: b5tr.bar_workout || 'Tập luyện', value: `${s.weeklyWorkoutMins}`, note: 'phút/tuần', tip: `${s.weeklyWorkoutMins} phút/tuần tương ứng mức hoạt động ${s.activity.label}.` },
        { key: 'kcal_target',   label: b5tr.bar_kcal || 'Kcal mục tiêu', value: `${s.targetKcal.toLocaleString()}`, note: 'kcal/ngày', tip: `Điều chỉnh ±100–200 kcal nếu cân không thay đổi sau 2 tuần.` },
      ]} />
      {detail && <MetricDetailCard detail={detail} color="#a855f7" onClose={() => setSelectedMetric(null)} />}
      {/* Section heading */}
      <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">{b5tr.section_heading || '5 Chủ Đề Theo Dõi'}</p>

      {/* 3 tab cards */}
      <div className="grid grid-cols-3 gap-3">
        {TRACKING_SECTIONS.map((sec, i) => (
          <TrackingTabCard
            key={sec.id}
            section={{
              ...sec,
              label: b5tr.tracking_sections?.[i]?.label || sec.label,
              badge: b5tr.tracking_sections?.[i]?.badge || sec.badge,
              desc: b5tr.tracking_sections?.[i]?.desc || sec.desc,
            }}
            active={activeSection === i}
            onClick={() => setActiveSection(i)}
          />
        ))}
      </div>

      {/* Content panel — animate on tab switch */}
      <div key={activeSection} className="animate-fade-in-up">
        {activeSection === 0 && (
          <DailyChecklistContent checked={checked} toggle={toggle} checkedCount={checkedCount} />
        )}
        {activeSection === 1 && <WeeklyMetricsContent activeGoal={activeGoal} />}
        {activeSection === 2 && <AdjustmentContent />}
      </div>

      {/* ── Thói Quen Ăn Uống Bền Vững ──────────────────────── */}
      <RevealBlock delay={60}>
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/12 border border-purple-500/20 flex items-center justify-center text-xl shrink-0">🌱</div>
            <div>
              <p className="text-sm font-bold text-text">{b5tr.habits_title || 'Thói Quen Ăn Uống Bền Vững'}</p>
              <p className="text-[10px] text-muted">{b5tr.habits_sub || '3 hành vi nhỏ — tác động lớn lên kết quả dài hạn'}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {EATING_HABITS.map((h, i) => {
              const tips = toArr(tPillars(`pillarB.b5.habits.${i}.tips`, { returnObjects: true, defaultValue: h.tips }));
              return (
                <RevealBlock key={i} delay={i * 60}>
                  <div className="rounded-2xl border p-5 h-full" style={{ borderColor: `${h.color}22`, background: `${h.color}05` }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{h.icon}</span>
                      <p className="text-xs font-bold" style={{ color: h.color }}>{tPillars(`pillarB.b5.habits.${i}.title`, { defaultValue: h.title })}</p>
                    </div>
                    <ul className="space-y-2 mb-3">
                      {tips.map((tip, j) => (
                        <li key={j} className="flex items-start gap-2 text-[10px] text-muted">
                          <span className="font-bold shrink-0 mt-px" style={{ color: h.color }}>→</span>
                          <span className="leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-xl px-3 py-2 border text-[9px] leading-relaxed" style={{ borderColor: `${h.color}20`, background: `${h.color}08`, color: `${h.color}cc` }}>
                      💡 {tPillars(`pillarB.b5.habits.${i}.note`, { defaultValue: h.note })}
                    </div>
                  </div>
                </RevealBlock>
              );
            })}
          </div>
        </div>
      </RevealBlock>

      {/* ── Quy Tắc 3 Không Khi Bữa Lỡ + Quy Tắc Quay Lại ─── */}
      <RevealBlock delay={100}>
        <div className="grid sm:grid-cols-2 gap-4 mt-2">
          {/* Quy tắc 3 không */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🚨</span>
              <div>
                <p className="text-sm font-bold text-red-300">{b5tr.no3_title || 'Quy Tắc 3 Không'}</p>
                <p className="text-[10px] text-muted">{b5tr.no3_sub || 'Khi ăn lỡ tay hoặc ăn không đúng kế hoạch'}</p>
              </div>
            </div>
            <div className="space-y-3">
              {OFF_PLAN_RULES.map((r, i) => (
                <div key={i} className="rounded-xl border border-red-500/15 bg-red-500/5 p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-base shrink-0">{r.icon}</span>
                    <div>
                      <p className="text-[11px] font-bold text-red-300 mb-1">{b5tr.off_plan_rules?.[i]?.rule || r.rule}</p>
                      <p className="text-[10px] text-muted leading-relaxed">{tPillars(`pillarB.b5.off_plan_reasons.${i}`, { defaultValue: r.reason })}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quy tắc quay lại */}
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-sm font-bold text-green-300">{b5tr.reset_title || 'Quy Tắc Quay Lại'}</p>
                <p className="text-[10px] text-muted">{b5tr.reset_sub || '4 bước để reset sau bữa lệch kế hoạch'}</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { step: '01', text: b5tr.reset_steps?.[0] || 'Bữa sau ăn bình thường — không cắt calo bù', color: '#22c55e' },
                { step: '02', text: b5tr.reset_steps?.[1] || 'Uống đủ nước — giúp cơ thể xử lý lượng muối và calo dư', color: '#06b6d4' },
                { step: '03', text: b5tr.reset_steps?.[2] || 'Đi bộ nhẹ 10–20 phút — giúp tiêu hóa và cải thiện tâm trạng', color: '#a855f7' },
                { step: '04', text: b5tr.reset_steps?.[3] || 'Ngủ đủ giấc — đêm đó quan trọng hơn việc tập bù', color: '#f59e0b' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3 rounded-xl border border-green-500/10 bg-green-500/5 p-3">
                  <span className="text-[9px] font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${s.color}20`, color: s.color }}>{s.step}</span>
                  <p className="text-[10px] text-muted leading-relaxed flex-1">{s.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl px-3 py-2 border border-green-500/15 bg-green-500/8">
              <p className="text-[9px] text-green-400/80 italic leading-relaxed">
                "{b5tr.reset_quote || 'Một bữa ăn sai không phá hỏng cả quá trình. Bỏ cuộc mới phá hỏng.'}"
              </p>
            </div>
          </div>
        </div>
      </RevealBlock>
    </div>
  );
}


const TDEE_COMPONENT_TOOLTIPS = [
  'BMR (Basal Metabolic Rate) — trao đổi chất cơ bản. Lượng calo tối thiểu để duy trì sự sống khi nằm yên 24 giờ: tim đập, thở, não hoạt động, nhiệt độ cơ thể. Phụ thuộc vào cân nặng, chiều cao, tuổi và giới tính — không thể thay đổi ngay, nhưng tăng cơ bắp sẽ nâng BMR lâu dài.',
  'TEA (Thermic Effect of Activity) — nhiệt lượng sinh ra từ hoạt động thể chất. Đây là thành phần biến động nhất: ngồi cả ngày = 20% TDEE, vận động viên chuyên nghiệp có thể đạt 50%. Tăng TEA = cách nhanh nhất để tăng tổng năng lượng tiêu thụ mỗi ngày.',
  'TEF (Thermic Effect of Food) — năng lượng dùng để tiêu hóa và hấp thu thức ăn. Protein có TEF cao nhất (~25–30%), carb ~6–8%, chất béo ~2–3%. Ăn nhiều protein không chỉ giúp tăng cơ mà còn đốt thêm calo ngay trong quá trình tiêu hóa.',
];

const CALC_TOOLTIPS = [
  'BMR (Basal Metabolic Rate) — lượng calo cơ thể cần để duy trì chức năng sống cơ bản khi nằm yên hoàn toàn: tim đập, hô hấp, nhiệt độ cơ thể, não hoạt động. Chiếm 60–75% tổng TDEE, phụ thuộc vào cân nặng, chiều cao, tuổi và giới tính.',
  'Năng lượng tiêu thụ thêm từ hoạt động thể chất mỗi ngày — bao gồm cả tập luyện lẫn đi lại, làm việc, sinh hoạt. Được tính bằng cách nhân BMR với hệ số hoạt động tương ứng (1.2 → 1.9).',
  'Lượng calo nên nạp mỗi ngày để đạt mục tiêu đã chọn. Giảm mỡ = TDEE trừ 300–500 kcal (thâm hụt). Duy trì = ±100 kcal so với TDEE. Tăng cơ = TDEE cộng 150–300 kcal (thặng dư). Điều chỉnh từng bước 100–200 kcal nếu không có tiến bộ sau 2 tuần.',
  'Trung bình mỗi giờ cơ thể đốt bao nhiêu calo. Con số này giúp bạn ước tính: ngủ 8 tiếng tiêu ~1/3 TDEE, ngồi làm việc tiêu ít hơn TDEE/24, tập 1 tiếng tăng đáng kể. Hữu ích để lên kế hoạch bữa ăn trước/sau tập.',
];

// ─── CalcPanel (B0) — Interactive TDEE calculator ───────────────────────────
function CalcPanel({ weight, setWeight, height, setHeight, age, setAge, sex, setSex, activityKey, setActivityKey, goalKey, setGoalKey, userStats: s }) {
  const { t: tPillars } = useTranslation('pillars');
  const b0tr = tPillars('pillarB.b0', { returnObjects: true }) || {};
  const activityTr = tPillars('pillarB.activity_levels', { returnObjects: true }) || [];
  const goalTr = tPillars('pillarB.goal_modifiers', { returnObjects: true }) || [];
  const translatedActivityLevels = ACTIVITY_LEVELS.map((a, i) => ({ ...a, label: activityTr[i]?.label || a.label }));
  const translatedGoalModifiers = GOAL_MODIFIERS.map((g, i) => ({ ...g, label: goalTr[i]?.label || g.label, note: goalTr[i]?.note || g.note }));
  const translatedActivity = translatedActivityLevels.find(a => a.key === activityKey) || translatedActivityLevels[2];
  const translatedGoal = translatedGoalModifiers.find(g => g.key === goalKey) || translatedGoalModifiers[1];

  const { activity, bmr, tdee, goal: selectedGoal, targetKcal } = s;

  const numInput = (val, set, min, max) => (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => set(v => Math.max(min, v - 1))}
        className="w-7 h-7 rounded-lg border border-border/50 bg-white/[0.04] text-muted hover:text-text hover:border-violet-500/40 transition-all duration-150 flex items-center justify-center text-sm font-bold cursor-pointer"
      >−</button>
      <input
        type="number"
        min={min}
        max={max}
        value={val}
        onChange={e => set(Math.max(min, Math.min(max, Number(e.target.value))))}
        className="w-16 text-center bg-white/[0.04] border border-border/50 rounded-lg py-1 text-sm font-bold text-text focus:outline-none focus:border-violet-500/60"
      />
      <button
        type="button"
        onClick={() => set(v => Math.min(max, v + 1))}
        className="w-7 h-7 rounded-lg border border-border/50 bg-white/[0.04] text-muted hover:text-text hover:border-violet-500/40 transition-all duration-150 flex items-center justify-center text-sm font-bold cursor-pointer"
      >+</button>
    </div>
  );

  return (
    <div className="space-y-8">

      {/* ── TDEE explainer banner ── */}
      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-lg shrink-0">🔬</div>
          <div>
            <p className="text-sm font-bold text-violet-300 mb-1.5">{b0tr.what || 'TDEE là gì?'}</p>
            <p className="text-[12px] text-muted leading-relaxed">
              <span className="text-text/90 font-semibold">{b0tr.desc_intro || 'TDEE'}</span> {b0tr.desc_body || '(Total Daily Energy Expenditure) là tổng lượng calo cơ thể đốt cháy mỗi ngày — gồm 3 thành phần:'}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: 'BMR', sub: b0tr.bmr_sub || 'Trao đổi chất cơ bản', pct: '60–75%', icon: '💤', color: '#8b5cf6' },
                { label: 'TEA', sub: b0tr.tea_sub || 'Hoạt động thể chất', pct: '15–30%', icon: '🏃', color: '#06b6d4' },
                { label: 'TEF', sub: b0tr.tef_sub || 'Tiêu hóa thức ăn', pct: '5–10%', icon: '🍽️', color: '#22c55e' },
              ].map((c, i) => (
                <div key={c.label} className="group/tdeec relative">
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 pointer-events-none opacity-0 group-hover/tdeec:opacity-100 scale-90 group-hover/tdeec:scale-100 translate-y-1 group-hover/tdeec:translate-y-0 transition-all duration-200 origin-top">
                    <ThoughtBubble text={TDEE_COMPONENT_TOOLTIPS[i]} idx={`tdeec${i}`} color={c.color} />
                  </div>
                  <div className="rounded-xl p-3 text-center cursor-help transition-all duration-200 hover:scale-[1.04]" style={{ background: `${c.color}0c`, border: `1px solid ${c.color}25` }}>
                    <span className="text-base">{c.icon}</span>
                    <p className="text-xs font-black mt-1" style={{ color: c.color }}>{c.label}</p>
                    <p className="text-[9px] text-muted leading-snug mt-0.5">{c.sub}</p>
                    <p className="text-[9px] font-bold mt-1" style={{ color: `${c.color}cc` }}>{c.pct}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: inputs */}
        <div className="space-y-5">
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">{b0tr.inputs_label || 'Nhập Thông Số'}</p>

          {/* Weight */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">{b0tr.weight_label || 'Cân nặng (kg)'}</span>
            {numInput(weight, setWeight, 30, 200)}
          </div>
          {/* Height */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">{b0tr.height_label || 'Chiều cao (cm)'}</span>
            {numInput(height, setHeight, 100, 250)}
          </div>
          {/* Age */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">{b0tr.age_label || 'Tuổi'}</span>
            {numInput(age, setAge, 10, 100)}
          </div>

          {/* Sex toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">{b0tr.sex_label || 'Giới tính'}</span>
            <div className="flex gap-2">
              {['male', 'female'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSex(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer ${
                    sex === s
                      ? 'bg-violet-500/15 border-violet-500/50 text-violet-300'
                      : 'border-border/40 text-muted hover:border-border/70'
                  }`}
                >
                  {s === 'male' ? (b0tr.male_label || 'Nam') : (b0tr.female_label || 'Nữ')}
                </button>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div>
            <p className="text-xs text-muted mb-2">{b0tr.activity_label || 'Mức hoạt động'}</p>
            <div className="space-y-1.5">
              {translatedActivityLevels.map(a => (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => setActivityKey(a.key)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-[11px] border transition-all duration-200 cursor-pointer ${
                    activityKey === a.key
                      ? 'bg-violet-500/12 border-violet-500/45 text-violet-300'
                      : 'border-border/35 text-muted hover:border-border/60 hover:text-text/80'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: output */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">{b0tr.results_label || 'Kết Quả TDEE'}</p>

          {/* TDEE display */}
          <div className="rounded-2xl border border-violet-500/25 bg-violet-500/8 p-5 text-center">
            <p className="text-[10px] text-muted mb-1 uppercase tracking-widest">{b0tr.tdee_est_label || 'TDEE ước tính'}</p>
            <p className="text-4xl font-black" style={{ color: '#8b5cf6' }}>{tdee.toLocaleString()}</p>
            <p className="text-xs text-muted mt-1">{b0tr.kcal_per_day || 'kcal / ngày'}</p>
            <div className="mt-4 pt-3 border-t border-violet-500/15 flex items-center justify-center flex-wrap gap-1.5 text-[10px]">
              <span className="px-2 py-0.5 rounded-lg font-bold" style={{ background: '#8b5cf615', border: '1px solid #8b5cf630', color: '#c4b5fd' }}>BMR {bmr.toLocaleString()}</span>
              <span className="text-muted">×</span>
              <span className="px-2 py-0.5 rounded-lg font-bold" style={{ background: '#06b6d415', border: '1px solid #06b6d430', color: '#67e8f9' }}>{activity.mult}</span>
              <span className="text-muted">=</span>
              <span className="px-2 py-0.5 rounded-lg font-black" style={{ background: '#8b5cf620', border: '1px solid #8b5cf640', color: '#a78bfa' }}>{tdee.toLocaleString()}</span>
            </div>
            <p className="text-[9px] text-muted/40 mt-1.5">{b0tr.formula_note || 'Mifflin-St Jeor × Hệ số hoạt động'}</p>
          </div>

          {/* Goal cards */}
          <div className="space-y-3">
            {translatedGoalModifiers.map(g => {
              const kcal = tdee + g.delta;
              const proteinG = Math.round(weight * (g.key === 'loss' ? 2.0 : 1.8));
              const fatG = Math.round(kcal * 0.25 / 9);
              const carbG = Math.round((kcal - proteinG * 4 - fatG * 9) / 4);
              const isActive = goalKey === g.key;
              return (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => setGoalKey(g.key)}
                  className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
                    isActive ? 'border-current' : 'border-border/35 hover:border-border/60'
                  }`}
                  style={isActive ? { borderColor: `${g.color}50`, background: `${g.color}08` } : undefined}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold" style={{ color: g.color }}>{g.label}</span>
                    <span className="text-xs font-black text-text">{kcal.toLocaleString()} kcal</span>
                  </div>
                  {isActive && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {[
                        { k: 'Protein', v: `${proteinG}g` },
                        { k: 'Carb', v: `${carbG}g` },
                        { k: 'Fat', v: `${fatG}g` },
                      ].map(item => (
                        <div key={item.k} className="text-center rounded-lg p-2" style={{ background: `${g.color}10`, border: `1px solid ${g.color}25` }}>
                          <p className="text-[9px] font-bold mb-0.5" style={{ color: g.color }}>{item.k}</p>
                          <p className="text-[11px] font-black text-text">{item.v}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-muted mt-2">{g.note}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Analysis section ── */}
      <RevealBlock delay={50}>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">{b0tr.analysis_label || 'Phân Tích Chi Tiết'}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: b0tr.bmr_label || 'BMR',       value: `${bmr.toLocaleString()} kcal`, sub: b0tr.bmr_rest_sub || 'Nghỉ ngơi hoàn toàn', icon: '💤', color: '#8b5cf6' },
            { label: b0tr.activity_contribution_label || 'Hoạt động', value: `+${(tdee - bmr).toLocaleString()} kcal`, sub: translatedActivity.label, icon: '🏃', color: '#06b6d4' },
            { label: b0tr.goal_label || 'Mục tiêu',  value: `${targetKcal.toLocaleString()} kcal`, sub: translatedGoal.label, icon: '🎯', color: selectedGoal.color },
            { label: b0tr.per_hour_label || 'Mỗi giờ',  value: `~${Math.round(tdee / 24)} kcal`, sub: b0tr.per_hour_sub || 'Tiêu thụ trung bình', icon: '⏱️', color: '#22c55e' },
          ].map((item, i) => (
            <div key={item.label} className="group/calcstat relative">
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none opacity-0 group-hover/calcstat:opacity-100 scale-90 group-hover/calcstat:scale-100 -translate-y-1 group-hover/calcstat:translate-y-0 transition-all duration-200 origin-bottom">
                <ThoughtBubble text={CALC_TOOLTIPS[i]} idx={`calc${i}`} color={item.color} />
              </div>
              <div className="rounded-2xl border p-4 text-center transition-all duration-200 hover:scale-[1.03] cursor-help" style={{ borderColor: `${item.color}25`, background: `${item.color}07` }}>
                <span className="text-xl">{item.icon}</span>
                <p className="text-sm font-black mt-1.5 mb-0.5" style={{ color: item.color }}>{item.value}</p>
                <p className="text-[9px] font-bold text-text/70 mb-0.5">{item.label}</p>
                <p className="text-[9px] text-muted leading-snug">{item.sub}</p>
                <p className="text-[8px] text-muted/40 mt-1.5">{b0tr.hover_hint || 'Hover để xem chi tiết'}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* ── Benefits section ── */}
      <RevealBlock delay={80}>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">{b0tr.benefits_label || 'Lợi Ích Khi Biết TDEE'}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: '🎯', title: 'Ăn đúng theo mục tiêu', desc: 'Biết chính xác cần bao nhiêu kcal/ngày — không đoán mò khi muốn giảm mỡ, tăng cơ hay duy trì cân nặng.', color: '#8b5cf6' },
            { icon: '⚡', title: 'Tránh thiếu / thừa năng lượng', desc: 'Ăn đủ để giữ năng lượng và cơ bắp, tránh "crash" khi cắt calo quá mạnh hoặc tích mỡ khi ăn thừa.', color: '#f97316' },
            { icon: '📈', title: 'Điều chỉnh đúng điểm', desc: 'Không tiến bộ sau 2 tuần? Tăng/giảm chính xác 100–200 kcal thay vì thay đổi toàn bộ chế độ ăn.', color: '#22c55e' },
            { icon: '🔄', title: 'Cập nhật theo thể trạng', desc: 'TDEE thay đổi khi cân nặng thay đổi. Tính lại sau mỗi 4 tuần để duy trì hiệu quả liên tục.', color: '#06b6d4' },
          ].map((b, i) => {
            const btr = b0tr.benefits?.[i] || {};
            return (
            <div key={b.icon} className="flex items-start gap-3 p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.01] hover:-translate-y-0.5" style={{ borderColor: `${b.color}20`, background: `${b.color}06` }}>
              <span className="text-xl shrink-0 mt-0.5">{b.icon}</span>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: b.color }}>{btr.title || b.title}</p>
                <p className="text-[11px] text-muted leading-relaxed">{btr.desc || b.desc}</p>
              </div>
            </div>
            );
          })}
        </div>
      </RevealBlock>

      {/* ── Accuracy note ── */}
      <RevealBlock delay={100}>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
          <span className="text-lg shrink-0 mt-0.5">⚠️</span>
          <div>
            <p className="text-xs font-bold text-amber-300 mb-1.5">{b0tr.accuracy_label || 'Độ chính xác & Lưu ý'}</p>
            <p className="text-[11px] text-muted leading-relaxed">
              {b0tr.accuracy_body || 'Công thức Mifflin-St Jeor có sai số ±10–15% vì không tính được tỷ lệ cơ/mỡ. Dùng TDEE như điểm khởi đầu — theo dõi cân nặng 1–2 tuần, nếu cân không đổi thì lượng bạn đang ăn chính là TDEE thực tế của bạn.'}
            </p>
          </div>
        </div>
      </RevealBlock>

      {/* Meal split rules */}
      <RevealBlock delay={130}>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">{b0tr.meal_split_title || '5 Nguyên Tắc Chia Bữa'}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MEAL_SPLIT_RULES.map((r, i) => (
            <div
              key={r.n}
              className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-4 hover:border-violet-500/30 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0" style={{ color: '#8b5cf6', background: '#8b5cf615', border: '1px solid #8b5cf630' }}>{r.n}</span>
                <p className="text-xs font-bold text-text">{b0tr.meal_split_rules?.[i]?.title || r.title}</p>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">{b0tr.meal_split_rules?.[i]?.desc || r.desc}</p>
            </div>
          ))}
        </div>
      </RevealBlock>
    </div>
  );
}

// ─── B6 helpers ──────────────────────────────────────────────────────────────

function getWeekPattern(trainingDays) {
  const n = Math.min(7, Math.max(0, trainingDays));
  const patterns = {
    0: [0,0,0,0,0,0,0],
    1: [0,0,0,1,0,0,0],
    2: [1,0,0,0,1,0,0],
    3: [1,0,1,0,1,0,0],
    4: [1,0,1,0,1,1,0],
    5: [1,1,1,0,1,1,0],
    6: [1,1,1,1,1,1,0],
    7: [1,1,1,1,1,1,1],
  };
  return (patterns[n] || patterns[4]).map(v => v ? 'training' : 'rest');
}

function WeeklyWaveChart({ s }) {
  const pattern = getWeekPattern(s.trainingDays);
  const W = 480, H = 90, PAD_T = 20, PAD_B = 42, PAD_LR = 22;
  const slotW = (W - PAD_LR * 2) / 7;
  const BAR_W = slotW * 0.55;
  const maxKcal = s.trainingDayKcal;
  const minKcal = s.restDayKcal;
  const yRange = maxKcal - minKcal;
  const safeRange = yRange > 0 ? yRange : 200;

  const kcalFor = t => t === 'training' ? s.trainingDayKcal : s.restDayKcal;
  const carbFor = t => t === 'training' ? s.trainingDayCarb : s.restDayCarb;
  const yOf = kcal => PAD_T + H * (1 - (kcal - minKcal + safeRange * 0.1) / (safeRange * 1.2));

  const pts = pattern.map((type, i) => ({
    type, x: PAD_LR + slotW * i + slotW / 2,
    kcal: kcalFor(type), carb: carbFor(type),
  }));
  const ys = pts.map(p => yOf(p.kcal));
  const lineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const tdeeY = yOf(s.tdee);
  const totalH = PAD_T + H + PAD_B;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ overflow: 'visible' }}>
      <line x1={PAD_LR} y1={tdeeY} x2={W - PAD_LR} y2={tdeeY}
        stroke="#ffffff18" strokeWidth="1" strokeDasharray="4 3" />
      <text x={W - PAD_LR + 4} y={tdeeY + 3} fontSize="7" fill="#ffffff30">TDEE</text>
      {pts.map((p, i) => (
        <rect key={i} x={p.x - BAR_W / 2} y={ys[i]}
          width={BAR_W} height={PAD_T + H - ys[i]}
          fill={p.type === 'training' ? '#ec489916' : '#06b6d416'} rx="3" />
      ))}
      <path d={lineD} fill="none" stroke="#ec489945" strokeWidth="1.5" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={ys[i]} r={5} fill={p.type === 'training' ? '#ec489930' : '#06b6d430'} />
          <circle cx={p.x} cy={ys[i]} r={2.5} fill={p.type === 'training' ? '#ec4899' : '#06b6d4'} />
        </g>
      ))}
      {pts.map((p, i) => (
        <text key={i} x={p.x} y={ys[i] - 9} textAnchor="middle"
          fontSize="8" fontWeight="700" fill={p.type === 'training' ? '#ec4899cc' : '#06b6d4cc'}>
          {(p.kcal / 1000).toFixed(1)}k
        </text>
      ))}
      {pts.map((p, i) => (
        <text key={i} x={p.x} y={PAD_T + H + 13} textAnchor="middle" fontSize="8" fill="#6b728088">N{i + 1}</text>
      ))}
      {pts.map((p, i) => (
        <text key={i} x={p.x} y={PAD_T + H + 25} textAnchor="middle" fontSize="7.5"
          fill={p.type === 'training' ? '#ec489968' : '#06b6d468'}>
          {p.type === 'training' ? 'Tập' : 'Nghỉ'}
        </text>
      ))}
      {pts.map((p, i) => (
        <text key={i} x={p.x} y={PAD_T + H + 37} textAnchor="middle" fontSize="7"
          fill={p.type === 'training' ? '#ec489948' : '#06b6d448'}>
          {p.carb}g C
        </text>
      ))}
    </svg>
  );
}

function CarbCycleFormula({ s }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-xl border border-border/30 bg-surface/5 p-3">
        <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-2">TDEE Nền</p>
        <p className="text-xl font-black text-text leading-none">
          {(s.tdee / 1000).toFixed(1)}<span className="text-xs font-normal text-muted">k</span>
        </p>
        <p className="text-[9px] text-muted mt-0.5">kcal/ngày</p>
        <div className="mt-2.5 space-y-0.5">
          {[['Protein', `${s.proteinG}g`], ['Carb', `${s.carbG}g`], ['Fat', `${s.fatG}g`]].map(([k, v]) => (
            <div key={k} className="flex justify-between text-[9px]">
              <span className="text-muted">{k}</span>
              <span className="text-text/70 font-mono">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-pink-500/30 bg-pink-500/5 p-3">
        <p className="text-[9px] font-bold text-pink-400 uppercase tracking-widest mb-2">Ngày Tập 🏋️</p>
        <p className="text-xl font-black text-pink-300 leading-none">
          {(s.trainingDayKcal / 1000).toFixed(1)}<span className="text-xs font-normal text-pink-400">k</span>
        </p>
        <p className="text-[9px] text-pink-400 mt-0.5">= TDEE + 100</p>
        <div className="mt-2.5 space-y-0.5">
          {[['Protein', `${s.proteinG}g`, '='], ['Carb', `${s.trainingDayCarb}g`, '↑+20%']].map(([k, v, tag]) => (
            <div key={k} className="flex justify-between text-[9px]">
              <span className="text-pink-400/70">{k}</span>
              <span className="text-pink-300 font-mono">{v} <span className="text-pink-500/70">{tag}</span></span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-3">
        <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Ngày Nghỉ 🛋️</p>
        <p className="text-xl font-black text-cyan-300 leading-none">
          {(s.restDayKcal / 1000).toFixed(1)}<span className="text-xs font-normal text-cyan-400">k</span>
        </p>
        <p className="text-[9px] text-cyan-400 mt-0.5">= TDEE − 100</p>
        <div className="mt-2.5 space-y-0.5">
          {[['Protein', `${s.proteinG}g`, '='], ['Carb', `${s.restDayCarb}g`, '↓−20%']].map(([k, v, tag]) => (
            <div key={k} className="flex justify-between text-[9px]">
              <span className="text-cyan-400/70">{k}</span>
              <span className="text-cyan-300 font-mono">{v} <span className="text-cyan-500/70">{tag}</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function b6MetricDetail(key, s) {
  const map = {
    training_day: {
      title: `Kcal Ngày Tập`, value: `${s.trainingDayKcal.toLocaleString()} kcal`, note: `${s.trainingDays} ngày/tuần`,
      params: [
        { label: 'TDEE nền', value: `${s.tdee.toLocaleString()} kcal`, pct: 100 },
        { label: '+100 kcal bù tập', value: `${s.trainingDayKcal.toLocaleString()} kcal`, pct: 103, color: '#ec4899' },
        { label: 'Carb ngày tập', value: `${s.trainingDayCarb}g (+20%)`, pct: Math.round(s.trainingDayCarb/s.carbG*100) },
      ],
      analysis: `Ngày tập tăng thêm 100 kcal so với TDEE để bù năng lượng cho buổi tập và hỗ trợ phục hồi. Carb tăng lên ${s.trainingDayCarb}g (×1.2) — glycogen cơ cần được nạp đầy trước và phục hồi sau tập.`,
      evaluation: { icon: '🏋️', label: `${s.trainingDays} ngày/tuần tập`, color: '#ec4899', text: `Carb cao hơn ngày tập không phải "ăn gian" — đây là nhu cầu sinh lý để hiệu suất tập tốt và phục hồi nhanh.` },
      suggestions: [`Tăng carb trước tập: ${s.preWorkoutCarbG}g (15% carb ngày)`, 'Bữa sau tập: carb + protein trong 2 giờ', `Tổng ${s.trainingDayCarb}g carb ngày tập`],
      pros: ['Hiệu suất tập tốt hơn', 'Phục hồi glycogen nhanh hơn'],
      cons: ['Cần biết lịch tập trước để điều chỉnh', 'Phức tạp hơn ăn đều mỗi ngày'],
    },
    rest_day: {
      title: `Kcal Ngày Nghỉ`, value: `${s.restDayKcal.toLocaleString()} kcal`, note: `${s.restDays} ngày/tuần`,
      params: [
        { label: 'TDEE nền', value: `${s.tdee.toLocaleString()} kcal`, pct: 100 },
        { label: '-100 kcal ngày nghỉ', value: `${s.restDayKcal.toLocaleString()} kcal`, pct: 97 },
        { label: 'Carb ngày nghỉ', value: `${s.restDayCarb}g (-20%)`, pct: Math.round(s.restDayCarb/s.carbG*100) },
      ],
      analysis: `Ngày nghỉ giảm 100 kcal vì không đốt năng lượng tập luyện. Carb giảm xuống ${s.restDayCarb}g (×0.8) — glycogen đã có sẵn, ưu tiên protein và rau xanh hơn tinh bột. Protein vẫn phải đủ ${s.proteinG}g để hỗ trợ phục hồi.`,
      evaluation: { icon: '🛋️', label: `${s.restDays} ngày/tuần nghỉ`, color: '#06b6d4', text: `Ngày nghỉ không phải ngày ăn ít — protein vẫn cần đủ ${s.proteinG}g. Cơ phát triển chủ yếu KHI NGHỈ, không phải khi tập.` },
      suggestions: ['Protein vẫn đủ dù không tập', `Carb giảm: ${s.restDayCarb}g thay vì ${s.carbG}g`, 'Tăng rau xanh để no mà không thừa calo'],
      pros: ['Kiểm soát calo tuần hiệu quả hơn', 'Cơ thể phục hồi tốt hơn'],
      cons: ['Cần phân biệt ngày tập/nghỉ rõ ràng', 'Phức tạp với lịch không đều'],
    },
    weekly_total: {
      title: 'Tổng Calo Tuần', value: `${s.weeklyKcalTotal.toLocaleString()} kcal`, note: '/7 ngày',
      params: [
        { label: `${s.trainingDays} ngày tập × ${s.trainingDayKcal}`, value: `${(s.trainingDayKcal * s.trainingDays).toLocaleString()} kcal`, pct: Math.round(s.trainingDayKcal*s.trainingDays/s.weeklyKcalTotal*100) },
        { label: `${s.restDays} ngày nghỉ × ${s.restDayKcal}`, value: `${(s.restDayKcal * s.restDays).toLocaleString()} kcal`, pct: Math.round(s.restDayKcal*s.restDays/s.weeklyKcalTotal*100) },
        { label: 'Tổng tuần', value: `${s.weeklyKcalTotal.toLocaleString()} kcal`, pct: 100 },
      ],
      analysis: `${s.trainingDayKcal} × ${s.trainingDays} + ${s.restDayKcal} × ${s.restDays} = ${s.weeklyKcalTotal.toLocaleString()} kcal/tuần. Tổng tuần quan trọng hơn từng ngày — linh hoạt ±200 kcal/ngày miễn tổng tuần đúng mục tiêu.`,
      evaluation: { icon: '📅', label: 'Tổng quan 7 ngày', color: '#ec4899', text: `Trung bình ${Math.round(s.weeklyKcalTotal/7).toLocaleString()} kcal/ngày = ${s.targetKcal.toLocaleString()} kcal mục tiêu. Sai số ±3% trong tuần là chấp nhận được.` },
      suggestions: ['Theo dõi tổng tuần thay vì từng ngày', 'Ngày lệch ±200 kcal có thể bù ngày hôm sau', 'Cân đo thứ 2 hàng tuần để kiểm tra xu hướng'],
      pros: ['Linh hoạt hơn calo ngày cố định', 'Phù hợp nhịp sống thực tế'],
      cons: ['Cần công cụ theo dõi hoặc thói quen nhớ', 'Dễ bù quá nhiều nếu mất kiểm soát'],
    },
    weekly_protein_b6: {
      title: 'Protein Cả Ngày Tập & Nghỉ', value: `${s.proteinG}g`, note: 'giữ nguyên cả tuần',
      params: [
        { label: 'Protein ngày tập', value: `${s.proteinG}g`, pct: 100 },
        { label: 'Protein ngày nghỉ', value: `${s.proteinG}g`, pct: 100 },
        { label: 'Protein tuần', value: `${s.weeklyProteinG}g`, pct: 100 },
      ],
      analysis: `Protein phải giữ nguyên ${s.proteinG}g cả ngày tập và ngày nghỉ. Sai lầm phổ biến: giảm protein ngày nghỉ để cắt calo — điều này làm chậm phục hồi và mất cơ.`,
      evaluation: { icon: '💜', label: 'Không giảm protein ngày nghỉ', color: '#a855f7', text: `Cơ phát triển chủ yếu trong 24–48h SAU tập. Protein ngày nghỉ dùng cho phục hồi cơ — cắt protein ngày nghỉ = mất kết quả tập.` },
      suggestions: [`Duy trì ${s.proteinG}g protein mỗi ngày không đổi`, 'Ngày nghỉ: ưu tiên protein + rau, giảm carb', 'Protein shake là giải pháp tiện nếu khó đạt qua thức ăn'],
      pros: ['Phục hồi tối ưu sau tập', 'Giữ cơ khi carb cycle'],
      cons: ['Cần chú ý nguồn đạm ngày nghỉ', 'Tốn chi phí hơn nếu dùng thực phẩm chức năng'],
    },
  };
  return map[key] || null;
}

// ─── SevenDayPanel (B6) ──────────────────────────────────────────────────────
function SevenDayPanel({ s }) {
  const { t: tPillars } = useTranslation('pillars');
  const b6tr = tPillars('pillarB.b6', { returnObjects: true }) || {};
  const [activeDay, setActiveDay]       = useState(0);
  const [showShopping, setShowShopping] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const detail = selectedMetric ? b6MetricDetail(selectedMetric, s) : null;

  const day = SEVEN_DAY_PLAN[activeDay];
  const weekPattern = getWeekPattern(s.trainingDays);

  return (
    <div className="space-y-8">
      <PersonalizedBar panelId="b6" color="#ec4899" source="B0 → B1 → B2 → B3 → B4 → B5"
        selectedKey={selectedMetric} onSelect={setSelectedMetric}
        items={[
        { key: 'training_day',      label: b6tr.bar_training || 'Ngày tập', value: `${s.trainingDayKcal.toLocaleString()} kcal`, note: `${s.trainingDays} ngày/tuần`, tip: `Ngày tập: TDEE + 100 kcal = ${s.trainingDayKcal.toLocaleString()} kcal.` },
        { key: 'rest_day',          label: b6tr.bar_rest || 'Ngày nghỉ', value: `${s.restDayKcal.toLocaleString()} kcal`, note: `${s.restDays} ngày/tuần`, tip: `Ngày nghỉ: TDEE - 100 kcal = ${s.restDayKcal.toLocaleString()} kcal.` },
        { key: 'weekly_total',      label: b6tr.bar_weekly || 'Tổng tuần', value: `${s.weeklyKcalTotal.toLocaleString()}`, note: 'kcal/7 ngày', tip: `${s.trainingDayKcal} × ${s.trainingDays} + ${s.restDayKcal} × ${s.restDays} = ${s.weeklyKcalTotal.toLocaleString()} kcal/tuần.` },
        { key: 'weekly_protein_b6', label: b6tr.bar_protein || 'Protein/ngày', value: `${s.proteinG}g`, note: 'cả tập & nghỉ', tip: `Duy trì ${s.proteinG}g protein cả ngày tập và ngày nghỉ.` },
      ]} />
      {detail && <MetricDetailCard detail={detail} color="#ec4899" onClose={() => setSelectedMetric(null)} />}

      {/* ── Nhịp Calo Tuần ── */}
      <RevealBlock>
        <div className="rounded-2xl border border-pink-500/18 bg-pink-500/4 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.18em]">{b6tr.rhythm_title || 'Nhịp Calo Tuần'}</p>
              <p className="text-sm font-bold text-text mt-0.5">
                {b6tr.carb_cycling_label || 'Carb Cycling'} — {s.trainingDays} {b6tr.days_training_label || 'ngày tập'} / {s.restDays} {b6tr.days_rest_label || 'ngày nghỉ'}
              </p>
            </div>
            <div className="flex gap-3 text-[10px] text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-500 inline-block" />{b6tr.legend_training || 'Tập'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />{b6tr.legend_rest || 'Nghỉ'}
              </span>
            </div>
          </div>
          <WeeklyWaveChart s={s} />

          {/* Formula */}
          <div className="mt-5">
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.18em] mb-3">{b6tr.macro_formula_title || 'Công Thức Tính Macro'}</p>
            <CarbCycleFormula s={s} />
          </div>

          {/* Insight */}
          <div className="mt-4 rounded-xl border border-yellow-500/15 bg-yellow-500/5 p-3 flex gap-2">
            <span className="text-yellow-400 shrink-0 text-sm">💡</span>
            <p className="text-[11px] text-muted leading-relaxed">
              <span className="font-bold text-yellow-300">Carb Cycling:</span>{' '}
              {(b6tr.carb_cycling_insight || 'Protein không đổi ({protein}g) — chỉ điều chỉnh carb ±20% theo ngày. Ngày tập: {trainCarb}g carb nạp đầy glycogen cơ. Ngày nghỉ: {restCarb}g carb khuyến khích đốt mỡ dự trữ.')
                .replace('{protein}', s.proteinG)
                .replace('{trainCarb}', s.trainingDayCarb)
                .replace('{restCarb}', s.restDayCarb)}
            </p>
          </div>
        </div>
      </RevealBlock>

      {/* ── Context image ── */}
      <RevealBlock delay={40}>
        <div className="rounded-2xl overflow-hidden h-40 relative border border-pink-500/15">
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?w=700&q=75&auto=format&fit=crop"
            alt="Meal prep containers"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/65 to-bg/20" />
          <div className="absolute inset-0 flex flex-col justify-center p-5">
            <p className="text-sm font-bold text-pink-300 mb-1">{b6tr.meal_prep_headline || 'Meal Prep = Thành Công 70%'}</p>
            <p className="text-[11px] text-muted/90 leading-relaxed max-w-xs">
              {b6tr.meal_prep_desc || 'Chuẩn bị sẵn 2–3 ngày thức ăn vào cuối tuần loại bỏ lý do "không biết ăn gì" — quyết định đúng đắn nhất ngày thường là quyết định đã được lên kế hoạch từ trước.'}
            </p>
          </div>
        </div>
      </RevealBlock>

      {/* Day selector */}
      <div className="overflow-x-auto scrollbar-none -mx-1 px-1">
        <div className="flex gap-2 min-w-max">
          {SEVEN_DAY_PLAN.map((d, i) => {
            const dayType = weekPattern[i];
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setActiveDay(i)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeDay === i
                    ? 'border-pink-500/50 text-pink-300'
                    : 'border-border/40 text-muted hover:border-border/70 hover:text-text/80'
                }`}
                style={activeDay === i ? { background: '#ec489910' } : undefined}
              >
                <span className="font-black">{tPillars(`pillarB.b6.seven_day_plan.${i}.day_short`, { defaultValue: d.day.replace('Ngày ', 'N') })}</span>
                <span className="ml-1.5 text-[9px]" style={{ color: dayType === 'training' ? '#ec489980' : '#06b6d480' }}>
                  {dayType === 'training' ? '🏋️' : '🌙'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active day content */}
      <div key={activeDay} className="animate-fade-in-up space-y-4">
        {/* Theme + day type badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full border"
            style={{ color: day.color, background: `${day.color}12`, borderColor: `${day.color}35` }}
          >
            {tPillars(`pillarB.b6.seven_day_plan.${activeDay}.day`, { defaultValue: day.day })} — {tPillars(`pillarB.b6.seven_day_plan.${activeDay}.theme`, { defaultValue: day.theme })}
          </span>
          {weekPattern[activeDay] === 'training' ? (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-pink-500/30 text-pink-400 bg-pink-500/8">
              {b6tr.training_badge || '🏋️ Ngày Tập'} — {s.trainingDayKcal.toLocaleString()} kcal | Carb {s.trainingDayCarb}g
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-cyan-500/30 text-cyan-400 bg-cyan-500/8">
              {b6tr.rest_badge || '🌙 Ngày Nghỉ'} — {s.restDayKcal.toLocaleString()} kcal | Carb {s.restDayCarb}g
            </span>
          )}
        </div>

        {/* Meals grid */}
        <div className="space-y-3">
          {day.meals.map((meal, mealIdx) => (
            <div
              key={meal.time}
              className="rounded-2xl border border-border/35 bg-surface/10 overflow-hidden"
            >
              <div className="h-[1.5px]" style={{ background: `linear-gradient(90deg, ${day.color}80, transparent)` }} />
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
                    style={{ color: day.color, background: `${day.color}12`, borderColor: `${day.color}35` }}
                  >
                    {b6tr.meal_time_map?.[meal.time] || meal.time}
                  </span>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-pink-300 bg-pink-500/8 border border-pink-500/20 px-2 py-0.5 rounded-lg">P {meal.protein}</span>
                    <span className="text-[10px] font-bold text-orange-400 bg-orange-500/8 border border-orange-500/20 px-2 py-0.5 rounded-lg">{meal.kcal} kcal</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {meal.items.map((item, itemIdx) => (
                    <span key={itemIdx} className="text-[11px] text-text/80 bg-white/[0.04] border border-white/8 px-2 py-0.5 rounded-lg">
                      {tPillars(`pillarB.b6.seven_day_plan.${activeDay}.meals.${mealIdx}.items.${itemIdx}`, { defaultValue: item })}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 flex items-start gap-2">
          <span className="text-yellow-400 text-sm shrink-0">💡</span>
          <p className="text-[11px] text-muted leading-relaxed">{tPillars(`pillarB.b6.seven_day_plan.${activeDay}.note`, { defaultValue: day.note })}</p>
        </div>
      </div>

      {/* ── Công thức ước lượng thực phẩm ── */}
      <RevealBlock delay={50}>
        <div className="rounded-2xl border border-border/25 p-5 space-y-4">
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.18em]">{b6tr.estimate_title || 'Công Thức Ước Lượng Thực Phẩm'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '🥩', color: '#84cc16', exFn: (unit) => `${s.proteinG}g protein → ~${Math.round(s.proteinG / 0.22)}g ${unit}` },
              { icon: '🍚', color: '#f97316', exFn: (unit, ctx) => `${s.trainingDayCarb}g carb${ctx ? ` (${ctx})` : ''} → ~${Math.round(s.trainingDayCarb / 0.28)}g ${unit}` },
              { icon: '🥚', color: '#eab308', exFn: (unit) => `${s.proteinG}g protein → ~${Math.round(s.proteinG / 6)} ${unit}` },
              { icon: '💧', color: '#06b6d4', exFn: (unit) => `${s.weight}kg × 35 = ${(s.weight * 35 / 1000).toFixed(1)}L ${unit}` },
            ].map(({ icon, color, exFn }, fi) => {
              const ffLabel = tPillars(`pillarB.b6.food_formulas.${fi}.label`, { defaultValue: ['Thịt / Cá sống → Protein', 'Cơm chín → Carb', 'Trứng gà (1 quả ≈ 6g protein)', 'Nước uống hằng ngày'][fi] });
              const ffFormula = tPillars(`pillarB.b6.food_formulas.${fi}.formula`, { defaultValue: ['g thịt = Protein ÷ 0.22', 'g cơm = Carb ÷ 0.28', 'Số quả = Protein ÷ 6', 'ml = Cân nặng × 35'][fi] });
              const ffUnit = tPillars(`pillarB.b6.food_formulas.${fi}.unit`, { defaultValue: ['thịt', 'cơm', 'quả trứng/ngày', 'nước/ngày'][fi] });
              const ffCtx = tPillars(`pillarB.b6.food_formulas.${fi}.context`, { defaultValue: ['', 'ngày tập', '', ''][fi] });
              return (
                <div key={fi} className="rounded-xl border p-3.5 flex gap-3" style={{ borderColor: `${color}20`, background: `${color}06` }}>
                  <span className="text-2xl shrink-0 leading-none mt-0.5">{icon}</span>
                  <div>
                    <p className="text-xs font-bold text-text/80 mb-1">{ffLabel}</p>
                    <p className="text-[10px] text-muted font-mono mb-1.5">{ffFormula}</p>
                    <p className="text-[10px] font-bold" style={{ color }}>{exFn(ffUnit, ffCtx)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </RevealBlock>

      {/* Shopping list */}
      <RevealBlock delay={80}>
        <button
          type="button"
          onClick={() => setShowShopping(prev => !prev)}
          className="w-full flex items-center justify-between px-5 py-3 rounded-2xl border border-pink-500/20 bg-pink-500/5 hover:border-pink-500/35 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-pink-300">{b6tr.shopping_title || 'Danh Sách Mua Sắm Tuần'}</span>
            <span className="text-[10px] text-muted border border-border/30 rounded-full px-2 py-0.5">~490.000₫/tuần</span>
          </div>
          <span className="text-muted text-lg transition-transform duration-200" style={{ transform: showShopping ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
        </button>
        {showShopping && (
          <div className="mt-3 grid sm:grid-cols-2 gap-3 animate-fade-in-up">
            {SHOPPING_GROUPS.map((g, gi) => (
              <div key={g.name} className="rounded-2xl border p-4" style={{ borderColor: `${g.color}25`, background: `${g.color}06` }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold" style={{ color: g.color }}>{b6tr.shopping_groups?.[gi] || g.name}</p>
                  {g.tip && <span className="text-[9px] text-muted">{g.tip}</span>}
                </div>
                <ul className="space-y-1">
                  {g.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-[11px] text-muted">
                      <span className="shrink-0 font-bold mt-0.5" style={{ color: g.color }}>·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </RevealBlock>

      {/* Meal prep steps */}
      <RevealBlock delay={120}>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">{b6tr.meal_prep_steps_title || 'Meal Prep Cuối Tuần — 6 Bước'}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {MEAL_PREP_STEPS.map((step, i) => (
            <div
              key={i}
              className="rounded-2xl border p-4 flex flex-col gap-2 hover:scale-[1.02] transition-all duration-200"
              style={{ borderColor: `${step.color}25`, background: `${step.color}06` }}
            >
              <div className="flex items-start gap-2">
                <span className="text-xl shrink-0">{step.icon}</span>
                <p className="text-[11px] text-muted leading-relaxed">
                  {tPillars(`pillarB.b6.meal_prep_steps.${i}.text`, { defaultValue: step.text })}
                </p>
              </div>
              {step.tip && (
                <p className="text-[10px] leading-relaxed pl-7" style={{ color: `${step.color}99` }}>
                  {tPillars(`pillarB.b6.meal_prep_steps.${i}.tip`, { defaultValue: step.tip })}
                </p>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>
    </div>
  );
}

// ─── b7MetricDetail ──────────────────────────────────────────────────────────
function b7MetricDetail(key, s) {
  const heavyPctVsBase = Math.round(((s.heavyDayProteinG - s.proteinG) / s.proteinG) * 100);
  const lightPctVsBase = Math.round(((s.lightDayProteinG - s.proteinG) / s.proteinG) * 100);
  const heavyCarbPct   = Math.round(((s.heavyDayCarbG - s.carbG) / s.carbG) * 100);
  const lightCarbPct   = Math.round(((s.lightDayCarbG - s.carbG) / s.carbG) * 100);
  const preWoPct       = Math.round((s.preWorkoutCarbG / s.heavyDayCarbG) * 100);
  const postWoPct      = Math.round((s.postWorkoutProteinG / s.heavyDayProteinG) * 100);

  const map = {
    heavy_protein: {
      title: 'Protein Ngày Tập Nặng',
      value: `${s.heavyDayProteinG}g`,
      note: `${(s.heavyDayProteinG / s.weight).toFixed(1)}g/kg`,
      params: [
        { label: 'Protein nền',        value: `${s.proteinG}g`,            pct: Math.round((s.proteinG / s.heavyDayProteinG) * 100), color: '#84cc16' },
        { label: 'Thêm (heavy bonus)', value: `+${s.heavyDayProteinG - s.proteinG}g`, pct: 100 - Math.round((s.proteinG / s.heavyDayProteinG) * 100), color: '#f59e0b' },
        { label: 'Tỷ lệ g/kg',         value: `${(s.heavyDayProteinG / s.weight).toFixed(1)}g/kg`, pct: Math.min(100, Math.round(((s.heavyDayProteinG / s.weight) / 2.5) * 100)), color: '#f59e0b' },
      ],
      analysis: `Ngày tập nặng (squat, deadlift, bench press) gây stress cơ cao, cần ${heavyPctVsBase > 0 ? `tăng ${heavyPctVsBase}%` : 'duy trì'} protein so với nền (${s.proteinG}g) để đáp ứng nhu cầu tổng hợp và phục hồi cơ bắp. Mức ${(s.heavyDayProteinG / s.weight).toFixed(1)}g/kg đảm bảo đủ axit amin thiết yếu.`,
      evaluation: {
        icon: '💪', label: heavyPctVsBase >= 10 ? 'Tối ưu phục hồi' : 'Đủ duy trì',
        color: '#f59e0b',
        text: `${s.heavyDayProteinG}g protein = ${s.weight}kg × ${(s.heavyDayProteinG / s.weight).toFixed(1)}g/kg. ${heavyPctVsBase > 0 ? `Tăng ${heavyPctVsBase}% vs protein nền.` : 'Ngang protein nền.'}`,
      },
      suggestions: [
        `Chia ${s.heavyDayProteinG}g thành 4–5 bữa, mỗi bữa ~${Math.round(s.heavyDayProteinG / 4)}–${Math.round(s.heavyDayProteinG / 4) + 5}g`,
        `Bữa sau tập: ${s.postWorkoutProteinG}g protein trong vòng 2 giờ`,
        'Ưu tiên nguồn: ức gà, cá ngừ, trứng, Greek yogurt, whey (nếu dùng)',
        'Kết hợp carb sau tập để tối ưu tổng hợp cơ (insulin spike)',
      ],
      pros: [
        'Hỗ trợ tối đa tổng hợp protein cơ (MPS) sau buổi tập nặng',
        'Giảm phân hủy cơ (catabolism) trong giai đoạn phục hồi',
        'Duy trì cân bằng nitơ dương — điều kiện để tăng cơ',
      ],
      cons: [
        'Cần lên thực đơn cẩn thận để đạt đủ lượng mà không bội thực',
        'Chi phí thực phẩm cao hơn ngày nghỉ',
        'Thận phải xử lý nhiều protein hơn — uống đủ nước',
      ],
    },
    light_protein: {
      title: 'Protein Ngày Tập Nhẹ / Nghỉ',
      value: `${s.lightDayProteinG}g`,
      note: `${(s.lightDayProteinG / s.weight).toFixed(1)}g/kg`,
      params: [
        { label: 'Protein nền',  value: `${s.proteinG}g`,             pct: Math.round((s.proteinG / Math.max(s.proteinG, s.lightDayProteinG)) * 100), color: '#84cc16' },
        { label: 'Ngày nhẹ',    value: `${s.lightDayProteinG}g`,      pct: Math.round((s.lightDayProteinG / Math.max(s.proteinG, s.lightDayProteinG)) * 100), color: '#f59e0b' },
        { label: 'Min an toàn', value: `${Math.round(s.weight * 1.4)}g`, pct: Math.round((s.weight * 1.4 / s.lightDayProteinG) * 100), color: '#6b7280' },
      ],
      analysis: `Ngày tập nhẹ hoặc nghỉ, nhu cầu protein giảm so với ngày nặng nhưng ${lightPctVsBase < 0 ? `chỉ giảm ${Math.abs(lightPctVsBase)}%` : 'vẫn duy trì'} — không nên xuống dưới 1.4g/kg (${Math.round(s.weight * 1.4)}g) để tránh mất cơ. Mức ${(s.lightDayProteinG / s.weight).toFixed(1)}g/kg cân bằng phục hồi và tổng calo.`,
      evaluation: {
        icon: s.lightDayProteinG >= Math.round(s.weight * 1.4) ? '✅' : '⚠️',
        label: s.lightDayProteinG >= Math.round(s.weight * 1.4) ? 'An toàn' : 'Cần xem lại',
        color: s.lightDayProteinG >= Math.round(s.weight * 1.4) ? '#22c55e' : '#f97316',
        text: `${s.lightDayProteinG}g ${lightPctVsBase < 0 ? `(giảm ${Math.abs(lightPctVsBase)}% vs nền)` : '(bằng nền)'}. Ngưỡng tối thiểu an toàn: ${Math.round(s.weight * 1.4)}g (1.4g/kg).`,
      },
      suggestions: [
        'Ngày nghỉ vẫn ăn đủ protein — cơ phục hồi mạnh nhất lúc nghỉ',
        `Có thể giảm 1 bữa protein so với ngày nặng, nhưng giữ ≥ ${Math.round(s.weight * 1.4)}g`,
        'Ưu tiên thực phẩm tự nhiên thay protein bột ngày nghỉ',
        'Kết hợp rau xanh và chất béo lành mạnh để tối ưu hấp thu',
      ],
      pros: [
        'Giảm áp lực hệ tiêu hóa vào ngày không tập nặng',
        'Giúp cân bằng tổng calo tuần mà không thiếu dưỡng chất',
        'Linh hoạt hơn cho kế hoạch bữa ăn xã hội',
      ],
      cons: [
        'Nguy cơ giảm dưới ngưỡng tối thiểu nếu không theo dõi',
        'Có thể cảm giác đói hơn do carb cũng giảm cùng lúc',
      ],
    },
    heavy_carb: {
      title: 'Carb Ngày Tập Nặng',
      value: `${s.heavyDayCarbG}g`,
      note: `+${heavyCarbPct}% vs nền`,
      params: [
        { label: 'Carb nền',       value: `${s.carbG}g`,         pct: Math.round((s.carbG / s.heavyDayCarbG) * 100), color: '#84cc16' },
        { label: 'Bonus heavy',    value: `+${s.heavyDayCarbG - s.carbG}g`, pct: 100 - Math.round((s.carbG / s.heavyDayCarbG) * 100), color: '#f59e0b' },
        { label: 'Pre-workout',    value: `${s.preWorkoutCarbG}g (${preWoPct}%)`, pct: preWoPct, color: '#06b6d4' },
      ],
      analysis: `Tăng carb ${heavyCarbPct}% (lên ${s.heavyDayCarbG}g) vào ngày tập nặng đảm bảo glycogen cơ và gan đủ cho hiệu suất cao. Phân bổ: ~${s.preWorkoutCarbG}g trước tập, phần còn lại rải đều qua ngày. Carb cao + protein cao ngày nặng = công thức tối ưu tăng cơ.`,
      evaluation: {
        icon: '⚡', label: `+${heavyCarbPct}% glycogen load`, color: '#f59e0b',
        text: `${s.heavyDayCarbG}g = ${s.carbG}g × 1.4. Pre-workout: ${s.preWorkoutCarbG}g. Phần còn lại: ${s.heavyDayCarbG - s.preWorkoutCarbG}g rải đều.`,
      },
      suggestions: [
        `Ăn ${s.preWorkoutCarbG}g carb 30–60 phút trước tập: chuối, bánh gạo, oatmeal`,
        `Sau tập: ${s.postWorkoutCarbG}g carb + ${s.postWorkoutProteinG}g protein trong 2 giờ`,
        `Phần còn lại (${s.heavyDayCarbG - s.preWorkoutCarbG - s.postWorkoutCarbG}g) rải 3 bữa chính`,
        'Ưu tiên carb phức hợp: gạo lứt, khoai lang, yến mạch, mì ống',
      ],
      pros: [
        'Nạp đầy glycogen — tăng hiệu suất tập 8–15%',
        'Giảm mệt mỏi cơ trong buổi tập dài hoặc nhiều set',
        'Hỗ trợ phục hồi glycogen nhanh hơn sau tập',
      ],
      cons: [
        'Dễ cảm giác nặng bụng nếu ăn quá gần giờ tập',
        'Cần phân bổ đúng thời điểm, không ăn hết một lần',
        'Carb tăng đột ngột có thể làm tăng đường huyết nếu chọn nguồn đơn giản',
      ],
    },
    light_carb: {
      title: 'Carb Ngày Tập Nhẹ / Nghỉ',
      value: `${s.lightDayCarbG}g`,
      note: `${lightCarbPct}% vs nền`,
      params: [
        { label: 'Carb nền',  value: `${s.carbG}g`,         pct: 100, color: '#84cc16' },
        { label: 'Ngày nhẹ', value: `${s.lightDayCarbG}g`,  pct: Math.round((s.lightDayCarbG / s.carbG) * 100), color: '#f59e0b' },
        { label: 'Tiết kiệm',value: `-${s.carbG - s.lightDayCarbG}g`, pct: Math.round(((s.carbG - s.lightDayCarbG) / s.carbG) * 100), color: '#6b7280' },
      ],
      analysis: `Giảm carb xuống ${s.lightDayCarbG}g (${Math.abs(lightCarbPct)}% thấp hơn nền) ngày nghỉ/tập nhẹ giúp cân bằng tổng calo tuần, tăng nhạy cảm insulin và khuyến khích dùng mỡ làm nhiên liệu. Kỹ thuật "carb cycling" kinh điển cho body recomposition.`,
      evaluation: {
        icon: '🔄', label: 'Carb Cycling', color: '#f59e0b',
        text: `${s.lightDayCarbG}g = ${s.carbG}g × 0.6. Tiết kiệm ${s.carbG - s.lightDayCarbG}g vs nền. Glycogen dự trữ đủ cho ngày nhẹ, không cần nạp thêm.`,
      },
      suggestions: [
        'Ưu tiên carb từ rau củ và một ít gạo/khoai ngày nghỉ',
        'Tăng chất béo lành mạnh (avocado, olive oil, hạt) bù calo từ carb',
        'Uống đủ 2–2.5L nước để hỗ trợ chuyển hóa mỡ',
        'Ngày nhẹ là cơ hội tốt để ăn nhiều rau xanh và chất xơ',
      ],
      pros: [
        'Cải thiện độ nhạy insulin — cơ thể sử dụng carb hiệu quả hơn ngày nặng',
        'Khuyến khích đốt mỡ khi glycogen thấp hơn bình thường',
        'Giảm bloating và cảm giác nặng nề ngày không tập',
      ],
      cons: [
        'Cảm giác thiếu năng lượng và mệt nếu hoạt động không lên kế hoạch',
        'Cần kiên định với kế hoạch — dễ bị "bù" carb không cần thiết',
        'Ít phù hợp với người có lịch tập không cố định',
      ],
    },
    preworkout_carb: {
      title: 'Pre-Workout Carb',
      value: `${s.preWorkoutCarbG}g`,
      note: '30–60 phút trước tập',
      params: [
        { label: 'Pre-workout',  value: `${s.preWorkoutCarbG}g`,  pct: preWoPct, color: '#06b6d4' },
        { label: 'Còn lại',      value: `${s.heavyDayCarbG - s.preWorkoutCarbG}g`, pct: 100 - preWoPct, color: '#f59e0b' },
        { label: '% carb ngày nặng', value: `${preWoPct}%`,       pct: preWoPct, color: '#a855f7' },
      ],
      analysis: `${s.preWorkoutCarbG}g carb trước tập ≈ ${preWoPct}% tổng carb ngày nặng (${s.heavyDayCarbG}g). Lượng vừa đủ để cung cấp glucose tức thì mà không gây nặng bụng. Kết quả: cải thiện hiệu suất 5–10%, đặc biệt cho set nặng và tập kéo dài >60 phút.`,
      evaluation: {
        icon: '⚡', label: `${preWoPct}% carb trước tập`, color: '#06b6d4',
        text: `${s.preWorkoutCarbG}g = 15% × ${s.heavyDayCarbG}g. Tiêu hóa trong 30–45 phút, glucose sẵn sàng cho cơ trong 60–90 phút.`,
      },
      suggestions: [
        `Ăn ${s.preWorkoutCarbG}g carb đơn giản 30–60 phút trước tập`,
        'Lựa chọn tốt: 1 quả chuối (~27g carb), bánh gạo (23g/cái), 100g cơm trắng (~29g)',
        'Kết hợp 10–15g protein nhỏ: sữa chua ít béo, 1 quả trứng',
        'Tránh chất xơ cao và chất béo ngay trước tập — làm chậm tiêu hóa',
      ],
      pros: [
        'Glucose sẵn sàng khi cơ cần — tăng sức mạnh và sức bền',
        'Ngăn dị hóa (catabolism) khi glycogen bắt đầu cạn',
        'Cải thiện tập trung và tâm trạng trong buổi tập',
      ],
      cons: [
        'Nếu ăn quá gần giờ tập có thể gây chuột rút hoặc buồn nôn',
        'Carb đơn giản có thể gây insulin spike rồi crash nếu ăn >2h trước',
        'Không phù hợp với người tập cardio sáng sớm khi đói (fasted cardio)',
      ],
    },
    postworkout_protein: {
      title: 'Post-Workout Protein',
      value: `${s.postWorkoutProteinG}g`,
      note: 'trong 2h sau tập',
      params: [
        { label: 'Post-workout P', value: `${s.postWorkoutProteinG}g`, pct: postWoPct, color: '#f59e0b' },
        { label: 'Post-workout C', value: `${s.postWorkoutCarbG}g`,    pct: Math.round((s.postWorkoutCarbG / (s.postWorkoutProteinG + s.postWorkoutCarbG)) * 100), color: '#06b6d4' },
        { label: 'Tỷ lệ P:C',     value: `1:${(s.postWorkoutCarbG / s.postWorkoutProteinG).toFixed(1)}`, pct: Math.round((s.postWorkoutProteinG / (s.postWorkoutProteinG + s.postWorkoutCarbG)) * 100), color: '#a855f7' },
      ],
      analysis: `${s.postWorkoutProteinG}g protein (${s.weight}kg × 0.3g/kg) trong cửa sổ vàng 2 giờ sau tập, kết hợp ${s.postWorkoutCarbG}g carb (${s.weight}kg × 0.5g/kg). Tỷ lệ P:C = 1:${(s.postWorkoutCarbG / s.postWorkoutProteinG).toFixed(1)} tối ưu cho cả tổng hợp cơ và nạp glycogen đồng thời.`,
      evaluation: {
        icon: '🏆', label: 'Cửa sổ vàng 2h', color: '#f59e0b',
        text: `P: ${s.postWorkoutProteinG}g + C: ${s.postWorkoutCarbG}g = ${s.postWorkoutProteinG + s.postWorkoutCarbG}g tổng. Insulin từ carb vận chuyển amino acid vào cơ — synergy tối ưu.`,
      },
      suggestions: [
        `Ăn ${s.postWorkoutProteinG}g protein + ${s.postWorkoutCarbG}g carb trong 30–120 phút sau tập`,
        `Nguồn protein nhanh: whey shake (${s.postWorkoutProteinG}g), ức gà 150g, 3 quả trứng`,
        `Nguồn carb nhanh: 150g cơm trắng, 2 lát bánh mì, 1–2 quả chuối`,
        'Uống đủ nước — mỗi 1g glycogen cần 3g nước để lưu trữ',
      ],
      pros: [
        'Tối đa hóa MPS (Muscle Protein Synthesis) trong giai đoạn nhạy cảm nhất',
        'Phục hồi glycogen cơ nhanh — sẵn sàng cho buổi tập tiếp theo',
        'Insulin từ carb làm tăng hấp thu amino acid vào tế bào cơ',
      ],
      cons: [
        'Cần chuẩn bị thực phẩm trước — dễ bỏ qua nếu bận rộn sau tập',
        'Một số nghiên cứu mới cho thấy "anabolic window" rộng hơn 2h — áp lực thời gian có thể overrated',
        'Tổng protein cả ngày quan trọng hơn timing — nhưng timing vẫn có lợi',
      ],
    },
  };
  return map[key] ?? null;
}

// ─── B7 helper components ────────────────────────────────────────────────────

function FormulaRow({ label, formula, result, color }) {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <span className="font-bold text-muted w-14 shrink-0">{label}</span>
      <span className="text-muted/60 font-mono flex-1 leading-relaxed">{formula}</span>
      <span className="font-black shrink-0" style={{ color }}>= {result}</span>
    </div>
  );
}

function MacroFormulaChain({ s }) {
  const bmrFormula = s.sex === 'male'
    ? `10×${s.weight} + 6.25×${s.height} − 5×${s.age} + 5`
    : `10×${s.weight} + 6.25×${s.height} − 5×${s.age} − 161`;

  const steps = [
    { label: 'BMR', value: s.bmr.toLocaleString(), unit: 'kcal/ngày', formula: bmrFormula, color: '#8b5cf6' },
    { label: 'TDEE', value: s.tdee.toLocaleString(), unit: 'kcal/ngày', formula: `${s.bmr.toLocaleString()} × ${s.activity.mult}`, color: '#f59e0b' },
    { label: 'Mục Tiêu', value: s.targetKcal.toLocaleString(), unit: 'kcal/ngày', formula: `${s.tdee.toLocaleString()} ${s.goal.delta >= 0 ? '+' : ''}${s.goal.delta} (${s.goal.label})`, color: '#ec4899' },
  ];
  const macros = [
    { label: 'Protein', value: `${s.proteinG}g`, formula: `${s.weight}kg × ${(s.proteinG / s.weight).toFixed(1)}g/kg`, pct: s.proteinPct, color: '#84cc16' },
    { label: 'Fat', value: `${s.fatG}g`, formula: `${s.targetKcal} × 25% ÷ 9`, pct: s.fatPct, color: '#eab308' },
    { label: 'Carb', value: `${s.carbG}g`, formula: `(${s.targetKcal} − ${s.proteinG * 4} − ${s.fatG * 9}) ÷ 4`, pct: s.carbPct, color: '#f97316' },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {steps.map((step, i) => (
          <div key={step.label} className="rounded-xl border p-3 text-center relative" style={{ borderColor: `${step.color}30`, background: `${step.color}08` }}>
            {i < steps.length - 1 && (
              <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 text-muted/30 text-xs z-10 hidden sm:block">→</span>
            )}
            <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">{step.label}</p>
            <p className="text-xl font-black leading-none mb-1" style={{ color: step.color }}>{step.value}</p>
            <p className="text-[9px] text-muted">{step.unit}</p>
            <p className="text-[9px] font-mono text-muted/50 mt-1.5 leading-relaxed break-all">{step.formula}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center text-[10px] text-muted/40">↓ Phân bổ macro từ kcal mục tiêu</div>
      <div className="grid grid-cols-3 gap-2">
        {macros.map((m) => (
          <div key={m.label} className="rounded-xl border p-3 text-center" style={{ borderColor: `${m.color}30`, background: `${m.color}08` }}>
            <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">{m.label}</p>
            <p className="text-xl font-black leading-none mb-1" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[9px] font-bold" style={{ color: m.color }}>{m.pct}% kcal</p>
            <p className="text-[9px] font-mono text-muted/50 mt-1.5 leading-relaxed break-all">{m.formula}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MacroCycleBarChart({ s }) {
  const types = [
    { label: 'Ngày Nghỉ', sub: '×0.90', mult: 0.90, color: '#22c55e' },
    { label: 'Tập Nhẹ',   sub: '×0.95', mult: 0.95, color: '#06b6d4' },
    { label: 'Tập Vừa',   sub: '×1.00', mult: 1.00, color: '#f59e0b' },
    { label: 'Tập Nặng',  sub: '×1.07', mult: 1.07, color: '#ef4444' },
  ];
  const kcals = types.map(t => Math.round(s.tdee * t.mult));
  const W = 460, H = 100, PAD_T = 22, PAD_B = 42, PAD_LR = 16;
  const slotW = (W - PAD_LR * 2) / 4;
  const BAR_W = slotW * 0.52;
  const maxKcal = Math.max(...kcals);
  const minKcal = Math.min(...kcals) * 0.91;
  const safeRange = maxKcal * 1.02 - minKcal;
  const yOf = k => PAD_T + H * (1 - (k - minKcal) / safeRange);
  const tdeeY = yOf(s.tdee);
  const totalH = PAD_T + H + PAD_B;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ overflow: 'visible' }}>
      <line x1={PAD_LR} y1={tdeeY} x2={W - PAD_LR} y2={tdeeY}
        stroke="#ffffff18" strokeWidth="1" strokeDasharray="4 3" />
      <text x={W - PAD_LR + 4} y={tdeeY + 3} fontSize="7" fill="#ffffff28">TDEE</text>
      {types.map((t, i) => {
        const x = PAD_LR + slotW * i + slotW / 2;
        const kcal = kcals[i];
        const y = yOf(kcal);
        const diffPct = Math.round((t.mult - 1) * 100);
        return (
          <g key={i}>
            <rect x={x - BAR_W / 2} y={y} width={BAR_W} height={PAD_T + H - y + 2} fill={`${t.color}18`} rx="4" />
            <rect x={x - BAR_W / 2} y={y} width={BAR_W} height={4} fill={t.color} rx="3" opacity="0.75" />
            <text x={x} y={y - 9} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={`${t.color}dd`}>
              {(kcal / 1000).toFixed(1)}k
            </text>
            <text x={x} y={PAD_T + H + 14} textAnchor="middle" fontSize="8" fill="#9ca3af70">{t.label}</text>
            <text x={x} y={PAD_T + H + 28} textAnchor="middle" fontSize="7.5" fill={`${t.color}90`}>
              {diffPct === 0 ? 'TDEE' : `${diffPct > 0 ? '+' : ''}${diffPct}%`}
            </text>
            <text x={x} y={PAD_T + H + 40} textAnchor="middle" fontSize="7" fill={`${t.color}55`}>
              {(kcal / 1000).toFixed(2)}k kcal
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function PrePostWorkoutProtocol({ s }) {
  const preCarb = [Math.round(s.weight * 0.5), Math.round(s.weight * 1.0)];
  const preProtein = [Math.round(s.weight * 0.2), Math.round(s.weight * 0.3)];
  const postProtein = [Math.round(s.weight * 0.25), Math.round(s.weight * 0.4)];
  const postCarb = [Math.round(s.weight * 0.5), Math.round(s.weight * 1.0)];
  const postWater = [Math.round(s.weight * 0.3 * 10) / 10, Math.round(s.weight * 0.5 * 10) / 10];

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-orange-500/25 bg-orange-500/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">⚡</span>
          <div>
            <p className="text-sm font-bold text-orange-300">Pre-Workout</p>
            <p className="text-[10px] text-muted">60–120 phút trước tập</p>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <FormulaRow label="Carb" formula={`${s.weight}kg × 0.5–1g/kg`} result={`${preCarb[0]}–${preCarb[1]}g`} color="#f97316" />
          <FormulaRow label="Protein" formula={`${s.weight}kg × 0.2–0.3g/kg`} result={`${preProtein[0]}–${preProtein[1]}g`} color="#84cc16" />
          <FormulaRow label="Fat" formula="Hạn chế (nặng bụng)" result="< 10g" color="#eab308" />
        </div>
        <div className="border-t border-orange-500/15 pt-3">
          <p className="text-[9px] font-bold text-orange-400 uppercase mb-2">Gợi ý thực phẩm</p>
          <div className="flex flex-wrap gap-1">
            {['Chuối + sữa chua', 'Bánh mì + trứng', 'Yến mạch + sữa', 'Cơm nhỏ + gà'].map(f => (
              <span key={f} className="text-[10px] text-orange-300/80 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded-lg">{f}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-green-500/25 bg-green-500/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💪</span>
          <div>
            <p className="text-sm font-bold text-green-300">Post-Workout</p>
            <p className="text-[10px] text-muted">Trong 1–2 giờ sau tập</p>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <FormulaRow label="Protein" formula={`${s.weight}kg × 0.25–0.4g/kg`} result={`${postProtein[0]}–${postProtein[1]}g`} color="#84cc16" />
          <FormulaRow label="Carb" formula={`${s.weight}kg × 0.5–1g/kg`} result={`${postCarb[0]}–${postCarb[1]}g`} color="#f97316" />
          <FormulaRow label="Nước" formula={`${s.weight}kg × 0.3–0.5L`} result={`${postWater[0]}–${postWater[1]}L bù`} color="#06b6d4" />
        </div>
        <div className="border-t border-green-500/15 pt-3">
          <p className="text-[9px] font-bold text-green-400 uppercase mb-2">Gợi ý thực phẩm</p>
          <div className="flex flex-wrap gap-1">
            {['Cơm + gà/cá/bò', 'Trứng + bánh mì', 'Sữa + chuối', 'Whey + khoai'].map(f => (
              <span key={f} className="text-[10px] text-green-300/80 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-lg">{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EnduranceFuelingGuide({ s }) {
  const zones = [
    {
      icon: '🏃', duration: '< 60 phút',
      carb: 'Không cần', carbExample: null,
      water: '400–600ml', electrolyte: 'Không cần',
      color: '#22c55e',
      note: 'Nước là đủ. Bữa ăn trước đủ carb là quan trọng nhất.',
    },
    {
      icon: '🚴', duration: '60–120 phút',
      carb: '30–60g/giờ', carbExample: `${Math.round(s.weight * 0.4)}–${Math.round(s.weight * 0.8)}g/h`,
      water: '400–800ml/giờ', electrolyte: 'Nên dùng',
      color: '#f59e0b',
      note: `Bắt đầu nạp từ phút 30–45, không chờ đói. Ví dụ ${s.weight}kg: ${Math.round(s.weight * 0.4)}–${Math.round(s.weight * 0.8)}g carb/h.`,
    },
    {
      icon: '🏊', duration: '> 120 phút',
      carb: '60–90g/giờ', carbExample: `${Math.round(s.weight * 0.8)}–${Math.round(s.weight * 1.2)}g/h`,
      water: '500–1000ml/giờ', electrolyte: 'Bắt buộc',
      color: '#ef4444',
      note: 'Gel + nước dừa + điện giải. Tránh chuột rút do mất natri/kali.',
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-3">
      {zones.map((z, i) => (
        <RevealBlock key={i} delay={i * 60}>
          <div className="rounded-2xl border p-4 h-full" style={{ borderColor: `${z.color}25`, background: `${z.color}06` }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{z.icon}</span>
              <span className="text-xs font-black" style={{ color: z.color }}>{z.duration}</span>
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-[10px]">
                <span className="text-muted">Carb/giờ</span>
                <span className="font-bold" style={{ color: z.color }}>{z.carb}</span>
              </div>
              {z.carbExample && (
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted">{s.weight}kg:</span>
                  <span className="font-bold text-text/70">{z.carbExample}</span>
                </div>
              )}
              <div className="flex justify-between text-[10px]">
                <span className="text-muted">Nước/giờ</span>
                <span className="font-bold text-cyan-400/80">{z.water}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted">Điện giải</span>
                <span className="font-bold" style={{ color: z.electrolyte === 'Bắt buộc' ? '#ef4444' : z.electrolyte === 'Nên dùng' ? '#f59e0b' : '#22c55e' }}>{z.electrolyte}</span>
              </div>
            </div>
            <div className="pt-3 border-t" style={{ borderColor: `${z.color}20` }}>
              <p className="text-[10px] text-muted leading-relaxed">{z.note}</p>
            </div>
          </div>
        </RevealBlock>
      ))}
    </div>
  );
}

// ─── AdvancedPanel (B7) ──────────────────────────────────────────────────────
function AdvancedPanel({ s }) {
  const { t: tPillars } = useTranslation('pillars');
  const b7tr = tPillars('pillarB.b7', { returnObjects: true }) || {};
  const [selectedMetric, setSelectedMetric] = useState(null);
  const detail = selectedMetric ? b7MetricDetail(selectedMetric, s) : null;

  return (
    <div className="space-y-10">
      <PersonalizedBar panelId="b7" color="#f59e0b" label={b7tr.bar_label || 'Macro Cá Nhân Hóa Theo Loại Buổi Tập'} source="B0 → B1 → ... → B6 (Toàn Bộ)"
        selectedKey={selectedMetric} onSelect={setSelectedMetric}
        items={[
          { key: 'heavy_protein',    label: b7tr.bar_heavy_protein || 'Protein nặng',    value: `${s.heavyDayProteinG}g`,   note: `${(s.heavyDayProteinG/s.weight).toFixed(1)}g/kg`,  tip: `Ngày tập nặng (squat, deadlift, bench): ${s.heavyDayProteinG}g = ${s.weight}kg × ${(s.heavyDayProteinG/s.weight).toFixed(1)}g/kg. Tăng 10–20% so với protein nền (${s.proteinG}g) để hỗ trợ phục hồi và tổng hợp cơ sau stress cao.` },
          { key: 'light_protein',    label: b7tr.bar_light_protein || 'Protein nhẹ',     value: `${s.lightDayProteinG}g`,   note: `${(s.lightDayProteinG/s.weight).toFixed(1)}g/kg`,  tip: `Ngày tập nhẹ hoặc nghỉ: ${s.lightDayProteinG}g = ${s.weight}kg × ${(s.lightDayProteinG/s.weight).toFixed(1)}g/kg. Giảm nhẹ so với protein nền nhưng không nên xuống dưới 1.4g/kg để không mất cơ.` },
          { key: 'heavy_carb',       label: b7tr.bar_heavy_carb || 'Carb ngày nặng',     value: `${s.heavyDayCarbG}g`,      note: '+40% vs nền',                                       tip: `Ngày tập nặng cần ${s.heavyDayCarbG}g carb (= ${s.carbG}g × 1.4). Tăng carb để nạp đủ glycogen cho buổi tập cường độ cao. Phân bổ: ~${s.preWorkoutCarbG}g trước tập, phần còn lại rải đều.` },
          { key: 'light_carb',       label: b7tr.bar_light_carb || 'Carb ngày nhẹ',      value: `${s.lightDayCarbG}g`,      note: '-40% vs nền',                                       tip: `Ngày nghỉ hoặc tập nhẹ chỉ cần ${s.lightDayCarbG}g carb (= ${s.carbG}g × 0.6). Giảm carb ngày nghỉ giúp tổng calo tuần đúng mục tiêu mà vẫn có carb cao cho ngày tập quan trọng.` },
          { key: 'preworkout_carb',  label: b7tr.bar_pre_carb || 'Pre-workout carb',      value: `${s.preWorkoutCarbG}g`,   note: '30–60 phút trước',                                  tip: `${s.preWorkoutCarbG}g carb ≈ 15% lượng carb ngày nặng (${s.heavyDayCarbG}g). Ăn 30–60 phút trước tập: chuối, bánh gạo, hoặc cơm nhỏ. Cung cấp glucose tức thì cho não và cơ, cải thiện hiệu suất 5–10%.` },
          { key: 'postworkout_protein', label: b7tr.bar_post_protein || 'Post-workout P', value: `${s.postWorkoutProteinG}g`, note: 'trong 2h sau tập',                               tip: `${s.postWorkoutProteinG}g = ${s.weight}kg × 0.3g/kg. Trong 2 giờ sau tập, cửa sổ tổng hợp protein mở rộng nhất. Kết hợp với ${s.postWorkoutCarbG}g carb (${s.weight}kg × 0.5g/kg) để tối ưu phục hồi glycogen và tổng hợp cơ.` },
        ]} />
      {detail && <MetricDetailCard detail={detail} color="#f59e0b" onClose={() => setSelectedMetric(null)} />}

      {/* Context image */}
      <RevealBlock>
        <div className="pb-orbit-ring rounded-3xl p-[1.5px]">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-64">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=75&auto=format&fit=crop"
              alt="Advanced athletic nutrition"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
            <div className="absolute bottom-4 left-6 flex items-center gap-3">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest bg-bg/60 px-3 py-1 rounded-full border border-amber-500/20">
                {b7tr.image_badge || 'Dinh Dưỡng Vận Động Viên'}
              </span>
              <span className="text-[10px] text-muted/60 bg-bg/40 px-2 py-1 rounded-full">
                {b7tr.image_caption || 'Tối ưu hiệu suất & phục hồi'}
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* Macro formula chain */}
      <RevealBlock>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">🧮</span>
            <div>
              <p className="text-sm font-bold text-amber-300">{b7tr.chain_title || 'Chuỗi Tính Toán Macro'}</p>
              <p className="text-[10px] text-muted">{b7tr.chain_sub || 'BMR → TDEE → Mục Tiêu → Protein / Fat / Carb'}</p>
            </div>
          </div>
          <MacroFormulaChain s={s} />
          <div className="mt-4 rounded-xl bg-amber-500/8 border border-amber-500/15 p-3">
            <p className="text-[10px] text-amber-400/80 leading-relaxed">
              {b7tr.chain_note || '📌 Lưu ý: Công thức Mifflin-St Jeor cho sai số ±100–150 kcal so với thực tế. Dùng làm điểm xuất phát, sau 2 tuần điều chỉnh theo cân nặng: cân không giảm → giảm 100–200 kcal; cân giảm > 1kg/tuần → tăng 100–200 kcal.'}
            </p>
          </div>
        </div>
      </RevealBlock>

      {/* Macro cycle bar chart */}
      <RevealBlock delay={40}>
        <div className="rounded-2xl border border-border/25 bg-surface/5 p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="text-sm font-bold text-text">{b7tr.chart_title || 'Biểu Đồ Chu Kỳ Calo Theo Ngày'}</p>
                <p className="text-[10px] text-muted">{b7tr.chart_sub || 'Điều chỉnh TDEE × hệ số theo cường độ buổi tập'}</p>
              </div>
            </div>
            <span className="text-[10px] text-muted/50 bg-surface/40 px-2 py-1 rounded-full border border-border/20">
              TDEE = {s.tdee.toLocaleString()} kcal
            </span>
          </div>
          <div className="mt-3">
            <MacroCycleBarChart s={s} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {[
              { label: b7tr.day_types?.[0]?.label || 'Ngày Nghỉ', mult: 0.90, kcal: Math.round(s.tdee * 0.90), color: '#22c55e', note: b7tr.day_types?.[0]?.note || 'Carb thấp, fat cao hơn' },
              { label: b7tr.day_types?.[1]?.label || 'Tập Nhẹ',   mult: 0.95, kcal: Math.round(s.tdee * 0.95), color: '#06b6d4', note: b7tr.day_types?.[1]?.note || 'Duy trì, cardio nhẹ' },
              { label: b7tr.day_types?.[2]?.label || 'Tập Vừa',   mult: 1.00, kcal: Math.round(s.tdee * 1.00), color: '#f59e0b', note: b7tr.day_types?.[2]?.note || 'Bằng TDEE, cân bằng' },
              { label: b7tr.day_types?.[3]?.label || 'Tập Nặng',  mult: 1.07, kcal: Math.round(s.tdee * 1.07), color: '#ef4444', note: b7tr.day_types?.[3]?.note || 'Nạp carb tối đa' },
            ].map(d => (
              <div key={d.label} className="rounded-xl p-3 text-center" style={{ background: `${d.color}08`, border: `1px solid ${d.color}20` }}>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: d.color }}>{d.label}</p>
                <p className="text-base font-black leading-none mb-1" style={{ color: d.color }}>{(d.kcal / 1000).toFixed(1)}k</p>
                <p className="text-[9px] text-muted">{d.note}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* Pre/Post workout protocol */}
      <RevealBlock delay={60}>
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-sm font-bold text-text">{b7tr.peri_title || 'Giao Thức Dinh Dưỡng Quanh Buổi Tập'}</p>
              <p className="text-[10px] text-muted">{(b7tr.peri_subtitle || 'Tính theo cân nặng {weight}kg — từ tài liệu nghiên cứu thực hành').replace('{weight}', s.weight)}</p>
            </div>
          </div>
          <PrePostWorkoutProtocol s={s} />
          <div className="rounded-xl bg-surface/10 border border-border/20 p-3">
            <p className="text-[10px] text-muted leading-relaxed">
              {b7tr.peri_note || '⏱ Timing tối ưu: Pre-workout ăn sớm 60–120 phút → cơ thể đã tiêu hóa xong khi tập. Nếu chỉ có 30 phút, chọn carb đơn giản (chuối, bánh gạo). Post-workout: 30 phút đầu là lý tưởng nhất — insulin nhạy cao, mTOR kích hoạt mạnh.'}
            </p>
          </div>
        </div>
      </RevealBlock>

      {/* Endurance fueling guide */}
      <RevealBlock delay={80}>
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🏁</span>
            <div>
              <p className="text-sm font-bold text-text">{b7tr.endurance_title || 'Hướng Dẫn Nạp Nhiên Liệu Sức Bền'}</p>
              <p className="text-[10px] text-muted">{b7tr.endurance_subtitle || '3 vùng thời gian — chiến lược carb + nước + điện giải'}</p>
            </div>
          </div>
          <EnduranceFuelingGuide s={s} />
          <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/20 p-3">
            <p className="text-[10px] text-cyan-400/80 leading-relaxed">
              <span className="font-bold">💡 Quy tắc 30-45:</span> Bắt đầu nạp carb từ phút thứ 30–45 của buổi tập sức bền, <em>không chờ đến khi cảm thấy mệt</em> — lúc đó đã trễ. Mỗi 15–20 phút nạp thêm 1 lần: gel năng lượng, nước dừa, hoặc chuối.
            </p>
          </div>
        </div>
      </RevealBlock>

      {/* Training day types */}
      <RevealBlock delay={100}>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">{b7tr.day_nutrition_title || 'Dinh Dưỡng Theo Loại Ngày Tập'}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {TRAINING_DAY_TYPES.map((d, dIdx) => (
            <RevealBlock key={d.type}>
              <div
                className="rounded-2xl p-5 border hover:scale-[1.01] transition-all duration-200"
                style={{ borderColor: d.border, background: d.bg }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-black" style={{ color: d.color }}>{tPillars(`pillarB.b7.training_day_types.${dIdx}.type`, { defaultValue: d.type })}</span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ color: d.color, background: `${d.color}15`, border: `1px solid ${d.color}30` }}
                  >
                    {d.sub}
                  </span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed mb-4">{tPillars(`pillarB.b7.training_day_types.${dIdx}.desc`, { defaultValue: d.desc })}</p>
                <div className="rounded-xl overflow-hidden border" style={{ borderColor: d.border }}>
                  {[
                    { k: b7tr.col_calo || 'Calo', v: d.kcal },
                    { k: 'Protein', v: d.protein },
                    { k: 'Carb', v: d.carb },
                    { k: 'Fat', v: d.fat },
                    { k: b7tr.col_water || 'Nước', v: d.water },
                  ].map((row, i) => (
                    <div
                      key={row.k}
                      className="flex items-center justify-between px-3 py-2 text-[11px]"
                      style={{ background: i % 2 === 0 ? `${d.color}06` : 'transparent' }}
                    >
                      <span className="text-muted font-medium">{row.k}</span>
                      <span className="font-bold" style={{ color: d.color }}>{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealBlock>
          ))}
        </div>
      </RevealBlock>

      {/* Timing schedule */}
      <RevealBlock delay={120}>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">{b7tr.timing_title || 'Lịch Nạp Dinh Dưỡng Trong Ngày Tập Đôi'}</p>
        <div className="rounded-2xl border border-border/30 bg-surface/10 overflow-hidden">
          {TIMING_SCHEDULE.map((t, i) => (
            <div
              key={i}
              className="flex items-start gap-4 px-5 py-4 border-b border-border/20 last:border-b-0 hover:bg-white/[0.02] transition-colors duration-150"
            >
              <div className="shrink-0 w-24 text-right">
                <span className="text-[10px] font-black" style={{ color: t.color }}>{t.time}</span>
              </div>
              <div className="w-px self-stretch" style={{ background: `${t.color}40` }} />
              <div className="flex-1">
                <p className="text-xs font-bold text-text mb-0.5">{tPillars(`pillarB.b7.timing_schedule.${i}.label`, { defaultValue: t.label })}</p>
                <p className="text-[11px] text-muted leading-relaxed">{tPillars(`pillarB.b7.timing_schedule.${i}.foods`, { defaultValue: t.foods })}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Athlete principles */}
      <RevealBlock delay={140}>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">5 Nguyên Tắc Vận Động Viên</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ATHLETE_PRINCIPLES.map((p, i) => (
            <div
              key={i}
              className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4 hover:border-amber-500/30 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{p.icon}</span>
                <p className="text-xs font-bold text-amber-300">{p.title}</p>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </RevealBlock>
    </div>
  );
}

// ─── MantraCard — 3D tilt + gleam sweep + mouse spotlight ────────────────────
function MantraCard({ m, i }) {
  const ref  = useRef(null);
  const [hov, setHov]   = useState(false);
  const [gleam, setGleam] = useState(0);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top)  / r.height;
    el.style.setProperty('--mx', `${Math.round(x * 100)}%`);
    el.style.setProperty('--my', `${Math.round(y * 100)}%`);
    el.style.setProperty('--tx', `${(x - 0.5) * -10}deg`);
    el.style.setProperty('--ty', `${(y - 0.5) *  8}deg`);
  }, []);

  const onEnter = useCallback(() => { setHov(true);  setGleam(g => g + 1); }, []);
  const onLeave = useCallback(() => {
    setHov(false);
    const el = ref.current;
    if (el) { el.style.setProperty('--tx', '0deg'); el.style.setProperty('--ty', '0deg'); }
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative flex flex-col rounded-2xl border animate-fade-in-up overflow-hidden cursor-default"
      style={{
        animationDelay: `${i * 70}ms`,
        animationFillMode: 'both',
        borderColor: hov ? `${LIME}70` : 'rgba(255,255,255,0.08)',
        background:  hov ? `${LIME}07` : 'rgba(255,255,255,0.03)',
        transform: 'perspective(800px) rotateY(var(--tx,0deg)) rotateX(var(--ty,0deg))',
        transition: 'transform 0.15s ease-out, border-color 0.3s, background 0.3s, box-shadow 0.3s',
        boxShadow: hov
          ? `0 20px 40px rgba(0,0,0,0.45), 0 0 0 1px ${LIME}28, inset 0 1px 0 rgba(255,255,255,0.07), 0 0 35px ${LIME}0d`
          : '0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-[2px] shrink-0 transition-all duration-500 ease-out"
        style={{ width: hov ? '100%' : '0%', background: `linear-gradient(90deg,${LIME}dd,${LIME}20)` }}
      />

      {/* Gleam sweep — re-fires every hover-enter */}
      <div key={gleam} className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {hov && (
          <div
            className="absolute inset-y-0"
            style={{
              width: '55%', left: '-55%',
              background: `linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.055) 50%,${LIME}09 55%,transparent 70%)`,
              animation: 'pbGleam 0.95s ease-out forwards',
            }}
          />
        )}
      </div>

      {/* Mouse spotlight */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300"
        style={{
          opacity: hov ? 1 : 0,
          background: `radial-gradient(circle at var(--mx,50%) var(--my,50%),${LIME}10 0%,transparent 55%)`,
        }}
      />

      <div className="p-5 flex flex-col flex-1 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[9px] font-black transition-colors duration-200"
            style={{ color: hov ? `${LIME}88` : 'rgba(160,160,160,0.35)' }}
          >{m.n}</span>
          <span
            className="text-xl w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-300"
            style={{
              borderColor: hov ? `${LIME}45` : 'rgba(255,255,255,0.1)',
              background:   hov ? `${LIME}14` : 'rgba(255,255,255,0.04)',
              transform:    hov ? 'scale(1.1)' : 'scale(1)',
            }}
          >{m.icon}</span>
        </div>

        <p
          className="text-sm font-bold leading-snug mb-1 transition-colors duration-200"
          style={{ color: hov ? '#bef264' : '#e2e8f0' }}
        >{m.text}</p>

        <p
          className="text-[11px] leading-relaxed mb-3 transition-colors duration-200"
          style={{ color: hov ? 'rgba(210,210,210,0.85)' : 'rgba(160,160,160,0.65)' }}
        >{m.sub}</p>

        <p
          className="text-[11px] leading-relaxed flex-1 transition-colors duration-300"
          style={{ color: hov ? 'rgba(200,200,200,0.88)' : 'rgba(150,150,150,0.5)' }}
        >{m.desc}</p>

        <div
          className="overflow-hidden transition-all duration-400 ease-in-out"
          style={{ maxHeight: hov ? '160px' : '0px' }}
        >
          <div className="border-t border-border/40 mt-3 pt-3 space-y-1.5">
            {m.tips.map((tip, j) => (
              <div key={j} className="flex items-start gap-1.5">
                <span className="text-[10px] font-bold mt-0.5 shrink-0" style={{ color: LIME }}>✓</span>
                <span className="text-[10px] leading-relaxed" style={{ color: 'rgba(185,185,185,0.82)' }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom ambient glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none transition-opacity duration-500"
        style={{ opacity: hov ? 1 : 0, background: `linear-gradient(to top,${LIME}12,transparent)` }}
      />
    </div>
  );
}

// ─── (Nutrition Roadmap moved to NutritionRoadmapPage.jsx) ──────────────────

const ROADMAP_PHASES = [
  {
    phase: 1, weeks: '1–2', weekCount: 2, label: 'Xây Nền', emoji: '🌱',
    color: '#22c55e', rgb: '34,197,94',
    goal: 'Tạo thói quen ăn uống cơ bản — không cần đếm calo ngay từ đầu',
    actions: [
      'Mỗi bữa có ít nhất 1 nguồn đạm (thịt, cá, trứng, đậu hũ)',
      'Thêm rau/canh vào ít nhất 2/3 bữa chính mỗi ngày',
      'Uống 6–8 ly nước (250ml/ly) mỗi ngày',
      'Giảm nước ngọt, trà sữa — thay bằng trà không đường hoặc nước lọc',
      'Không bỏ bữa rồi ăn bù quá nhiều ở bữa sau',
    ],
    checkpoints: ['Hình thành nhịp ăn 3 bữa ổn định', 'Thấy ít thèm ăn vặt hơn', 'Năng lượng ban ngày cải thiện nhẹ'],
    outcome: 'Thói quen nền được hình thành. Cơ thể bắt đầu quen với nhịp ăn ổn định và ít đường lỏng hơn.',
    kcalMult: 0.95, compliance: 62,
    formula: s => `Protein/bữa ≈ ${s.perMealProteinG}g · Nước ≥ ${Math.round(s.waterMl/250)} ly · ${s.mealsPerDay} bữa/ngày`,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=70&auto=format&fit=crop',
  },
  {
    phase: 2, weeks: '3–4', weekCount: 2, label: 'Chuẩn Hóa', emoji: '📐',
    color: '#06b6d4', rgb: '6,182,212',
    goal: 'Áp dụng đĩa ăn ½–¼–¼ và nhận thức khẩu phần bằng mắt/tay',
    actions: [
      'Áp dụng đĩa ½ rau / ¼ đạm / ¼ tinh bột mỗi bữa chính',
      'Bắt đầu meal prep 1 lần/tuần (đạm + tinh bột sẵn 3 ngày)',
      'Theo dõi protein hàng ngày bằng app hoặc ghi chú đơn giản',
      'Học đọc nhãn dinh dưỡng — tìm mục "Protein" và "Calories"',
      'Ưu tiên thực phẩm chế biến tối thiểu, ít thành phần',
    ],
    checkpoints: ['Cân nặng bắt đầu ổn định', 'Nhận ra khẩu phần đúng bằng mắt', 'Tiêu hóa tốt hơn'],
    outcome: 'Kiểm soát khẩu phần mà không cần cân đo. Bắt đầu thấy thay đổi về năng lượng và cơ thể.',
    kcalMult: 1.0, compliance: 71,
    formula: s => `Mục tiêu: ${s.proteinG}g protein · ${s.targetKcal.toLocaleString()} kcal · Đĩa ½-¼-¼ mỗi bữa`,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=70&auto=format&fit=crop',
  },
  {
    phase: 3, weeks: '5–8', weekCount: 4, label: 'Cá Nhân Hóa', emoji: '🎯',
    color: '#f59e0b', rgb: '245,158,11',
    goal: 'Điều chỉnh macro theo mục tiêu cụ thể và lịch tập',
    actions: [
      'Tính và theo dõi macro (P/C/F) hàng ngày qua app hoặc bảng',
      'Điều chỉnh calo theo ngày tập nặng/nhẹ/nghỉ',
      'Xây bữa pre/post workout phù hợp với lịch tập',
      'Meal prep 2 lần/tuần để tiết kiệm thời gian và đảm bảo đủ macro',
      'Đánh giá lại sau 2 tuần — điều chỉnh ±100–200 kcal nếu cần',
    ],
    checkpoints: ['Cơ thể thay đổi rõ theo mục tiêu', 'Macro được tối ưu từng loại ngày', 'Không còn lo "ăn gì hôm nay"'],
    outcome: 'Đây là giai đoạn chuyển hóa quan trọng nhất. Kết quả rõ rệt về hình thể và hiệu suất tập.',
    kcalMult: 1.0, compliance: 80,
    formula: s => `Ngày tập: ${s.trainingDayKcal.toLocaleString()} kcal · Ngày nghỉ: ${s.restDayKcal.toLocaleString()} kcal · Protein: ${s.proteinG}g cố định`,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=70&auto=format&fit=crop',
  },
  {
    phase: 4, weeks: '9–12', weekCount: 4, label: 'Tối Ưu & Duy Trì', emoji: '🏆',
    color: '#a855f7', rgb: '168,85,247',
    goal: 'Tối ưu hóa chiến lược và xây dựng thói quen bền vững lâu dài',
    actions: [
      'Áp dụng carb cycling: cao ngày tập nặng, thấp ngày nghỉ',
      'Theo dõi body composition (cân Inbody nếu có) mỗi 4 tuần',
      'Điều chỉnh kế hoạch theo kết quả 4–6 tuần qua',
      'Thực hành 80/20 rule: 80% đúng nền, 20% linh hoạt',
      'Chuẩn bị chiến lược cho giai đoạn tiếp theo (tuần 13+)',
    ],
    checkpoints: ['Đạt hoặc gần đạt mục tiêu ban đầu', 'Thói quen được tự động hóa', 'Sẵn sàng cho phase 2'],
    outcome: 'Hoàn thành 12 tuần. Cơ thể và thói quen sẵn sàng cho giai đoạn nâng cao hơn.',
    kcalMult: 1.02, compliance: 86,
    formula: s => `Carb cycling: ${s.heavyDayCarbG}g nặng / ${s.lightDayCarbG}g nghỉ · ${(s.proteinG/s.weight).toFixed(1)}g protein/kg`,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=70&auto=format&fit=crop',
  },
  {
    phase: 5, weeks: '13–18', weekCount: 6, label: 'Nâng Tầm', emoji: '⚡',
    color: '#ec4899', rgb: '236,72,153',
    goal: 'Tối ưu hiệu suất và bắt đầu tư duy dinh dưỡng vận động viên',
    actions: [
      'Cập nhật TDEE sau mỗi 4 tuần (cân nặng thay đổi → TDEE thay đổi)',
      'Áp dụng periodized nutrition theo chu kỳ tập mesocycle 4–6 tuần',
      'Pre/post workout protocol cố định mỗi buổi tập',
      'Xem xét supplement phù hợp (creatine monohydrate, omega-3)',
      'Theo dõi biến thể thể thao: sức mạnh, sức bền, thời gian phục hồi',
    ],
    checkpoints: ['Hiệu suất tập vượt đỉnh cũ', 'Recovery time rút ngắn', 'Cơ thể vận hành ở mức tối ưu'],
    outcome: 'Dinh dưỡng trở thành công cụ hiệu suất. Cơ thể đang ở trạng thái tốt nhất từ trước đến nay.',
    kcalMult: 1.04, compliance: 88,
    formula: s => `TDEE cập nhật định kỳ · Pre: ${s.preWorkoutCarbG}g carb · Post: ${s.postWorkoutProteinG}g P + ${s.postWorkoutCarbG}g C`,
    image: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&q=70&auto=format&fit=crop',
  },
  {
    phase: 6, weeks: '19–24', weekCount: 6, label: 'Bền Vững Trọn Đời', emoji: '🌟',
    color: '#84cc16', rgb: '132,204,22',
    goal: 'Tích hợp dinh dưỡng vào lối sống — không còn cần "cố gắng"',
    actions: [
      'Check-in dinh dưỡng định kỳ mỗi tuần, điều chỉnh khi có thay đổi lớn',
      'Áp dụng intuitive eating có chọn lọc — tin tưởng tín hiệu cơ thể',
      'Huấn luyện 80/20 rule tự động — không cần theo dõi từng bữa',
      'Duy trì tư duy "đều quan trọng hơn hoàn hảo" mọi ngày',
      'Lan tỏa thói quen tốt trong gia đình và cộng đồng',
    ],
    checkpoints: ['Không còn cảm giác "đang kiêng"', 'Dinh dưỡng là bản năng', 'Kết quả duy trì tự nhiên'],
    outcome: 'Dinh dưỡng không còn là gánh nặng — là một phần tự nhiên, bền vững của cuộc sống khỏe.',
    kcalMult: 1.0, compliance: 91,
    formula: s => `80% ăn đúng nền + 20% linh hoạt · Protein tuần: ${s.weeklyProteinG}g · Cân nặng ±1kg ổn định`,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=70&auto=format&fit=crop',
  },
];

function RoadmapComplianceChart({ showAll }) {
  const phases = showAll ? ROADMAP_PHASES : ROADMAP_PHASES.slice(0, 4);
  const totalWeeks = phases.reduce((a, p) => a + p.weekCount, 0);
  const W = 520, H = 130, PL = 30, PR = 12, PT = 14, PB = 32;
  const cW = W - PL - PR, cH = H - PT - PB;

  const points = [];
  let wCursor = 0;
  phases.forEach(ph => {
    const startC = wCursor === 0 ? 52 : points[points.length - 1]?.c ?? 60;
    for (let w = 1; w <= ph.weekCount; w++) {
      wCursor++;
      const t = wCursor / totalWeeks;
      const c = 50 + 42 / (1 + Math.exp(-9 * (t - 0.35)));
      points.push({ w: wCursor, c, color: ph.color });
    }
  });

  const xOf = w => PL + (w / totalWeeks) * cW;
  const yOf = c => PT + cH * (1 - (c - 46) / 52);
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.w)} ${yOf(p.c)}`).join(' ');

  let xScan = 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="rod-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#84cc16" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#84cc16" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {[60, 70, 80, 90].map(c => (
        <g key={c}>
          <line x1={PL} y1={yOf(c)} x2={W - PR} y2={yOf(c)} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <text x={PL - 3} y={yOf(c) + 3} textAnchor="end" fontSize="7" fill="#4b5563">{c}%</text>
        </g>
      ))}
      <path d={`${pathD} L ${xOf(totalWeeks)} ${PT + cH} L ${PL} ${PT + cH} Z`} fill="url(#rod-grad)" />
      <path d={pathD} fill="none" stroke="#84cc16" strokeWidth="2" strokeLinejoin="round" />
      {phases.map(ph => {
        const midW = xScan + ph.weekCount / 2;
        const labelX = xOf(midW);
        const borderX = xOf(xScan);
        xScan += ph.weekCount;
        return (
          <g key={ph.phase}>
            {xScan < totalWeeks && (
              <line x1={xOf(xScan)} y1={PT} x2={xOf(xScan)} y2={PT + cH}
                stroke={ph.color} strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
            )}
            <text x={labelX} y={PT + cH + 20} textAnchor="middle" fontSize="7.5" fill={`${ph.color}99`}>{ph.emoji}</text>
            <text x={labelX} y={PT + cH + 30} textAnchor="middle" fontSize="6.5" fill="#6b7280">T{ph.weeks}</text>
          </g>
        );
      })}
      {points.filter(p => [2, 4, 8, 12, 18, 24].includes(p.w) && p.w <= totalWeeks).map(p => (
        <circle key={p.w} cx={xOf(p.w)} cy={yOf(p.c)} r="3.5" fill={p.color} stroke={`${p.color}40`} strokeWidth="4" />
      ))}
      <text x={W - PR} y={PT - 4} textAnchor="end" fontSize="7" fill="#4b5563">% Tuân thủ kế hoạch</text>
    </svg>
  );
}

function PhaseCalorieBar({ s, showAll }) {
  const phases = showAll ? ROADMAP_PHASES : ROADMAP_PHASES.slice(0, 4);
  const W = 520, H = 90, PL = 36, PR = 12, PT = 10, PB = 26;
  const cW = W - PL - PR, cH = H - PT - PB;
  const totalWeeks = phases.reduce((a, p) => a + p.weekCount, 0);
  const kcals = phases.map(p => Math.round(s.targetKcal * p.kcalMult));
  const maxK = Math.max(...kcals, s.tdee) * 1.06;
  const minK = Math.min(...kcals, s.tdee) * 0.94;
  const yOf = k => PT + cH * (1 - (k - minK) / (maxK - minK));
  const tdeeY = yOf(s.tdee);

  let xScan = PL;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
      <line x1={PL} y1={tdeeY} x2={W - PR} y2={tdeeY}
        stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 3" />
      <text x={W - PR + 3} y={tdeeY + 3} fontSize="7" fill="rgba(255,255,255,0.25)">TDEE {(s.tdee/1000).toFixed(1)}k</text>
      {phases.map((ph, i) => {
        const barW = (ph.weekCount / totalWeeks) * cW - 3;
        const kcal = kcals[i];
        const bY = yOf(kcal);
        const bH = PT + cH - bY;
        const x = xScan;
        xScan += (ph.weekCount / totalWeeks) * cW;
        return (
          <g key={ph.phase}>
            <rect x={x + 1} y={bY} width={barW} height={bH} fill={`${ph.color}18`} rx="3" />
            <rect x={x + 1} y={bY} width={barW} height={4} fill={ph.color} rx="2" opacity="0.75" />
            <text x={x + barW / 2 + 1} y={bY - 5} textAnchor="middle" fontSize="8" fontWeight="700" fill={`${ph.color}cc`}>
              {(kcal / 1000).toFixed(1)}k
            </text>
            <text x={x + barW / 2 + 1} y={PT + cH + 16} textAnchor="middle" fontSize="7.5" fill="#6b7280">
              {ph.label.split(' ')[0]}
            </text>
          </g>
        );
      })}
      <text x={PL - 3} y={PT + cH / 2 + 3} textAnchor="end" fontSize="6.5" fill="#4b5563">kcal</text>
    </svg>
  );
}

function NutritionRoadmap({ s }) {
  const [activePhase, setActivePhase] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const phases = showAll ? ROADMAP_PHASES : ROADMAP_PHASES.slice(0, 4);
  const current = phases[Math.min(activePhase, phases.length - 1)];

  return (
    <RevealBlock className="mb-16">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-lime-500/20 bg-lime-500/5">
          <span className="text-sm">🗺️</span>
          <p className="text-[10px] font-bold text-lime-400 uppercase tracking-[0.2em] whitespace-nowrap">
            Lộ Trình Dinh Dưỡng {showAll ? '24 Tuần' : '12 Tuần'}
          </p>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Context image */}
      <div className="pb-orbit-ring rounded-3xl p-[1.5px] mb-8">
        <div className="relative rounded-3xl overflow-hidden h-44 md:h-56">
          <img
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=75&auto=format&fit=crop"
            alt="Nutrition roadmap healthy lifestyle"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/40 to-transparent" />
          <div className="absolute inset-y-0 left-0 px-8 flex flex-col justify-center max-w-md">
            <p className="text-[9px] font-bold text-lime-400 uppercase tracking-[0.25em] mb-1.5">Cá Nhân Hóa Theo B0</p>
            <h3 className="text-xl font-black text-text leading-tight mb-2">
              Lộ trình {showAll ? '24' : '12'} tuần của bạn
            </h3>
            <p className="text-[11px] text-muted leading-relaxed">
              TDEE <span className="text-lime-400 font-bold">{s.tdee.toLocaleString()} kcal</span>
              {' · '}Mục tiêu <span className="text-lime-400 font-bold">{s.targetKcal.toLocaleString()} kcal</span>
              {' · '}Protein <span className="text-lime-400 font-bold">{s.proteinG}g</span>/ngày
            </p>
          </div>
          <div className="absolute bottom-4 right-6 flex gap-2">
            {ROADMAP_PHASES.slice(0, 4).map(ph => (
              <div key={ph.phase} className="w-2 h-2 rounded-full" style={{ background: ph.color, opacity: 0.8 }} />
            ))}
            {showAll && ROADMAP_PHASES.slice(4).map(ph => (
              <div key={ph.phase} className="w-2 h-2 rounded-full" style={{ background: ph.color, opacity: 0.8 }} />
            ))}
          </div>
        </div>
      </div>

      {/* Toggle 12/24 weeks */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-xl border border-border/30 bg-surface/20 p-1 gap-1">
          {[false, true].map(all => (
            <button key={`${all}`} type="button"
              onClick={() => { setShowAll(all); setActivePhase(0); }}
              className="px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200"
              style={showAll === all ? { background: '#84cc16', color: '#0a0a0a' } : { color: '#9ca3af' }}>
              {all ? '24 Tuần (Toàn Bộ)' : '12 Tuần (Cơ Bản)'}
            </button>
          ))}
        </div>
      </div>

      {/* Compliance S-curve chart */}
      <div className="rounded-2xl border border-border/25 bg-surface/5 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-bold text-text">Biểu Đồ Tuân Thủ Kế Hoạch Theo Tuần</p>
            <p className="text-[9px] text-muted mt-0.5">Đường S-curve — tiến bộ tăng dần khi thói quen được hình thành</p>
          </div>
          <span className="text-[9px] text-muted/50 bg-surface/40 px-2 py-1 rounded-full border border-border/20">
            Dự kiến, không phải cam kết
          </span>
        </div>
        <RoadmapComplianceChart showAll={showAll} />
      </div>

      {/* Calorie bar chart */}
      <div className="rounded-2xl border border-border/25 bg-surface/5 p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-bold text-text">Calo Mục Tiêu Theo Từng Giai Đoạn</p>
            <p className="text-[9px] text-muted mt-0.5">Dựa trên TDEE {s.tdee.toLocaleString()} kcal của bạn — điều chỉnh theo mục tiêu từng phase</p>
          </div>
        </div>
        <PhaseCalorieBar s={s} showAll={showAll} />
      </div>

      {/* Phase selector */}
      <div className="flex gap-2 flex-wrap mb-6">
        {phases.map((ph, i) => (
          <button key={ph.phase} type="button"
            onClick={() => setActivePhase(i)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all duration-200"
            style={activePhase === i
              ? { borderColor: ph.color, background: `${ph.color}18`, color: ph.color }
              : { borderColor: 'rgba(255,255,255,0.08)', background: 'transparent', color: '#6b7280' }}>
            <span>{ph.emoji}</span>
            <span>P{ph.phase}: Tuần {ph.weeks}</span>
          </button>
        ))}
      </div>

      {/* Active phase detail */}
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        {/* Left: actions + formula */}
        <div className="rounded-2xl border p-5 space-y-4" style={{ borderColor: `${current.color}25`, background: `${current.color}06` }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{current.emoji}</span>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: current.color }}>
                Giai Đoạn {current.phase} · Tuần {current.weeks}
              </p>
              <p className="text-sm font-bold text-text mt-0.5">{current.label}</p>
            </div>
          </div>
          <p className="text-[11px] text-muted leading-relaxed border-l-2 pl-3" style={{ borderColor: `${current.color}40` }}>
            {current.goal}
          </p>
          <div>
            <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-2">5 Hành Động Chính</p>
            <ul className="space-y-2">
              {current.actions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-[10px] text-muted">
                  <span className="font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${current.color}20`, color: current.color }}>{i + 1}</span>
                  <span className="leading-relaxed">{a}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl px-3 py-2.5 border" style={{ borderColor: `${current.color}20`, background: `${current.color}08` }}>
            <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: current.color }}>Công Thức Cá Nhân Hóa</p>
            <p className="text-[10px] text-text font-mono leading-relaxed">{current.formula(s)}</p>
          </div>
        </div>

        {/* Right: image + checkpoints + outcome */}
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden h-36 md:h-40 relative">
            <img src={current.image} alt={current.label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/85 via-bg/20 to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border"
                style={{ color: current.color, borderColor: `${current.color}30`, background: 'rgba(10,10,10,0.7)' }}>
                Giai đoạn {current.phase} / {showAll ? 6 : 4}
              </span>
              <span className="text-[9px] text-muted/70 bg-bg/60 px-2 py-1 rounded-full border border-border/20">
                {current.weekCount} tuần · ~{Math.round(current.compliance)}% tuân thủ
              </span>
            </div>
          </div>
          <div className="rounded-2xl border p-4 space-y-3" style={{ borderColor: `${current.color}18`, background: `${current.color}04` }}>
            <p className="text-[9px] font-bold text-muted uppercase tracking-wider">Mốc Kiểm Tra</p>
            {current.checkpoints.map((cp, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0" style={{ borderColor: `${current.color}40`, background: `${current.color}10` }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: current.color }} />
                </div>
                <p className="text-[10px] text-muted leading-relaxed">{cp}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl px-4 py-3 border border-lime-500/15 bg-lime-500/5">
            <p className="text-[9px] font-bold text-lime-400 uppercase tracking-wider mb-1">Kết Quả Kỳ Vọng</p>
            <p className="text-[10px] text-muted leading-relaxed">{current.outcome}</p>
          </div>
        </div>
      </div>

      {/* Milestone timeline */}
      <div className="rounded-2xl border border-border/20 bg-surface/5 p-5">
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-5">
          Mốc Quan Trọng — {showAll ? '24' : '12'} Tuần
        </p>
        <div className="relative">
          <div className="absolute top-3 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2 relative z-10">
            {(showAll ? [
              { w: 2, label: 'Kiểm tra đầu tiên', icon: '📋', color: '#22c55e' },
              { w: 4, label: 'Đánh giá meal plan', icon: '🍽️', color: '#06b6d4' },
              { w: 8, label: 'Đánh giá hình thể', icon: '📏', color: '#f59e0b' },
              { w: 12, label: 'Hoàn thành 12T', icon: '🏆', color: '#a855f7' },
              { w: 18, label: 'Advanced check', icon: '⚡', color: '#ec4899' },
              { w: 24, label: 'Lifestyle locked', icon: '🌟', color: '#84cc16' },
            ] : [
              { w: 2, label: 'Kiểm tra đầu tiên', icon: '📋', color: '#22c55e' },
              { w: 4, label: 'Chuẩn hóa meal', icon: '🍽️', color: '#06b6d4' },
              { w: 8, label: 'Đánh giá hình thể', icon: '📏', color: '#f59e0b' },
              { w: 12, label: 'Hoàn thành!', icon: '🏆', color: '#a855f7' },
            ]).map(m => (
              <RevealBlock key={m.w}>
                <div className="text-center">
                  <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm mx-auto mb-2"
                    style={{ borderColor: m.color, background: `${m.color}15` }}>
                    {m.icon}
                  </div>
                  <p className="text-[9px] font-bold" style={{ color: m.color }}>Tuần {m.w}</p>
                  <p className="text-[9px] text-muted leading-tight mt-0.5">{m.label}</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </div>
    </RevealBlock>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PillarB() {
  const { t: tCommon }  = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');

  const [activeTab, setActiveTab] = useState(0);
  const [tabKey, setTabKey]       = useState(0);
  const [scrolled, setScrolled]   = useState(false);
  const tabBarRef = useRef(null);

  // ── Calculator state (shared with all panels)
  const [weight, setWeight]           = useState(70);
  const [height, setHeight]           = useState(170);
  const [age, setAge]                 = useState(30);
  const [sex, setSex]                 = useState('male');
  const [activityKey, setActivityKey] = useState('moderate');
  const [goalKey, setGoalKey]         = useState('recomp');
  const [activeGoal, setActiveGoal]   = useState('maintenance');

  // Keep goalKey and activeGoal in sync
  const handleGoalKeyChange = (key) => {
    setGoalKey(key);
    setActiveGoal(GOAL_KEY_TO_ID[key] || 'maintenance');
  };
  const handleActiveGoalChange = (id) => {
    setActiveGoal(id);
    setGoalKey(GOAL_ID_TO_KEY[id] || 'recomp');
  };

  const userStats = useMemo(() => {
    // ── B0: Raw inputs
    const activity = ACTIVITY_LEVELS.find(a => a.key === activityKey) || ACTIVITY_LEVELS[2];

    // ── B1: Foundation (from B0)
    const bmr = Math.round(sex === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161);
    const tdee = Math.round(bmr * activity.mult);
    const goal = GOAL_MODIFIERS.find(g => g.key === goalKey) || GOAL_MODIFIERS[1];
    const targetKcal = tdee + goal.delta;
    const proteinG = Math.round(weight * (goalKey === 'loss' ? 2.0 : 1.8));
    const fatG = Math.round(targetKcal * 0.25 / 9);
    const carbG = Math.round((targetKcal - proteinG * 4 - fatG * 9) / 4);
    const waterMl = Math.round(weight * 35);
    const fiberG = sex === 'male' ? 38 : 25;
    const proteinPct = Math.round(proteinG * 4 / targetKcal * 100);
    const fatPct = Math.round(fatG * 9 / targetKcal * 100);
    const carbPct = 100 - proteinPct - fatPct;

    // ── B2: Plate (from B1 macros)
    const mealsPerDay = 3;
    const perMealProteinG = Math.round(proteinG / mealsPerDay);
    const perMealCarbG = Math.round(carbG / mealsPerDay);
    const perMealFatG = Math.round(fatG / mealsPerDay);
    const perMealKcal = Math.round(targetKcal / mealsPerDay);
    const chickenG = Math.round(perMealProteinG / 0.31);
    const riceG = Math.round(perMealCarbG / 0.28);
    const oliveOilMl = Math.round(perMealFatG / 0.9);

    // ── B3: Goals (from B2 plate sizes)
    const weeklyKcalDelta = goal.delta * 7;
    const kgPerWeek = parseFloat((Math.abs(weeklyKcalDelta) / 7700).toFixed(2));
    const weeksTo5kg = kgPerWeek > 0 ? Math.round(5 / kgPerWeek) : null;
    const weeksTo10kg = kgPerWeek > 0 ? Math.round(10 / kgPerWeek) : null;
    const weeklyProteinG = proteinG * 7;
    const weeklyKcalBudget = targetKcal * 7;

    // ── B4: Meals (from B3 targets)
    const breakfastKcal = Math.round(targetKcal * 0.25);
    const lunchKcal = Math.round(targetKcal * 0.35);
    const dinnerKcal = Math.round(targetKcal * 0.30);
    const snackKcal = targetKcal - breakfastKcal - lunchKcal - dinnerKcal;
    const breakfastProteinG = Math.round(proteinG * 0.25);
    const lunchProteinG = Math.round(proteinG * 0.35);
    const dinnerProteinG = Math.round(proteinG * 0.30);
    const snackProteinG = proteinG - breakfastProteinG - lunchProteinG - dinnerProteinG;
    const breakfastCarbG = Math.round(carbG * 0.25);
    const lunchCarbG = Math.round(carbG * 0.40);
    const dinnerCarbG = Math.round(carbG * 0.25);
    const snackCarbG = carbG - breakfastCarbG - lunchCarbG - dinnerCarbG;

    // ── B5: Tracking (from B4 meal plan)
    const dailySteps = activityKey === 'sedentary' ? 6000 : activityKey === 'light' ? 8000 : activityKey === 'moderate' ? 10000 : activityKey === 'active' ? 12000 : 15000;
    const weeklyWorkoutMins = activityKey === 'sedentary' ? 0 : activityKey === 'light' ? 90 : activityKey === 'moderate' ? 150 : activityKey === 'active' ? 300 : 450;

    // ── B6: 7-Day (from B5 activity)
    const trainingDays = activityKey === 'sedentary' ? 0 : activityKey === 'light' ? 2 : activityKey === 'moderate' ? 3 : activityKey === 'active' ? 5 : 6;
    const restDays = 7 - trainingDays;
    const trainingDayKcal = Math.round(targetKcal + (trainingDays > 0 ? 100 : 0));
    const restDayKcal = Math.round(targetKcal - (trainingDays > 0 ? 100 : 0));
    const weeklyKcalTotal = trainingDayKcal * trainingDays + restDayKcal * restDays;
    const trainingDayCarb = Math.round(carbG * 1.2);
    const restDayCarb = Math.round(carbG * 0.8);

    // ── B7: Advanced (from B6 training plan)
    const heavyDayProteinG = Math.round(weight * (goalKey === 'loss' ? 2.2 : 2.0));
    const lightDayProteinG = Math.round(weight * (goalKey === 'loss' ? 1.8 : 1.6));
    const heavyDayCarbG = Math.round(carbG * 1.4);
    const lightDayCarbG = Math.round(carbG * 0.6);
    const preWorkoutCarbG = Math.round(carbG * 0.15);
    const postWorkoutProteinG = Math.round(weight * 0.3);
    const postWorkoutCarbG = Math.round(weight * 0.5);

    return {
      weight, height, age, sex, activity, activityKey, goalKey,
      bmr, tdee, goal, targetKcal,
      proteinG, fatG, carbG, waterMl, fiberG, proteinPct, fatPct, carbPct,
      mealsPerDay, perMealProteinG, perMealCarbG, perMealFatG, perMealKcal, chickenG, riceG, oliveOilMl,
      weeklyKcalDelta, kgPerWeek, weeksTo5kg, weeksTo10kg, weeklyProteinG, weeklyKcalBudget,
      breakfastKcal, lunchKcal, dinnerKcal, snackKcal,
      breakfastProteinG, lunchProteinG, dinnerProteinG, snackProteinG,
      breakfastCarbG, lunchCarbG, dinnerCarbG, snackCarbG,
      dailySteps, weeklyWorkoutMins,
      trainingDays, restDays, trainingDayKcal, restDayKcal, weeklyKcalTotal, trainingDayCarb, restDayCarb,
      heavyDayProteinG, lightDayProteinG, heavyDayCarbG, lightDayCarbG,
      preWorkoutCarbG, postWorkoutProteinG, postWorkoutCarbG,
    };
  }, [weight, height, age, sex, activityKey, goalKey]);

  const pillar = tPillars('pillarB', { returnObjects: true });
  const translatedMantras = MANTRAS.map((m, i) => ({
    ...m,
    text: tPillars(`pillarB.mantras.${i}.text`, { defaultValue: m.text }),
    sub:  tPillars(`pillarB.mantras.${i}.sub`,  { defaultValue: m.sub }),
    desc: tPillars(`pillarB.mantras.${i}.desc`, { defaultValue: m.desc }),
  }));
  const spiritTr = pillar?.spirit_card || {};

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Persist B0 inputs for the roadmap sub-page
  useEffect(() => {
    try {
      localStorage.setItem('healthapp_b0_inputs', JSON.stringify({ weight, height, age, sex, activityKey, goalKey }));
    } catch {}
  }, [weight, height, age, sex, activityKey, goalKey]);

  // Inject orbit-border CSS keyframes once
  useEffect(() => {
    const id = 'pb-orbit-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes pbGleam {
        0%   { transform: translateX(-60%) skewX(-12deg); opacity: 0; }
        18%  { opacity: 1; }
        80%  { opacity: 0.7; }
        100% { transform: translateX(320%) skewX(-12deg); opacity: 0; }
      }
      @keyframes ci-streak {
        0%   { left: -2rem; opacity: 0; }
        15%  { opacity: 1; }
        85%  { opacity: 0.6; }
        100% { left: calc(100% + 2rem); opacity: 0; }
      }
      @property --orbit-angle {
        syntax: '<angle>';
        initial-value: 0deg;
        inherits: false;
      }
      @keyframes orbitSpin {
        to { --orbit-angle: 360deg; }
      }
      .pb-orbit-ring {
        background: conic-gradient(
          from var(--orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(132,204,22,0.0) 65deg, rgba(132,204,22,0.7) 85deg,
          rgba(255,255,255,0.95) 92deg, rgba(132,204,22,0.7) 99deg,
          rgba(34,197,94,0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: orbitSpin 3.5s linear infinite;
      }
      @property --bt-lime-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @property --bt-cyan-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @property --bt-orange-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes btLimeSpin   { to { --bt-lime-angle:   360deg; } }
      @keyframes btCyanSpin   { to { --bt-cyan-angle:   360deg; } }
      @keyframes btOrangeSpin { to { --bt-orange-angle: 360deg; } }
      .bt-orbit-lime {
        background: conic-gradient(from var(--bt-lime-angle),
          transparent 0deg, transparent 55deg,
          rgba(132,204,22,0.0) 65deg, rgba(132,204,22,0.85) 85deg,
          rgba(255,255,255,0.95) 92deg, rgba(132,204,22,0.85) 99deg,
          rgba(132,204,22,0.0) 115deg, transparent 125deg, transparent 360deg);
        animation: btLimeSpin 2.8s linear infinite;
      }
      .bt-orbit-cyan {
        background: conic-gradient(from var(--bt-cyan-angle),
          transparent 0deg, transparent 55deg,
          rgba(6,182,212,0.0) 65deg, rgba(6,182,212,0.85) 85deg,
          rgba(255,255,255,0.95) 92deg, rgba(6,182,212,0.85) 99deg,
          rgba(6,182,212,0.0) 115deg, transparent 125deg, transparent 360deg);
        animation: btCyanSpin 3.2s linear infinite;
      }
      .bt-orbit-orange {
        background: conic-gradient(from var(--bt-orange-angle),
          transparent 0deg, transparent 55deg,
          rgba(249,115,22,0.0) 65deg, rgba(249,115,22,0.85) 85deg,
          rgba(255,255,255,0.95) 92deg, rgba(249,115,22,0.85) 99deg,
          rgba(249,115,22,0.0) 115deg, transparent 125deg, transparent 360deg);
        animation: btOrangeSpin 3.6s linear infinite;
      }
      /* ── Per-tab unified frame — solid border + narrow running spark ── */
      @property --pbt0 { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @property --pbt1 { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @property --pbt2 { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @property --pbt3 { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @property --pbt4 { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes pbt0Spin { to { --pbt0: 360deg; } }
      @keyframes pbt1Spin { to { --pbt1: 360deg; } }
      @keyframes pbt2Spin { to { --pbt2: 360deg; } }
      @keyframes pbt3Spin { to { --pbt3: 360deg; } }
      @keyframes pbt4Spin { to { --pbt4: 360deg; } }
      /* base = dim solid color all the way round; spark = 8-deg white peak sweeps on top */
      .pb-frame-0 { background: conic-gradient(from var(--pbt0), rgba(132,204,22,0.28) 0deg, rgba(132,204,22,0.28) 353deg, rgba(132,204,22,0.55) 355deg, rgba(255,255,255,0.92) 358deg, rgba(132,204,22,0.55) 361deg, rgba(132,204,22,0.28) 363deg, rgba(132,204,22,0.28) 360deg); animation: pbt0Spin 4s linear infinite; }
      .pb-frame-1 { background: conic-gradient(from var(--pbt1), rgba(34,197,94,0.28)   0deg, rgba(34,197,94,0.28)   353deg, rgba(34,197,94,0.55)   355deg, rgba(255,255,255,0.92) 358deg, rgba(34,197,94,0.55)   361deg, rgba(34,197,94,0.28)   363deg, rgba(34,197,94,0.28)   360deg); animation: pbt1Spin 4.4s linear infinite; }
      .pb-frame-2 { background: conic-gradient(from var(--pbt2), rgba(249,115,22,0.28)  0deg, rgba(249,115,22,0.28)  353deg, rgba(249,115,22,0.55)  355deg, rgba(255,255,255,0.92) 358deg, rgba(249,115,22,0.55)  361deg, rgba(249,115,22,0.28)  363deg, rgba(249,115,22,0.28)  360deg); animation: pbt2Spin 3.8s linear infinite; }
      .pb-frame-3 { background: conic-gradient(from var(--pbt3), rgba(6,182,212,0.28)   0deg, rgba(6,182,212,0.28)   353deg, rgba(6,182,212,0.55)   355deg, rgba(255,255,255,0.92) 358deg, rgba(6,182,212,0.55)   361deg, rgba(6,182,212,0.28)   363deg, rgba(6,182,212,0.28)   360deg); animation: pbt3Spin 3.5s linear infinite; }
      .pb-frame-4 { background: conic-gradient(from var(--pbt4), rgba(168,85,247,0.28)  0deg, rgba(168,85,247,0.28)  353deg, rgba(168,85,247,0.55)  355deg, rgba(255,255,255,0.92) 358deg, rgba(168,85,247,0.55)  361deg, rgba(168,85,247,0.28)  363deg, rgba(168,85,247,0.28)  360deg); animation: pbt4Spin 4.2s linear infinite; }
      .pb-frame-5 { background: conic-gradient(from var(--pbt0), rgba(139,92,246,0.28) 0deg, rgba(139,92,246,0.28) 353deg, rgba(139,92,246,0.55) 355deg, rgba(255,255,255,0.92) 358deg, rgba(139,92,246,0.55) 361deg, rgba(139,92,246,0.28) 363deg, rgba(139,92,246,0.28) 360deg); animation: pbt0Spin 3.7s linear infinite; }
      .pb-frame-6 { background: conic-gradient(from var(--pbt1), rgba(236,72,153,0.28) 0deg, rgba(236,72,153,0.28) 353deg, rgba(236,72,153,0.55) 355deg, rgba(255,255,255,0.92) 358deg, rgba(236,72,153,0.55) 361deg, rgba(236,72,153,0.28) 363deg, rgba(236,72,153,0.28) 360deg); animation: pbt1Spin 4.6s linear infinite; }
      .pb-frame-7 { background: conic-gradient(from var(--pbt2), rgba(245,158,11,0.28) 0deg, rgba(245,158,11,0.28) 353deg, rgba(245,158,11,0.55) 355deg, rgba(255,255,255,0.92) 358deg, rgba(245,158,11,0.55) 361deg, rgba(245,158,11,0.28) 363deg, rgba(245,158,11,0.28) 360deg); animation: pbt2Spin 3.9s linear infinite; }
      @keyframes pbTitleShimmer {
        0%   { background-position: -280% center; }
        100% { background-position: 280% center; }
      }
      @keyframes pbAmpBounce {
        0%, 100% { filter: drop-shadow(0 0 6px rgba(132,204,22,0.4)) drop-shadow(0 0 14px rgba(200,230,60,0.3)); transform: scaleY(1); }
        50%       { filter: drop-shadow(0 0 18px rgba(132,204,22,1)) drop-shadow(0 0 32px rgba(200,230,60,0.6)); transform: scaleY(1.08); }
      }
      .pb-title-word {
        background: linear-gradient(90deg,
          #ffffff 0%, #ffffff 25%,
          #bef264 40%, #84cc16 50%, #a3e635 58%,
          #ffffff 73%, #ffffff 100%
        );
        background-size: 320% auto;
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent; color: transparent;
        animation: pbTitleShimmer 6s linear infinite;
      }
      .pb-title-amp {
        -webkit-text-fill-color: #a3e635; color: #a3e635;
        display: inline-block;
        animation: pbAmpBounce 2.8s ease-in-out infinite;
      }
    `;
    document.head.appendChild(s);
  }, []);

  const switchTab = useCallback((i) => {
    if (i === activeTab) return;
    setActiveTab(i);
    setTabKey(k => k + 1);
    // Scroll active tab into view on mobile
    const bar = tabBarRef.current;
    if (!bar) return;
    const btn = bar.children[i];
    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeTab]);

  if (!pillar || typeof pillar !== 'object') {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-muted text-sm">{tCommon('loading')}</span>
      </div>
    );
  }

  const calcProps = { weight, setWeight, height, setHeight, age, setAge, sex, setSex, activityKey, setActivityKey, goalKey, setGoalKey: handleGoalKeyChange, userStats };
  const PANELS = [
    <CalcPanel key="calc" {...calcProps} />,
    <FoundationPanel key="foundation" s={userStats} onGoalKeyChange={handleGoalKeyChange} />,
    <PlatePanel key="plate" s={userStats} />,
    <GoalsPanel key="goals" s={userStats} activeGoal={activeGoal} onActiveGoalChange={handleActiveGoalChange} />,
    <MealsPanel key="meals" s={userStats} activeGoal={activeGoal} />,
    <TrackingPanel key="tracking" s={userStats} activeGoal={activeGoal} />,
    <SevenDayPanel key="sevenday" s={userStats} />,
    <AdvancedPanel key="advanced" s={userStats} />,
  ];

  return (
    <div className="max-w-5xl mx-auto -mt-4">

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}

      {/* Breadcrumb */}
      <div className="mb-10">
        <Link
          to="/pillars"
          className="inline-flex items-center gap-2 text-muted hover:text-lime-400 text-sm transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          {tCommon('nav.pillars')}
        </Link>
      </div>

      {/* Icon + Title */}
      <div className="mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 bg-lime-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-start gap-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-5xl bg-surface border border-lime-500/20 shrink-0 animate-float">
            🥗
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in-up">
              {(() => {
                const s = tPillars('pillarB.title');
                const i = s.indexOf('&');
                if (i === -1) return <span className="pb-title-word">{s}</span>;
                return (<><span className="pb-title-word">{s.slice(0, i)}</span><span className="pb-title-amp">&</span><span className="pb-title-word">{s.slice(i + 1)}</span></>);
              })()}
            </h1>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-lime-400 mt-3 mb-4 px-3 py-1 bg-lime-500/10 border border-lime-500/20 rounded-full">
              {tPillars('pillarB.subtitle')}
            </span>
            <p className="text-muted text-base leading-relaxed max-w-2xl">
              {tPillars('pillarB.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Contextual image with orbit glow border */}
      <div className="pb-orbit-ring rounded-3xl p-[1.5px] mb-12">
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=70"
            alt="nutrition"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-lime-400 text-xs font-bold uppercase tracking-widest bg-bg/60 px-3 py-1 rounded-full border border-lime-500/20">
              {tPillars('pillarB.image_caption')}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* ══════════════════════════════════════════════════════════════════════
          PHILOSOPHY
      ══════════════════════════════════════════════════════════════════════ */}
      <RevealBlock className="mb-16">

        {/* ── Quote block ── */}
        <div className="relative rounded-3xl border border-lime-500/15 bg-lime-500/4 p-7 md:p-10 mb-10 group hover:border-lime-500/30 transition-all duration-500">
          {/* Decorative layer — clipped independently so tooltips can overflow */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[140px] opacity-60 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `${LIME}08` }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `${LIME}05` }} />
            <div className="absolute -top-4 left-6 font-black text-[130px] leading-none select-none" style={{ color: `${LIME}07` }}>"</div>
          </div>

          {/* Quote text */}
          <div className="relative z-10 max-w-2xl mx-auto mb-7 text-center">
            <p className="text-xl md:text-2xl font-bold text-text/90 leading-relaxed italic mb-4">
              {pillar?.hero_quote || 'Ăn đủ — ăn đều — ăn thật — ăn theo mục tiêu — sống được lâu dài'}
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-lime-500/50 to-transparent mb-4" />
            <p className="text-sm text-lime-400/80 font-medium">
              {pillar?.hero_sub || 'Ăn tốt hơn hôm qua một chút, và đủ dễ để ngày mai còn làm tiếp.'}
            </p>
          </div>

          {/* Key stats row */}
          {(() => {
            const HERO_STATS_DEFAULT = [
              { n: '3', unit: 'bữa/ngày', label: 'Nhịp ăn tối ưu' },
              { n: '80/20', unit: '', label: 'Quy tắc bền vững' },
              { n: '21+', unit: 'ngày', label: 'Hình thành thói quen' },
              { n: '1.6g', unit: '/kg', label: 'Protein tối thiểu' },
            ];
            const HERO_STAT_TOOLTIPS = [
              '3 bữa chính/ngày giúp ổn định đường huyết và giảm thèm ăn vặt hiệu quả hơn so với nhịn hoặc ăn nhiều bữa không kiểm soát.',
              '80% ăn lành mạnh + 20% linh hoạt — tỷ lệ thực tế nhất để duy trì lâu dài mà không cảm thấy bị tước đoạt.',
              'Não bộ cần 21–66 ngày lặp lại để hình thành thói quen tự động. Kiên trì qua tuần 2–3 là giai đoạn khó và quyết định nhất.',
              '1.6g protein/kg thể trọng bảo vệ cơ bắp khi giảm mỡ. Tăng lên 2.2g/kg nếu tập luyện cường độ cao.',
            ];
            return (
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {HERO_STATS_DEFAULT.map((s, i) => (
              <div
                key={i}
                className="group/stat relative bg-bg/50 backdrop-blur-sm rounded-xl p-3.5 border border-lime-500/10 hover:border-lime-500/35 transition-all duration-300 animate-fade-in-up cursor-default"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
              >
                {/* ── Thought-bubble tooltip ── */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none opacity-0 group-hover/stat:opacity-100 scale-90 group-hover/stat:scale-100 -translate-y-1 group-hover/stat:translate-y-0 transition-all duration-200 origin-bottom">
                  <ThoughtBubble text={HERO_STAT_TOOLTIPS[i]} idx={i} />
                </div>

                <div className="font-black text-xl leading-none mb-0.5" style={{ color: LIME }}>
                  {s.n}<span className="text-xs font-bold opacity-60 ml-0.5">{tPillars(`pillarB.hero_stats.${i}.unit`, { defaultValue: s.unit })}</span>
                </div>
                <div className="text-[10px] text-muted">{tPillars(`pillarB.hero_stats.${i}.label`, { defaultValue: s.label })}</div>
              </div>
            ))}
          </div>
            );
          })()}
        </div>

        {/* ── Section header ── */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(132,204,22,0.35))' }} />
            <span className="w-1 h-1 rounded-full bg-lime-500/50" />
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(132,204,22,0.35))' }} />
          </div>
          <div className="flex items-end gap-4 select-none">
            <span className="text-[72px] font-black leading-none"
              style={{
                background: 'linear-gradient(145deg, #84cc16 0%, #22c55e 55%, #84cc16 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 18px rgba(132,204,22,0.45))',
                letterSpacing: '-0.04em',
              }}>7</span>
            <div className="pb-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.35em] leading-none mb-1.5" style={{ color: 'rgba(132,204,22,0.55)' }}>{pillar?.principles_label || 'nguyên tắc'}</p>
              <p className="text-2xl font-black text-text uppercase tracking-[0.1em] leading-none">{pillar?.principles_title || 'Cốt Lõi'}</p>
            </div>
          </div>
          <div className="h-[2px] w-28 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #84cc16, transparent)' }} />
        </div>

        {/* ── Mantra cards (3 col) ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {translatedMantras.map((m, i) => (
            <MantraCard key={m.n} m={m} i={i} />
          ))}

          {/* Spirit card */}
          <div
            className="group relative flex flex-col rounded-2xl border border-lime-500/25 bg-lime-500/5 hover:border-lime-500/45 hover:bg-lime-500/9 transition-all duration-300 animate-fade-in-up overflow-hidden cursor-default"
            style={{ animationDelay: `${7 * 70}ms`, animationFillMode: 'both' }}
          >
            <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${LIME}90, ${LIME}15)` }} />
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-black" style={{ color: `${LIME}70` }}>{spiritTr.label || 'TINH THẦN'}</span>
                <span className="text-xl w-9 h-9 flex items-center justify-center rounded-xl border bg-lime-500/10 border-lime-500/25">✨</span>
              </div>
              <p className="text-xs font-bold text-lime-300 leading-relaxed mb-3">
                {spiritTr.text1 || 'Đều quan trọng hơn hoàn hảo. Kỷ luật là biết quay lại đúng đường sau khi lệch một chút.'}
              </p>
              <p className="text-[11px] leading-relaxed flex-1" style={{ color: `${LIME}70` }}>
                {spiritTr.text2 || 'Bạn không thất bại vì một bữa lệch — bạn thất bại vì bỏ cuộc sau đó. Sự nhất quán mới là siêu năng lực thực sự.'}
              </p>
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB SECTION — unified frame
      ══════════════════════════════════════════════════════════════════════ */}
      <div id="tabs" className="scroll-mt-4 mb-16">
        <RevealBlock>
          {/* Section label */}
          <div className="flex flex-col items-center gap-3 mb-8">
            {/* top rule */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(132,204,22,0.35))' }} />
              <span className="w-1 h-1 rounded-full bg-lime-500/50" />
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(132,204,22,0.35))' }} />
            </div>

            {/* hero number + title */}
            <div className="flex items-end gap-4 select-none">
              <span className="text-[72px] font-black leading-none"
                style={{
                  background: 'linear-gradient(145deg, #84cc16 0%, #22c55e 55%, #84cc16 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 18px rgba(132,204,22,0.45))',
                  letterSpacing: '-0.04em',
                }}>8</span>
              <div className="pb-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.35em] leading-none mb-1.5" style={{ color: 'rgba(132,204,22,0.55)' }}>{pillar?.tabs_section_label || 'chuyên mục'}</p>
                <p className="text-2xl font-black text-text uppercase tracking-[0.1em] leading-none">{pillar?.tabs_section_title || 'Dinh Dưỡng'}</p>
              </div>
            </div>

            {/* glow underline */}
            <div className="h-[2px] w-28 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #84cc16, transparent)' }} />
          </div>

          {/* ── Single orbit-ring frame: tab strip + content as one block ── */}
          <div className={`rounded-2xl p-[1.5px] transition-[background] duration-700 ${TABS[activeTab].frameClass}`}>
            <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0a0a' }}>

              {/* Tab strip — inside the frame */}
              <div className="overflow-x-auto scrollbar-none">
                <div ref={tabBarRef} className="flex items-stretch min-w-max md:min-w-0">
                  {TABS.map((t, i) => {
                    const isActive = activeTab === i;
                    const tc = t.color;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => switchTab(i)}
                        className="group relative flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all duration-250 focus:outline-none cursor-pointer whitespace-nowrap"
                        style={{
                          color: isActive ? tc : 'rgba(100,116,139,0.55)',
                          background: isActive ? `${tc}0c` : 'transparent',
                        }}
                      >
                        <span style={{ color: isActive ? tc : 'rgba(100,116,139,0.4)' }}>{t.icon}</span>
                        <span className="font-black">{t.short}</span>
                        <span className="hidden sm:inline opacity-75">— {tPillars(`pillarB.tabs.${i}.label`, { defaultValue: t.label })}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse ml-0.5" style={{ background: tc }} />
                        )}
                        {/* Active tab: solid bottom indicator */}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-300"
                          style={{
                            background: isActive ? tc : 'transparent',
                            boxShadow: isActive ? `0 0 6px ${tc}` : 'none',
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Thin separator */}
              <div
                className="h-px transition-all duration-700"
                style={{ background: `linear-gradient(90deg, transparent, ${TABS[activeTab].color}30 25%, ${TABS[activeTab].color}30 75%, transparent)` }}
              />

              {/* Content */}
              <div key={tabKey} className="relative overflow-hidden animate-fade-in-up">
                <div
                  className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[120px] pointer-events-none transition-all duration-700"
                  style={{ background: `${TABS[activeTab].color}0e` }}
                />
                <div className="relative z-10 p-6 md:p-8">
                  {PANELS[activeTab]}
                </div>
              </div>

            </div>
          </div>
        </RevealBlock>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3-TIER CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <RevealBlock className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] whitespace-nowrap">{pillar?.start_level_title || 'Bắt đầu từ cấp độ nào?'}</p>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {TIERS.map((tier, i) => (
            <div
              key={tier.level}
              className={`relative rounded-2xl border ${tier.border} ${tier.bg} p-6 transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up overflow-hidden`}
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
            >
              <div className="absolute top-0 left-4 right-4 h-[1.5px] rounded-full" style={{ background: tier.color }} />
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] pointer-events-none" style={{ background: tier.glow }} />

              <div className="relative">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold mb-4 ${tier.badge}`} style={{ color: tier.color }}>
                  <span className="w-1 h-1 rounded-full" style={{ background: tier.color }} />
                  {pillar?.tiers?.[i]?.sub || tier.sub}
                </div>

                <h3 className={`text-base font-black mb-4 ${tier.text}`}>{pillar?.tiers?.[i]?.level || tier.level}</h3>

                <ul className="space-y-2.5">
                  {tier.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-2 text-[11px] text-muted group-hover:text-muted/90 transition-colors">
                      <span className="shrink-0 mt-0.5 font-bold" style={{ color: tier.color }}>✓</span>
                      <span>{pillar?.tiers?.[i]?.steps?.[j] || step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* ══════════════════════════════════════════════════════
          ── TEASER CARDS: all sub-pages ──
      ══════════════════════════════════════════════════════ */}

      {/* ── NỀN TẢNG ── */}
      <TeaserSection label={pillar?.teaser_sections?.[0]?.label || 'Nền Tảng & Cấu Trúc'} count={pillar?.teaser_sections?.[0]?.count || '5 trang'} />

      {(() => { const tc0 = pillar?.teaser_cards?.[0] || {}; return (
      <TeaserCard
        to="/pillar/b/roadmap"
        color="#84cc16" rgb="132,204,22"
        icon="🗺️" category={tc0.category || 'Lộ Trình Có Cấu Trúc'}
        title={tc0.title || 'Lộ Trình Dinh Dưỡng'} accent={tc0.accent || '12 & 24 Tuần'}
        desc={<>{tc0.desc_pre || '6 giai đoạn từ xây nền thói quen đến tối ưu hiệu suất. Mọi con số được tính toán theo thông số cá nhân từ B0 của bạn —'} TDEE <span className="font-bold text-lime-400">{userStats.tdee.toLocaleString()} kcal</span> · Protein <span className="font-bold text-lime-400">{userStats.proteinG}g/ngày</span>.</>}
        features={[
          { icon: '📋', text: tc0.features?.[0] || 'Thực đơn mẫu mỗi giai đoạn' },
          { icon: '📊', text: tc0.features?.[1] || 'Biểu đồ tuân thủ S-curve' },
          { icon: '🔬', text: tc0.features?.[2] || 'Cơ sở khoa học chi tiết' },
          { icon: '✅', text: tc0.features?.[3] || 'Checklist tiến độ cá nhân' },
        ]}
        stats={[
          { value: '6', label: tc0.stat_labels?.[0] || 'Giai đoạn' },
          { value: '24', label: tc0.stat_labels?.[1] || 'Tuần' },
          { value: '✓', label: tc0.stat_labels?.[2] || 'Miễn phí' },
        ]}
        image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80"
        imageAlt="Nutrition roadmap"
        cta={tc0.cta || 'Xem Lộ Trình Chi Tiết'}
      />
      ); })()}

      {(() => { const tc1 = pillar?.teaser_cards?.[1] || {}; return (
      <TeaserCard
        to="/pillar/b/content"
        color="#06b6d4" rgb="6,182,212"
        icon="🏗️" category={tc1.category || 'Cấu Trúc Hệ Thống'}
        title={tc1.title || 'Cấu Trúc Sản Phẩm'} accent={tc1.accent || 'Nội Dung Dinh Dưỡng'}
        desc={<>{tc1.desc_pre || '8 module B0–B7 từ đánh giá ban đầu đến tối ưu hiệu suất. Công thức tính toán đầy đủ, biểu đồ minh họa trực quan, cơ sở dữ liệu thực phẩm — dựa trên BMI'} <span className="font-bold text-cyan-400">{(userStats.weight * 10000 / (userStats.height * userStats.height)).toFixed(1)}</span> · TDEE <span className="font-bold text-cyan-400">{userStats.tdee.toLocaleString()} kcal</span>.</>}
        features={[
          { icon: '📐', text: tc1.features?.[0] || 'Công thức 7 bước chi tiết' },
          { icon: '📊', text: tc1.features?.[1] || 'Biểu đồ macro & BMI' },
          { icon: '🎥', text: tc1.features?.[2] || '12 video hướng dẫn' },
          { icon: '📚', text: tc1.features?.[3] || '8 bài viết khoa học' },
        ]}
        stats={[
          { value: '8', label: tc1.stat_labels?.[0] || 'Module' },
          { value: '12', label: tc1.stat_labels?.[1] || 'Video' },
          { value: '6', label: tc1.stat_labels?.[2] || 'Công cụ' },
        ]}
        image="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80"
        imageAlt="Nutrition content structure"
        cta={tc1.cta || 'Khám Phá Cấu Trúc'}
      />
      ); })()}

      {(() => { const tc2 = pillar?.teaser_cards?.[2] || {}; return (
      <TeaserCard
        to="/pillar/b/data"
        color="#a855f7" rgb="168,85,247"
        icon="🗄️" category={tc2.category || 'Database & Tracking'}
        title={tc2.title || 'Cấu Trúc Dữ Liệu'} accent={tc2.accent || 'App / Notion / Google Sheet'}
        desc={tc2.desc || '4 database hoàn chỉnh: Nutrition Profile, Meal Library, Daily Log, Weekly Review. Công thức Google Sheet sẵn dùng, Notion formula, thư viện 15+ thực phẩm và máy tính điểm tuân thủ 100 điểm.'}
        features={[
          { icon: '🗄️', text: tc2.features?.[0] || '4 databases chi tiết' },
          { icon: '📊', text: tc2.features?.[1] || 'Google Sheet formulas' },
          { icon: '📐', text: tc2.features?.[2] || 'Notion properties' },
          { icon: '🏆', text: tc2.features?.[3] || 'Nutrition Score 100đ' },
        ]}
        stats={[
          { value: '4', label: tc2.stat_labels?.[0] || 'Database' },
          { value: '10', label: tc2.stat_labels?.[1] || 'Formulas' },
          { value: '15+', label: tc2.stat_labels?.[2] || 'Thực phẩm' },
        ]}
        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
        imageAlt="Data structure"
        cta={tc2.cta || 'Xem Cấu Trúc Dữ Liệu'}
      />
      ); })()}

      {(() => { const tc3 = pillar?.teaser_cards?.[3] || {}; return (
      <TeaserCard
        to="/pillar/b/protein"
        color="#22c55e" rgb="34,197,94"
        icon="💪" category={tc3.category || 'Protein — Nền Tảng Dinh Dưỡng'}
        title={tc3.title || 'Công Thức Tính Protein'} accent={tc3.accent || 'Cá Nhân Hoá'}
        desc={tc3.desc || 'Tính lượng protein theo mục tiêu (giảm mỡ/tăng cơ/sức bền), 12+ nguồn thực phẩm Việt Nam, protein timing tối ưu, máy tính theo dõi hằng ngày và 5 sự thật khoa học về đạm.'}
        features={[
          { icon: '📐', text: tc3.features?.[0] || 'Công thức g/kg' },
          { icon: '🍗', text: tc3.features?.[1] || '12+ nguồn đạm VN' },
          { icon: '⏰', text: tc3.features?.[2] || 'Protein timing' },
          { icon: '🎯', text: tc3.features?.[3] || 'Tracker hằng ngày' },
        ]}
        stats={[
          { value: '12+', label: tc3.stat_labels?.[0] || 'Nguồn đạm' },
          { value: '5', label: tc3.stat_labels?.[1] || 'Mục tiêu' },
          { value: '5', label: tc3.stat_labels?.[2] || 'Timing' },
        ]}
        image="https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=1200&q=80"
        imageAlt="Protein foods"
        cta={tc3.cta || 'Xem Công Thức Protein'}
      />
      ); })()}

      {(() => { const tc4 = pillar?.teaser_cards?.[4] || {}; return (
      <TeaserCard
        to="/pillar/b/formula"
        color="#84cc16" rgb="132,204,22"
        icon="📐" category={tc4.category || 'Công Thức & Tính Toán'}
        title={tc4.title || 'Công Thức Tính'} accent={tc4.accent || 'Meal Plan Cá Nhân'}
        desc={tc4.desc || '10 bước tính toán đầy đủ: BMI → BMR → TDEE → Kcal mục tiêu → Protein → Fat → Carb → Chia bữa → Lịch luyện tập. Máy tính tương tác 10 bước, biểu đồ macro, calorie cycling theo ngày tập.'}
        features={[
          { icon: '📐', text: tc4.features?.[0] || '10 bước tính toán' },
          { icon: '📊', text: tc4.features?.[1] || 'MacroDonut biểu đồ' },
          { icon: '🔄', text: tc4.features?.[2] || 'Calorie cycling' },
          { icon: '🍽️', text: tc4.features?.[3] || '3 mô hình bữa ăn' },
        ]}
        stats={[
          { value: '10', label: tc4.stat_labels?.[0] || 'Bước tính' },
          { value: '3', label: tc4.stat_labels?.[1] || 'Mô hình' },
          { value: '12+', label: tc4.stat_labels?.[2] || 'Công thức' },
        ]}
        image="https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=1200&q=80"
        imageAlt="Formula calculation"
        cta={tc4.cta || 'Xem Công Thức Chi Tiết'}
      />
      ); })()}

      {/* ── KẾ HOẠCH THỰC ĐƠN ── */}
      <TeaserSection label={pillar?.teaser_sections?.[1]?.label || 'Kế Hoạch Thực Đơn'} count={pillar?.teaser_sections?.[1]?.count || '4 trang'} />

      {(() => { const tc5 = pillar?.teaser_cards?.[5] || {}; return (
      <TeaserCard
        to="/pillar/b/meals"
        color="#06b6d4" rgb="6,182,212"
        icon="🍱" category={tc5.category || 'Chia Bữa & Đĩa Ăn'}
        title={tc5.title || 'Quy Tắc Chia Bữa'} accent={tc5.accent || '4 mô hình · 10 quy tắc vàng · Carb cycling'}
        desc={tc5.desc || '4 mô hình bữa ăn, 10 quy tắc vàng, biểu đồ đĩa ăn tương tác, lịch carb theo ngày tập, và máy tính bữa ăn cá nhân hóa từ dữ liệu TDEE của bạn.'}
        features={[
          { icon: '🍽️', text: tc5.features?.[0] || '4 mô hình bữa' },
          { icon: '📊', text: tc5.features?.[1] || 'Đĩa ăn SVG tương tác' },
          { icon: '📅', text: tc5.features?.[2] || 'Carb cycling theo ngày' },
          { icon: '🎯', text: tc5.features?.[3] || '3 mục tiêu dinh dưỡng' },
        ]}
        stats={[
          { value: '4', label: tc5.stat_labels?.[0] || 'Mô hình' },
          { value: '10', label: tc5.stat_labels?.[1] || 'Quy tắc' },
          { value: '3', label: tc5.stat_labels?.[2] || 'Mục tiêu' },
        ]}
        image="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"
        imageAlt="Meal rules"
        cta={tc5.cta || 'Xem Quy Tắc Chia Bữa'}
      />
      ); })()}

      {(() => { const tc6 = pillar?.teaser_cards?.[6] || {}; return (
      <TeaserCard
        to="/pillar/b/7day"
        color="#f97316" rgb="249,115,22"
        icon="🗓️" category={tc6.category || 'Thực Đơn Mẫu · 7 Ngày'}
        title={tc6.title || 'Meal Plan 7 Ngày'} accent={tc6.accent || 'Bản Nền Cho Người Mới'}
        desc={tc6.desc || '35 bữa ăn đầy đủ, danh sách mua sắm tương tác, hướng dẫn meal prep 60–90 phút, checklist hàng ngày và xử lý bữa ăn lỡ tay — cá nhân hóa từ TDEE của bạn.'}
        features={[
          { icon: '🗓️', text: tc6.features?.[0] || '7 ngày đủ bữa' },
          { icon: '🛒', text: tc6.features?.[1] || 'Shopping list tương tác' },
          { icon: '📦', text: tc6.features?.[2] || 'Meal prep hướng dẫn' },
          { icon: '✅', text: tc6.features?.[3] || 'Checklist hàng ngày' },
        ]}
        stats={[
          { value: '7', label: tc6.stat_labels?.[0] || 'Ngày' },
          { value: '35', label: tc6.stat_labels?.[1] || 'Bữa' },
          { value: '5', label: tc6.stat_labels?.[2] || 'Nhóm TP' },
        ]}
        image="https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80"
        imageAlt="7-day meal plan"
        cta={tc6.cta || 'Xem Meal Plan 7 Ngày'}
      />
      ); })()}

      {(() => { const tc7 = pillar?.teaser_cards?.[7] || {}; return (
      <TeaserCard
        to="/pillar/b/goal-plan"
        color="#a855f7" rgb="168,85,247"
        icon="🎯" category={tc7.category || 'Cá Nhân Hóa Theo Mục Tiêu'}
        title={tc7.title || 'Meal Plan Theo'} accent={tc7.accent || 'Mục Tiêu Của Bạn'}
        desc={tc7.desc || '7 hướng dinh dưỡng cho 7 mục tiêu khác nhau: sống khỏe nền, giảm mỡ, tăng cơ, recomp, sức bền, phục hồi, người bận. Máy tính macro cá nhân hóa và khung tuần cụ thể.'}
        features={[
          { icon: '🎯', text: tc7.features?.[0] || '7 mục tiêu' },
          { icon: '📐', text: tc7.features?.[1] || 'Macro calculator' },
          { icon: '📅', text: tc7.features?.[2] || 'Khung tuần per goal' },
          { icon: '⚙️', text: tc7.features?.[3] || '12 quy tắc điều chỉnh' },
        ]}
        stats={[
          { value: '7', label: tc7.stat_labels?.[0] || 'Mục tiêu' },
          { value: '12', label: tc7.stat_labels?.[1] || 'Quy tắc' },
          { value: '5', label: tc7.stat_labels?.[2] || 'Câu hỏi nền' },
        ]}
        image="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80"
        imageAlt="Goal-based meal plan"
        cta={tc7.cta || 'Xem Meal Plan Theo Mục Tiêu'}
      />
      ); })()}

      {(() => { const tc8 = pillar?.teaser_cards?.[8] || {}; return (
      <TeaserCard
        to="/pillar/b/advanced-plan"
        color="#ef4444" rgb="239,68,68"
        icon="⚡" category={tc8.category || 'Đạp Xe · Gym · Bơi · Chạy Bộ'}
        title={tc8.title || 'Plan Nâng Cao'} accent={tc8.accent || 'Cho Người Tập Nhiều'}
        desc={tc8.desc || 'Periodized nutrition cho 4 loại ngày tập, fueling chi tiết từng môn, 7 ngày mẫu, carb cycling chart và macro calculator cá nhân hóa theo cân nặng.'}
        features={[
          { icon: '⚡', text: tc8.features?.[0] || '4 loại ngày tập' },
          { icon: '🚴', text: tc8.features?.[1] || '4 môn thể thao' },
          { icon: '📊', text: tc8.features?.[2] || 'Carb cycling chart' },
          { icon: '💧', text: tc8.features?.[3] || 'Nước & điện giải' },
        ]}
        stats={[
          { value: '4', label: tc8.stat_labels?.[0] || 'Loại ngày' },
          { value: '4', label: tc8.stat_labels?.[1] || 'Môn thể thao' },
          { value: '7', label: tc8.stat_labels?.[2] || 'Ngày mẫu' },
        ]}
        image="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80"
        imageAlt="Advanced training nutrition"
        cta={tc8.cta || 'Xem Plan Nâng Cao'}
      />
      ); })()}

      {/* ── CÔNG CỤ HẰNG NGÀY ── */}
      <TeaserSection label={pillar?.teaser_sections?.[2]?.label || 'Công Cụ Hằng Ngày'} count={pillar?.teaser_sections?.[2]?.count || '4 trang'} />

      {(() => { const tc9 = pillar?.teaser_cards?.[9] || {}; return (
      <TeaserCard
        to="/pillar/b/safety"
        color="#0ea5e9" rgb="14,165,233"
        icon="🛡️" category={tc9.category || 'An Toàn · Bảo Vệ · Đúng Cách'}
        title={tc9.title || 'Quy Tắc An Toàn'}
        desc={tc9.desc || 'Bộ quy tắc an toàn toàn diện cho dự án Nutrition — phân tầng người dùng xanh/vàng/đỏ, quy tắc năng lượng, macro, bảo quản thực phẩm và checklist tự kiểm tra hằng ngày.'}
        features={[
          { icon: '🚦', text: tc9.features?.[0] || '3 nhóm người dùng' },
          { icon: '📋', text: tc9.features?.[1] || '20 quy tắc chi tiết' },
          { icon: '✅', text: tc9.features?.[2] || 'Checklist hằng ngày' },
          { icon: '🚨', text: tc9.features?.[3] || 'Dấu hiệu nguy hiểm' },
        ]}
        stats={[
          { value: '20', label: tc9.stat_labels?.[0] || 'Quy tắc' },
          { value: '3', label: tc9.stat_labels?.[1] || 'Nhóm ND' },
          { value: '13', label: tc9.stat_labels?.[2] || 'Câu hỏi' },
        ]}
        image="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80"
        imageAlt="Safety rules"
        cta={tc9.cta || 'Xem Quy Tắc An Toàn'}
      />
      ); })()}

      {(() => { const tc10 = pillar?.teaser_cards?.[10] || {}; return (
      <TeaserCard
        to="/pillar/b/checklist"
        color="#10b981" rgb="16,185,129"
        icon="✅" category={tc10.category || 'Daily Tracker'}
        title={tc10.title || 'Checklist Nutrition'} accent={tc10.accent || 'Hằng Ngày'}
        desc={tc10.desc || 'Không bắt bạn ăn hoàn hảo — chỉ 9 tiêu chí, 100 điểm, 5 câu hỏi mỗi ngày. Chọn loại ngày, theo dõi nước, điểm số tự động, lưu kết quả hàng ngày và hàng tuần.'}
        features={[
          { icon: '📊', text: tc10.features?.[0] || '9 tiêu chí' },
          { icon: '💯', text: tc10.features?.[1] || '100 điểm/ngày' },
          { icon: '💧', text: tc10.features?.[2] || 'Water tracker' },
          { icon: '💾', text: tc10.features?.[3] || 'Lưu offline' },
        ]}
        stats={[
          { value: '9', label: tc10.stat_labels?.[0] || 'Tiêu chí' },
          { value: '100', label: tc10.stat_labels?.[1] || 'Điểm' },
          { value: '7', label: tc10.stat_labels?.[2] || 'Buổi' },
        ]}
        image="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=80"
        imageAlt="Daily nutrition checklist"
        cta={tc10.cta || 'Mở Checklist'}
      />
      ); })()}

      {(() => { const tc11 = pillar?.teaser_cards?.[11] || {}; return (
      <TeaserCard
        to="/pillar/b/template"
        color="#f43f5e" rgb="244,63,94"
        icon="📋" category={tc11.category || 'Standard Template'}
        title={tc11.title || 'Template Meal Plan'} accent={tc11.accent || 'Chuẩn Cho Dự Án'}
        desc={tc11.desc || 'Bộ template hoàn chỉnh: tính BMR/TDEE, chia macro, cấu trúc đĩa ăn, thư viện món, template 7 ngày, điều chỉnh theo lịch tập, checklist 10 tiêu chí và mẫu báo cáo tuần.'}
        features={[
          { icon: '⚙️', text: tc11.features?.[0] || 'BMR/TDEE Calculator' },
          { icon: '🍩', text: tc11.features?.[1] || 'Macro Donut' },
          { icon: '🍽️', text: tc11.features?.[2] || 'Plate Builder' },
          { icon: '📅', text: tc11.features?.[3] || '7-day Planner' },
        ]}
        stats={[
          { value: '7', label: tc11.stat_labels?.[0] || 'Bước' },
          { value: '10', label: tc11.stat_labels?.[1] || 'Tiêu chí' },
          { value: '∞', label: tc11.stat_labels?.[2] || 'Cá nhân' },
        ]}
        image="https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80"
        imageAlt="Template meal plan"
        cta={tc11.cta || 'Mở Template'}
      />
      ); })()}

      {(() => { const tc12 = pillar?.teaser_cards?.[12] || {}; return (
      <TeaserCard
        to="/pillar/b/mealprep"
        color="#6366f1" rgb="99,102,241"
        icon="⏱️" category={tc12.category || 'Batch Cooking'}
        title={tc12.title || 'Bộ Meal Prep'} accent={tc12.accent || '30 Phút cho 3 Ngày'}
        desc={tc12.desc || '1 lần nấu — 3 ngày ăn chủ động. Timeline 6 bước song song, công thức hộp theo mục tiêu, thực đơn 3 ngày đổi vị, 4 tuần xoay vòng không ngán, checklist mua sắm và an toàn thực phẩm.'}
        features={[
          { icon: '⏱️', text: tc12.features?.[0] || 'Timer 30 phút' },
          { icon: '📦', text: tc12.features?.[1] || '3 ngày thực đơn' },
          { icon: '🔄', text: tc12.features?.[2] || '4 tuần xoay vòng' },
          { icon: '🍲', text: tc12.features?.[3] || '3 sốt chuẩn' },
        ]}
        stats={[
          { value: '30', label: tc12.stat_labels?.[0] || 'Phút' },
          { value: '3', label: tc12.stat_labels?.[1] || 'Ngày' },
          { value: '6', label: tc12.stat_labels?.[2] || 'Hộp' },
        ]}
        image="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80"
        imageAlt="Meal prep 30 phút"
        cta={tc12.cta || 'Bắt Đầu Meal Prep'}
      />
      ); })()}

      {/* ── LỘ TRÌNH ── */}
      <TeaserSection label={pillar?.teaser_sections?.[3]?.label || 'Lộ Trình Dài Hạn'} count={pillar?.teaser_sections?.[3]?.count || '2 trang'} />

      {(() => { const tc13 = pillar?.teaser_cards?.[13] || {}; return (
      <TeaserCard
        to="/pillar/b/12week"
        color="#14b8a6" rgb="20,184,166"
        icon="🗓️" category={tc13.category || 'Lộ Trình · 12 Tuần'}
        title={tc13.title || 'Lộ Trình Nutrition'} accent={tc13.accent || '12 Tuần'}
        desc={tc13.desc || 'Từ nhận thức → đĩa ăn → meal prep → cá nhân hóa → phục hồi → tự vận hành. Hệ thống 6 giai đoạn giúp bạn xây thói quen dinh dưỡng bền vững — không diet cực đoan, không đếm từng gram.'}
        features={[
          { icon: '📈', text: tc13.features?.[0] || '6 giai đoạn' },
          { icon: '🏆', text: tc13.features?.[1] || 'Nutrition Score' },
          { icon: '🎯', text: tc13.features?.[2] || 'Cá nhân hóa' },
          { icon: '📅', text: tc13.features?.[3] || 'Kế hoạch 90 ngày' },
        ]}
        stats={[
          { value: '12', label: tc13.stat_labels?.[0] || 'Tuần' },
          { value: '6', label: tc13.stat_labels?.[1] || 'Giai đoạn' },
          { value: '100', label: tc13.stat_labels?.[2] || 'Điểm/ngày' },
        ]}
        image="https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1200&q=80"
        imageAlt="12-week nutrition roadmap"
        cta={tc13.cta || 'Xem Lộ Trình'}
      />
      ); })()}

      {(() => { const tc14 = pillar?.teaser_cards?.[14] || {}; return (
      <TeaserCard
        to="/pillar/b/24week"
        color="#f59e0b" rgb="245,158,11"
        icon="🗓️" category={tc14.category || 'Lộ Trình Dài Hạn · 24 Tuần'}
        title={tc14.title || 'Lộ Trình Nutrition'} accent={tc14.accent || '24 Tuần'}
        desc={tc14.desc || 'Từ nhận thức → kiểm soát năng lượng → cá nhân hóa → đời sống thật → tối ưu hiệu suất → tự vận hành. Hệ thống giúp bạn xây thói quen dinh dưỡng bền vững không phụ thuộc vào ý chí.'}
        features={[
          { icon: '📈', text: tc14.features?.[0] || '6 giai đoạn' },
          { icon: '📊', text: tc14.features?.[1] || 'Habit Score' },
          { icon: '🎯', text: tc14.features?.[2] || 'Cá nhân hóa B0' },
          { icon: '🤖', text: tc14.features?.[3] || 'Tự vận hành' },
        ]}
        stats={[
          { value: '24', label: tc14.stat_labels?.[0] || 'Tuần' },
          { value: '6', label: tc14.stat_labels?.[1] || 'Giai đoạn' },
          { value: '85+', label: tc14.stat_labels?.[2] || 'Điểm MĐ' },
        ]}
        image="https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=1200&q=80"
        imageAlt="24-week nutrition roadmap"
        cta={tc14.cta || 'Xem Lộ Trình 24 Tuần'}
      />
      ); })()}

      {/* ══════════════════════════════════════════════════════════════════════
          SAFETY NOTE
      ══════════════════════════════════════════════════════════════════════ */}
      <RevealBlock className="mb-16">
        <div className="relative rounded-2xl border border-lime-500/20 bg-lime-500/4 p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] pointer-events-none" style={{ background: `${LIME}06` }} />
          <div className="relative flex flex-col md:flex-row md:items-center gap-5">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-lime-500/10 border border-lime-500/25 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <p className="text-sm font-bold text-lime-400">{pillar?.safety_label || 'An toàn trước'}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted leading-relaxed">
                <span className="text-lime-300 font-semibold">{pillar?.safety_headline || 'An toàn trước, hiệu quả sau, bền vững là mục tiêu cuối cùng.'}</span>{' '}
                {pillar?.safety_body || 'Thông tin trên mang tính giáo dục chung, không thay thế tư vấn chuyên môn. Nếu có bệnh lý nền (tiểu đường, thận, tim mạch, rối loạn ăn uống), hãy tham khảo bác sĩ hoặc chuyên gia dinh dưỡng trước khi thay đổi chế độ ăn.'}
              </p>
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* ══════════════════════════════════════════════════════════════════════
          CTA BOTTOM
      ══════════════════════════════════════════════════════════════════════ */}
      <RevealBlock className="mb-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/program"
            className="group relative overflow-hidden rounded-2xl border border-lime-500/20 bg-lime-500/4 p-6 hover:border-lime-500/40 hover:bg-lime-500/8 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 grid-dots opacity-10 pointer-events-none" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h3 className="font-black text-text text-base mb-1">{pillar?.cta_program_title || 'Lộ Trình 12 Tuần'}</h3>
              <p className="text-muted text-xs leading-relaxed mb-4">{pillar?.cta_program_desc || 'Kết hợp dinh dưỡng + vận động theo kế hoạch có cấu trúc rõ ràng từng giai đoạn.'}</p>
              <span className="inline-flex items-center gap-1.5 text-lime-400 text-xs font-bold group-hover:gap-2.5 transition-all">
                {pillar?.cta_program_cta || 'Xem lộ trình'}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </span>
            </div>
          </Link>

          <Link
            to="/pillars"
            className="group relative overflow-hidden rounded-2xl border border-teal-500/20 bg-teal-500/4 p-6 hover:border-teal-500/40 hover:bg-teal-500/8 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 grid-dots opacity-10 pointer-events-none" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <h3 className="font-black text-text text-base mb-1">{pillar?.cta_pillars_title || '6 Trụ Cột Sức Khỏe'}</h3>
              <p className="text-muted text-xs leading-relaxed mb-4">{pillar?.cta_pillars_desc || 'Dinh dưỡng chỉ là 1 trong 6 trụ cột. Khám phá vận động, phục hồi, giấc ngủ và cả tinh thần.'}</p>
              <span className="inline-flex items-center gap-1.5 text-teal-400 text-xs font-bold group-hover:gap-2.5 transition-all">
                {pillar?.cta_pillars_cta || 'Xem tất cả trụ cột'}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </span>
            </div>
          </Link>
        </div>
      </RevealBlock>

    </div>
  );
}
