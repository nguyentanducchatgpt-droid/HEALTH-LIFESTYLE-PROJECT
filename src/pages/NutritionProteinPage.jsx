import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';

const GREEN = '#22c55e';
const LIME = '#84cc16';
const CYAN = '#06b6d4';
const LS_INPUTS = 'healthapp_b0_inputs';

/* ─── Protein factor by goal ─── */
const PROTEIN_GOALS = [
  { key: 'loss',    label: 'Giảm mỡ',    emoji: '🔥', factor: 2.0,  color: '#ef4444', min: 1.8, max: 2.2, desc: 'Bảo vệ khối cơ trong thâm hụt calo. Ưu tiên cao hơn các mục tiêu khác.' },
  { key: 'recomp',  label: 'Tái tổ hợp', emoji: '⚖️', factor: 1.8,  color: '#84cc16', min: 1.6, max: 2.0, desc: 'Cân bằng: giảm mỡ + xây cơ đồng thời. Protein là chìa khoá.' },
  { key: 'gain',    label: 'Tăng cơ',    emoji: '💪', factor: 1.8,  color: '#06b6d4', min: 1.6, max: 2.0, desc: 'Cung cấp axit amin cho quá trình tổng hợp protein cơ bắp.' },
  { key: 'endure',  label: 'Sức bền',    emoji: '🏃', factor: 1.6,  color: '#f59e0b', min: 1.4, max: 1.8, desc: 'Phục hồi sợi cơ sau tập cardio dài. Thấp hơn tầng tăng cơ.' },
  { key: 'health',  label: 'Sức khoẻ',  emoji: '🌿', factor: 1.2,  color: '#a855f7', min: 0.8, max: 1.6, desc: 'Duy trì sức khoẻ chung. Mức tối thiểu đề xuất của WHO.' },
];

const LEVEL_RECS = [
  { level: 'Beginner', sub: 'Người mới', pct: '1.0–1.2', emoji: '🌱', color: '#84cc16',
    tips: ['Mỗi bữa có ít nhất 1 nguồn đạm', 'Trứng hoặc đậu hũ là lựa chọn dễ', 'Không cần cân đo, ước lượng bằng lòng bàn tay'] },
  { level: 'Standard', sub: 'Người quen tập', pct: '1.4–1.8', emoji: '🏋️', color: '#06b6d4',
    tips: ['Theo dõi protein hằng ngày bằng app', 'Spread đều 3–4 bữa mỗi bữa 25–35g', 'Bổ sung sau tập 20–30g trong 30–60 phút'] },
  { level: 'Nâng cao', sub: 'Vận động viên', pct: '1.8–2.4', emoji: '🏆', color: '#22c55e',
    tips: ['Protein trước tập 0.25g/kg thể trọng', 'Protein sau tập 0.3g/kg thể trọng', 'Cân nhắc casein protein ban đêm'] },
];

/* ─── Vietnamese protein sources ─── */
const PROTEIN_SOURCES = [
  { name: 'Ức gà',         cat: 'Thịt',    p100: 31, fat100: 3.6,  kcal100: 165, emoji: '🍗', color: '#22c55e',  tags: ['lean', 'popular'] },
  { name: 'Cá hồi',        cat: 'Hải sản', p100: 25, fat100: 13.4, kcal100: 208, emoji: '🐟', color: '#f97316',  tags: ['omega3', 'quality'] },
  { name: 'Trứng gà',      cat: 'Trứng',   p100: 13, fat100: 11,   kcal100: 155, emoji: '🥚', color: '#eab308',  tags: ['complete', 'cheap'] },
  { name: 'Đậu hũ cứng',   cat: 'Đậu',    p100: 17, fat100: 4.8,  kcal100: 144, emoji: '🫘', color: '#84cc16',  tags: ['vegan', 'cheap'] },
  { name: 'Thịt bò nạc',   cat: 'Thịt',   p100: 26, fat100: 5.5,  kcal100: 158, emoji: '🥩', color: '#dc2626',  tags: ['iron', 'b12'] },
  { name: 'Tôm',           cat: 'Hải sản', p100: 24, fat100: 0.9,  kcal100: 106, emoji: '🦐', color: '#fb923c',  tags: ['lean', 'quick'] },
  { name: 'Cá ngừ (hộp)',  cat: 'Hải sản', p100: 25, fat100: 1.0,  kcal100: 116, emoji: '🐠', color: '#06b6d4',  tags: ['lean', 'cheap'] },
  { name: 'Greek yogurt',  cat: 'Sữa',    p100: 10, fat100: 0.4,  kcal100: 59,  emoji: '🥛', color: '#a855f7',  tags: ['probiotic', 'snack'] },
  { name: 'Lòng trắng trứng', cat: 'Trứng', p100: 11, fat100: 0.2, kcal100: 52,  emoji: '⚪', color: '#e2e8f0',  tags: ['lean', 'pure'] },
  { name: 'Phô mai Cottage', cat: 'Sữa',  p100: 11, fat100: 4.3,  kcal100: 98,  emoji: '🧀', color: '#fbbf24',  tags: ['casein', 'slow'] },
  { name: 'Whey protein',  cat: 'Supplement', p100: 80, fat100: 3, kcal100: 370, emoji: '💊', color: '#64748b',  tags: ['supplement', 'fast'] },
  { name: 'Thịt heo nạc',  cat: 'Thịt',   p100: 27, fat100: 3.5,  kcal100: 143, emoji: '🥓', color: '#f472b6',  tags: ['popular', 'vn'] },
];

const CAT_COLORS = { Thịt: '#ef4444', 'Hải sản': '#06b6d4', Trứng: '#eab308', Đậu: '#84cc16', Sữa: '#a855f7', Supplement: '#64748b' };

/* ─── Timing recommendations ─── */
const TIMING_WINDOWS = [
  { id: 'morning',  label: 'Buổi Sáng',    emoji: '🌅', pct: 25, note: 'Phá vỡ nhịn ăn qua đêm. Kích thích tổng hợp protein.', example: '30g — 2 trứng + 100g ức gà' },
  { id: 'prework',  label: 'Trước Tập',    emoji: '⚡', pct: 15, note: '1–2h trước tập. Axit amin sẵn sàng trong máu.', example: '20g — 200ml Greek yogurt + 1 trứng' },
  { id: 'postwork', label: 'Sau Tập',      emoji: '💥', pct: 20, note: '30–60 phút sau tập (anabolic window). Phục hồi cơ.', example: '25–35g — whey hoặc 120g ức gà' },
  { id: 'lunch',    label: 'Bữa Trưa',    emoji: '☀️', pct: 25, note: 'Bữa lớn nhất ngày. Đảm bảo đạt 25–35g protein.', example: '35g — 150g cá/thịt + 2 trứng' },
  { id: 'dinner',   label: 'Bữa Tối',     emoji: '🌙', pct: 15, note: 'Casein chậm tiêu hỗ trợ phục hồi ban đêm.', example: '25g — 150g cá hoặc đậu hũ + rau' },
];

/* ─── Myths ─── */
const MYTHS = [
  { myth: 'Ăn nhiều protein sẽ hại thận', fact: 'Người khỏe mạnh không có bằng chứng hại thận với mức 2g/kg/ngày. Chỉ thận đã có bệnh mới cần hạn chế.', icon: '🏥' },
  { myth: 'Protein dư sẽ tự biến thành cơ', fact: 'Protein cần có kích thích cơ học (tập tạ) mới kích hoạt tổng hợp cơ. Ăn nhiều mà không tập chỉ là calo dư.', icon: '🏋️' },
  { myth: 'Chỉ whey mới tốt', fact: 'Thực phẩm tự nhiên (gà, trứng, cá, đậu) có đủ các axit amin thiết yếu. Whey chỉ là tiện lợi, không phải bắt buộc.', icon: '💊' },
  { myth: 'Vegan không đủ protein', fact: 'Kết hợp đậu + ngũ cốc, tempeh, edamame, đậu hũ cứng đủ protein chất lượng cao. Cần theo dõi leucine và B12.', icon: '🌱' },
  { myth: 'Cơ thể chỉ hấp thu 30g/bữa', fact: 'Cơ thể hấp thu hết protein, nhưng tổng hợp cơ tối ưu ở 25–40g/bữa. Lượng dư sẽ được dùng làm năng lượng.', icon: '🧬' },
];

/* ─── IntersectionObserver reveal ─── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}
function RevealBlock({ children, className = '', delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)', transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── Protein Donut SVG ─── */
function ProteinDonut({ proteinPct, fatPct, carbPct, proteinG }) {
  const cx = 70, cy = 70, r = 50, stroke = 18;
  const circ = 2 * Math.PI * r;
  const pP = (proteinPct / 100) * circ, pF = (fatPct / 100) * circ, pC = (carbPct / 100) * circ;
  let offset = circ * 0.25;
  const segs = [
    { pct: pP, color: GREEN,   off: offset },
    { pct: pF, color: '#f97316', off: offset - pP },
    { pct: pC, color: CYAN,    off: offset - pP - pF },
  ];
  return (
    <svg viewBox="0 0 140 140" className="w-32 h-32 md:w-40 md:h-40" style={{ overflow: 'visible' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
      {segs.map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color}
          strokeWidth={stroke} strokeDasharray={`${s.pct} ${circ - s.pct}`}
          strokeDashoffset={s.off} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.8s ease' }} />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fill={GREEN} fontSize="14" fontWeight="800">{proteinG}g</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fill="#64748b" fontSize="8">Protein</text>
      <text x={cx} y={cy + 20} textAnchor="middle" fill="#94a3b8" fontSize="7">{proteinPct}%</text>
    </svg>
  );
}

/* ─── Protein Bar per meal ─── */
function MealBars({ proteinG }) {
  const meals = [
    { label: 'Sáng',    pct: 25, example: 'Trứng + sữa chua' },
    { label: 'Trưa',    pct: 35, example: 'Thịt/cá chính' },
    { label: 'Snack',   pct: 10, example: 'Đậu hũ / Greek yogurt' },
    { label: 'Tối',     pct: 30, example: 'Cá / gà / đậu' },
  ];
  return (
    <div className="space-y-3">
      {meals.map((m) => {
        const g = Math.round(proteinG * m.pct / 100);
        return (
          <div key={m.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-text">{m.label}</span>
              <span className="text-[10px] font-bold" style={{ color: GREEN }}>{g}g</span>
            </div>
            <div className="relative h-3 rounded-full bg-surface/40 overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${m.pct}%`, background: `linear-gradient(90deg, ${GREEN}, ${LIME})`, transition: 'width 0.7s ease' }} />
            </div>
            <p className="text-[9px] text-muted mt-0.5">{m.example}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Protein gauge (score 0–100) ─── */
function ProteinGauge({ current, target }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  const angle = -135 + (pct / 100) * 270;
  const color = pct >= 90 ? GREEN : pct >= 60 ? LIME : pct >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <svg viewBox="0 0 120 80" className="w-28 h-20" style={{ overflow: 'visible' }}>
      <path d="M10,70 A50,50 0 0,1 110,70" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
      <path d="M10,70 A50,50 0 0,1 110,70" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * 157} 157`} style={{ transition: 'all 0.8s ease' }} />
      <text x="60" y="62" textAnchor="middle" fill={color} fontSize="16" fontWeight="800">{pct}%</text>
      <text x="60" y="74" textAnchor="middle" fill="#64748b" fontSize="7">đạt mục tiêu</text>
    </svg>
  );
}

/* ─── Source rank bar ─── */
function SourceBar({ item, portion, active }) {
  const pG = (item.p100 * portion / 100);
  const maxPer = 40;
  const barPct = Math.min(100, (pG / maxPer) * 100);
  return (
    <div className={`rounded-2xl border p-3.5 cursor-pointer transition-all duration-200 ${active ? 'border-green-500/50 bg-green-500/8' : 'border-border/20 bg-surface/20 hover:border-border/40'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-text truncate">{item.name}</p>
          <p className="text-[8px] text-muted">{item.cat} · {item.kcal100} kcal/100g</p>
        </div>
        <span className="text-lg font-black shrink-0" style={{ color: item.color }}>{pG.toFixed(1)}g</span>
      </div>
      <div className="relative h-2 rounded-full bg-surface/40 overflow-hidden">
        <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{ width: `${barPct}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}88)` }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[8px] text-muted">{portion}g khẩu phần</span>
        <span className="text-[8px] text-muted">{(item.kcal100 * portion / 100).toFixed(0)} kcal</span>
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function NutritionProteinPage() {
  const [inputs, setInputs] = useState({
    weight: 70, height: 170, age: 30, sex: 'male',
    activityKey: 'moderate', goalKey: 'gain',
  });
  const [goalKey, setGoalKey] = useState('gain');
  const [selectedSource, setSelectedSource] = useState(null);
  const [filterCat, setFilterCat] = useState('All');
  const [portion, setPortion] = useState(150);
  const [currentG, setCurrentG] = useState(0);
  const [activeTab, setActiveTab] = useState('calculator');
  const [customFactor, setCustomFactor] = useState(null);

  /* load from localStorage */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_INPUTS) || '{}');
      if (saved.weight) setInputs(prev => ({ ...prev, ...saved }));
      if (saved.goalKey) setGoalKey(saved.goalKey);
    } catch {}
  }, []);

  /* orbit ring CSS injection */
  useEffect(() => {
    const id = 'np-page-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --np-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes npOrbitSpin { to { --np-orbit-angle: 360deg; } }
      .np-orbit-ring {
        background: conic-gradient(from var(--np-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(34,197,94,0.0) 65deg, rgba(34,197,94,0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(34,197,94,0.75) 99deg,
          rgba(34,197,94,0.0) 115deg, transparent 125deg, transparent 360deg);
        animation: npOrbitSpin 3.5s linear infinite;
      }
      @keyframes npFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      .np-float { animation: npFloat 3.5s ease-in-out infinite; }
      @keyframes npShimmer {
        0%{background-position:-200% center}
        100%{background-position:200% center}
      }
      .np-shimmer {
        background: linear-gradient(90deg, #22c55e33 25%, #22c55e88 50%, #22c55e33 75%);
        background-size: 200% auto;
        animation: npShimmer 2.5s linear infinite;
      }
      @keyframes npPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(0.96)} }
      .np-pulse { animation: npPulse 2s ease-in-out infinite; }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const gm = PROTEIN_GOALS.find(g => g.key === goalKey) || PROTEIN_GOALS[2];
  const factor = customFactor !== null ? customFactor : gm.factor;
  const w = Number(inputs.weight) || 70;
  const h = Number(inputs.height) || 170;
  const a = Number(inputs.age) || 30;
  const sx = inputs.sex || 'male';
  const bmr = Math.round(sx === 'male' ? 10*w + 6.25*h - 5*a + 5 : 10*w + 6.25*h - 5*a - 161);
  const tdee = Math.round(bmr * 1.55);
  const targetKcal = tdee;
  const proteinG = Math.round(w * factor);
  const fatG = Math.round(targetKcal * 0.25 / 9);
  const carbG = Math.round((targetKcal - proteinG*4 - fatG*9) / 4);
  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  const carbKcal = carbG * 4;
  const proteinPct = Math.round(proteinKcal / targetKcal * 100);
  const fatPct = Math.round(fatKcal / targetKcal * 100);
  const carbPct = 100 - proteinPct - fatPct;
  const perMealProtein = Math.round(proteinG / 4);

  /* progress gauge */
  const progressPct = Math.min(100, Math.round((currentG / proteinG) * 100));
  const progressColor = progressPct >= 90 ? GREEN : progressPct >= 60 ? LIME : progressPct >= 40 ? '#f59e0b' : '#ef4444';

  const cats = useMemo(() => ['All', ...Array.from(new Set(PROTEIN_SOURCES.map(s => s.cat)))], []);
  const filteredSources = useMemo(() =>
    filterCat === 'All' ? PROTEIN_SOURCES : PROTEIN_SOURCES.filter(s => s.cat === filterCat), [filterCat]);

  const TABS = [
    { id: 'calculator', label: 'Máy Tính', emoji: '📐' },
    { id: 'sources',    label: 'Nguồn Đạm', emoji: '🍗' },
    { id: 'timing',     label: 'Timing', emoji: '⏰' },
    { id: 'levels',     label: 'Cấp Độ', emoji: '📊' },
    { id: 'myths',      label: 'Sự Thật', emoji: '🧬' },
  ];

  return (
    <div className="min-h-screen bg-bg text-text pb-24 px-4 max-w-3xl mx-auto pt-8 md:pt-12">

      {/* ── Breadcrumb ── */}
      <Link to="/pillar/b" className="inline-flex items-center gap-1.5 text-[10px] text-muted hover:text-green-400 transition-colors mb-8">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="15 18 9 12 15 6"/></svg>
        Dinh dưỡng & Thực đơn
      </Link>

      {/* ── Hero ── */}
      <RevealBlock className="mb-10 relative">
        <div className="absolute -top-8 -left-8 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: `${GREEN}08` }} />
        <div className="flex items-start gap-6 relative">
          <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border border-green-500/20 shrink-0 flex items-center justify-center np-float">💪</div>
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Công Thức Tính Protein</h1>
            <span className="inline-block text-base font-bold uppercase tracking-widest text-green-400 mt-3 mb-4 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">Nền Tảng Dinh Dưỡng</span>
            <p className="text-muted text-lg leading-relaxed max-w-2xl">
              Protein là "neo chính" của mỗi bữa ăn — từ công thức tính lượng cần thiết, nguồn thực phẩm Việt Nam, đến timing tối ưu trước và sau tập luyện.
            </p>
          </div>
        </div>
      </RevealBlock>

      {/* ── Hero image ── */}
      <RevealBlock className="mb-12">
        <div className="np-orbit-ring rounded-3xl p-[1.5px]">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1000&q=75&auto=format&fit=crop"
              alt="Protein foods" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
            <div className="absolute bottom-4 left-6 flex gap-3">
              {[
                { label: `${proteinG}g`, sub: 'Protein/ngày', color: GREEN },
                { label: `${factor}g/kg`, sub: 'Hệ số', color: LIME },
                { label: `${Math.round(proteinPct)}%`, sub: 'Tổng macro', color: CYAN },
              ].map((s, i) => (
                <div key={i} className="bg-bg/70 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                  <p className="text-lg font-black" style={{ color: s.color }}>{s.label}</p>
                  <p className="text-[8px] text-muted">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* ── Quick Stats ── */}
      <RevealBlock className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Lượng protein/ngày', value: `${proteinG}g`, icon: '💪', color: GREEN },
            { label: 'Hệ số (g/kg)', value: `${factor}`, icon: '📐', color: LIME },
            { label: 'Protein mỗi bữa', value: `~${perMealProtein}g`, icon: '🍽️', color: CYAN },
            { label: 'Kcal từ protein', value: `${proteinKcal}`, icon: '🔥', color: '#f59e0b' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-border/20 bg-surface/20 p-4 text-center">
              <div className="text-3xl mb-1">{s.icon}</div>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[8px] text-muted uppercase tracking-wide mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* ── Why protein matters ── */}
      <RevealBlock className="mb-12">
        <div className="rounded-3xl border border-green-500/20 bg-surface/10 p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-56 h-56 rounded-full blur-[80px] pointer-events-none" style={{ background: `${GREEN}06` }} />
          <div className="relative">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-400 mb-3">Tại sao Protein quan trọng?</p>
            <h2 className="text-2xl font-black text-text mb-5">Protein — "Neo Chính" của mỗi bữa ăn</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { emoji: '🍱', title: 'No lâu hơn', desc: 'Protein có thermic effect cao nhất (20–30%). Tiêu hoá chậm → cảm giác no kéo dài.' },
                { emoji: '🏋️', title: 'Xây và giữ cơ', desc: 'Axit amin kích hoạt mTOR — con đường tổng hợp protein cơ bắp. Đặc biệt quan trọng khi giảm cân.' },
                { emoji: '⚡', title: 'Phục hồi nhanh hơn', desc: 'Sửa chữa sợi cơ vi tổn thương sau tập. Giảm đau nhức cơ DOMS.' },
                { emoji: '🔥', title: 'Đốt calo nhiều hơn', desc: 'TEF protein 25–30% so với carb 5–10%. Ăn đủ đạm → trao đổi chất cao hơn.' },
                { emoji: '🩸', title: 'Ổn định đường huyết', desc: 'Làm chậm hấp thu đường từ carb. Giảm đỉnh insulin và cơn đói đột ngột.' },
                { emoji: '😴', title: 'Hỗ trợ giấc ngủ', desc: 'Tryptophan → serotonin → melatonin. Protein buổi tối hỗ trợ giấc ngủ sâu hơn.' },
              ].map((it, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface/20 border border-border/10">
                  <span className="text-2xl shrink-0">{it.emoji}</span>
                  <div>
                    <p className="text-[11px] font-bold text-text mb-0.5">{it.title}</p>
                    <p className="text-[9px] text-muted leading-relaxed">{it.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* ── Tab navigation ── */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-bold transition-all duration-200 border ${activeTab === t.id ? 'border-green-500/40 bg-green-500/10 text-green-400' : 'border-border/20 text-muted hover:text-text hover:border-border/40'}`}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* ════════════ TAB: CALCULATOR ════════════ */}
      {activeTab === 'calculator' && (
        <div className="space-y-8">
          {/* inputs */}
          <RevealBlock>
            <div className="rounded-3xl border border-green-500/20 bg-surface/10 p-6 md:p-8">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-400 mb-4">📋 Thông số của bạn</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[
                  { key: 'weight', label: 'Cân nặng (kg)', type: 'number', min: 40, max: 200 },
                  { key: 'height', label: 'Chiều cao (cm)', type: 'number', min: 140, max: 220 },
                  { key: 'age',    label: 'Tuổi', type: 'number', min: 15, max: 100 },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[9px] text-muted mb-1.5 uppercase tracking-wider">{f.label}</label>
                    <input type={f.type} min={f.min} max={f.max}
                      value={inputs[f.key]}
                      onChange={e => setInputs(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full bg-surface/30 border border-border/30 rounded-xl px-3 py-2 text-text text-lg font-bold focus:outline-none focus:border-green-500/50 focus:bg-surface/50 transition-colors"
                    />
                  </div>
                ))}
              </div>
              {/* sex */}
              <div className="mb-5">
                <label className="block text-[9px] text-muted mb-2 uppercase tracking-wider">Giới tính</label>
                <div className="flex gap-2">
                  {[{ key: 'male', label: '♂ Nam' }, { key: 'female', label: '♀ Nữ' }].map(s => (
                    <button key={s.key} onClick={() => setInputs(p => ({ ...p, sex: s.key }))}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${inputs.sex === s.key ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-border/20 text-muted hover:border-border/40'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* goal */}
              <div>
                <label className="block text-[9px] text-muted mb-2 uppercase tracking-wider">Mục tiêu</label>
                <div className="grid grid-cols-3 gap-2">
                  {PROTEIN_GOALS.map(g => (
                    <button key={g.key} onClick={() => { setGoalKey(g.key); setCustomFactor(null); }}
                      className={`p-2.5 rounded-xl border text-center transition-all ${goalKey === g.key ? 'border-opacity-50 bg-opacity-10' : 'border-border/20 text-muted hover:border-border/40'}`}
                      style={goalKey === g.key ? { borderColor: g.color + '80', background: g.color + '10', color: g.color } : {}}>
                      <div className="text-lg">{g.emoji}</div>
                      <div className="text-[9px] font-bold mt-0.5">{g.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </RevealBlock>

          {/* formula breakdown */}
          <RevealBlock delay={80}>
            <div className="rounded-3xl border border-green-500/20 bg-surface/10 p-6 md:p-8">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-400 mb-2">📐 Công Thức Tính</p>
              <h3 className="text-xl font-black text-text mb-4">Protein = Thể trọng × Hệ số mục tiêu</h3>
              <div className="rounded-2xl bg-black/30 border border-green-500/20 p-4 font-mono text-lg mb-5 space-y-1">
                <div className="text-muted text-[10px] mb-2">{/* formula */}</div>
                <div><span className="text-green-400">Protein (g)</span> <span className="text-muted">= Thể trọng ×</span> <span className="text-lime-400">Hệ số mục tiêu</span></div>
                <div className="text-border/50 text-[10px] mt-1">---</div>
                <div className="text-text"><span className="text-green-400">{proteinG}g</span> = {w}kg × <span className="text-lime-400">{factor}g/kg</span></div>
                <div className="text-[10px] text-muted mt-1">Khoảng {proteinG * 4} kcal · {proteinPct}% tổng macro</div>
              </div>
              {/* factor slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[9px] text-muted uppercase tracking-wider">Điều chỉnh hệ số ({(customFactor||factor).toFixed(1)} g/kg)</label>
                  <span className="text-[10px] font-bold" style={{ color: gm.color }}>Khuyến nghị: {gm.min}–{gm.max}</span>
                </div>
                <input type="range" min="0.8" max="2.8" step="0.1"
                  value={customFactor !== null ? customFactor : factor}
                  onChange={e => setCustomFactor(parseFloat(e.target.value))}
                  className="w-full accent-green-500"
                />
                <div className="flex justify-between text-[8px] text-muted mt-1">
                  <span>0.8 (WHO min)</span><span>1.2 (sức khoẻ)</span><span>1.8 (gym)</span><span>2.4 (elite)</span>
                </div>
              </div>
              {/* goal description */}
              <div className="rounded-xl p-3 border" style={{ borderColor: gm.color + '30', background: gm.color + '08' }}>
                <p className="text-[10px] font-bold mb-1" style={{ color: gm.color }}>{gm.emoji} {gm.label}</p>
                <p className="text-[9px] text-muted leading-relaxed">{gm.desc}</p>
                <p className="text-[9px] text-muted mt-1">Hệ số đề xuất: <span className="font-bold" style={{ color: gm.color }}>{gm.min}–{gm.max}g/kg</span></p>
              </div>
            </div>
          </RevealBlock>

          {/* donut + breakdown */}
          <RevealBlock delay={120}>
            <div className="rounded-3xl border border-green-500/20 bg-surface/10 p-6 md:p-8">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-400 mb-4">📊 Phân Bổ Macro Toàn Ngày</p>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0">
                  <ProteinDonut proteinPct={proteinPct} fatPct={fatPct} carbPct={carbPct} proteinG={proteinG} />
                  <div className="flex gap-3 justify-center mt-3">
                    {[
                      { label: 'Protein', pct: proteinPct, g: proteinG, color: GREEN },
                      { label: 'Fat', pct: fatPct, g: fatG, color: '#f97316' },
                      { label: 'Carb', pct: carbPct, g: carbG, color: CYAN },
                    ].map((m, i) => (
                      <div key={i} className="text-center">
                        <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: m.color }} />
                        <p className="text-[8px] text-muted">{m.label}</p>
                        <p className="text-[10px] font-bold" style={{ color: m.color }}>{m.g}g</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <p className="text-[9px] text-muted uppercase tracking-wider mb-3">Phân Bổ Theo Bữa</p>
                  <MealBars proteinG={proteinG} />
                </div>
              </div>
            </div>
          </RevealBlock>

          {/* daily tracker */}
          <RevealBlock delay={160}>
            <div className="rounded-3xl border border-lime-500/20 bg-surface/10 p-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-lime-400 mb-4">🎯 Theo Dõi Hôm Nay</p>
              <div className="flex items-center gap-6 mb-4">
                <ProteinGauge current={currentG} target={proteinG} />
                <div className="flex-1">
                  <p className="text-base text-muted mb-2">Đã nạp: <span className="font-black text-text">{currentG}g</span> / {proteinG}g mục tiêu</p>
                  <input type="range" min={0} max={Math.max(proteinG * 1.3, 200)} step={5}
                    value={currentG}
                    onChange={e => setCurrentG(Number(e.target.value))}
                    className="w-full accent-green-500 mb-2" />
                  <div className="flex gap-2 flex-wrap">
                    {[0, Math.round(proteinG*0.3), Math.round(proteinG*0.6), Math.round(proteinG*0.9), proteinG].map(v => (
                      <button key={v} onClick={() => setCurrentG(v)}
                        className="px-2.5 py-1 rounded-lg border border-border/20 text-[9px] text-muted hover:text-text hover:border-border/40 transition-colors">
                        {v}g
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-xl p-3 border border-border/20 bg-surface/20">
                {progressPct >= 90
                  ? <p className="text-[10px] font-bold text-green-400">✅ Xuất sắc! Bạn đã đạt {progressPct}% mục tiêu protein hôm nay.</p>
                  : progressPct >= 60
                  ? <p className="text-[10px] text-lime-400">🏃 Đang trên đà tốt ({progressPct}%). Cần thêm <span className="font-bold">{proteinG - currentG}g</span> nữa.</p>
                  : <p className="text-[10px] text-amber-400">⚠️ Mới đạt {progressPct}%. Cần bổ sung <span className="font-bold">{proteinG - currentG}g</span> trong các bữa còn lại.</p>
                }
              </div>
            </div>
          </RevealBlock>

          {/* case study */}
          <RevealBlock delay={200}>
            <div className="rounded-3xl border border-cyan-500/20 bg-surface/10 p-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-4">📋 Ví Dụ Thực Tế — Từ Tài Liệu Dự Án</p>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xl shrink-0">🧑</div>
                <div>
                  <p className="text-lg font-bold text-text">Nam 48 tuổi · 77kg · 1m75</p>
                  <p className="text-[9px] text-muted">Tập nhiều: đạp xe + gym + bơi · Mục tiêu sức bền</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Hệ số', value: '2.0g/kg', color: GREEN },
                  { label: 'Protein/ngày', value: '154g', color: LIME },
                  { label: 'Kcal từ P', value: '616 kcal', color: CYAN },
                  { label: 'Mỗi bữa', value: '~38g', color: '#f59e0b' },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl border border-border/20 p-3 text-center">
                    <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[8px] text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-border/20 bg-surface/20 p-4">
                <p className="text-[9px] font-bold text-text mb-2">Kế hoạch protein trong ngày:</p>
                <div className="space-y-1.5">
                  {[
                    { time: '7:00', meal: 'Sáng', food: '2 trứng + 150g ức gà + sữa chua', g: 45 },
                    { time: '12:00', meal: 'Trưa', food: '200g cá hồi / thịt bò + rau', g: 52 },
                    { time: '15:30', meal: 'Snack', food: 'Whey 1 scoop + 1 trái chuối', g: 25 },
                    { time: '19:00', meal: 'Tối', food: '150g cá + 100g đậu hũ + canh', g: 32 },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-3 text-[9px]">
                      <span className="text-muted w-10 shrink-0">{r.time}</span>
                      <span className="font-bold text-text w-12 shrink-0">{r.meal}</span>
                      <span className="text-muted flex-1">{r.food}</span>
                      <span className="font-bold shrink-0" style={{ color: GREEN }}>{r.g}g</span>
                    </div>
                  ))}
                  <div className="border-t border-border/20 pt-1 mt-1 flex justify-between text-[9px]">
                    <span className="text-muted font-bold">Tổng cộng</span>
                    <span className="font-black" style={{ color: GREEN }}>154g ✅</span>
                  </div>
                </div>
              </div>
            </div>
          </RevealBlock>
        </div>
      )}

      {/* ════════════ TAB: SOURCES ════════════ */}
      {activeTab === 'sources' && (
        <div className="space-y-6">
          <RevealBlock>
            <div className="rounded-3xl border border-green-500/20 bg-surface/10 p-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-400 mb-4">🍗 Nguồn Protein Tốt Nhất — Thực Phẩm Việt Nam</p>

              {/* portion slider */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[9px] text-muted uppercase tracking-wider">Khẩu phần: {portion}g</label>
                  <span className="text-[9px] text-muted">Điều chỉnh để xem protein thay đổi</span>
                </div>
                <input type="range" min={50} max={300} step={25}
                  value={portion} onChange={e => setPortion(Number(e.target.value))}
                  className="w-full accent-green-500" />
                <div className="flex justify-between text-[8px] text-muted mt-1">
                  <span>50g (snack)</span><span>100g (nhỏ)</span><span>150g (TB)</span><span>200g (lớn)</span><span>300g (đặc biệt)</span>
                </div>
              </div>

              {/* category filter */}
              <div className="flex gap-2 flex-wrap mb-5">
                {cats.map(c => (
                  <button key={c} onClick={() => setFilterCat(c)}
                    className={`px-3 py-1.5 rounded-full text-[9px] font-bold border transition-all ${filterCat === c ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-border/20 text-muted hover:border-border/40'}`}
                    style={filterCat === c && c !== 'All' ? { borderColor: (CAT_COLORS[c] || '#22c55e') + '50', background: (CAT_COLORS[c] || '#22c55e') + '10', color: CAT_COLORS[c] || '#22c55e' } : {}}>
                    {c}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredSources.map((item, i) => (
                  <SourceBar key={i} item={item} portion={portion}
                    active={selectedSource === item.name}
                    onClick={() => setSelectedSource(selectedSource === item.name ? null : item.name)} />
                ))}
              </div>

              {/* selected detail */}
              {selectedSource && (() => {
                const item = PROTEIN_SOURCES.find(s => s.name === selectedSource);
                if (!item) return null;
                const pG = (item.p100 * portion / 100).toFixed(1);
                const fG = (item.fat100 * portion / 100).toFixed(1);
                const kc = (item.kcal100 * portion / 100).toFixed(0);
                return (
                  <div className="mt-4 p-4 rounded-2xl border" style={{ borderColor: item.color + '40', background: item.color + '06' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{item.emoji}</span>
                      <div>
                        <p className="font-black text-text">{item.name}</p>
                        <p className="text-[9px] text-muted">{item.cat} · {portion}g khẩu phần</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Protein', val: `${pG}g`, color: GREEN },
                        { label: 'Fat', val: `${fG}g`, color: '#f97316' },
                        { label: 'Calories', val: `${kc} kcal`, color: '#f59e0b' },
                      ].map((v, i) => (
                        <div key={i} className="text-center rounded-xl bg-surface/20 p-2">
                          <p className="text-lg font-black" style={{ color: v.color }}>{v.val}</p>
                          <p className="text-[8px] text-muted">{v.label}</p>
                        </div>
                      ))}
                    </div>
                    {item.tags && (
                      <div className="flex gap-1.5 mt-3 flex-wrap">
                        {item.tags.map(t => <span key={t} className="px-2 py-0.5 rounded-full text-[8px] border border-border/20 text-muted">{t}</span>)}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </RevealBlock>

          {/* ranking by protein density */}
          <RevealBlock delay={80}>
            <div className="rounded-3xl border border-lime-500/20 bg-surface/10 p-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-lime-400 mb-4">🏆 Xếp Hạng — Mật Độ Protein (g/100g)</p>
              <div className="space-y-2">
                {[...PROTEIN_SOURCES].sort((a,b) => b.p100 - a.p100).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[9px] text-muted w-4 shrink-0 text-right">{i+1}</span>
                    <span className="text-lg shrink-0">{item.emoji}</span>
                    <span className="text-[10px] font-bold text-text flex-1 truncate">{item.name}</span>
                    <div className="relative h-2 w-32 rounded-full bg-surface/40 overflow-hidden shrink-0">
                      <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(item.p100/80)*100}%`, background: item.color }} />
                    </div>
                    <span className="text-[10px] font-black w-8 text-right shrink-0" style={{ color: item.color }}>{item.p100}g</span>
                  </div>
                ))}
              </div>
            </div>
          </RevealBlock>
        </div>
      )}

      {/* ════════════ TAB: TIMING ════════════ */}
      {activeTab === 'timing' && (
        <div className="space-y-6">
          <RevealBlock>
            <div className="rounded-3xl border border-green-500/20 bg-surface/10 p-6 md:p-8">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-400 mb-2">⏰ Protein Timing — Ăn Đúng Lúc</p>
              <p className="text-[10px] text-muted mb-6 leading-relaxed">Thời điểm ăn protein ảnh hưởng đến tổng hợp cơ bắp. Spread protein đều trong ngày tối ưu hơn ăn dồn một bữa.</p>
              <div className="space-y-4">
                {TIMING_WINDOWS.map((t, i) => {
                  const g = Math.round(proteinG * t.pct / 100);
                  return (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-border/20 bg-surface/20">
                      <div className="text-3xl shrink-0">{t.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-lg font-bold text-text">{t.label}</p>
                          <span className="text-lg font-black shrink-0" style={{ color: GREEN }}>~{g}g</span>
                        </div>
                        <p className="text-[9px] text-muted leading-relaxed mb-1.5">{t.note}</p>
                        <p className="text-[9px] font-bold" style={{ color: LIME }}>Ví dụ: {t.example}</p>
                        <div className="relative h-1.5 rounded-full bg-surface/40 overflow-hidden mt-2">
                          <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${t.pct * 4}%`, background: `linear-gradient(90deg, ${GREEN}, ${LIME})` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </RevealBlock>

          {/* Pre/Post workout detail */}
          <RevealBlock delay={80}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-3xl border border-lime-500/20 bg-surface/10 p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-lime-400 mb-3">⚡ Trước Tập (Pre-Workout)</p>
                <div className="space-y-2">
                  {[
                    { icon: '⏱️', text: '1–2 giờ trước buổi tập' },
                    { icon: '💊', text: `Protein: ${Math.round(w * 0.25)}g (0.25g/kg)` },
                    { icon: '🌾', text: `Carb: ${Math.round(w * 0.75)}g (0.75g/kg)` },
                    { icon: '🫒', text: 'Fat: Giữ thấp — làm chậm tiêu hoá' },
                    { icon: '🍗', text: '100g ức gà + 1 chén cơm hoặc khoai lang' },
                  ].map((it, i) => (
                    <div key={i} className="flex items-start gap-2 text-[9px]">
                      <span className="shrink-0">{it.icon}</span>
                      <span className="text-muted">{it.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-cyan-500/20 bg-surface/10 p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-3">💥 Sau Tập (Post-Workout)</p>
                <div className="space-y-2">
                  {[
                    { icon: '⏱️', text: '30–60 phút sau tập (anabolic window)' },
                    { icon: '💊', text: `Protein: ${Math.round(w * 0.3)}g (0.3g/kg)` },
                    { icon: '🌾', text: `Carb: ${Math.round(w * 0.5)}g (0.5g/kg)` },
                    { icon: '🚫', text: 'Fat: Tối thiểu — không trì hoãn hấp thu' },
                    { icon: '🥤', text: `Whey ${Math.round(w * 0.3)}g hoặc ${Math.round(w*0.3/25*100)}g ức gà` },
                  ].map((it, i) => (
                    <div key={i} className="flex items-start gap-2 text-[9px]">
                      <span className="shrink-0">{it.icon}</span>
                      <span className="text-muted">{it.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealBlock>

          {/* protein spread timeline */}
          <RevealBlock delay={120}>
            <div className="rounded-3xl border border-green-500/20 bg-surface/10 p-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-400 mb-4">📈 Timeline Protein Trong Ngày</p>
              <div className="relative">
                {/* timeline line */}
                <div className="absolute left-12 top-0 bottom-0 w-px bg-border/20" />
                <div className="space-y-4">
                  {[
                    { time: '7:00',  label: 'Sáng', g: Math.round(proteinG*0.25), color: '#f59e0b',  tip: 'Sáng sớm kích hoạt MPS' },
                    { time: '10:30', label: 'Snack', g: Math.round(proteinG*0.1),  color: LIME,       tip: 'Tuỳ chọn nếu đói' },
                    { time: '12:30', label: 'Trưa',  g: Math.round(proteinG*0.30), color: GREEN,      tip: 'Bữa lớn nhất ngày' },
                    { time: '16:00', label: 'Pre-W', g: Math.round(proteinG*0.15), color: CYAN,       tip: '1-2h trước tập' },
                    { time: '19:30', label: 'Tối',   g: Math.round(proteinG*0.20), color: '#a855f7',  tip: 'Casein chậm tiêu ban đêm' },
                  ].map((ev, i) => (
                    <div key={i} className="flex items-center gap-4 pl-16 relative">
                      <div className="absolute left-10 w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: ev.color, background: ev.color + '20' }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: ev.color }} />
                      </div>
                      <div className="absolute left-0 w-9 text-right">
                        <span className="text-[8px] text-muted font-mono">{ev.time}</span>
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-text">{ev.label}</span>
                          <span className="text-[8px] text-muted ml-2">{ev.tip}</span>
                        </div>
                        <span className="text-base font-black" style={{ color: ev.color }}>{ev.g}g</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealBlock>
        </div>
      )}

      {/* ════════════ TAB: LEVELS ════════════ */}
      {activeTab === 'levels' && (
        <div className="space-y-6">
          {LEVEL_RECS.map((lv, i) => (
            <RevealBlock key={i} delay={i * 80}>
              <div className="rounded-3xl border p-6" style={{ borderColor: lv.color + '30', background: lv.color + '06' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{lv.emoji}</div>
                  <div>
                    <p className="text-xl font-black text-text">{lv.level}</p>
                    <p className="text-[9px]" style={{ color: lv.color }}>{lv.sub}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xl font-black" style={{ color: lv.color }}>{lv.pct}</p>
                    <p className="text-[8px] text-muted">g/kg/ngày</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="relative h-3 rounded-full bg-surface/40 overflow-hidden">
                    <div className="absolute inset-y-0 left-0 rounded-full" style={{
                      width: `${(parseFloat(lv.pct.split('–')[1]) / 2.8) * 100}%`,
                      background: `linear-gradient(90deg, ${lv.color}60, ${lv.color})`,
                    }} />
                  </div>
                  <div className="flex justify-between text-[8px] text-muted mt-1">
                    <span>0.8 (WHO min)</span><span>1.6</span><span>2.0</span><span>2.4</span><span>2.8</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {lv.tips.map((tip, j) => (
                    <div key={j} className="flex items-start gap-2 text-[9px]">
                      <span className="shrink-0 mt-0.5" style={{ color: lv.color }}>✓</span>
                      <span className="text-muted">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealBlock>
          ))}

          {/* comparison table */}
          <RevealBlock delay={240}>
            <div className="rounded-3xl border border-border/20 bg-surface/10 p-6 overflow-x-auto">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted mb-4">📊 So Sánh Theo Mục Tiêu</p>
              <table className="w-full text-[9px] min-w-[420px]">
                <thead>
                  <tr className="border-b border-border/20">
                    <th className="text-left text-muted pb-2 font-medium pr-4">Mục tiêu</th>
                    <th className="text-center text-muted pb-2 font-medium">Hệ số</th>
                    <th className="text-center text-muted pb-2 font-medium">70kg → ?g</th>
                    <th className="text-center text-muted pb-2 font-medium">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {PROTEIN_GOALS.map((g, i) => (
                    <tr key={i} className="hover:bg-surface/20 transition-colors">
                      <td className="py-2 pr-4">
                        <span className="font-bold" style={{ color: g.color }}>{g.emoji} {g.label}</span>
                      </td>
                      <td className="py-2 text-center font-mono font-bold text-text">{g.min}–{g.max}</td>
                      <td className="py-2 text-center font-black" style={{ color: g.color }}>{Math.round(70*g.min)}–{Math.round(70*g.max)}g</td>
                      <td className="py-2 text-muted leading-relaxed max-w-[160px]">{g.desc.substring(0, 55)}…</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </RevealBlock>

          {/* 80/20 rule */}
          <RevealBlock delay={280}>
            <div className="rounded-3xl border border-lime-500/20 bg-lime-500/4 p-6">
              <div className="flex items-start gap-3">
                <span className="text-3xl shrink-0">⚖️</span>
                <div>
                  <p className="text-lg font-black text-lime-400 mb-2">Nguyên Tắc 80/20 — Đừng Ám Ảnh</p>
                  <p className="text-[10px] text-muted leading-relaxed">
                    80% thời gian đạt mục tiêu protein là đủ tốt. 20% còn lại cho phép linh hoạt — tiệc, đi ăn ngoài, ngày bận, ngày không muốn nấu.
                    <br /><br />
                    <span className="text-lime-300 font-semibold">Protein tốt nhất là protein bạn ăn được đều đặn, không phải protein hoàn hảo trên lý thuyết.</span>
                  </p>
                </div>
              </div>
            </div>
          </RevealBlock>
        </div>
      )}

      {/* ════════════ TAB: MYTHS ════════════ */}
      {activeTab === 'myths' && (
        <div className="space-y-5">
          <RevealBlock>
            <p className="text-[10px] text-muted leading-relaxed mb-6">5 hiểu lầm phổ biến nhất về protein — được làm rõ bằng bằng chứng khoa học.</p>
          </RevealBlock>
          {MYTHS.map((m, i) => (
            <RevealBlock key={i} delay={i * 70}>
              <div className="rounded-3xl border border-border/20 bg-surface/10 p-5 md:p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] pointer-events-none" style={{ background: `${GREEN}06` }} />
                <div className="relative">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-lg shrink-0">❌</div>
                    <div>
                      <p className="text-[9px] text-red-400 font-bold uppercase tracking-wider mb-1">Hiểu lầm #{i + 1}</p>
                      <p className="text-lg font-bold text-text">"{m.myth}"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pl-11">
                    <div className="rounded-xl bg-green-500/8 border border-green-500/20 p-3 flex-1">
                      <p className="text-[9px] text-green-400 font-bold uppercase tracking-wider mb-1">✅ Sự thật</p>
                      <p className="text-[10px] text-muted leading-relaxed">{m.fact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealBlock>
          ))}

          {/* Key takeaways */}
          <RevealBlock delay={350}>
            <div className="rounded-3xl border border-green-500/20 bg-surface/10 p-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-400 mb-4">💡 7 Nguyên Tắc Cốt Lõi</p>
              <div className="space-y-2">
                {[
                  'Đặt protein trước tiên trong mỗi bữa — chọn thực phẩm giàu đạm trước khi chọn tinh bột.',
                  'Spread đều trong ngày — 4×30–40g tốt hơn 1×120g.',
                  'Ưu tiên thực phẩm tự nhiên — whey chỉ là tiện lợi, không bắt buộc.',
                  'Đa dạng nguồn đạm — kết hợp động vật + thực vật để đủ axit amin thiết yếu.',
                  'Đảm bảo leucine/bữa ≥ 2.5g — kích hoạt mTOR hiệu quả nhất.',
                  'Protein sau tập trong 60 phút — tận dụng cửa sổ phục hồi.',
                  'Nhất quán > hoàn hảo — đạt 85–90% mục tiêu đều đặn tốt hơn 100% được vài ngày.',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-[10px]">
                    <span className="shrink-0 font-bold" style={{ color: GREEN }}>{i+1}.</span>
                    <span className="text-muted leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </RevealBlock>
        </div>
      )}

      {/* ── Divider ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-12" />

      {/* ── Back navigation ── */}
      <RevealBlock className="mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/pillar/b/formula" className="group rounded-2xl border border-green-500/20 bg-green-500/4 p-4 hover:border-green-500/40 transition-all">
            <p className="text-[9px] text-muted mb-1">← Xem trước</p>
            <p className="text-base font-bold text-green-400">Công Thức Meal Plan</p>
          </Link>
          <Link to="/pillar/b" className="group rounded-2xl border border-lime-500/20 bg-lime-500/4 p-4 hover:border-lime-500/40 transition-all text-center">
            <p className="text-[9px] text-muted mb-1">Về trang chính</p>
            <p className="text-base font-bold text-lime-400">Dinh Dưỡng & Thực Đơn</p>
          </Link>
          <Link to="/pillar/b/data" className="group rounded-2xl border border-purple-500/20 bg-purple-500/4 p-4 hover:border-purple-500/40 transition-all text-right">
            <p className="text-[9px] text-muted mb-1">Xem tiếp →</p>
            <p className="text-base font-bold text-purple-400">Cấu Trúc Dữ Liệu</p>
          </Link>
        </div>
      </RevealBlock>

      {/* ── Safety note ── */}
      <RevealBlock>
        <div className="rounded-2xl border border-lime-500/20 bg-lime-500/4 p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <p className="text-[9px] text-muted leading-relaxed">
              <span className="text-lime-300 font-semibold">An toàn trước, hiệu quả sau.</span>{' '}
              Nội dung mang tính giáo dục chung. Người có bệnh thận mạn, tiểu đường, gout hoặc đang điều trị bệnh lý cần tham vấn bác sĩ/chuyên gia dinh dưỡng trước khi điều chỉnh protein.
            </p>
          </div>
        </div>
      </RevealBlock>

    </div>
  );
}
