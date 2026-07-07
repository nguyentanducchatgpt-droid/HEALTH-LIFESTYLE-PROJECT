import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* Inline SVG flags — no network requests, never blocked */
function FlagVI() {
  return (
    <svg viewBox="0 0 30 20" style={{ width: 22, height: 15, borderRadius: 2, display: 'block', flexShrink: 0 }}>
      <rect width="30" height="20" fill="#DA251D" />
      <polygon fill="#FFFF00" points="15,3.5 16.5,8.3 21.5,8.3 17.5,11.2 19,16 15,13.1 11,16 12.5,11.2 8.5,8.3 13.5,8.3" />
    </svg>
  );
}

function FlagEN() {
  return (
    <svg viewBox="0 0 60 30" style={{ width: 22, height: 11, borderRadius: 2, display: 'block', flexShrink: 0 }}>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function FlagDE() {
  return (
    <svg viewBox="0 0 5 3" style={{ width: 22, height: 13, borderRadius: 2, display: 'block', flexShrink: 0 }}>
      <rect width="5" height="1" y="0" fill="#000" />
      <rect width="5" height="1" y="1" fill="#DD0000" />
      <rect width="5" height="1" y="2" fill="#FFCE00" />
    </svg>
  );
}

const LANGS = [
  { code: 'vi', label: 'Tiếng Việt', Flag: FlagVI },
  { code: 'en', label: 'English',    Flag: FlagEN },
  { code: 'de', label: 'Deutsch',    Flag: FlagDE },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = (i18n.language || 'vi').slice(0, 2);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const currentLang = LANGS.find((l) => l.code === current) || LANGS[0];

  useEffect(() => {
    const onMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 bg-surface-2 border border-border hover:border-accent/40 text-text text-sm font-medium rounded-xl px-2 py-1 transition-all duration-200 hover:shadow-[0_0_14px_rgba(34,197,94,0.1)]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <currentLang.Flag />
        <span className="hidden sm:inline text-muted text-sm">{currentLang.label}</span>
        <span className={`text-muted text-[10px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 glass border border-border-bright rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-in">
          <div className="p-1.5">
            {LANGS.map(({ code, label, Flag }) => (
              <button
                key={code}
                role="option"
                aria-selected={current === code}
                onClick={() => { i18n.changeLanguage(code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-lg transition-all duration-150 ${
                  current === code
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'text-muted hover:text-text hover:bg-white/5'
                }`}
              >
                <Flag />
                <span>{label}</span>
                {current === code && (
                  <span className="ml-auto text-accent text-[10px] font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
