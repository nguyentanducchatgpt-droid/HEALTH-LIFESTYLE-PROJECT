import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const LIME = '#84cc16';
const GREEN = '#22c55e';
const LS_INPUTS = 'healthapp_b0_inputs';

const ACTIVITY_LEVELS = [
  { key: 'sedentary',  label: 'Ít vận động',   sub: 'Ngồi nhiều, không tập',  mult: 1.2   },
  { key: 'light',      label: 'Nhẹ',            sub: '1–2 ngày/tuần',          mult: 1.375 },
  { key: 'moderate',   label: 'Vừa phải',       sub: '3–5 ngày/tuần',          mult: 1.55  },
  { key: 'active',     label: 'Năng động',      sub: '6–7 ngày/tuần',          mult: 1.725 },
  { key: 'very_active', label: 'Rất năng động',  sub: 'Tập 2 lần/ngày',         mult: 1.9   },
];

const GOAL_MODIFIERS = [
  { key: 'loss',   label: 'Giảm mỡ',    emoji: '🔥', pct: 0.87, delta: -400, proteinMult: 2.0, color: '#ef4444', desc: 'Thâm hụt 10–15% TDEE. Giảm 0.3–0.5kg/tuần.' },
  { key: 'recomp', label: 'Tái tổ hợp', emoji: '⚖️', pct: 1.0,  delta:    0, proteinMult: 1.8, color: '#84cc16', desc: 'Duy trì TDEE. Ưu tiên protein + tập luyện.' },
  { key: 'gain',   label: 'Tăng cơ',    emoji: '💪', pct: 1.08, delta:  300, proteinMult: 1.8, color: '#06b6d4', desc: 'Thặng dư 5–10% TDEE. Tăng 0.1–0.2kg/tuần.' },
  { key: 'endure', label: 'Sức bền',    emoji: '🏃', pct: 1.08, delta:  200, proteinMult: 1.6, color: '#f59e0b', desc: 'Calorie cycling theo ngày tập.' },
];

const DAY_TYPES = [
  { key: 'heavy',    label: 'Ngày nặng',  mult: 1.07, carbMult: 1.4,  emoji: '🏋️', color: '#22c55e', example: '×1.07 TDEE' },
  { key: 'moderate', label: 'Ngày vừa',   mult: 1.00, carbMult: 1.0,  emoji: '🚴', color: '#06b6d4', example: '= TDEE' },
  { key: 'light',    label: 'Ngày nhẹ',   mult: 0.95, carbMult: 0.85, emoji: '🚶', color: '#f59e0b', example: '×0.95 TDEE' },
  { key: 'rest',     label: 'Ngày nghỉ',  mult: 0.90, carbMult: 0.7,  emoji: '😴', color: '#a855f7', example: '×0.90 TDEE' },
];

const MEAL_MODELS = [
  {
    name: '3 bữa/ngày', icon: '🍽️', color: '#06b6d4',
    best: 'Người bận, mới bắt đầu, không thích ăn vặt',
    meals: [
      { name: 'Sáng', pct: 30, proteinPct: 25, carbPct: 30, fatPct: 25, time: '7:00–8:00' },
      { name: 'Trưa',  pct: 40, proteinPct: 35, carbPct: 40, fatPct: 35, time: '12:00–13:00' },
      { name: 'Tối',   pct: 30, proteinPct: 40, carbPct: 30, fatPct: 40, time: '18:00–19:30' },
    ],
  },
  {
    name: '4 bữa/ngày', icon: '🥗', color: '#84cc16',
    best: 'Người tập thể dục, dễ đói, giảm mỡ hoặc tăng cơ nhẹ',
    meals: [
      { name: 'Sáng', pct: 25, proteinPct: 25, carbPct: 25, fatPct: 20, time: '7:00–8:00' },
      { name: 'Trưa',  pct: 35, proteinPct: 35, carbPct: 35, fatPct: 35, time: '12:00–13:00' },
      { name: 'Snack', pct: 10, proteinPct: 15, carbPct: 10, fatPct: 10, time: '15:30–16:00' },
      { name: 'Tối',   pct: 30, proteinPct: 25, carbPct: 30, fatPct: 35, time: '18:30–19:30' },
    ],
  },
  {
    name: '5 bữa/ngày', icon: '⚡', color: '#22c55e',
    best: 'Người tập nhiều, ngày tập nặng, cần nạp trước/sau tập',
    meals: [
      { name: 'Sáng',     pct: 20, proteinPct: 20, carbPct: 20, fatPct: 15, time: '7:00–8:00' },
      { name: 'Snack S',  pct: 10, proteinPct: 10, carbPct: 10, fatPct: 10, time: '10:30' },
      { name: 'Trưa',     pct: 30, proteinPct: 30, carbPct: 30, fatPct: 30, time: '12:00–13:00' },
      { name: 'Pre-W',    pct: 15, proteinPct: 10, carbPct: 20, fatPct: 5,  time: '16:00–17:00' },
      { name: 'Tối/Post', pct: 25, proteinPct: 30, carbPct: 20, fatPct: 40, time: '19:00–20:00' },
    ],
  },
];

const CASE_STUDY = {
  name: 'Nam 48 tuổi, 77kg, 1m75',
  sex: 'male', age: 48, weight: 77, height: 175, activityKey: 'active', goalKey: 'endure',
  activityLabel: 'Tập nhiều (đạp xe + gym + bơi)', activityMult: 1.725,
  note: 'Ví dụ thực tế từ tài liệu dự án',
};

const FORMULA_STEPS = [
  { n: 1, emoji: '📋', label: 'Nhập liệu' },
  { n: 2, emoji: '📊', label: 'BMI' },
  { n: 3, emoji: '🔥', label: 'BMR' },
  { n: 4, emoji: '⚡', label: 'TDEE' },
  { n: 5, emoji: '🎯', label: 'Kcal Mục Tiêu' },
  { n: 6, emoji: '💪', label: 'Protein' },
  { n: 7, emoji: '🫒', label: 'Fat' },
  { n: 8, emoji: '🌾', label: 'Carb' },
  { n: 9, emoji: '🍽️', label: 'Chia Bữa' },
  { n: 10, emoji: '📅', label: 'Theo Ngày Tập' },
  { n: 11, emoji: '🗓️', label: 'Macro/Ngày Tập' },
  { n: 12, emoji: '🍱', label: 'Đĩa Ăn Lành Mạnh' },
  { n: 13, emoji: '⚡', label: 'Pre & Post Workout' },
  { n: 14, emoji: '🚴', label: 'Sức Bền Dài' },
  { n: 15, emoji: '💧', label: 'Nước · Xơ · Rau' },
  { n: 16, emoji: '⚖️', label: 'Quy Đổi Khẩu Phần' },
  { n: 17, emoji: '🤖', label: 'Thực Đơn Tự Động' },
];

function computeStats(inp) {
  const w = Number(inp.weight)||70, h = Number(inp.height)||170,
        a = Number(inp.age)||30, sx = inp.sex||'male';
  const act = ACTIVITY_LEVELS.find(x=>x.key===inp.activityKey)||ACTIVITY_LEVELS[2];
  const gm = GOAL_MODIFIERS.find(x=>x.key===inp.goalKey)||GOAL_MODIFIERS[1];
  const bmr = Math.round(sx==='male' ? 10*w+6.25*h-5*a+5 : 10*w+6.25*h-5*a-161);
  const tdee = Math.round(bmr * act.mult);
  const targetKcal = Math.max(1200, tdee + gm.delta);
  const proteinG = Math.round(w * gm.proteinMult);
  const fatG = Math.round(targetKcal * 0.25 / 9);
  const carbG = Math.round((targetKcal - proteinG*4 - fatG*9) / 4);
  const waterMl = Math.round(w * 35);
  const fiberG = Math.round(targetKcal / 1000 * 14);
  const bmi = (w * 10000 / (h * h)).toFixed(1);
  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  const carbKcal = carbG * 4;
  const proteinPct = Math.round(proteinKcal / targetKcal * 100);
  const fatPct = Math.round(fatKcal / targetKcal * 100);
  const carbPct = 100 - proteinPct - fatPct;
  const perMealProtein = Math.round(proteinG / 3);
  const heavy = Math.round(targetKcal * 1.07);
  const moderate = targetKcal;
  const light = Math.round(targetKcal * 0.95);
  const rest = Math.round(targetKcal * 0.90);
  const preCarb = Math.round(w * 0.75);
  const preProtein = Math.round(w * 0.25);
  const postProtein = Math.round(w * 0.3);
  const postCarb = Math.round(w * 0.5);
  return { w, h, a, sx, act, gm, bmr, tdee, targetKcal, proteinG, fatG, carbG,
           waterMl, fiberG, bmi, proteinKcal, fatKcal, carbKcal,
           proteinPct, fatPct, carbPct, perMealProtein,
           heavy, moderate, light, rest, preCarb, preProtein, postProtein, postCarb };
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function RevealBlock({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

function MacroDonut({ s, size = 110 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38, strokeW = size * 0.13;
  const circ = 2 * Math.PI * r;
  const segments = [
    { pct: s.proteinPct, color: GREEN, label: 'P' },
    { pct: s.fatPct, color: '#f59e0b', label: 'F' },
    { pct: Math.max(0, s.carbPct), color: '#06b6d4', label: 'C' },
  ];
  let offset = 0;
  const arcs = segments.map((seg) => {
    const dash = (seg.pct / 100) * circ;
    const gap = circ - dash;
    const rotation = (offset / 100) * 360 - 90;
    offset += seg.pct;
    return { ...seg, dash, gap, rotation };
  });
  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map((arc, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={arc.color} strokeWidth={strokeW}
          strokeDasharray={`${arc.dash} ${arc.gap}`}
          transform={`rotate(${arc.rotation} ${cx} ${cy})`}
          strokeLinecap="butt" opacity={0.9} />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#fff" fontSize={size * 0.13} fontWeight="700">{s.targetKcal.toLocaleString()}</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fill="#888" fontSize={size * 0.09}>kcal</text>
    </svg>
  );
}

function DayTypeBarChart({ s }) {
  const max = s.heavy;
  const rows = [
    { label: '🏋️ Ngày nặng', kcal: s.heavy, color: '#22c55e', mult: '×1.07' },
    { label: '🚴 Ngày vừa',  kcal: s.moderate, color: '#06b6d4', mult: '×1.00' },
    { label: '🚶 Ngày nhẹ',  kcal: s.light, color: '#f59e0b', mult: '×0.95' },
    { label: '😴 Ngày nghỉ', kcal: s.rest,  color: '#a855f7', mult: '×0.90' },
  ];
  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <div key={i}>
          <div className="flex justify-between text-[9px] mb-1">
            <span className="text-muted">{r.label} <span className="font-bold" style={{ color: r.color }}>{r.mult}</span></span>
            <span className="font-bold" style={{ color: r.color }}>{r.kcal.toLocaleString()} kcal</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${r.kcal / max * 100}%`, background: r.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function FormulaChainDiagram() {
  const colors = ['#22c55e','#84cc16','#06b6d4','#f59e0b','#22c55e','#84cc16','#06b6d4','#f59e0b','#22c55e','#84cc16'];
  return (
    <div className="flex flex-wrap items-center gap-1.5 justify-center">
      {FORMULA_STEPS.map((step, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-base font-semibold border"
            style={{ background: `${colors[i]}15`, borderColor: `${colors[i]}40`, color: colors[i] }}>
            <span className="text-[10px] font-bold opacity-60">{step.n}</span>
            <span>{step.emoji}</span>
            <span className="hidden sm:inline">{step.label}</span>
          </div>
          {i < FORMULA_STEPS.length - 1 && (
            <span className="text-base" style={{ color: '#444' }}>→</span>
          )}
        </div>
      ))}
    </div>
  );
}

function MealModelBar({ meals, targetKcal }) {
  const mealColors = ['#22c55e','#84cc16','#06b6d4','#f59e0b','#a855f7'];
  return (
    <div className="space-y-2 mt-3">
      {meals.map((meal, i) => {
        const kcal = Math.round(targetKcal * meal.pct / 100);
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px] w-14 shrink-0" style={{ color: mealColors[i % mealColors.length] }}>{meal.name}</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full" style={{ width: `${meal.pct}%`, background: mealColors[i % mealColors.length] }} />
            </div>
            <span className="text-[10px] w-8 text-right" style={{ color: '#888' }}>{meal.pct}%</span>
            <span className="text-[10px] w-16 text-right font-bold" style={{ color: mealColors[i % mealColors.length] }}>{kcal} kcal</span>
            <span className="text-[10px] text-muted hidden sm:inline">{meal.time}</span>
          </div>
        );
      })}
    </div>
  );
}

function BMIGauge({ bmi }) {
  const val = Math.min(Math.max(Number(bmi), 15), 35);
  const pct = (val - 15) / 20;
  const angle = -180 + pct * 180;
  const rad = angle * Math.PI / 180;
  const cx = 80, cy = 70, r = 54;
  const px = cx + r * Math.cos(rad);
  const py = cy + r * Math.sin(rad);
  const getBmiColor = (b) => {
    const n = Number(b);
    if (n < 18.5) return '#06b6d4';
    if (n < 23) return '#22c55e';
    if (n < 25) return '#84cc16';
    if (n < 30) return '#f59e0b';
    return '#ef4444';
  };
  const color = getBmiColor(bmi);
  return (
    <svg width="160" height="90" viewBox="0 0 160 90" style={{ overflow: 'visible' }}>
      <path d="M 26 70 A 54 54 0 0 1 134 70" fill="none" stroke="#1a1a1a" strokeWidth="10" strokeLinecap="round" />
      <path d="M 26 70 A 54 54 0 0 1 60 25" fill="none" stroke="#06b6d4" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
      <path d="M 60 25 A 54 54 0 0 1 88 18" fill="none" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
      <path d="M 88 18 A 54 54 0 0 1 104 21" fill="none" stroke="#84cc16" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
      <path d="M 104 21 A 54 54 0 0 1 120 34" fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
      <path d="M 120 34 A 54 54 0 0 1 134 70" fill="none" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
      <line x1={cx} y1={cy} x2={px} y2={py} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill={color} />
      <text x={cx} y={cy + 16} textAnchor="middle" fill={color} fontSize="13" fontWeight="700">{bmi}</text>
      <text x="18" y="82" textAnchor="middle" fill="#555" fontSize="8">15</text>
      <text x="142" y="82" textAnchor="middle" fill="#555" fontSize="8">35</text>
    </svg>
  );
}

function FormulaCard({ label, formula, result, color = GREEN }) {
  return (
    <div className="rounded-xl p-4 border" style={{ background: `${color}08`, borderColor: `${color}25` }}>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>{label}</div>
      <div className="font-mono text-lg font-semibold text-text mb-1">{formula}</div>
      {result && <div className="font-mono text-base text-muted mt-1">{result}</div>}
    </div>
  );
}

export default function NutritionFormulaPage() {
  const [inputs, setInputs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_INPUTS) || '{}');
      return { weight: 70, height: 170, age: 30, sex: 'male', activityKey: 'moderate', goalKey: 'recomp', ...saved };
    } catch {
      return { weight: 70, height: 170, age: 30, sex: 'male', activityKey: 'moderate', goalKey: 'recomp' };
    }
  });
  const [activeStep, setActiveStep] = useState(0);
  const [mealModel, setMealModel] = useState(1);
  const [localInputs, setLocalInputs] = useState(inputs);

  const s = useMemo(() => computeStats(inputs), [inputs]);
  const cs = useMemo(() => computeStats({ weight: CASE_STUDY.weight, height: CASE_STUDY.height, age: CASE_STUDY.age, sex: CASE_STUDY.sex, activityKey: CASE_STUDY.activityKey, goalKey: CASE_STUDY.goalKey }), []);

  useEffect(() => {
    try { localStorage.setItem(LS_INPUTS, JSON.stringify(inputs)); } catch {}
  }, [inputs]);

  useEffect(() => {
    const el = document.getElementById('nf-page-kf');
    if (el) return;
    const style = document.createElement('style');
    style.id = 'nf-page-kf';
    style.textContent = `
      @property --nf-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes nfOrbitSpin { to { --nf-angle: 360deg; } }
      .nf-orbit-ring {
        background: conic-gradient(from var(--nf-angle), transparent 0deg, transparent 55deg, rgba(34,197,94,0.0) 65deg, rgba(34,197,94,0.75) 85deg, rgba(255,255,255,0.9) 92deg, rgba(34,197,94,0.75) 99deg, rgba(34,197,94,0.0) 115deg, transparent 125deg, transparent 360deg);
        animation: nfOrbitSpin 3.5s linear infinite;
      }
      @keyframes nfFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      .nf-float { animation: nfFloat 3.5s ease-in-out infinite; }
      @keyframes nfShimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
      .nf-shimmer { background: linear-gradient(90deg,#22c55e,#84cc16,#06b6d4,#22c55e); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:nfShimmer 3s linear infinite; }
      @keyframes nfFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      .nf-fade-in-up { animation: nfFadeUp 0.6s ease forwards; }
      @keyframes nfCount { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
      .nf-count { animation: nfCount 0.4s ease forwards; }
      @keyframes nfBarGrow { from{width:0} to{width:100%} }
    `;
    document.head.appendChild(style);
    return () => { const s = document.getElementById('nf-page-kf'); if (s) s.remove(); };
  }, []);

  const handleApply = useCallback(() => {
    setInputs({ ...localInputs });
  }, [localInputs]);

  const bmiLabel = (b) => {
    const n = Number(b);
    if (n < 18.5) return { label: 'Thiếu cân', color: '#06b6d4' };
    if (n < 23) return { label: 'Bình thường', color: '#22c55e' };
    if (n < 25) return { label: 'Hơi thừa cân', color: '#84cc16' };
    if (n < 30) return { label: 'Thừa cân', color: '#f59e0b' };
    return { label: 'Béo phì', color: '#ef4444' };
  };

  const stepContent = [
    // Step 0 — Nhập liệu
    <div key="s0" className="space-y-4">
      <div className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: GREEN }}>Nhập thông số cá nhân</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-muted uppercase tracking-wider block mb-1">Cân nặng (kg)</label>
          <input type="number" value={localInputs.weight} onChange={e => setLocalInputs(p => ({ ...p, weight: e.target.value }))}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-lg text-text focus:outline-none focus:border-green-500" />
        </div>
        <div>
          <label className="text-[10px] text-muted uppercase tracking-wider block mb-1">Chiều cao (cm)</label>
          <input type="number" value={localInputs.height} onChange={e => setLocalInputs(p => ({ ...p, height: e.target.value }))}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-lg text-text focus:outline-none focus:border-green-500" />
        </div>
        <div>
          <label className="text-[10px] text-muted uppercase tracking-wider block mb-1">Tuổi</label>
          <input type="number" value={localInputs.age} onChange={e => setLocalInputs(p => ({ ...p, age: e.target.value }))}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-lg text-text focus:outline-none focus:border-green-500" />
        </div>
        <div>
          <label className="text-[10px] text-muted uppercase tracking-wider block mb-1">Giới tính</label>
          <div className="flex gap-2">
            {['male','female'].map(sx => (
              <button key={sx} onClick={() => setLocalInputs(p => ({ ...p, sex: sx }))}
                className="flex-1 py-2 rounded-lg text-base font-semibold border transition-all"
                style={{ background: localInputs.sex === sx ? `${GREEN}20` : 'transparent', borderColor: localInputs.sex === sx ? GREEN : '#333', color: localInputs.sex === sx ? GREEN : '#888' }}>
                {sx === 'male' ? 'Nam' : 'Nữ'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label className="text-[10px] text-muted uppercase tracking-wider block mb-1">Mức vận động</label>
        <select value={localInputs.activityKey} onChange={e => setLocalInputs(p => ({ ...p, activityKey: e.target.value }))}
          className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-lg text-text focus:outline-none focus:border-green-500">
          {ACTIVITY_LEVELS.map(a => (
            <option key={a.key} value={a.key}>{a.label} — {a.sub}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-[10px] text-muted uppercase tracking-wider block mb-1">Mục tiêu</label>
        <div className="grid grid-cols-2 gap-2">
          {GOAL_MODIFIERS.map(g => (
            <button key={g.key} onClick={() => setLocalInputs(p => ({ ...p, goalKey: g.key }))}
              className="flex items-center gap-2 p-2.5 rounded-xl border text-base font-semibold transition-all text-left"
              style={{ background: localInputs.goalKey === g.key ? `${g.color}18` : 'transparent', borderColor: localInputs.goalKey === g.key ? g.color : '#2a2a2a', color: localInputs.goalKey === g.key ? g.color : '#666' }}>
              <span>{g.emoji}</span>
              <span>{g.label}</span>
            </button>
          ))}
        </div>
      </div>
      <button onClick={handleApply}
        className="w-full py-3 rounded-xl font-bold text-lg transition-all active:scale-95"
        style={{ background: `linear-gradient(135deg, ${GREEN}, ${LIME})`, color: '#000' }}>
        Tính ngay
      </button>
      <div className="grid grid-cols-2 gap-2 pt-1">
        {[{ label: 'BMI', val: s.bmi }, { label: 'BMR', val: `${s.bmr.toLocaleString()} kcal` }, { label: 'TDEE', val: `${s.tdee.toLocaleString()} kcal` }, { label: 'Mục tiêu', val: `${s.targetKcal.toLocaleString()} kcal` }].map((item, i) => (
          <div key={i} className="rounded-xl p-3 border text-center" style={{ background: `${GREEN}08`, borderColor: `${GREEN}25` }}>
            <div className="text-[9px] text-muted uppercase tracking-wider">{item.label}</div>
            <div className="font-bold text-lg nf-count" style={{ color: GREEN }}>{item.val}</div>
          </div>
        ))}
      </div>
    </div>,

    // Step 1 — BMI
    <div key="s1" className="space-y-4">
      <FormulaCard label="Công thức BMI" formula="BMI = Cân nặng(kg) ÷ (Chiều cao(m))²"
        result={`= ${s.w} ÷ (${s.h}/100)² = ${s.bmi}`} color="#06b6d4" />
      <div className="flex flex-col items-center gap-2">
        <BMIGauge bmi={s.bmi} />
        <div className="text-3xl font-bold nf-count" style={{ color: bmiLabel(s.bmi).color }}>{s.bmi}</div>
        <div className="text-base font-semibold px-3 py-1 rounded-full border" style={{ color: bmiLabel(s.bmi).color, borderColor: `${bmiLabel(s.bmi).color}40`, background: `${bmiLabel(s.bmi).color}12` }}>{bmiLabel(s.bmi).label}</div>
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#2a2a2a' }}>
        <div className="grid grid-cols-3 text-[9px] font-bold uppercase tracking-wider px-3 py-2" style={{ background: '#111', color: '#555' }}>
          <span>Chỉ số BMI</span>
          <span>Phân loại</span>
          <span>Ghi chú</span>
        </div>
        {[
          { range: '< 18.5', label: 'Thiếu cân', note: 'Nên tăng cân dần', color: '#06b6d4' },
          { range: '18.5–23', label: 'Bình thường', note: 'Duy trì & tối ưu', color: '#22c55e' },
          { range: '23–25', label: 'Hơi thừa cân', note: 'Điều chỉnh nhẹ', color: '#84cc16' },
          { range: '25–30', label: 'Thừa cân', note: 'Giảm mỡ từ từ', color: '#f59e0b' },
          { range: '> 30', label: 'Béo phì', note: 'Gặp bác sĩ dinh dưỡng', color: '#ef4444' },
        ].map((row, i) => (
          <div key={i} className="grid grid-cols-3 px-3 py-2 text-base border-t" style={{ borderColor: '#1a1a1a', background: i % 2 === 0 ? 'transparent' : '#0d0d0d' }}>
            <span className="font-mono font-bold" style={{ color: row.color }}>{row.range}</span>
            <span style={{ color: row.color }}>{row.label}</span>
            <span className="text-muted text-[10px]">{row.note}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-3 border text-base text-muted" style={{ borderColor: '#2a2a2a', background: '#0d0d0d' }}>
        BMI chỉ là sàng lọc ban đầu, không đủ cho người tập nhiều cơ. Người có cơ bắp phát triển có BMI cao nhưng không có nghĩa là thừa mỡ.
      </div>
    </div>,

    // Step 2 — BMR
    <div key="s2" className="space-y-4">
      <div className="grid gap-3">
        <FormulaCard label="Công thức Nam (Mifflin-St Jeor)" formula="BMR = 10×W + 6.25×H − 5×A + 5" color={GREEN} />
        <FormulaCard label="Công thức Nữ (Mifflin-St Jeor)" formula="BMR = 10×W + 6.25×H − 5×A − 161" color={LIME} />
      </div>
      <div className="rounded-xl p-4 border" style={{ background: `${GREEN}08`, borderColor: `${GREEN}25` }}>
        <div className="text-[10px] text-muted mb-2">Thế số cho bạn ({s.sx === 'male' ? 'Nam' : 'Nữ'})</div>
        <div className="font-mono text-lg text-text">
          = 10×{s.w} + 6.25×{s.h} − 5×{s.a} {s.sx === 'male' ? '+ 5' : '− 161'}
        </div>
        <div className="font-mono text-base text-muted mt-1">
          = {10*s.w} + {(6.25*s.h).toFixed(0)} − {5*s.a} {s.sx === 'male' ? '+ 5' : '− 161'}
        </div>
        <div className="font-mono text-2xl font-bold mt-2" style={{ color: GREEN }}>= {s.bmr.toLocaleString()} kcal/ngày</div>
      </div>
      <div className="rounded-xl p-3 border text-base text-muted space-y-1" style={{ borderColor: '#2a2a2a', background: '#0d0d0d' }}>
        <div className="font-semibold text-text mb-1">BMR là gì?</div>
        <div>Basal Metabolic Rate — lượng calo cơ thể đốt khi nằm nghỉ hoàn toàn để duy trì sự sống: tim đập, phổi thở, não hoạt động, thận lọc máu.</div>
        <div>BMR chiếm ~60–70% tổng năng lượng tiêu thụ hàng ngày.</div>
      </div>
    </div>,

    // Step 3 — TDEE
    <div key="s3" className="space-y-4">
      <FormulaCard label="Công thức TDEE" formula="TDEE = BMR × Hệ số hoạt động (PAL)"
        result={`= ${s.bmr.toLocaleString()} × ${s.act.mult} = ${s.tdee.toLocaleString()} kcal`} color="#f59e0b" />
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#2a2a2a' }}>
        <div className="grid grid-cols-3 text-[9px] font-bold uppercase tracking-wider px-3 py-2" style={{ background: '#111', color: '#555' }}>
          <span>Mức vận động</span>
          <span>Hệ số</span>
          <span>Ghi chú</span>
        </div>
        {ACTIVITY_LEVELS.map((al, i) => (
          <div key={i} className="grid grid-cols-3 px-3 py-2.5 text-base border-t transition-colors"
            style={{ borderColor: '#1a1a1a', background: al.key === s.act.key ? `${GREEN}10` : i % 2 === 0 ? 'transparent' : '#0d0d0d' }}>
            <span className="font-semibold" style={{ color: al.key === s.act.key ? GREEN : '#ccc' }}>{al.label}</span>
            <span className="font-mono font-bold" style={{ color: al.key === s.act.key ? GREEN : '#f59e0b' }}>×{al.mult}</span>
            <span className="text-muted text-[10px]">{al.sub}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-3 border text-base text-muted" style={{ borderColor: '#2a2a2a', background: '#0d0d0d' }}>
        TDEE (Total Daily Energy Expenditure) = tổng calo bạn đốt trong ngày gồm BMR + nhiệt sinh ra từ tiêu hóa (TEF ~10%) + hoạt động thể chất (TEA). Đây là điểm neo để tính calo mục tiêu.
      </div>
    </div>,

    // Step 4 — Kcal Mục Tiêu
    <div key="s4" className="space-y-4">
      <FormulaCard label="Công thức Kcal mục tiêu" formula="Kcal mục tiêu = TDEE + Delta mục tiêu" color="#a855f7" />
      <div className="grid gap-2">
        {GOAL_MODIFIERS.map((g) => {
          const kcal = Math.max(1200, s.tdee + g.delta);
          const isActive = g.key === s.gm.key;
          return (
            <div key={g.key} className="rounded-xl p-3 border flex items-center gap-3 transition-all"
              style={{ background: isActive ? `${g.color}12` : 'transparent', borderColor: isActive ? g.color : '#2a2a2a' }}>
              <span className="text-2xl">{g.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold" style={{ color: g.color }}>{g.label}</span>
                  {isActive && <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${g.color}25`, color: g.color }}>Hiện tại</span>}
                </div>
                <div className="text-[10px] text-muted mt-0.5">{g.desc}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-base text-muted">{s.tdee} {g.delta >= 0 ? '+' : ''}{g.delta}</div>
                <div className="font-bold text-lg" style={{ color: g.color }}>{kcal.toLocaleString()} kcal</div>
              </div>
            </div>
          );
        })}
      </div>
      {s.gm.key === 'endure' && (
        <div className="rounded-xl p-3 border" style={{ background: '#f59e0b10', borderColor: '#f59e0b30' }}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#f59e0b' }}>Calorie Cycling — Sức bền</div>
          <DayTypeBarChart s={s} />
        </div>
      )}
    </div>,

    // Step 5 — Protein
    <div key="s5" className="space-y-4">
      <FormulaCard label="Công thức Protein" formula="Protein(g) = Cân nặng(kg) × Hệ số mục tiêu"
        result={`= ${s.w}kg × ${s.gm.proteinMult}g/kg = ${s.proteinG}g/ngày = ${s.proteinKcal} kcal`} color={GREEN} />
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#2a2a2a' }}>
        <div className="grid grid-cols-2 text-[9px] font-bold uppercase tracking-wider px-3 py-2" style={{ background: '#111', color: '#555' }}>
          <span>Mục tiêu</span>
          <span>Hệ số g/kg</span>
        </div>
        {[
          { label: 'Sống khỏe nền', range: '1.2–1.6 g/kg', color: '#06b6d4' },
          { label: 'Giảm mỡ', range: '1.6–2.2 g/kg', color: '#ef4444' },
          { label: 'Tăng cơ', range: '1.6–2.2 g/kg', color: GREEN },
          { label: 'Sức bền', range: '1.4–2.0 g/kg', color: '#f59e0b' },
        ].map((row, i) => (
          <div key={i} className="grid grid-cols-2 px-3 py-2 text-base border-t" style={{ borderColor: '#1a1a1a', background: i % 2 === 0 ? 'transparent' : '#0d0d0d' }}>
            <span style={{ color: row.color }}>{row.label}</span>
            <span className="font-mono font-bold" style={{ color: row.color }}>{row.range}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-3 border" style={{ background: `${GREEN}08`, borderColor: `${GREEN}25` }}>
        <div className="text-[10px] text-muted mb-1">Chia bữa tham khảo</div>
        <div className="font-mono text-lg font-bold" style={{ color: GREEN }}>{s.proteinG}g ÷ 3 bữa ≈ {s.perMealProtein}g/bữa</div>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-muted">Nguồn protein tốt</div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { name: 'Ức gà', val: '31g/100g', emoji: '🍗' },
          { name: 'Trứng', val: '13g/quả', emoji: '🥚' },
          { name: 'Cá', val: '20g/100g', emoji: '🐟' },
          { name: 'Đậu phụ', val: '8g/100g', emoji: '🫘' },
          { name: 'Greek yogurt', val: '10g/100g', emoji: '🥛' },
          { name: 'Thịt bò', val: '26g/100g', emoji: '🥩' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg p-2 border text-base" style={{ borderColor: '#1a1a1a', background: '#0d0d0d' }}>
            <span>{item.emoji}</span>
            <span className="text-text">{item.name}</span>
            <span className="ml-auto font-mono font-bold" style={{ color: GREEN }}>{item.val}</span>
          </div>
        ))}
      </div>
    </div>,

    // Step 6 — Fat
    <div key="s6" className="space-y-4">
      <FormulaCard label="Công thức Fat" formula="Fat(g) = (Kcal mục tiêu × 25%) ÷ 9"
        result={`= (${s.targetKcal} × 0.25) ÷ 9 = ${s.fatG}g = ${s.fatKcal} kcal`} color="#f59e0b" />
      <div className="rounded-xl p-3 border" style={{ background: '#f59e0b10', borderColor: '#f59e0b30' }}>
        <div className="text-[10px] text-muted mb-1">Tỉ lệ fat trong tổng calo</div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full" style={{ width: `${s.fatPct}%`, background: '#f59e0b' }} />
        </div>
        <div className="flex justify-between text-[10px] mt-1">
          <span className="text-muted">0%</span>
          <span className="font-bold" style={{ color: '#f59e0b' }}>{s.fatPct}% ({s.fatG}g)</span>
          <span className="text-muted">100%</span>
        </div>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-muted">Nguồn fat tốt</div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { name: 'Dầu ô liu', emoji: '🫒' },
          { name: 'Bơ (avocado)', emoji: '🥑' },
          { name: 'Hạnh nhân', emoji: '🌰' },
          { name: 'Cá hồi', emoji: '🐟' },
          { name: 'Trứng', emoji: '🥚' },
          { name: 'Hạt chia', emoji: '🌱' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg p-2 border text-base" style={{ borderColor: '#1a1a1a', background: '#0d0d0d' }}>
            <span>{item.emoji}</span>
            <span className="text-text">{item.name}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-3 border text-base" style={{ background: '#ef444410', borderColor: '#ef444430' }}>
        <span className="font-bold" style={{ color: '#ef4444' }}>Lưu ý: </span>
        <span className="text-muted">Không cắt fat dưới 20% tổng calo — ảnh hưởng nội tiết tố, hormone sinh dục và hấp thụ vitamin A/D/E/K.</span>
      </div>
    </div>,

    // Step 7 — Carb
    <div key="s7" className="space-y-4">
      <FormulaCard label="Công thức Carb" formula="Carb(g) = (Kcal mục tiêu − Protein kcal − Fat kcal) ÷ 4"
        result={`= (${s.targetKcal} − ${s.proteinKcal} − ${s.fatKcal}) ÷ 4 = ${s.carbG}g = ${s.carbKcal} kcal`} color="#06b6d4" />
      <div className="rounded-xl p-4 border" style={{ background: '#06b6d408', borderColor: '#06b6d425' }}>
        <div className="text-[10px] text-muted mb-3">Phân bổ macro ({s.targetKcal.toLocaleString()} kcal)</div>
        <div className="flex items-center gap-4">
          <MacroDonut s={s} size={100} />
          <div className="space-y-2 flex-1">
            {[
              { label: 'Protein', g: s.proteinG, pct: s.proteinPct, color: GREEN },
              { label: 'Fat', g: s.fatG, pct: s.fatPct, color: '#f59e0b' },
              { label: 'Carb', g: s.carbG, pct: Math.max(0, s.carbPct), color: '#06b6d4' },
            ].map((m, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span style={{ color: m.color }}>{m.label}</span>
                  <span style={{ color: m.color }}>{m.g}g ({m.pct}%)</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-muted">Carb cycling theo ngày tập</div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: '🏋️ Ngày nặng', mult: 1.4, color: '#22c55e' },
          { label: '🚴 Ngày vừa', mult: 1.0, color: '#06b6d4' },
          { label: '🚶 Ngày nhẹ', mult: 0.85, color: '#f59e0b' },
          { label: '😴 Ngày nghỉ', mult: 0.7, color: '#a855f7' },
        ].map((item, i) => (
          <div key={i} className="rounded-xl p-3 border text-center" style={{ background: `${item.color}0d`, borderColor: `${item.color}30` }}>
            <div className="text-base mb-1">{item.label}</div>
            <div className="font-mono font-bold text-lg" style={{ color: item.color }}>{Math.round(s.carbG * item.mult)}g</div>
            <div className="text-[9px] text-muted">×{item.mult}</div>
          </div>
        ))}
      </div>
    </div>,

    // Step 8 — Chia Bữa
    <div key="s8" className="space-y-4">
      <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: LIME }}>Chọn mô hình bữa ăn</div>
      <div className="grid grid-cols-3 gap-2">
        {MEAL_MODELS.map((m, i) => (
          <button key={i} onClick={() => setMealModel(i)}
            className="rounded-xl p-3 border text-center transition-all"
            style={{ background: mealModel === i ? `${m.color}15` : 'transparent', borderColor: mealModel === i ? m.color : '#2a2a2a' }}>
            <div className="text-2xl mb-1">{m.icon}</div>
            <div className="text-[10px] font-bold" style={{ color: mealModel === i ? m.color : '#666' }}>{m.name}</div>
          </button>
        ))}
      </div>
      <div className="rounded-xl p-4 border" style={{ background: `${MEAL_MODELS[mealModel].color}08`, borderColor: `${MEAL_MODELS[mealModel].color}30` }}>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: MEAL_MODELS[mealModel].color }}>{MEAL_MODELS[mealModel].name} — {MEAL_MODELS[mealModel].icon}</div>
        <div className="text-[10px] text-muted mb-3">{MEAL_MODELS[mealModel].best}</div>
        <MealModelBar meals={MEAL_MODELS[mealModel].meals} targetKcal={s.targetKcal} />
      </div>
      <div className="rounded-xl p-3 border" style={{ background: '#0d0d0d', borderColor: '#2a2a2a' }}>
        <div className="text-[10px] text-muted mb-1">Công thức phân bổ</div>
        <div className="font-mono text-base text-text">Kcal mỗi bữa = Tổng × Tỉ lệ%</div>
        <div className="font-mono text-[10px] text-muted mt-1">VD: Bữa trưa 35% = {Math.round(s.targetKcal * 0.35).toLocaleString()} kcal</div>
      </div>
    </div>,

    // Step 9 — Theo Ngày Tập
    <div key="s9" className="space-y-4">
      <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: '#f59e0b' }}>Calorie Cycling — Theo Ngày Tập</div>
      <div className="rounded-xl p-4 border" style={{ background: '#f59e0b08', borderColor: '#f59e0b25' }}>
        <DayTypeBarChart s={s} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl p-3 border" style={{ background: `${GREEN}08`, borderColor: `${GREEN}25` }}>
          <div className="text-[10px] text-muted mb-1">Protein (cố định)</div>
          <div className="font-bold" style={{ color: GREEN }}>{s.proteinG}g/ngày</div>
          <div className="text-[9px] text-muted">Không đổi theo ngày</div>
        </div>
        <div className="rounded-xl p-3 border" style={{ background: '#06b6d408', borderColor: '#06b6d425' }}>
          <div className="text-[10px] text-muted mb-1">Fat (ổn định)</div>
          <div className="font-bold" style={{ color: '#06b6d4' }}>{s.fatG}g/ngày</div>
          <div className="text-[9px] text-muted">Gần cố định</div>
        </div>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-muted">Carb theo ngày</div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: '🏋️ Nặng', g: Math.round(s.carbG * 1.4), color: '#22c55e' },
          { label: '🚴 Vừa', g: s.carbG, color: '#06b6d4' },
          { label: '🚶 Nhẹ', g: Math.round(s.carbG * 0.85), color: '#f59e0b' },
          { label: '😴 Nghỉ', g: Math.round(s.carbG * 0.7), color: '#a855f7' },
        ].map((item, i) => (
          <div key={i} className="rounded-xl p-2.5 border text-center" style={{ background: `${item.color}0d`, borderColor: `${item.color}30` }}>
            <div className="text-[10px] mb-1">{item.label}</div>
            <div className="font-bold text-lg" style={{ color: item.color }}>{item.g}g</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-3 border space-y-2" style={{ background: '#0d0d0d', borderColor: '#2a2a2a' }}>
        <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GREEN }}>Pre-Workout</div>
        <div className="font-mono text-base text-text">Carb = 0.5–1g/kg = <span style={{ color: GREEN }}>{s.preCarb}g</span></div>
        <div className="font-mono text-base text-text">Protein = 0.2–0.3g/kg = <span style={{ color: GREEN }}>{s.preProtein}g</span></div>
        <div className="border-t mt-2 pt-2" style={{ borderColor: '#2a2a2a' }}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: LIME }}>Post-Workout</div>
          <div className="font-mono text-base text-text">Protein = 0.25–0.4g/kg = <span style={{ color: LIME }}>{s.postProtein}g</span></div>
          <div className="font-mono text-base text-text">Carb = 0.5–1g/kg = <span style={{ color: LIME }}>{s.postCarb}g</span></div>
        </div>
      </div>
    </div>,

    // Step 10 — Macro/Ngày Tập
    <div key="s10" className="space-y-4">
      <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: '#f59e0b' }}>Protein & Fat cố định · Chỉ Carb thay đổi</div>
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#2a2a2a' }}>
        <table className="w-full text-[10px]">
          <thead>
            <tr style={{ background: '#111' }}>
              <th className="text-left px-3 py-2 text-muted">Loại ngày</th>
              <th className="px-3 py-2 text-right" style={{ color: GREEN }}>Protein</th>
              <th className="px-3 py-2 text-right" style={{ color: '#06b6d4' }}>Carb</th>
              <th className="px-3 py-2 text-right" style={{ color: '#f59e0b' }}>Fat</th>
              <th className="px-3 py-2 text-right" style={{ color: LIME }}>Kcal</th>
            </tr>
          </thead>
          <tbody>
            {[
              { emoji: '🏋️', label: 'Nặng', carbMult: 1.4, kcal: s.heavy, color: '#22c55e' },
              { emoji: '🚴', label: 'Vừa', carbMult: 1.0, kcal: s.moderate, color: '#06b6d4' },
              { emoji: '🚶', label: 'Nhẹ', carbMult: 0.85, kcal: s.light, color: '#f59e0b' },
              { emoji: '😴', label: 'Nghỉ', carbMult: 0.7, kcal: s.rest, color: '#a855f7' },
            ].map((row, i) => (
              <tr key={i} className="border-t" style={{ borderColor: '#1e1e1e', background: i % 2 === 0 ? '#0d0d0d' : 'transparent' }}>
                <td className="px-3 py-2"><span style={{ color: row.color }}>{row.emoji} Ngày {row.label}</span></td>
                <td className="px-3 py-2 text-right font-mono" style={{ color: GREEN }}>{s.proteinG}g</td>
                <td className="px-3 py-2 text-right font-mono font-bold" style={{ color: '#06b6d4' }}>{Math.round(s.carbG * row.carbMult)}g</td>
                <td className="px-3 py-2 text-right font-mono" style={{ color: '#f59e0b' }}>{s.fatG}g</td>
                <td className="px-3 py-2 text-right font-mono font-bold" style={{ color: LIME }}>{row.kcal.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className="rounded-xl p-3 border" style={{ background: '#0d0d0d', borderColor: '#2a2a2a' }}>
          <div className="font-bold mb-1" style={{ color: GREEN }}>Protein — Cố định</div>
          <div className="text-muted">Dù tập nặng hay nghỉ, protein luôn = <span className="font-mono" style={{ color: GREEN }}>{s.proteinG}g</span>. Bảo vệ cơ bắp.</div>
        </div>
        <div className="rounded-xl p-3 border" style={{ background: '#0d0d0d', borderColor: '#2a2a2a' }}>
          <div className="font-bold mb-1" style={{ color: '#f59e0b' }}>Fat — Ổn định</div>
          <div className="text-muted">Fat = <span className="font-mono" style={{ color: '#f59e0b' }}>{s.fatG}g</span> hầu hết các ngày. Dao động nhỏ ±5g chấp nhận được.</div>
        </div>
      </div>
      <div className="rounded-xl p-3 border text-[10px]" style={{ background: 'rgba(132,204,22,0.06)', borderColor: 'rgba(132,204,22,0.25)' }}>
        <span className="font-bold" style={{ color: LIME }}>Carb range của bạn: </span>
        <span className="font-mono" style={{ color: '#06b6d4' }}>{Math.round(s.carbG * 0.7)}g</span>
        <span className="text-muted"> (nghỉ) → </span>
        <span className="font-mono" style={{ color: '#22c55e' }}>{Math.round(s.carbG * 1.4)}g</span>
        <span className="text-muted"> (nặng) · Carb là đòn bẩy chính của calorie cycling</span>
      </div>
    </div>,

    // Step 11 — Đĩa Ăn Lành Mạnh
    <div key="s11" className="space-y-4">
      <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: '#06b6d4' }}>Không cần cân — nhìn đĩa là biết</div>
      <div className="flex justify-center">
        <div className="relative w-52 h-52">
          <svg viewBox="0 0 200 200" className="w-full h-full" style={{ overflow: 'visible' }}>
            <path d="M 100,100 L 100,20 A 80,80 0 0,1 180,100 Z" fill="rgba(34,197,94,0.25)" stroke="#22c55e" strokeWidth="1.5"/>
            <path d="M 100,100 L 180,100 A 80,80 0 0,1 100,180 Z" fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 2"/>
            <text x="148" y="72" textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="bold">½ Rau củ</text>
            <path d="M 100,100 L 100,180 A 80,80 0 0,1 20,100 Z" fill="rgba(132,204,22,0.2)" stroke="#84cc16" strokeWidth="1.5"/>
            <text x="52" y="155" textAnchor="middle" fontSize="9" fill="#84cc16" fontWeight="bold">¼ Protein</text>
            <path d="M 100,100 L 20,100 A 80,80 0 0,1 100,20 Z" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1.5"/>
            <text x="52" y="65" textAnchor="middle" fontSize="9" fill="#06b6d4" fontWeight="bold">¼ Tinh bột</text>
            <circle cx="100" cy="100" r="18" fill="#111" stroke="#2a2a2a" strokeWidth="1"/>
            <text x="100" y="104" textAnchor="middle" fontSize="9" fill="#666">Đĩa</text>
          </svg>
        </div>
      </div>
      <div className="grid gap-2">
        {[
          { icon: '🥦', label: '½ Rau củ', note: 'Rau muống, bông cải, dưa leo, cà chua', color: '#22c55e' },
          { icon: '🍗', label: '¼ Protein', note: 'Ức gà, cá, đậu hũ, trứng', color: '#84cc16' },
          { icon: '🍚', label: '¼ Tinh bột', note: 'Cơm, khoai, mì, bánh mì', color: '#06b6d4' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-2.5 border" style={{ background: `${item.color}08`, borderColor: `${item.color}25` }}>
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1">
              <div className="font-bold text-base" style={{ color: item.color }}>{item.label}</div>
              <div className="text-[10px] text-muted">{item.note}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-3 border text-[10px] text-muted" style={{ background: '#0d0d0d', borderColor: '#2a2a2a' }}>
        <span className="font-bold" style={{ color: LIME }}>Mẹo VN: </span>Bát cơm chuẩn VN ≈ 200g = ¼ đĩa. Thêm 1 chén canh rau + 1 khúc cá = đạt tỷ lệ đĩa lành mạnh.
      </div>
    </div>,

    // Step 12 — Pre & Post Workout (chi tiết)
    <div key="s12" className="space-y-4">
      <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: '#f59e0b' }}>Xung quanh buổi tập</div>
      <div className="grid gap-3">
        <div className="rounded-xl p-4 border" style={{ background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.25)' }}>
          <div className="flex items-center gap-2 mb-3"><span className="text-xl">⚡</span><div className="font-bold text-lg text-text">Pre-Workout <span className="text-[10px] text-muted font-normal">(1–2h trước tập)</span></div></div>
          <FormulaCard label="Carb" formula="Carb = 0.5–1.0 g/kg" result={`= ${s.preCarb}g cho ${s.w}kg`} color="#06b6d4" />
          <div className="mt-2"><FormulaCard label="Protein" formula="Protein = 0.2–0.3 g/kg" result={`= ${s.preProtein}g cho ${s.w}kg`} color={GREEN} /></div>
          <div className="mt-2 rounded-xl p-2 border text-[10px] text-muted" style={{ borderColor: '#2a2a2a', background: '#0d0d0d' }}>
            <span className="font-bold text-amber-400">Fat tối thiểu</span> — fat làm chậm làm rỗng dạ dày, giảm hiệu suất tập
          </div>
          <div className="mt-2 text-[10px] text-muted"><span className="font-bold" style={{ color: '#f59e0b' }}>Ví dụ: </span>Cơm + ức gà · Khoai lang + yogurt · Bánh mì + trứng + chuối</div>
        </div>
        <div className="rounded-xl p-4 border" style={{ background: 'rgba(34,197,94,0.06)', borderColor: 'rgba(34,197,94,0.25)' }}>
          <div className="flex items-center gap-2 mb-3"><span className="text-xl">💥</span><div className="font-bold text-lg text-text">Post-Workout <span className="text-[10px] text-muted font-normal">(30–60 phút sau tập)</span></div></div>
          <FormulaCard label="Protein" formula="Protein = 0.25–0.4 g/kg" result={`= ${s.postProtein}g cho ${s.w}kg`} color={GREEN} />
          <div className="mt-2"><FormulaCard label="Carb" formula="Carb = 0.5–0.8 g/kg" result={`= ${s.postCarb}g cho ${s.w}kg`} color="#06b6d4" /></div>
          <div className="mt-2 rounded-xl p-2 border text-[10px] text-muted" style={{ borderColor: '#2a2a2a', background: '#0d0d0d' }}>
            <span className="font-bold text-green-400">Anabolic window</span> — 30–60 phút sau tập là thời điểm tổng hợp cơ tối ưu nhất
          </div>
          <div className="mt-2 text-[10px] text-muted"><span className="font-bold" style={{ color: GREEN }}>Ví dụ: </span>Whey + chuối · Cơm + ức gà · Sữa tươi + bánh mì trắng</div>
        </div>
      </div>
      <div className="rounded-xl p-3 border" style={{ background: '#0d0d0d', borderColor: '#2a2a2a' }}>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: LIME }}>Timeline tóm tắt</div>
        <div className="flex items-center gap-1 text-[9px] overflow-x-auto pb-1">
          {[
            { t: '-2h', c: '#f59e0b', l: 'Bữa chính' }, { t: '→', c: '#444' },
            { t: '-60m', c: '#84cc16', l: 'Pre nhỏ' }, { t: '→', c: '#444' },
            { t: 'TẬP', c: '#22c55e', l: '+nước' }, { t: '→', c: '#444' },
            { t: '+30m', c: '#22c55e', l: 'Post P+C' }, { t: '→', c: '#444' },
            { t: '+2h', c: '#84cc16', l: 'Bữa tiếp' },
          ].map((ev, i) => ev.l
            ? <div key={i} className="flex flex-col items-center shrink-0 mx-1"><span className="font-mono font-bold" style={{ color: ev.c }}>{ev.t}</span><span style={{ color: ev.c }}>{ev.l}</span></div>
            : <span key={i} style={{ color: ev.c }}>{ev.t}</span>
          )}
        </div>
      </div>
    </div>,

    // Step 13 — Sức Bền Dài
    <div key="s13" className="space-y-4">
      <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: '#06b6d4' }}>Tập &gt;60 phút</div>
      <div className="grid gap-3">
        {[
          { emoji: '🍌', label: 'Carb trong khi tập', formula: '30–60g carb/giờ', note: 'Gel năng lượng, chuối, nước có đường', color: '#f59e0b' },
          { emoji: '💧', label: 'Nước trong khi tập', formula: '400–800ml/giờ', note: 'Tùy cường độ và thời tiết', color: '#06b6d4' },
          { emoji: '🧂', label: 'Natri / Điện giải', formula: '500–700mg natri/giờ', note: 'Quan trọng khi tập >90 phút đổ mồ hôi nhiều', color: '#a855f7' },
        ].map((item, i) => (
          <div key={i} className="rounded-xl p-4 border" style={{ background: `${item.color}08`, borderColor: `${item.color}25` }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{item.emoji}</span>
              <div>
                <div className="font-bold text-lg" style={{ color: item.color }}>{item.label}</div>
                <div className="font-mono text-base" style={{ color: item.color }}>{item.formula}</div>
              </div>
            </div>
            <div className="text-[10px] text-muted">{item.note}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-4 border" style={{ background: '#0d0d0d', borderColor: '#2a2a2a' }}>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: LIME }}>Carb Loading 3 ngày trước race / event</div>
        <div className="space-y-2">
          {[
            { day: 'Ngày -3', note: 'Tập giảm volume · Carb bình thường', color: '#f59e0b' },
            { day: 'Ngày -2', note: 'Tập nhẹ · Tăng carb lên 60% kcal', color: '#84cc16' },
            { day: 'Ngày -1', note: 'Nghỉ hoặc đi bộ · Carb cao 70% kcal', color: '#22c55e' },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-3 text-base">
              <span className="font-mono font-bold shrink-0 w-16" style={{ color: row.color }}>{row.day}</span>
              <span className="text-muted">{row.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,

    // Step 14 — Nước · Xơ · Rau
    <div key="s14" className="space-y-4">
      <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: '#06b6d4' }}>3 chỉ tiêu thường bị bỏ qua</div>
      <div className="grid gap-3">
        <div className="rounded-xl p-4 border" style={{ background: 'rgba(6,182,212,0.06)', borderColor: 'rgba(6,182,212,0.25)' }}>
          <FormulaCard label="Nước uống/ngày" formula="Nước = Cân nặng × 35ml" result={`= ${s.w}kg × 35 = ${s.waterMl.toLocaleString()}ml = ${(s.waterMl/1000).toFixed(1)}L`} color="#06b6d4" />
          <div className="mt-2 text-[10px] text-muted">+500ml mỗi 30 phút tập · Nếu nước tiểu vàng đậm → uống thêm ngay</div>
        </div>
        <div className="rounded-xl p-4 border" style={{ background: 'rgba(34,197,94,0.06)', borderColor: 'rgba(34,197,94,0.25)' }}>
          <FormulaCard label="Chất xơ/ngày" formula="Xơ = Kcal mục tiêu × 14g / 1000kcal" result={`= ${s.targetKcal} × 0.014 = ${s.fiberG}g xơ`} color={GREEN} />
          <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
            {[
              { food: '🥦 Bông cải 100g', g: '2.4g' }, { food: '🫘 Đậu đen 100g', g: '8.7g' },
              { food: '🍎 Táo 1 quả', g: '4.4g' }, { food: '🥕 Cà rốt 100g', g: '2.8g' },
              { food: '🌾 Yến mạch 50g', g: '4.0g' }, { food: '🥑 Bơ ½ quả', g: '5.0g' },
            ].map((f, i) => (
              <div key={i} className="rounded-lg p-2" style={{ background: '#111' }}>
                <div className="text-muted mb-0.5">{f.food}</div>
                <div className="font-bold" style={{ color: GREEN }}>{f.g}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-3 border text-[10px]" style={{ background: 'rgba(132,204,22,0.06)', borderColor: 'rgba(132,204,22,0.25)' }}>
          <div className="flex items-center gap-2 mb-1"><span>🥗</span><div className="font-bold" style={{ color: LIME }}>Rau — Mục tiêu tối thiểu</div></div>
          <div className="font-mono text-base text-text mb-1">3–5 phần rau / ngày · 1 phần = 80–100g</div>
          <div className="text-muted">Rau lá xanh đậm + rau màu = tối ưu vi chất. Tránh tính khoai lang/bắp vào phần rau.</div>
        </div>
      </div>
    </div>,

    // Step 15 — Quy Đổi Khẩu Phần
    <div key="s15" className="space-y-4">
      <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: '#a855f7' }}>Không cần cân — dùng tay</div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: '✊', unit: '1 nắm tay', food: 'Tinh bột nấu (cơm, mì, khoai)', g: '~100–150g', kcal: '~130–200', c: GREEN },
          { icon: '🖐️', unit: '1 lòng bàn tay', food: 'Protein (thịt, cá, đậu hũ)', g: '~80–120g', kcal: '~120–180', c: GREEN },
          { icon: '👍', unit: '1 ngón cái', food: 'Chất béo (bơ, dầu, hạt)', g: '~10–15g', kcal: '~80–120', c: '#f59e0b' },
          { icon: '🤲', unit: '2 lòng bàn tay', food: 'Rau củ sống', g: '~60–80g', kcal: '~15–25', c: '#f59e0b' },
        ].map((item, i) => (
          <div key={i} className="rounded-xl p-3 border" style={{ background: `${item.c}08`, borderColor: `${item.c}25` }}>
            <div className="text-3xl mb-1">{item.icon}</div>
            <div className="font-bold text-[11px] mb-0.5" style={{ color: item.c }}>{item.unit}</div>
            <div className="text-[10px] text-muted mb-1">{item.food}</div>
            <div className="font-mono text-[9px]" style={{ color: item.c }}>{item.g} · {item.kcal} kcal</div>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#2a2a2a' }}>
        <table className="w-full text-[10px]">
          <thead><tr style={{ background: '#111' }}>
            <th className="text-left px-3 py-2 text-muted">Thực phẩm</th>
            <th className="px-3 py-2 text-right text-muted">Quy đổi</th>
            <th className="px-3 py-2 text-right" style={{ color: GREEN }}>Protein</th>
            <th className="px-3 py-2 text-right" style={{ color: LIME }}>Kcal</th>
          </tr></thead>
          <tbody>
            {[
              { food: 'Ức gà', ref: '1 lòng bàn tay ≈ 100g', p: '31g', kcal: '165' },
              { food: 'Cơm trắng', ref: '1 chén ≈ 200g nấu', p: '5g', kcal: '260' },
              { food: 'Trứng gà', ref: '1 quả ≈ 60g', p: '7g', kcal: '78' },
              { food: 'Cá hồi', ref: '1 lòng bàn tay ≈ 100g', p: '25g', kcal: '208' },
              { food: 'Đậu hũ', ref: '½ khối ≈ 100g', p: '8g', kcal: '76' },
              { food: 'Khoai lang', ref: '1 củ nhỏ ≈ 150g', p: '2g', kcal: '128' },
            ].map((row, i) => (
              <tr key={i} className="border-t" style={{ borderColor: '#1e1e1e' }}>
                <td className="px-3 py-2 font-bold text-text">{row.food}</td>
                <td className="px-3 py-2 text-right text-muted">{row.ref}</td>
                <td className="px-3 py-2 text-right font-mono font-bold" style={{ color: GREEN }}>{row.p}</td>
                <td className="px-3 py-2 text-right font-mono" style={{ color: LIME }}>{row.kcal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>,

    // Step 16 — Thực Đơn Tự Động
    <div key="s16" className="space-y-4">
      <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: GREEN }}>Ghép thực phẩm thực tế</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
        {[
          { n: '1', label: 'Tính TDEE + Target', icon: '🧮', color: '#06b6d4', note: 'Cân nặng, chiều cao, tuổi, mục tiêu' },
          { n: '2', label: 'Chia kcal theo bữa', icon: '🍱', color: '#f59e0b', note: '25% sáng · 35% trưa · 30% tối · 10% snack' },
          { n: '3', label: 'Phân bổ macro', icon: '📊', color: GREEN, note: `P=${s.proteinG}g · C=${s.carbG}g · F=${s.fatG}g` },
          { n: '4', label: 'Ghép thực phẩm', icon: '🥗', color: LIME, note: 'Dùng bảng quy đổi bước 16' },
        ].map((step, i) => (
          <div key={i} className="rounded-xl p-3 border text-center" style={{ background: `${step.color}08`, borderColor: `${step.color}25` }}>
            <div className="text-2xl mb-1">{step.icon}</div>
            <div className="font-bold text-[11px] mb-0.5" style={{ color: step.color }}>Bước {step.n}</div>
            <div className="font-medium text-[10px] text-text mb-1">{step.label}</div>
            <div className="text-muted text-[9px]">{step.note}</div>
          </div>
        ))}
      </div>
      {(() => {
        const m25 = Math.round(s.targetKcal * 0.25);
        const m35 = Math.round(s.targetKcal * 0.35);
        const m30 = Math.round(s.targetKcal * 0.30);
        const m10 = s.targetKcal - m25 - m35 - m30;
        const pSa = Math.round(s.proteinG * 0.20); const cSa = Math.round(s.carbG * 0.20); const fSa = Math.round(s.fatG * 0.25);
        const pLu = Math.round(s.proteinG * 0.35); const cLu = Math.round(s.carbG * 0.35); const fLu = Math.round(s.fatG * 0.35);
        const pSn = Math.round(s.proteinG * 0.10); const cSn = Math.round(s.carbG * 0.10); const fSn = Math.round(s.fatG * 0.10);
        const pDi = s.proteinG - pSa - pLu - pSn;
        const cDi = Math.max(0, s.carbG - cSa - cLu - cSn);
        const fDi = Math.max(0, s.fatG - fSa - fLu - fSn);
        const mealsData = [
          { name: '🌅 Bữa Sáng', time: '7:00–8:00', pct: 25, kcal: m25, p: pSa, c: cSa, f: fSa, color: '#f59e0b',
            foods: [{ name: `Trứng luộc ×${Math.max(1,Math.ceil(pSa/7))}`, p: Math.ceil(pSa/7)*7, c: 0, f: Math.ceil(pSa/7)*5 }, { name: `Bánh mì ${Math.round(cSa/0.45)}g`, p: 3, c: cSa, f: 1 }, { name: 'Sữa ít béo 200ml', p: 7, c: 10, f: 2 }] },
          { name: '☀️ Bữa Trưa', time: '12:00–13:00', pct: 35, kcal: m35, p: pLu, c: cLu, f: fLu, color: '#22c55e',
            foods: [{ name: `Ức gà ${Math.round(pLu/0.31)}g`, p: pLu, c: 0, f: Math.round(pLu*0.04) }, { name: `Cơm ${Math.round(cLu/0.28)}g`, p: 3, c: cLu, f: 0 }, { name: 'Rau xào + canh', p: 3, c: 5, f: Math.round(fLu*0.5) }] },
          { name: '🍵 Snack', time: '15:30–16:00', pct: 10, kcal: m10, p: pSn, c: cSn, f: fSn, color: '#84cc16',
            foods: [{ name: 'Greek yogurt 150g', p: pSn, c: cSn, f: 1 }, { name: '1 quả chuối', p: 1, c: 0, f: 0 }] },
          { name: '🌙 Bữa Tối', time: '18:30–19:30', pct: 30, kcal: m30, p: pDi, c: cDi, f: fDi, color: '#a855f7',
            foods: [{ name: `Cá ${Math.round(pDi*0.7/0.22)}g`, p: Math.round(pDi*0.7), c: 0, f: Math.round(pDi*0.7*0.05) }, { name: 'Đậu hũ 100g', p: Math.round(pDi*0.3), c: 2, f: 5 }, { name: `Cơm ${Math.round(cDi/0.28)}g`, p: 2, c: cDi, f: 0 }, { name: 'Rau hấp 200g', p: 3, c: 8, f: 0 }] },
        ];
        return (
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#2a2a2a' }}>
            <div className="px-4 py-2.5 font-bold text-base" style={{ background: '#0d0d0d', color: LIME }}>
              Mẫu thực đơn · {s.targetKcal.toLocaleString()} kcal · {s.proteinG}g P · {s.carbG}g C · {s.fatG}g F
            </div>
            {mealsData.map((meal, mi) => (
              <div key={mi} className="border-t" style={{ borderColor: '#1e1e1e' }}>
                <div className="px-4 py-2 flex items-center justify-between" style={{ background: `${meal.color}08` }}>
                  <div><span className="font-bold text-base" style={{ color: meal.color }}>{meal.name}</span><span className="text-muted text-[9px] ml-2">{meal.time} · {meal.pct}%</span></div>
                  <div className="text-[10px] font-mono flex gap-2">
                    <span style={{ color: meal.color }}>{meal.kcal} kcal</span>
                    <span style={{ color: GREEN }}>{meal.p}g P</span>
                    <span style={{ color: '#06b6d4' }}>{meal.c}g C</span>
                  </div>
                </div>
                {meal.foods.map((food, fi) => (
                  <div key={fi} className="flex items-center px-4 py-1.5 border-t" style={{ borderColor: '#111' }}>
                    <span className="flex-1 text-[10px] text-muted">{food.name}</span>
                    <div className="flex gap-3 text-[9px] font-mono shrink-0">
                      <span style={{ color: GREEN }}>{food.p}g</span>
                      <span style={{ color: '#06b6d4' }}>{food.c}g</span>
                      <span style={{ color: '#f59e0b' }}>{food.f}g</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div className="px-4 py-2.5 border-t flex items-center justify-between" style={{ borderColor: '#2a2a2a', background: '#0d0d0d' }}>
              <span className="text-base font-bold text-text">Tổng ngày</span>
              <div className="flex gap-3 text-base font-mono">
                <span style={{ color: LIME }}>{s.targetKcal.toLocaleString()} kcal</span>
                <span style={{ color: GREEN }}>{s.proteinG}g P</span>
                <span style={{ color: '#06b6d4' }}>{s.carbG}g C</span>
                <span style={{ color: '#f59e0b' }}>{s.fatG}g F</span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>,
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
      <Link to="/pillar/b" className="inline-flex items-center gap-2 text-base text-muted hover:text-lime-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
        <span>Dinh Dưỡng</span>
      </Link>

      {/* Hero */}
      <RevealBlock>
        <div className="flex items-start gap-6 mb-10 relative">
          <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(132,204,22,0.05)' }} />
          <div className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center shrink-0 nf-float border" style={{ background: 'rgba(132,204,22,0.08)', borderColor: 'rgba(132,204,22,0.2)' }}>
            🧮
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight nf-fade-in-up">
              <span className="nf-shimmer">Công Thức Tính Meal Plan</span>
            </h1>
            <div className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: LIME, background: 'rgba(132,204,22,0.1)', borderColor: 'rgba(132,204,22,0.2)' }}>
              10 Bước · Mifflin-St Jeor · Calorie Cycling
            </div>
            <p className="text-muted text-lg leading-relaxed max-w-2xl">
              Hệ thống công thức chuẩn khoa học: từ thông số cá nhân → BMI → BMR → TDEE → Kcal mục tiêu → Phân bổ macro → Chia bữa → Điều chỉnh theo ngày tập.
            </p>
          </div>
        </div>
      </RevealBlock>

      {/* Hero image */}
      <RevealBlock delay={100}>
        <div className="nf-orbit-ring rounded-3xl p-[1.5px] mb-12">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=1000&q=75&auto=format&fit=crop" alt="Nutrition formula" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 50%, transparent 100%)' }} />
            <div className="absolute bottom-4 left-6">
              <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: LIME, background: 'rgba(10,10,10,0.6)', borderColor: 'rgba(132,204,22,0.2)' }}>
                Mifflin-St Jeor Formula System
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* Personalized stats bar */}
      <RevealBlock delay={150}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { label: 'BMI', val: s.bmi, sub: bmiLabel(s.bmi).label, color: bmiLabel(s.bmi).color },
            { label: 'BMR', val: `${s.bmr.toLocaleString()}`, sub: 'kcal/ngày', color: GREEN },
            { label: 'TDEE', val: `${s.tdee.toLocaleString()}`, sub: 'kcal/ngày', color: LIME },
            { label: 'Mục tiêu', val: `${s.targetKcal.toLocaleString()}`, sub: 'kcal/ngày', color: s.gm.color },
          ].map((item, i) => (
            <div key={i} className="rounded-xl p-3 border text-center" style={{ background: `${item.color}08`, borderColor: `${item.color}25` }}>
              <div className="text-[10px] text-muted uppercase tracking-wider">{item.label}</div>
              <div className="text-2xl font-bold nf-count" style={{ color: item.color }}>{item.val}</div>
              <div className="text-[10px]" style={{ color: item.color, opacity: 0.7 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Divider */}
      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, rgba(132,204,22,0.3), transparent)' }} />

      {/* Section 2: Formula Chain Overview */}
      <RevealBlock delay={200}>
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: LIME }}>Tổng quan hệ thống</div>
          <h2 className="text-3xl font-bold text-text mb-6">Chuỗi Công Thức 10 Bước</h2>
          <div className="rounded-2xl p-5 border" style={{ background: 'rgba(132,204,22,0.04)', borderColor: 'rgba(132,204,22,0.15)' }}>
            <FormulaChainDiagram />
          </div>
        </div>
      </RevealBlock>

      {/* Section 3: Interactive Step Calculator */}
      <RevealBlock delay={250}>
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: GREEN }}>Tính toán tương tác</div>
          <h2 className="text-3xl font-bold text-text mb-6">Bộ Tính Từng Bước</h2>
          <div className="grid md:grid-cols-[220px_1fr] gap-4">
            {/* Step nav */}
            <div className="rounded-2xl border p-3 h-fit" style={{ background: '#0d0d0d', borderColor: '#1e1e1e' }}>
              {FORMULA_STEPS.map((step, i) => (
                <button key={i} onClick={() => setActiveStep(i)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all mb-0.5 text-base"
                  style={{ background: activeStep === i ? `${GREEN}15` : 'transparent', color: activeStep === i ? GREEN : i < activeStep ? '#555' : '#666', borderLeft: activeStep === i ? `2px solid ${GREEN}` : '2px solid transparent' }}>
                  <span className="text-lg">{step.emoji}</span>
                  <span className="font-medium">{step.label}</span>
                  {i < activeStep && <span className="ml-auto text-[10px]" style={{ color: GREEN }}>✓</span>}
                </button>
              ))}
            </div>
            {/* Step content */}
            <div className="rounded-2xl border p-5" style={{ background: '#0a0a0a', borderColor: '#1e1e1e' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold" style={{ background: `${GREEN}20`, color: GREEN }}>
                  {FORMULA_STEPS[activeStep].n}
                </div>
                <div>
                  <div className="font-bold text-text text-lg">{FORMULA_STEPS[activeStep].emoji} {FORMULA_STEPS[activeStep].label}</div>
                  <div className="text-[10px] text-muted">Bước {FORMULA_STEPS[activeStep].n} / {FORMULA_STEPS.length}</div>
                </div>
              </div>
              {stepContent[activeStep]}
              <div className="flex gap-2 mt-5 pt-4 border-t" style={{ borderColor: '#1a1a1a' }}>
                {activeStep > 0 && (
                  <button onClick={() => setActiveStep(p => p - 1)}
                    className="flex-1 py-2 rounded-xl text-base font-semibold border transition-all"
                    style={{ borderColor: '#2a2a2a', color: '#666' }}>
                    ← Trước
                  </button>
                )}
                {activeStep < FORMULA_STEPS.length - 1 && (
                  <button onClick={() => setActiveStep(p => p + 1)}
                    className="flex-1 py-2 rounded-xl text-base font-bold transition-all active:scale-95"
                    style={{ background: `${GREEN}18`, borderColor: GREEN, border: `1px solid ${GREEN}`, color: GREEN }}>
                    Tiếp theo →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* Divider */}
      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, rgba(132,204,22,0.3), transparent)' }} />

      {/* Section 4: Water & Fiber */}
      <RevealBlock delay={100}>
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: LIME }}>Nhu cầu cơ bản</div>
          <h2 className="text-3xl font-bold text-text mb-6">Nước & Chất Xơ</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 border" style={{ background: 'rgba(6,182,212,0.06)', borderColor: 'rgba(6,182,212,0.2)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'rgba(6,182,212,0.15)' }}>💧</div>
                <div className="font-bold text-text">Nước uống hàng ngày</div>
              </div>
              <FormulaCard label="Công thức" formula="Nước(ml) = Cân nặng × 35ml"
                result={`= ${s.w}kg × 35 = ${s.waterMl}ml = ${(s.waterMl/1000).toFixed(1)}L`} color="#06b6d4" />
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-base text-muted">
                  <span style={{ color: '#06b6d4' }}>+</span>
                  <span>Ngày tập: thêm +500–1000ml</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted">
                  <span style={{ color: '#06b6d4' }}>+</span>
                  <span>Trong tập: 400–800ml/giờ</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl p-5 border" style={{ background: 'rgba(34,197,94,0.06)', borderColor: 'rgba(34,197,94,0.2)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'rgba(34,197,94,0.15)' }}>🌿</div>
                <div className="font-bold text-text">Chất xơ hàng ngày</div>
              </div>
              <FormulaCard label="Công thức" formula="Chất xơ(g) = Kcal × 14g/1000kcal"
                result={`= ${s.targetKcal} × 0.014 = ${s.fiberG}g/ngày`} color={GREEN} />
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-base text-muted">
                  <span style={{ color: GREEN }}>→</span>
                  <span>Thực tế: 2–4 nắm tay rau/ngày</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted">
                  <span style={{ color: GREEN }}>→</span>
                  <span>Đa dạng rau xanh + rau củ màu sắc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* Divider */}
      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, rgba(132,204,22,0.3), transparent)' }} />

      {/* Section 5: Case Study */}
      <RevealBlock delay={100}>
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: LIME }}>Ví dụ thực tế</div>
          <h2 className="text-3xl font-bold text-text mb-2">Case Study — {CASE_STUDY.name}</h2>
          <p className="text-muted text-lg mb-6">{CASE_STUDY.activityLabel} · {CASE_STUDY.note}</p>

          <div className="grid md:grid-cols-[1fr_2fr] gap-4 mb-6">
            <div className="rounded-2xl p-4 border space-y-2" style={{ background: '#0d0d0d', borderColor: '#1e1e1e' }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: LIME }}>Thông số đầu vào</div>
              {[
                { label: 'Giới tính', val: 'Nam' },
                { label: 'Tuổi', val: '48 tuổi' },
                { label: 'Cân nặng', val: '77 kg' },
                { label: 'Chiều cao', val: '1m75 (175cm)' },
                { label: 'Vận động', val: CASE_STUDY.activityLabel },
                { label: 'Mục tiêu', val: 'Sức bền (đạp xe/bơi/gym)' },
              ].map((row, i) => (
                <div key={i} className="flex justify-between text-base py-1 border-b" style={{ borderColor: '#1a1a1a' }}>
                  <span className="text-muted">{row.label}</span>
                  <span className="font-semibold text-text">{row.val}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#1e1e1e' }}>
              <div className="grid grid-cols-4 text-[9px] font-bold uppercase tracking-wider px-3 py-2.5" style={{ background: '#111', color: '#555' }}>
                <span>Bước</span>
                <span>Công thức</span>
                <span className="hidden sm:block">Tính</span>
                <span>Kết quả</span>
              </div>
              {[
                { step: 'BMI', formula: '77 ÷ (1.75)²', calc: '77 ÷ 3.0625', result: '25.1', color: '#f59e0b' },
                { step: 'BMR', formula: '10×77+6.25×175−5×48+5', calc: '770+1094−240+5', result: '1,629 kcal', color: GREEN },
                { step: 'TDEE', formula: '1629 × 1.725', calc: '1629 × 1.725', result: '2,810 kcal', color: LIME },
                { step: 'Kcal (sức bền)', formula: 'TDEE + 200', calc: '2810 + 200', result: '3,010 kcal', color: '#f59e0b' },
                { step: 'Protein', formula: '77 × 1.6g/kg', calc: '77 × 1.6', result: '123g / 492 kcal', color: GREEN },
                { step: 'Fat', formula: '3010 × 0.25 ÷ 9', calc: '752.5 ÷ 9', result: '84g / 756 kcal', color: '#f59e0b' },
                { step: 'Carb', formula: '(3010−492−756) ÷ 4', calc: '1762 ÷ 4', result: '441g / 1764 kcal', color: '#06b6d4' },
                { step: 'Nước', formula: '77 × 35ml', calc: '77 × 35', result: '2,695ml / 2.7L', color: '#06b6d4' },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-4 px-3 py-2 text-base border-t" style={{ borderColor: '#1a1a1a', background: i % 2 === 0 ? 'transparent' : '#0d0d0d' }}>
                  <span className="font-semibold" style={{ color: row.color }}>{row.step}</span>
                  <span className="font-mono text-[10px] text-muted">{row.formula}</span>
                  <span className="font-mono text-[10px] text-muted hidden sm:block">{row.calc}</span>
                  <span className="font-bold" style={{ color: row.color }}>{row.result}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: LIME }}>Phân bổ theo ngày tập</div>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#1e1e1e' }}>
            <div className="grid grid-cols-5 text-[9px] font-bold uppercase tracking-wider px-3 py-2.5" style={{ background: '#111', color: '#555' }}>
              <span>Ngày</span>
              <span>Kcal</span>
              <span>Protein</span>
              <span>Carb</span>
              <span>Fat</span>
            </div>
            {[
              { label: '🏋️ Tập nặng', kcal: Math.round(3010 * 1.07), protein: 123, carb: Math.round(441 * 1.4), fat: 84, color: '#22c55e' },
              { label: '🚴 Tập vừa', kcal: 3010, protein: 123, carb: 441, fat: 84, color: '#06b6d4' },
              { label: '🚶 Tập nhẹ', kcal: Math.round(3010 * 0.95), protein: 123, carb: Math.round(441 * 0.85), fat: 84, color: '#f59e0b' },
              { label: '😴 Ngày nghỉ', kcal: Math.round(3010 * 0.90), protein: 123, carb: Math.round(441 * 0.7), fat: 84, color: '#a855f7' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-5 px-3 py-2.5 text-base border-t" style={{ borderColor: '#1a1a1a', background: i % 2 === 0 ? 'transparent' : '#0d0d0d' }}>
                <span className="font-semibold" style={{ color: row.color }}>{row.label}</span>
                <span className="font-mono font-bold" style={{ color: row.color }}>{row.kcal.toLocaleString()}</span>
                <span className="font-mono text-muted">{row.protein}g</span>
                <span className="font-mono font-bold" style={{ color: row.color }}>{row.carb}g</span>
                <span className="font-mono text-muted">{row.fat}g</span>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>


      {/* Section 6: Adjustment Rules */}
      <RevealBlock delay={100}>
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: LIME }}>Sau 2 tuần thực hiện</div>
          <h2 className="text-3xl font-bold text-text mb-6">Quy Tắc Điều Chỉnh</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                icon: '⬇️', color: '#ef4444',
                title: 'Cân giảm quá nhanh (>0.5kg/tuần)',
                action: 'Tăng 100–200 kcal từ carb hoặc fat. Tránh mất cơ.',
              },
              {
                icon: '⛔', color: '#f59e0b',
                title: 'Cân không đổi (mục tiêu giảm mỡ)',
                action: 'Giảm 100–200 kcal hoặc kiểm tra lại tracking thực tế.',
              },
              {
                icon: '🪫', color: '#a855f7',
                title: 'Năng lượng thấp cả ngày',
                action: 'Kiểm tra protein đủ chưa + timing carb trước/sau tập.',
              },
              {
                icon: '🌙', color: '#06b6d4',
                title: 'Đói ban đêm liên tục',
                action: 'Tăng protein bữa tối hoặc thêm snack protein trước ngủ.',
              },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl p-4 border" style={{ background: `${card.color}08`, borderColor: `${card.color}25` }}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl mt-0.5">{card.icon}</span>
                  <div>
                    <div className="font-bold text-lg mb-1" style={{ color: card.color }}>{card.title}</div>
                    <div className="text-base text-muted leading-relaxed">{card.action}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* Section 7: Safety Note */}
      <RevealBlock delay={100}>
        <div className="rounded-2xl p-5 border mb-8" style={{ background: 'rgba(132,204,22,0.05)', borderColor: 'rgba(132,204,22,0.25)' }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: 'rgba(132,204,22,0.15)' }}>
              🛡️
            </div>
            <div>
              <div className="font-bold text-text mb-2">Lưu ý quan trọng</div>
              <div className="text-base text-muted leading-relaxed space-y-1">
                <div>Các công thức trên cung cấp điểm khởi đầu khoa học, không phải con số tuyệt đối. Cơ thể mỗi người phản ứng khác nhau — hãy theo dõi ít nhất 2 tuần trước khi điều chỉnh.</div>
                <div>Người có bệnh nền (tiểu đường, bệnh thận, tim mạch) hoặc có mục tiêu đặc biệt nên tham khảo bác sĩ hoặc chuyên gia dinh dưỡng được cấp phép.</div>
                <div>Không cắt calo dưới 1,200 kcal/ngày (nữ) hoặc 1,500 kcal/ngày (nam) mà không có sự giám sát y tế.</div>
              </div>
            </div>
          </div>
        </div>
      </RevealBlock>
    </div>
  );
}
