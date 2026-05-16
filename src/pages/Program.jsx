import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const COLOR_BADGE = {
  green: 'bg-green-500/15 text-green-400 border-green-500/30',
  lime: 'bg-lime-500/15 text-lime-400 border-lime-500/30',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  teal: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
};

export default function Program() {
  const { t } = useTranslation();
  const phases = t('program.phases', { returnObjects: true });
  const dailyBlocks = t('program.daily_blocks', { returnObjects: true });
  const weeklyDays = t('program.weekly_days', { returnObjects: true });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/" className="text-muted hover:text-accent text-sm transition-colors inline-flex items-center gap-1">
          ← {t('common.back')}
        </Link>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="text-5xl mb-4">🗓️</div>
        <h1 className="text-3xl md:text-4xl font-bold text-text">{t('program.title')}</h1>
        <p className="text-muted mt-3 text-base leading-relaxed max-w-2xl">{t('program.subtitle')}</p>
      </div>

      {/* 12-Week Roadmap */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold text-accent mb-8">{t('program.roadmap_title')}</h2>
        <div className="space-y-4">
          {Array.isArray(phases) && phases.map((phase, i) => (
            <div key={i} className={`border rounded-xl p-6 ${COLOR_BADGE[phase.color] || 'border-border bg-surface'}`}>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-60">{phase.weeks}</span>
                    <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-medium">{phase.tag}</span>
                  </div>
                  <h3 className="font-bold text-lg text-text mb-1">{phase.name}</h3>
                  <p className="text-sm text-muted mb-4 italic">{phase.goal}</p>
                  <ul className="space-y-2">
                    {Array.isArray(phase.items) && phase.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted">
                        <span className="text-accent mt-0.5 shrink-0 font-bold">✓</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Framework */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold text-accent mb-8">{t('program.daily_title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.isArray(dailyBlocks) && dailyBlocks.map((block, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 flex items-start gap-4 hover:border-accent/40 transition-colors">
              <span className="text-3xl shrink-0">{block.icon}</span>
              <div>
                <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-1">{block.time}</p>
                <h3 className="font-semibold text-text text-sm mb-1">{block.name}</h3>
                <p className="text-xs text-muted leading-relaxed">{block.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly Rhythm */}
      <section>
        <h2 className="text-xl font-semibold text-accent mb-8">{t('program.weekly_title')}</h2>
        <div className="space-y-3">
          {Array.isArray(weeklyDays) && weeklyDays.map((day, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 flex items-start gap-4 hover:border-accent/40 transition-colors">
              <div className="w-28 shrink-0">
                <p className="text-xs font-semibold text-accent leading-relaxed">{day.days}</p>
              </div>
              <div>
                <h3 className="font-semibold text-text text-sm">{day.type}</h3>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">{day.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
