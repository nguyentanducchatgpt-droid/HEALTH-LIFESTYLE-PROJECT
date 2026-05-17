import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

/* ─── Per-phase visual config ─────────────────────────── */
const PHASE_CFG = [
  {
    color:   'green',
    accent:  'text-green-400',
    border:  'border-green-500/30',
    bg:      'bg-green-500/5',
    glow:    'hover:shadow-green-500/10',
    dot:     'bg-green-500 border-green-500',
    bar:     'from-green-500/70',
    ring:    'ring-green-500/30',
    img:     'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&q=70',
  },
  {
    color:   'lime',
    accent:  'text-lime-400',
    border:  'border-lime-500/30',
    bg:      'bg-lime-500/5',
    glow:    'hover:shadow-lime-500/10',
    dot:     'bg-lime-500 border-lime-500',
    bar:     'from-lime-500/70',
    ring:    'ring-lime-500/30',
    img:     'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=70',
  },
  {
    color:   'purple',
    accent:  'text-purple-400',
    border:  'border-purple-500/30',
    bg:      'bg-purple-500/5',
    glow:    'hover:shadow-purple-500/10',
    dot:     'bg-purple-500 border-purple-500',
    bar:     'from-purple-500/70',
    ring:    'ring-purple-500/30',
    img:     'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=70',
  },
];

const DAY_CFG = {
  green:  { bg: 'bg-green-500/8  border-green-500/25  text-green-400',  dot: 'bg-green-400'  },
  blue:   { bg: 'bg-blue-500/8   border-blue-500/25   text-blue-400',   dot: 'bg-blue-400'   },
  teal:   { bg: 'bg-teal-500/8   border-teal-500/25   text-teal-400',   dot: 'bg-teal-400'   },
  purple: { bg: 'bg-purple-500/8 border-purple-500/25 text-purple-400', dot: 'bg-purple-400' },
};

export default function Program() {
  const { t } = useTranslation();
  const phases       = t('program.phases',        { returnObjects: true });
  const dailyBlocks  = t('program.daily_blocks',  { returnObjects: true });
  const weeklyDays   = t('program.weekly_days',   { returnObjects: true });
  const tips         = t('program.tips',          { returnObjects: true });
  const progressRows = t('program.progress_rows', { returnObjects: true });

  const [openPhase, setOpenPhase] = useState(null);

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="relative -mx-4 md:-mx-8 mb-16 overflow-hidden rounded-b-3xl" style={{ minHeight: 320 }}>
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=65"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.10 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/40 to-bg pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-25 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 px-4 md:px-8 pt-16 pb-14">
          <div className="inline-flex items-center gap-2 bg-accent/8 border border-accent/20 text-accent text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
            12 {t('program.phases_label') || 'tuần · 3 giai đoạn'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight mb-4">
            {t('program.title')}
          </h1>
          <p className="text-muted text-base leading-relaxed max-w-xl">{t('program.subtitle')}</p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { label: '12', sub: 'tuần' },
              { label: '3',  sub: 'giai đoạn' },
              { label: '6',  sub: 'trụ cột' },
              { label: '20+', sub: 'phút / ngày' },
            ].map(s => (
              <div key={s.label} className="flex items-baseline gap-1.5 bg-surface/80 border border-border backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-gradient font-extrabold text-lg">{s.label}</span>
                <span className="text-muted text-xs">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Jump links ─────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-14">
        {['#roadmap','#daily','#weekly','#tips','#progress'].map((href, i) => {
          const labels = [
            t('program.roadmap_title'),
            t('program.daily_title'),
            t('program.weekly_title'),
            t('program.tips_title'),
            t('program.progress_title'),
          ];
          return (
            <a
              key={href}
              href={href}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-accent hover:border-accent/40 transition-all duration-150"
            >
              {i + 1}. {labels[i]}
            </a>
          );
        })}
      </div>

      {/* ── 1. 12-Week Roadmap ─────────────────────────────── */}
      <section id="roadmap" className="mb-20 scroll-mt-20">
        <h2 className="text-xl font-bold text-text mb-10 flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm flex items-center justify-center font-bold">1</span>
          {t('program.roadmap_title')}
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[22px] top-8 bottom-8 w-px bg-gradient-to-b from-green-500/40 via-lime-500/40 to-purple-500/40" />

          <div className="space-y-6">
            {Array.isArray(phases) && phases.map((phase, i) => {
              const cfg  = PHASE_CFG[i] || PHASE_CFG[0];
              const open = openPhase === i;
              return (
                <div key={i} className="flex gap-5">
                  {/* Dot */}
                  <div className={`w-11 h-11 shrink-0 rounded-full border-2 ${cfg.dot} flex items-center justify-center font-bold text-white text-sm z-10 shadow-lg`}>
                    {i + 1}
                  </div>

                  {/* Card */}
                  <div
                    className={`flex-1 border ${cfg.border} ${cfg.bg} ${cfg.glow} rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in-up`}
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    {/* Card header with image */}
                    <button
                      type="button"
                      onClick={() => setOpenPhase(open ? null : i)}
                      className="w-full text-left"
                    >
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={cfg.img}
                          alt={phase.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-r ${cfg.bar} to-transparent opacity-70`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                          <div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.accent} opacity-80 block mb-0.5`}>
                              {phase.weeks}
                            </span>
                            <h3 className="font-bold text-lg text-white leading-tight">{phase.name}</h3>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full bg-black/30 border border-white/10 font-semibold ${cfg.accent}`}>
                            {phase.tag}
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="p-5">
                      <p className={`text-sm ${cfg.accent} font-medium mb-4 flex items-center gap-2`}>
                        <span className="text-base">🎯</span>
                        {phase.goal}
                      </p>

                      {/* Items — always visible */}
                      <ul className="space-y-2.5">
                        {Array.isArray(phase.items) && phase.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm text-muted group/item">
                            <span className={`w-4 h-4 rounded-full border ${cfg.border} text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${cfg.accent} group-hover/item:bg-accent/20 transition-colors`}>
                              ✓
                            </span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 2. Daily Framework ─────────────────────────────── */}
      <section id="daily" className="mb-20 scroll-mt-20">
        <h2 className="text-xl font-bold text-text mb-8 flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm flex items-center justify-center font-bold">2</span>
          {t('program.daily_title')}
        </h2>

        {/* Time bar visual */}
        <div className="flex h-3 rounded-full overflow-hidden mb-8 bg-border/30">
          {[
            { flex: 1, color: 'bg-green-500/60',  label: '5m'    },
            { flex: 3, color: 'bg-accent/60',      label: '10–20m' },
            { flex: 2, color: 'bg-teal-500/60',    label: '5–10m'  },
            { flex: 1, color: 'bg-purple-500/60',  label: '5m'    },
          ].map((seg, i) => (
            <div key={i} className={`${seg.color} transition-all duration-300 hover:brightness-125`} style={{ flex: seg.flex }} />
          ))}
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 pointer-events-none" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.isArray(dailyBlocks) && dailyBlocks.map((block, i) => (
              <div
                key={i}
                className="relative bg-surface border border-border rounded-2xl p-5 text-center hover:border-accent/30 hover:shadow-[0_0_24px_rgba(34,197,94,0.07)] transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="absolute top-3 right-3 text-[10px] font-bold text-muted/30">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform duration-300">{block.icon}</span>
                <p className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1">{block.time}</p>
                <h3 className="font-bold text-sm text-text mb-1.5">{block.name}</h3>
                <p className="text-xs text-muted leading-relaxed">{block.desc}</p>
                {/* Arrow connector */}
                {i < 3 && (
                  <span className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-border text-lg z-10">›</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Weekly Rhythm ───────────────────────────────── */}
      <section id="weekly" className="mb-20 scroll-mt-20">
        <h2 className="text-xl font-bold text-text mb-8 flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm flex items-center justify-center font-bold">3</span>
          {t('program.weekly_title')}
        </h2>

        <div className="space-y-3">
          {Array.isArray(weeklyDays) && weeklyDays.map((day, i) => {
            const cfg = DAY_CFG[day.color] || DAY_CFG.green;
            return (
              <div
                key={i}
                className="flex items-center gap-4 bg-surface border border-border rounded-2xl p-4 hover:border-border-bright transition-all duration-200 group animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-28 shrink-0 text-center px-3 py-2 rounded-xl border text-xs font-bold leading-tight ${cfg.bg}`}>
                  {day.days}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text text-sm">{day.type}</h3>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{day.desc}</p>
                </div>
                <div className={`shrink-0 w-2.5 h-2.5 rounded-full ${cfg.dot} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. Success Principles ──────────────────────────── */}
      <section id="tips" className="mb-20 scroll-mt-20">
        <h2 className="text-xl font-bold text-text mb-8 flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm flex items-center justify-center font-bold">4</span>
          {t('program.tips_title')}
        </h2>

        {/* Full-bleed background card */}
        <div className="relative overflow-hidden rounded-3xl border border-accent/15 mb-2">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-teal-500/4 pointer-events-none" />
          <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
          <div className="relative p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {Array.isArray(tips) && tips.map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 group animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform duration-200 mt-0.5">
                    {tip.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-text text-sm mb-1 group-hover:text-accent transition-colors duration-200">
                      {tip.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Progress Tracking ───────────────────────────── */}
      <section id="progress" className="mb-20 scroll-mt-20">
        <h2 className="text-xl font-bold text-text mb-2 flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm flex items-center justify-center font-bold">5</span>
          {t('program.progress_title')}
        </h2>
        <p className="text-muted text-xs mb-6 ml-10">{t('program.progress_note')}</p>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-accent/60 via-accent/20 to-transparent" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Chỉ số</th>
                  <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Bài test</th>
                  <th className="text-center text-xs font-bold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">Tuần 4</th>
                  <th className="text-center text-xs font-bold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">Tuần 12</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(progressRows) && progressRows.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-accent/3 transition-colors duration-150 last:border-0">
                    <td className="px-5 py-3 font-semibold text-text">{row.metric}</td>
                    <td className="px-5 py-3 text-muted leading-relaxed">{row.test}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block text-xs font-semibold text-accent bg-accent/8 border border-accent/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                        ___ {row.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block text-xs font-semibold text-teal-400 bg-teal-500/8 border border-teal-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                        ___ {row.unit}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-accent/20 mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-teal-500/5 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
        <div className="relative p-8 md:p-12 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-3">{t('program.cta_title')}</h2>
          <p className="text-muted text-sm leading-relaxed max-w-md mx-auto mb-8">{t('program.cta_text')}</p>
          <Link
            to="/pillar/a"
            className="btn-shimmer inline-flex items-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-hover text-bg font-bold rounded-xl transition-all duration-200 text-sm shadow-[0_0_30px_rgba(34,197,94,0.25)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:-translate-y-0.5"
          >
            {t('program.cta_btn')} →
          </Link>
        </div>
      </div>

    </div>
  );
}
