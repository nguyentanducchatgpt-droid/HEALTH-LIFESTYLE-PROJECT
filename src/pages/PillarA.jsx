import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// ─── Sub-section config ─────────────────────────────────────────────────────────

const SUB_SECTIONS = [
  {
    n: '01',
    path: '/pillar/a/movements',
    title: '6 Mẫu Vận Động Nền Tảng',
    sub: 'Khởi Động & Giãn Cơ Sau Tập',
    icon: '🏃',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=65',
    desc: 'Học 6 chuyển động nền tảng với video minh họa chi tiết, khởi động chuẩn và giãn cơ đúng cách sau mỗi buổi tập.',
    features: ['6 video HD từng bài', 'Khởi động 5–8 phút', 'Giãn cơ 5–10 phút'],
    cta: 'Học động tác',
    preview: 'Squat · Hinge · Push · Pull · Core · Thở',
    glow: 'rgba(34,197,94,0.22)',
    border: 'border-green-500/25',
    hoverBorder: 'group-hover:border-green-500/55',
    badge: 'bg-green-500/8 border-green-500/20 text-green-400',
    dot:   'bg-green-400',
    text:  'text-green-400',
    chip:  'bg-green-500/10 border-green-500/20 text-green-300',
    bar:   'from-green-500/80 to-transparent',
    accentBg: 'bg-green-500/6',
    timelineColor: '#22c55e',
  },
  {
    n: '02',
    path: '/pillar/a/framework',
    title: 'Khung Ngày Tập 20–40 Phút',
    sub: 'Chọn Khung Thời Gian Luyện Tập',
    icon: '⏱️',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=65',
    desc: 'Khung ngày 4 khối thời gian chuẩn và 8 mức thời gian từ 20 đến 180 phút — tìm lịch phù hợp với cuộc sống.',
    features: ['4 khối trong ngày', '8 mức: 20–180 phút', 'Kế hoạch chi tiết'],
    cta: 'Xây khung ngày',
    preview: 'Khởi động · Vận động chính · Giãn cơ · Tĩnh tâm',
    glow: 'rgba(249,115,22,0.22)',
    border: 'border-orange-500/25',
    hoverBorder: 'group-hover:border-orange-500/55',
    badge: 'bg-orange-500/8 border-orange-500/20 text-orange-400',
    dot:   'bg-orange-400',
    text:  'text-orange-400',
    chip:  'bg-orange-500/10 border-orange-500/20 text-orange-300',
    bar:   'from-orange-500/80 to-transparent',
    accentBg: 'bg-orange-500/6',
    timelineColor: '#f97316',
  },
  {
    n: '03',
    path: '/pillar/a/weekly',
    title: 'Nhịp Tuần Gợi Ý',
    sub: 'Buổi Tập Theo Mục Tiêu',
    icon: '📅',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=900&q=65',
    desc: '3 giai đoạn nhịp tuần linh hoạt và 6 lộ trình cá nhân hóa từ người mới bắt đầu đến vận động viên.',
    features: ['3 giai đoạn × 7 ngày', '6 lộ trình mục tiêu', 'Lịch chi tiết mỗi ngày'],
    cta: 'Lên lịch tuần',
    preview: 'Sức mạnh · Cardio · Phục hồi · Linh hoạt',
    glow: 'rgba(20,184,166,0.22)',
    border: 'border-teal-500/25',
    hoverBorder: 'group-hover:border-teal-500/55',
    badge: 'bg-teal-500/8 border-teal-500/20 text-teal-400',
    dot:   'bg-teal-400',
    text:  'text-teal-400',
    chip:  'bg-teal-500/10 border-teal-500/20 text-teal-300',
    bar:   'from-teal-500/80 to-transparent',
    accentBg: 'bg-teal-500/6',
    timelineColor: '#14b8a6',
  },
  {
    n: '04',
    path: '/pillar/a/progress',
    title: 'Bậc Thang Tiến Bộ',
    sub: 'Kiểm Tra Tiến Bộ Hàng Tháng',
    icon: '🏆',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=65',
    desc: '6 lộ trình theo mục tiêu với bậc thang cụ thể, kết hợp test kiểm tra định kỳ và radar chart theo dõi.',
    features: ['6 lộ trình mục tiêu', '4–5 bậc tiến bộ', 'Radar chart hàng tháng'],
    cta: 'Theo dõi tiến bộ',
    preview: 'Tuần 4 · Tuần 8 · Tuần 12 · Radar chart',
    glow: 'rgba(168,85,247,0.22)',
    border: 'border-purple-500/25',
    hoverBorder: 'group-hover:border-purple-500/55',
    badge: 'bg-purple-500/8 border-purple-500/20 text-purple-400',
    dot:   'bg-purple-400',
    text:  'text-purple-400',
    chip:  'bg-purple-500/10 border-purple-500/20 text-purple-300',
    bar:   'from-purple-500/80 to-transparent',
    accentBg: 'bg-purple-500/6',
    timelineColor: '#a855f7',
  },
];

const PRINCIPLES = [
  {
    icon: '🧱',
    title: 'Nền tảng trước hết',
    color: 'text-green-400',
    border: 'border-green-500/20',
    bg: 'bg-green-500/5',
    glow: 'rgba(34,197,94,0.08)',
    body: 'Form đúng quan trọng hơn tải nặng. Một bài squat chuẩn với trọng lượng nhẹ tạo ra nhiều cơ và ít chấn thương hơn 10 bài sai. Bắt đầu từ nền, không phải từ đỉnh.',
    stat: '80%', statLabel: 'chấn thương do kỹ thuật sai',
  },
  {
    icon: '⚙️',
    title: 'Hệ thống thắng ý chí',
    color: 'text-orange-400',
    border: 'border-orange-500/20',
    bg: 'bg-orange-500/5',
    glow: 'rgba(249,115,22,0.08)',
    body: '20 phút đều đặn mỗi ngày cho kết quả vượt trội hơn 2 tiếng tập luyện cuồng nhiệt mỗi tuần. Não bộ xây dựng thói quen qua sự lặp lại — hãy tạo khung trước, tăng cường độ sau.',
    stat: '3×', statLabel: 'hiệu quả của thói quen so với ý chí',
  },
  {
    icon: '📈',
    title: '1% tốt hơn mỗi tuần',
    color: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/5',
    glow: 'rgba(168,85,247,0.08)',
    body: 'Không cần đột phá. Cải thiện 1% mỗi tuần tích lũy thành 52% sau một năm. Bậc thang tiến bộ rõ ràng giúp bạn đo được sự thay đổi, duy trì động lực và không bỏ cuộc.',
    stat: '+52%', statLabel: 'sau 1 năm nếu cải thiện 1%/tuần',
  },
];

const STATS = [
  { value: 6,   suffix: '',      label: 'bài tập nền tảng',       icon: '⚡', color: 'text-green-400'  },
  { value: 20,  suffix: ' phút', label: 'mỗi ngày là đủ',         icon: '⏱',  color: 'text-orange-400' },
  { value: 3,   suffix: '',      label: 'giai đoạn nhịp tuần',    icon: '📅', color: 'text-teal-400'   },
  { value: 12,  suffix: ' tuần', label: 'lộ trình chuẩn',         icon: '🏆', color: 'text-purple-400' },
];

// ─── Hooks ──────────────────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCounter(target, duration = 1200) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const start = useCallback(() => setStarted(true), []);
  useEffect(() => {
    if (!started) return;
    let raf;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
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
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function StatCard({ stat, delay }) {
  const [ref, visible] = useScrollReveal(0.3);
  const [val, startCount] = useCounter(stat.value, 1000);
  useEffect(() => { if (visible) startCount(); }, [visible, startCount]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-border/50 bg-surface/50 backdrop-blur-sm p-5 text-center transition-all duration-500 hover:border-border hover:bg-surface"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.92)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="text-2xl mb-2">{stat.icon}</div>
      <div className={`text-3xl font-black ${stat.color} leading-none mb-1`}>
        {val}{stat.suffix}
      </div>
      <div className="text-[10px] text-muted leading-snug">{stat.label}</div>
    </div>
  );
}

function TiltCard({ sec, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, over: false });
  const [ref, visible] = useScrollReveal(0.08);

  const handleMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top)  / rect.height - 0.5;
    setTilt({ x: cy * -7, y: cx * 7, over: true });
  }, []);

  const handleLeave = useCallback(() => setTilt({ x: 0, y: 0, over: false }), []);

  const delay = index * 100;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <Link
        to={sec.path}
        ref={cardRef}
        className={`group relative overflow-hidden rounded-3xl border ${sec.border} ${sec.hoverBorder} flex flex-col transition-[border-color] duration-300`}
        style={{
          minHeight: 340,
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${tilt.over ? 'translateZ(4px)' : ''}`,
          transition: tilt.over
            ? 'transform 0.12s ease, box-shadow 0.3s ease, border-color 0.3s ease'
            : 'transform 0.5s ease, box-shadow 0.5s ease, border-color 0.3s ease',
          boxShadow: tilt.over ? `0 24px 80px ${sec.glow}, 0 0 0 1px ${sec.glow}` : '0 0 0 rgba(0,0,0,0)',
          willChange: 'transform',
        }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {/* Top accent bar */}
        <div className={`h-[2px] w-full bg-gradient-to-r ${sec.bar} transition-opacity duration-300 opacity-60 group-hover:opacity-100`} />

        {/* Background image with parallax-like zoom */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={sec.img}
            alt=""
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.08]"
            style={{ opacity: tilt.over ? 0.2 : 0.12, transition: 'opacity 0.4s ease, transform 0.7s ease' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/10" />
          <div className="absolute inset-0 bg-gradient-to-br from-bg/60 via-transparent to-transparent" />
        </div>

        {/* Ambient glow blob */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: sec.glow }}
        />

        {/* Number badge top-right */}
        <div className="absolute top-4 right-4 z-10">
          <div className="w-11 h-11 rounded-xl bg-bg/80 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors duration-300">
            <span className={`text-sm font-black ${sec.text}`}>{sec.n}</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col flex-1">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl ${sec.accentBg} border border-white/8 flex items-center justify-center text-2xl mb-5 transition-all duration-400 group-hover:border-white/18 group-hover:scale-105`}>
            {sec.icon}
          </div>

          {/* Titles */}
          <h3 className="font-black text-[17px] text-text leading-tight mb-1 group-hover:text-white transition-colors duration-200">{sec.title}</h3>
          <p className={`text-[11px] font-semibold ${sec.text} mb-3 opacity-80 group-hover:opacity-100 transition-opacity`}>{sec.sub}</p>

          {/* Description */}
          <p className="text-muted text-xs leading-relaxed mb-4 flex-1 group-hover:text-text/70 transition-colors duration-200">{sec.desc}</p>

          {/* Preview text */}
          <p className="text-[10px] text-muted/50 mb-4 font-mono tracking-wide truncate">{sec.preview}</p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {sec.features.map(f => (
              <span key={f} className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${sec.chip} transition-all duration-200`}>{f}</span>
            ))}
          </div>

          {/* CTA */}
          <div className={`inline-flex items-center gap-1.5 text-xs font-bold ${sec.text}`}>
            <span className="relative">
              {sec.cta}
              <span className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-300" style={{ background: sec.timelineColor }} />
            </span>
            <span className="group-hover:translate-x-1.5 transition-transform duration-200">→</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function JourneyTimeline() {
  const [hovered, setHovered] = useState(null);
  const [ref, visible] = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      {/* Desktop timeline */}
      <div className="hidden md:block relative">
        {/* Connecting line */}
        <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        {/* Animated progress line */}
        <div
          className="absolute top-8 left-[12.5%] h-px transition-all duration-700"
          style={{
            right: hovered !== null ? `${(3 - hovered) * 25 + 12.5}%` : '87.5%',
            background: hovered !== null
              ? `linear-gradient(90deg, ${SUB_SECTIONS[0].timelineColor}, ${SUB_SECTIONS[hovered].timelineColor})`
              : 'transparent',
          }}
        />

        <div className="grid grid-cols-4 gap-0">
          {SUB_SECTIONS.map((sec, i) => (
            <Link
              key={sec.n}
              to={sec.path}
              className="flex flex-col items-center group cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Node dot */}
              <div
                className="relative z-10 w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl mb-4 transition-all duration-300"
                style={{
                  borderColor: hovered === i ? sec.timelineColor : 'var(--color-border)',
                  background: hovered === i ? `${sec.timelineColor}15` : 'var(--color-bg)',
                  boxShadow: hovered === i ? `0 0 24px ${sec.glow}, inset 0 0 16px ${sec.glow}` : 'none',
                  transform: hovered === i ? 'scale(1.12)' : 'scale(1)',
                }}
              >
                {sec.icon}
              </div>

              {/* Number */}
              <span
                className="text-[10px] font-black mb-1.5 transition-colors duration-200"
                style={{ color: hovered === i ? sec.timelineColor : 'var(--color-muted)' }}
              >
                {sec.n}
              </span>

              {/* Title */}
              <h4
                className="text-[13px] font-bold text-center leading-snug mb-1 transition-colors duration-200 px-2"
                style={{ color: hovered === i ? 'var(--color-text)' : 'var(--color-muted)' }}
              >
                {sec.title}
              </h4>

              {/* Sub */}
              <p
                className="text-[10px] text-center leading-snug px-2 transition-all duration-200"
                style={{
                  color: hovered === i ? sec.timelineColor : 'transparent',
                  maxHeight: hovered === i ? '40px' : '0',
                  overflow: 'hidden',
                }}
              >
                {sec.sub}
              </p>

              {/* Arrow on hover */}
              <div
                className="mt-3 transition-all duration-200"
                style={{ opacity: hovered === i ? 1 : 0, transform: hovered === i ? 'translateY(0)' : 'translateY(-4px)' }}
              >
                <span className="text-[10px] font-bold px-3 py-1 rounded-full border" style={{ color: sec.timelineColor, borderColor: `${sec.timelineColor}40` }}>
                  Mở →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile: vertical timeline */}
      <div className="md:hidden space-y-1">
        {SUB_SECTIONS.map((sec, i) => (
          <Link
            key={sec.n}
            to={sec.path}
            className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 hover:border-border transition-all duration-200 group"
          >
            <div
              className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl shrink-0 transition-all duration-200 group-hover:scale-105"
              style={{ borderColor: `${sec.timelineColor}40`, background: `${sec.timelineColor}10` }}
            >
              {sec.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold" style={{ color: sec.timelineColor }}>{sec.n}</span>
                <h4 className="text-sm font-bold text-text truncate">{sec.title}</h4>
              </div>
              <p className="text-[11px] text-muted truncate">{sec.sub}</p>
            </div>
            <span className="text-muted group-hover:text-text transition-colors shrink-0">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function PillarA() {
  const { t: tCommon }  = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');
  const pillar = tPillars('pillarA', { returnObjects: true });

  // Scroll indicator fade
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
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

  return (
    <div className="max-w-5xl mx-auto -mt-4">

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <div className="relative -mx-4 md:-mx-8 overflow-hidden mb-20" style={{ minHeight: 500 }}>
        {/* Background mosaic */}
        <div className="absolute inset-0 grid grid-cols-3 gap-0">
          {[
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=45',
            'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=45',
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=45',
          ].map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-full object-cover" style={{ opacity: 0.16 }} />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/55 to-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-bg/80 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-20 pointer-events-none" />

        {/* Ambient glow orbs */}
        <div className="absolute top-[30%] left-[20%] w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-[50%] right-[15%] w-72 h-72 bg-purple-500/4 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-[40%] w-56 h-56 bg-teal-500/3 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 px-4 md:px-8 pt-14 pb-16 animate-fade-in-up">
          <Link to="/" className="inline-flex items-center gap-1.5 text-muted hover:text-accent text-xs transition-colors mb-8 group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Trang chủ
          </Link>

          {/* Pill tag */}
          <div className="flex items-center gap-2 bg-accent/8 border border-accent/20 text-accent text-xs font-bold px-4 py-1.5 rounded-full mb-6 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
            🏃 Trụ Cột A — Vận Động &amp; Tập Luyện
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-[64px] font-black text-text leading-[1.02] mb-5 tracking-tight">
            Xây nền thể lực<br />
            <span className="text-gradient">từng ngày, từng bước</span>
          </h1>

          {/* Description */}
          <p className="text-muted text-base leading-relaxed max-w-xl mb-10">{pillar.description}</p>

          {/* Stats chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: '🏃', n: '6',    label: 'bài tập có video',      color: 'text-green-400'  },
              { icon: '⏱️', n: '8',    label: 'mức thời gian',         color: 'text-orange-400' },
              { icon: '📅', n: '3',    label: 'giai đoạn nhịp tuần',   color: 'text-teal-400'   },
              { icon: '🏆', n: '3',    label: 'kỳ kiểm tra tiến bộ',   color: 'text-purple-400' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2.5 bg-surface/70 backdrop-blur-sm border border-border/80 px-4 py-2.5 rounded-xl hover:border-border transition-colors">
                <span className="text-base">{s.icon}</span>
                <div>
                  <span className={`${s.color} font-extrabold text-sm block leading-none`}>{s.n}</span>
                  <span className="text-muted text-[10px] leading-none">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 transition-opacity duration-500"
          style={{ opacity: scrolled ? 0 : 0.5 }}
        >
          <span className="text-[10px] text-muted font-medium tracking-wider uppercase">Cuộn xuống</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-1.5 rounded-full bg-white/40 animate-bounce" />
          </div>
        </div>
      </div>

      {/* ── PHILOSOPHY — 3 principles ──────────────────────────────────────────── */}
      <RevealBlock className="mb-20">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.25em] whitespace-nowrap">Triết lý tập luyện</p>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Quote */}
        <RevealBlock delay={100} className="mb-10">
          <blockquote className="text-center px-4 py-8">
            <p className="text-xl md:text-2xl font-black text-text leading-snug max-w-2xl mx-auto mb-4">
              "Mỗi buổi tập bạn hoàn thành không phải để trở thành<br className="hidden md:block" /> vận động viên —{' '}
              <span className="text-gradient">mà để trở thành phiên bản khỏe mạnh hơn của chính mình.</span>"
            </p>
            <div className="inline-flex items-center gap-2 text-[10px] text-muted uppercase tracking-widest">
              <span className="w-8 h-px bg-border" />
              Phương châm luyện tập bền vững
              <span className="w-8 h-px bg-border" />
            </div>
          </blockquote>
        </RevealBlock>

        {/* 3 Principle cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {PRINCIPLES.map((p, i) => (
            <RevealBlock key={p.title} delay={i * 120} className="h-full">
              <div
                className={`relative overflow-hidden rounded-2xl border ${p.border} ${p.bg} p-5 h-full transition-all duration-300 hover:-translate-y-0.5`}
                style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)` }}
              >
                {/* Glow top-right */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none" style={{ background: p.glow }} />

                <div className="relative">
                  <div className="text-3xl mb-3">{p.icon}</div>
                  <h3 className={`font-black text-base ${p.color} mb-2`}>{p.title}</h3>
                  <p className="text-xs text-muted leading-relaxed mb-4">{p.body}</p>

                  {/* Stat badge */}
                  <div className={`inline-flex items-center gap-2 border ${p.border} rounded-xl px-3 py-2`}>
                    <span className={`text-lg font-black ${p.color}`}>{p.stat}</span>
                    <span className="text-[10px] text-muted leading-snug max-w-[120px]">{p.statLabel}</span>
                  </div>
                </div>
              </div>
            </RevealBlock>
          ))}
        </div>
      </RevealBlock>

      {/* ── ANIMATED STATS STRIP ─────────────────────────────────────────────────── */}
      <RevealBlock className="mb-20">
        <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-surface/30 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/3 via-transparent to-purple-500/3 pointer-events-none" />
          <div className="absolute inset-0 grid-dots opacity-10 pointer-events-none" />
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-0">
            {STATS.map((stat, i) => (
              <div key={stat.label} className={`relative ${i < STATS.length - 1 ? 'md:border-r border-border/30' : ''} ${i < 2 ? 'border-b md:border-b-0 border-border/30' : ''}`}>
                <StatCard stat={stat} delay={i * 100} />
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* ── SECTION INTRO TEXT ────────────────────────────────────────────────────── */}
      <RevealBlock className="mb-12 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-text mb-3">4 chủ đề, 1 hành trình</h2>
        <p className="text-muted text-sm leading-relaxed max-w-2xl mx-auto">
          Trang này được tổ chức thành 4 chủ đề chuyên sâu — từ học động tác cơ bản đến
          theo dõi tiến bộ dài hạn. Bạn có thể đi theo thứ tự hoặc chọn chủ đề phù hợp nhất với
          nơi bạn đang đứng trong hành trình.
        </p>
      </RevealBlock>

      {/* ── JOURNEY TIMELINE ─────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <JourneyTimeline />
      </div>

      {/* "Bắt đầu từ đâu?" guide */}
      <RevealBlock className="mb-14">
        <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-white/[0.02] p-5">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-4">Bắt đầu từ đâu?</p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { who: '🌱 Mới hoàn toàn',       where: 'Bắt đầu với', sec: SUB_SECTIONS[0] },
              { who: '⏱ Có nền, cần lịch',      where: 'Đi thẳng đến', sec: SUB_SECTIONS[1] },
              { who: '📅 Cần sắp xếp tuần',     where: 'Khám phá',    sec: SUB_SECTIONS[2] },
              { who: '🏆 Muốn đo tiến bộ',      where: 'Thử ngay',    sec: SUB_SECTIONS[3] },
            ].map(item => (
              <Link
                key={item.who}
                to={item.sec.path}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-border transition-all duration-200 group hover:bg-white/[0.03]"
              >
                <span className="text-sm font-semibold text-muted min-w-[140px]">{item.who}</span>
                <span className="text-[11px] text-muted/60 shrink-0">{item.where}</span>
                <span className={`text-[11px] font-bold ${item.sec.text} flex-1 truncate`}>{item.sec.title}</span>
                <span className="text-muted group-hover:translate-x-0.5 transition-transform shrink-0">→</span>
              </Link>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* ── PORTAL CARDS 2×2 ─────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <RevealBlock className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.25em] whitespace-nowrap">Chọn chủ đề</p>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </RevealBlock>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-20">
        {SUB_SECTIONS.map((sec, i) => (
          <TiltCard key={sec.n} sec={sec} index={i} />
        ))}
      </div>

      {/* ── SAFETY callout ───────────────────────────────────────────────────────── */}
      {pillar.sections && Array.isArray(pillar.sections) && pillar.sections[5] && (
        <RevealBlock className="mb-16">
          <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-yellow-500/4 p-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
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

      {/* ── CTA links ────────────────────────────────────────────────────────────── */}
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
