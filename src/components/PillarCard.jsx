import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const STYLES = {
  green:  { bar: 'bg-green-500',  glow: 'card-glow-green',  icon: 'group-hover:bg-green-500/12',  text: 'group-hover:text-green-400',  arrow: 'text-green-500',  border: 'group-hover:border-green-500/40'  },
  lime:   { bar: 'bg-lime-500',   glow: 'card-glow-lime',   icon: 'group-hover:bg-lime-500/12',   text: 'group-hover:text-lime-400',   arrow: 'text-lime-500',   border: 'group-hover:border-lime-500/40'   },
  teal:   { bar: 'bg-teal-500',   glow: 'card-glow-teal',   icon: 'group-hover:bg-teal-500/12',   text: 'group-hover:text-teal-400',   arrow: 'text-teal-500',   border: 'group-hover:border-teal-500/40'   },
  purple: { bar: 'bg-purple-500', glow: 'card-glow-purple', icon: 'group-hover:bg-purple-500/12', text: 'group-hover:text-purple-400', arrow: 'text-purple-500', border: 'group-hover:border-purple-500/40' },
  blue:   { bar: 'bg-blue-500',   glow: 'card-glow-blue',   icon: 'group-hover:bg-blue-500/12',   text: 'group-hover:text-blue-400',   arrow: 'text-blue-500',   border: 'group-hover:border-blue-500/40'   },
  orange: { bar: 'bg-orange-500', glow: 'card-glow-orange', icon: 'group-hover:bg-orange-500/12', text: 'group-hover:text-orange-400', arrow: 'text-orange-500', border: 'group-hover:border-orange-500/40' },
};

export default function PillarCard({ pillarKey, delay = 0 }) {
  const { t: tPillars } = useTranslation('pillars');
  const { t: tCommon } = useTranslation();
  const pillar = tPillars(pillarKey, { returnObjects: true });

  if (!pillar || typeof pillar !== 'object') return null;

  const s = STYLES[pillar.color] || STYLES.green;

  return (
    <Link
      to={`/pillar/${pillar.id}`}
      className={`block relative bg-surface border border-border ${s.border} ${s.glow} rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 group animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Animated top color bar */}
      <div className={`h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out ${s.bar} opacity-80`} />

      <div className="p-6">
        {/* Icon container */}
        <div
          className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-4xl mb-5 bg-white/4 ${s.icon} transition-all duration-300 group-hover:scale-105`}
        >
          {pillar.icon}
        </div>

        {/* Title */}
        <h3 className={`font-bold text-lg text-text ${s.text} transition-colors duration-200 leading-tight`}>
          {pillar.title}
        </h3>

        {/* Subtitle badge */}
        <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-muted mt-1.5 mb-3 px-2 py-0.5 bg-white/4 rounded-md">
          {pillar.subtitle}
        </span>

        {/* Description */}
        <p className="text-base text-muted leading-relaxed line-clamp-2">{pillar.description}</p>

        {/* Learn more */}
        <div className={`mt-5 flex items-center gap-1.5 text-sm font-medium text-muted ${s.text} transition-all duration-200`}>
          <span>{tCommon('common.learn_more')}</span>
          <span className="group-hover:translate-x-1.5 transition-transform duration-200 text-base">→</span>
        </div>
      </div>
    </Link>
  );
}
