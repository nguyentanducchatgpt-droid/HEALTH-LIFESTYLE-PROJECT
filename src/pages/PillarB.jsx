import { useState, useEffect, useRef, useCallback } from 'react';
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
    day: 'Ngày 1',
    meals: [
      {
        time: 'Sáng',
        items: ['Cơm trắng', 'Trứng luộc ×2', 'Rau muống luộc', 'Nước lọc'],
        note: 'Bận: bánh mì nguyên cám + trứng luộc',
        protein: '~20g',
        kcal: '~380',
      },
      {
        time: 'Trưa',
        items: ['Cơm trắng', 'Cá kho tiêu', 'Rau cải xào tỏi', 'Canh rau'],
        note: 'Bận: cơm văn phòng chọn đĩa có cá/thịt + rau',
        protein: '~30g',
        kcal: '~520',
      },
      {
        time: 'Tối',
        items: ['Cháo yến mạch', 'Sữa chua không đường', 'Chuối 1 quả'],
        note: 'Bận: yến mạch instant + protein shake',
        protein: '~18g',
        kcal: '~340',
      },
    ],
  },
  {
    day: 'Ngày 2',
    meals: [
      {
        time: 'Sáng',
        items: ['Bánh mì nguyên cám', 'Trứng ốp la', 'Cà chua + dưa leo', 'Sữa tươi không đường'],
        note: 'Bận: sandwich trứng mua ngoài',
        protein: '~22g',
        kcal: '~420',
      },
      {
        time: 'Trưa',
        items: ['Cơm trắng', 'Gà luộc sả', 'Canh bí đỏ', 'Rau sống'],
        note: 'Bận: cơm gà luộc — bỏ nước chấm nhiều muối',
        protein: '~35g',
        kcal: '~500',
      },
      {
        time: 'Tối',
        items: ['Bún tươi', 'Đậu hũ chiên sả', 'Rau thơm + giá', 'Soup miso nhẹ'],
        note: 'Bận: bún đậu mua ngoài, ít bún thêm rau',
        protein: '~20g',
        kcal: '~360',
      },
    ],
  },
  {
    day: 'Ngày 3',
    meals: [
      {
        time: 'Sáng',
        items: ['Yến mạch rolled oats', 'Chuối 1 quả', 'Sữa hạt', 'Hạt chia 1 thìa'],
        note: 'Bận: overnight oats chuẩn bị tối hôm trước',
        protein: '~12g',
        kcal: '~350',
      },
      {
        time: 'Trưa',
        items: ['Cơm gạo lứt', 'Cá hấp gừng', 'Rau luộc chấm muối mè', 'Canh chua'],
        note: 'Bận: cơm phần có cá, thêm canh là đủ',
        protein: '~32g',
        kcal: '~490',
      },
      {
        time: 'Tối',
        items: ['Cơm trắng nhỏ', 'Trứng chiên tỏi', 'Canh rau ngót thịt', 'Dưa leo'],
        note: 'Bận: cơm trứng đơn giản, thêm 1 bát canh',
        protein: '~22g',
        kcal: '~380',
      },
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

// ─── Macro Bar (animates on mount) ───────────────────────────────────────────

function MacroBar({ macro, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const [ref, visible] = useScrollReveal(0.2);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setWidth(macro.pct), delay + 80);
    return () => clearTimeout(t);
  }, [visible, macro.pct, delay]);

  return (
    <div
      ref={ref}
      className={`rounded-2xl border ${macro.border} ${macro.cardBg} p-5 transition-all duration-300 hover:scale-[1.02] cursor-default`}
      style={{ boxShadow: visible ? `0 4px 20px ${macro.color}08` : 'none', transition: 'box-shadow 0.4s' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${macro.text} ${macro.border}`}
            style={{ background: `${macro.color}10` }}
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

// ─── Tab Panels ──────────────────────────────────────────────────────────────

function FoundationPanel() {
  return (
    <div className="space-y-8">
      {/* TDEE */}
      <RevealBlock>
        <div className="rounded-2xl border border-border/40 bg-surface/15 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-lime-500/10 border border-lime-500/25 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-text">TDEE — Nhu Cầu Calo Hàng Ngày</h3>
              <p className="text-[10px] text-muted">Total Daily Energy Expenditure — nền tảng của mọi kế hoạch ăn</p>
            </div>
          </div>

          <p className="text-xs text-muted leading-relaxed mb-5">
            TDEE là tổng năng lượng cơ thể đốt mỗi ngày. Ăn bằng TDEE = giữ cân. Ăn ít hơn = giảm mỡ. Ăn nhiều hơn = tăng cân. Không có công thức nào đúng cho tất cả — nhưng đây là điểm xuất phát.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {TDEE_MODES.map(m => (
              <div key={m.label} className={`rounded-xl border ${m.border} ${m.bg} p-4 text-center`}>
                <div className="text-2xl font-black mb-1" style={{ color: m.color }}>{m.arrow}</div>
                <p className={`text-xs font-bold ${m.text} mb-1`}>{m.label}</p>
                <p className="text-[10px] font-semibold text-text/80 mb-2">{m.delta}</p>
                <p className="text-[10px] text-muted leading-tight">{m.note}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* Macro grid */}
      <RevealBlock delay={80}>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">5 Nhóm Dinh Dưỡng Cốt Lõi</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MACROS.map((m, i) => (
            <MacroBar key={m.name} macro={m} delay={i * 120} />
          ))}
        </div>
      </RevealBlock>
    </div>
  );
}

function PlatePanel() {
  const [ref, visible] = useScrollReveal(0.15);

  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-8 items-start">
      {/* Left: diagram */}
      <div>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-5">Phương Pháp Đĩa Ăn</p>
        <PlateDiagram animate={visible} />
      </div>

      {/* Right: tips */}
      <div className="space-y-4">
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-5">Áp Dụng Thực Tế</p>

        <div className="rounded-2xl border border-lime-500/20 bg-lime-500/5 p-5">
          <p className="text-xs font-bold text-lime-400 mb-3">Tại nhà</p>
          <ul className="space-y-2">
            {[
              'Dùng đĩa 23–26cm làm chuẩn',
              'Bắt đầu bằng rau trước khi thêm carb',
              'Đạm = lòng bàn tay của bạn',
              'Cơm = nắm tay của bạn',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                <span className="text-lime-400 font-bold shrink-0">✓</span>{t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
          <p className="text-xs font-bold text-orange-400 mb-3">Ăn ngoài hàng</p>
          <ul className="space-y-2">
            {[
              'Chọn phần có cả đạm + rau + carb',
              'Gọi thêm rau hoặc salad riêng',
              'Tránh nước chấm nhiều muối/đường',
              'Bún/phở: ít bún, nhiều rau, thêm trứng',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                <span className="text-orange-400 font-bold shrink-0">✓</span>{t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
          <p className="text-xs font-bold text-cyan-400 mb-3">Meal Prep bận rộn</p>
          <ul className="space-y-2">
            {[
              'Chuẩn bị đạm cho cả tuần (gà, trứng, đậu hũ)',
              'Nấu lượng cơm 2–3 ngày một lần',
              'Rau luộc sẵn, bảo quản tủ lạnh 3 ngày',
              'Yến mạch overnight cho sáng bận rộn',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                <span className="text-cyan-400 font-bold shrink-0">✓</span>{t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function GoalsPanel() {
  const [activeGoal, setActiveGoal] = useState('fat-loss');

  return (
    <div>
      <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-5">Chọn Mục Tiêu Của Bạn</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {GOALS.map(g => (
          <GoalCard
            key={g.id}
            goal={g}
            active={activeGoal === g.id}
            onClick={() => setActiveGoal(g.id)}
          />
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-white/6 bg-white/[0.015] p-4">
        <p className="text-[11px] text-muted leading-relaxed">
          <span className="text-lime-400 font-bold">Lưu ý:</span> Các con số là điểm xuất phát, không phải quy tắc cứng nhắc. Cơ thể của mỗi người phản ứng khác nhau — theo dõi 2–4 tuần rồi điều chỉnh là cách tốt nhất.
        </p>
      </div>
    </div>
  );
}

function MealsPanel() {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div>
      <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">Thực Đơn Mẫu 3 Ngày — Người Mới</p>

      {/* Day selector */}
      <div className="flex gap-2 mb-6">
        {MEAL_DAYS.map((d, i) => (
          <button
            key={d.day}
            type="button"
            onClick={() => setActiveDay(i)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer
              ${activeDay === i
                ? 'bg-lime-500/15 border-lime-500/40 text-lime-400'
                : 'border-border/40 text-muted hover:border-border/70 hover:text-text/80'
              }`}
          >
            {d.day}
          </button>
        ))}
      </div>

      {/* Meals for active day */}
      <div key={activeDay} className="space-y-4 animate-fade-in-up">
        {MEAL_DAYS[activeDay].meals.map((meal, i) => (
          <div
            key={meal.time}
            className="rounded-2xl border border-border/40 bg-surface/15 overflow-hidden"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
          >
            <div className="h-[1.5px]" style={{
              background: i === 0
                ? 'linear-gradient(90deg, #f97316aa, transparent)'
                : i === 1
                  ? 'linear-gradient(90deg, #84cc16aa, transparent)'
                  : 'linear-gradient(90deg, #06b6d4aa, transparent)',
            }} />
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    i === 0
                      ? 'text-orange-400 bg-orange-500/10 border-orange-500/25'
                      : i === 1
                        ? 'text-lime-400 bg-lime-500/10 border-lime-500/25'
                        : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25'
                  }`}>
                    {meal.time}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[10px] text-lime-400 font-bold bg-lime-500/8 border border-lime-500/20 px-2 py-0.5 rounded-lg">
                    P {meal.protein}
                  </span>
                  <span className="text-[10px] text-orange-400 font-bold bg-orange-500/8 border border-orange-500/20 px-2 py-0.5 rounded-lg">
                    {meal.kcal} kcal
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {meal.items.map(item => (
                  <span
                    key={item}
                    className="text-[11px] text-text/80 bg-white/[0.04] border border-white/8 px-2.5 py-1 rounded-lg"
                  >
                    {item}
                  </span>
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
      <div className="mt-5 rounded-2xl border border-lime-500/20 bg-lime-500/5 p-4 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
          <span className="text-xs font-bold text-lime-400">Tổng ngày</span>
        </div>
        {[
          { k: 'Kcal', v: '~1.240' },
          { k: 'Protein', v: '~70g' },
          { k: 'Meals', v: '3 bữa' },
        ].map(item => (
          <div key={item.k} className="text-center">
            <span className="text-[10px] text-muted">{item.k}: </span>
            <span className="text-[11px] font-bold text-text">{item.v}</span>
          </div>
        ))}
        <p className="text-[10px] text-muted ml-auto">Thêm 1–2 bữa phụ nếu hoạt động nhiều</p>
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

function TrackingPanel() {
  const [activeSection, setActiveSection] = useState(0);
  const [checked, setChecked] = useState({});

  const toggle = useCallback((i) => {
    setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  }, []);

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="space-y-5">
      {/* Section heading */}
      <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">5 Chủ Đề Theo Dõi</p>

      {/* 3 tab cards */}
      <div className="grid grid-cols-3 gap-3">
        {TRACKING_SECTIONS.map((s, i) => (
          <TrackingTabCard
            key={s.id}
            section={s}
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


const CALC_TOOLTIPS = [
  'BMR (Basal Metabolic Rate) — lượng calo cơ thể cần để duy trì chức năng sống cơ bản khi nằm yên hoàn toàn: tim đập, hô hấp, nhiệt độ cơ thể, não hoạt động. Chiếm 60–75% tổng TDEE, phụ thuộc vào cân nặng, chiều cao, tuổi và giới tính.',
  'Năng lượng tiêu thụ thêm từ hoạt động thể chất mỗi ngày — bao gồm cả tập luyện lẫn đi lại, làm việc, sinh hoạt. Được tính bằng cách nhân BMR với hệ số hoạt động tương ứng (1.2 → 1.9).',
  'Lượng calo nên nạp mỗi ngày để đạt mục tiêu đã chọn. Giảm mỡ = TDEE trừ 300–500 kcal (thâm hụt). Duy trì = ±100 kcal so với TDEE. Tăng cơ = TDEE cộng 150–300 kcal (thặng dư). Điều chỉnh từng bước 100–200 kcal nếu không có tiến bộ sau 2 tuần.',
  'Trung bình mỗi giờ cơ thể đốt bao nhiêu calo. Con số này giúp bạn ước tính: ngủ 8 tiếng tiêu ~1/3 TDEE, ngồi làm việc tiêu ít hơn TDEE/24, tập 1 tiếng tăng đáng kể. Hữu ích để lên kế hoạch bữa ăn trước/sau tập.',
];

// ─── CalcPanel (B0) — Interactive TDEE calculator ───────────────────────────
function CalcPanel() {
  const [weight, setWeight]       = useState(70);
  const [height, setHeight]       = useState(170);
  const [age, setAge]             = useState(30);
  const [sex, setSex]             = useState('male');
  const [activityKey, setActivityKey] = useState('moderate');
  const [goalKey, setGoalKey]     = useState('recomp');

  const activity = ACTIVITY_LEVELS.find(a => a.key === activityKey) || ACTIVITY_LEVELS[2];
  const bmr = Math.round(sex === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161);
  const tdee = Math.round(bmr * activity.mult);
  const selectedGoal = GOAL_MODIFIERS.find(g => g.key === goalKey) || GOAL_MODIFIERS[1];
  const targetKcal = tdee + selectedGoal.delta;

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
              ].map(c => (
                <div key={c.label} className="rounded-xl p-3 text-center" style={{ background: `${c.color}0c`, border: `1px solid ${c.color}25` }}>
                  <span className="text-base">{c.icon}</span>
                  <p className="text-xs font-black mt-1" style={{ color: c.color }}>{c.label}</p>
                  <p className="text-[9px] text-muted leading-snug mt-0.5">{c.sub}</p>
                  <p className="text-[9px] font-bold mt-1" style={{ color: `${c.color}cc` }}>{c.pct}</p>
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

// ─── SevenDayPanel (B6) ──────────────────────────────────────────────────────
function SevenDayPanel() {
  const [activeDay, setActiveDay]       = useState(0);
  const [showShopping, setShowShopping] = useState(false);

  const day = SEVEN_DAY_PLAN[activeDay];

  return (
    <div className="space-y-8">
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

// ─── AdvancedPanel (B7) ──────────────────────────────────────────────────────
function AdvancedPanel() {
  return (
    <div className="space-y-10">
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

  const PANELS = [
    <CalcPanel key="calc" />,
    <FoundationPanel key="foundation" />,
    <PlatePanel key="plate" />,
    <GoalsPanel key="goals" />,
    <MealsPanel key="meals" />,
    <TrackingPanel key="tracking" />,
    <SevenDayPanel key="sevenday" />,
    <AdvancedPanel key="advanced" />,
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
        <div className="flex items-center gap-3 mb-7">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] whitespace-nowrap">7 Nguyên Tắc Cốt Lõi</p>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
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
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] whitespace-nowrap">8 chủ đề dinh dưỡng</p>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
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
