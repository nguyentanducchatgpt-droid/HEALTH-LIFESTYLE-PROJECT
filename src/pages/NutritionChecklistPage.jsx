import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ThoughtBubble from '../components/ThoughtBubble';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getWeekKey() {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-${String(week).padStart(2, '0')}`;
}

function computeB0() {
  try {
    const raw = localStorage.getItem('healthapp_b0_inputs');
    if (!raw) throw new Error();
    const b = JSON.parse(raw);
    const w = parseFloat(b.w) || 70;
    const h = parseFloat(b.h) || 170;
    const age = parseInt(b.age) || 30;
    const sx = b.sx || 'male';
    const aMap = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
    const aFactor = aMap[b.a] || 1.55;
    const bmr = sx === 'female' ? 10 * w + 6.25 * h - 5 * age - 161 : 10 * w + 6.25 * h - 5 * age + 5;
    const tdee = Math.round(bmr * aFactor);
    const protein = Math.round(w * 1.9);
    const goalMap = { lose: 'Giảm mỡ', maintain: 'Duy trì', gain: 'Tăng cơ', recomp: 'Recomp', endurance: 'Sức bền', busy: 'Bận rộn' };
    return { w, h, age, sx, tdee, protein, goal: goalMap[b.goal] || 'Duy trì', water: w < 60 ? 1.8 : w < 80 ? 2.2 : 2.7, activity: b.a || 'moderate' };
  } catch {
    return { w: 70, h: 170, age: 30, sx: 'male', tdee: 2100, protein: 133, goal: 'Duy trì', water: 2.2, activity: 'moderate' };
  }
}

// ─── Constants ───────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0];
const STORAGE_KEY = `healthapp_daily_checklist_${today}`;

const SCORE_ITEMS = [
  { id: 'water',   label: 'Đủ nước',           pts: 10 },
  { id: 'protein', label: 'Đủ đạm',             pts: 20 },
  { id: 'veggie',  label: 'Đủ rau/chất xơ',    pts: 15 },
  { id: 'carb',    label: 'Tinh bột hợp lý',   pts: 10 },
  { id: 'plate',   label: 'Đĩa ăn dự án',      pts: 15 },
  { id: 'nosweet', label: 'Kiểm soát đồ ngọt', pts: 10 },
  { id: 'slow',    label: 'Ăn chậm',            pts:  5 },
  { id: 'postwod', label: 'Bữa sau tập',        pts: 10 },
  { id: 'prep',    label: 'Chuẩn bị ngày mai',  pts:  5 },
];

const DAY_TYPES = [
  { id: 'rest',     label: 'Ngày Nghỉ',  emoji: '😴', color: '#6b7280',
    desc: 'Không tập hoặc chỉ đi bộ nhẹ',
    eating: 'Tinh bột vừa phải, ưu tiên rau + đạm',
    carbGuide: '¼ đĩa tinh bột, không cần quá nhiều',
    kcalNote: 'Ăn gần TDEE hoặc hơi thấp hơn' },
  { id: 'light',    label: 'Tập Nhẹ',    emoji: '🚶', color: '#84cc16',
    desc: 'Đi bộ, mobility, tập 10–20 phút',
    eating: 'Ăn đủ đạm, tinh bột vừa',
    carbGuide: '¼ đĩa tinh bột, đủ dùng',
    kcalNote: 'Ăn gần TDEE' },
  { id: 'strength', label: 'Sức Mạnh',   emoji: '🏋️', color: '#14b8a6',
    desc: 'Gym, bodyweight, tạ, dây kháng lực',
    eating: 'Đạm đủ, tinh bột quanh buổi tập',
    carbGuide: '¼–⅓ đĩa tinh bột, ưu tiên trước/sau tập',
    kcalNote: 'TDEE + 100–200 kcal nếu tăng cơ' },
  { id: 'cardio',   label: 'Cardio',     emoji: '🏃', color: '#f59e0b',
    desc: 'Chạy, đạp xe, bơi, vận động kéo dài',
    eating: 'Tăng tinh bột thông minh',
    carbGuide: 'Có thể tăng tinh bột trước/sau tập, thêm điện giải',
    kcalNote: 'TDEE + 150–300 kcal nếu buổi dài' },
  { id: 'heavy',    label: 'Tập Nặng',   emoji: '⚡', color: '#ef4444',
    desc: '2 buổi/ngày hoặc cường độ cao',
    eating: 'Cần đủ kcal, carb, nước, điện giải',
    carbGuide: 'Tinh bột cao hơn ngày thường, có thể ⅓–½ đĩa',
    kcalNote: 'TDEE + 200–400 kcal tùy cường độ' },
];

const BREAKFAST_EXAMPLES = [
  { meal: 'Trứng + bánh mì nguyên cám + dưa leo', protein: 'Trứng', carb: 'Bánh mì', veg: 'Dưa leo' },
  { meal: 'Sữa chua Hy Lạp + yến mạch + chuối',  protein: 'Sữa chua', carb: 'Yến mạch', veg: 'Chuối' },
  { meal: 'Cơm + cá/thịt nạc + rau',              protein: 'Cá/thịt', carb: 'Cơm', veg: 'Rau' },
  { meal: 'Whey/sữa + chuối + hạt',               protein: 'Whey/sữa', carb: 'Chuối', veg: 'Thêm trái cây' },
];

const EAT_OUT_RULES = [
  { dish: 'Cơm tấm',         fix: 'Giữ thịt/trứng, thêm rau/canh, giảm bì/mỡ hành nếu cần' },
  { dish: 'Phở/bún',         fix: 'Thêm thịt/trứng, thêm rau, hạn chế nước béo' },
  { dish: 'Cơm văn phòng',   fix: 'Chọn thịt/cá/đậu + rau + cơm vừa' },
  { dish: 'Bánh mì',         fix: 'Thêm trứng/thịt nạc, thêm dưa leo/rau, hạn chế pate/sốt nếu giảm mỡ' },
  { dish: 'Bún thịt nướng',  fix: 'Thêm rau, kiểm soát nước mắm ngọt, không gọi thêm chả chiên quá nhiều' },
];

const SNACK_ALTS = [
  { when: 'Thèm ngọt',      better: 'Trái cây + sữa chua' },
  { when: 'Đói giữa buổi',  better: 'Trứng luộc, sữa, đậu hũ, sữa chua Hy Lạp' },
  { when: 'Muốn nhai gì đó', better: 'Hạt lượng nhỏ, trái cây, bắp luộc' },
  { when: 'Sau tập',         better: 'Chuối + sữa / whey + trái cây' },
  { when: 'Buổi tối',        better: 'Trà không đường, sữa ấm, sữa chua ít đường' },
];

const PREWORKOUT = [
  { time: 'Trước tập 2–3 giờ',    food: 'Cơm + thịt/cá + rau' },
  { time: 'Trước tập 60–90 phút', food: 'Chuối + sữa chua / bánh mì + trứng' },
  { time: 'Trước tập 30 phút',    food: 'Chuối / sữa / ít bánh mì nếu cần' },
];

const POSTWOD = [
  { goal: 'Giảm mỡ',   food: 'Gà/cá/trứng/đậu + rau + ít cơm/khoai' },
  { goal: 'Tăng cơ',   food: 'Đạm + tinh bột đầy đủ' },
  { goal: 'Sức bền',   food: 'Carb + đạm + nước/điện giải' },
  { goal: 'Người bận', food: 'Whey/sữa + chuối, sau đó ăn bữa chính' },
];

const WATER_LEVELS = [
  { who: 'Người mới, ít vận động',          target: '1.8–2.2 L', act: 'sedentary' },
  { who: 'Người tập 20–40 phút/ngày',       target: '2–2.7 L',   act: 'light' },
  { who: 'Người tập nhiều/ra mồ hôi nhiều', target: '2.7–4 L',   act: 'active' },
];

const LEVELS = [
  {
    id: 1, label: 'Level 1', sub: 'Người Mới', emoji: '🌱',
    desc: 'Chỉ cần tick 5 mục. Không cần cân đo kcal.',
    items: ['Uống đủ nước hơn hôm qua', 'Mỗi bữa chính có đạm', 'Ăn rau ít nhất 2 lần/ngày', 'Giảm 1 món ngọt/nước ngọt', 'Chuẩn bị 1 món tốt cho ngày mai'],
    color: '#22c55e',
  },
  {
    id: 2, label: 'Level 2', sub: 'Tập Đều', emoji: '🏃',
    desc: 'Tick 8 mục. Đã hiểu macro cơ bản.',
    items: ['Đạt mục tiêu protein', 'Đủ rau/chất xơ', 'Uống đủ nước', 'Tinh bột khớp với ngày tập', 'Có bữa trước/sau tập hợp lý', 'Không ăn vặt mất kiểm soát', 'Ăn ngoài quán vẫn theo quy tắc 3 chọn', 'Ghi log ngắn cuối ngày'],
    color: '#14b8a6',
  },
  {
    id: 3, label: 'Level 3', sub: 'Nâng Cao', emoji: '⚡',
    desc: 'Tick 13 mục. Tập nhiều, theo dõi chi tiết.',
    items: ['Đạt mục tiêu protein', 'Đủ rau/chất xơ', 'Uống đủ nước', 'Tinh bột khớp với ngày tập', 'Có bữa trước/sau tập hợp lý', 'Không ăn vặt mất kiểm soát', 'Ăn ngoài quán vẫn theo quy tắc 3 chọn', 'Ghi log ngắn cuối ngày', 'Kcal phù hợp ngày tập nặng/tập vừa/ngày nghỉ', 'Carb đủ cho buổi tập chính', 'Bù nước và điện giải khi tập dài', 'Có meal prep ít nhất 2 lần/tuần', 'Theo dõi cân nặng/vòng eo trung bình tuần'],
    color: '#f59e0b',
  },
];

const WEEKLY = [
  'Tuần này có ít nhất 5/7 ngày uống đủ nước không?',
  'Có ít nhất 5/7 ngày ăn đủ đạm không?',
  'Có ít nhất 5/7 ngày ăn rau không?',
  'Có meal prep hoặc chuẩn bị trước ít nhất 1–2 lần không?',
  'Có giảm được đồ ngọt/nước ngọt so với tuần trước không?',
  'Cân nặng/vòng eo/năng lượng có đi đúng hướng không?',
  'Có bữa nào "lỡ tay" và mình đã quay lại ngay bữa sau chưa?',
];

const VEGGIE_LEVELS = [
  { level: 'Beginner', target: '2 nắm rau/ngày' },
  { level: 'Standard', target: '3–4 nắm rau/ngày' },
  { level: 'Advanced', target: '4–5 nắm rau/ngày + 1–2 phần trái cây' },
];

const PROTEIN_GUIDE = [
  { who: 'Người mới',  amount: 'Mỗi bữa chính có 1 lòng bàn tay đạm' },
  { who: 'Giảm mỡ',   amount: '1–1.5 lòng bàn tay đạm/bữa' },
  { who: 'Tăng cơ',   amount: '1.5–2 lòng bàn tay đạm/bữa' },
  { who: 'Tập nhiều',  amount: 'Chia đạm thành 4–6 lần/ngày nếu cần' },
];

const HERO_STATS = [
  { n: '5',   label: 'Câu Hỏi/Ngày',  tip: 'Chỉ 5 câu hỏi cốt lõi mỗi sáng — không cần đếm calo, không cần app phức tạp.' },
  { n: '100', label: 'Điểm/Ngày',     tip: '100 điểm là mục tiêu tối đa. Người mới chỉ cần 70+ là thành công rồi.' },
  { n: '9',   label: 'Tiêu Chí',      tip: '9 tiêu chí được thiết kế để bao quát toàn bộ ngày ăn — từ sáng đến tối.' },
  { n: '70%', label: 'Mục Tiêu Mới',  tip: 'Người mới chỉ cần đạt 70 điểm (70%) là coi như ngày thành công. An toàn và thực tế.' },
];

const SECTION_TABS = [
  { id: 'A', label: 'Sáng' },
  { id: 'B', label: 'Bữa Chính' },
  { id: 'C', label: 'Tập Luyện' },
  { id: 'D', label: 'Nước' },
  { id: 'E', label: 'Ăn Vặt' },
  { id: 'F', label: 'Ăn Ngoài' },
  { id: 'G', label: 'Buổi Tối' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function RevealBlock({ children, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.06 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
}

function ScoreGauge({ score }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const tier =
    score >= 90 ? { label: 'Xuất Sắc 🏆', color: '#10b981' } :
    score >= 75 ? { label: 'Rất Tốt ⭐',   color: '#84cc16' } :
    score >= 60 ? { label: 'Đạt Yêu Cầu ✓', color: '#14b8a6' } :
    score >= 40 ? { label: 'Cần Chỉnh Nhẹ 📝', color: '#eab308' } :
                  { label: 'Bắt Đầu Thôi 💪', color: '#f97316' };
  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="180" style={{ overflow: 'visible' }}>
        <circle cx="90" cy="90" r={r} fill="none" stroke="#1f2937" strokeWidth="12" />
        <circle
          cx="90" cy="90" r={r}
          fill="none"
          stroke={tier.color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 90 90)"
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s' }}
          className={score >= 90 ? 'cl-pulse' : ''}
        />
        <text x="90" y="85" textAnchor="middle" fill="white" fontSize="36" fontWeight="900" fontFamily="system-ui">{score}</text>
        <text x="90" y="108" textAnchor="middle" fill="#6b7280" fontSize="14">/100</text>
      </svg>
      <div className="mt-2 text-base font-bold" style={{ color: tier.color }}>{tier.label}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NutritionChecklistPage() {
  const b0 = computeB0();

  // CSS injection
  useEffect(() => {
    if (document.getElementById('cl-orbit-kf')) return;
    const s = document.createElement('style');
    s.id = 'cl-orbit-kf';
    s.textContent = `
      @property --cl-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes clOrbitSpin { to { --cl-orbit-angle: 360deg; } }
      .cl-orbit-ring {
        background: conic-gradient(
          from var(--cl-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(16,185,129,0.0) 65deg, rgba(16,185,129,0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(16,185,129,0.75) 99deg,
          rgba(16,185,129,0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: clOrbitSpin 3.5s linear infinite;
      }
      @keyframes clFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      @keyframes clFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      @keyframes clCheck { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
      @keyframes clPulse { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0)} 50%{box-shadow:0 0 20px 6px rgba(16,185,129,0.3)} }
      .cl-float { animation: clFloat 3.2s ease-in-out infinite; }
      .cl-fade-up { animation: clFadeUp 0.6s ease-out both; }
      .cl-pulse { animation: clPulse 2s ease-in-out infinite; }
      .cl-check-bounce { animation: clCheck 0.25s ease-out; }
      .cl-section-tab.active { background: rgba(16,185,129,0.15); border-color: rgba(16,185,129,0.5); color: #10b981; }
      .cl-section-tab { border-color: rgba(255,255,255,0.08); color: #6b7280; }
      .cl-section-tab:hover { border-color: rgba(16,185,129,0.3); color: #10b981; }
    `;
    document.head.appendChild(s);
  }, []);

  // Daily checklist state
  const [checks, setChecks] = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(checks)); }, [checks]);
  const toggle = (id) => setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  const [resetConfirm, setResetConfirm] = useState(false);

  const score = SCORE_ITEMS.reduce((s, item) => s + (checks[item.id] ? item.pts : 0), 0);

  // Day type
  const [dayType, setDayType] = useState('rest');
  const activeDayType = DAY_TYPES.find(d => d.id === dayType);

  // Section tabs
  const [activeTab, setActiveTab] = useState('A');

  // Level selector
  const [activeLevel, setActiveLevel] = useState(null);
  const [levelChecks, setLevelChecks] = useState(() => {
    try { const s = localStorage.getItem('healthapp_level_checks'); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const toggleLevel = (key) => setLevelChecks(prev => {
    const next = { ...prev, [key]: !prev[key] };
    localStorage.setItem('healthapp_level_checks', JSON.stringify(next));
    return next;
  });

  // Section tab sub-checks (A–G)
  const [tabChecks, setTabChecks] = useState(() => {
    try { const s = localStorage.getItem(`healthapp_tab_checks_${today}`); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const toggleTabCheck = (key) => setTabChecks(prev => {
    const next = { ...prev, [key]: !prev[key] };
    localStorage.setItem(`healthapp_tab_checks_${today}`, JSON.stringify(next));
    return next;
  });

  // Water tracker
  const [waterCount, setWaterCount] = useState(() => {
    try { return parseInt(localStorage.getItem(`healthapp_water_${today}`)) || 0; } catch { return 0; }
  });
  const setWater = (n) => { setWaterCount(n); localStorage.setItem(`healthapp_water_${today}`, String(n)); };

  // Weekly checklist
  const weekKey = getWeekKey();
  const [weeklyChecks, setWeeklyChecks] = useState(() => {
    try { const s = localStorage.getItem(`healthapp_weekly_checklist_${weekKey}`); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const toggleWeekly = (i) => setWeeklyChecks(prev => {
    const next = { ...prev, [i]: !prev[i] };
    localStorage.setItem(`healthapp_weekly_checklist_${weekKey}`, JSON.stringify(next));
    return next;
  });
  const weeklyCount = WEEKLY.filter((_, i) => weeklyChecks[i]).length;

  // Snack accordion
  const [snackOpen, setSnackOpen] = useState(null);

  const todayFormatted = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">

      {/* Breadcrumb */}
      <Link to="/pillar/b" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-emerald-400 transition-colors mb-8">
        ← Dinh Dưỡng
      </Link>

      {/* Hero Row */}
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(16,185,129,0.05)' }} />
        <div className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center bg-surface border border-emerald-500/20 shrink-0 cl-float">
          ✅
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight cl-fade-up">
            Checklist Nutrition <span className="text-emerald-400">Hằng Ngày</span>
          </h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest text-emerald-400 mt-3 mb-4 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            Daily Tracking · 9 Tiêu Chí · 100 Điểm
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Không bắt bạn ăn hoàn hảo — chỉ giúp bạn trả lời 5 câu hỏi mỗi ngày. Người mới chỉ cần đạt 70% là thành công. An toàn – thực tế – tối ưu theo thói quen.
          </p>
        </div>
      </div>

      {/* Hero Image */}
      <div className="cl-orbit-ring rounded-3xl p-[1.5px] mb-12">
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=80&auto=format&fit=crop"
            alt="Daily nutrition checklist"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-emerald-400 text-sm font-bold uppercase tracking-widest bg-bg/60 px-3 py-1 rounded-full border border-emerald-500/20">
            Checklist · Hằng Ngày
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* ── Section 0: Hero Stats ─────────────────────────────────────────── */}
      <RevealBlock className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {HERO_STATS.map((s, i) => (
            <div key={i} className="group/stat relative flex flex-col items-center py-5 px-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/5">
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none
                opacity-0 group-hover/stat:opacity-100
                scale-90 group-hover/stat:scale-100
                -translate-y-1 group-hover/stat:translate-y-0
                transition-all duration-200 origin-bottom">
                <ThoughtBubble text={s.tip} idx={`hero-stat-${i}`} color="#10b981" />
              </div>
              <span className="text-4xl font-black text-emerald-400">{s.n}</span>
              <span className="text-[10px] text-muted uppercase tracking-widest mt-1 text-center">{s.label}</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* ── Section 1: Personalized Banner ───────────────────────────────── */}
      <RevealBlock className="mb-10">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Cá Nhân Hóa Từ B0</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {[
              { label: 'Protein mục tiêu', value: `${b0.protein}g` },
              { label: 'Nước hằng ngày',   value: `${b0.water}L` },
              { label: 'TDEE',             value: `${b0.tdee} kcal` },
              { label: 'Mục tiêu',         value: b0.goal },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-emerald-500/10 bg-bg/40 p-3 text-center">
                <div className="text-emerald-400 font-black text-xl">{item.value}</div>
                <div className="text-[10px] text-muted mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted italic">Checklist đã tính toán cho bạn dựa trên thông số B0.</p>
        </div>
      </RevealBlock>

      {/* ── Section 2: Day Type Selector ─────────────────────────────────── */}
      <RevealBlock className="mb-10">
        <div className="mb-4">
          <p className="text-sm font-bold text-muted uppercase tracking-widest mb-3">Hôm Nay Là Ngày Gì?</p>
          <div className="flex gap-2 flex-wrap">
            {DAY_TYPES.map(dt => (
              <button
                key={dt.id}
                onClick={() => setDayType(dt.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-all duration-200"
                style={{
                  borderColor: dayType === dt.id ? dt.color : 'rgba(255,255,255,0.1)',
                  background: dayType === dt.id ? `${dt.color}18` : 'transparent',
                  color: dayType === dt.id ? dt.color : '#6b7280',
                  borderBottomWidth: dayType === dt.id ? '2px' : '1px',
                }}
              >
                <span>{dt.emoji}</span> {dt.label}
              </button>
            ))}
          </div>
        </div>
        {activeDayType && (
          <div className="rounded-2xl border p-5 transition-all duration-300" style={{ borderColor: `${activeDayType.color}30`, background: `${activeDayType.color}08` }}>
            <p className="text-sm font-bold mb-3" style={{ color: activeDayType.color }}>Gợi Ý Hôm Nay — {activeDayType.label} {activeDayType.emoji}</p>
            <p className="text-[11px] text-muted mb-2">{activeDayType.desc}</p>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { label: 'Chiến lược ăn', val: activeDayType.eating },
                { label: 'Hướng dẫn carb', val: activeDayType.carbGuide },
                { label: 'Kcal tham khảo', val: activeDayType.kcalNote },
              ].map((g, i) => (
                <div key={i} className="rounded-xl bg-bg/40 border border-white/5 p-3">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-muted mb-1">{g.label}</div>
                  <div className="text-[11px] text-text">{g.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </RevealBlock>

      {/* ── Section 3: Main Daily Checklist Score ────────────────────────── */}
      <RevealBlock className="mb-10">
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Điểm Hôm Nay</p>
              <p className="text-[10px] text-muted mt-0.5">{todayFormatted}</p>
            </div>
            {resetConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted">Xác nhận reset?</span>
                <button onClick={() => { setChecks({}); setResetConfirm(false); }} className="text-[10px] font-bold text-red-400 border border-red-400/30 rounded-lg px-2.5 py-1 hover:bg-red-400/10 transition-colors">Đồng ý</button>
                <button onClick={() => setResetConfirm(false)} className="text-[10px] text-muted border border-border/30 rounded-lg px-2.5 py-1 hover:bg-white/5 transition-colors">Hủy</button>
              </div>
            ) : (
              <button onClick={() => setResetConfirm(true)} className="text-[10px] text-muted border border-border/20 rounded-lg px-3 py-1.5 hover:border-red-400/30 hover:text-red-400 transition-all">
                Reset Hôm Nay
              </button>
            )}
          </div>

          {/* Gauge + grid */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center shrink-0 md:pt-4">
              <ScoreGauge score={score} />
              <p className="text-[10px] text-muted mt-3 text-center">
                {SCORE_ITEMS.filter(i => checks[i.id]).length}/{SCORE_ITEMS.length} tiêu chí · {score}/100 điểm
              </p>
              {score >= 70 && (
                <div className="mt-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                  <span className="text-[10px] font-bold text-emerald-400">Thành công hôm nay!</span>
                </div>
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SCORE_ITEMS.map((item) => {
                const checked = !!checks[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200"
                    style={{
                      borderColor: checked ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)',
                      background: checked ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                      style={{ borderColor: checked ? '#10b981' : '#374151', background: checked ? '#10b981' : 'transparent' }}>
                      {checked && <span className="text-bg text-sm font-black cl-check-bounce">✓</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-text leading-tight">{item.label}</p>
                    </div>
                    <span className="text-[9px] font-bold rounded-full px-1.5 py-0.5 shrink-0"
                      style={{ background: checked ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', color: checked ? '#10b981' : '#4b5563' }}>
                      +{item.pts}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* ── Section 4: 7-Tab Detailed Checklist ─────────────────────────── */}
      <RevealBlock className="mb-10">
        <p className="text-sm font-bold text-muted uppercase tracking-widest mb-4">Checklist Chi Tiết Theo Buổi</p>
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
          {SECTION_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`cl-section-tab flex-shrink-0 px-3.5 py-2 rounded-xl border text-[11px] font-bold transition-all duration-200 ${activeTab === t.id ? 'active' : ''}`}
            >
              {t.id}. {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.018] p-5">

          {/* Tab A — Sáng */}
          {activeTab === 'A' && (
            <div className="space-y-5">
              <p className="text-sm font-bold text-emerald-400">Checklist Buổi Sáng</p>
              <div className="grid md:grid-cols-3 gap-2">
                {['Uống 1–2 ly nước ngay khi thức dậy', 'Không bỏ bữa sáng liên tục', 'Bữa sáng có đạm (trứng / sữa / đậu)'].map((item, i) => (
                  <button key={i} onClick={() => toggleTabCheck(`A_water_${i}`)}
                    className="flex items-center gap-2 p-3 rounded-xl border text-left transition-all duration-200"
                    style={{ borderColor: tabChecks[`A_water_${i}`] ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)', background: tabChecks[`A_water_${i}`] ? 'rgba(16,185,129,0.1)' : 'transparent' }}>
                    <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0" style={{ borderColor: tabChecks[`A_water_${i}`] ? '#10b981' : '#374151', background: tabChecks[`A_water_${i}`] ? '#10b981' : 'transparent' }}>
                      {tabChecks[`A_water_${i}`] && <span className="text-bg text-[8px] font-black">✓</span>}
                    </div>
                    <span className="text-[11px] text-text">{item}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Ví Dụ Bữa Sáng Đủ Macro</p>
              <div className="rounded-xl border border-white/8 overflow-hidden">
                <table className="w-full text-[10px]">
                  <thead><tr className="border-b border-white/8">
                    <th className="text-left p-2.5 text-muted font-bold">Bữa Sáng</th>
                    <th className="text-center p-2.5 text-emerald-400 font-bold">Đạm</th>
                    <th className="text-center p-2.5 text-orange-400 font-bold">Carb</th>
                    <th className="text-center p-2.5 text-green-400 font-bold">Rau</th>
                  </tr></thead>
                  <tbody>
                    {BREAKFAST_EXAMPLES.map((ex, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="p-2.5 text-text">{ex.meal}</td>
                        <td className="p-2.5 text-center text-emerald-400">{ex.protein}</td>
                        <td className="p-2.5 text-center text-orange-400">{ex.carb}</td>
                        <td className="p-2.5 text-center text-green-400">{ex.veg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['Không uống cà phê thay bữa sáng', 'Bữa sáng trong vòng 1–2h sau khi thức', 'Có đủ 3 nhóm: đạm + tinh bột + rau/quả', 'Ăn chậm, không vừa ăn vừa làm việc'].map((item, i) => (
                  <button key={i} onClick={() => toggleTabCheck(`A_mini_${i}`)}
                    className="flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all duration-200"
                    style={{ borderColor: tabChecks[`A_mini_${i}`] ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)', background: tabChecks[`A_mini_${i}`] ? 'rgba(16,185,129,0.08)' : 'transparent' }}>
                    <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0" style={{ borderColor: tabChecks[`A_mini_${i}`] ? '#10b981' : '#374151', background: tabChecks[`A_mini_${i}`] ? '#10b981' : 'transparent' }}>
                      {tabChecks[`A_mini_${i}`] && <span className="text-bg text-[8px] font-black">✓</span>}
                    </div>
                    <span className="text-[10px] text-text">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab B — Bữa Chính */}
          {activeTab === 'B' && (
            <div className="space-y-5">
              <p className="text-sm font-bold text-emerald-400">Mỗi Bữa Chính</p>
              {/* Plate diagram */}
              <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">Đĩa Ăn Cân Bằng</p>
                <div className="flex gap-3">
                  {[
                    { label: '½ Rau/Xanh', pct: 50, color: '#22c55e' },
                    { label: '¼ Đạm',       pct: 25, color: '#10b981' },
                    { label: '¼ Tinh bột',  pct: 25, color: '#f97316' },
                  ].map((seg, i) => (
                    <div key={i} className="flex-1 text-center">
                      <div className="h-3 rounded-full mb-1.5" style={{ background: seg.color, opacity: 0.7 + i * 0.1 }} />
                      <div className="text-[9px] font-bold" style={{ color: seg.color }}>{seg.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Protein guide */}
              <div>
                <p className="text-[10px] font-bold text-muted mb-2">Lượng Đạm Theo Mục Tiêu</p>
                <div className="space-y-1.5">
                  {PROTEIN_GUIDE.map((row, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.025] border border-white/5">
                      <span className="text-[10px] font-bold text-emerald-400 w-20 shrink-0">{row.who}</span>
                      <span className="text-[10px] text-muted">{row.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Veggie levels */}
              <div>
                <p className="text-[10px] font-bold text-muted mb-2">Rau Theo Cấp Độ</p>
                <div className="space-y-1.5">
                  {VEGGIE_LEVELS.map((vl, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.025] border border-white/5">
                      <span className="text-[10px] font-bold text-green-400 w-20 shrink-0">{vl.level}</span>
                      <span className="text-[10px] text-muted">{vl.target}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Carb guide by day type */}
              <div>
                <p className="text-[10px] font-bold text-muted mb-2">Tinh Bột Theo Ngày Tập</p>
                <div className="space-y-1.5">
                  {DAY_TYPES.map((dt) => (
                    <div key={dt.id} className="flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-200"
                      style={{ borderColor: dt.id === dayType ? `${dt.color}40` : 'rgba(255,255,255,0.05)', background: dt.id === dayType ? `${dt.color}10` : 'rgba(255,255,255,0.015)' }}>
                      <span className="text-lg w-6 shrink-0">{dt.emoji}</span>
                      <span className="text-[10px] font-bold w-20 shrink-0" style={{ color: dt.color }}>{dt.label}</span>
                      <span className="text-[10px] text-muted">{dt.carbGuide}</span>
                      {dt.id === dayType && <span className="text-[8px] font-bold text-emerald-400 ml-auto shrink-0">Hôm nay</span>}
                    </div>
                  ))}
                </div>
              </div>
              {/* Fat checklist */}
              <div>
                <p className="text-[10px] font-bold text-muted mb-2">Chất Béo Tốt — Kiểm Soát Lượng</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Dầu oliu / dầu dừa — nấu vừa phải', 'Bơ, hạt, cá béo — 1–2 phần nhỏ', 'Hạn chế chiên ngập dầu', 'Không ăn mỡ động vật liên tục hàng ngày'].map((item, i) => (
                    <button key={i} onClick={() => toggleTabCheck(`B_fat_${i}`)}
                      className="flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all"
                      style={{ borderColor: tabChecks[`B_fat_${i}`] ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)', background: tabChecks[`B_fat_${i}`] ? 'rgba(16,185,129,0.08)' : 'transparent' }}>
                      <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0" style={{ borderColor: tabChecks[`B_fat_${i}`] ? '#10b981' : '#374151', background: tabChecks[`B_fat_${i}`] ? '#10b981' : 'transparent' }}>
                        {tabChecks[`B_fat_${i}`] && <span className="text-bg text-[8px] font-black">✓</span>}
                      </div>
                      <span className="text-[10px] text-text">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab C — Tập Luyện */}
          {activeTab === 'C' && (
            <div className="space-y-5">
              <p className="text-sm font-bold text-emerald-400">Trước &amp; Sau Buổi Tập</p>
              <div>
                <p className="text-[10px] font-bold text-muted mb-2">Bữa Trước Tập</p>
                <div className="space-y-1.5">
                  {PREWORKOUT.map((pw, i) => (
                    <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-white/[0.025] border border-white/5">
                      <span className="text-[10px] font-bold text-emerald-400 w-32 shrink-0">{pw.time}</span>
                      <span className="text-[10px] text-muted">{pw.food}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted mb-2">Bữa Sau Tập Theo Mục Tiêu</p>
                <div className="space-y-1.5">
                  {POSTWOD.map((pw, i) => (
                    <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-white/[0.025] border border-white/5"
                      style={{ borderColor: pw.goal === b0.goal ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.05)', background: pw.goal === b0.goal ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.015)' }}>
                      <span className="text-[10px] font-bold text-emerald-400 w-20 shrink-0">{pw.goal}{pw.goal === b0.goal ? ' ✓' : ''}</span>
                      <span className="text-[10px] text-muted">{pw.food}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted mb-2">Checklist Ngày Tập</p>
                <div className="space-y-2">
                  {['Có bữa trước tập (không tập bụng đói quá lâu)', 'Có bữa sau tập trong vòng 45–60 phút', 'Protein sau tập đủ (ít nhất 20–30g)', 'Uống nước trước, trong và sau tập', 'Không bù calo bằng đồ ngọt/fastfood sau tập'].map((item, i) => (
                    <button key={i} onClick={() => toggleTabCheck(`C_wod_${i}`)}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl border text-left transition-all"
                      style={{ borderColor: tabChecks[`C_wod_${i}`] ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)', background: tabChecks[`C_wod_${i}`] ? 'rgba(16,185,129,0.08)' : 'transparent' }}>
                      <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0" style={{ borderColor: tabChecks[`C_wod_${i}`] ? '#10b981' : '#374151', background: tabChecks[`C_wod_${i}`] ? '#10b981' : 'transparent' }}>
                        {tabChecks[`C_wod_${i}`] && <span className="text-bg text-[8px] font-black">✓</span>}
                      </div>
                      <span className="text-[10px] text-text">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab D — Nước */}
          {activeTab === 'D' && (
            <div className="space-y-5">
              <p className="text-sm font-bold text-emerald-400">Nước &amp; Điện Giải</p>
              <div>
                <p className="text-[10px] font-bold text-muted mb-2">Mục Tiêu Nước Theo Mức Hoạt Động</p>
                <div className="space-y-1.5">
                  {WATER_LEVELS.map((wl, i) => {
                    const isActive = (b0.activity === 'sedentary' && i === 0) ||
                      (['light', 'moderate'].includes(b0.activity) && i === 1) ||
                      (['active', 'veryActive'].includes(b0.activity) && i === 2);
                    return (
                      <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all"
                        style={{ borderColor: isActive ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.05)', background: isActive ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.015)' }}>
                        <span className="text-[10px] text-muted flex-1">{wl.who}</span>
                        <span className="text-[10px] font-bold text-emerald-400">{wl.target}</span>
                        {isActive && <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">Bạn</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-[11px] font-bold text-emerald-400">Mục tiêu của bạn: {b0.water}L/ngày</p>
                </div>
              </div>
              {/* Electrolyte warning */}
              <div>
                <p className="text-[10px] font-bold text-muted mb-2">Dấu Hiệu Thiếu Điện Giải</p>
                <div className="space-y-1.5">
                  {['Chuột rút khi tập — thiếu kali/magie', 'Đầu óc mơ hồ, khó tập trung — thiếu natri', 'Mệt nhanh dù đã ngủ đủ — thiếu điện giải', 'Nước tiểu vàng đậm — cần uống thêm nước', 'Nhức đầu sau tập — mất nước và điện giải'].map((s, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                      <span className="text-amber-400 text-sm shrink-0">⚠</span>
                      <span className="text-[10px] text-muted">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Water tracker */}
              <div>
                <p className="text-[10px] font-bold text-muted mb-3">Theo Dõi Ly Nước Hôm Nay ({waterCount}/8 ly)</p>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: 8 }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setWater(waterCount === n ? n - 1 : n)}
                      className="w-10 h-10 rounded-xl border text-lg transition-all duration-200"
                      style={{
                        borderColor: n <= waterCount ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.1)',
                        background: n <= waterCount ? 'rgba(16,185,129,0.15)' : 'transparent',
                      }}
                      title={`${n} ly`}>
                      {n <= waterCount ? '🥛' : '○'}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-muted mt-2">Mỗi ly ≈ 250ml. Mục tiêu: {Math.round(b0.water / 0.25)} ly/ngày.</p>
              </div>
            </div>
          )}

          {/* Tab E — Ăn Vặt */}
          {activeTab === 'E' && (
            <div className="space-y-5">
              <p className="text-sm font-bold text-emerald-400">Ăn Vặt &amp; Đồ Ngọt</p>
              <div>
                <p className="text-[10px] font-bold text-muted mb-2">3 Câu Hỏi Trước Khi Ăn Vặt</p>
                <div className="space-y-2">
                  {[
                    { q: 'Mình có thực sự đói không?', a: 'Nếu chưa đến 3–4h kể từ bữa trước, có thể chỉ là buồn miệng hoặc stress. Uống 1 ly nước trước.' },
                    { q: 'Mình đang ăn vì cảm xúc hay vì cơ thể cần?', a: 'Căng thẳng, buồn chán hay mệt mỏi đều có thể gây thèm ăn. Hãy xác định rõ nguồn gốc.' },
                    { q: 'Chọn thứ này có giúp mục tiêu của mình không?', a: 'Không cần tuyệt đối từ chối — chỉ cần chọn phiên bản tốt hơn hoặc kiểm soát khẩu phần.' },
                  ].map((item, i) => (
                    <div key={i}>
                      <button onClick={() => setSnackOpen(snackOpen === i ? null : i)}
                        className="w-full flex items-center gap-2 p-3 rounded-xl border border-white/8 bg-white/[0.025] text-left hover:border-emerald-500/20 transition-colors">
                        <span className="text-[10px] font-bold text-emerald-400 w-5 shrink-0">{i + 1}.</span>
                        <span className="text-[11px] text-text flex-1">{item.q}</span>
                        <span className="text-muted text-sm">{snackOpen === i ? '−' : '+'}</span>
                      </button>
                      {snackOpen === i && (
                        <div className="mt-1 px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                          <p className="text-[10px] text-muted leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted mb-2">Thay Thế Thông Minh</p>
                <div className="rounded-xl border border-white/8 overflow-hidden">
                  <table className="w-full text-[10px]">
                    <thead><tr className="border-b border-white/8">
                      <th className="text-left p-2.5 text-muted font-bold">Tình Huống</th>
                      <th className="text-left p-2.5 text-emerald-400 font-bold">Lựa Chọn Tốt Hơn</th>
                    </tr></thead>
                    <tbody>
                      {SNACK_ALTS.map((sa, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="p-2.5 text-text">{sa.when}</td>
                          <td className="p-2.5 text-emerald-300">{sa.better}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted mb-2">Quy Tắc Kiểm Soát</p>
                <div className="space-y-2">
                  {['Không ăn vặt trong khi làm việc hoặc xem phim (ăn vô thức)', 'Nếu ăn đồ ngọt — ăn sau bữa chính, không ăn lúc bụng trống', 'Cất đồ ăn vặt không lành mạnh ra khỏi tầm nhìn', 'Chuẩn bị snack lành mạnh sẵn để không phụ thuộc vào tùy hứng'].map((item, i) => (
                    <button key={i} onClick={() => toggleTabCheck(`E_rule_${i}`)}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl border text-left transition-all"
                      style={{ borderColor: tabChecks[`E_rule_${i}`] ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)', background: tabChecks[`E_rule_${i}`] ? 'rgba(16,185,129,0.08)' : 'transparent' }}>
                      <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0" style={{ borderColor: tabChecks[`E_rule_${i}`] ? '#10b981' : '#374151', background: tabChecks[`E_rule_${i}`] ? '#10b981' : 'transparent' }}>
                        {tabChecks[`E_rule_${i}`] && <span className="text-bg text-[8px] font-black">✓</span>}
                      </div>
                      <span className="text-[10px] text-text">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab F — Ăn Ngoài */}
          {activeTab === 'F' && (
            <div className="space-y-5">
              <p className="text-sm font-bold text-emerald-400">Ăn Ngoài Thông Minh</p>
              <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-bold text-emerald-400 mb-3">Quy Tắc 3 Chọn Khi Ăn Ngoài</p>
                <div className="space-y-2">
                  {[
                    { n: '1', title: 'Chọn đạm trước', desc: 'Ưu tiên gà, cá, thịt nạc, trứng, đậu — đây là neo của bữa ăn.' },
                    { n: '2', title: 'Thêm rau vào', desc: 'Gọi thêm rau, salad hoặc canh. Nếu không có — chấp nhận, bù ở bữa sau.' },
                    { n: '3', title: 'Kiểm soát tinh bột', desc: 'Ăn vừa phải theo ngày tập. Ngày nghỉ — giảm. Ngày tập nặng — có thể ăn thêm.' },
                  ].map(step => (
                    <div key={step.n} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black flex items-center justify-center shrink-0">{step.n}</span>
                      <div>
                        <p className="text-[11px] font-bold text-text">{step.title}</p>
                        <p className="text-[10px] text-muted">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted mb-2">Hướng Dẫn Cho Món Việt Phổ Biến</p>
                <div className="rounded-xl border border-white/8 overflow-hidden">
                  <table className="w-full text-[10px]">
                    <thead><tr className="border-b border-white/8">
                      <th className="text-left p-2.5 text-muted font-bold">Món</th>
                      <th className="text-left p-2.5 text-emerald-400 font-bold">Điều Chỉnh</th>
                    </tr></thead>
                    <tbody>
                      {EAT_OUT_RULES.map((r, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="p-2.5 font-bold text-text whitespace-nowrap">{r.dish}</td>
                          <td className="p-2.5 text-muted">{r.fix}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted mb-2">Checklist Khi Gọi Món</p>
                <div className="space-y-1.5">
                  {['Đã chọn được nguồn đạm chính?', 'Có rau/canh đi kèm hoặc gọi thêm?', 'Không gọi thêm nước ngọt — chọn nước lọc/trà', 'Không ăn quá mức vì sợ phí tiền', 'Nếu bữa hôm nay "lệch" — bữa tiếp theo điều chỉnh lại ngay'].map((item, i) => (
                    <button key={i} onClick={() => toggleTabCheck(`F_order_${i}`)}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-xl border text-left transition-all"
                      style={{ borderColor: tabChecks[`F_order_${i}`] ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)', background: tabChecks[`F_order_${i}`] ? 'rgba(16,185,129,0.08)' : 'transparent' }}>
                      <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0" style={{ borderColor: tabChecks[`F_order_${i}`] ? '#10b981' : '#374151', background: tabChecks[`F_order_${i}`] ? '#10b981' : 'transparent' }}>
                        {tabChecks[`F_order_${i}`] && <span className="text-bg text-[8px] font-black">✓</span>}
                      </div>
                      <span className="text-[10px] text-text">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab G — Buổi Tối */}
          {activeTab === 'G' && (
            <div className="space-y-5">
              <p className="text-sm font-bold text-emerald-400">Review &amp; Chuẩn Bị Ngày Mai</p>
              <div>
                <p className="text-[10px] font-bold text-muted mb-2">Checklist Tối</p>
                <div className="space-y-1.5">
                  {['Đánh giá nhanh: hôm nay ăn có đủ đạm không?', 'Uống thêm nước nếu chưa đủ mục tiêu', 'Không ăn đêm sau 9–10h (trừ sau tập muộn)', 'Ghi lại 1 điều hôm nay làm tốt về dinh dưỡng', 'Ghi lại 1 điều cần cải thiện ngày mai', 'Không ăn vặt trong khi xem phim tối'].map((item, i) => (
                    <button key={i} onClick={() => toggleTabCheck(`G_eve_${i}`)}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-xl border text-left transition-all"
                      style={{ borderColor: tabChecks[`G_eve_${i}`] ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)', background: tabChecks[`G_eve_${i}`] ? 'rgba(16,185,129,0.08)' : 'transparent' }}>
                      <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0" style={{ borderColor: tabChecks[`G_eve_${i}`] ? '#10b981' : '#374151', background: tabChecks[`G_eve_${i}`] ? '#10b981' : 'transparent' }}>
                        {tabChecks[`G_eve_${i}`] && <span className="text-bg text-[8px] font-black">✓</span>}
                      </div>
                      <span className="text-[10px] text-text">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted mb-2">Chuẩn Bị Cho Ngày Mai</p>
                <div className="space-y-1.5">
                  {['Đặt sẵn thực phẩm cho bữa sáng ngày mai', 'Chuẩn bị snack lành mạnh cho ngày làm việc', 'Lên kế hoạch ăn gì cho bữa trưa ngày mai', 'Nếu ngày mai tập — chuẩn bị bữa trước/sau tập', 'Uống 1 ly nước trước khi ngủ'].map((item, i) => (
                    <button key={i} onClick={() => toggleTabCheck(`G_prep_${i}`)}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-xl border text-left transition-all"
                      style={{ borderColor: tabChecks[`G_prep_${i}`] ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)', background: tabChecks[`G_prep_${i}`] ? 'rgba(16,185,129,0.08)' : 'transparent' }}>
                      <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0" style={{ borderColor: tabChecks[`G_prep_${i}`] ? '#10b981' : '#374151', background: tabChecks[`G_prep_${i}`] ? '#10b981' : 'transparent' }}>
                        {tabChecks[`G_prep_${i}`] && <span className="text-bg text-[8px] font-black">✓</span>}
                      </div>
                      <span className="text-[10px] text-text">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Day summary */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Kết Quả Hôm Nay</p>
                <p className="text-4xl font-black text-emerald-400">{score}<span className="text-xl text-muted">/100</span></p>
                <p className="text-[11px] text-muted mt-1">{todayFormatted}</p>
                {score >= 70
                  ? <p className="text-[10px] font-bold text-emerald-400 mt-2">Ngày thành công. Tiếp tục ngày mai!</p>
                  : <p className="text-[10px] text-muted mt-2">Bắt đầu lại vào buổi sáng — không ai hoàn hảo.</p>}
              </div>
            </div>
          )}
        </div>
      </RevealBlock>

      {/* ── Section 5: Level Selector ─────────────────────────────────────── */}
      <RevealBlock className="mb-10">
        <p className="text-sm font-bold text-muted uppercase tracking-widest mb-4">Chọn Cấp Độ Của Bạn</p>
        <div className="grid md:grid-cols-3 gap-4">
          {LEVELS.map(lv => (
            <div key={lv.id}>
              <button
                onClick={() => setActiveLevel(activeLevel === lv.id ? null : lv.id)}
                className="w-full rounded-2xl border p-5 text-left transition-all duration-200"
                style={{
                  borderColor: activeLevel === lv.id ? `${lv.color}50` : 'rgba(255,255,255,0.08)',
                  background: activeLevel === lv.id ? `${lv.color}10` : 'rgba(255,255,255,0.018)',
                }}
              >
                <div className="text-3xl mb-2">{lv.emoji}</div>
                <p className="text-base font-bold" style={{ color: lv.color }}>{lv.label}</p>
                <p className="text-[10px] font-semibold text-muted">{lv.sub}</p>
                <p className="text-[10px] text-muted mt-1.5 leading-relaxed">{lv.desc}</p>
              </button>
              {activeLevel === lv.id && (
                <div className="mt-2 rounded-2xl border p-4 space-y-1.5" style={{ borderColor: `${lv.color}25`, background: `${lv.color}05` }}>
                  {lv.items.map((item, i) => {
                    const key = `lv${lv.id}_${i}`;
                    return (
                      <button key={i} onClick={() => toggleLevel(key)}
                        className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg border text-left transition-all"
                        style={{ borderColor: levelChecks[key] ? `${lv.color}40` : 'rgba(255,255,255,0.05)', background: levelChecks[key] ? `${lv.color}10` : 'transparent' }}>
                        <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0"
                          style={{ borderColor: levelChecks[key] ? lv.color : '#374151', background: levelChecks[key] ? lv.color : 'transparent' }}>
                          {levelChecks[key] && <span className="text-bg text-[8px] font-black">✓</span>}
                        </div>
                        <span className="text-[10px] text-text">{item}</span>
                      </button>
                    );
                  })}
                  <p className="text-[9px] text-muted pt-1 text-center">
                    {lv.items.filter((_, i) => levelChecks[`lv${lv.id}_${i}`]).length}/{lv.items.length} mục hoàn thành
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* ── Section 6: Daily Log Template ────────────────────────────────── */}
      <RevealBlock className="mb-10">
        <div className="rounded-2xl border border-white/10 p-5 bg-white/[0.018]">
          <p className="text-sm font-bold text-muted uppercase tracking-widest mb-4">Template Ghi Log Hằng Ngày</p>
          <div className="space-y-3 text-[10px]">
            {[
              { row: 'Thông tin ngày', fields: ['Ngày', 'Loại ngày', 'Mục tiêu', 'Nước', 'Protein', 'Rau', 'Trái cây'] },
              { row: 'Bữa ăn', fields: ['Bữa sáng ✓/✗', 'Bữa trưa ✓/✗', 'Bữa tối ✓/✗'] },
              { row: 'Bổ sung', fields: ['Ăn vặt', 'Trước tập', 'Sau tập', 'Điểm', 'Ghi chú'] },
            ].map((section, si) => (
              <div key={si}>
                <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">{section.row}</p>
                <div className="flex flex-wrap gap-2">
                  {section.fields.map((f, fi) => (
                    <span key={fi} className="px-2.5 py-1 rounded-lg border border-white/8 bg-white/[0.025] text-text/70">{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-muted italic mt-4">Tải template về Notion/Google Sheet tại phần Công Cụ.</p>
        </div>
      </RevealBlock>

      {/* ── Section 7: Weekly Checklist ──────────────────────────────────── */}
      <RevealBlock className="mb-10">
        <div className="rounded-2xl border border-emerald-500/15 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-muted uppercase tracking-widest">Checklist Tuần Này</p>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {weeklyCount}/{WEEKLY.length} đạt
            </span>
          </div>
          <div className="space-y-2">
            {WEEKLY.map((q, i) => (
              <button key={i} onClick={() => toggleWeekly(i)}
                className="flex items-start gap-3 w-full px-3 py-2.5 rounded-xl border text-left transition-all"
                style={{ borderColor: weeklyChecks[i] ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)', background: weeklyChecks[i] ? 'rgba(16,185,129,0.08)' : 'transparent' }}>
                <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5"
                  style={{ borderColor: weeklyChecks[i] ? '#10b981' : '#374151', background: weeklyChecks[i] ? '#10b981' : 'transparent' }}>
                  {weeklyChecks[i] && <span className="text-bg text-[8px] font-black">✓</span>}
                </div>
                <span className="text-[11px] text-text leading-relaxed">{q}</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-muted italic mt-4 text-center leading-relaxed">
            Không cần 7 ngày hoàn hảo. Chỉ cần số ngày đúng nhiều hơn số ngày lệch.
          </p>
        </div>
      </RevealBlock>

      {/* ── Section 8: Safety Note ────────────────────────────────────────── */}
      <RevealBlock>
        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5">
          <p className="text-[10px] font-bold text-emerald-400 mb-2 uppercase tracking-widest">Lưu Ý An Toàn</p>
          <p className="text-[10px] text-muted leading-relaxed">
            Checklist này là công cụ hỗ trợ nhận thức — không thay thế tư vấn từ chuyên gia dinh dưỡng hoặc bác sĩ. Nếu bạn có bệnh lý nền, tiểu đường, rối loạn ăn uống hoặc đang điều trị y tế, hãy tham khảo ý kiến chuyên gia trước khi áp dụng bất kỳ kế hoạch dinh dưỡng nào. Mọi số liệu kcal và macro chỉ mang tính tham khảo và có thể cần điều chỉnh theo cơ địa và tình trạng sức khỏe cụ thể của từng người.
          </p>
        </div>
      </RevealBlock>
    </div>
  );
}
