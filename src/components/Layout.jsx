import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10 md:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative mt-10">
        {/* Gradient separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <div className="text-center">
            {/* Logo */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-2xl">🌿</span>
              <span className="font-bold text-text text-sm">{t('brand.part1')} & {t('brand.part2')}</span>
            </div>

            {/* Links row */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted mb-6">
              <span>{t('nav.home')}</span>
              <span className="text-border">·</span>
              <span>{t('nav.program')}</span>
              <span className="text-border">·</span>
              <span>{t('nav.videos')}</span>
              <span className="text-border">·</span>
              <span>{t('nav.contact')}</span>
              <span className="text-border">·</span>
              <span>{t('nav.donate')}</span>
            </div>

            <p className="text-muted text-xs mb-1">{t('footer.copyright')}</p>
            <p className="text-muted/60 text-xs max-w-lg mx-auto leading-relaxed">{t('footer.disclaimer')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
