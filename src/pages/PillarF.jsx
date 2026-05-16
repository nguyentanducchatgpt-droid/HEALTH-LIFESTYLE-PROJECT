import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LocalVideoCard from '../components/LocalVideoCard';
import DailyChecklist from '../components/DailyChecklist';

export default function PillarF() {
  const { t: tCommon } = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');

  const pillar = tPillars('pillarF', { returnObjects: true });

  if (!pillar || typeof pillar !== 'object') {
    return (
      <div className="text-center py-20 text-muted">{tCommon('loading')}</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/" className="text-muted hover:text-accent text-sm transition-colors inline-flex items-center gap-1">
          ← {tCommon('back')}
        </Link>
      </div>

      <div className="mb-12">
        <div className="text-6xl mb-4">{pillar.icon}</div>
        <h1 className="text-3xl md:text-4xl font-bold text-text">{pillar.title}</h1>
        <p className="text-accent text-sm uppercase tracking-widest mt-2">{pillar.subtitle}</p>
        <p className="text-muted mt-4 text-base leading-relaxed max-w-2xl">{pillar.description}</p>
      </div>

      {/* Interactive daily checklist (replaces static first section) */}
      <div className="mb-6">
        <DailyChecklist />
      </div>

      {/* Remaining sections */}
      {Array.isArray(pillar.sections) && pillar.sections.slice(1).map((section, i) => (
        <div key={i} className="bg-surface border border-border rounded-xl p-6 mb-4">
          <h2 className="font-semibold text-accent text-base mb-4">{section.title}</h2>
          <ul className="space-y-3">
            {Array.isArray(section.items) && section.items.map((item, j) => (
              <li key={j} className="flex items-start gap-3 text-sm text-muted">
                <span className="text-accent mt-0.5 flex-shrink-0 font-bold">✓</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {Array.isArray(pillar.videos) && pillar.videos.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-6 text-text">
            {tCommon('video.local_section')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pillar.videos.map((videoKey) => (
              <LocalVideoCard key={videoKey} src={videoKey} title={tCommon(`video.${videoKey}`)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
