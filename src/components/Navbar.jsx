import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_LINKS = [
  { key: 'nav.home', to: '/' },
  { key: 'nav.program', to: '/program' },
  { key: 'nav.videos', to: '/videos' },
  { key: 'nav.contact', to: '/contact' },
  { key: 'nav.donate', to: '/donate' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const closeMenu = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/60">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 font-bold text-accent shrink-0 group"
        >
          <span className="text-xl group-hover:animate-float">🌿</span>
          <span className="hidden sm:inline text-sm font-bold tracking-tight">
            <span className="text-text">{t('brand.part1')}</span>
            <span className="text-accent"> & </span>
            <span className="text-text">{t('brand.part2')}</span>
          </span>
          <span className="sm:hidden text-xs font-bold text-text">{t('brand.short')}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ key, to }) => (
            <Link
              key={to}
              to={to}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive(to)
                  ? 'text-accent bg-accent/8'
                  : 'text-muted hover:text-text hover:bg-white/4'
              }`}
            >
              {t(key)}
              {isActive(to) && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          ))}
          <div className="ml-2 pl-2 border-l border-border">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile: lang + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted hover:text-accent hover:border-accent/40 transition-all duration-200"
            aria-label="Toggle menu"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-b border-border/60 px-4 py-3 flex flex-col gap-1 animate-slide-down">
          {NAV_LINKS.map(({ key, to }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(to)
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:text-text hover:bg-white/4'
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
