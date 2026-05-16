import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LocalVideoCard from './LocalVideoCard';

const SECTION_ACCENT = [
  'text-green-400 bg-green-500/10 border-green-500/30',
  'text-teal-400 bg-teal-500/10 border-teal-500/30',
  'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'text-purple-400 bg-purple-500/10 border-purple-500/30',
  'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'text-lime-400 bg-lime-500/10 border-lime-500/30',
];

export default function PillarPage({ pillarKey }) {
  const { t: tCommon } = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');

  const pillar = tPillars(pillarKey, { returnObjects: true });

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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted hover:text-accent text-sm transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          {tCommon('back')}
        </Link>
      </div>

      {/* Header */}
      <div className="mb-14 relative">
        {/* Background glow */}
        <div className="absolute -top-8 -left-8 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-5xl bg-surface border border-border mb-6 animate-fade-in">
            {pillar.icon}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">
            {pillar.title}
          </h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent mt-3 mb-4 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
            {pillar.subtitle}
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">{pillar.description}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-12" />

      {/* Content sections */}
      {Array.isArray(pillar.sections) && pillar.sections.length > 0 && (
        <div className="space-y-5 mb-16">
          {pillar.sections.map((section, i) => {
            const accentClass = SECTION_ACCENT[i % SECTION_ACCENT.length];
            return (
              <div
                key={i}
                className="bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-border-bright group animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Top gradient line */}
                <div className="h-[2px] bg-gradient-to-r from-accent/50 via-accent/20 to-transparent" />

                <div className="p-6">
                  {/* Section header */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center border shrink-0 ${accentClass}`}>
                      {i + 1}
                    </span>
                    <h2 className="font-bold text-text text-base">{section.title}</h2>
                  </div>

                  {/* Items */}
                  <ul className="space-y-3">
                    {Array.isArray(section.items) && section.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-sm text-muted group/item hover:text-text transition-colors duration-150"
                      >
                        <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-accent group-hover/item:text-bg transition-all duration-200">
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

      {/* Videos */}
      {Array.isArray(pillar.videos) && pillar.videos.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
            <h2 className="text-lg font-bold text-text px-4">
              {tCommon('video.local_section')}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-border to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pillar.videos.map((videoKey) => (
              <LocalVideoCard
                key={videoKey}
                src={videoKey}
                title={tCommon(`video.${videoKey}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
