import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = (i18n.language || 'vi').slice(0, 2);

  return (
    <div className="relative">
      <select
        value={current}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="appearance-none bg-surface border border-border text-text text-xs font-medium rounded-lg pl-3 pr-7 py-1.5 cursor-pointer hover:border-accent focus:border-accent focus:outline-none transition-colors"
        aria-label="Select language"
      >
        {LANGS.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted text-xs select-none">▾</span>
    </div>
  );
}
