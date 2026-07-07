import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch',    flag: '🇩🇪' },
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
        <span className="text-base leading-none">{currentLang.flag}</span>
        <span className="hidden sm:inline text-muted text-sm">{currentLang.label}</span>
        <span
          className={`text-muted text-[10px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 glass border border-border-bright rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-in">
          <div className="p-1.5">
            {LANGS.map(({ code, label, flag }) => (
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
                <span className="text-lg leading-none shrink-0">{flag}</span>
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
