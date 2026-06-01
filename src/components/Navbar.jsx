import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const PILLARS = [
  { icon: '🏃', to: '/pillar/a', key: 'pillarA', color: 'text-green-400',  dot: 'bg-green-400' },
  { icon: '🥗', to: '/pillar/b', key: 'pillarB', color: 'text-lime-400',   dot: 'bg-lime-400' },
  { icon: '🌿', to: '/pillar/c', key: 'pillarC', color: 'text-teal-400',   dot: 'bg-teal-400' },
  { icon: '🧘', to: '/pillar/d', key: 'pillarD', color: 'text-purple-400', dot: 'bg-purple-400' },
  { icon: '📚', to: '/pillar/e', key: 'pillarE', color: 'text-blue-400',   dot: 'bg-blue-400' },
  { icon: '🛠️', to: '/pillar/f', key: 'pillarF', color: 'text-orange-400', dot: 'bg-orange-400' },
];

const NAV_LINKS = [
  { key: 'nav.home',    to: '/' },
  { key: 'nav.program', to: '/program' },
  { key: 'nav.videos',  to: '/videos' },
  { key: 'nav.contact', to: '/contact' },
  { key: 'nav.donate',  to: '/donate' },
];

export default function Navbar() {
  const { t }           = useTranslation();
  const { t: tPillars } = useTranslation('pillars');
  const location        = useLocation();
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [pillarsOpen,  setPillarsOpen]  = useState(false);
  const [mobilePillars, setMobilePillars] = useState(false);
  const closeTimer = useRef(null);

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const isPillarActive = PILLARS.some(p => location.pathname.startsWith(p.to));

  const closeMenu = () => { setMenuOpen(false); setMobilePillars(false); };

  const openDropdown  = () => { clearTimeout(closeTimer.current); setPillarsOpen(true); };
  const startClose    = () => { closeTimer.current = setTimeout(() => setPillarsOpen(false), 150); };

  useEffect(() => {
    const id = 'nb-brand-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes nbGlow1 {
        0%,100% { text-shadow: 0 0 3px rgba(34,197,94,0.15); color:#86efac; }
        50%      { text-shadow: 0 0 12px rgba(34,197,94,0.6), 0 0 24px rgba(34,197,94,0.2); color:#bbf7d0; }
      }
      @keyframes nbGlow2 {
        0%,100% { text-shadow: 0 0 3px rgba(20,184,166,0.15); color:#5eead4; }
        50%      { text-shadow: 0 0 12px rgba(20,184,166,0.6), 0 0 24px rgba(20,184,166,0.2); color:#99f6e4; }
      }
      @keyframes nbAmpBeat {
        0%,100% { transform:scale(1);   color:#22c55e; text-shadow:none; }
        40%      { transform:scale(1.18); color:#4ade80; text-shadow:0 0 10px rgba(34,197,94,0.7); }
        60%      { transform:scale(1.12); }
      }
      .nb-p1  { color:#86efac; animation: nbGlow1 4s ease-in-out infinite; }
      .nb-p2  { color:#5eead4; animation: nbGlow2 4s ease-in-out infinite 2s; }
      .nb-amp { display:inline-block; font-weight:900; animation: nbAmpBeat 3.5s ease-in-out infinite 1s; }
    `;
    document.head.appendChild(s);
  }, []);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/60">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 font-bold text-accent shrink-0 group"
        >
          <img
            src="/logo.png"
            alt="Sức Khỏe & Đời Sống"
            className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover:scale-110"
          />
          <span className="hidden sm:inline font-bold tracking-wide text-sm leading-none">
            <span className="nb-p1">{t('brand.part1')}</span>
            <span className="nb-amp"> &amp; </span>
            <span className="nb-p2">{t('brand.part2')}</span>
          </span>
          <span className="sm:hidden font-bold tracking-wide text-xs leading-none">
            <span className="nb-p1">{t('brand.short')}</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {/* Home */}
          <Link
            to="/"
            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              isActive('/') && !isPillarActive
                ? 'text-accent bg-accent/8'
                : 'text-muted hover:text-text hover:bg-white/4'
            }`}
          >
            {t('nav.home')}
            {isActive('/') && !isPillarActive && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-accent rounded-full" />
            )}
          </Link>

          {/* 6 Pillars dropdown */}
          <div
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={startClose}
          >
            <Link
              to="/pillars"
              onClick={() => setPillarsOpen(false)}
              className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isPillarActive || location.pathname === '/pillars'
                  ? 'text-accent bg-accent/8'
                  : 'text-muted hover:text-text hover:bg-white/4'
              }`}
            >
              {(() => { const s = t('nav.pillars'); const i = s.lastIndexOf('360'); return i === -1 ? s : <>{s.slice(0,i)}<span className="sk360-num">360</span></>; })()}
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${pillarsOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              {isPillarActive && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-accent rounded-full" />
              )}
            </Link>

            {/* Dropdown panel */}
            {pillarsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 glass border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                <div className="p-2 grid grid-cols-2 gap-1">
                  {PILLARS.map((p) => {
                    const pillar = tPillars(p.key, { returnObjects: true });
                    const title  = pillar?.title || p.key;
                    const active = location.pathname.startsWith(p.to);
                    return (
                      <Link
                        key={p.to}
                        to={p.to}
                        onClick={() => setPillarsOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group ${
                          active
                            ? 'bg-accent/10 text-text'
                            : 'hover:bg-white/4 text-muted hover:text-text'
                        }`}
                      >
                        <span className="text-base shrink-0">{p.icon}</span>
                        <span className="font-medium leading-snug text-xs">{title}</span>
                        {active && <span className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${p.dot}`} />}
                      </Link>
                    );
                  })}
                </div>
                <div className="border-t border-border/50 px-3 py-2">
                  <Link
                    to="/#pillars"
                    onClick={() => setPillarsOpen(false)}
                    className="text-xs text-muted hover:text-accent transition-colors duration-150"
                  >
                    ↓ Xem tất cả trụ cột trên trang chủ
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Remaining nav links */}
          {NAV_LINKS.filter(l => l.to !== '/').map(({ key, to }) => (
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
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted hover:text-accent hover:border-accent/40 transition-all duration-200"
            aria-label="Toggle menu"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-b border-border/60 px-4 py-3 flex flex-col gap-1 animate-slide-down">
          {/* Home */}
          <Link
            to="/"
            onClick={closeMenu}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive('/') && !isPillarActive ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text hover:bg-white/4'
            }`}
          >
            {t('nav.home')}
          </Link>

          {/* Pillars collapsible */}
          <button
            onClick={() => setMobilePillars(!mobilePillars)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isPillarActive ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text hover:bg-white/4'
            }`}
          >
            <span>{(() => { const s = t('nav.pillars'); const i = s.lastIndexOf('360'); return i === -1 ? s : <>{s.slice(0,i)}<span className="sk360-num">360</span></>; })()}</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${mobilePillars ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {mobilePillars && (
            <div className="pl-4 flex flex-col gap-0.5 mb-1">
              {PILLARS.map((p) => {
                const pillar = tPillars(p.key, { returnObjects: true });
                const title  = pillar?.title || p.key;
                const active = location.pathname.startsWith(p.to);
                return (
                  <Link
                    key={p.to}
                    to={p.to}
                    onClick={closeMenu}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                      active ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text hover:bg-white/4'
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span className={`font-medium ${p.color}`}>{title}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Remaining links */}
          {NAV_LINKS.filter(l => l.to !== '/').map(({ key, to }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(to) ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text hover:bg-white/4'
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
