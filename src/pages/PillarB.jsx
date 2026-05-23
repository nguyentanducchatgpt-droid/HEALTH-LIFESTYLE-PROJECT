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
  { key: 'gain',   label: 'Tăng cơ',  delta: +250, color: '#22c55e', note: 'Thặng dư 150–300 kcal' },
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
  { name: 'Đạm',           color: '#84cc16', items: ['Trứng 10–14 quả', 'Ức gà / đùi gà bỏ da', 'Cá basa / cá thu / cá hồi', 'Thịt nạc heo / bò', 'Tôm', 'Đậu hũ', 'Sữa chua không đường', 'Sữa tươi không đường'] },
  { name: 'Tinh bột',      color: '#f97316', items: ['Gạo trắng / gạo lứt', 'Khoai lang', 'Yến mạch', 'Bánh mì nguyên cám', 'Bún / phở / miến'] },
  { name: 'Rau',           color: '#22c55e', items: ['Cải xanh, cải thìa, rau muống', 'Dưa leo, cà chua, xà lách', 'Bí đỏ, cà rốt, nấm', 'Rau thơm, hành, giá đỗ'] },
  { name: 'Trái cây',      color: '#06b6d4', items: ['Chuối', 'Táo', 'Cam / quýt', 'Ổi', 'Thanh long / đu đủ'] },
  { name: 'Chất béo tốt', color: '#eab308', items: ['Hạt điều / hạnh nhân nhỏ', 'Dầu olive lượng nhỏ', 'Bơ đậu phộng ít đường', 'Mè / vừng'] },
];
const MEAL_PREP_STEPS = [
  { icon: '🥚', text: 'Luộc 6–8 quả trứng để sẵn trong tủ', color: '#84cc16' },
  { icon: '🍠', text: 'Hấp 4–6 củ khoai lang nhỏ', color: '#f97316' },
  { icon: '🍗', text: 'Áp chảo / nướng 3–4 phần gà hoặc cá', color: '#22c55e' },
  { icon: '🥦', text: 'Rửa, cắt sẵn rau sống đựng trong hộp', color: '#10b981' },
  { icon: '🍚', text: 'Nấu sẵn 2–3 phần cơm đựng hộp kín', color: '#06b6d4' },
  { icon: '🫙', text: 'Chuẩn bị 3 hộp snack: trái cây + sữa chua + hạt', color: '#a855f7' },
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
  const [width, setWidth] = useState(0);
  const [ref, visible] = useScrollReveal(0.15);
  const fact = MACRO_QUICK_FACTS[macro.name] ?? { icon: '•', tip: '' };

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
            <p className={`text-sm font-bold ${macro.text}`}>{macro.name}</p>
            <p className="text-[10px] text-muted leading-none mt-0.5">{macro.dose}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-base font-black ${macro.text} leading-none`}>
            <AnimatedVal value={macro.gram ?? macro.pct} /><span className="text-[10px] font-normal ml-0.5">{macro.gramUnit ?? '%'}</span>
          </p>
          <p className="text-[8px] text-muted mt-0.5">/ngày · {expanded ? '▲ ẩn' : '▼ xem'}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
        <div className={`h-full rounded-full ${macro.bg}`}
          style={{ width: `${width}%`, transition: `width 0.9s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms` }} />
      </div>

      {/* Role */}
      <p className="text-[11px] text-muted mb-3 leading-relaxed">{macro.role}</p>

      {/* Sources */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {macro.sources.map(src => (
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
            <p className={`text-sm font-bold ${macro.text}`}>{macro.name}</p>
            <p className="text-[10px] text-muted">{macro.dose}</p>
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

      <p className="text-[11px] text-muted mb-3 leading-relaxed">{macro.role}</p>

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
              <p className="text-[8px] font-bold text-white/60 leading-tight">ĐĨA</p>
              <p className="text-[8px] font-bold text-white/60 leading-tight">ĂN</p>
            </div>
          </div>
        </div>

        {/* Labels outside */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-1">
          <span className="text-[9px] font-bold text-green-400 bg-bg/80 px-1.5 py-0.5 rounded whitespace-nowrap">½ Rau</span>
        </div>
        <div className="absolute bottom-[22%] right-[-8px]">
          <span className="text-[9px] font-bold text-lime-400 bg-bg/80 px-1.5 py-0.5 rounded whitespace-nowrap">¼ Đạm</span>
        </div>
        <div className="absolute bottom-[22%] left-[-20px]">
          <span className="text-[9px] font-bold text-orange-400 bg-bg/80 px-1.5 py-0.5 rounded whitespace-nowrap">¼ Tinh bột</span>
        </div>
      </div>

      {/* Bar breakdown */}
      <div className="space-y-3 mt-2">
        {PLATE_SECTIONS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${s.bg} shrink-0`} />
            <span className={`text-xs font-semibold ${s.text} w-28 shrink-0`}>{s.label}</span>
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
          <span className="font-bold text-yellow-400">+ Chất béo tốt:</span> Thêm một ít dầu olive, bơ, hay hạt — hấp thu vitamin tan trong dầu tốt hơn.
        </p>
      </div>
    </div>
  );
}

// ─── Goal Card ────────────────────────────────────────────────────────────────

function GoalCard({ goal, active, onClick }) {
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
              { k: 'Calo', v: goal.kcal },
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
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [previewGoalKey, setPreviewGoalKey] = useState(s.goalKey ?? 'recomp');
  const [expandedMacro, setExpandedMacro]   = useState(null);
  const detail = selectedMetric ? b1MetricDetail(selectedMetric, s) : null;

  useEffect(() => { setPreviewGoalKey(s.goalKey ?? 'recomp'); }, [s.goalKey]);

  const previewGoal    = GOAL_MODIFIERS.find(g => g.key === previewGoalKey) ?? GOAL_MODIFIERS[1];
  const previewKcal    = selectedMetric === 'tdee' ? s.tdee : s.tdee + previewGoal.delta;
  const dynMacros      = useMemo(() => buildDynamicMacros(s, previewKcal), [s, previewKcal]);
  const activeMacroKey = METRIC_TO_MACRO[selectedMetric] ?? null;

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
      <PersonalizedBar panelId="b1" color="#84cc16" source="B0 (TDEE Calculator)"
        selectedKey={selectedMetric} onSelect={setSelectedMetric}
        items={[
        { key: 'tdee',    label: 'TDEE',      value: `${s.tdee.toLocaleString()} kcal`, note: 'duy trì cân',                       tip: `TDEE = BMR (${s.bmr.toLocaleString()} kcal) × hệ số hoạt động (${s.activity.mult}). Đây là lượng calo cơ thể đốt nếu bạn giữ nguyên mức vận động hiện tại. Ăn bằng con số này = giữ cân.` },
        { key: 'target',  label: 'Mục tiêu',  value: `${s.targetKcal.toLocaleString()} kcal`, note: s.goal.label.toLowerCase(),    tip: `${s.goal.label}: TDEE ${s.goal.delta >= 0 ? '+' : ''}${s.goal.delta} kcal = ${s.targetKcal.toLocaleString()} kcal/ngày. ${s.goal.note}` },
        { key: 'protein', label: 'Protein',   value: `${s.proteinG}g`,   note: `${(s.proteinG/s.weight).toFixed(1)}g/kg`,            tip: `${s.proteinG}g = ${(s.proteinG/s.weight).toFixed(1)}g × ${s.weight}kg cân nặng.` },
        { key: 'carb',    label: 'Carb',      value: `${s.carbG}g`,      note: `${s.carbPct}% kcal`,                                 tip: `Carb = (${s.targetKcal} - ${s.proteinG}×4 - ${s.fatG}×9) ÷ 4 = ${s.carbG}g/ngày.` },
        { key: 'fat',     label: 'Fat',       value: `${s.fatG}g`,       note: `${s.fatPct}% kcal`,                                  tip: `Fat = ${s.targetKcal} × 25% ÷ 9 = ${s.fatG}g/ngày.` },
        { key: 'water',   label: 'Nước',      value: `${s.waterMl}ml`,   note: `${Math.round(s.waterMl/250)} ly`,                    tip: `${s.waterMl}ml = ${s.weight}kg × 35ml.` },
        { key: 'fiber',   label: 'Chất xơ',   value: `${s.fiberG}g`,     note: '/ngày',                                              tip: `${s.fiberG}g/ngày theo khuyến nghị ${s.sex === 'male' ? 'nam' : 'nữ'} trưởng thành.` },
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
                <p className="text-[9px] text-muted uppercase tracking-widest font-bold">TDEE của bạn</p>
                <p className="text-base font-black text-lime-400 leading-none">{s.tdee.toLocaleString()} kcal<span className="text-[9px] text-muted font-normal ml-1">/ngày</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted">
              <span>BMR <span className="text-text font-semibold">{s.bmr.toLocaleString()}</span></span>
              <span className="text-muted/40">×</span>
              <span>Hệ số <span className="text-text font-semibold">{s.activity.mult}</span></span>
              <span className="text-muted/40">=</span>
              <span className="font-bold text-lime-400">{s.tdee.toLocaleString()} kcal</span>
            </div>
          </div>

          {/* Goal selector header */}
          <div className="px-5 pt-4 pb-2">
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.18em]">Chọn Mục Tiêu — Macro Tự Cập Nhật</p>
          </div>

          {/* 3 goal cards */}
          <div className="px-4 pb-4 grid grid-cols-3 gap-3">
            {TDEE_MODES.map(m => {
              const isActive = previewGoalKey === m.goalKey;
              const DELTAS = { loss: -400, recomp: 0, gain: 250 };
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
              <span className="font-bold" style={{ color: previewGoal.color }}>{previewGoal.label}: </span>
              {previewGoal.note}
              {' — '}<span className="font-black" style={{ color: previewGoal.color }}>
                <AnimatedVal value={previewKcal} /> kcal/ngày
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
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.18em]">Phân Bổ Macro Hàng Ngày</p>
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
              { label: 'Carb',     gram: cG, pct: cW, color: '#f97316', note: 'Nhiên liệu chính' },
              { label: 'Chất béo', gram: fG, pct: fW, color: '#eab308', note: 'Nội tiết · Vitamin' },
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
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.18em]">5 Nhóm Dinh Dưỡng Cốt Lõi</p>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full transition-all duration-300"
            style={{ color: previewGoal.color, background: `${previewGoal.color}10`, border: `1px solid ${previewGoal.color}25` }}>
            {selectedMetric === 'tdee' ? `TDEE — ${s.tdee.toLocaleString()} kcal` : `${previewGoal.label} — ${previewKcal.toLocaleString()} kcal`}
          </span>
        </div>
        <p className="text-[10px] text-muted mb-4">Nhấn vào mỗi thẻ để xem gợi ý thực hành.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dynMacros.map((m, i) => (
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
  const [ref, visible] = useScrollReveal(0.15);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [proteinBars, setProteinBars] = useState([0, 0, 0, 0]);
  const [carbBars, setCarbBars] = useState([0, 0, 0, 0]);
  const detail = selectedMetric ? b2MetricDetail(selectedMetric, s) : null;

  const proteinRows = [
    { meal: '🌅 Sáng', g: s.breakfastProteinG, pct: 25, note: 'trứng + sữa chua' },
    { meal: '☀️ Trưa', g: s.lunchProteinG,     pct: 35, note: 'ức gà / cá / đậu hũ' },
    { meal: '🌙 Tối',  g: s.dinnerProteinG,    pct: 30, note: 'cá / thịt / trứng' },
    { meal: '🍎 Snack',g: s.snackProteinG,     pct: 10, note: 'sữa chua Hy Lạp' },
  ];
  const carbRows = [
    { meal: '🌅 Sáng', g: s.breakfastCarbG, pct: 25, note: 'ổn định đường huyết' },
    { meal: '☀️ Trưa', g: s.lunchCarbG,     pct: 40, note: 'năng lượng cao nhất', hi: true },
    { meal: '🌙 Tối',  g: s.dinnerCarbG,    pct: 25, note: 'giảm nếu không tập tối' },
    { meal: '🍎 Snack',g: s.snackCarbG,     pct: 10, note: 'trái cây, yến mạch' },
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
      <PersonalizedBar panelId="b2" color="#22c55e" source="B0 + B1 (TDEE & Macros)"
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
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-5">Phương Pháp Đĩa Ăn</p>
          <PlateDiagram animate={visible} />
        </div>
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-5">Áp Dụng Thực Tế</p>
          <div className="rounded-2xl border border-lime-500/20 bg-lime-500/5 p-5">
            <p className="text-xs font-bold text-lime-400 mb-3">🏠 Tại nhà</p>
            <ul className="space-y-2">
              {['Dùng đĩa 23–26cm làm chuẩn', 'Bắt đầu bằng rau trước khi thêm carb', 'Đạm = lòng bàn tay của bạn', 'Cơm = nắm tay của bạn'].map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                  <span className="text-lime-400 font-bold shrink-0">✓</span>{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
            <p className="text-xs font-bold text-orange-400 mb-3">🍜 Ăn ngoài hàng</p>
            <ul className="space-y-2">
              {['Chọn phần có cả đạm + rau + carb', 'Gọi thêm rau hoặc salad riêng', 'Tránh nước chấm nhiều muối/đường', 'Bún/phở: ít bún, nhiều rau, thêm trứng'].map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                  <span className="text-orange-400 font-bold shrink-0">✓</span>{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <p className="text-xs font-bold text-cyan-400 mb-3">📦 Meal Prep bận rộn</p>
            <ul className="space-y-2">
              {['Chuẩn bị đạm cho cả tuần (gà, trứng, đậu hũ)', 'Nấu lượng cơm 2–3 ngày một lần', 'Rau luộc sẵn, bảo quản tủ lạnh 3 ngày', 'Yến mạch overnight cho sáng bận rộn'].map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                  <span className="text-cyan-400 font-bold shrink-0">✓</span>{t}
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
            <span className="text-[9px] font-bold text-green-400 uppercase tracking-[0.25em] mb-1.5">Nguyên tắc vàng</span>
            <p className="text-xl font-black text-text leading-tight mb-1.5">Đạm → Rau → Tinh bột</p>
            <p className="text-[11px] text-muted leading-relaxed">Thứ tự ăn quyết định tốc độ tăng đường huyết — ăn đạm và rau trước giúp hấp thu tinh bột chậm hơn.</p>
          </div>
        </div>
      </RevealBlock>

      {/* ── Hand portion formula ─────────────────────────────────────── */}
      <RevealBlock delay={40}>
        <div className="rounded-2xl border border-border/25 p-6 mb-8" style={{ background: 'rgba(255,255,255,0.015)' }}>
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-lime-500/15 border border-lime-500/25 flex items-center justify-center text-xl shrink-0">✋</div>
            <div>
              <h3 className="text-sm font-bold text-text">Công Thức Khẩu Phần Theo Tay — Không Cần Cân</h3>
              <p className="text-[10px] text-muted mt-0.5">Ước lượng khẩu phần từng bữa dựa trên kích thước bàn tay bạn</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { hand: '🤜', label: 'Đạm', portion: '1 lòng bàn tay', calc: `≈ ${s.perMealProteinG}g protein`, example: `${s.chickenG}g ức gà`, color: '#84cc16' },
              { hand: '✊', label: 'Tinh bột', portion: '1 nắm tay', calc: `≈ ${s.riceG}g cơm`, example: 'hoặc 1 củ khoai lang', color: '#f97316' },
              { hand: '🤲', label: 'Rau xanh', portion: '2 nắm tay', calc: '≈ 150–200g rau', example: 'luộc hoặc xào ít dầu', color: '#22c55e' },
              { hand: '👍', label: 'Chất béo', portion: '1 ngón cái', calc: `≈ ${s.perMealFatG}g fat`, example: 'dầu olive / bơ / hạt', color: '#eab308' },
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
              <span className="text-lime-400 font-bold">Công thức bữa của bạn</span>
              <span className="text-muted/60 ml-1">({s.perMealKcal} kcal/bữa · {s.mealsPerDay} bữa/ngày)</span>
            </p>
            <p className="text-[11px] text-text font-semibold leading-relaxed">
              {s.chickenG}g ức gà <span className="text-lime-400">({s.perMealProteinG}g đạm)</span>
              {' + '}{s.riceG}g cơm <span className="text-orange-400">({s.perMealCarbG}g carb)</span>
              {' + '}<span className="text-green-400">2 nắm rau</span>
              {' + '}{s.perMealFatG}g chất béo tốt
            </p>
          </div>
        </div>
      </RevealBlock>

      {/* ── Protein anchor + Carb timing 2-col ──────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        {/* Protein anchor */}
        <RevealBlock delay={60}>
          <div className="rounded-2xl border border-lime-500/20 bg-lime-500/5 p-5 h-full">
            <h3 className="text-sm font-bold text-lime-400 mb-0.5 flex items-center gap-2">💪 Protein — "Neo" Mỗi Bữa</h3>
            <p className="text-[10px] text-muted mb-4">Xây bữa ăn từ đạm trước, sau đó thêm carb và rau</p>
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
              <p className="text-[10px] text-muted">Tổng protein</p>
              <p className="text-[11px] font-black text-lime-400">{s.proteinG}g/ngày · {(s.proteinG/s.weight).toFixed(1)}g/kg</p>
            </div>
          </div>
        </RevealBlock>

        {/* Carb timing */}
        <RevealBlock delay={100}>
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5 h-full">
            <h3 className="text-sm font-bold text-orange-400 mb-0.5 flex items-center gap-2">⚡ Carb Đúng Thời Điểm</h3>
            <p className="text-[10px] text-muted mb-4">Ưu tiên tinh bột vào bữa trưa — giảm dần về tối</p>
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
              <p className="text-[10px] text-muted">Tổng carb</p>
              <p className="text-[11px] font-black text-orange-400">{s.carbG}g/ngày · Trưa: {s.lunchCarbG}g</p>
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
              <h3 className="text-sm font-bold text-text">Nguyên Tắc 80/20 — Linh Hoạt Để Bền Vững</h3>
              <p className="text-[10px] text-muted">Kỷ luật không phải là cấm tất cả — là biết cách quay lại</p>
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
              <p className="text-[10px] font-bold text-green-400 uppercase tracking-wider mb-2.5">Ăn đúng nền tảng</p>
              <ul className="space-y-1.5">
                {['Đủ đạm, đủ rau, đủ nước mỗi bữa', `Ăn đúng ${s.targetKcal.toLocaleString()} kcal ±100`, 'Hạn chế đồ uống có đường', 'Meal prep 1–2 lần/tuần'].map((t, i) => (
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
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2.5">Linh hoạt đời thực</p>
              <ul className="space-y-1.5">
                {['Ăn ngoài, tiệc, sum họp gia đình', 'Món yêu thích 1–2 lần/tuần', 'Khi lỡ ăn nhiều — chỉnh bữa sau', 'Không tự trách bản thân'].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                    <span className="text-purple-400 shrink-0 mt-px">●</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-xl border px-4 py-3" style={{ background: 'rgba(168,85,247,0.05)', borderColor: 'rgba(168,85,247,0.18)' }}>
            <p className="text-[11px] text-muted/80 italic leading-relaxed">
              "Một bữa lệch kế hoạch <span className="text-purple-400 font-semibold not-italic">không phá hỏng hành trình</span>. Điều phá hỏng hành trình là tâm lý <span className="text-red-400 font-semibold not-italic">'lỡ rồi bỏ luôn'</span>."
            </p>
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
  'muscle-gain': { delta: +250, proteinMult: 1.8, sign: '+', kLabel: 'Thặng dư' },
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

function GoalsPanel({ s, activeGoal, onActiveGoalChange }) {
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

  const activeG = GOALS.find(g => g.id === activeGoal);
  const analysis = GOAL_ANALYSIS[activeGoal];

  const macroRows = [
    { label: 'Protein', g: preview.proteinG, pct: preview.proteinPct, color: '#f97316', formula: `${s.weight}kg × ${preview.proteinMult}g/kg`, example: 'ức gà, cá, trứng, đậu hũ' },
    { label: 'Carbohydrate', g: preview.carbG, pct: preview.carbPct, color: '#22c55e', formula: `(${preview.targetKcal} − P×4 − F×9) ÷ 4`, example: 'cơm, khoai, yến mạch' },
    { label: 'Chất béo', g: preview.fatG, pct: preview.fatPct, color: '#a855f7', formula: `${preview.targetKcal} × 25% ÷ 9 kcal/g`, example: 'dầu olive, hạt, cá béo' },
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
        { key: 'goal',    label: 'Mục tiêu', value: s.goal.label, tip: `Mục tiêu đang chọn ở B0.` },
        { key: 'adjust',  label: 'Điều chỉnh', value: `${s.goal.delta > 0 ? '+' : ''}${s.goal.delta} kcal`, note: 'so với TDEE', tip: `TDEE (${s.tdee.toLocaleString()}) ${s.goal.delta >= 0 ? '+' : ''}${s.goal.delta} = ${s.targetKcal.toLocaleString()} kcal/ngày.` },
        ...(s.kgPerWeek > 0
          ? [{ key: 'speed', label: 'Tốc độ', value: `~${s.kgPerWeek}kg`, note: 'mỗi tuần', tip: `${Math.abs(s.goal.delta * 7).toLocaleString()} kcal/tuần ÷ 7700 = ${s.kgPerWeek}kg/tuần.` }]
          : [{ key: 'speed', label: 'Cân bằng', value: '±100 kcal', note: 'linh hoạt', tip: `Duy trì = ăn xung quanh TDEE ±100 kcal mỗi ngày.` }]),
        ...(s.weeksTo5kg ? [{ label: 'Đến -5kg', value: `~${s.weeksTo5kg} tuần`, note: `≈${Math.round(s.weeksTo5kg/4.3)} tháng`, tip: `Ở tốc độ ${s.kgPerWeek}kg/tuần, cần ~${s.weeksTo5kg} tuần.` }] : []),
        { key: 'weekly_protein', label: 'Protein/tuần', value: `${s.weeklyProteinG}g`, note: `${s.proteinG}g × 7`, tip: `Tổng protein cần đạt trong 7 ngày.` },
      ]} />
      {detail && <MetricDetailCard detail={detail} color="#f97316" onClose={() => setSelectedMetric(null)} />}

      {/* ── Goal selector ── */}
      <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-5">Chọn Mục Tiêu Của Bạn</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {GOALS.map(g => (
          <GoalCard key={g.id} goal={g} active={activeGoal === g.id} onClick={() => onActiveGoalChange(g.id)} />
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-white/6 bg-white/[0.015] p-4">
        <p className="text-[11px] text-muted leading-relaxed">
          <span className="text-lime-400 font-bold">Lưu ý:</span> Các con số là điểm xuất phát, không phải quy tắc cứng nhắc. Cơ thể của mỗi người phản ứng khác nhau — theo dõi 2–4 tuần rồi điều chỉnh là cách tốt nhất.
        </p>
      </div>

      {/* ── Goal analysis ── */}
      {secDivider('Hiệu quả & Lợi ích', activeG?.color)}
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
            <p className="text-[9px] font-bold uppercase tracking-wide text-yellow-400 mb-0.5">Lưu ý quan trọng</p>
            <p className="text-[10px] text-muted leading-relaxed">{analysis.caution}</p>
          </div>
        </div>
        <p className="text-[9px] text-muted/50 text-right">⏱ {analysis.timeframe}</p>
      </div>

      {/* ── Energy balance formula ── */}
      {secDivider('Công thức năng lượng')}
      <div className="rounded-2xl border p-5 mb-2" style={{ borderColor: 'rgba(249,115,22,0.2)', background: 'rgba(249,115,22,0.03)' }}>
        <p className="text-[10px] text-muted mb-4 text-center">Cách tính calo mục tiêu theo <span className="font-bold" style={{ color: activeG?.color }}>{activeG?.label}</span> từ dữ liệu B0</p>
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          {/* BMR */}
          <div className="flex-1 text-center rounded-xl border p-3.5" style={{ borderColor: 'rgba(249,115,22,0.2)', background: 'rgba(249,115,22,0.05)' }}>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted mb-1.5">BMR</p>
            <p className="text-2xl font-black leading-none" style={{ color: '#f97316' }}>{s.bmr.toLocaleString()}</p>
            <p className="text-[9px] text-muted mt-1">kcal cơ bản/ngày</p>
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
            <p className="text-[9px] text-muted mt-1">kcal duy trì/ngày</p>
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
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: activeG?.color ?? '#f97316' }}>Mục tiêu</p>
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
      {secDivider('Phân bổ Macro cá nhân hóa')}
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
            <p className="text-[9px] text-muted/50">Nguồn thực phẩm: {m.example}</p>
          </div>
        ))}
      </div>

      {/* ── Timeline ── */}
      {milestones.length > 0 && (<>
        {secDivider('Lộ trình ước tính')}
        <div className="rounded-2xl border p-5" style={{ borderColor: 'rgba(249,115,22,0.2)', background: 'rgba(249,115,22,0.03)' }}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-text">Tiến độ theo mốc cân nặng</p>
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
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-1" style={{ color: '#f97316' }}>Triết lý dự án</p>
          <p className="text-sm font-bold text-white leading-snug max-w-sm italic">
            "Ăn tốt hơn hôm qua một chút — đủ dễ để ngày mai còn làm tiếp."
          </p>
        </div>
      </div>

      {/* ── Consistency + 80/20 cards ── */}
      <div className="grid sm:grid-cols-2 gap-4 mb-2">
        <div className="rounded-2xl border p-4" style={{ borderColor: 'rgba(249,115,22,0.2)', background: 'rgba(249,115,22,0.04)' }}>
          <p className="text-3xl font-black leading-none mb-2" style={{ color: '#f97316' }}>70%</p>
          <p className="text-xs font-bold text-text mb-1.5">Kiên trì vừa phải đủ thắng</p>
          <p className="text-[10px] text-muted leading-relaxed">Người duy trì 70–80% kế hoạch trong 6 tháng thường có kết quả tốt hơn người làm 100% trong 7 ngày rồi bỏ cuộc.</p>
        </div>
        <div className="rounded-2xl border p-4" style={{ borderColor: 'rgba(34,197,94,0.2)', background: 'rgba(34,197,94,0.04)' }}>
          <p className="text-3xl font-black leading-none mb-2" style={{ color: '#22c55e' }}>80/20</p>
          <p className="text-xs font-bold text-text mb-1.5">Quy tắc linh hoạt bền vững</p>
          <p className="text-[10px] text-muted leading-relaxed">80% thực phẩm lành mạnh — 20% linh hoạt. Không nhất thiết phải ăn hoàn hảo mỗi ngày để có kết quả tốt dài hạn.</p>
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

function MealsPanel({ s }) {
  const [activeDay, setActiveDay] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const detail = selectedMetric ? b4MetricDetail(selectedMetric, s) : null;
  const day = MEAL_DAYS[activeDay];

  return (
    <div>
      <PersonalizedBar panelId="b4" color="#06b6d4" label="Phân Bổ Dinh Dưỡng Theo Bữa" source="B0 + B1 + B2 + B3"
        selectedKey={selectedMetric} onSelect={setSelectedMetric}
        items={[
        { key: 'breakfast',   label: '🌅 Sáng',   value: `${s.breakfastKcal}`,  note: `${s.breakfastProteinG}g P · ${s.breakfastCarbG}g C`, tip: `25% tổng kcal = ${s.breakfastKcal} kcal.` },
        { key: 'lunch',       label: '☀️ Trưa',   value: `${s.lunchKcal}`,      note: `${s.lunchProteinG}g P · ${s.lunchCarbG}g C`, tip: `35% tổng kcal = ${s.lunchKcal} kcal. Bữa lớn nhất.` },
        { key: 'dinner',      label: '🌙 Tối',    value: `${s.dinnerKcal}`,     note: `${s.dinnerProteinG}g P · ${s.dinnerCarbG}g C`, tip: `30% tổng kcal = ${s.dinnerKcal} kcal. Ít carb hơn trưa.` },
        { key: 'snack',       label: '🍎 Snack',  value: `${s.snackKcal}`,      note: `${s.snackProteinG}g P`, tip: `10% tổng kcal = ${s.snackKcal} kcal. Chia 2 lần xế/sáng.` },
        { key: 'daily_total', label: 'Tổng/ngày', value: `${s.targetKcal.toLocaleString()}`, note: 'kcal', tip: `${s.breakfastKcal}+${s.lunchKcal}+${s.dinnerKcal}+${s.snackKcal} = ${s.targetKcal.toLocaleString()} kcal.` },
      ]} />
      {detail && <MetricDetailCard detail={detail} color="#06b6d4" onClose={() => setSelectedMetric(null)} />}

      <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">Thực Đơn Mẫu 7 Ngày — Có Snack</p>

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
            <span className="block text-[8px] opacity-60 mb-0.5">{d.day}</span>
            <span>{d.theme.split(' — ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Active day content */}
      <div key={activeDay} className="animate-fade-in-up">

        {/* Day header badge */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: day.color }} />
          <span className="text-xs font-bold text-text">{day.day}</span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ color: day.color, background: `${day.color}12`, border: `1px solid ${day.color}30` }}>{day.theme}</span>
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
                    {meal.time}
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
                  {meal.items.map(item => (
                    <span key={item} className="text-[11px] text-text/80 bg-white/[0.04] border border-white/8 px-2.5 py-1 rounded-lg">{item}</span>
                  ))}
                </div>
                <div className="flex items-start gap-2 text-[10px] text-muted">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mt-0.5 text-yellow-400 shrink-0">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                  </svg>
                  <span><span className="text-yellow-400 font-semibold">Bận rộn:</span> {meal.note}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily total */}
        <div className="rounded-2xl border p-4 mb-6 flex items-center gap-4 flex-wrap" style={{ borderColor: `${day.color}30`, background: `${day.color}06` }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: day.color }} />
            <span className="text-xs font-bold" style={{ color: day.color }}>Tổng ngày</span>
          </div>
          {[
            { k: 'Kcal', v: day.totalKcal },
            { k: 'Protein', v: day.totalProtein },
            { k: 'Bữa', v: `${day.meals.length} bữa` },
          ].map(item => (
            <div key={item.k}>
              <span className="text-[10px] text-muted">{item.k}: </span>
              <span className="text-[11px] font-bold text-text">{item.v}</span>
            </div>
          ))}
          <p className="text-[10px] text-muted/50 ml-auto hidden sm:block">Điều chỉnh lượng theo TDEE của bạn ở B0</p>
        </div>

        {/* Daily analysis */}
        <div className="rounded-2xl border p-5" style={{ borderColor: `${day.color}22`, background: `${day.color}04` }}>
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-bold text-text leading-snug pr-3">{day.analysis.headline}</p>
            <div className="shrink-0 text-right">
              <p className="text-[9px] text-muted mb-1">{day.analysis.score.label}</p>
              <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${day.analysis.score.pct}%`, background: day.color }} />
              </div>
              <p className="text-[10px] font-black mt-0.5" style={{ color: day.color }}>{day.analysis.score.pct}%</p>
            </div>
          </div>
          <p className="text-[9px] font-bold mb-2.5" style={{ color: `${day.color}99` }}>🌿 {day.analysis.fiber}</p>
          <p className="text-[10px] text-muted leading-relaxed mb-4">{day.analysis.highlight}</p>
          <ul className="space-y-1.5 mb-4">
            {day.analysis.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-[10px] text-muted">
                <span className="font-bold shrink-0 mt-0.5" style={{ color: day.color }}>✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-start gap-2.5 rounded-xl border p-3" style={{ borderColor: `${day.color}18`, background: `${day.color}06` }}>
            <span className="text-base shrink-0">💡</span>
            <p className="text-[10px] text-muted leading-relaxed">{day.analysis.tip}</p>
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

// ─── Tracking Sub-Panels ──────────────────────────────────────────────────────
function DailyChecklistContent({ checked, toggle, checkedCount }) {
  const allDone = checkedCount === TRACKING_DAILY.length;
  return (
    <div className="rounded-2xl border border-lime-500/20 bg-lime-500/4 overflow-hidden">
      <div className="h-[2px] bg-gradient-to-r from-lime-500/70 via-lime-500/20 to-transparent" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-lime-500/12 border border-lime-500/30 flex items-center justify-center text-sm">✅</div>
            <span className="text-sm font-bold text-text">Checklist Hàng Ngày</span>
          </div>
          <span className="text-xs font-black text-lime-400 bg-lime-500/10 border border-lime-500/25 px-2.5 py-0.5 rounded-full">
            {checkedCount}/{TRACKING_DAILY.length}
          </span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-5">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${(checkedCount / TRACKING_DAILY.length) * 100}%`,
              background: 'linear-gradient(90deg, #84cc16, #22c55e)',
              boxShadow: '0 0 8px rgba(132,204,22,0.4)',
            }}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-2">
          {TRACKING_DAILY.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer group/ci ${
                checked[i]
                  ? 'border-lime-500/35 bg-lime-500/8'
                  : 'border-border/35 bg-white/[0.02] hover:border-lime-500/20 hover:bg-lime-500/4'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                  checked[i] ? 'border-lime-400 bg-lime-500' : 'border-border/50'
                }`}
              >
                {checked[i] && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.color }} />
                <span className={`text-[11px] transition-colors leading-snug ${checked[i] ? 'line-through text-muted/50' : 'text-muted'}`}>
                  {item.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {allDone && (
          <div className="mt-5 flex items-center gap-3 bg-lime-500/10 border border-lime-500/25 rounded-xl px-4 py-3">
            <span className="text-xl">🎉</span>
            <p className="text-sm font-bold text-lime-300">Hoàn thành! Thói quen nhỏ mỗi ngày tạo nên kết quả lớn.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function WeeklyMetricsContent() {
  return (
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
            <div
              key={i}
              className="flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-default"
              style={{
                borderColor: `${item.color}30`,
                background: `${item.color}07`,
              }}
            >
              <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-bold leading-snug" style={{ color: item.color }}>{item.label}</p>
                <p className="text-[10px] text-muted mt-0.5 mb-2">{item.sub}</p>
                <div
                  className="text-[10px] leading-relaxed px-2 py-1.5 rounded-lg"
                  style={{ background: `${item.color}10`, color: `${item.color}cc`, border: `1px solid ${item.color}20` }}
                >
                  💡 {item.tip}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdjustmentContent() {
  return (
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
            <div
              key={i}
              className="flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] hover:-translate-y-0.5 cursor-default"
              style={{ borderColor: `${s.color}28`, background: `${s.color}06` }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ color: s.color, background: `${s.color}18`, border: `1px solid ${s.color}35` }}
              >
                {s.n}
              </div>
              <p className="text-[11px] text-muted leading-relaxed pt-1.5">{s.text}</p>
            </div>
          ))}
        </div>
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

function TrackingPanel({ s }) {
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
        { key: 'daily_protein', label: 'Protein/ngày', value: `${s.proteinG}g`, note: 'mục tiêu', tip: `${s.proteinG}g/ngày = ${(s.proteinG/s.weight).toFixed(1)}g × ${s.weight}kg.` },
        { key: 'water',         label: 'Nước uống', value: `${s.waterMl}ml`, note: `${Math.round(s.waterMl/250)} ly 250ml`, tip: `${s.waterMl}ml = ${s.weight}kg × 35ml/kg.` },
        { key: 'steps',         label: 'Bước chân', value: `${s.dailySteps.toLocaleString()}`, note: 'bước/ngày', tip: `Tương ứng mức hoạt động ${s.activity.label}.` },
        { key: 'workout',       label: 'Tập luyện', value: `${s.weeklyWorkoutMins}`, note: 'phút/tuần', tip: `${s.weeklyWorkoutMins} phút/tuần tương ứng mức hoạt động ${s.activity.label}.` },
        { key: 'kcal_target',   label: 'Kcal mục tiêu', value: `${s.targetKcal.toLocaleString()}`, note: 'kcal/ngày', tip: `Điều chỉnh ±100–200 kcal nếu cân không thay đổi sau 2 tuần.` },
      ]} />
      {detail && <MetricDetailCard detail={detail} color="#a855f7" onClose={() => setSelectedMetric(null)} />}
      {/* Section heading */}
      <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">5 Chủ Đề Theo Dõi</p>

      {/* 3 tab cards */}
      <div className="grid grid-cols-3 gap-3">
        {TRACKING_SECTIONS.map((sec, i) => (
          <TrackingTabCard
            key={sec.id}
            section={sec}
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
        {activeSection === 1 && <WeeklyMetricsContent />}
        {activeSection === 2 && <AdjustmentContent />}
      </div>
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
            <p className="text-sm font-bold text-violet-300 mb-1.5">TDEE là gì?</p>
            <p className="text-[12px] text-muted leading-relaxed">
              <span className="text-text/90 font-semibold">TDEE</span> (Total Daily Energy Expenditure) là tổng lượng calo cơ thể đốt cháy mỗi ngày — gồm 3 thành phần:
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: 'BMR', sub: 'Trao đổi chất cơ bản', pct: '60–75%', icon: '💤', color: '#8b5cf6' },
                { label: 'TEA', sub: 'Hoạt động thể chất', pct: '15–30%', icon: '🏃', color: '#06b6d4' },
                { label: 'TEF', sub: 'Tiêu hóa thức ăn', pct: '5–10%', icon: '🍽️', color: '#22c55e' },
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
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Nhập Thông Số</p>

          {/* Weight */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Cân nặng (kg)</span>
            {numInput(weight, setWeight, 30, 200)}
          </div>
          {/* Height */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Chiều cao (cm)</span>
            {numInput(height, setHeight, 100, 250)}
          </div>
          {/* Age */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Tuổi</span>
            {numInput(age, setAge, 10, 100)}
          </div>

          {/* Sex toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Giới tính</span>
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
                  {s === 'male' ? 'Nam' : 'Nữ'}
                </button>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div>
            <p className="text-xs text-muted mb-2">Mức hoạt động</p>
            <div className="space-y-1.5">
              {ACTIVITY_LEVELS.map(a => (
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
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Kết Quả TDEE</p>

          {/* TDEE display */}
          <div className="rounded-2xl border border-violet-500/25 bg-violet-500/8 p-5 text-center">
            <p className="text-[10px] text-muted mb-1 uppercase tracking-widest">TDEE ước tính</p>
            <p className="text-4xl font-black" style={{ color: '#8b5cf6' }}>{tdee.toLocaleString()}</p>
            <p className="text-xs text-muted mt-1">kcal / ngày</p>
            <div className="mt-4 pt-3 border-t border-violet-500/15 flex items-center justify-center flex-wrap gap-1.5 text-[10px]">
              <span className="px-2 py-0.5 rounded-lg font-bold" style={{ background: '#8b5cf615', border: '1px solid #8b5cf630', color: '#c4b5fd' }}>BMR {bmr.toLocaleString()}</span>
              <span className="text-muted">×</span>
              <span className="px-2 py-0.5 rounded-lg font-bold" style={{ background: '#06b6d415', border: '1px solid #06b6d430', color: '#67e8f9' }}>{activity.mult}</span>
              <span className="text-muted">=</span>
              <span className="px-2 py-0.5 rounded-lg font-black" style={{ background: '#8b5cf620', border: '1px solid #8b5cf640', color: '#a78bfa' }}>{tdee.toLocaleString()}</span>
            </div>
            <p className="text-[9px] text-muted/40 mt-1.5">Mifflin-St Jeor × Hệ số hoạt động</p>
          </div>

          {/* Goal cards */}
          <div className="space-y-3">
            {GOAL_MODIFIERS.map(g => {
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
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">Phân Tích Chi Tiết</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'BMR',       value: `${bmr.toLocaleString()} kcal`, sub: 'Nghỉ ngơi hoàn toàn', icon: '💤', color: '#8b5cf6' },
            { label: 'Hoạt động', value: `+${(tdee - bmr).toLocaleString()} kcal`, sub: activity.label, icon: '🏃', color: '#06b6d4' },
            { label: 'Mục tiêu',  value: `${targetKcal.toLocaleString()} kcal`, sub: selectedGoal.label, icon: '🎯', color: selectedGoal.color },
            { label: 'Mỗi giờ',  value: `~${Math.round(tdee / 24)} kcal`, sub: 'Tiêu thụ trung bình', icon: '⏱️', color: '#22c55e' },
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
                <p className="text-[8px] text-muted/40 mt-1.5">Hover để xem chi tiết</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* ── Benefits section ── */}
      <RevealBlock delay={80}>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">Lợi Ích Khi Biết TDEE</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: '🎯', title: 'Ăn đúng theo mục tiêu', desc: 'Biết chính xác cần bao nhiêu kcal/ngày — không đoán mò khi muốn giảm mỡ, tăng cơ hay duy trì cân nặng.', color: '#8b5cf6' },
            { icon: '⚡', title: 'Tránh thiếu / thừa năng lượng', desc: 'Ăn đủ để giữ năng lượng và cơ bắp, tránh "crash" khi cắt calo quá mạnh hoặc tích mỡ khi ăn thừa.', color: '#f97316' },
            { icon: '📈', title: 'Điều chỉnh đúng điểm', desc: 'Không tiến bộ sau 2 tuần? Tăng/giảm chính xác 100–200 kcal thay vì thay đổi toàn bộ chế độ ăn.', color: '#22c55e' },
            { icon: '🔄', title: 'Cập nhật theo thể trạng', desc: 'TDEE thay đổi khi cân nặng thay đổi. Tính lại sau mỗi 4 tuần để duy trì hiệu quả liên tục.', color: '#06b6d4' },
          ].map(b => (
            <div key={b.icon} className="flex items-start gap-3 p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.01] hover:-translate-y-0.5" style={{ borderColor: `${b.color}20`, background: `${b.color}06` }}>
              <span className="text-xl shrink-0 mt-0.5">{b.icon}</span>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: b.color }}>{b.title}</p>
                <p className="text-[11px] text-muted leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* ── Accuracy note ── */}
      <RevealBlock delay={100}>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
          <span className="text-lg shrink-0 mt-0.5">⚠️</span>
          <div>
            <p className="text-xs font-bold text-amber-300 mb-1.5">Độ chính xác & Lưu ý</p>
            <p className="text-[11px] text-muted leading-relaxed">
              Công thức Mifflin-St Jeor có sai số <span className="text-text/80 font-semibold">±10–15%</span> vì không tính được tỷ lệ cơ/mỡ. Dùng TDEE như điểm khởi đầu — theo dõi cân nặng 1–2 tuần, nếu cân không đổi thì lượng bạn đang ăn chính là <span className="text-amber-300/90 font-semibold">TDEE thực tế</span> của bạn.
            </p>
          </div>
        </div>
      </RevealBlock>

      {/* Meal split rules */}
      <RevealBlock delay={130}>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">5 Nguyên Tắc Chia Bữa</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MEAL_SPLIT_RULES.map(r => (
            <div
              key={r.n}
              className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-4 hover:border-violet-500/30 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0" style={{ color: '#8b5cf6', background: '#8b5cf615', border: '1px solid #8b5cf630' }}>{r.n}</span>
                <p className="text-xs font-bold text-text">{r.title}</p>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </RevealBlock>
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
  const [activeDay, setActiveDay]       = useState(0);
  const [showShopping, setShowShopping] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const detail = selectedMetric ? b6MetricDetail(selectedMetric, s) : null;

  const day = SEVEN_DAY_PLAN[activeDay];

  return (
    <div className="space-y-8">
      <PersonalizedBar panelId="b6" color="#ec4899" source="B0 → B1 → B2 → B3 → B4 → B5"
        selectedKey={selectedMetric} onSelect={setSelectedMetric}
        items={[
        { key: 'training_day',      label: 'Ngày tập', value: `${s.trainingDayKcal.toLocaleString()} kcal`, note: `${s.trainingDays} ngày/tuần`, tip: `Ngày tập: TDEE + 100 kcal = ${s.trainingDayKcal.toLocaleString()} kcal.` },
        { key: 'rest_day',          label: 'Ngày nghỉ', value: `${s.restDayKcal.toLocaleString()} kcal`, note: `${s.restDays} ngày/tuần`, tip: `Ngày nghỉ: TDEE - 100 kcal = ${s.restDayKcal.toLocaleString()} kcal.` },
        { key: 'weekly_total',      label: 'Tổng tuần', value: `${s.weeklyKcalTotal.toLocaleString()}`, note: 'kcal/7 ngày', tip: `${s.trainingDayKcal} × ${s.trainingDays} + ${s.restDayKcal} × ${s.restDays} = ${s.weeklyKcalTotal.toLocaleString()} kcal/tuần.` },
        { key: 'weekly_protein_b6', label: 'Protein/ngày', value: `${s.proteinG}g`, note: 'cả tập & nghỉ', tip: `Duy trì ${s.proteinG}g protein cả ngày tập và ngày nghỉ.` },
      ]} />
      {detail && <MetricDetailCard detail={detail} color="#ec4899" onClose={() => setSelectedMetric(null)} />}
      {/* Day selector */}
      <div className="overflow-x-auto scrollbar-none -mx-1 px-1">
        <div className="flex gap-2 min-w-max">
          {SEVEN_DAY_PLAN.map((d, i) => (
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
              <span className="font-black">{d.day.replace('Ngày ', 'N')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active day content */}
      <div key={activeDay} className="animate-fade-in-up space-y-4">
        {/* Theme badge */}
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full border"
            style={{ color: day.color, background: `${day.color}12`, borderColor: `${day.color}35` }}
          >
            {day.day} — {day.theme}
          </span>
        </div>

        {/* Meals grid */}
        <div className="space-y-3">
          {day.meals.map((meal, i) => (
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
                    {meal.time}
                  </span>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-pink-300 bg-pink-500/8 border border-pink-500/20 px-2 py-0.5 rounded-lg">P {meal.protein}</span>
                    <span className="text-[10px] font-bold text-orange-400 bg-orange-500/8 border border-orange-500/20 px-2 py-0.5 rounded-lg">{meal.kcal} kcal</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {meal.items.map(item => (
                    <span key={item} className="text-[11px] text-text/80 bg-white/[0.04] border border-white/8 px-2 py-0.5 rounded-lg">{item}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 flex items-start gap-2">
          <span className="text-yellow-400 text-sm shrink-0">💡</span>
          <p className="text-[11px] text-muted leading-relaxed">{day.note}</p>
        </div>
      </div>

      {/* Shopping list */}
      <RevealBlock delay={80}>
        <button
          type="button"
          onClick={() => setShowShopping(s => !s)}
          className="w-full flex items-center justify-between px-5 py-3 rounded-2xl border border-pink-500/20 bg-pink-500/5 hover:border-pink-500/35 transition-all duration-200 cursor-pointer"
        >
          <span className="text-sm font-bold text-pink-300">Danh Sách Mua Sắm Tuần</span>
          <span className="text-muted text-lg transition-transform duration-200" style={{ transform: showShopping ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
        </button>
        {showShopping && (
          <div className="mt-3 grid sm:grid-cols-2 gap-3 animate-fade-in-up">
            {SHOPPING_GROUPS.map(g => (
              <div key={g.name} className="rounded-2xl border p-4" style={{ borderColor: `${g.color}25`, background: `${g.color}06` }}>
                <p className="text-xs font-bold mb-3" style={{ color: g.color }}>{g.name}</p>
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
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">Meal Prep Cuối Tuần — 6 Bước</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {MEAL_PREP_STEPS.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border p-4 flex items-start gap-3 hover:scale-[1.02] transition-all duration-200"
              style={{ borderColor: `${s.color}25`, background: `${s.color}06` }}
            >
              <span className="text-xl shrink-0">{s.icon}</span>
              <p className="text-[11px] text-muted leading-relaxed">{s.text}</p>
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

// ─── AdvancedPanel (B7) ──────────────────────────────────────────────────────
function AdvancedPanel({ s }) {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const detail = selectedMetric ? b7MetricDetail(selectedMetric, s) : null;

  return (
    <div className="space-y-10">
      <PersonalizedBar panelId="b7" color="#f59e0b" label="Macro Cá Nhân Hóa Theo Loại Buổi Tập" source="B0 → B1 → ... → B6 (Toàn Bộ)"
        selectedKey={selectedMetric} onSelect={setSelectedMetric}
        items={[
          { key: 'heavy_protein',    label: 'Protein nặng',    value: `${s.heavyDayProteinG}g`,   note: `${(s.heavyDayProteinG/s.weight).toFixed(1)}g/kg`,  tip: `Ngày tập nặng (squat, deadlift, bench): ${s.heavyDayProteinG}g = ${s.weight}kg × ${(s.heavyDayProteinG/s.weight).toFixed(1)}g/kg. Tăng 10–20% so với protein nền (${s.proteinG}g) để hỗ trợ phục hồi và tổng hợp cơ sau stress cao.` },
          { key: 'light_protein',    label: 'Protein nhẹ',     value: `${s.lightDayProteinG}g`,   note: `${(s.lightDayProteinG/s.weight).toFixed(1)}g/kg`,  tip: `Ngày tập nhẹ hoặc nghỉ: ${s.lightDayProteinG}g = ${s.weight}kg × ${(s.lightDayProteinG/s.weight).toFixed(1)}g/kg. Giảm nhẹ so với protein nền nhưng không nên xuống dưới 1.4g/kg để không mất cơ.` },
          { key: 'heavy_carb',       label: 'Carb ngày nặng',  value: `${s.heavyDayCarbG}g`,      note: '+40% vs nền',                                       tip: `Ngày tập nặng cần ${s.heavyDayCarbG}g carb (= ${s.carbG}g × 1.4). Tăng carb để nạp đủ glycogen cho buổi tập cường độ cao. Phân bổ: ~${s.preWorkoutCarbG}g trước tập, phần còn lại rải đều.` },
          { key: 'light_carb',       label: 'Carb ngày nhẹ',   value: `${s.lightDayCarbG}g`,      note: '-40% vs nền',                                       tip: `Ngày nghỉ hoặc tập nhẹ chỉ cần ${s.lightDayCarbG}g carb (= ${s.carbG}g × 0.6). Giảm carb ngày nghỉ giúp tổng calo tuần đúng mục tiêu mà vẫn có carb cao cho ngày tập quan trọng.` },
          { key: 'preworkout_carb',  label: 'Pre-workout carb', value: `${s.preWorkoutCarbG}g`,   note: '30–60 phút trước',                                  tip: `${s.preWorkoutCarbG}g carb ≈ 15% lượng carb ngày nặng (${s.heavyDayCarbG}g). Ăn 30–60 phút trước tập: chuối, bánh gạo, hoặc cơm nhỏ. Cung cấp glucose tức thì cho não và cơ, cải thiện hiệu suất 5–10%.` },
          { key: 'postworkout_protein', label: 'Post-workout P', value: `${s.postWorkoutProteinG}g`, note: 'trong 2h sau tập',                               tip: `${s.postWorkoutProteinG}g = ${s.weight}kg × 0.3g/kg. Trong 2 giờ sau tập, cửa sổ tổng hợp protein mở rộng nhất. Kết hợp với ${s.postWorkoutCarbG}g carb (${s.weight}kg × 0.5g/kg) để tối ưu phục hồi glycogen và tổng hợp cơ.` },
        ]} />
      {detail && <MetricDetailCard detail={detail} color="#f59e0b" onClose={() => setSelectedMetric(null)} />}
      {/* Training day types */}
      <div>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">Dinh Dưỡng Theo Loại Ngày Tập</p>
        <div className="grid md:grid-cols-2 gap-4">
          {TRAINING_DAY_TYPES.map(d => (
            <RevealBlock key={d.type}>
              <div
                className="rounded-2xl p-5 border hover:scale-[1.01] transition-all duration-200"
                style={{ borderColor: d.border, background: d.bg }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-black" style={{ color: d.color }}>{d.type}</span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ color: d.color, background: `${d.color}15`, border: `1px solid ${d.color}30` }}
                  >
                    {d.sub}
                  </span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed mb-4">{d.desc}</p>
                <div className="rounded-xl overflow-hidden border" style={{ borderColor: d.border }}>
                  {[
                    { k: 'Calo', v: d.kcal },
                    { k: 'Protein', v: d.protein },
                    { k: 'Carb', v: d.carb },
                    { k: 'Fat', v: d.fat },
                    { k: 'Nước', v: d.water },
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
      </div>

      {/* Timing schedule */}
      <RevealBlock delay={80}>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">Lịch Nạp Dinh Dưỡng Trong Ngày Tập Đôi</p>
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
                <p className="text-xs font-bold text-text mb-0.5">{t.label}</p>
                <p className="text-[11px] text-muted leading-relaxed">{t.foods}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Athlete principles */}
      <RevealBlock delay={120}>
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <MealsPanel key="meals" s={userStats} />,
    <TrackingPanel key="tracking" s={userStats} />,
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
          6 Trụ Cột
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
            <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">
              {tPillars('pillarB.title')}
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
              Ăn đủ — ăn đều — ăn thật —<br className="hidden md:block" /> ăn theo mục tiêu — sống được lâu dài
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-lime-500/50 to-transparent mb-4" />
            <p className="text-sm text-lime-400/80 font-medium">
              Ăn tốt hơn hôm qua một chút, và đủ dễ để ngày mai còn làm tiếp.
            </p>
          </div>

          {/* Key stats row */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                n: '3', unit: 'bữa/ngày', label: 'Nhịp ăn tối ưu',
                tooltip: '3 bữa chính/ngày giúp ổn định đường huyết và giảm thèm ăn vặt hiệu quả hơn so với nhịn hoặc ăn nhiều bữa không kiểm soát.',
              },
              {
                n: '80/20', unit: '', label: 'Quy tắc bền vững',
                tooltip: '80% ăn lành mạnh + 20% linh hoạt — tỷ lệ thực tế nhất để duy trì lâu dài mà không cảm thấy bị tước đoạt.',
              },
              {
                n: '21+', unit: 'ngày', label: 'Hình thành thói quen',
                tooltip: 'Não bộ cần 21–66 ngày lặp lại để hình thành thói quen tự động. Kiên trì qua tuần 2–3 là giai đoạn khó và quyết định nhất.',
              },
              {
                n: '1.6g', unit: '/kg', label: 'Protein tối thiểu',
                tooltip: '1.6g protein/kg thể trọng bảo vệ cơ bắp khi giảm mỡ. Tăng lên 2.2g/kg nếu tập luyện cường độ cao.',
              },
            ].map((s, i) => (
              <div
                key={i}
                className="group/stat relative bg-bg/50 backdrop-blur-sm rounded-xl p-3.5 border border-lime-500/10 hover:border-lime-500/35 transition-all duration-300 animate-fade-in-up cursor-default"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
              >
                {/* ── Thought-bubble tooltip ── */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none opacity-0 group-hover/stat:opacity-100 scale-90 group-hover/stat:scale-100 -translate-y-1 group-hover/stat:translate-y-0 transition-all duration-200 origin-bottom">
                  <ThoughtBubble text={s.tooltip} idx={i} />
                </div>

                <div className="font-black text-xl leading-none mb-0.5" style={{ color: LIME }}>
                  {s.n}<span className="text-xs font-bold opacity-60 ml-0.5">{s.unit}</span>
                </div>
                <div className="text-[10px] text-muted">{s.label}</div>
              </div>
            ))}
          </div>
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
              <p className="text-[9px] font-bold uppercase tracking-[0.35em] leading-none mb-1.5" style={{ color: 'rgba(132,204,22,0.55)' }}>nguyên tắc</p>
              <p className="text-2xl font-black text-text uppercase tracking-[0.1em] leading-none">Cốt Lõi</p>
            </div>
          </div>
          <div className="h-[2px] w-28 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #84cc16, transparent)' }} />
        </div>

        {/* ── Mantra cards (3 col) ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MANTRAS.map((m, i) => (
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
                <span className="text-[9px] font-black" style={{ color: `${LIME}70` }}>TINH THẦN</span>
                <span className="text-xl w-9 h-9 flex items-center justify-center rounded-xl border bg-lime-500/10 border-lime-500/25">✨</span>
              </div>
              <p className="text-xs font-bold text-lime-300 leading-relaxed mb-3">
                Đều quan trọng hơn hoàn hảo. Kỷ luật là biết quay lại đúng đường sau khi lệch một chút.
              </p>
              <p className="text-[11px] leading-relaxed flex-1" style={{ color: `${LIME}70` }}>
                Bạn không thất bại vì một bữa lệch — bạn thất bại vì bỏ cuộc sau đó. Sự nhất quán mới là siêu năng lực thực sự.
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
                <p className="text-[9px] font-bold uppercase tracking-[0.35em] leading-none mb-1.5" style={{ color: 'rgba(132,204,22,0.55)' }}>chuyên mục</p>
                <p className="text-2xl font-black text-text uppercase tracking-[0.1em] leading-none">Dinh Dưỡng</p>
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
                        <span className="hidden sm:inline opacity-75">— {t.label}</span>
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
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] whitespace-nowrap">Bắt đầu từ cấp độ nào?</p>
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
                  {tier.sub}
                </div>

                <h3 className={`text-base font-black mb-4 ${tier.text}`}>{tier.level}</h3>

                <ul className="space-y-2.5">
                  {tier.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-2 text-[11px] text-muted group-hover:text-muted/90 transition-colors">
                      <span className="shrink-0 mt-0.5 font-bold" style={{ color: tier.color }}>✓</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

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
              <p className="text-sm font-bold text-lime-400">An toàn trước</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted leading-relaxed">
                <span className="text-lime-300 font-semibold">An toàn trước, hiệu quả sau, bền vững là mục tiêu cuối cùng.</span>{' '}
                Thông tin trên mang tính giáo dục chung, không thay thế tư vấn chuyên môn. Nếu có bệnh lý nền (tiểu đường, thận, tim mạch, rối loạn ăn uống), hãy tham khảo bác sĩ hoặc chuyên gia dinh dưỡng trước khi thay đổi chế độ ăn.
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
              <h3 className="font-black text-text text-base mb-1">Lộ Trình 12 Tuần</h3>
              <p className="text-muted text-xs leading-relaxed mb-4">Kết hợp dinh dưỡng + vận động theo kế hoạch có cấu trúc rõ ràng từng giai đoạn.</p>
              <span className="inline-flex items-center gap-1.5 text-lime-400 text-xs font-bold group-hover:gap-2.5 transition-all">
                Xem lộ trình
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
              <h3 className="font-black text-text text-base mb-1">6 Trụ Cột Sức Khỏe</h3>
              <p className="text-muted text-xs leading-relaxed mb-4">Dinh dưỡng chỉ là 1 trong 6 trụ cột. Khám phá vận động, phục hồi, giấc ngủ và cả tinh thần.</p>
              <span className="inline-flex items-center gap-1.5 text-teal-400 text-xs font-bold group-hover:gap-2.5 transition-all">
                Xem tất cả trụ cột
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
