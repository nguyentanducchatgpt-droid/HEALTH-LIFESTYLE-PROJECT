import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const COLOR = '#14b8a6';
const RGB = '20,184,166';
const ORBIT_ID = 'c-roadmap-orbit-kf';
const ORBIT_PROP = '--c-rm-angle';
const ORBIT_CLASS = 'c-rm-orbit-ring';

function RevealBlock({ children, delay = 0, className = '' }) {
  const [vis, setVis] = useState(false);
  const [ref, setRef] = useState(null);
  useEffect(() => {
    if (!ref) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.07 });
    ob.observe(ref);
    return () => ob.disconnect();
  }, [ref]);
  return (
    <div ref={setRef} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(26px)', transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

const PHIL = [
  { icon: '🐢', title: 'Chậm mà chắc', desc: '1% cải thiện mỗi ngày. Sau 12 tuần = 37% tốt hơn tổng cộng.' },
  { icon: '🔄', title: 'Hệ thống, không mục tiêu', desc: 'Đừng "cố gắng" từng ngày. Thiết kế để không cần cố gắng.' },
  { icon: '🌊', title: 'Với nhịp, không chống lại', desc: 'Sống theo nhịp sinh học tự nhiên, không cưỡng ép cơ thể.' },
];

const PHASES = [
  {
    id: 'phase1',
    weeks: '1–2',
    title: 'Khởi Động & Đánh Giá',
    subtitle: 'Foundation Reset',
    color: '#f97316',
    rgb: '249,115,22',
    icon: '🌱',
    focus: 'Xây dựng nhận thức, thiết lập baseline',
    goals: ['Làm Lifestyle Assessment (điểm ban đầu)', 'Đo 7 ngày: bước chân, giờ ngủ, năng lượng', 'Chọn 1 thói quen ưu tiên (thường là giấc ngủ)', 'Thiết kế môi trường phòng ngủ cơ bản'],
    metrics: ['Điểm Lifestyle Score', 'Trung bình bước chân/ngày', 'Giờ ngủ trung bình'],
    modules: ['C0 Đánh Giá', 'C7 Môi Trường'],
    daily: '15 phút/ngày',
  },
  {
    id: 'phase2',
    weeks: '3–6',
    title: 'Xây Nền Tảng',
    subtitle: 'Core Habit Building',
    color: '#f59e0b',
    rgb: '245,158,11',
    icon: '🏗️',
    focus: 'Giấc ngủ ổn định + NEAT tăng dần',
    goals: ['Giấc ngủ: đều đặn ±30 phút mỗi ngày', 'Đạt 8.000 bước/ngày liên tục 2 tuần', 'Bắt đầu routine sáng 5–10 phút', 'Thực hành thở 5 phút mỗi ngày', 'Streak checklist 14 ngày liên tiếp'],
    metrics: ['Streak ngủ đúng giờ', 'Bước chân tuần', 'Checklist completion rate'],
    modules: ['C1 Giấc Ngủ', 'C3 NEAT', 'C2 Nhịp Sinh Học', 'C6 Thở'],
    daily: '25–35 phút/ngày',
  },
  {
    id: 'phase3',
    weeks: '7–10',
    title: 'Củng Cố & Tối Ưu',
    subtitle: 'Lifestyle Integration',
    color: '#10b981',
    rgb: '16,185,129',
    icon: '⚡',
    focus: 'Phục hồi chủ động + nhịp sinh học hoàn thiện',
    goals: ['Phục hồi chủ động: 10 phút routine mỗi ngày', 'Lịch ngủ cố định ±15 phút', 'Phục hồi 3 vùng đau (nếu có)', 'Thiết kế môi trường làm việc tối ưu', 'Tái đánh giá Lifestyle Score (tuần 8)'],
    metrics: ['HRV / Cảm nhận phục hồi', 'Điểm Assessment lần 2', 'Nhịp sinh học ổn định'],
    modules: ['C4 Phục Hồi', 'C2 Nhịp Sinh Học', 'C7 Môi Trường'],
    daily: '30–40 phút/ngày',
  },
  {
    id: 'phase4',
    weeks: '11–12',
    title: 'Cá Nhân Hóa & Duy Trì',
    subtitle: 'Personalization & Maintenance',
    color: COLOR,
    rgb: RGB,
    icon: '🏆',
    focus: 'Deload lần đầu + kế hoạch dài hạn',
    goals: ['Hoàn thành tuần deload đầu tiên', 'Tạo "Lifestyle Blueprint" cá nhân', 'Đánh giá tất cả 8 module', 'Lập kế hoạch giai đoạn tiếp theo', 'Điểm Assessment cuối: so sánh với đầu'],
    metrics: ['Điểm cuối vs đầu', 'Số thói quen duy trì', 'Lifestyle Blueprint hoàn thành'],
    modules: ['C5 Deload', 'C0 Đánh Giá', 'C8 Checklist'],
    daily: '20–30 phút/ngày (deload)',
  },
];

const DAILY_RHYTHM = [
  { time: '06:00–06:30', label: 'Thức dậy & ánh sáng', icon: '🌅', color: '#f59e0b', desc: 'Ra ngoài hoặc mở rèm, uống nước, không phone' },
  { time: '06:30–06:50', label: 'Morning routine', icon: '🧘', color: '#10b981', desc: '5–10 phút: thở + mobility nhẹ' },
  { time: '07:00–12:00', label: 'Peak work window', icon: '💼', color: '#0ea5e9', desc: 'Khung thời gian tư duy tốt nhất' },
  { time: '12:30–13:00', label: 'Đi bộ sau ăn', icon: '🚶', color: '#14b8a6', desc: '10–15 phút = NEAT + ổn định đường huyết' },
  { time: '20:00', label: 'Dim light & wind down', icon: '🌙', color: '#6366f1', desc: 'Giảm ánh sáng, không màn hình sau 21:30' },
  { time: '21:30–22:00', label: 'Sleep routine', icon: '😴', color: '#a855f7', desc: 'Thở 4-8, đọc sách, nhiệt độ phòng 18°C' },
  { time: '22:00–22:30', label: 'Ngủ', icon: '🛌', color: '#6366f1', desc: 'Target 7–9h, không alarm cuối tuần nếu có thể' },
];

const SUB_PAGES = [
  { to: '/pillar/c/assessment', icon: '📋', title: 'Đánh Giá', color: '#14b8a6', week: 'Tuần 1' },
  { to: '/pillar/c/sleep', icon: '😴', title: 'Giấc Ngủ', color: '#6366f1', week: 'Tuần 2' },
  { to: '/pillar/c/sleep-routine', icon: '🌙', title: 'Sleep Routine', color: '#6366f1', week: 'Tuần 2' },
  { to: '/pillar/c/circadian', icon: '☀️', title: 'Nhịp Sinh Học', color: '#f59e0b', week: 'Tuần 3' },
  { to: '/pillar/c/morning', icon: '🌅', title: 'Morning Routine', color: '#f59e0b', week: 'Tuần 3' },
  { to: '/pillar/c/neat', icon: '🚶', title: 'NEAT', color: '#10b981', week: 'Tuần 4' },
  { to: '/pillar/c/recovery', icon: '🔄', title: 'Phục Hồi', color: '#a78bfa', week: 'Tuần 7' },
  { to: '/pillar/c/deload', icon: '⚡', title: 'Deload', color: '#f97316', week: 'Tuần 11' },
  { to: '/pillar/c/breathing', icon: '🌬️', title: 'Thở', color: '#0ea5e9', week: 'Tuần 4' },
  { to: '/pillar/c/environment', icon: '🏠', title: 'Môi Trường', color: '#f43f5e', week: 'Tuần 1' },
  { to: '/pillar/c/checklist', icon: '✅', title: 'Checklist', color: '#14b8a6', week: 'Liên tục' },
];

export default function LifestyleRoadmapPage() {
  const { t: tPillars } = useTranslation('pillars');
  const hero = tPillars('pillarC.c_roadmap_hero', { returnObjects: true }) || {};
  const [openPhase, setOpenPhase] = useState('phase1');

  const philTitle = tPillars('pillarC.c_roadmap_phil_title') || 'Triết Lý Của Lộ Trình Này';
  const s2Title = tPillars('pillarC.c_roadmap_s2_title') || '4 Giai Đoạn 12 Tuần';
  const s2Sub = tPillars('pillarC.c_roadmap_s2_sub') || 'Mỗi giai đoạn xây trên nền của giai đoạn trước — đừng bỏ qua bước nào.';
  const weekLabel = tPillars('pillarC.c_roadmap_week_label') || 'Tuần';
  const goalsLabel = tPillars('pillarC.c_roadmap_goals_label') || 'Mục Tiêu Giai Đoạn';
  const modulesLabel = tPillars('pillarC.c_roadmap_modules_label') || 'Module Cần Học';
  const metricsLabel = tPillars('pillarC.c_roadmap_metrics_label') || 'Đo Lường';
  const dailyLabel = tPillars('pillarC.c_roadmap_daily_label') || 'Thời gian';
  const s3Title = tPillars('pillarC.c_roadmap_s3_title') || 'Nhịp Ngày Lý Tưởng';
  const s3Sub = tPillars('pillarC.c_roadmap_s3_sub') || 'Khung thời gian gợi ý — điều chỉnh theo lịch làm việc của bạn.';
  const s4Title = tPillars('pillarC.c_roadmap_s4_title') || 'Tất Cả Module Lối Sống';
  const s4Sub = tPillars('pillarC.c_roadmap_s4_sub') || 'Khám phá theo trình tự lộ trình hoặc bắt đầu từ chủ đề bạn cần nhất.';
  const quoteText = tPillars('pillarC.c_roadmap_quote') || 'Không cần sống hoàn hảo. Chỉ cần sống có nhịp, có hồi phục, có quay lại.';
  const quoteCite = tPillars('pillarC.c_roadmap_quote_cite') || '— Triết lý Lối sống khỏe';

  const trPhil = tPillars('pillarC.c_roadmap_phil', { returnObjects: true });
  const PHIL_TR = Array.isArray(trPhil) ? PHIL.map((p, i) => ({ ...p, ...(trPhil[i] || {}) })) : PHIL;

  const trPhases = tPillars('pillarC.c_roadmap_phases', { returnObjects: true });
  const PHASES_TR = Array.isArray(trPhases) ? PHASES.map((p, i) => ({ ...p, ...(trPhases[i] || {}) })) : PHASES;

  const trRhythm = tPillars('pillarC.c_roadmap_daily_rhythm', { returnObjects: true });
  const RHYTHM_TR = Array.isArray(trRhythm) ? DAILY_RHYTHM.map((r, i) => ({ ...r, ...(trRhythm[i] || {}) })) : DAILY_RHYTHM;

  const trSubPages = tPillars('pillarC.c_roadmap_sub_pages', { returnObjects: true });
  const SUBPAGES_TR = Array.isArray(trSubPages) ? SUB_PAGES.map((p, i) => ({ ...p, ...(trSubPages[i] || {}) })) : SUB_PAGES;

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cRmOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: cRmOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const active = PHASES_TR.find(p => p.id === openPhase);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-base text-muted hover:text-teal-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        {hero.breadcrumb || 'Lối Sống Khỏe'}
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>🗺️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">{hero.title || 'Lộ Trình 12 Tuần'}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>{hero.badge || 'Lifestyle Roadmap'}</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">{hero.desc || 'Hành trình từ "biết mình đang ở đâu" đến "sống với nhịp điệu bền vững". 12 tuần, 4 giai đoạn, từng bước rõ ràng — không vội vã, không áp lực.'}</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800&q=80&auto=format&fit=crop" alt="Roadmap" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>{hero.img_caption || '12 tuần · 4 giai đoạn · 8 module'}</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Philosophy */}
      <RevealBlock className="mb-12">
        <div className="rounded-2xl p-5 border" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.06)` }}>
          <div className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>{philTitle}</div>
          <div className="grid md:grid-cols-3 gap-4 text-lg">
            {PHIL_TR.map(p => (
              <div key={p.title} className="rounded-xl p-3 bg-surface border border-border">
                <div className="text-2xl mb-2">{p.icon}</div>
                <div className="font-bold text-text mb-1">{p.title}</div>
                <div className="text-base text-muted leading-relaxed">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* 4 Phases */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>{s2Title}</h2>
        <p className="text-muted text-lg mb-6">{s2Sub}</p>

        {/* Timeline */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {PHASES_TR.map(p => (
            <button key={p.id} onClick={() => setOpenPhase(p.id)} className="flex-1 min-w-[100px] rounded-xl p-3 text-center transition-all border" style={{ background: openPhase === p.id ? `${p.color}15` : 'var(--color-surface)', borderColor: openPhase === p.id ? p.color : 'var(--color-border)' }}>
              <div className="text-2xl mb-1">{p.icon}</div>
              <div className="text-base font-bold" style={{ color: openPhase === p.id ? p.color : '#9ca3af' }}>{weekLabel} {p.weeks}</div>
              <div className="text-base text-muted mt-0.5 leading-tight">{p.subtitle}</div>
            </button>
          ))}
        </div>

        {active && (
          <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: `${active.color}30`, background: `${active.color}06` }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-4xl">{active.icon}</span>
              <div>
                <div className="text-base font-bold uppercase tracking-widest" style={{ color: active.color }}>{weekLabel} {active.weeks}</div>
                <div className="text-xl font-bold text-text">{active.title}</div>
                <div className="text-lg text-muted">{active.focus}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-base text-muted">{dailyLabel}</div>
                <div className="text-lg font-bold" style={{ color: active.color }}>{active.daily}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: active.color }}>{goalsLabel}</div>
                <ul className="space-y-2">
                  {active.goals.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-lg text-text">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-base font-bold shrink-0 mt-0.5" style={{ background: `${active.color}20`, color: active.color }}>{i + 1}</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: active.color }}>{modulesLabel}</div>
                  <div className="flex flex-wrap gap-1">
                    {active.modules.map(m => (
                      <span key={m} className="text-base px-2 py-0.5 rounded-full font-medium" style={{ background: `${active.color}15`, color: active.color }}>{m}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: active.color }}>{metricsLabel}</div>
                  <ul className="space-y-1">
                    {active.metrics.map((m, i) => (
                      <li key={i} className="text-base text-muted flex items-start gap-1"><span style={{ color: active.color }}>→</span>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </RevealBlock>

      {/* Daily rhythm */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>{s3Title}</h2>
        <p className="text-muted text-lg mb-6">{s3Sub}</p>
        <div className="relative">
          <div className="absolute left-[68px] top-4 bottom-4 w-px bg-border" />
          <div className="space-y-3">
            {RHYTHM_TR.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="text-base text-muted w-16 text-right shrink-0 pt-0.5 leading-tight">{item.time}</div>
                <div className="w-4 h-4 rounded-full shrink-0 mt-0.5 relative z-10 flex items-center justify-center" style={{ background: item.color }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-bg" />
                </div>
                <div className="flex-1 rounded-xl border border-border bg-surface p-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-lg font-medium text-text">{item.label}</span>
                  </div>
                  <div className="text-base text-muted">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* All sub-pages */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>{s4Title}</h2>
        <p className="text-muted text-lg mb-6">{s4Sub}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SUBPAGES_TR.map(p => (
            <Link key={p.to} to={p.to} className="rounded-xl border border-border bg-surface p-4 hover:border-teal-500/20 transition-all group">
              <div className="text-3xl mb-2">{p.icon}</div>
              <div className="text-lg font-bold text-text group-hover:text-white transition-colors">{p.title}</div>
              <div className="text-base mt-1 font-bold" style={{ color: p.color }}>{p.week}</div>
            </Link>
          ))}
        </div>
      </RevealBlock>

      {/* Quote */}
      <RevealBlock className="mb-12">
        <blockquote className="rounded-2xl p-6 border-l-4 relative overflow-hidden" style={{ borderLeftColor: COLOR, background: `rgba(${RGB},0.05)` }}>
          <div className="text-5xl absolute right-6 top-4 opacity-10" style={{ color: COLOR }}>"</div>
          <p className="text-xl font-medium text-text leading-relaxed italic">"{quoteText}"</p>
          <cite className="text-base text-muted mt-3 block">{quoteCite}</cite>
        </blockquote>
      </RevealBlock>

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/c/assessment" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          {hero.nav_prev || 'Đánh Giá Lối Sống'}
        </Link>
        <Link to="/pillar/c" className="flex items-center gap-2 text-lg font-bold transition-colors justify-center" style={{ color: COLOR }}>
          {hero.nav_all || 'Về Trang Chính →'}
        </Link>
      </div>
    </div>
  );
}
