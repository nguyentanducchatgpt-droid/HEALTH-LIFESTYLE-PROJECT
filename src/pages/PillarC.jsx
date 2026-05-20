import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SECTION_ACCENT = [
  'text-teal-400 bg-teal-500/10 border-teal-500/30',
  'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
];

const SLEEP_STAGE_STYLES = [
  'bg-teal-500/20 border-teal-500/30 text-teal-400',
  'bg-blue-500/20 border-blue-500/30 text-blue-400',
  'bg-purple-500/20 border-purple-500/30 text-purple-400',
  'bg-indigo-500/20 border-indigo-500/30 text-indigo-400',
  'bg-orange-500/20 border-orange-500/30 text-orange-400',
];

const MORNING_COLORS = [
  'text-teal-400 bg-teal-500/10 border-teal-500/30',
  'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  'text-green-400 bg-green-500/10 border-green-500/30',
];

const TEAL = '#14b8a6';

const HERO_STATS = [
  { n: '5', label: 'Thói quen' },
  { n: '3', label: 'Giai đoạn' },
  { n: '8h', label: 'Giấc ngủ' },
  { n: '30', label: 'Ngày mẫu' },
];

const KEY_POINTS = [
  'Giấc ngủ 7–9h — nền tảng phục hồi và não bộ',
  'Buổi sáng có chủ đích — 10 phút định hướng ngày mới',
  'Quản lý stress, năng lượng và nhịp sống bền vững',
];

export default function PillarC() {
  const { t: tCommon } = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');

  // Inject orbit-border CSS (shared id — only once per session)
  useEffect(() => {
    const id = 'pc-orbit-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --pc-orbit-angle {
        syntax: '<angle>';
        initial-value: 0deg;
        inherits: false;
      }
      @keyframes pcOrbitSpin {
        to { --pc-orbit-angle: 360deg; }
      }
      .pc-orbit-ring {
        background: conic-gradient(
          from var(--pc-orbit-angle),
          transparent 0deg,
          transparent 55deg,
          rgba(20,184,166,0.0) 65deg,
          rgba(20,184,166,0.75) 85deg,
          rgba(255,255,255,0.9) 92deg,
          rgba(20,184,166,0.75) 99deg,
          rgba(13,148,136,0.0) 115deg,
          transparent 125deg,
          transparent 360deg
        );
        animation: pcOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
  }, []);

  const pillar = tPillars('pillarC', { returnObjects: true });

  if (!pillar || typeof pillar !== 'object') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted text-sm">
          <span className="animate-spin">⟳</span>
          {tCommon('loading')}
        </div>
      </div>
    );
  }

  const sections      = tPillars('pillarC.sections',       { returnObjects: true });
  const sleepStages   = tPillars('pillarC.sleep_stages',   { returnObjects: true }) || [];
  const morningRoutine = tPillars('pillarC.morning_routine', { returnObjects: true }) || [];
  const recoverySteps  = tPillars('pillarC.recovery_steps',  { returnObjects: true }) || [];

  return (
    <div className="max-w-5xl mx-auto">

      {/* Breadcrumb */}
      <div className="mb-6 animate-fade-in-up">
        <Link
          to="/pillars"
          className="inline-flex items-center gap-1.5 text-muted hover:text-teal-400 text-xs transition-colors group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          6 Trụ Cột
          <span className="text-border/60 mx-1">•</span>
          <span className="text-teal-400/70">Trụ Cột C — Lối Sống Khỏe</span>
        </Link>
      </div>

      {/* ── Hero card with orbit glow border ── */}
      <div className="pc-orbit-ring rounded-3xl p-[1.5px] mb-16 animate-fade-in-up" style={{ animationDelay: '60ms', animationFillMode: 'both' }}>
        <div className="rounded-3xl overflow-hidden" style={{ background: '#0d0d0d' }}>
          <div className="grid md:grid-cols-[1fr_420px]">

            {/* LEFT: Content */}
            <div className="p-7 md:p-10 flex flex-col justify-center order-2 md:order-1">

              {/* Icon + Title */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border border-teal-500/20"
                  style={{ background: 'rgba(20,184,166,0.08)' }}>
                  🌿
                </div>
                <div>
                  <h1 className="text-2xl md:text-[28px] font-black text-text leading-tight">
                    {tPillars('pillarC.title')}
                  </h1>
                  <div className="inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black px-3 py-0.5 rounded-full mt-2 tracking-[0.18em]">
                    <span className="w-1 h-1 rounded-full bg-teal-400 animate-pulse" />
                    LIFESTYLE
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted text-sm leading-relaxed mb-5 max-w-md">
                {tPillars('pillarC.description')}
              </p>

              {/* 3 numbered key points */}
              <div className="space-y-2.5 mb-6">
                {KEY_POINTS.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 leading-none">
                      {i + 1}
                    </div>
                    <p className="text-sm text-muted leading-snug">{item}</p>
                  </div>
                ))}
              </div>

              {/* Mini stats chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                {HERO_STATS.map(s => (
                  <div key={s.label} className="flex items-center gap-1.5 bg-white/[0.04] border border-white/8 px-3 py-1.5 rounded-xl">
                    <span className="text-teal-400 font-extrabold text-sm leading-none">{s.n}</span>
                    <span className="text-muted text-[10px] leading-none">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  to="/pillar/c"
                  className="flex items-center gap-2 border border-teal-500/35 text-teal-400 font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 hover:bg-teal-500/10 hover:border-teal-500/60"
                  style={{ background: 'rgba(20,184,166,0.06)' }}
                >
                  Xem Toàn Bộ
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <span className="text-xs text-muted">5 thói quen · 30 ngày mẫu</span>
              </div>

            </div>

            {/* RIGHT: Lifestyle image */}
            <div className="relative h-[260px] md:h-auto overflow-hidden order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=75"
                alt="Healthy lifestyle meditation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-[#0d0d0d]/85 hidden md:block pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/70 to-transparent md:hidden pointer-events-none" />
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(270deg, #14b8a6 0%, #0d9488 60%, transparent 100%)' }} />
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className="text-[10px] font-black text-teal-400 bg-black/65 backdrop-blur-sm px-3 py-1.5 rounded-full border border-teal-500/40 tracking-widest">
                  TRỤ CỘT C
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Sleep Quality Timeline */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-10 transition-all duration-300 hover:border-border-bright">
        <h2 className="text-base font-bold text-text mb-5">{tPillars('pillarC.sleep_title')}</h2>
        <div className="flex flex-wrap items-center gap-2">
          {sleepStages.map((stage, i) => (
            <div key={stage.time} className="flex items-center gap-2">
              <div className={`bg-surface border rounded-xl px-3 py-2 text-center text-xs ${SLEEP_STAGE_STYLES[i % SLEEP_STAGE_STYLES.length]}`}>
                <div className="font-bold">{stage.time}</div>
                <div className="text-[10px] mt-0.5 opacity-80">{stage.label}</div>
              </div>
              {i < sleepStages.length - 1 && (
                <span className="text-muted text-xs">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-4">
          {tPillars('pillarC.sleep_note')}
        </p>
      </div>

      {/* Morning Routine Cards */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-text mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs flex items-center justify-center font-bold">★</span>
          {tPillars('pillarC.morning_title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {morningRoutine.map((r, idx) => (
            <div
              key={r.time}
              className={`bg-surface border rounded-2xl p-4 transition-all duration-300 hover:border-border-bright ${MORNING_COLORS[idx % MORNING_COLORS.length]}`}
            >
              <div className="text-3xl mb-2">{r.emoji}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider mb-1 opacity-80">{r.time}</div>
              <div className="text-sm text-text leading-snug">{r.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recovery Protocol Steps */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-10 transition-all duration-300 hover:border-border-bright">
        <h2 className="text-base font-bold text-text mb-5">{tPillars('pillarC.recovery_title')}</h2>
        <div className="space-y-0">
          {recoverySteps.map((s, i) => (
            <div key={s.step}>
              <div className="flex items-center gap-4 py-3">
                <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-bold flex items-center justify-center shrink-0">
                  {s.step}
                </div>
                <span className="text-sm text-muted">{s.text}</span>
              </div>
              {i < recoverySteps.length - 1 && (
                <div className="h-px bg-border ml-12" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Standard Sections from i18n */}
      {Array.isArray(sections) && sections.length > 0 && (
        <div className="space-y-5 mb-16">
          {sections.map((section, i) => {
            const accentClass = SECTION_ACCENT[i % SECTION_ACCENT.length];
            return (
              <div
                key={i}
                className="bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-border-bright group animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-[2px] bg-gradient-to-r from-teal-500/50 via-teal-500/20 to-transparent" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center border shrink-0 ${accentClass}`}>
                      {i + 1}
                    </span>
                    <h2 className="font-bold text-text text-base">{section.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {Array.isArray(section.items) && section.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-sm text-muted group/item hover:text-text transition-colors duration-150"
                      >
                        <span className="w-5 h-5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-teal-500 group-hover/item:text-bg transition-all duration-200">
                          ✓
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom note */}
      <div className="border border-teal-500/20 bg-teal-500/5 rounded-2xl p-5 text-sm text-muted text-center">
        <span className="text-teal-400 font-semibold">{tPillars('pillarC.note_label')}</span>{' '}
        {tPillars('pillarC.note')}
      </div>
    </div>
  );
}
