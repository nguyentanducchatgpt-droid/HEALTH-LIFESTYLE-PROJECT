import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10 md:px-8">
        {children}
      </main>

      <footer className="relative mt-10">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          {/* Top row: logo + all links horizontal */}
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-xl">🌿</span>
              <span className="font-bold text-text text-sm">{t('brand.part1')} & {t('brand.part2')}</span>
            </Link>

            {/* Separator */}
            <div className="hidden md:block h-4 w-px bg-border shrink-0" />

            {/* Nav links */}
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {[
                { to: '/', label: t('nav.home') },
                { to: '/pillars', label: t('nav.pillars') },
                { to: '/program', label: t('nav.program') },
                { to: '/sample-programs', label: t('nav.sample_programs') || 'Lộ trình mẫu' },
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

          {/* Bottom bar */}
          <div className="border-t border-border/50 pt-5 text-center">
            <p className="text-muted text-xs mb-1">{t('footer.copyright')}</p>
            <p className="text-muted/60 text-xs max-w-lg mx-auto leading-relaxed">{t('footer.disclaimer')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
