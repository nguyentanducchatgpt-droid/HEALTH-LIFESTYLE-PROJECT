import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const PHASE_STYLES = {
  green:  'border-green-500/30 bg-green-500/4  text-green-400',
  lime:   'border-lime-500/30 bg-lime-500/4   text-lime-400',
  purple: 'border-purple-500/30 bg-purple-500/4 text-purple-400',
  blue:   'border-blue-500/30 bg-blue-500/4   text-blue-400',
  teal:   'border-teal-500/30 bg-teal-500/4   text-teal-400',
};

const PHASE_DOT = {
  green:  'border-green-500 bg-green-500/20  text-green-400',
  lime:   'border-lime-500 bg-lime-500/20   text-lime-400',
  purple: 'border-purple-500 bg-purple-500/20 text-purple-400',
  blue:   'border-blue-500 bg-blue-500/20   text-blue-400',
  teal:   'border-teal-500 bg-teal-500/20   text-teal-400',
};

const DAY_COLORS = {
  green:  'text-green-400  bg-green-500/8  border-green-500/25',
  blue:   'text-blue-400   bg-blue-500/8   border-blue-500/25',
  teal:   'text-teal-400   bg-teal-500/8   border-teal-500/25',
  purple: 'text-purple-400 bg-purple-500/8 border-purple-500/25',
};

export default function Program() {
  const { t } = useTranslation();
  const phases     = t('program.phases',      { returnObjects: true });
  const dailyBlocks = t('program.daily_blocks', { returnObjects: true });
  const weeklyDays  = t('program.weekly_days',  { returnObjects: true });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-10">
        <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-accent text-sm transition-colors group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          {t('common.back')}
        </Link>
      </div>

      {/* Header */}
      <div className="mb-14 relative">
        <div className="absolute -top-8 -left-4 w-64 h-64 bg-accent/4 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-accent/8 border border-accent/20 text-accent text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
            12 weeks · Structured
          </div>
          <div className="text-5xl mb-5">🗓️</div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight">{t('program.title')}</h1>
          <p className="text-muted mt-4 text-base leading-relaxed max-w-2xl">{t('program.subtitle')}</p>
        </div>
      </div>

      {/* ── 12-Week Timeline ──────────────────────────── */}
      <section className="mb-20">
        <h2 className="text-xl font-bold text-text mb-10 flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm flex items-center justify-center font-bold">1</span>
          {t('program.roadmap_title')}
        </h2>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[22px] top-6 bottom-6 w-0.5 timeline-line rounded-full" />

          <div className="space-y-6">
            {Array.isArray(phases) && phases.map((phase, i) => {
              const phaseStyle = PHASE_STYLES[phase.color] || PHASE_STYLES.green;
              const dotStyle   = PHASE_DOT[phase.color]   || PHASE_DOT.green;
              return (
                <div key={i} className="flex gap-6">
                  {/* Timeline dot */}
                  <div className={`w-11 h-11 shrink-0 rounded-full border-2 ${dotStyle} flex items-center justify-center font-bold text-sm z-10`}>
                    {i + 1}
                  </div>

                  {/* Phase card */}
                  <div
                    className={`flex-1 border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg animate-fade-in-up ${phaseStyle}`}
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest opacity-60">{phase.weeks}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 border border-white/10 font-medium">
                        {phase.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-text mb-1">{phase.name}</h3>
                    <p className="text-sm text-muted mb-5 italic">{phase.goal}</p>
                    <ul className="space-y-2.5">
                      {Array.isArray(phase.items) && phase.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm text-muted group/item">
                          <span className="w-4 h-4 rounded-full bg-white/6 border border-white/15 text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-accent/20 group-hover/item:border-accent/30 transition-colors">
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
        </div>
      </section>

      {/* ── Daily Framework ───────────────────────────── */}
      <section className="mb-20">
        <h2 className="text-xl font-bold text-text mb-8 flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm flex items-center justify-center font-bold">2</span>
          {t('program.daily_title')}
        </h2>

        <div className="relative">
          {/* Horizontal connector */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 pointer-events-none" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.isArray(dailyBlocks) && dailyBlocks.map((block, i) => (
              <div
                key={i}
                className="relative bg-surface border border-border rounded-2xl p-5 text-center hover:border-accent/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.06)] transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Step number */}
                <span className="absolute top-3 right-3 text-[10px] font-bold text-muted/40">{i + 1}</span>

                <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform duration-300">{block.icon}</span>
                <p className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1">{block.time}</p>
                <h3 className="font-bold text-sm text-text mb-1.5">{block.name}</h3>
                <p className="text-xs text-muted leading-relaxed">{block.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Weekly Rhythm ─────────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-text mb-8 flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm flex items-center justify-center font-bold">3</span>
          {t('program.weekly_title')}
        </h2>

        <div className="space-y-3">
          {Array.isArray(weeklyDays) && weeklyDays.map((day, i) => {
            const dayStyle = DAY_COLORS[day.color] || DAY_COLORS.green;
            return (
              <div
                key={i}
                className="flex items-center gap-4 bg-surface border border-border rounded-2xl p-4 hover:border-border-bright transition-all duration-200 group animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-28 shrink-0 text-center px-3 py-2 rounded-xl border text-xs font-bold leading-tight ${dayStyle}`}>
                  {day.days}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text text-sm">{day.type}</h3>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{day.desc}</p>
                </div>
                <div className="shrink-0 w-2 h-2 rounded-full bg-accent/30 group-hover:bg-accent transition-colors duration-300" />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
