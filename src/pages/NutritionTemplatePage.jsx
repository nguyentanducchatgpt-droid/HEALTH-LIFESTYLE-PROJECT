import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

/* ── orbit ring ── */
const ORBIT_ID = 'tm-orbit-kf';
const ORBIT_CSS = `
@property --tm-orbit-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}
@keyframes tmOrbitSpin{to{--tm-orbit-angle:360deg;}}
.tm-orbit-ring{
  background:conic-gradient(
    from var(--tm-orbit-angle),
    transparent 0deg,transparent 55deg,
    rgba(244,63,94,0.0) 65deg,rgba(244,63,94,0.75) 85deg,
    rgba(255,255,255,0.9) 92deg,rgba(244,63,94,0.75) 99deg,
    rgba(244,63,94,0.0) 115deg,transparent 125deg,transparent 360deg
  );
  animation:tmOrbitSpin 3.5s linear infinite;
}
@keyframes tmFadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.tm-fade-up{animation:tmFadeUp .55s ease both}
@keyframes tmFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.tm-float{animation:tmFloat 3s ease-in-out infinite}
@keyframes tmPulseRing{0%,100%{box-shadow:0 0 0 0 rgba(244,63,94,0.3)}50%{box-shadow:0 0 0 12px rgba(244,63,94,0)}}
.tm-pulse{animation:tmPulseRing 2s ease-in-out infinite}
@keyframes tmBarFill{from{width:0}to{width:var(--tw)}}
.tm-bar{animation:tmBarFill 1s ease both}
@keyframes tmCountUp{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
.tm-count{animation:tmCountUp .5s ease both}
`;

/* ── scroll reveal ── */
function RevealBlock({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(24px)', transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ── B0 personalized data ── */
const B0_KEY = 'healthapp_b0_inputs';
const ACT_COEF = { sedentary: 1.2, light: 1.375, moderate: 1.55, heavy: 1.725, athlete: 1.9 };
const ACT_LABEL = { sedentary: 'Ít vận động', light: 'Nhẹ 1–3 buổi/tuần', moderate: 'Vừa 3–5 buổi/tuần', heavy: 'Nặng 6–7 buổi/tuần', athlete: 'Vận động viên' };
const GOAL_COEF = { maintain: 1, lose_light: 0.9, lose: 0.825, gain: 1.075, athlete: 1.1 };
const GOAL_LABEL = { maintain: 'Giữ cân / Sống khỏe', lose_light: 'Giảm mỡ nhẹ (−10%)', lose: 'Giảm mỡ rõ (−15–20%)', gain: 'Tăng cơ (+5–10%)', athlete: 'Tập nhiều (+10%)' };

function calcNutrition(inp) {
  const w = parseFloat(inp.weight) || 70, h = parseFloat(inp.height) || 170;
  const a = parseInt(inp.age) || 30, sx = inp.sex || 'male';
  const act = inp.activity || 'moderate', goal = inp.goal || 'maintain';
  const bmr = sx === 'male' ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
  const tdee = bmr * (ACT_COEF[act] || 1.55);
  const kcal = tdee * (GOAL_COEF[goal] || 1);
  const protein = goal === 'lose' || goal === 'athlete' ? w * 2.0 : w * 1.6;
  const fat = (kcal * 0.25) / 9;
  const carb = (kcal - protein * 4 - fat * 9) / 4;
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), kcal: Math.round(kcal), protein: Math.round(protein), fat: Math.round(fat), carb: Math.round(carb) };
}

/* ── macro color ── */
const MC = { protein: '#f43f5e', carb: '#fb923c', fat: '#facc15', fiber: '#4ade80', water: '#38bdf8' };

/* ── weekly days ── */
const WEEK_DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
const MEAL_TYPES = ['Sáng', 'Trưa', 'Phụ', 'Tối'];
const DEFAULT_WEEK = Object.fromEntries(WEEK_DAYS.map(d => [d, Object.fromEntries(MEAL_TYPES.map(m => [m, '']))]));

/* ── food library ── */
const FOOD_LIB = {
  protein: [
    { name: 'Ức gà', kcal: 165, p: 31, c: 0, f: 4, unit: '100g', goal: ['lose', 'gain', 'maintain'] },
    { name: 'Cá hồi', kcal: 208, p: 20, c: 0, f: 13, unit: '100g', goal: ['gain', 'maintain', 'athlete'] },
    { name: 'Trứng gà', kcal: 78, p: 6, c: 0.6, f: 5, unit: '1 quả', goal: ['lose', 'gain', 'maintain'] },
    { name: 'Sữa chua Hy Lạp', kcal: 100, p: 17, c: 6, f: 0, unit: '170g', goal: ['lose', 'maintain'] },
    { name: 'Đậu hũ', kcal: 76, p: 8, c: 2, f: 4, unit: '100g', goal: ['lose', 'gain', 'maintain'] },
    { name: 'Tôm', kcal: 99, p: 24, c: 0, f: 0.3, unit: '100g', goal: ['lose', 'maintain'] },
    { name: 'Thịt nạc bò', kcal: 250, p: 26, c: 0, f: 15, unit: '100g', goal: ['gain', 'athlete'] },
    { name: 'Cá ngừ hộp', kcal: 132, p: 29, c: 0, f: 1, unit: '100g', goal: ['lose', 'maintain'] },
  ],
  carb: [
    { name: 'Cơm trắng', kcal: 130, p: 2.7, c: 28, f: 0.3, unit: '100g nấu', goal: ['maintain', 'gain', 'athlete'] },
    { name: 'Gạo lứt', kcal: 111, p: 2.6, c: 23, f: 0.9, unit: '100g nấu', goal: ['lose', 'maintain'] },
    { name: 'Khoai lang', kcal: 86, p: 1.6, c: 20, f: 0.1, unit: '100g', goal: ['lose', 'maintain', 'athlete'] },
    { name: 'Yến mạch', kcal: 389, p: 17, c: 66, f: 7, unit: '100g khô', goal: ['lose', 'gain', 'maintain'] },
    { name: 'Chuối', kcal: 89, p: 1.1, c: 23, f: 0.3, unit: '1 quả (100g)', goal: ['athlete', 'gain'] },
    { name: 'Bánh mì nguyên cám', kcal: 247, p: 9, c: 41, f: 4, unit: '100g', goal: ['maintain', 'athlete'] },
    { name: 'Khoai tây', kcal: 77, p: 2, c: 17, f: 0.1, unit: '100g', goal: ['athlete', 'maintain'] },
  ],
  veg: [
    { name: 'Bông cải xanh', kcal: 34, p: 2.8, c: 7, f: 0.4, unit: '100g', fiber: 2.6 },
    { name: 'Cải bó xôi', kcal: 23, p: 2.9, c: 3.6, f: 0.4, unit: '100g', fiber: 2.2 },
    { name: 'Rau muống', kcal: 20, p: 2.6, c: 1.8, f: 0.2, unit: '100g', fiber: 1.8 },
    { name: 'Cà rốt', kcal: 41, p: 0.9, c: 10, f: 0.2, unit: '100g', fiber: 2.8 },
    { name: 'Cà chua', kcal: 18, p: 0.9, c: 3.9, f: 0.2, unit: '100g', fiber: 1.2 },
    { name: 'Dưa leo', kcal: 15, p: 0.7, c: 3.6, f: 0.1, unit: '100g', fiber: 0.5 },
  ],
  fat: [
    { name: 'Dầu olive', kcal: 119, p: 0, c: 0, f: 14, unit: '1 tbsp (14g)' },
    { name: 'Quả bơ', kcal: 160, p: 2, c: 9, f: 15, unit: '100g' },
    { name: 'Hạnh nhân', kcal: 170, p: 6, c: 6, f: 15, unit: '28g (1 nắm nhỏ)' },
    { name: 'Óc chó', kcal: 185, p: 4, c: 4, f: 18, unit: '28g' },
  ],
};

/* ── goal template meals ── */
const GOAL_MEALS = {
  maintain: {
    label: 'Sống khỏe / Giữ cân', color: '#22c55e', icon: '🌿',
    day: [
      { meal: 'Sáng (25–30%)', items: 'Yến mạch + sữa chua + chuối + 2 trứng', note: 'Nạp năng lượng ổn định đến trưa' },
      { meal: 'Trưa (35–40%)', items: 'Cơm + cá/ức gà + 2 nắm rau luộc + canh', note: 'Bữa chính nhiều dinh dưỡng nhất' },
      { meal: 'Phụ (10%)', items: 'Sữa chua Hy Lạp + trái cây hoặc hạt', note: 'Chống đói, không cần nếu không đói' },
      { meal: 'Tối (25–30%)', items: 'Đậu hũ/cá + nhiều rau + ít cơm/khoai', note: 'Nhẹ bụng, phục hồi, không ăn quá muộn' },
    ],
    rules: ['Không cần cân đo quá kỹ', 'Mỗi bữa có 1 nguồn protein', 'Ít nhất 2–3 bữa có rau', 'Uống 1.5–2L nước/ngày'],
  },
  lose: {
    label: 'Giảm mỡ', color: '#f43f5e', icon: '🔥',
    day: [
      { meal: 'Sáng (25%)', items: '2 trứng luộc + yến mạch không đường + rau', note: 'Protein cao ngay buổi sáng giúp no lâu' },
      { meal: 'Trưa (35%)', items: 'Ức gà/cá + salad rau lớn + ít cơm gạo lứt', note: 'Ưu tiên rau, protein, giảm tinh bột' },
      { meal: 'Phụ (10%)', items: 'Sữa chua không đường + dưa leo/cà rốt', note: 'Chống đói, chọn thực phẩm ít calories' },
      { meal: 'Tối (20–25%)', items: 'Cá/đậu hũ + nhiều rau + bỏ cơm hoặc ít', note: 'Bữa tối nhẹ nhất trong ngày' },
    ],
    rules: ['Giảm 10–20% calories so với TDEE', 'Protein cao hơn để giữ cơ', 'Tăng rau để no lâu', 'Cân 2–3 lần/tuần lấy trung bình'],
  },
  gain: {
    label: 'Tăng cơ', color: '#a855f7', icon: '💪',
    day: [
      { meal: 'Sáng (20–25%)', items: 'Yến mạch + 3 trứng + sữa + chuối + hạt', note: 'Nạp nhiều hơn để đủ calories tăng cơ' },
      { meal: 'Trưa (30–35%)', items: 'Cơm + thịt bò/gà + rau + canh protein', note: 'Bữa chính lớn nhất, đủ carb cho tập' },
      { meal: 'Phụ trước tập (10–15%)', items: 'Cơm/khoai + sữa/trứng — ăn 1–1.5h trước tập', note: 'Carb + protein trước tập để có sức' },
      { meal: 'Tối + sau tập (25–30%)', items: 'Protein shake/sữa + cơm/khoai + thịt + rau', note: 'Nạp ngay sau tập để phục hồi cơ' },
    ],
    rules: ['Tăng 5–10% so với TDEE', 'Protein 1.6–2.2 g/kg', 'Tăng carb quanh buổi tập', 'Theo dõi: tăng cân chậm, không tăng mỡ'],
  },
  athlete: {
    label: 'Tập nhiều / Hiệu suất', color: '#f59e0b', icon: '⚡',
    day: [
      { meal: 'Sáng (20–25%)', items: 'Yến mạch + 3–4 trứng + sữa + chuối', note: 'Nền năng lượng cao cho ngày tập dài' },
      { meal: 'Phụ sáng (10%)', items: 'Bánh mì nguyên cám + sữa chua + hạt', note: 'Giữ năng lượng ổn định giữa buổi' },
      { meal: 'Trưa (30%)', items: 'Cơm + protein lớn + rau + soup/canh', note: 'Bữa chính giàu carb và protein' },
      { meal: 'Trước/sau tập (10–15%)', items: 'Carb dễ tiêu trước; Protein + carb sau tập', note: 'Timing quan trọng cho hiệu suất' },
      { meal: 'Tối (20–25%)', items: 'Cá/thịt nạc + rau + cơm vừa phải', note: 'Phục hồi, không cắt calories đêm' },
    ],
    rules: ['Ngày tập nặng: tăng carb', 'Ngày nhẹ: giữ calories vừa', 'Không bỏ bữa', 'Tăng điện giải khi mồ hôi nhiều'],
  },
};

/* ── adjustment rules ── */
const ADJUST_RULES = [
  { situation: 'Cân không giảm sau 2 tuần', fix: 'Giảm 100–150 kcal/ngày hoặc tăng bước chân' },
  { situation: 'Đói nhiều', fix: 'Tăng rau, tăng protein, chia thêm bữa phụ' },
  { situation: 'Mệt khi tập', fix: 'Tăng carb trước/sau tập, kiểm tra giấc ngủ' },
  { situation: 'Tăng cân quá nhanh', fix: 'Giảm 100–200 kcal/ngày, theo dõi chặt hơn' },
  { situation: 'Bụng khó chịu', fix: 'Giảm chất béo trước tập, chọn carb dễ tiêu' },
  { situation: 'Ăn ngoài nhiều', fix: 'Quy tắc: protein rõ + rau + tinh bột vừa + ít nước sốt' },
  { situation: 'Ngủ kém', fix: 'Không cắt calories quá sâu, tránh ăn quá muộn' },
];

/* ── 10 criteria for a standard meal plan ── */
const CRITERIA_10 = [
  'Có thông tin cá nhân người dùng',
  'Có mục tiêu dinh dưỡng rõ ràng',
  'Có calories và macro cụ thể mỗi ngày',
  'Xác định số bữa/ngày phù hợp',
  'Có cấu trúc đĩa ăn (½ rau + ¼ protein + ¼ carb)',
  'Có danh sách món thay thế linh hoạt',
  'Điều chỉnh theo ngày tập / ngày nghỉ',
  'Có checklist hằng ngày để theo dõi',
  'Có báo cáo cuối tuần để đánh giá',
  'Có quy tắc chỉnh plan sau 1–2 tuần',
];

/* ── main component ── */
export default function NutritionTemplatePage() {
  const C = '#f43f5e';

  /* orbit ring */
  useEffect(() => {
    if (!document.getElementById(ORBIT_ID)) {
      const s = document.createElement('style'); s.id = ORBIT_ID; s.textContent = ORBIT_CSS;
      document.head.appendChild(s);
    }
    return () => { const s = document.getElementById(ORBIT_ID); if (s) s.remove(); };
  }, []);

  /* B0 personalized */
  const [b0, setB0] = useState(() => {
    try { return JSON.parse(localStorage.getItem(B0_KEY)) || {}; } catch { return {}; }
  });
  const nut = calcNutrition(b0);

  /* interactive calculator */
  const [calc, setCalc] = useState({ weight: 70, height: 170, age: 30, sex: 'male', activity: 'moderate', goal: 'maintain' });
  const calcNut = calcNutrition(calc);

  /* meal count selector */
  const [mealCount, setMealCount] = useState(4);

  /* active goal tab */
  const [activeGoal, setActiveGoal] = useState('maintain');

  /* food library tab */
  const [foodTab, setFoodTab] = useState('protein');

  /* weekly planner */
  const [weekPlan, setWeekPlan] = useState(DEFAULT_WEEK);
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  /* criteria checklist */
  const [criteriaChecked, setCriteriaChecked] = useState({});
  const toggleCriteria = (i) => setCriteriaChecked(p => ({ ...p, [i]: !p[i] }));
  const criteriaScore = CRITERIA_10.filter((_, i) => criteriaChecked[i]).length;

  /* macro donut state */
  const TOTAL_KCAL = calcNut.kcal || 2000;
  const pPct = Math.round((calcNut.protein * 4 / TOTAL_KCAL) * 100);
  const fPct = Math.round((calcNut.fat * 9 / TOTAL_KCAL) * 100);
  const cPct = 100 - pPct - fPct;

  /* donut arc helper */
  const donutArc = (pct, offset, r = 54) => {
    const circ = 2 * Math.PI * r;
    return { strokeDasharray: `${(pct / 100) * circ} ${circ}`, strokeDashoffset: -offset / 100 * circ };
  };

  /* plate chart slices */
  const PLATE = [{ label: 'Rau', pct: 50, color: '#4ade80' }, { label: 'Protein', pct: 25, color: '#f43f5e' }, { label: 'Carb', pct: 25, color: '#fb923c' }];
  const platePaths = () => {
    const r = 80, cx = 100, cy = 100; let a = -90;
    return PLATE.map(s => {
      const start = a; const end = a + (s.pct / 100) * 360; a = end;
      const startR = start * Math.PI / 180, endR = end * Math.PI / 180;
      const x1 = cx + r * Math.cos(startR), y1 = cy + r * Math.sin(startR);
      const x2 = cx + r * Math.cos(endR), y2 = cy + r * Math.sin(endR);
      const lg = s.pct > 50 ? 1 : 0;
      return { d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${lg} 1 ${x2},${y2} Z`, color: s.color, label: s.label, pct: s.pct };
    });
  };

  /* step 6 adjust by training day */
  const [trainDay, setTrainDay] = useState('heavy');
  const TRAIN_ADJUST = {
    heavy: { carb: '+40–60g', protein: 'Giữ nguyên', note: 'Thêm cơm/khoai trước & sau tập' },
    light: { carb: '−10–20g tối', protein: 'Giữ nguyên', note: 'Giảm tinh bột buổi tối' },
    cardio: { carb: '+20–30g', protein: 'Giữ nguyên', note: 'Thêm carb dễ tiêu trước tập dài' },
    rest: { carb: '−20–30g', protein: 'Giữ nguyên hoặc +10g', note: 'Ưu tiên rau + protein, ngủ nhiều' },
  };
  const adj = TRAIN_ADJUST[trainDay];

  const PLAN_STEPS = [
    { n: 1, title: 'Xác định mục tiêu', desc: 'Giảm mỡ / Tăng cơ / Giữ cân / Sống khỏe / Tập nhiều — mỗi mục tiêu ra một công thức khác nhau.', icon: '🎯' },
    { n: 2, title: 'Tính Calories (BMR → TDEE)', desc: 'Dùng Mifflin-St Jeor. Nhân hệ số vận động. Điều chỉnh theo mục tiêu (−20% giảm mỡ / +10% tăng cơ).', icon: '🔢' },
    { n: 3, title: 'Tính Protein trước', desc: 'Protein là macro ưu tiên số 1. 1.6–2.2 g/kg tùy mức độ tập và mục tiêu. Tính protein trước để giữ cơ.', icon: '🥩' },
    { n: 4, title: 'Chọn số bữa/ngày', desc: 'Người mới: 3 bữa. Người hay đói: 4 bữa. Người tập nhiều: 4–5 bữa. Chia đều % calories theo mẫu.', icon: '🍽️' },
    { n: 5, title: 'Gán món ăn cho từng bữa', desc: 'Mỗi bữa chính: 1 protein + 1 rau + 1 carb phù hợp + fat tốt vừa phải. Dùng thư viện món ăn chuẩn.', icon: '📋' },
    { n: 6, title: 'Điều chỉnh theo lịch tập', desc: 'Ngày nặng tăng carb. Ngày nghỉ giảm carb nhẹ. Ngày cardio dài thêm carb pre-workout.', icon: '📅' },
    { n: 7, title: 'Theo dõi 7 ngày', desc: 'Không đánh giá sau 1 ngày. Lấy trung bình tuần. Cân 2–3 lần/tuần sáng lúc đói. Điều chỉnh sau mỗi tuần.', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">

        {/* breadcrumb */}
        <Link to="/pillar/b" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-rose-400 transition-colors mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Nutrition &amp; Meal Plans
        </Link>

        {/* hero */}
        <div className="flex items-start gap-6 mb-10 relative">
          <div className="absolute -top-8 -left-8 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="w-20 h-20 rounded-3xl text-4xl flex items-center justify-center bg-surface border border-rose-500/20 shrink-0 tm-float shadow-lg shadow-rose-500/10">📋</div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight tm-fade-up">Template Meal Plan</h1>
            <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: C, background: 'rgba(244,63,94,.08)', borderColor: 'rgba(244,63,94,.2)' }}>Chuẩn Cho Dự Án · Cá Nhân Hóa</span>
            <p className="text-muted text-base leading-relaxed max-w-2xl">Bộ template meal plan hoàn chỉnh — từ tính BMR/TDEE, chia macro, cấu trúc bữa ăn đến thư viện món, điều chỉnh theo lịch tập và báo cáo cuối tuần. Một bản đồ dinh dưỡng đủ khoa học và đủ linh hoạt để duy trì lâu dài.</p>
          </div>
        </div>

        {/* wide hero image */}
        <RevealBlock className="mb-12">
          <div className="tm-orbit-ring rounded-3xl p-[1.5px]">
            <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
              <img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80&auto=format&fit=crop" alt="Meal plan template" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: C, background: 'rgba(0,0,0,.6)', borderColor: 'rgba(244,63,94,.2)' }}>Template · Chuẩn Hóa · Linh Hoạt</span>
              </div>
            </div>
          </div>
        </RevealBlock>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

        {/* B0 personalized banner */}
        {b0.weight && (
          <RevealBlock className="mb-10">
            <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: 'rgba(244,63,94,.2)', background: 'rgba(244,63,94,.04)' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border" style={{ color: C, borderColor: 'rgba(244,63,94,.3)' }}>✦ Dữ Liệu Cá Nhân B0</span>
                <span className="text-[10px] text-muted">Từ thông số đã nhập</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                  { label: 'BMR', val: `${nut.bmr}`, unit: 'kcal' },
                  { label: 'TDEE', val: `${nut.tdee}`, unit: 'kcal' },
                  { label: 'Mục tiêu', val: `${nut.kcal}`, unit: 'kcal/ngày' },
                  { label: 'Protein', val: `${nut.protein}`, unit: 'g/ngày' },
                  { label: 'Carb', val: `${nut.carb}`, unit: 'g/ngày' },
                  { label: 'Fat', val: `${nut.fat}`, unit: 'g/ngày' },
                ].map(s => (
                  <div key={s.label} className="text-center p-3 rounded-xl bg-surface border border-border">
                    <div className="text-lg font-black" style={{ color: C }}>{s.val}</div>
                    <div className="text-[9px] text-muted uppercase tracking-widest">{s.label}</div>
                    <div className="text-[9px] text-muted">{s.unit}</div>
                  </div>
                ))}
              </div>
            </div>
          </RevealBlock>
        )}

        {/* ── SECTION 1: Interactive Calculator ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-2" style={{ color: C }}>1. Máy Tính Dinh Dưỡng Cá Nhân</h2>
          <p className="text-muted text-sm mb-6 leading-relaxed">Nhập thông số của bạn để tính BMR, TDEE và macro chuẩn theo mục tiêu. Công thức Mifflin-St Jeor — tiêu chuẩn quốc tế.</p>

          <div className="rounded-2xl border border-border bg-surface p-5 md:p-6 space-y-5">
            {/* inputs row 1 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'weight', label: 'Cân nặng (kg)', min: 40, max: 150, step: 1 },
                { key: 'height', label: 'Chiều cao (cm)', min: 140, max: 210, step: 1 },
                { key: 'age', label: 'Tuổi', min: 15, max: 80, step: 1 },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">{f.label}</label>
                  <div className="flex items-center gap-2">
                    <input type="range" min={f.min} max={f.max} step={f.step} value={calc[f.key]}
                      onChange={e => setCalc(p => ({ ...p, [f.key]: +e.target.value }))}
                      className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: C }} />
                    <span className="text-sm font-bold min-w-[36px] text-right" style={{ color: C }}>{calc[f.key]}</span>
                  </div>
                </div>
              ))}
              <div>
                <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Giới tính</label>
                <div className="flex gap-2">
                  {['male', 'female'].map(s => (
                    <button key={s} onClick={() => setCalc(p => ({ ...p, sex: s }))}
                      className="flex-1 text-xs py-1.5 rounded-lg border font-semibold transition-all"
                      style={{ borderColor: calc.sex === s ? C : 'transparent', background: calc.sex === s ? `rgba(244,63,94,.15)` : 'rgba(255,255,255,.05)', color: calc.sex === s ? C : '#6b7280' }}>
                      {s === 'male' ? 'Nam' : 'Nữ'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* activity + goal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Mức vận động</label>
                <select value={calc.activity} onChange={e => setCalc(p => ({ ...p, activity: e.target.value }))}
                  className="w-full text-xs rounded-lg border border-border bg-bg px-3 py-2 text-text focus:outline-none focus:border-rose-500">
                  {Object.entries(ACT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Mục tiêu</label>
                <select value={calc.goal} onChange={e => setCalc(p => ({ ...p, goal: e.target.value }))}
                  className="w-full text-xs rounded-lg border border-border bg-bg px-3 py-2 text-text focus:outline-none focus:border-rose-500">
                  {Object.entries(GOAL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>

            {/* results */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 pt-2 border-t border-border">
              {[
                { label: 'BMR', val: calcNut.bmr, unit: 'kcal', tip: 'Năng lượng tối thiểu khi nghỉ ngơi hoàn toàn' },
                { label: 'TDEE', val: calcNut.tdee, unit: 'kcal', tip: 'Tổng năng lượng tiêu thụ mỗi ngày' },
                { label: 'Mục tiêu', val: calcNut.kcal, unit: 'kcal', tip: 'Calories cần ăn mỗi ngày theo mục tiêu' },
                { label: 'Protein', val: `${calcNut.protein}g`, unit: '', tip: `${(calcNut.protein * 4)}kcal · ${pPct}% tổng` },
                { label: 'Carb', val: `${calcNut.carb}g`, unit: '', tip: `${(calcNut.carb * 4)}kcal · ${cPct}% tổng` },
                { label: 'Fat', val: `${calcNut.fat}g`, unit: '', tip: `${(calcNut.fat * 9)}kcal · ${fPct}% tổng` },
              ].map(s => (
                <div key={s.label} title={s.tip} className="text-center p-3 rounded-xl bg-bg border border-border hover:border-rose-500/30 transition-colors cursor-help">
                  <div className="text-xl font-black tm-count" style={{ color: C }}>{s.val}</div>
                  <div className="text-[8px] text-muted uppercase tracking-widest">{s.label}</div>
                  {s.unit && <div className="text-[8px] text-muted">{s.unit}</div>}
                </div>
              ))}
            </div>

            {/* macro donut */}
            <div className="flex flex-col md:flex-row items-center gap-6 pt-2 border-t border-border">
              <div className="shrink-0">
                <svg viewBox="0 0 140 140" width="140" height="140">
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#1f2937" strokeWidth="16" />
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#f43f5e" strokeWidth="16"
                    strokeDasharray={`${(pPct / 100) * 339.3} 339.3`} strokeDashoffset="84.8" strokeLinecap="round" style={{ transformOrigin: '70px 70px', transform: 'rotate(-90deg)' }} />
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#fb923c" strokeWidth="16"
                    strokeDasharray={`${(cPct / 100) * 339.3} 339.3`} strokeDashoffset={`${-(pPct / 100) * 339.3 + 84.8}`} strokeLinecap="round" style={{ transformOrigin: '70px 70px', transform: 'rotate(-90deg)' }} />
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#facc15" strokeWidth="16"
                    strokeDasharray={`${(fPct / 100) * 339.3} 339.3`} strokeDashoffset={`${-((pPct + cPct) / 100) * 339.3 + 84.8}`} strokeLinecap="round" style={{ transformOrigin: '70px 70px', transform: 'rotate(-90deg)' }} />
                  <text x="70" y="65" textAnchor="middle" fill={C} fontSize="18" fontWeight="bold">{calcNut.kcal}</text>
                  <text x="70" y="81" textAnchor="middle" fill="#6b7280" fontSize="9">kcal/ngày</text>
                </svg>
              </div>
              <div className="flex-1 space-y-3">
                {[
                  { label: 'Protein', val: calcNut.protein, unit: 'g', pct: pPct, color: '#f43f5e', kcal: calcNut.protein * 4 },
                  { label: 'Carbohydrate', val: calcNut.carb, unit: 'g', pct: cPct, color: '#fb923c', kcal: calcNut.carb * 4 },
                  { label: 'Fat', val: calcNut.fat, unit: 'g', pct: fPct, color: '#facc15', kcal: calcNut.fat * 9 },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold" style={{ color: m.color }}>{m.label}</span>
                      <span className="text-muted">{m.val}g · {m.kcal}kcal · {m.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700 tm-bar" style={{ width: `${m.pct}%`, '--tw': `${m.pct}%`, background: m.color }} />
                    </div>
                  </div>
                ))}
                <p className="text-[10px] text-muted pt-1 leading-relaxed">Protein = 4 kcal/g · Carb = 4 kcal/g · Fat = 9 kcal/g</p>
              </div>
            </div>
          </div>
        </RevealBlock>

        {/* ── SECTION 2: Meal Distribution ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-2" style={{ color: C }}>2. Chia Bữa Ăn Trong Ngày</h2>
          <p className="text-muted text-sm mb-6">Chọn số bữa phù hợp lối sống — mỗi mô hình có ưu điểm riêng. Không có mô hình nào tốt hơn tuyệt đối, quan trọng là bạn duy trì được.</p>

          <div className="flex gap-2 mb-5">
            {[3, 4, 5].map(n => (
              <button key={n} onClick={() => setMealCount(n)}
                className="flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all"
                style={{ borderColor: mealCount === n ? C : 'transparent', background: mealCount === n ? `rgba(244,63,94,.12)` : 'rgba(255,255,255,.04)', color: mealCount === n ? C : '#9ca3af' }}>
                {n} bữa/ngày
              </button>
            ))}
          </div>

          {mealCount === 3 && (
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs text-muted mb-4">Phù hợp: người bận rộn, mới bắt đầu, không thích ăn vặt.</p>
              <div className="space-y-2">
                {[{ meal: 'Sáng', pct: 28, kcal: Math.round(calcNut.kcal * 0.28), icon: '🌅', color: '#fb923c' }, { meal: 'Trưa', pct: 38, kcal: Math.round(calcNut.kcal * 0.38), icon: '☀️', color: '#f43f5e' }, { meal: 'Tối', pct: 33, kcal: Math.round(calcNut.kcal * 0.33), icon: '🌙', color: '#a855f7' }].map(m => (
                  <div key={m.meal} className="flex items-center gap-3">
                    <span className="text-lg w-8 text-center shrink-0">{m.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1"><span className="font-semibold" style={{ color: m.color }}>{m.meal}</span><span className="text-muted">{m.pct}% · {m.kcal} kcal</span></div>
                      <div className="h-2.5 rounded-full bg-bg overflow-hidden"><div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: m.color }} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mealCount === 4 && (
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs text-muted mb-4">Phù hợp: người tập thể dục, dễ đói, cần kiểm soát năng lượng tốt hơn.</p>
              <div className="space-y-2">
                {[{ meal: 'Sáng', pct: 25, icon: '🌅', color: '#fb923c' }, { meal: 'Trưa', pct: 35, icon: '☀️', color: '#f43f5e' }, { meal: 'Phụ chiều', pct: 12, icon: '⚡', color: '#facc15' }, { meal: 'Tối', pct: 28, icon: '🌙', color: '#a855f7' }].map(m => (
                  <div key={m.meal} className="flex items-center gap-3">
                    <span className="text-lg w-8 text-center shrink-0">{m.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1"><span className="font-semibold" style={{ color: m.color }}>{m.meal}</span><span className="text-muted">{m.pct}% · {Math.round(calcNut.kcal * m.pct / 100)} kcal</span></div>
                      <div className="h-2.5 rounded-full bg-bg overflow-hidden"><div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: m.color }} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mealCount === 5 && (
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs text-muted mb-4">Phù hợp: người tập nhiều, cần nạp trước/sau tập để đảm bảo hiệu suất.</p>
              <div className="space-y-2">
                {[{ meal: 'Sáng', pct: 22, icon: '🌅', color: '#fb923c' }, { meal: 'Phụ sáng', pct: 10, icon: '🫐', color: '#22c55e' }, { meal: 'Trưa', pct: 30, icon: '☀️', color: '#f43f5e' }, { meal: 'Trước/Sau tập', pct: 13, icon: '⚡', color: '#facc15' }, { meal: 'Tối', pct: 25, icon: '🌙', color: '#a855f7' }].map(m => (
                  <div key={m.meal} className="flex items-center gap-3">
                    <span className="text-lg w-8 text-center shrink-0">{m.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1"><span className="font-semibold" style={{ color: m.color }}>{m.meal}</span><span className="text-muted">{m.pct}% · {Math.round(calcNut.kcal * m.pct / 100)} kcal</span></div>
                      <div className="h-2.5 rounded-full bg-bg overflow-hidden"><div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: m.color }} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </RevealBlock>

        {/* ── SECTION 3: Đĩa ăn ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-2" style={{ color: C }}>3. Cấu Trúc Đĩa Ăn Chuẩn</h2>
          <p className="text-muted text-sm mb-6">Không cần cân đo từng gram — chỉ cần nhìn vào đĩa. ½ rau + ¼ protein + ¼ carb tốt là công thức đơn giản nhất để ăn đủ chất.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col items-center">
              <svg viewBox="0 0 200 200" width="200" height="200" className="mb-4">
                <circle cx="100" cy="100" r="90" fill="#111827" />
                <circle cx="100" cy="100" r="90" fill="none" stroke="#1f2937" strokeWidth="2" />
                {platePaths().map((s, i) => <path key={i} d={s.d} fill={s.color} opacity={0.85} />)}
                {platePaths().map((s, i) => {
                  const mid = (-90 + (PLATE.slice(0, i).reduce((a, x) => a + x.pct, 0) + s.pct / 2) * 3.6) * Math.PI / 180;
                  return <text key={i} x={100 + 55 * Math.cos(mid)} y={100 + 55 * Math.sin(mid)} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">{s.label}</text>;
                })}
                {platePaths().map((s, i) => {
                  const mid = (-90 + (PLATE.slice(0, i).reduce((a, x) => a + x.pct, 0) + s.pct / 2) * 3.6) * Math.PI / 180;
                  return <text key={i} x={100 + 55 * Math.cos(mid)} y={100 + 55 * Math.sin(mid) + 12} textAnchor="middle" fill="rgba(255,255,255,.7)" fontSize="9">{s.pct}%</text>;
                })}
                <circle cx="100" cy="100" r="28" fill="#0a0a0a" />
                <text x="100" y="96" textAnchor="middle" fill="#6b7280" fontSize="9">Đĩa</text>
                <text x="100" y="107" textAnchor="middle" fill="#6b7280" fontSize="9">chuẩn</text>
              </svg>
              <div className="flex gap-4">
                {PLATE.map(s => <div key={s.label} className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ background: s.color }} /><span className="text-xs text-muted">{s.label} {s.pct}%</span></div>)}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
              {[
                { icon: '🥦', label: 'Rau & salad', desc: '½ đĩa', color: '#4ade80', examples: 'Cải xanh, bông cải, salad, canh rau, rau xào ít dầu' },
                { icon: '🍗', label: 'Protein nguồn', desc: '¼ đĩa', color: '#f43f5e', examples: 'Cá, ức gà, thịt nạc, trứng, đậu hũ, đậu lăng, tôm' },
                { icon: '🍚', label: 'Carb tốt', desc: '¼ đĩa', color: '#fb923c', examples: 'Cơm gạo lứt, khoai lang, bún/phở, yến mạch, bánh mì nguyên cám' },
                { icon: '🫒', label: 'Fat tốt', desc: '1 phần nhỏ', color: '#facc15', examples: 'Dầu olive, quả bơ, hạnh nhân, óc chó, cá béo' },
                { icon: '💧', label: 'Nước', desc: '1 ly 250ml', color: '#38bdf8', examples: 'Nước lọc, trà không đường — uống trước/trong bữa ăn' },
              ].map(r => (
                <div key={r.label} className="flex gap-3 p-3 rounded-xl border border-border hover:border-rose-500/20 transition-colors">
                  <span className="text-2xl shrink-0">{r.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold" style={{ color: r.color }}>{r.label}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${r.color}22`, color: r.color }}>{r.desc}</span>
                    </div>
                    <p className="text-[10px] text-muted">{r.examples}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealBlock>

        {/* ── SECTION 4: Goal-specific templates ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-2" style={{ color: C }}>4. Template Theo Mục Tiêu</h2>
          <p className="text-muted text-sm mb-6">Mỗi mục tiêu cần một chiến lược dinh dưỡng khác nhau. Chọn mục tiêu của bạn để xem bản mẫu thực đơn 1 ngày và nguyên tắc cốt lõi.</p>

          <div className="flex flex-wrap gap-2 mb-5">
            {Object.entries(GOAL_MEALS).map(([k, v]) => (
              <button key={k} onClick={() => setActiveGoal(k)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all"
                style={{ borderColor: activeGoal === k ? v.color : 'transparent', background: activeGoal === k ? `${v.color}18` : 'rgba(255,255,255,.04)', color: activeGoal === k ? v.color : '#9ca3af' }}>
                <span>{v.icon}</span> {v.label}
              </button>
            ))}
          </div>

          {(() => {
            const g = GOAL_MEALS[activeGoal];
            return (
              <div key={activeGoal} className="rounded-2xl border bg-surface overflow-hidden" style={{ borderColor: `${g.color}30` }}>
                {/* header */}
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black" style={{ color: g.color }}>{g.icon} {g.label}</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {g.rules.map((r, i) => <span key={i} className="text-[9px] px-2 py-0.5 rounded-full border" style={{ color: g.color, borderColor: `${g.color}30`, background: `${g.color}10` }}>{r}</span>)}
                    </div>
                  </div>
                </div>
                {/* day meals */}
                <div className="p-5 space-y-3">
                  {g.day.map((m, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl border border-border">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ background: `${g.color}20`, color: g.color }}>{i + 1}</div>
                      <div className="flex-1">
                        <div className="text-xs font-bold mb-1" style={{ color: g.color }}>{m.meal}</div>
                        <div className="text-sm text-text mb-1">{m.items}</div>
                        <div className="text-[10px] text-muted italic">{m.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* calorie summary */}
                <div className="px-5 pb-4">
                  <div className="p-3 rounded-xl border border-dashed text-xs text-muted text-center" style={{ borderColor: `${g.color}30` }}>
                    Dựa trên thông số của bạn: <strong style={{ color: g.color }}>{calcNut.kcal} kcal/ngày</strong> · Protein <strong style={{ color: g.color }}>{calcNut.protein}g</strong> · Carb <strong style={{ color: g.color }}>{calcNut.carb}g</strong> · Fat <strong style={{ color: g.color }}>{calcNut.fat}g</strong>
                  </div>
                </div>
              </div>
            );
          })()}
        </RevealBlock>

        {/* ── SECTION 5: Weekly Planner ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-2" style={{ color: C }}>5. Template Meal Plan Tuần</h2>
          <p className="text-muted text-sm mb-6">Lên kế hoạch bữa ăn cho cả tuần — điền vào ô, lưu lại làm tham chiếu. Giúp giảm quyết định hằng ngày và duy trì nhất quán.</p>

          <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            {/* day tabs */}
            <div className="flex overflow-x-auto border-b border-border">
              {WEEK_DAYS.map((d, i) => (
                <button key={d} onClick={() => setActiveDayIdx(i)}
                  className="shrink-0 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap"
                  style={{ borderBottomColor: activeDayIdx === i ? C : 'transparent', color: activeDayIdx === i ? C : '#6b7280' }}>
                  {d}
                </button>
              ))}
            </div>

            <div className="p-5 space-y-3">
              {MEAL_TYPES.map(mt => (
                <div key={mt} className="flex gap-3 items-start">
                  <span className="text-xs font-bold pt-2 w-16 shrink-0" style={{ color: C }}>{mt}</span>
                  <input
                    value={weekPlan[WEEK_DAYS[activeDayIdx]][mt]}
                    onChange={e => setWeekPlan(p => ({ ...p, [WEEK_DAYS[activeDayIdx]]: { ...p[WEEK_DAYS[activeDayIdx]], [mt]: e.target.value } }))}
                    placeholder={`${mt}: điền món ăn...`}
                    className="flex-1 text-xs bg-bg border border-border rounded-xl px-3 py-2.5 text-text placeholder-muted focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
              ))}
            </div>

            {/* weekly summary bar */}
            <div className="px-5 pb-4 border-t border-border pt-3">
              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS.map((d, i) => {
                  const filled = Object.values(weekPlan[d]).filter(Boolean).length;
                  return (
                    <div key={d} onClick={() => setActiveDayIdx(i)}
                      className="flex flex-col items-center cursor-pointer px-2 py-1.5 rounded-lg transition-all hover:bg-rose-500/10"
                      style={{ opacity: i === activeDayIdx ? 1 : 0.6 }}>
                      <div className="text-[9px] text-muted mb-1">{d.replace('Thứ ', 'T')}</div>
                      <div className="flex gap-0.5">
                        {MEAL_TYPES.map(mt => (
                          <div key={mt} className="w-2 h-2 rounded-sm" style={{ background: weekPlan[d][mt] ? C : '#1f2937' }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </RevealBlock>

        {/* ── SECTION 6: Food Library ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-2" style={{ color: C }}>6. Thư Viện Món Ăn Chuẩn</h2>
          <p className="text-muted text-sm mb-6">Danh sách thực phẩm với đầy đủ macro — dùng để gán vào bữa ăn, hoán đổi linh hoạt và xây thực đơn cá nhân.</p>

          <div className="flex gap-2 mb-4 flex-wrap">
            {[['protein', '🥩 Protein'], ['carb', '🍚 Carb'], ['veg', '🥦 Rau/Quả'], ['fat', '🫒 Fat tốt']].map(([k, l]) => (
              <button key={k} onClick={() => setFoodTab(k)}
                className="px-3 py-1.5 rounded-xl border text-xs font-bold transition-all"
                style={{ borderColor: foodTab === k ? C : 'transparent', background: foodTab === k ? 'rgba(244,63,94,.12)' : 'rgba(255,255,255,.04)', color: foodTab === k ? C : '#9ca3af' }}>
                {l}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            <div className="grid grid-cols-5 gap-0 border-b border-border">
              {['Thực phẩm', 'Khẩu phần', 'Kcal', 'P/C/F (g)', 'Phù hợp'].map(h => (
                <div key={h} className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-muted border-r border-border last:border-r-0">{h}</div>
              ))}
            </div>
            {(FOOD_LIB[foodTab] || []).map((f, i) => (
              <div key={i} className="grid grid-cols-5 gap-0 border-b border-border last:border-b-0 hover:bg-rose-500/5 transition-colors">
                <div className="px-3 py-2.5 text-xs font-semibold text-text border-r border-border">{f.name}</div>
                <div className="px-3 py-2.5 text-[10px] text-muted border-r border-border">{f.unit}</div>
                <div className="px-3 py-2.5 text-[10px] font-bold border-r border-border" style={{ color: C }}>{f.kcal}</div>
                <div className="px-3 py-2.5 text-[10px] text-muted border-r border-border">
                  <span style={{ color: '#f43f5e' }}>{f.p}</span>/<span style={{ color: '#fb923c' }}>{f.c}</span>/<span style={{ color: '#facc15' }}>{f.f}</span>
                </div>
                <div className="px-3 py-2.5">
                  {f.goal ? (
                    <div className="flex flex-wrap gap-0.5">
                      {f.goal.map(g => <span key={g} className="text-[8px] px-1 py-0.5 rounded bg-rose-500/10 text-rose-400">{g}</span>)}
                    </div>
                  ) : (
                    <span className="text-[9px] text-muted">{f.fiber && `Chất xơ: ${f.fiber}g`}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted mt-2">P = Protein · C = Carb · F = Fat (gram). Nguồn: USDA FoodData Central + bảng thành phần thực phẩm Việt Nam.</p>
        </RevealBlock>

        {/* ── SECTION 7: Adjust by training day ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-2" style={{ color: C }}>7. Điều Chỉnh Theo Loại Ngày Tập</h2>
          <p className="text-muted text-sm mb-6">Không phải ngày nào cũng ăn giống nhau. Carb cycling đơn giản — tăng carb ngày nặng, giảm ngày nghỉ — tối ưu hiệu suất và phục hồi.</p>

          <div className="flex flex-wrap gap-2 mb-5">
            {[['heavy', '🏋️ Ngày tập nặng'], ['light', '🚶 Ngày tập nhẹ'], ['cardio', '🚴 Ngày cardio'], ['rest', '😴 Ngày nghỉ']].map(([k, l]) => (
              <button key={k} onClick={() => setTrainDay(k)}
                className="px-3 py-2 rounded-xl border text-xs font-bold transition-all"
                style={{ borderColor: trainDay === k ? C : 'transparent', background: trainDay === k ? 'rgba(244,63,94,.12)' : 'rgba(255,255,255,.04)', color: trainDay === k ? C : '#9ca3af' }}>
                {l}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border bg-surface p-5 grid grid-cols-1 md:grid-cols-3 gap-4" style={{ borderColor: 'rgba(244,63,94,.25)' }}>
            {[
              { label: 'Điều chỉnh Carb', val: adj.carb, icon: '🍚' },
              { label: 'Protein', val: adj.protein, icon: '🥩' },
              { label: 'Ghi chú thực tế', val: adj.note, icon: '📝' },
            ].map(r => (
              <div key={r.label} className="text-center p-4 rounded-xl bg-bg border border-border">
                <div className="text-2xl mb-2">{r.icon}</div>
                <div className="text-xs text-muted mb-1 uppercase tracking-widest">{r.label}</div>
                <div className="text-sm font-bold" style={{ color: C }}>{r.val}</div>
              </div>
            ))}
          </div>

          {/* visual timeline */}
          <div className="mt-5 rounded-2xl border border-border bg-surface p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Nhịp Tuần Mẫu (3 Sức Mạnh + 2 Cardio + 2 Nghỉ)</div>
            <div className="flex gap-2">
              {[
                { d: 'T2', type: 'heavy', icon: '🏋️' },
                { d: 'T3', type: 'cardio', icon: '🚴' },
                { d: 'T4', type: 'heavy', icon: '🏋️' },
                { d: 'T5', type: 'rest', icon: '😴' },
                { d: 'T6', type: 'heavy', icon: '🏋️' },
                { d: 'T7', type: 'cardio', icon: '🚴' },
                { d: 'CN', type: 'rest', icon: '😴' },
              ].map((d, i) => {
                const col = { heavy: '#f43f5e', cardio: '#3b82f6', rest: '#6b7280', light: '#22c55e' }[d.type];
                return (
                  <div key={i} className="flex-1 text-center">
                    <div className="text-lg mb-1">{d.icon}</div>
                    <div className="text-[9px] font-bold" style={{ color: col }}>{d.d}</div>
                    <div className="h-1 rounded-full mt-1" style={{ background: col }} />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-3 justify-center">
              {[['#f43f5e', 'Nặng: Carb cao'], ['#3b82f6', 'Cardio: Carb vừa'], ['#6b7280', 'Nghỉ: Carb thấp']].map(([c, l]) => (
                <div key={l} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} /><span className="text-[9px] text-muted">{l}</span></div>
              ))}
            </div>
          </div>
        </RevealBlock>

        {/* ── SECTION 8: 7-step personalization ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-2" style={{ color: C }}>8. Công Thức 7 Bước Tạo Meal Plan Cá Nhân</h2>
          <p className="text-muted text-sm mb-6">Từ thông số đến bữa ăn hoàn chỉnh — quy trình này giúp bạn tự xây dựng meal plan phù hợp mà không cần chuyên gia.</p>

          <div className="space-y-3">
            {PLAN_STEPS.map((s, i) => (
              <RevealBlock key={s.n} delay={i * 60}>
                <div className="flex gap-4 p-4 rounded-2xl border border-border bg-surface hover:border-rose-500/30 transition-all group">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-xl font-black border group-hover:scale-110 transition-transform" style={{ background: `rgba(244,63,94,.1)`, borderColor: 'rgba(244,63,94,.3)', color: C }}>{s.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(244,63,94,.1)', color: C }}>Bước {s.n}</span>
                      <span className="text-sm font-bold text-text">{s.title}</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </RevealBlock>
            ))}
          </div>
        </RevealBlock>

        {/* ── SECTION 9: Adjustment rules ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-2" style={{ color: C }}>9. Bảng Điều Chỉnh Hằng Tuần</h2>
          <p className="text-muted text-sm mb-6">Meal plan tốt nhất là meal plan bạn điều chỉnh được. Không có gì cứng nhắc — đây là những trường hợp thường gặp và cách xử lý.</p>

          <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            <div className="grid grid-cols-2 border-b border-border">
              <div className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted border-r border-border">Tình huống gặp phải</div>
              <div className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted">Cách điều chỉnh</div>
            </div>
            {ADJUST_RULES.map((r, i) => (
              <div key={i} className={`grid grid-cols-2 border-b border-border last:border-b-0 hover:bg-rose-500/5 transition-colors`}>
                <div className="px-4 py-3 text-xs text-text border-r border-border">{r.situation}</div>
                <div className="px-4 py-3 text-xs" style={{ color: C }}>{r.fix}</div>
              </div>
            ))}
          </div>
        </RevealBlock>

        {/* ── SECTION 10: 10 criteria ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-2" style={{ color: C }}>10. Checklist Meal Plan Đạt Chuẩn</h2>
          <p className="text-muted text-sm mb-6">Một meal plan đạt chuẩn phải có đủ 10 yếu tố. Tick vào những gì bạn đã có để biết còn thiếu gì.</p>

          <div className="rounded-2xl border border-border bg-surface p-5">
            {/* score gauge */}
            <div className="flex items-center gap-5 mb-5 pb-5 border-b border-border">
              <div className="relative shrink-0">
                <svg viewBox="0 0 120 120" width="100" height="100">
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#1f2937" strokeWidth="10" />
                  <circle cx="60" cy="60" r="48" fill="none" stroke={C} strokeWidth="10"
                    strokeDasharray={`${(criteriaScore / 10) * 301.6} 301.6`}
                    strokeDashoffset="75.4"
                    strokeLinecap="round"
                    style={{ transformOrigin: '60px 60px', transform: 'rotate(-90deg)', transition: 'stroke-dasharray .5s ease' }} />
                  <text x="60" y="57" textAnchor="middle" fill={C} fontSize="22" fontWeight="bold">{criteriaScore}</text>
                  <text x="60" y="71" textAnchor="middle" fill="#6b7280" fontSize="9">/10 yếu tố</text>
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold mb-1" style={{ color: C }}>
                  {criteriaScore >= 10 ? '🏆 Meal plan hoàn hảo!' : criteriaScore >= 7 ? '🌟 Gần đạt chuẩn' : criteriaScore >= 4 ? '📈 Đang xây dựng' : '🚀 Bắt đầu từ đây'}
                </div>
                <p className="text-xs text-muted">Click vào từng tiêu chí để đánh dấu đã có. Mục tiêu: đủ 10/10 cho một meal plan hoàn chỉnh.</p>
              </div>
            </div>

            <div className="space-y-2">
              {CRITERIA_10.map((c, i) => (
                <button key={i} onClick={() => toggleCriteria(i)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left hover:border-rose-500/30"
                  style={{ borderColor: criteriaChecked[i] ? 'rgba(244,63,94,.3)' : 'transparent', background: criteriaChecked[i] ? 'rgba(244,63,94,.06)' : 'rgba(255,255,255,.02)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center border shrink-0 transition-all"
                    style={{ background: criteriaChecked[i] ? C : 'transparent', borderColor: criteriaChecked[i] ? C : '#374151' }}>
                    {criteriaChecked[i] && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>}
                  </div>
                  <span className="text-xs" style={{ color: criteriaChecked[i] ? C : '#9ca3af' }}>
                    <span className="font-bold" style={{ color: criteriaChecked[i] ? C : '#6b7280' }}>{i + 1}.</span> {c}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </RevealBlock>

        {/* ── SECTION 11: Sample complete template ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-2" style={{ color: C }}>11. Mẫu Hoàn Chỉnh: Nam 48 Tuổi</h2>
          <p className="text-muted text-sm mb-6">Ví dụ thực tế từ tài liệu dự án — nam 48 tuổi, 1m75, 77kg, mục tiêu giảm mỡ nhẹ + sống khỏe + duy trì vận động.</p>

          <div className="rounded-2xl border bg-surface overflow-hidden" style={{ borderColor: 'rgba(244,63,94,.25)' }}>
            {/* profile */}
            <div className="px-5 py-4 border-b border-border" style={{ background: 'rgba(244,63,94,.04)' }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C }}>Hồ Sơ Người Dùng</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[['Tuổi', '48'], ['Chiều cao', '1m75'], ['Cân nặng', '77 kg'], ['Mục tiêu', 'Giảm mỡ nhẹ']].map(([k, v]) => (
                  <div key={k} className="text-center">
                    <div className="text-base font-black" style={{ color: C }}>{v}</div>
                    <div className="text-[9px] text-muted uppercase tracking-widest">{k}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* targets */}
            <div className="px-5 py-4 border-b border-border">
              <div className="text-xs font-bold uppercase tracking-widest mb-3 text-muted">Mục Tiêu Ngày</div>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {[
                  { k: 'Calories', v: '2.000–2.200', u: 'kcal' },
                  { k: 'Protein', v: '120–150', u: 'g' },
                  { k: 'Nước', v: '2.5–3', u: 'lít' },
                  { k: 'Số bữa', v: '4', u: 'bữa/ngày' },
                  { k: 'Carb', v: 'Theo ngày tập', u: '' },
                ].map(s => (
                  <div key={s.k} className="text-center p-2.5 rounded-xl bg-bg border border-border">
                    <div className="text-sm font-black" style={{ color: C }}>{s.v}</div>
                    <div className="text-[8px] text-muted uppercase mt-0.5">{s.k}</div>
                    {s.u && <div className="text-[8px] text-muted">{s.u}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* day meals */}
            <div className="px-5 py-4 border-b border-border">
              <div className="text-xs font-bold uppercase tracking-widest mb-3 text-muted">Ngày Mẫu</div>
              <div className="space-y-2">
                {[
                  { meal: '🌅 Sáng', food: 'Yến mạch + sữa chua + chuối + trứng luộc', kcal: 480, p: 32, c: 52, f: 12 },
                  { meal: '☀️ Trưa', food: 'Cơm + cá thu / ức gà + rau luộc + canh chua', kcal: 750, p: 48, c: 72, f: 16 },
                  { meal: '⚡ Phụ chiều', food: 'Sữa chua Hy Lạp + trứng luộc hoặc trái cây', kcal: 250, p: 22, c: 18, f: 5 },
                  { meal: '🌙 Tối', food: 'Đậu hũ / cá + nhiều rau xào + ít cơm / khoai', kcal: 600, p: 36, c: 42, f: 14 },
                ].map((m, i) => (
                  <div key={i} className="grid grid-cols-4 gap-0 rounded-xl overflow-hidden border border-border">
                    <div className="col-span-2 px-3 py-2.5 bg-bg border-r border-border">
                      <div className="text-xs font-bold mb-0.5" style={{ color: C }}>{m.meal}</div>
                      <div className="text-[10px] text-muted">{m.food}</div>
                    </div>
                    <div className="px-3 py-2.5 text-center border-r border-border">
                      <div className="text-sm font-black" style={{ color: C }}>{m.kcal}</div>
                      <div className="text-[8px] text-muted">kcal</div>
                    </div>
                    <div className="px-3 py-2.5 text-center">
                      <div className="text-[9px]"><span style={{ color: '#f43f5e' }}>P{m.p}</span> <span style={{ color: '#fb923c' }}>C{m.c}</span> <span style={{ color: '#facc15' }}>F{m.f}</span></div>
                      <div className="text-[8px] text-muted">g</div>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-4 gap-0 rounded-xl overflow-hidden border border-rose-500/30 bg-rose-500/5">
                  <div className="col-span-2 px-3 py-2.5 border-r border-rose-500/20">
                    <div className="text-xs font-black" style={{ color: C }}>Tổng ngày</div>
                  </div>
                  <div className="px-3 py-2.5 text-center border-r border-rose-500/20">
                    <div className="text-sm font-black" style={{ color: C }}>2.080</div>
                    <div className="text-[8px] text-muted">kcal</div>
                  </div>
                  <div className="px-3 py-2.5 text-center">
                    <div className="text-[9px]"><span style={{ color: '#f43f5e' }}>P138</span> <span style={{ color: '#fb923c' }}>C184</span> <span style={{ color: '#facc15' }}>F47</span></div>
                    <div className="text-[8px] text-muted">g</div>
                  </div>
                </div>
              </div>
            </div>

            {/* adjustments */}
            <div className="px-5 py-4">
              <div className="text-xs font-bold uppercase tracking-widest mb-3 text-muted">Điều Chỉnh Theo Tình Huống</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  { d: '🏋️ Ngày tập nặng', fix: 'Thêm 1 phần carb trước/sau tập (+120kcal)' },
                  { d: '😴 Ngày nghỉ', fix: 'Giữ protein, giảm tinh bột buổi tối' },
                  { d: '🍽️ Ngày ăn ngoài', fix: 'Chọn ít chiên, thêm rau, bỏ nước ngọt' },
                  { d: '😋 Ngày đói nhiều', fix: 'Tăng rau + protein, không tăng đồ ngọt' },
                ].map((r, i) => (
                  <div key={i} className="flex gap-2 p-3 rounded-xl border border-border text-xs">
                    <span className="font-bold shrink-0" style={{ color: C }}>{r.d}</span>
                    <span className="text-muted">→ {r.fix}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealBlock>

        {/* ── SECTION 12: Core formula ── */}
        <RevealBlock className="mb-12">
          <div className="rounded-2xl border p-6 text-center" style={{ borderColor: 'rgba(244,63,94,.3)', background: 'rgba(244,63,94,.04)' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-3 text-muted">Công Thức Lõi Của Dự Án</div>
            <div className="text-xl md:text-2xl font-black leading-relaxed" style={{ color: C }}>
              Meal Plan Tốt =<br />
              <span className="text-text">Đủ Protein</span> + <span className="text-text">Nhiều Rau</span> + <span className="text-text">Carb Đúng Lúc</span><br />
              + <span className="text-text">Fat Vừa Phải</span> + <span className="text-text">Đủ Nước</span> + <span className="text-text">Theo Dõi Đều</span> + <span style={{ color: C }}>Điều Chỉnh Linh Hoạt</span>
            </div>
            <div className="mt-4 text-xs text-muted">Nguyên tắc nền: ăn đủ – ăn đều – ăn thật – ăn linh hoạt – duy trì được lâu dài.</div>
          </div>
        </RevealBlock>

        {/* related sub-pages */}
        <RevealBlock className="mb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Khám Phá Thêm</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { to: '/pillar/b/checklist', icon: '✅', label: 'Checklist Hằng Ngày', color: '#10b981' },
              { to: '/pillar/b/12week', icon: '📅', label: '12 Tuần Roadmap', color: '#14b8a6' },
              { to: '/pillar/b/24week', icon: '🗓️', label: '24 Tuần Roadmap', color: '#f59e0b' },
              { to: '/pillar/b/goal-plan', icon: '🎯', label: 'Goal-based Plan', color: '#a855f7' },
              { to: '/pillar/b/7day', icon: '📋', label: 'Thực Đơn 7 Ngày', color: '#f97316' },
              { to: '/pillar/b/formula', icon: '🔢', label: 'Công Thức Tính', color: '#06b6d4' },
            ].map(l => (
              <Link key={l.to} to={l.to} className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-surface hover:border-rose-500/30 transition-all hover:-translate-y-0.5 text-xs font-semibold text-muted hover:text-text">
                <span className="text-lg">{l.icon}</span>
                <span style={{ color: l.color }}>{l.label}</span>
              </Link>
            ))}
          </div>
        </RevealBlock>

        <div className="text-center">
          <Link to="/pillar/b" className="inline-flex items-center gap-2 text-xs text-muted hover:text-rose-400 transition-colors">
            ← Quay lại Nutrition &amp; Meal Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
