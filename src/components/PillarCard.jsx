import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BORDER_COLORS = {
  green:  'hover:border-green-500',
  lime:   'hover:border-lime-500',
  teal:   'hover:border-teal-500',
  purple: 'hover:border-purple-500',
  blue:   'hover:border-blue-500',
  orange: 'hover:border-orange-500',
};

export default function PillarCard({ pillarKey }) {
  const { t } = useTranslation('pillars');
  const pillar = t(pillarKey, { returnObjects: true });

  if (!pillar || typeof pillar !== 'object') return null;

  const borderClass = BORDER_COLORS[pillar.color] || 'hover:border-accent';

  return (
    <Link
      to={`/pillar/${pillar.id}`}
      className={`block bg-surface border border-border ${borderClass} rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group`}
    >
      <div className="text-4xl mb-3">{pillar.icon}</div>
      <h3 className="text-base font-semibold text-text group-hover:text-accent transition-colors">
        {pillar.title}
      </h3>
      <p className="text-xs text-muted mt-0.5 uppercase tracking-wider">{pillar.subtitle}</p>
      <p className="text-sm text-muted mt-3 leading-relaxed line-clamp-2">{pillar.description}</p>
    </Link>
  );
}
