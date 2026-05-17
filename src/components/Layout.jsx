import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const PILLAR_LINKS = [
  { to: '/pillar/a', icon: '🏃', key: 'pillarA' },
  { to: '/pillar/b', icon: '🥗', key: 'pillarB' },
  { to: '/pillar/c', icon: '🌿', key: 'pillarC' },
  { to: '/pillar/d', icon: '🧘', key: 'pillarD' },
  { to: '/pillar/e', icon: '📚', key: 'pillarE' },
  { to: '/pillar/f', icon: '🛠️', key: 'pillarF' },
];

export default function Layout({ children }) {
  const { t } = useTranslation();
  const { t: tPillars } = useTranslation('pillars');

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10 md:px-8">
        {children}
      </main>

      <footer className="relative mt-10">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

            {/* Brand col */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌿</span>
                <span className="font-bold text-text text-sm">{t('brand.part1')} & {t('brand.part2')}</span>
              </div>
              <p className="text-muted text-xs leading-relaxed max-w-[200px]">
                {t('hero.badge')}
              </p>
            </div>

            {/* Quick links */}
            <div>
              <div className="flex flex-col gap-2">
                {[
                  { to: '/', label: t('nav.home') },
                  { to: '/program', label: t('nav.program') },
                  { to: '/videos', label: t('nav.videos') },
                  { to: '/contact', label: t('nav.contact') },
                  { to: '/donate', label: t('nav.donate') },
                ].map(({ to, label }) => (
                  <Link key={to} to={to} className="text-xs text-muted hover:text-accent transition-colors duration-150">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* 6 Pillars */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
                {t('nav.pillars')}
              </p>
              <div className="flex flex-wrap gap-2">
                {PILLAR_LINKS.map(({ to, icon, key }) => (
                  <Link
                    key={to}
                    to={to}
                    title={tPillars(`${key}.title`) || key}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface border border-border hover:border-accent/40 hover:bg-accent/8 text-base transition-all duration-200"
                  >
                    {icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border/50 pt-6 text-center">
            <p className="text-muted text-xs mb-1">{t('footer.copyright')}</p>
            <p className="text-muted/60 text-xs max-w-lg mx-auto leading-relaxed">{t('footer.disclaimer')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
