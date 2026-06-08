import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';

// ─── Theme constants ───────────────────────────────────────────────────────────
const LIME = '#84cc16';
const GREEN = '#22c55e';
const LS_INPUTS = 'healthapp_b0_inputs';

// ─── Orbit ring CSS injection ──────────────────────────────────────────────────
function useOrbitRing() {
  useEffect(() => {
    const el = document.getElementById('pm-orbit-kf');
    if (el) return;
    const style = document.createElement('style');
    style.id = 'pm-orbit-kf';
    style.textContent = `
      @property --pm-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes pmOrbitSpin { to { --pm-orbit-angle: 360deg; } }
      .pm-orbit-ring {
        background: conic-gradient(
          from var(--pm-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(132,204,22,0.0) 65deg, rgba(132,204,22,0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(132,204,22,0.75) 99deg,
          rgba(132,204,22,0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: pmOrbitSpin 3.5s linear infinite;
      }
      @keyframes pmFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pmBarGrow { from { width: 0%; } to { width: var(--bar-w); } }
      @keyframes pmSliceGrow { from { stroke-dashoffset: var(--total); } to { stroke-dashoffset: var(--offset); } }
      @keyframes pmFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    `;
    document.head.appendChild(style);
  }, []);
}

// ─── RevealBlock ───────────────────────────────────────────────────────────────
function RevealBlock({ children, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

// ─── computeStats ─────────────────────────────────────────────────────────────
function computeStats(inp) {
  const w = Number(inp.w) || 65, h = Number(inp.h) || 170, a = Number(inp.a) || 1.55;
  const sx = inp.sx || 'male';
  const bmi = w / ((h / 100) ** 2);
  const bmr = sx === 'female'
    ? 10 * w + 6.25 * h - 5 * (inp.age || 30) - 161
    : 10 * w + 6.25 * h - 5 * (inp.age || 30) + 5;
  const tdee = bmr * a;
  const goal = inp.goal || 'recomp';
  const targetKcal = goal === 'loss' ? tdee - 400 : goal === 'gain' ? tdee + 250 : tdee;
  const proteinG = w * 1.8;
  const fatG = targetKcal * 0.28 / 9;
  const carbG = (targetKcal - proteinG * 4 - fatG * 9) / 4;
  const waterMl = w * 35;
  const fiberG = 30;
  const perMealProtein = proteinG / 4;
  const heavy = targetKcal * 1.07;
  const moderate = targetKcal * 1.0;
  const light = targetKcal * 0.95;
  const rest = targetKcal * 0.90;
  return {
    w, h, a, sx, bmi: bmi.toFixed(1), bmr: Math.round(bmr), tdee: Math.round(tdee),
    targetKcal: Math.round(targetKcal), proteinG: Math.round(proteinG),
    fatG: Math.round(fatG), carbG: Math.round(carbG),
    waterMl: Math.round(waterMl), fiberG, perMealProtein: Math.round(perMealProtein),
    heavy: Math.round(heavy), moderate: Math.round(moderate),
    light: Math.round(light), rest: Math.round(rest),
    goal,
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────
const MEAL_MODELS = [
  {
    id: 3, name: '3 Bữa/Ngày', icon: '🍽️', color: '#06b6d4',
    best: 'Người bận, nhịp sống đơn giản, mới bắt đầu',
    meals: [
      { name: 'Sáng', pct: 30 },
      { name: 'Trưa', pct: 40 },
      { name: 'Tối', pct: 30 },
    ],
  },
  {
    id: 4, name: '4 Bữa/Ngày', icon: '🥗', color: LIME,
    best: 'Đa số người — 3 bữa chính + 1 snack (xương sống)',
    tag: 'Khuyến Nghị',
    meals: [
      { name: 'Sáng', pct: 25 },
      { name: 'Trưa', pct: 35 },
      { name: 'Snack', pct: 10 },
      { name: 'Tối', pct: 30 },
    ],
  },
  {
    id: 5, name: '5 Bữa/Ngày', icon: '⚡', color: GREEN,
    best: 'Tập nặng, cần nạp protein thường xuyên',
    meals: [
      { name: 'Sáng', pct: 25 },
      { name: 'Snack S', pct: 10 },
      { name: 'Trưa', pct: 30 },
      { name: 'Snack C', pct: 10 },
      { name: 'Tối', pct: 25 },
    ],
  },
  {
    id: 6, name: '6 Bữa/Ngày', icon: '🏃', color: '#f59e0b',
    best: 'Sức bền cao, marathon, ironman',
    meals: [
      { name: 'Sáng', pct: 20 },
      { name: 'Snack S', pct: 10 },
      { name: 'Trưa', pct: 25 },
      { name: 'Pre-W', pct: 10 },
      { name: 'Tối', pct: 25 },
      { name: 'Post-W', pct: 10 },
    ],
  },
];

const CARB_DAYS = [
  { key: 'heavy', label: 'Ngày Nặng', emoji: '🏋️', color: GREEN, carbMult: 1.4, kcalMult: 1.07, note: 'Tập nặng — carb cao nhất' },
  { key: 'moderate', label: 'Ngày Vừa', emoji: '🚴', color: '#06b6d4', carbMult: 1.0, kcalMult: 1.0, note: 'Tập vừa — mức cơ sở' },
  { key: 'light', label: 'Ngày Nhẹ', emoji: '🚶', color: '#f59e0b', carbMult: 0.85, kcalMult: 0.95, note: 'Tập nhẹ — giảm nhẹ' },
  { key: 'rest', label: 'Ngày Nghỉ', emoji: '😴', color: '#a855f7', carbMult: 0.7, kcalMult: 0.90, note: 'Nghỉ hoàn toàn — carb thấp nhất' },
];

const TRAINING_TIMES = [
  {
    id: 'morning', label: 'Sáng Sớm', emoji: '🌅', time: '6:00–8:00',
    color: '#f59e0b',
    steps: [
      { time: '5:30–6:00', meal: 'Snack nhẹ trước tập', detail: 'Chuối + 1 trứng / 1 muỗng bơ đậu phộng', type: 'pre' },
      { time: '6:00–8:00', meal: 'TẬP LUYỆN', detail: '', type: 'workout' },
      { time: '8:00–9:00', meal: 'Bữa sáng chính (lớn)', detail: 'Đầy đủ protein + carb + rau — bữa lớn nhất sáng', type: 'post' },
      { time: '12:00–13:00', meal: 'Bữa trưa bình thường', detail: 'Duy trì protein + carb vừa phải', type: 'normal' },
      { time: '18:00–19:00', meal: 'Bữa tối', detail: 'Nhẹ hơn, ưu tiên protein + rau', type: 'normal' },
    ],
  },
  {
    id: 'noon', label: 'Trưa', emoji: '☀️', time: '11:00–13:00',
    color: '#06b6d4',
    steps: [
      { time: '7:00–8:00', meal: 'Bữa sáng lớn hơn', detail: 'Tăng carb — nhiên liệu cho buổi tập trưa', type: 'pre' },
      { time: '10:30–11:00', meal: 'Snack nhẹ trước tập', detail: 'Chuối hoặc 1 hộp sữa chua', type: 'pre' },
      { time: '11:00–13:00', meal: 'TẬP LUYỆN', detail: '', type: 'workout' },
      { time: '13:00–14:00', meal: 'Bữa sau tập linh hoạt', detail: 'Protein + carb trong 60 phút sau tập', type: 'post' },
      { time: '18:00–19:00', meal: 'Bữa tối', detail: 'Protein + rau + chất béo lành mạnh', type: 'normal' },
    ],
  },
  {
    id: 'afternoon', label: 'Chiều', emoji: '🌇', time: '16:00–19:00',
    color: LIME,
    tag: 'Phổ biến nhất',
    steps: [
      { time: '7:00–8:00', meal: 'Bữa sáng bình thường', detail: 'Cân bằng protein + carb + rau', type: 'normal' },
      { time: '12:00–13:00', meal: 'Bữa trưa nhiều carb', detail: 'Cơm/khoai nhiều hơn — nạp glycogen cho chiều', type: 'pre' },
      { time: '14:30–15:30', meal: 'Snack trước tập 1–2h', detail: 'Trái cây + sữa chua / bánh yến mạch', type: 'pre' },
      { time: '16:00–19:00', meal: 'TẬP LUYỆN', detail: '', type: 'workout' },
      { time: '19:00–20:00', meal: 'Bữa tối sau tập', detail: 'Protein cao + carb vừa — quan trọng nhất ngày', type: 'post' },
    ],
  },
  {
    id: 'late', label: 'Tối Muộn', emoji: '🌙', time: '20:00–22:00',
    color: '#a855f7',
    steps: [
      { time: '7:00–8:00', meal: 'Bữa sáng bình thường', detail: 'Protein + carb cân bằng', type: 'normal' },
      { time: '12:00–13:00', meal: 'Bữa trưa', detail: 'Bữa chính, carb + protein đầy đủ', type: 'normal' },
      { time: '17:00–18:00', meal: 'Bữa tối sớm (chính)', detail: 'Ăn tối trước tập tối thiểu 2 tiếng', type: 'pre' },
      { time: '19:30–20:00', meal: 'Snack nhẹ trước tập', detail: 'Sữa chua / 1 trứng luộc — dễ tiêu', type: 'pre' },
      { time: '20:00–22:00', meal: 'TẬP LUYỆN', detail: '', type: 'workout' },
      { time: '22:00–22:30', meal: 'Post-workout nhẹ', detail: 'Casein protein hoặc 200ml sữa ít béo + trứng', type: 'post' },
    ],
  },
];

const GOAL_RULES = [
  {
    key: 'loss', label: 'Giảm Mỡ', emoji: '🔥', color: '#ef4444',
    model: '3+1 bữa', detail: 'Cắt carb bữa tối nếu nghỉ tập',
    rules: [
      'Mô hình 3+1: 3 bữa chính + 1 snack protein nhỏ',
      'Cắt tinh bột bữa tối vào ngày nghỉ tập',
      'Giữ protein ≥1.8g/kg dù cắt giảm calo',
      'Không bỏ bữa — chỉ giảm khẩu phần tinh bột',
      'Snack = protein + chất xơ (không phải carb tinh)',
      'Ngủ ≥7h — ngủ thiếu tăng cảm giác đói 20–30%',
    ],
  },
  {
    key: 'gain', label: 'Tăng Cơ', emoji: '💪', color: '#06b6d4',
    model: '4–5 bữa', detail: 'Không bỏ bữa sau tập',
    rules: [
      'Mô hình 4–5 bữa — không được bỏ bữa sau tập',
      'Protein sau tập 25–35g trong 30–60 phút',
      'Mỗi bữa chính ≥25g protein để kích hoạt MPS',
      'Tăng carb ngày tập nặng (×1.4 so với base)',
      'Chất béo lành mạnh 25–30% tổng calo',
      'Thặng dư calo 200–300kcal/ngày — không nhét quá nhiều',
    ],
  },
  {
    key: 'endure', label: 'Sức Bền', emoji: '🏃', color: '#f59e0b',
    model: '5–6 bữa', detail: 'Nạp carb trước/trong/sau dài',
    rules: [
      'Mô hình 5–6 bữa — tần suất cao để duy trì glycogen',
      'Nạp carb trước tập dài ≥90ph: 30–60g carb/giờ',
      'Trong buổi dài: gel năng lượng hoặc chuối mỗi 45ph',
      'Sau tập dài: carb + protein (tỷ lệ 3:1) trong 30ph',
      'Muối điện giải — quan trọng như calo',
      'Carb-loading trước race: 8–10g/kg 24–48h trước',
    ],
  },
  {
    key: 'maintain', label: 'Duy Trì', emoji: '⚖️', color: LIME,
    model: '3+1 hoặc 3 bữa', detail: 'Đơn giản, bền vững',
    rules: [
      '3+1 hoặc 3 bữa đơn giản — dễ duy trì dài hạn',
      'Protein vẫn cần đủ 1.2–1.6g/kg để giữ cơ',
      'Ngày tập/nghỉ điều chỉnh ±100–150kcal là đủ',
      'Không cần cân đo chính xác — ước lượng bằng tay',
      'Nhất quán quan trọng hơn chính xác',
      'Check cân 1 lần/tuần — điều chỉnh nếu lệch ±1kg/tháng',
    ],
  },
  {
    key: 'busy', label: 'Người Bận', emoji: '⏰', color: '#a855f7',
    model: '3 bữa + 1 cứu nguy', detail: 'Tối giản, thực tế',
    rules: [
      '3 bữa đơn giản + 1 bữa cứu nguy khi lỡ',
      'Meal prep 2 lần/tuần — 30–45ph chuẩn bị đủ dùng',
      'Theo thành phần: nấu protein, carb, rau riêng',
      'Bữa cứu nguy: protein + rau + nước (không nhịn)',
      'Trứng luộc + rau cắt sẵn là bộ kit khẩn cấp',
      'App chụp ảnh ước lượng calo — 5ph/ngày là đủ',
    ],
  },
];

const PLATE_LEVELS = [
  {
    id: 'A', label: 'Cấp A — Lý Tưởng', color: GREEN,
    desc: 'Thực phẩm tươi nguyên, chế biến tối thiểu. Tối ưu dinh dưỡng vi lượng.',
    items: [
      { icon: '🥩', label: 'Đạm', detail: 'Ức gà/cá/trứng/đậu hũ tươi' },
      { icon: '🥬', label: 'Rau', detail: 'Rau xanh tươi, ít nhất 2 màu' },
      { icon: '🍠', label: 'Tinh bột', detail: 'Khoai lang/yến mạch/gạo lứt' },
      { icon: '🫒', label: 'Chất béo', detail: 'Dầu olive/bơ/hạt chia' },
    ],
  },
  {
    id: 'B', label: 'Cấp B — Đủ Tốt', color: LIME,
    desc: 'Thực tế và bền vững. Khuyến nghị cho cuộc sống bận rộn hàng ngày.',
    items: [
      { icon: '🍗', label: 'Đạm', detail: 'Gà/thịt/cá nấu sẵn đơn giản' },
      { icon: '🥒', label: 'Rau', detail: 'Rau cắt sẵn, đóng túi, đông lạnh OK' },
      { icon: '🍚', label: 'Tinh bột', detail: 'Cơm trắng/khoai tây/bánh mì nguyên cám' },
      { icon: '🥜', label: 'Chất béo', detail: 'Hạt/bơ đậu phộng/trứng' },
    ],
  },
  {
    id: 'C', label: 'Cấp C — Cứu Nguy', color: '#f59e0b',
    desc: 'Khi không có thời gian. Chỉ cần đạm + rau xanh — bỏ qua tinh bột nếu cần.',
    items: [
      { icon: '🥚', label: 'Đạm', detail: 'Trứng luộc / whey / lon cá ngừ' },
      { icon: '🥦', label: 'Rau', detail: 'Rau đông lạnh hấp nhanh / rau sống' },
      { icon: '—', label: 'Tinh bột', detail: 'Tùy chọn — có thể bỏ qua' },
      { icon: '—', label: 'Chất béo', detail: 'Từ đạm tự nhiên là đủ' },
    ],
  },
];

const SUMMARY_RULES = [
  { n: 1, icon: '📊', text: 'Tính tổng ngày trước, chia bữa sau', sub: 'Macro tổng → tỷ lệ từng bữa' },
  { n: 2, icon: '💪', text: 'Mỗi bữa chính đều có đạm 20–40g', sub: 'Kích hoạt tổng hợp protein cơ bắp' },
  { n: 3, icon: '🌾', text: 'Tinh bột cao hơn vào buổi tập', sub: 'Thấp hơn ngày nghỉ — carb cycling' },
  { n: 4, icon: '🥬', text: 'Rau ≥400g/ngày', sub: 'Ít nhất 1 phần mỗi bữa chính' },
  { n: 5, icon: '🫒', text: 'Chất béo ≤30% calo trước tập nặng', sub: 'Chất béo làm chậm tiêu hoá' },
  { n: 6, icon: '💧', text: 'Nước 30–40ml/kg cơ bản', sub: '+500–1000ml ngày tập' },
  { n: 7, icon: '⏰', text: 'Không bỏ bữa sau tập ≥45 phút', sub: 'Cửa sổ anabolic — protein + carb' },
  { n: 8, icon: '🥗', text: 'Mô hình 4 bữa là xương sống', sub: 'Điều chỉnh lên/xuống theo nhu cầu' },
  { n: 9, icon: '🔄', text: '1 bữa lệch không phá hỏng', sub: 'Quan trọng là bữa tiếp theo' },
  { n: 10, icon: '👂', text: 'Tính toán là khởi đầu', sub: 'Lắng nghe cơ thể là tinh chỉnh' },
];

const HAND_MEASURES = [
  { icon: '✊', label: 'Tinh bột', detail: '1 nắm đấm = 1 khẩu phần', example: '~45–60g cơm / khoai', color: '#f59e0b' },
  { icon: '🖐️', label: 'Đạm', detail: '1 bàn tay = 1 khẩu phần', example: '~80–120g thịt/cá', color: GREEN },
  { icon: '👍', label: 'Chất béo', detail: '1 ngón cái = 1 phần', example: '~10–14g dầu / bơ', color: '#f97316' },
  { icon: '🙌', label: 'Rau/Canh', detail: '2 bàn tay chụm = 1 phần', example: '~150–200g rau xanh', color: LIME },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatBadge({ label, value, color }) {
  return (
    <div className="flex flex-col items-center px-4 py-3 rounded-xl border" style={{ borderColor: `${color}30`, background: `${color}10` }}>
      <span className="text-3xl font-bold" style={{ color }}>{value}</span>
      <span className="text-sm text-gray-400 mt-0.5 text-center">{label}</span>
    </div>
  );
}

function MacroBar({ label, value, max, color, unit = 'g' }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-base text-gray-300">{label}</span>
        <span className="text-base font-semibold" style={{ color }}>{value}{unit}</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ─── Plate SVG ────────────────────────────────────────────────────────────────
function PlateDiagram({ activeSlice, onSliceClick }) {
  const cx = 120, cy = 120, r = 108;
  // Total circumference
  const C = 2 * Math.PI * r;
  // Sector definitions: [pct, color, label, key]
  const sectors = [
    { pct: 0.50, color: '#22c55e', label: 'Rau/Canh', key: 'veg', detail: '½ đĩa — rau lá xanh, canh rau, salad. Chất xơ + vi chất + nước.' },
    { pct: 0.25, color: '#84cc16', label: 'Đạm', key: 'protein', detail: '¼ đĩa — thịt/cá/trứng/đậu hũ. 20–40g protein mỗi bữa.' },
    { pct: 0.22, color: '#f59e0b', label: 'Tinh bột', key: 'carb', detail: '¼ đĩa — cơm/khoai/yến mạch. Điều chỉnh theo ngày tập/nghỉ.' },
    { pct: 0.03, color: '#f97316', label: 'Chất béo', key: 'fat', detail: 'Nhỏ — dầu olive/bơ/hạt. ≤30% calo trước tập nặng.' },
  ];

  // Build arcs
  let cumAngle = -Math.PI / 2; // start at top
  const paths = sectors.map((s) => {
    const startAngle = cumAngle;
    const sweep = s.pct * 2 * Math.PI;
    const endAngle = startAngle + sweep;
    cumAngle = endAngle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = sweep > Math.PI ? 1 : 0;
    const midAngle = startAngle + sweep / 2;
    const lx = cx + (r * 0.65) * Math.cos(midAngle);
    const ly = cy + (r * 0.65) * Math.sin(midAngle);
    const isActive = activeSlice === s.key;
    return { ...s, startAngle, endAngle, sweep, x1, y1, x2, y2, largeArc, lx, ly, isActive };
  });

  return (
    <div className="flex flex-col items-center">
      <svg width="240" height="240" viewBox="0 0 240 240" style={{ overflow: 'visible' }}>
        {/* plate shadow */}
        <circle cx={cx} cy={cy} r={r + 4} fill="rgba(0,0,0,0.4)" />
        <circle cx={cx} cy={cy} r={r + 2} fill="#1a1a1a" />
        {paths.map((p) => (
          <g key={p.key} style={{ cursor: 'pointer' }} onClick={() => onSliceClick(p.key)}>
            <path
              d={`M ${cx} ${cy} L ${p.x1} ${p.y1} A ${r} ${r} 0 ${p.largeArc} 1 ${p.x2} ${p.y2} Z`}
              fill={p.color}
              opacity={p.isActive ? 1 : 0.72}
              stroke="#0a0a0a"
              strokeWidth="2"
              style={{ transition: 'opacity 0.2s, transform 0.2s', transformOrigin: `${cx}px ${cy}px`, transform: p.isActive ? 'scale(1.04)' : 'scale(1)' }}
            />
            {/* label inside */}
            {p.pct >= 0.1 && (
              <text
                x={p.lx} y={p.ly}
                textAnchor="middle" dominantBaseline="middle"
                fill="#fff" fontSize="10" fontWeight="600"
                style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
              >
                {p.pct >= 0.22 ? p.label : ''}
              </text>
            )}
          </g>
        ))}
        {/* center circle */}
        <circle cx={cx} cy={cy} r={22} fill="#0f0f0f" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="middle" fill="#84cc16" fontSize="11" fontWeight="700">ĐĨA</text>
        <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle" fill="#84cc16" fontSize="11" fontWeight="700">ĂN</text>
      </svg>
      {/* Legend */}
      <div className="flex flex-wrap gap-2 justify-center mt-3">
        {paths.map((p) => (
          <button
            key={p.key}
            onClick={() => onSliceClick(p.key)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: p.isActive ? `${p.color}25` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${p.isActive ? p.color : 'rgba(255,255,255,0.08)'}`,
              color: p.isActive ? p.color : '#9ca3af',
            }}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            {p.label} ({Math.round(p.pct * 100)}%)
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function NutritionMealRulesPage() {
  useOrbitRing();

  const [b0, setB0] = useState({ w: 65, h: 170, a: 1.55, sx: 'male', goal: 'recomp' });
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_INPUTS);
      if (raw) { const p = JSON.parse(raw); setB0(prev => ({ ...prev, ...p })); }
    } catch { /* ignore */ }
  }, []);

  const stats = useMemo(() => computeStats(b0), [b0]);

  const [selectedModel, setSelectedModel] = useState(1); // index into MEAL_MODELS
  const [activeTab, setActiveTab] = useState('afternoon');
  const [activeGoal, setActiveGoal] = useState(null);
  const [activePlateLevel, setActivePlateLevel] = useState('B');
  const [activeSlice, setActiveSlice] = useState(null);
  const [barsAnimated, setBarsAnimated] = useState(false);
  const carbRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setBarsAnimated(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (carbRef.current) obs.observe(carbRef.current);
    return () => obs.disconnect();
  }, []);

  const model = MEAL_MODELS[selectedModel];

  const mealBreakdown = useMemo(() => {
    return model.meals.map((m) => ({
      ...m,
      kcal: Math.round(stats.targetKcal * m.pct / 100),
      protein: Math.round(stats.proteinG * m.pct / 100),
      carb: Math.round(stats.carbG * m.pct / 100),
    }));
  }, [model, stats]);

  const activeTraining = TRAINING_TIMES.find(t => t.id === activeTab);
  const activePlateLevelData = PLATE_LEVELS.find(l => l.id === activePlateLevel);
  const activeSliceData = activeSlice
    ? [
        { pct: 0.50, color: '#22c55e', key: 'veg', detail: '½ đĩa — rau lá xanh, canh rau, salad. Chất xơ + vi chất + nước.' },
        { pct: 0.25, color: '#84cc16', key: 'protein', detail: '¼ đĩa — thịt/cá/trứng/đậu hũ. 20–40g protein mỗi bữa.' },
        { pct: 0.22, color: '#f59e0b', key: 'carb', detail: '¼ đĩa — cơm/khoai/yến mạch. Điều chỉnh theo ngày tập/nghỉ.' },
        { pct: 0.03, color: '#f97316', key: 'fat', detail: 'Nhỏ — dầu olive/bơ/hạt. ≤30% calo trước tập nặng.' },
      ].find(s => s.key === activeSlice)
    : null;

  const carbMax = Math.round(stats.carbG * 1.4);

  return (
    <div className="min-h-screen pb-24" style={{ background: '#0a0a0a', color: '#e5e7eb' }}>
      <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32">

        {/* ── Breadcrumb ────────────────────────────────────────────────── */}
        <Link
          to="/pillar/b"
          className="inline-flex items-center gap-2 text-base font-medium mb-8 transition-colors"
          style={{ color: LIME }}
        >
          <span>←</span>
          <span>Dinh Dưỡng</span>
        </Link>

        {/* ── Hero row ─────────────────────────────────────────────────── */}
        <div className="flex items-start gap-6 mb-10 relative">
          <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(132,204,22,0.05)' }} />
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center shrink-0 border"
            style={{ background: 'rgba(132,204,22,0.06)', borderColor: 'rgba(132,204,22,0.2)', animation: 'pmFloat 4s ease-in-out infinite' }}
          >
            🍽️
          </div>
          {/* Content */}
          <div>
            <h1
              className="text-5xl md:text-6xl font-bold leading-tight"
              style={{ color: '#f1f5f9', animation: 'pmFadeUp 0.6s ease both' }}
            >
              Quy Tắc Chia Bữa
            </h1>
            <span
              className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border"
              style={{ color: LIME, background: 'rgba(132,204,22,0.10)', borderColor: 'rgba(132,204,22,0.20)' }}
            >
              Pillar B — Nutrition & Meal Plans
            </span>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
              Hệ thống phân bổ bữa ăn khoa học — từ mô hình 3 đến 6 bữa, carb cycling theo ngày tập,
              đến quy tắc đĩa ăn thực tế. Cá nhân hoá theo thể trạng và mục tiêu của bạn.
            </p>
          </div>
        </div>

        {/* ── Hero image with orbit ring ──────────────────────────────── */}
        <div className="pm-orbit-ring rounded-3xl p-[1.5px] mb-6">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80&auto=format&fit=crop"
              alt="Meal planning"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.90) 0%, rgba(10,10,10,0.30) 60%, transparent 100%)' }} />
            <span
              className="absolute bottom-4 left-6 text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{ color: LIME, background: 'rgba(10,10,10,0.60)', borderColor: 'rgba(132,204,22,0.20)' }}
            >
              Quy Tắc Chia Bữa Toàn Dự Án
            </span>
          </div>
        </div>

        {/* ── Hero stats badges ─────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3 mb-12">
          {[
            { label: 'Mô Hình', value: '4', sub: 'cấu trúc bữa' },
            { label: 'Quy Tắc', value: '10', sub: 'tóm tắt chính' },
            { label: 'Mục Tiêu', value: '5', sub: 'goal cụ thể' },
            { label: 'Áp Dụng', value: '24/7', sub: 'mọi ngày' },
          ].map((b) => (
            <div
              key={b.label}
              className="flex flex-col items-center py-3 px-2 rounded-xl border text-center"
              style={{ background: 'rgba(132,204,22,0.05)', borderColor: 'rgba(132,204,22,0.15)' }}
            >
              <span className="text-2xl md:text-3xl font-bold" style={{ color: LIME }}>{b.value}</span>
              <span className="text-sm font-semibold text-gray-300 mt-0.5">{b.label}</span>
              <span className="text-sm text-gray-500">{b.sub}</span>
            </div>
          ))}
        </div>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} />

        {/* ════════════════════════════════════════════════════════════════
            SECTION 1 — 5 Goals of meal splitting
        ═══════════════════════════════════════════════════════════════════ */}
        <RevealBlock className="mb-14">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Tại Sao Phải Chia Bữa?</h2>
          <p className="text-base text-gray-500 mb-6">5 mục tiêu của hệ thống chia bữa khoa học</p>
          <div className="grid md:grid-cols-5 grid-cols-1 gap-3">
            {[
              { n: 1, icon: '📈', text: 'Cung cấp năng lượng đều đặn', sub: 'Không tạo đỉnh/đáy đường huyết' },
              { n: 2, icon: '📋', text: 'Cấu trúc có thể theo dõi', sub: 'Dễ điều chỉnh và tối ưu theo thời gian' },
              { n: 3, icon: '💪', text: 'Phân phối đạm đều', sub: 'Mỗi bữa 20–40g protein — kích MPS' },
              { n: 4, icon: '🌾', text: 'Lập lịch carb', sub: 'Xung quanh buổi tập — glycogen tối ưu' },
              { n: 5, icon: '🧠', text: 'Thói quen ý thức', sub: 'Ăn có mục đích, không theo cảm tính' },
            ].map((g) => (
              <div
                key={g.n}
                className="p-4 rounded-xl border flex flex-col gap-2"
                style={{ background: 'rgba(132,204,22,0.04)', borderColor: 'rgba(132,204,22,0.12)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{g.icon}</span>
                  <span className="w-5 h-5 rounded-full text-sm font-bold flex items-center justify-center flex-shrink-0" style={{ background: LIME, color: '#0a0a0a' }}>{g.n}</span>
                </div>
                <p className="text-base font-semibold text-gray-200">{g.text}</p>
                <p className="text-sm text-gray-500">{g.sub}</p>
              </div>
            ))}
          </div>
          {/* Core principle */}
          <div className="mt-6 p-4 rounded-xl border-l-4 flex flex-col gap-1.5" style={{ background: 'rgba(132,204,22,0.06)', borderColor: LIME }}>
            <p className="text-base font-bold" style={{ color: LIME }}>Nguyên tắc cốt lõi</p>
            <p className="text-base text-gray-300">Tính tổng ngày trước → chia nhỏ sau</p>
            <div className="flex flex-wrap gap-4 mt-1">
              <code className="text-sm px-2 py-1 rounded" style={{ background: 'rgba(132,204,22,0.10)', color: LIME }}>Kcal bữa = Tổng kcal ngày × tỷ lệ bữa</code>
              <code className="text-sm px-2 py-1 rounded" style={{ background: 'rgba(132,204,22,0.10)', color: LIME }}>Protein bữa = Tổng protein × tỷ lệ</code>
            </div>
          </div>
        </RevealBlock>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 2 — Personalized Calculator
        ═══════════════════════════════════════════════════════════════════ */}
        <RevealBlock className="mb-14">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Tính Toán Cá Nhân Của Bạn</h2>
          <p className="text-base text-gray-500 mb-6">
            Dựa trên thông số B0 đã nhập • {stats.w}kg / {stats.h}cm / {stats.sx === 'male' ? 'Nam' : 'Nữ'}
          </p>

          {/* Macro summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatBadge label="Kcal Mục Tiêu" value={stats.targetKcal} color={LIME} />
            <StatBadge label="Protein/Ngày" value={`${stats.proteinG}g`} color={GREEN} />
            <StatBadge label="Carb/Ngày" value={`${stats.carbG}g`} color="#f59e0b" />
            <StatBadge label="Fat/Ngày" value={`${stats.fatG}g`} color="#f97316" />
          </div>

          {/* Macro bars */}
          <div className="p-5 rounded-2xl border mb-6" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
            <MacroBar label="Protein" value={stats.proteinG} max={stats.proteinG} color={GREEN} />
            <MacroBar label="Carbohydrate" value={stats.carbG} max={stats.carbG + 50} color="#f59e0b" />
            <MacroBar label="Fat" value={stats.fatG} max={Math.max(stats.fatG + 20, 100)} color="#f97316" />
            <MacroBar label="Nước" value={Math.round(stats.waterMl / 100)} max={40} color="#06b6d4" unit="00ml" />
          </div>

          {/* Model selector */}
          <div className="flex flex-wrap gap-2 mb-5">
            {MEAL_MODELS.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(i)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium transition-all duration-200 border"
                style={{
                  background: selectedModel === i ? `${m.color}18` : 'rgba(255,255,255,0.03)',
                  borderColor: selectedModel === i ? m.color : 'rgba(255,255,255,0.08)',
                  color: selectedModel === i ? m.color : '#9ca3af',
                }}
              >
                <span>{m.icon}</span>
                <span>{m.name}</span>
                {m.tag && (
                  <span className="text-sm px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${m.color}30`, color: m.color }}>
                    {m.tag}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Per-meal animated breakdown */}
          <div className="p-5 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
            <p className="text-base font-semibold text-gray-300 mb-4">Phân bổ từng bữa — {model.name}</p>
            <div className="space-y-3">
              {mealBreakdown.map((m, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-base font-medium text-gray-300">{m.name}</span>
                    <div className="flex gap-3 text-sm">
                      <span style={{ color: LIME }}>{m.kcal} kcal</span>
                      <span style={{ color: GREEN }}>{m.protein}g pro</span>
                      <span style={{ color: '#f59e0b' }}>{m.carb}g carb</span>
                    </div>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${m.pct}%`, background: `linear-gradient(90deg, ${model.color}, ${model.color}99)` }}
                    />
                  </div>
                  <div className="flex justify-between mt-0.5">
                    <span className="text-sm text-gray-600">{m.pct}% tổng ngày</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <span className="text-sm text-gray-400">Protein/bữa chính ≈</span>
              <span className="text-base font-bold" style={{ color: GREEN }}>
                {Math.round(stats.proteinG / (model.meals.filter(m => m.pct >= 20).length || model.meals.length))}g
              </span>
              <span className="text-sm text-gray-500">• ISSN khuyến nghị 20–40g/bữa</span>
            </div>
          </div>
        </RevealBlock>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 3 — Interactive Meal Model Selector
        ═══════════════════════════════════════════════════════════════════ */}
        <RevealBlock className="mb-14">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#f1f5f9' }}>4 Mô Hình Bữa Ăn</h2>
          <p className="text-base text-gray-500 mb-6">Chọn mô hình phù hợp với lịch sống của bạn</p>

          <div className="grid md:grid-cols-4 grid-cols-2 gap-3 mb-6">
            {MEAL_MODELS.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(i)}
                className="p-4 rounded-2xl border text-left transition-all duration-200"
                style={{
                  background: selectedModel === i ? `${m.color}12` : 'rgba(255,255,255,0.03)',
                  borderColor: selectedModel === i ? m.color : 'rgba(255,255,255,0.07)',
                  boxShadow: selectedModel === i ? `0 0 20px ${m.color}20` : 'none',
                }}
              >
                <div className="text-4xl mb-2">{m.icon}</div>
                <p className="text-base font-bold mb-1" style={{ color: selectedModel === i ? m.color : '#e5e7eb' }}>{m.name}</p>
                <p className="text-sm text-gray-500 leading-snug">{m.best}</p>
                {m.tag && (
                  <span className="mt-2 inline-block text-sm px-2 py-0.5 rounded-full font-bold" style={{ background: `${m.color}25`, color: m.color }}>
                    {m.tag}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Animated bar chart */}
          <div className="p-5 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
            <p className="text-base font-semibold text-gray-400 mb-4">Phân bổ % calo theo bữa</p>
            <div className="flex items-end gap-2 h-32">
              {model.meals.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                  <span className="text-sm font-bold" style={{ color: model.color }}>{m.pct}%</span>
                  <div
                    className="w-full rounded-t-lg transition-all duration-700"
                    style={{ height: `${(m.pct / 40) * 100}%`, background: `linear-gradient(180deg, ${model.color}, ${model.color}60)`, minHeight: 4 }}
                  />
                  <span className="text-sm text-gray-500 text-center leading-tight">{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealBlock>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 4 — Visual Plate Diagram
        ═══════════════════════════════════════════════════════════════════ */}
        <RevealBlock className="mb-14">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Công Thức Đĩa Ăn</h2>
          <p className="text-base text-gray-500 mb-6">Nhấn từng phần để xem chi tiết</p>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col items-center">
              <PlateDiagram activeSlice={activeSlice} onSliceClick={(k) => setActiveSlice(s => s === k ? null : k)} />

              {activeSliceData && (
                <div
                  className="mt-4 p-4 rounded-xl border w-full transition-all duration-300"
                  style={{ background: `${activeSliceData.color}12`, borderColor: `${activeSliceData.color}40` }}
                >
                  <p className="text-base" style={{ color: activeSliceData.color }}>{activeSliceData.detail}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {/* Formula */}
              <div className="p-4 rounded-xl border" style={{ background: 'rgba(132,204,22,0.05)', borderColor: 'rgba(132,204,22,0.15)' }}>
                <p className="text-sm text-gray-500 mb-2 uppercase tracking-widest">Công Thức</p>
                <div className="flex flex-wrap gap-2 text-base">
                  {[
                    { label: '½ rau/canh', color: '#22c55e' },
                    { label: '¼ đạm', color: '#84cc16' },
                    { label: '¼ tinh bột', color: '#f59e0b' },
                    { label: '+ chất béo nhỏ', color: '#f97316' },
                  ].map((s) => (
                    <span key={s.label} className="px-2 py-1 rounded-lg font-medium" style={{ background: `${s.color}15`, color: s.color }}>
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hand measures */}
              <p className="text-sm text-gray-500 uppercase tracking-widest">Đo bằng tay</p>
              <div className="grid grid-cols-2 gap-3">
                {HAND_MEASURES.map((h) => (
                  <div
                    key={h.label}
                    className="p-3 rounded-xl border"
                    style={{ background: `${h.color}08`, borderColor: `${h.color}20` }}
                  >
                    <div className="text-3xl mb-1">{h.icon}</div>
                    <p className="text-sm font-bold" style={{ color: h.color }}>{h.label}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{h.detail}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{h.example}</p>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="p-4 rounded-xl border-l-4 italic text-base text-gray-400" style={{ borderColor: LIME, background: 'rgba(132,204,22,0.04)' }}>
                "Một đĩa tốt không phải là đĩa ít nhất, mà là đĩa đủ đạm, đủ rau, đúng tinh bột và vừa chất béo."
              </blockquote>
            </div>
          </div>
        </RevealBlock>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 5 — Carb Cycling Timeline
        ═══════════════════════════════════════════════════════════════════ */}
        <RevealBlock className="mb-14">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Carb Cycling Theo Ngày Tập</h2>
          <p className="text-base text-gray-500 mb-6">
            Dựa trên carb cơ sở của bạn: <span className="font-bold" style={{ color: LIME }}>{stats.carbG}g/ngày</span>
          </p>

          <div ref={carbRef} className="space-y-4">
            {CARB_DAYS.map((d) => {
              const carbVal = Math.round(stats.carbG * d.carbMult);
              const kcalVal = Math.round(stats.targetKcal * d.kcalMult);
              const pct = barsAnimated ? Math.round((carbVal / carbMax) * 100) : 0;
              return (
                <div
                  key={d.key}
                  className="p-4 rounded-xl border"
                  style={{ background: `${d.color}06`, borderColor: `${d.color}18` }}
                >
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{d.emoji}</span>
                      <div>
                        <p className="text-base font-bold" style={{ color: d.color }}>{d.label}</p>
                        <p className="text-sm text-gray-500">{d.note}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-right">
                      <div>
                        <p className="text-sm text-gray-500">Carb</p>
                        <p className="text-lg font-bold" style={{ color: d.color }}>{carbVal}g</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Kcal</p>
                        <p className="text-lg font-bold text-gray-300">{kcalVal}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Hệ số</p>
                        <p className="text-lg font-bold text-gray-300">×{d.carbMult}</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${d.color}, ${d.color}80)` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-lg border text-sm text-gray-500" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            Carb cycling giúp tối ưu hoá glycogen cho ngày tập nặng và hỗ trợ lipolysis ngày nghỉ. Duy trì protein không đổi mọi ngày.
          </div>
        </RevealBlock>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 6 — Training Time Rules
        ═══════════════════════════════════════════════════════════════════ */}
        <RevealBlock className="mb-14">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Lịch Ăn Theo Giờ Tập</h2>
          <p className="text-base text-gray-500 mb-6">Điều chỉnh timing bữa ăn cho từng ca tập</p>

          {/* Tab selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TRAINING_TIMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-base font-medium transition-all duration-200 border"
                style={{
                  background: activeTab === t.id ? `${t.color}18` : 'rgba(255,255,255,0.03)',
                  borderColor: activeTab === t.id ? t.color : 'rgba(255,255,255,0.08)',
                  color: activeTab === t.id ? t.color : '#9ca3af',
                }}
              >
                <span>{t.emoji}</span>
                <span>{t.label}</span>
                <span className="text-sm opacity-70">{t.time}</span>
                {t.tag && (
                  <span className="text-sm px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${t.color}25`, color: t.color }}>
                    {t.tag}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Timeline */}
          {activeTraining && (
            <div className="p-5 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="space-y-0">
                {activeTraining.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 group">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-3 h-3 rounded-full mt-1 flex-shrink-0 transition-all duration-200"
                        style={{
                          background: step.type === 'workout'
                            ? activeTraining.color
                            : step.type === 'pre' ? `${activeTraining.color}80`
                            : step.type === 'post' ? `${activeTraining.color}99`
                            : 'rgba(255,255,255,0.15)',
                          boxShadow: step.type === 'workout' ? `0 0 8px ${activeTraining.color}` : 'none',
                        }}
                      />
                      {i < activeTraining.steps.length - 1 && (
                        <div className="w-px flex-1 my-1" style={{ background: 'rgba(255,255,255,0.06)', minHeight: 24 }} />
                      )}
                    </div>
                    {/* Content */}
                    <div className={`pb-4 flex-1 ${step.type === 'workout' ? 'py-3 px-3 rounded-xl mb-1' : ''}`}
                      style={step.type === 'workout' ? { background: `${activeTraining.color}12`, border: `1px solid ${activeTraining.color}30` } : {}}
                    >
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <p className={`text-base font-semibold ${step.type === 'workout' ? 'text-white' : 'text-gray-300'}`}>
                          {step.type === 'workout' && <span className="mr-1">🏋️</span>}
                          {step.meal}
                        </p>
                        <span className="text-sm font-mono text-gray-500 flex-shrink-0">{step.time}</span>
                      </div>
                      {step.detail && <p className="text-sm text-gray-500 mt-0.5">{step.detail}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </RevealBlock>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 7 — Goal-based Rules
        ═══════════════════════════════════════════════════════════════════ */}
        <RevealBlock className="mb-14">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Quy Tắc Theo Mục Tiêu</h2>
          <p className="text-base text-gray-500 mb-6">Nhấn để mở rộng — xem quy tắc cụ thể cho từng goal</p>

          <div className="space-y-3">
            {GOAL_RULES.map((g) => {
              const isOpen = activeGoal === g.key;
              return (
                <div
                  key={g.key}
                  className="rounded-2xl border overflow-hidden transition-all duration-300"
                  style={{
                    background: isOpen ? `${g.color}08` : 'rgba(255,255,255,0.02)',
                    borderColor: isOpen ? `${g.color}35` : 'rgba(255,255,255,0.07)',
                  }}
                >
                  <button
                    onClick={() => setActiveGoal(k => k === g.key ? null : g.key)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{g.emoji}</span>
                      <div>
                        <p className="font-bold text-gray-200">{g.label}</p>
                        <p className="text-sm text-gray-500">{g.model} · {g.detail}</p>
                      </div>
                    </div>
                    <span
                      className="text-xl transition-transform duration-300 flex-shrink-0"
                      style={{ color: g.color, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      ↓
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4">
                      <div className="h-px mb-3" style={{ background: `${g.color}20` }} />
                      <ul className="space-y-2">
                        {g.rules.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-base text-gray-300">
                            <span className="mt-1 w-4 h-4 rounded-full text-sm font-bold flex items-center justify-center flex-shrink-0"
                              style={{ background: `${g.color}25`, color: g.color }}>
                              {i + 1}
                            </span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* "Lỡ tay" rule */}
          <div className="mt-6 p-5 rounded-2xl border-l-4" style={{ background: 'rgba(132,204,22,0.06)', borderColor: LIME }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🔄</span>
              <p className="font-bold" style={{ color: LIME }}>Quy tắc "Lỡ Tay"</p>
            </div>
            <p className="text-base text-gray-300">Lỡ ăn vượt — <strong style={{ color: '#fff' }}>không nhịn bữa tiếp.</strong> Quay về cấu trúc ngay:</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['Protein', 'Rau xanh', 'Nhiều nước', 'Bữa kế tiếp bình thường'].map((item) => (
                <span key={item} className="px-3 py-1 rounded-full text-sm font-semibold" style={{ background: 'rgba(132,204,22,0.12)', color: LIME }}>
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>
        </RevealBlock>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 8 — Plate Quality Levels A/B/C
        ═══════════════════════════════════════════════════════════════════ */}
        <RevealBlock className="mb-14">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#f1f5f9' }}>3 Cấp Độ Đĩa Ăn</h2>
          <p className="text-base text-gray-500 mb-6">Từ lý tưởng đến cứu nguy — mọi tình huống đều có giải pháp</p>

          {/* Level tabs */}
          <div className="flex gap-2 mb-6">
            {PLATE_LEVELS.map((l) => (
              <button
                key={l.id}
                onClick={() => setActivePlateLevel(l.id)}
                className="flex-1 py-2.5 rounded-xl text-base font-bold transition-all duration-200 border"
                style={{
                  background: activePlateLevel === l.id ? `${l.color}18` : 'rgba(255,255,255,0.03)',
                  borderColor: activePlateLevel === l.id ? l.color : 'rgba(255,255,255,0.07)',
                  color: activePlateLevel === l.id ? l.color : '#9ca3af',
                }}
              >
                Cấp {l.id}
              </button>
            ))}
          </div>

          {activePlateLevelData && (
            <div
              className="p-6 rounded-2xl border transition-all duration-300"
              style={{ background: `${activePlateLevelData.color}07`, borderColor: `${activePlateLevelData.color}25` }}
            >
              <p className="font-bold text-xl mb-1" style={{ color: activePlateLevelData.color }}>{activePlateLevelData.label}</p>
              <p className="text-base text-gray-400 mb-5">{activePlateLevelData.desc}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {activePlateLevelData.items.map((item) => (
                  <div
                    key={item.label}
                    className="p-4 rounded-xl border flex flex-col gap-1.5"
                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <p className="text-sm font-bold uppercase tracking-wide" style={{ color: activePlateLevelData.color }}>{item.label}</p>
                    <p className="text-sm text-gray-400 leading-snug">{item.detail}</p>
                  </div>
                ))}
              </div>

              {/* Goal-specific plates hint */}
              <div className="mt-5 pt-4 border-t grid grid-cols-3 gap-3 text-sm" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                {[
                  { goal: 'Giảm mỡ', plate: '½ rau · ¼+ đạm · ⅙–¼ tinh bột', color: '#ef4444' },
                  { goal: 'Tăng cơ', plate: '⅓ rau · ⅓ đạm · ⅓ tinh bột', color: '#06b6d4' },
                  { goal: 'Sức bền', plate: 'Tinh bột chiếm nhiều hơn', color: '#f59e0b' },
                ].map((g) => (
                  <div key={g.goal} className="p-3 rounded-lg" style={{ background: `${g.color}08`, border: `1px solid ${g.color}20` }}>
                    <p className="font-bold mb-1" style={{ color: g.color }}>{g.goal}</p>
                    <p className="text-gray-500">{g.plate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </RevealBlock>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 9 — 10 Summary Rules
        ═══════════════════════════════════════════════════════════════════ */}
        <RevealBlock className="mb-14">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#f1f5f9' }}>10 Quy Tắc Vàng</h2>
          <p className="text-base text-gray-500 mb-6">Tóm tắt toàn bộ hệ thống chia bữa trong 10 điểm</p>

          <div className="grid md:grid-cols-2 gap-3">
            {SUMMARY_RULES.map((r) => (
              <RevealBlock key={r.n}>
                <div
                  className="flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 hover:border-lime-500/30"
                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 font-black"
                    style={{ background: 'rgba(132,204,22,0.12)', color: LIME }}
                  >
                    {r.n}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-lg">{r.icon}</span>
                      <p className="text-base font-semibold text-gray-200">{r.text}</p>
                    </div>
                    <p className="text-sm text-gray-500">{r.sub}</p>
                  </div>
                </div>
              </RevealBlock>
            ))}
          </div>
        </RevealBlock>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 10 — Meal Prep
        ═══════════════════════════════════════════════════════════════════ */}
        <RevealBlock className="mb-14">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Meal Prep Thực Tế</h2>
          <p className="text-base text-gray-500 mb-6">Chuẩn bị theo thành phần — 2 lần/tuần, ~45 phút</p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: '🍗', label: 'Đạm', color: GREEN,
                desc: 'Nấu batch protein 3–4 ngày một lần',
                tips: ['Ức gà hấp/nướng 500–700g', 'Trứng luộc 6–8 quả', 'Cá hồi/thịt bò phân khẩu phần sẵn'],
              },
              {
                icon: '🍚', label: 'Tinh bột', color: '#f59e0b',
                desc: 'Nấu carb theo lô, chia hộp theo bữa',
                tips: ['Cơm 1–1.5kg gạo khô', 'Khoai lang luộc sẵn', 'Yến mạch + trái cây khô để sẵn'],
              },
              {
                icon: '🥬', label: 'Rau & Gia vị', color: LIME,
                desc: 'Rau sơ chế, nước sốt pha sẵn',
                tips: ['Rau cắt sẵn bảo quản hộp kín', 'Sốt ăn kèm 1–2 loại', 'Hành/tỏi phi sẵn tiết kiệm thời gian'],
              },
            ].map((s) => (
              <div
                key={s.label}
                className="p-5 rounded-2xl border"
                style={{ background: `${s.color}07`, borderColor: `${s.color}20` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{s.icon}</span>
                  <div>
                    <p className="font-bold" style={{ color: s.color }}>{s.label}</p>
                    <p className="text-sm text-gray-500">{s.desc}</p>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {s.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-base text-gray-400">
                      <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-xl border flex items-start gap-3" style={{ background: 'rgba(132,204,22,0.05)', borderColor: 'rgba(132,204,22,0.15)' }}>
            <span className="text-2xl flex-shrink-0">💡</span>
            <div>
              <p className="text-base font-semibold" style={{ color: LIME }}>Tip: Theo thành phần, không theo bữa</p>
              <p className="text-sm text-gray-400 mt-1">
                Nấu riêng protein, carb, rau — khi ăn tự kết hợp theo mục tiêu ngày đó.
                Ngày tập: carb nhiều hơn. Ngày nghỉ: rau + protein, ít cơm.
              </p>
            </div>
          </div>
        </RevealBlock>

        {/* ── Final divider & back link ─────────────────────────────────── */}
        <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4">
          <Link
            to="/pillar/b"
            className="flex items-center gap-2 text-base font-medium transition-colors"
            style={{ color: LIME }}
          >
            ← Quay lại Dinh Dưỡng
          </Link>
          <div className="flex gap-3">
            <Link
              to="/pillar/b/formula"
              className="px-4 py-2 rounded-xl text-base font-semibold transition-all duration-200 border"
              style={{ background: 'rgba(132,204,22,0.08)', borderColor: 'rgba(132,204,22,0.25)', color: LIME }}
            >
              Công Thức Tính →
            </Link>
            <Link
              to="/pillar/b/protein"
              className="px-4 py-2 rounded-xl text-base font-semibold transition-all duration-200 border"
              style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.25)', color: GREEN }}
            >
              Protein Guide →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
