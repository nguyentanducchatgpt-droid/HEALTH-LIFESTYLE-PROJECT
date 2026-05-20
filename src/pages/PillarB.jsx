import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

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
    id: 'foundation',
    label: 'Nền Tảng',
    short: 'B1',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    id: 'plate',
    label: 'Đĩa Ăn',
    short: 'B2',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M2 12h20"/>
      </svg>
    ),
  },
  {
    id: 'goals',
    label: 'Mục Tiêu',
    short: 'B3',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
  },
  {
    id: 'meals',
    label: 'Thực Đơn',
    short: 'B4',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/>
      </svg>
    ),
  },
  {
    id: 'tracking',
    label: 'Theo Dõi',
    short: 'B5',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
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

function TrackingPanel() {
  const [checked, setChecked] = useState({});

  const toggle = useCallback((i) => {
    setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  }, []);

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Daily checklist */}
      <div>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">Checklist Hàng Ngày</p>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between text-[10px] mb-1.5">
            <span className="text-muted">Hoàn thành hôm nay</span>
            <span className="text-lime-400 font-bold">{checkedCount}/{TRACKING_DAILY.length}</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-lime-500 rounded-full transition-all duration-500"
              style={{ width: `${(checkedCount / TRACKING_DAILY.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {TRACKING_DAILY.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer
                ${checked[i]
                  ? 'border-lime-500/30 bg-lime-500/8'
                  : 'border-border/40 bg-surface/15 hover:border-border/70'
                }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                  checked[i] ? 'border-lime-400 bg-lime-500' : 'border-border/60'
                }`}
              >
                {checked[i] && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <span className={`text-[11px] transition-colors ${checked[i] ? 'text-lime-300 line-through opacity-70' : 'text-muted'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Weekly & adjustments */}
      <div className="space-y-5">
        <div>
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">Theo Dõi Hàng Tuần</p>
          <div className="space-y-2.5">
            {TRACKING_WEEKLY.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-surface/10"
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-[11px] text-muted">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
          <p className="text-xs font-bold text-orange-400 mb-3">Nếu sau 2–4 tuần không tiến bộ</p>
          <ul className="space-y-2">
            {[
              'Kiểm tra lại TDEE — cân nặng thay đổi?',
              'Protein đủ chưa? Tăng lên 2g/kg thử',
              'Ngủ đủ giấc chưa? (7–9h mỗi đêm)',
              'Tập luyện đang tăng tải dần chưa?',
              'Stress cao không? Cortisol cản giảm mỡ',
              'Kiên nhẫn: thay đổi thấy rõ cần 4–8 tuần',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                <span className="text-orange-400 font-bold shrink-0 mt-0.5">{i + 1}.</span>{t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Thought-bubble tooltip (SVG cloud — bumps on all 4 sides) ───────────────
//
// ViewBox 0 0 240 162. Clockwise from bottom-left:
//   bottom bumps (3) → right side bump → top bumps (4) → left side bump → close
const CLOUD = `
  M 32,132
  C 26,144 44,158 62,150
  C 72,158 90,158 104,150
  C 118,158 136,158 150,150
  C 162,156 178,144 186,130
  C 198,126 218,112 216,90
  C 218,72 206,54 192,50
  C 186,34 170,20 152,26
  C 144,10 128,2 110,10
  C 100,2 86,2 76,10
  C 64,4 48,10 40,24
  C 24,28 8,44 10,64
  C 4,78 4,96 16,110
  C 20,122 28,130 32,132
  Z
`;

function ThoughtBubble({ text, idx }) {
  const fid = `tbf${idx}`;
  const kid = `tba${idx}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 242 }}>
      <svg viewBox="0 0 240 162" width="242" height="163" style={{ overflow: 'visible' }}>
        <defs>
          <filter id={fid} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <style>{`
            @keyframes ${kid} { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -820; } }
          `}</style>
        </defs>

        {/* Cloud fill + subtle base border */}
        <path d={CLOUD} fill="rgba(5,5,5,0.97)" stroke="rgba(132,204,22,0.15)" strokeWidth="1.5" />

        {/* Animated spark running around all 4 sides */}
        <path d={CLOUD} fill="none"
          stroke={LIME} strokeWidth="2.8" strokeLinecap="round"
          strokeDasharray="30 790"
          filter={`url(#${fid})`}
          style={{ animation: `${kid} 2.6s linear infinite` }}
        />

        {/* Text — lime-tinted bright for visibility */}
        <foreignObject x="30" y="26" width="180" height="108">
          <div xmlns="http://www.w3.org/1999/xhtml"
            style={{
              fontSize: '9.5px',
              color: '#c8f59a',
              lineHeight: '1.65',
              textAlign: 'center',
              padding: '0 6px',
              fontWeight: 500,
            }}>
            {text}
          </div>
        </foreignObject>
      </svg>

      {/* Thought dots — descending from cloud bottom-center */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', marginTop: '2px' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(5,5,5,0.97)', border: '1.5px solid rgba(132,204,22,0.35)' }} />
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(5,5,5,0.97)', border: '1px solid rgba(132,204,22,0.25)', marginBottom: 3 }} />
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(5,5,5,0.97)', border: '1px solid rgba(132,204,22,0.18)', marginBottom: 7 }} />
      </div>
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
          transparent 0deg,
          transparent 55deg,
          rgba(132,204,22,0.0) 65deg,
          rgba(132,204,22,0.7) 85deg,
          rgba(255,255,255,0.95) 92deg,
          rgba(132,204,22,0.7) 99deg,
          rgba(34,197,94,0.0) 115deg,
          transparent 125deg,
          transparent 360deg
        );
        animation: orbitSpin 3.5s linear infinite;
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

  const PANELS = [
    <FoundationPanel key="foundation" />,
    <PlatePanel key="plate" />,
    <GoalsPanel key="goals" />,
    <MealsPanel key="meals" />,
    <TrackingPanel key="tracking" />,
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
            <div
              key={m.n}
              className="group relative flex flex-col rounded-2xl border border-border/40 bg-surface/15 hover:border-lime-500/30 transition-all duration-300 animate-fade-in-up overflow-hidden cursor-default"
              style={{ animationDelay: `${i * 70}ms`, animationFillMode: 'both' }}
            >
              {/* Top accent bar slides in on hover */}
              <div
                className="h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out shrink-0"
                style={{ background: `linear-gradient(90deg, ${LIME}dd, ${LIME}20)` }}
              />

              <div className="p-5 flex flex-col flex-1">
                {/* Number + icon */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-black text-muted/40 group-hover:text-lime-400/50 transition-colors duration-200">{m.n}</span>
                  <span
                    className="text-xl w-9 h-9 flex items-center justify-center rounded-xl border border-border/50 bg-surface/50 group-hover:border-lime-500/25 group-hover:bg-lime-500/8 transition-all duration-300"
                  >{m.icon}</span>
                </div>

                {/* Title */}
                <p className="text-sm font-bold text-text leading-snug mb-1 group-hover:text-lime-300 transition-colors duration-200">{m.text}</p>
                {/* Sub */}
                <p className="text-[11px] text-muted/70 leading-relaxed mb-3">{m.sub}</p>
                {/* Description */}
                <p className="text-[11px] text-muted/55 leading-relaxed flex-1 group-hover:text-muted/80 transition-colors duration-300">{m.desc}</p>

                {/* Tips — slide down on hover */}
                <div className="max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-400 ease-in-out">
                  <div className="border-t border-border/40 mt-3 pt-3 space-y-1.5">
                    {m.tips.map((tip, j) => (
                      <div key={j} className="flex items-start gap-1.5">
                        <span className="text-[10px] font-bold mt-0.5 shrink-0" style={{ color: LIME }}>✓</span>
                        <span className="text-[10px] text-muted/70 leading-relaxed">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom ambient glow */}
              <div
                className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(to top, ${LIME}08, transparent)` }}
              />
            </div>
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
          TAB SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <div id="tabs" className="scroll-mt-4 mb-16">
        <RevealBlock>
          {/* Section header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] whitespace-nowrap">5 chủ đề dinh dưỡng</p>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Tab bar */}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-5">
            <div ref={tabBarRef} className="flex gap-2 min-w-max md:min-w-0 md:flex-wrap">
              {TABS.map((t, i) => {
                const isActive = activeTab === i;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => switchTab(i)}
                    className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-250 focus:outline-none cursor-pointer whitespace-nowrap
                      ${isActive
                        ? 'border-lime-500/40 bg-lime-500/10 text-lime-400'
                        : 'border-border/40 bg-surface/20 text-muted hover:border-border/70 hover:text-text/80 hover:bg-surface/35'
                      }`}
                    style={isActive ? { boxShadow: `0 2px 16px ${LIME_GLOW}` } : undefined}
                  >
                    <span className={`transition-colors ${isActive ? 'text-lime-400' : 'text-muted/60 group-hover:text-muted'}`}>
                      {t.icon}
                    </span>
                    {t.short}
                    <span className="hidden sm:inline">— {t.label}</span>
                    {isActive && (
                      <span className="w-1 h-1 rounded-full bg-lime-400 animate-pulse" />
                    )}
                    <div
                      className="absolute bottom-0 left-3 right-3 h-[1.5px] rounded-full transition-all duration-300"
                      style={{ background: isActive ? LIME : 'transparent' }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab panel */}
          <div
            key={tabKey}
            className="relative rounded-3xl border border-lime-500/12 overflow-hidden animate-fade-in-up"
            style={{ background: `${LIME}03` }}
          >
            {/* Top accent line */}
            <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${LIME}cc, ${LIME}30, transparent)` }} />

            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[120px] pointer-events-none" style={{ background: LIME_GLOW }} />

            <div className="relative z-10 p-6 md:p-8">
              {PANELS[activeTab]}
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
