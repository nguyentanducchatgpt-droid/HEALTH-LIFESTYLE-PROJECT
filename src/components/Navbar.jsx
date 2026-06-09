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
  { key: 'nav.videos',  to: '/videos' },
  { key: 'nav.faq',     to: '/faq' },
  { key: 'nav.contact', to: '/contact' },
  { key: 'nav.donate',  to: '/donate' },
];

const PROGRAM_ITEMS = [
  { icon: '🌱', to: '/program?tab=7d',     hash: '7d',     labelKey: 'nav.p7d',     color: 'text-green-400',  dot: 'bg-green-400' },
  { icon: '📈', to: '/program?tab=12w',    hash: '12w',    labelKey: 'nav.p12w',    color: 'text-lime-400',   dot: 'bg-lime-400' },
  { icon: '🎓', to: '/program?tab=24w',    hash: '24w',    labelKey: 'nav.p24w',    color: 'text-purple-400', dot: 'bg-purple-400' },
  { icon: '🗺️', to: '/program?tab=sample', hash: 'sample', labelKey: 'nav.psample', color: 'text-teal-400',   dot: 'bg-teal-400' },
];

export default function Navbar() {
  const { t }           = useTranslation();
  const { t: tPillars } = useTranslation('pillars');
  const location        = useLocation();
  const [menuOpen,        setMenuOpen]        = useState(false);
  const [pillarsOpen,     setPillarsOpen]     = useState(false);
  const [programOpen,     setProgramOpen]     = useState(false);
  const [mobilePillars,   setMobilePillars]   = useState(false);
  const [mobileProgram,   setMobileProgram]   = useState(false);
  const closeTimer   = useRef(null);
  const programTimer = useRef(null);

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const isPillarActive  = PILLARS.some(p => location.pathname.startsWith(p.to));
  const isProgramActive = location.pathname.startsWith('/program');

  const closeMenu = () => { setMenuOpen(false); setMobilePillars(false); setMobileProgram(false); };

  const openDropdown  = () => { clearTimeout(closeTimer.current); setPillarsOpen(true); };
  const startClose    = () => { closeTimer.current = setTimeout(() => setPillarsOpen(false), 150); };

  const openProgram   = () => { clearTimeout(programTimer.current); setProgramOpen(true); };
  const startCloseP   = () => { programTimer.current = setTimeout(() => setProgramOpen(false), 150); };

  useEffect(() => {
    const id = 'nb-brand-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes nbReveal {
        from { opacity:0; letter-spacing:0.14em; transform:translateY(-4px); }
        to   { opacity:1; letter-spacing:normal;  transform:translateY(0); }
      }
      @keyframes nbSweep {
        0%   { left:-110%; opacity:0; }
        20%  { opacity:1; }
        80%  { opacity:1; }
        100% { left:110%; opacity:0; }
      }
      .nb-brand {
        position:relative;
        animation: nbReveal 0.55s cubic-bezier(0.25,0.46,0.45,0.94) both;
        animation-delay: 0.1s;
      }
      .nb-brand::after {
        content:'';
        position:absolute; top:0; bottom:0; width:30px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
        transform: skewX(-18deg);
        opacity:0; pointer-events:none;
        left:-110%;
      }
      .group:hover .nb-brand::after {
        animation: nbSweep 0.7s ease-in-out forwards;
      }
      .nb-p1  { color:#86efac; transition:color 0.25s, text-shadow 0.25s; }
      .nb-p2  { color:#5eead4; transition:color 0.25s, text-shadow 0.25s; }
      .nb-amp { color:#22c55e; font-weight:900; display:inline-block; transition:transform 0.2s; }
      .group:hover .nb-p1  { color:#bbf7d0; text-shadow:0 0 12px rgba(34,197,94,0.45); }
      .group:hover .nb-p2  { color:#99f6e4; text-shadow:0 0 12px rgba(20,184,166,0.45); }
      .group:hover .nb-amp { transform:scale(1.15); }
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
          <span className="nb-brand hidden sm:inline font-bold tracking-wide text-base leading-none overflow-hidden">
            <span className="nb-p1">{t('brand.part1')}</span>
            <span className="nb-amp"> &amp; </span>
            <span className="nb-p2">{t('brand.part2')}</span>
          </span>
          <span className="nb-brand sm:hidden font-bold tracking-wide text-base leading-none overflow-hidden">
            <span className="nb-p1">{t('brand.short')}</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {/* Home */}
          <Link
            to="/"
            className={`relative px-2 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
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
              className={`relative flex items-center gap-1 px-2 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
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
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-lg transition-all duration-150 group ${
                          active
                            ? 'bg-accent/10 text-text'
                            : 'hover:bg-white/4 text-muted hover:text-text'
                        }`}
                      >
                        <span className="text-lg shrink-0">{p.icon}</span>
                        <span className="font-medium leading-snug text-base">{title}</span>
                        {active && <span className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${p.dot}`} />}
                      </Link>
                    );
                  })}
                </div>
                <div className="border-t border-border/50 px-3 py-2">
                  <Link
                    to="/#pillars"
                    onClick={() => setPillarsOpen(false)}
                    className="text-base text-muted hover:text-accent transition-colors duration-150"
                  >
                    ↓ Xem tất cả trụ cột trên trang chủ
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Program dropdown */}
          <div
            className="relative"
            onMouseEnter={openProgram}
            onMouseLeave={startCloseP}
          >
            <Link
              to="/program"
              onClick={() => setProgramOpen(false)}
              className={`relative flex items-center gap-1 px-2 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                isProgramActive
                  ? 'text-accent bg-accent/8'
                  : 'text-muted hover:text-text hover:bg-white/4'
              }`}
            >
              {t('nav.program')}
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${programOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              {isProgramActive && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-accent rounded-full" />
              )}
            </Link>

            {programOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 glass border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                <div className="p-2 flex flex-col gap-0.5">
                  {PROGRAM_ITEMS.map((p) => {
                    const label  = t(p.labelKey);
                    const active = isProgramActive;
                    return (
                      <Link
                        key={p.hash}
                        to={p.to}
                        onClick={() => setProgramOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 hover:bg-white/4 text-muted hover:text-text"
                      >
                        <span className="text-lg shrink-0">{p.icon}</span>
                        <span className={`font-medium text-base leading-snug ${p.color}`}>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Remaining nav links */}
          {NAV_LINKS.filter(l => l.to !== '/').map(({ key, to }) => (
            <Link
              key={to}
              to={to}
              className={`relative px-2 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
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
            className={`px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
              isActive('/') && !isPillarActive ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text hover:bg-white/4'
            }`}
          >
            {t('nav.home')}
          </Link>

          {/* Pillars collapsible */}
          <button
            onClick={() => setMobilePillars(!mobilePillars)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
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
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-lg transition-all duration-150 ${
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

          {/* Program collapsible */}
          <button
            onClick={() => setMobileProgram(!mobileProgram)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
              isProgramActive ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text hover:bg-white/4'
            }`}
          >
            <span>{t('nav.program')}</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileProgram ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {mobileProgram && (
            <div className="pl-4 flex flex-col gap-0.5 mb-1">
              {PROGRAM_ITEMS.map((p) => (
                <Link
                  key={p.hash}
                  to={p.to}
                  onClick={closeMenu}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-lg transition-all duration-150 text-muted hover:text-text hover:bg-white/4"
                >
                  <span>{p.icon}</span>
                  <span className={`font-medium ${p.color}`}>{t(p.labelKey)}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Remaining links */}
          {NAV_LINKS.filter(l => l.to !== '/').map(({ key, to }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className={`px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
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
