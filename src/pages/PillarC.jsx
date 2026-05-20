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

export default function PillarC() {
  const { t: tCommon } = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');

  const pillar = tPillars('pillarC', { returnObjects: true });

  useEffect(() => {
    const id = 'pc-orbit-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --pc-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes pcOrbitSpin { to { --pc-orbit-angle: 360deg; } }
      .pc-orbit-ring {
        background: conic-gradient(
          from var(--pc-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(20,184,166,0.0) 65deg, rgba(20,184,166,0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(20,184,166,0.75) 99deg,
          rgba(20,184,166,0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: pcOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
  }, []);

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
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-10">
        <Link
          to="/pillars"
          className="inline-flex items-center gap-2 text-muted hover:text-teal-400 text-sm transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          6 Trụ Cột
        </Link>
      </div>

      {/* Hero */}
      <div className="mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-start gap-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-5xl bg-surface border border-teal-500/20 shrink-0 animate-float">
            🌿
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">
              {tPillars('pillarC.title')}
            </h1>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal-400 mt-3 mb-4 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full">
              {tPillars('pillarC.subtitle')}
            </span>
            <p className="text-muted text-base leading-relaxed max-w-2xl">
              {tPillars('pillarC.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Contextual image */}
      <div className="pc-orbit-ring rounded-3xl p-[1.5px] mb-12">
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=70"
            alt="lifestyle"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest bg-bg/60 px-3 py-1 rounded-full border border-teal-500/20">
              {tPillars('pillarC.image_caption')}
            </span>
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
