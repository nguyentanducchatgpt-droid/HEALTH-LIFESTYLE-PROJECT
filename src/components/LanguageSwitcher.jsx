import { useTranslation } from 'react-i18next';

const LANGS = ['vi', 'en', 'de'];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = (i18n.language || 'vi').slice(0, 2);

  return (
    <div className="flex gap-1">
      {LANGS.map((lang) => (
        <button
          key={lang}
          onClick={() => i18n.changeLanguage(lang)}
          className={`px-2 py-1 text-xs rounded font-semibold uppercase tracking-wide transition-colors ${
            current === lang
              ? 'bg-accent text-bg'
              : 'bg-border text-muted hover:text-accent hover:bg-border'
          }`}
          aria-label={`Switch to ${lang}`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
