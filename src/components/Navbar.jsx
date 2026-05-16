import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_LINKS = [
  { key: 'nav.home', to: '/' },
  { key: 'nav.program', to: '/program' },
  { key: 'nav.videos', to: '/videos' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (to) => location.pathname === to;

  const closeMenu = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2 font-bold text-accent text-base md:text-lg shrink-0">
          🌿 <span className="hidden sm:inline">Sức Khỏe & Đời Sống</span>
          <span className="sm:hidden">SK&ĐS</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ key, to }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive(to) ? 'text-accent' : 'text-muted'
              }`}
            >
              {t(key)}
            </Link>
          ))}
          <a
            href="#contact"
            className="text-sm font-medium text-muted hover:text-accent transition-colors"
          >
            {t('nav.contact')}
          </a>
          <a
            href="#donate"
            className="text-sm font-medium text-muted hover:text-accent transition-colors"
          >
            {t('nav.donate')}
          </a>
          <LanguageSwitcher />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-muted hover:text-accent transition-colors"
          aria-label="Toggle menu"
        >
          <span className="text-xl">{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface border-b border-border px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ key, to }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive(to) ? 'text-accent' : 'text-muted'
              }`}
            >
              {t(key)}
            </Link>
          ))}
          <a
            href="#contact"
            onClick={closeMenu}
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            {t('nav.contact')}
          </a>
          <a
            href="#donate"
            onClick={closeMenu}
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            {t('nav.donate')}
          </a>
          <div className="pt-1">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
}
