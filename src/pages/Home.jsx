import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PillarCard from '../components/PillarCard';
import ContactSection from '../components/ContactSection';
import DonateSection from '../components/DonateSection';

const PILLARS = ['pillarA', 'pillarB', 'pillarC', 'pillarD', 'pillarE', 'pillarF'];

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero */}
      <section className="py-16 md:py-24 text-center">
        <div className="text-6xl mb-6">🌿</div>
        <h1 className="text-4xl md:text-6xl font-bold text-text leading-tight">
          {t('hero.title')}
        </h1>
        <p className="mt-5 text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#pillars"
            className="inline-block px-8 py-3 bg-accent hover:bg-accent-hover text-bg font-semibold rounded-lg transition-colors text-base"
          >
            {t('hero.cta')}
          </a>
          <Link
            to="/videos"
            className="inline-block px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-bg font-semibold rounded-lg transition-colors text-base"
          >
            {t('nav.videos')} →
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      {(() => {
        const stats = t('home.stats', { returnObjects: true });
        return Array.isArray(stats) ? (
          <div className="grid grid-cols-3 gap-4 mb-12">
            {stats.map((stat, i) => (
              <div key={i} className="bg-surface border border-border rounded-xl p-4 text-center">
                <p className="text-accent font-bold text-xl md:text-2xl">{stat.value}</p>
                <p className="text-muted text-xs mt-1 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        ) : null;
      })()}

      {/* Safety note */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-12 text-sm text-yellow-400 text-center">
        {t('common.safety_note')}
      </div>

      {/* 6 Pillars */}
      <section id="pillars" className="mb-20 scroll-mt-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          {t('hero.pillars_title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((key) => (
            <PillarCard key={key} pillarKey={key} />
          ))}
        </div>
      </section>

      {/* Quote block */}
      <div className="mb-20 bg-accent/5 border border-accent/20 rounded-2xl p-8 text-center">
        <p className="text-text text-lg md:text-xl font-medium italic leading-relaxed">
          "{t('home.quote')}"
        </p>
        <p className="text-muted text-sm mt-3">{t('home.quote_author')}</p>
      </div>

      <ContactSection />
      <DonateSection />
    </div>
  );
}
