import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import viCommon from './vi/common.json';
import viPillars from './vi/pillars.json';
import viPrograms from './vi/programs.json';
import viMind from './vi/mind.json';
import enCommon from './en/common.json';
import enPillars from './en/pillars.json';
import enPrograms from './en/programs.json';
import enMind from './en/mind.json';
import deCommon from './de/common.json';
import dePillars from './de/pillars.json';
import dePrograms from './de/programs.json';
import deMind from './de/mind.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: { common: viCommon, pillars: viPillars, programs: viPrograms, mind: viMind },
      en: { common: enCommon, pillars: enPillars, programs: enPrograms, mind: enMind },
      de: { common: deCommon, pillars: dePillars, programs: dePrograms, mind: deMind },
    },
    fallbackLng: 'vi',
    supportedLngs: ['vi', 'en', 'de'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    ns: ['common', 'pillars', 'programs', 'mind'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    returnNull: false,
    returnEmptyString: false,
  });

export default i18n;
