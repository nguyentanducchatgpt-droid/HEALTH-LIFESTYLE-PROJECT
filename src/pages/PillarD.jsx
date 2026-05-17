import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SECTION_ACCENT = [
  'text-purple-400 bg-purple-500/10 border-purple-500/30',
  'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
  'text-violet-400 bg-violet-500/10 border-violet-500/30',
  'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30',
  'text-pink-400 bg-pink-500/10 border-pink-500/30',
  'text-purple-400 bg-purple-500/10 border-purple-500/30',
];

const PHASE_DURATIONS = { inhale: 4, hold1: 4, exhale: 4, hold2: 4 };

const PHASE_STYLE = {
  inhale: 'scale-110 bg-purple-500/20 border-purple-400',
  hold1:  'scale-110 bg-purple-500/30 border-purple-300',
  exhale: 'scale-90  bg-purple-500/10 border-purple-500/50',
  hold2:  'scale-90  bg-purple-500/5  border-purple-500/30',
  idle:   'scale-100 bg-purple-500/10 border-purple-500/30',
};

const MEDITATION_ACCENTS = [
  'text-purple-400 bg-purple-500/10 border-purple-500/30',
  'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
  'text-violet-400 bg-violet-500/10 border-violet-500/30',
];

export default function PillarD() {
  const { t }           = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');

  const pillar = tPillars('pillarD', { returnObjects: true });

  const phases          = tPillars('pillarD.phases',          { returnObjects: true }) || [];
  const meditationSteps = tPillars('pillarD.meditation_steps', { returnObjects: true }) || [];
  const journalLines    = tPillars('pillarD.journal_lines',   { returnObjects: true }) || [];

  const [phase,   setPhase]   = useState('idle');
  const [count,   setCount]   = useState(4);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const phaseKeys = ['inhale', 'hold1', 'exhale', 'hold2'];
    let phaseIdx  = 0;
    let remaining = PHASE_DURATIONS[phaseKeys[0]];
    setPhase(phaseKeys[0]);
    setCount(remaining);
    const interval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        phaseIdx  = (phaseIdx + 1) % 4;
        remaining = PHASE_DURATIONS[phaseKeys[phaseIdx]];
        setPhase(phaseKeys[phaseIdx]);
      }
      setCount(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const handleToggle = () => {
    if (running) {
      setRunning(false);
      setPhase('idle');
      setCount(4);
    } else {
      setRunning(true);
    }
  };

  if (!pillar || typeof pillar !== 'object') {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-muted text-sm">{t('loading')}</span>
      </div>
    );
  }

  const currentLabel = running
    ? (phases.find(p => p.key === phase)?.label ?? '')
    : '';
  const circleStyle  = PHASE_STYLE[phase] ?? PHASE_STYLE.idle;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted hover:text-purple-400 text-sm transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          {t('back')}
        </Link>
      </div>

      {/* Hero */}
      <div className="mb-14 relative">
        <div className="absolute -top-8 -left-8 w-56 h-56 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-4 right-0 w-40 h-40 bg-violet-500/6 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-5xl bg-surface border border-purple-500/30 mb-6 animate-fade-in">
            {pillar.icon}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">
            {pillar.title}
          </h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-400 mt-3 mb-4 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
            {pillar.subtitle}
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">{pillar.description}</p>
        </div>
      </div>

      {/* Contextual image */}
      <div className="relative rounded-3xl overflow-hidden mb-14 border border-purple-500/20">
        <img
          src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1200&q=70"
          alt="Meditation and calm"
          className="w-full h-64 md:h-80 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-purple-300 text-sm font-medium">
            {tPillars('pillarD.image_caption')}
          </p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-12" />

      {/* Box Breathing Component */}
      <div className="bg-surface border border-border rounded-3xl p-8 text-center mb-10">
        <h2 className="text-xl font-bold text-text mb-1 flex items-center justify-center gap-2">
          <span>🌬️</span> {tPillars('pillarD.breathing_title')}
        </h2>
        <p className="text-muted text-sm mb-8">
          {tPillars('pillarD.breathing_subtitle')}
        </p>

        {/* Animated circle */}
        <div className="flex flex-col items-center gap-6">
          <div
            className={`
              relative w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center
              transition-all duration-1000 ease-in-out
              ${circleStyle}
            `}
          >
            {/* Outer pulse ring when running */}
            {running && (
              <div className="absolute inset-0 rounded-full border border-purple-400/20 animate-ping" />
            )}
            <span className="text-purple-300 text-lg font-semibold">
              {running ? currentLabel : tPillars('pillarD.ready_label')}
            </span>
            <span className="text-4xl font-bold text-purple-400 mt-1">
              {running ? count : ''}
            </span>
            {!running && (
              <span className="text-muted text-xs mt-1">{tPillars('pillarD.click_start')}</span>
            )}
          </div>

          {/* Phase indicator row */}
          {running && (
            <div className="flex items-center gap-2">
              {phases.map((p) => (
                <div
                  key={p.key}
                  className={`h-1.5 w-10 rounded-full transition-all duration-500 ${
                    phase === p.key ? 'bg-purple-400' : 'bg-purple-500/20'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Start / Stop button */}
          <button
            onClick={handleToggle}
            className={`
              px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-200
              ${running
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30'
                : 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/20'
              }
            `}
          >
            {running ? tPillars('pillarD.stop_btn') : tPillars('pillarD.start_btn')}
          </button>
        </div>
      </div>

      {/* 3-Step Meditation Guide */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
          <span className="text-2xl">🧘</span>
          {tPillars('pillarD.meditation_title')}
        </h2>
        <div className="space-y-4">
          {meditationSteps.map((step, idx) => {
            const accent = MEDITATION_ACCENTS[idx % MEDITATION_ACCENTS.length];
            const borderClass = accent.split(' ').find(c => c.startsWith('border-'));
            const bgBorderClasses = accent.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('border')).join(' ');
            return (
              <div
                key={step.num}
                className={`relative bg-surface border ${borderClass} rounded-2xl overflow-hidden`}
              >
                <div className={`h-[2px] bg-gradient-to-r ${step.bar} to-transparent`} />
                <div className="flex items-start gap-5 p-5">
                  <div
                    className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${bgBorderClasses}`}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${accent}`}>
                        {tPillars('pillarD.step_label')} {step.num}
                      </span>
                      <span className="font-bold text-text text-base">{step.title}</span>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Journaling Template */}
      <div className="mb-12">
        <div className="bg-surface border border-purple-500/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-text mb-1 flex items-center gap-2">
            <span>📓</span> {tPillars('pillarD.journal_title')}
          </h2>
          <p className="text-muted text-xs mb-5">
            {tPillars('pillarD.journal_subtitle')}
          </p>
          <div className="space-y-3">
            {journalLines.map((line, i) => (
              <div
                key={i}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-sm text-muted flex items-center gap-3 cursor-text hover:border-purple-500/30 transition-colors duration-200"
              >
                <span className="w-5 h-5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-12" />

      {/* Standard sections from i18n */}
      {Array.isArray(pillar.sections) && (
        <div className="space-y-5 mb-16">
          {pillar.sections.map((section, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-[2px] bg-gradient-to-r from-purple-500/50 via-purple-500/20 to-transparent" />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center border shrink-0 ${
                      SECTION_ACCENT[i % SECTION_ACCENT.length]
                    }`}
                  >
                    {i + 1}
                  </span>
                  <h2 className="font-bold text-text text-base">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {Array.isArray(section.items) &&
                    section.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-sm text-muted hover:text-text transition-colors duration-150 group/item"
                      >
                        <span className="w-5 h-5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-purple-500 group-hover/item:text-white transition-all duration-200">
                          ✓
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
