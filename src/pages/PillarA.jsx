import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// ─── Tab data ───────────────────────────────────────────────────────────────────

const TABS = [
  {
    n: '01',
    path: '/pillar/a/movements',
    title: '6 Mẫu Vận Động Nền Tảng',
    sub: 'Khởi Động & Giãn Cơ Sau Tập',
    icon: '🏃',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=65',
    longDesc: 'Học 6 mẫu chuyển động cơ bản — nền tảng của mọi chương trình tập luyện hiệu quả. Mỗi bài tập có video minh họa chi tiết, từ tư thế chuẩn đến biến thể nâng cao. Kết hợp khởi động 5–8 phút và giãn cơ sau tập, bạn có một buổi hoàn chỉnh và an toàn.',
    highlights: [
      { icon: '🎬', title: 'Video HD từng bài', desc: 'Xem rõ góc độ, kỹ thuật và cue vận động chuẩn' },
      { icon: '📊', title: '3 cấp độ/bài tập',  desc: 'Từ cơ bản đến nâng cao — tiến bộ từng bước rõ ràng' },
      { icon: '🔥', title: 'Khởi động chuẩn khoa học', desc: 'Giảm nguy cơ chấn thương và tăng hiệu suất 15–20%' },
    ],
    tabStats: [{ n: '6', label: 'Bài tập' }, { n: '3×', label: 'Cấp độ/bài' }, { n: '15\'', label: 'Khởi + Giãn' }],
    previewItems: ['Squat', 'Hinge', 'Push-up', 'Pull/Row', 'Core', 'Thở & Tim mạch', 'Khởi động 5–8\'', 'Giãn cơ 5–10\''],
    cta: 'Học động tác',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.18)',
    text:  'text-green-400',
    badge: 'bg-green-500/8 border-green-500/20 text-green-400',
    dot:   'bg-green-400',
    chip:  'bg-green-500/10 border-green-500/20 text-green-300',
    border:'border-green-500/30',
    accentBg: 'bg-green-500/8',
    tabBg:    'bg-green-500/5',
    bar:   'from-green-500/80 to-transparent',
  },
  {
    n: '02',
    path: '/pillar/a/framework',
    title: 'Khung Ngày Tập 20–40 Phút',
    sub: 'Chọn Khung Thời Gian Luyện Tập',
    icon: '⏱️',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=65',
    longDesc: 'Buổi tập không cần dài — cần đúng cấu trúc. 4 khối thời gian trong ngày (Khởi động → Vận động chính → Giãn cơ → Tĩnh tâm) cho phép tập có mục đích trong bất kỳ thời lượng nào. Chọn khung phù hợp — mỗi phút đều có kế hoạch rõ ràng.',
    highlights: [
      { icon: '⚡', title: '4 khối thời gian chuẩn', desc: 'Cấu trúc khoa học cho mỗi buổi tập' },
      { icon: '📐', title: '8 mức: 20–180 phút',      desc: 'Từ siêu bận đến chuyên sâu — đều có lịch' },
      { icon: '💡', title: 'Chi tiết từng phút',       desc: 'Biết chính xác làm gì trong mỗi khoảng thời gian' },
    ],
    tabStats: [{ n: '4', label: 'Khối/ngày' }, { n: '8', label: 'Mức thời gian' }, { n: '20\'', label: 'Tối thiểu' }],
    previewItems: ['Khởi động 5\'', 'Sức mạnh 10–20\'', 'Tim mạch 15–35\'', 'Giãn cơ 5–10\'', 'Tĩnh tâm 5\'', '7 kcal/phút max'],
    cta: 'Xây khung ngày',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.18)',
    text:  'text-orange-400',
    badge: 'bg-orange-500/8 border-orange-500/20 text-orange-400',
    dot:   'bg-orange-400',
    chip:  'bg-orange-500/10 border-orange-500/20 text-orange-300',
    border:'border-orange-500/30',
    accentBg: 'bg-orange-500/8',
    tabBg:    'bg-orange-500/5',
    bar:   'from-orange-500/80 to-transparent',
  },
  {
    n: '03',
    path: '/pillar/a/weekly',
    title: 'Nhịp Tuần Gợi Ý',
    sub: 'Buổi Tập Theo Mục Tiêu',
    icon: '📅',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=900&q=65',
    longDesc: 'Thể lực được xây qua tuần, không phải qua ngày. 3 giai đoạn nhịp tuần (Bắt đầu → Xây nền → Nâng cao) giúp cơ thể thích nghi từng bước mà không burnout. 6 lộ trình theo mục tiêu giúp bạn chọn đúng nhịp cho hoàn cảnh cụ thể của mình.',
    highlights: [
      { icon: '🗓', title: '3 giai đoạn nhịp tuần', desc: 'Tiến bộ từng bước, không burnout' },
      { icon: '🎯', title: '6 lộ trình theo mục tiêu', desc: 'Từ siêu bận đến vận động viên chuyên sâu' },
      { icon: '😴', title: 'Nghỉ đúng cách',          desc: 'Phục hồi là phần thiết yếu, không phải lười biếng' },
    ],
    tabStats: [{ n: '3', label: 'Giai đoạn' }, { n: '6', label: 'Lộ trình' }, { n: '7', label: 'Ngày/tuần' }],
    previewItems: ['Sức mạnh T2/T4/T6', 'Cardio T3/T5', 'Phục hồi T7', 'Người mới', 'Giảm mỡ', 'Tăng cơ', 'Sức bền', 'Nâng cao'],
    cta: 'Lên lịch tuần',
    color: '#14b8a6',
    glow: 'rgba(20,184,166,0.18)',
    text:  'text-teal-400',
    badge: 'bg-teal-500/8 border-teal-500/20 text-teal-400',
    dot:   'bg-teal-400',
    chip:  'bg-teal-500/10 border-teal-500/20 text-teal-300',
    border:'border-teal-500/30',
    accentBg: 'bg-teal-500/8',
    tabBg:    'bg-teal-500/5',
    bar:   'from-teal-500/80 to-transparent',
  },
  {
    n: '04',
    path: '/pillar/a/progress',
    title: 'Bậc Thang Tiến Bộ',
    sub: 'Kiểm Tra Tiến Bộ Hàng Tháng',
    icon: '🏆',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=65',
    longDesc: 'Tiến bộ mà không đo được thì không bền vững. Bậc thang tiến bộ cho bạn thấy rõ đang ở đâu và cần làm gì tiếp theo. Kết hợp test 3 kỳ (Tuần 4, 8, 12) và radar chart 4 chiều, bạn có bức tranh toàn diện về sức khỏe thể chất.',
    highlights: [
      { icon: '🪜', title: 'Bậc thang rõ ràng',     desc: 'Biết chính xác bước tiếp theo trong hành trình' },
      { icon: '🎯', title: 'Test định kỳ 3 kỳ',     desc: 'Kiểm tra tuần 4, tuần 8 và tuần 12' },
      { icon: '📊', title: 'Radar chart 4 chiều',   desc: 'Sức mạnh · Sức bền · Linh hoạt · Phục hồi' },
    ],
    tabStats: [{ n: '6', label: 'Lộ trình' }, { n: '5', label: 'Bậc/lộ trình' }, { n: '4', label: 'Chiều đánh giá' }],
    previewItems: ['Tuần 4 test', 'Tuần 8 test', 'Tuần 12 test', 'Radar chart', '6 mục tiêu cá nhân', 'Điểm A/B/C/D', 'Coach notes'],
    cta: 'Theo dõi tiến bộ',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.18)',
    text:  'text-purple-400',
    badge: 'bg-purple-500/8 border-purple-500/20 text-purple-400',
    dot:   'bg-purple-400',
    chip:  'bg-purple-500/10 border-purple-500/20 text-purple-300',
    border:'border-purple-500/30',
    accentBg: 'bg-purple-500/8',
    tabBg:    'bg-purple-500/5',
    bar:   'from-purple-500/80 to-transparent',
  },
];

const STATS = [
  { value: 6,  suffix: '',      label: 'bài tập nền tảng',    icon: '⚡', color: 'text-green-400'  },
  { value: 20, suffix: ' phút', label: 'mỗi ngày là đủ',      icon: '⏱', color: 'text-orange-400' },
  { value: 3,  suffix: '',      label: 'giai đoạn nhịp tuần', icon: '📅', color: 'text-teal-400'   },
  { value: 12, suffix: ' tuần', label: 'lộ trình chuẩn',      icon: '🏆', color: 'text-purple-400' },
];

// ─── Hooks ──────────────────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.12) {
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

function useCounter(target, duration = 1100) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const start = useCallback(() => setStarted(true), []);
  useEffect(() => {
    if (!started) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);
  return [val, start];
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function RevealBlock({ children, delay = 0, className = '' }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function StatCard({ stat, delay }) {
  const [ref, visible] = useScrollReveal(0.3);
  const [val, startCount] = useCounter(stat.value);
  useEffect(() => { if (visible) startCount(); }, [visible, startCount]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-border/50 bg-surface/50 p-5 text-center hover:border-border transition-colors duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.9)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="text-xl mb-2">{stat.icon}</div>
      <div className={`text-3xl font-black ${stat.color} leading-none mb-1`}>{val}{stat.suffix}</div>
      <div className="text-[10px] text-muted">{stat.label}</div>
    </div>
  );
}

// ─── Tab content panel ──────────────────────────────────────────────────────────

function TabPanel({ tab }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border ${tab.border} mt-[-1px]`}>
      {/* Top accent */}
      <div className="h-[2px] w-full bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(90deg, ${tab.color}cc, transparent)` }} />

      {/* Background */}
      <div className="absolute inset-0">
        <img src={tab.img} alt="" className="w-full h-full object-cover" style={{ opacity: 0.08 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/60 via-transparent to-transparent" />
      </div>
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: tab.glow }} />

      <div className="relative z-10 p-6 md:p-8 grid md:grid-cols-[55%_45%] gap-8">
        {/* ── Left column ── */}
        <div>
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 border text-xs font-bold px-3 py-1.5 rounded-full mb-5 ${tab.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${tab.dot} shrink-0`} />
            {tab.n} / 04 · {tab.sub}
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-text leading-tight mb-2">{tab.title}</h2>
          <p className={`text-xs font-semibold ${tab.text} mb-5 opacity-80`}>{tab.sub}</p>
          <p className="text-muted text-sm leading-relaxed mb-7">{tab.longDesc}</p>

          {/* Highlights */}
          <div className="space-y-3.5 mb-8">
            {tab.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-3.5 group">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 border transition-all duration-200 group-hover:scale-105`}
                  style={{ background: `${tab.color}12`, borderColor: `${tab.color}30` }}
                >
                  {h.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text leading-tight">{h.title}</p>
                  <p className="text-[11px] text-muted mt-0.5">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <Link
            to={tab.path}
            className={`inline-flex items-center gap-2.5 font-bold text-sm px-7 py-3.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 group`}
            style={{
              background: `${tab.color}12`,
              borderColor: `${tab.color}40`,
              color: tab.color,
              boxShadow: `0 0 0 rgba(0,0,0,0)`,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${tab.glow}`; e.currentTarget.style.background = `${tab.color}20`; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)'; e.currentTarget.style.background = `${tab.color}12`; }}
          >
            {tab.cta}
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* ── Right column ── */}
        <div>
          {/* Image with stats overlay */}
          <div className="relative rounded-2xl overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
            <img src={tab.img} alt="" className="w-full h-full object-cover" style={{ opacity: 0.45 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${tab.color}08, transparent)` }} />

            {/* Stats overlay */}
            <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2">
              {tab.tabStats.map((s, i) => (
                <div key={i} className="bg-bg/85 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-black leading-none mb-0.5" style={{ color: tab.color }}>{s.n}</div>
                  <div className="text-[9px] text-muted leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview items */}
          <div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2.5">Nội dung bên trong</p>
            <div className="flex flex-wrap gap-1.5">
              {tab.previewItems.map(item => (
                <span key={item} className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${tab.chip}`}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function PillarA() {
  const { t: tCommon }  = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');
  const pillar = tPillars('pillarA', { returnObjects: true });

  const [activeTab, setActiveTab] = useState(0);
  const [tabKey, setTabKey] = useState(0);
  const tabBarRef = useRef(null);

  const switchTab = useCallback((i) => {
    if (i === activeTab) return;
    setActiveTab(i);
    setTabKey(k => k + 1);
  }, [activeTab]);

  // Scroll active tab into view on mobile
  useEffect(() => {
    const bar = tabBarRef.current;
    if (!bar) return;
    const btn = bar.children[activeTab];
    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeTab]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!pillar || typeof pillar !== 'object') {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-muted text-sm">{tCommon('common.loading')}</span>
      </div>
    );
  }

  const tab = TABS[activeTab];

  return (
    <div className="max-w-5xl mx-auto -mt-4">

      {/* ── HERO ────────────────────────────────────────────────────────────────── */}
      <div className="relative -mx-4 md:-mx-8 overflow-hidden mb-16" style={{ minHeight: 460 }}>
        <div className="absolute inset-0 grid grid-cols-3">
          {[
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=45',
            'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=45',
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=45',
          ].map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-full object-cover" style={{ opacity: 0.15 }} />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/55 to-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-bg/80 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-20 pointer-events-none" />
        <div className="absolute top-[30%] left-[20%] w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" style={{ animation: 'pulse 6s ease-in-out infinite' }} />
        <div className="absolute top-[50%] right-[15%] w-64 h-64 bg-purple-500/4 rounded-full blur-[90px] pointer-events-none" style={{ animation: 'pulse 8s ease-in-out 2s infinite' }} />

        <div className="relative z-10 px-4 md:px-8 pt-14 pb-16 animate-fade-in-up">
          <Link to="/" className="inline-flex items-center gap-1.5 text-muted hover:text-accent text-xs transition-colors mb-8 group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Trang chủ
          </Link>
          <div className="inline-flex items-center gap-2 bg-accent/8 border border-accent/20 text-accent text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
            🏃 Trụ Cột A — Vận Động &amp; Tập Luyện
          </div>
          <h1 className="text-5xl md:text-[62px] font-black text-text leading-[1.02] mb-5 tracking-tight">
            Xây nền thể lực<br />
            <span className="text-gradient">từng ngày, từng bước</span>
          </h1>
          <p className="text-muted text-base leading-relaxed max-w-xl mb-10">{pillar.description}</p>
          <div className="flex flex-wrap gap-3">
            {TABS.map(t => (
              <button
                key={t.n}
                onClick={() => { switchTab(TABS.indexOf(t)); window.scrollTo({ top: 420, behavior: 'smooth' }); }}
                className="flex items-center gap-2 bg-surface/70 backdrop-blur-sm border border-border/80 px-4 py-2.5 rounded-xl hover:border-border transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <span className="text-base">{t.icon}</span>
                <div>
                  <span className={`${t.text} font-extrabold text-xs block leading-none`}>{t.n}</span>
                  <span className="text-muted text-[10px] leading-none line-clamp-1 max-w-[80px] md:max-w-none">{t.title.split(' ').slice(0,3).join(' ')}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none transition-opacity duration-500"
          style={{ opacity: scrolled ? 0 : 0.45 }}
        >
          <span className="text-[9px] text-muted font-medium tracking-widest uppercase">Cuộn xuống</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-1.5 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* ── STATS STRIP ─────────────────────────────────────────────────────────── */}
      <RevealBlock className="mb-16">
        <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-surface/20">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/3 via-transparent to-purple-500/3 pointer-events-none" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {STATS.map((s, i) => (
              <div key={s.label} className={[
                i < STATS.length - 1 ? 'md:border-r border-border/30' : '',
                i < 2 ? 'border-b md:border-b-0 border-border/30' : '',
              ].join(' ')}>
                <StatCard stat={s} delay={i * 90} />
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* ── TAB NAVIGATION ──────────────────────────────────────────────────────── */}
      <RevealBlock className="mb-0">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.25em] whitespace-nowrap">4 chủ đề luyện tập</p>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Tab bar */}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <div
              ref={tabBarRef}
              className="flex min-w-max md:min-w-0 md:grid md:grid-cols-4 border border-border rounded-2xl overflow-hidden"
            >
              {TABS.map((t, i) => {
                const isActive = activeTab === i;
                return (
                  <button
                    key={t.n}
                    type="button"
                    onClick={() => switchTab(i)}
                    className={`relative flex items-center gap-3 p-4 text-left transition-all duration-200 border-r border-border/50 last:border-r-0 focus:outline-none shrink-0 md:shrink
                      ${isActive ? t.tabBg : 'hover:bg-white/[0.03]'}`}
                  >
                    {/* Active bottom line */}
                    {isActive && (
                      <div
                        className="absolute bottom-0 inset-x-0 h-[2px]"
                        style={{ background: `linear-gradient(90deg, ${t.color}, transparent)` }}
                      />
                    )}
                    {/* Active left accent (mobile) */}
                    {isActive && (
                      <div
                        className="md:hidden absolute inset-y-0 left-0 w-[2px]"
                        style={{ background: t.color }}
                      />
                    )}

                    {/* Icon bubble */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all duration-200 border"
                      style={{
                        background: isActive ? `${t.color}15` : 'transparent',
                        borderColor: isActive ? `${t.color}35` : 'var(--color-border)',
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      {t.icon}
                    </div>

                    {/* Text */}
                    <div className="min-w-0 hidden md:block">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-black" style={{ color: isActive ? t.color : '#6b7280' }}>{t.n}</span>
                      </div>
                      <p className={`text-[13px] font-bold leading-tight truncate transition-colors ${isActive ? 'text-text' : 'text-muted'}`}>{t.title}</p>
                      <p className="text-[10px] leading-tight mt-0.5 transition-colors truncate" style={{ color: isActive ? t.color : 'transparent' }}>{t.sub}</p>
                    </div>

                    {/* Mobile: number label */}
                    <div className="md:hidden">
                      <span className="text-[9px] font-black block mb-0.5" style={{ color: isActive ? t.color : '#6b7280' }}>{t.n}</span>
                      <p className={`text-[11px] font-bold leading-tight transition-colors ${isActive ? 'text-text' : 'text-muted'}`}>{t.title.split(' ').slice(0,2).join(' ')}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab panel — re-mounts on tab switch to re-trigger animation */}
        <div key={tabKey} className="animate-fade-in-up">
          <TabPanel tab={tab} />
        </div>
      </RevealBlock>

      {/* ── GUIDE: Bắt đầu từ đâu? ─────────────────────────────────────────────── */}
      <RevealBlock className="mt-10 mb-16">
        <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-white/[0.015] p-5">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-4">Bắt đầu từ đâu?</p>
          <div className="grid md:grid-cols-2 gap-2">
            {[
              { who: '🌱 Mới hoàn toàn',       where: 'Bắt đầu với', tab: TABS[0] },
              { who: '⏱ Có nền, cần cấu trúc', where: 'Đi thẳng đến', tab: TABS[1] },
              { who: '📅 Cần tổ chức tuần',     where: 'Khám phá',    tab: TABS[2] },
              { who: '🏆 Muốn đo tiến bộ',      where: 'Thử ngay',    tab: TABS[3] },
            ].map((item, i) => (
              <button
                key={item.who}
                onClick={() => { switchTab(i); tabBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-border transition-all duration-200 group hover:bg-white/[0.03] text-left w-full"
              >
                <span className="text-sm font-medium text-muted min-w-[140px] shrink-0">{item.who}</span>
                <span className="text-[11px] text-muted/50 shrink-0 hidden md:block">{item.where}</span>
                <span className={`text-[11px] font-bold flex-1 truncate ${item.tab.text}`}>{item.tab.title}</span>
                <span className="text-muted group-hover:translate-x-0.5 transition-transform shrink-0">→</span>
              </button>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* ── SAFETY callout ──────────────────────────────────────────────────────── */}
      {pillar.sections && Array.isArray(pillar.sections) && pillar.sections[5] && (
        <RevealBlock className="mb-16">
          <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-yellow-500/4 p-6">
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⚠️</span>
                <h3 className="font-bold text-yellow-400 text-base">{pillar.sections[5].title}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                {Array.isArray(pillar.sections[5].items) && pillar.sections[5].items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-yellow-300/70">
                    <span className="text-yellow-400/60 mt-0.5 shrink-0">·</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealBlock>
      )}

      {/* ── CTA ─────────────────────────────────────────────────────────────────── */}
      <RevealBlock className="mb-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/program" className="group relative overflow-hidden rounded-2xl border border-accent/20 bg-accent/4 p-6 hover:border-accent/40 hover:bg-accent/8 transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute inset-0 grid-dots opacity-10 pointer-events-none" />
            <div className="relative">
              <div className="text-3xl mb-3">🗓️</div>
              <h3 className="font-black text-text text-base mb-1">Lộ Trình 12 Tuần</h3>
              <p className="text-muted text-xs leading-relaxed mb-4">Khung ngày chuẩn, nhịp tuần gợi ý, bộ test tiến bộ theo giai đoạn.</p>
              <span className="inline-flex items-center gap-1.5 text-accent text-xs font-bold group-hover:gap-2.5 transition-all">Xem lộ trình <span>→</span></span>
            </div>
          </Link>
          <Link to="/sample-programs" className="group relative overflow-hidden rounded-2xl border border-pink-500/20 bg-pink-500/4 p-6 hover:border-pink-500/40 hover:bg-pink-500/8 transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute inset-0 grid-dots opacity-10 pointer-events-none" />
            <div className="relative">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-black text-text text-base mb-1">Lộ Trình Mẫu</h3>
              <p className="text-muted text-xs leading-relaxed mb-4">6 mục tiêu × 24 tuần — tìm lộ trình phù hợp nhất với bạn.</p>
              <span className="inline-flex items-center gap-1.5 text-pink-400 text-xs font-bold group-hover:gap-2.5 transition-all">Khám phá <span>→</span></span>
            </div>
          </Link>
        </div>
      </RevealBlock>

    </div>
  );
}
