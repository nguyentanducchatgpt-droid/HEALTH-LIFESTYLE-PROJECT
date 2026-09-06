import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import viCommon from './vi/common.json';
import viPillars from './vi/pillars.json';
import viPrograms from './vi/programs.json';
import viMind from './vi/mind.json';
import viTools from './vi/tools.json';
import enCommon from './en/common.json';
import enPillars from './en/pillars.json';
import enPrograms from './en/programs.json';
import enMind from './en/mind.json';
import enTools from './en/tools.json';
import deCommon from './de/common.json';
import dePillars from './de/pillars.json';
import dePrograms from './de/programs.json';
import deMind from './de/mind.json';
import deTools from './de/tools.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: { common: viCommon, pillars: viPillars, programs: viPrograms, mind: viMind, tools: viTools },
      en: { common: enCommon, pillars: enPillars, programs: enPrograms, mind: enMind, tools: enTools },
      de: { common: deCommon, pillars: dePillars, programs: dePrograms, mind: deMind, tools: deTools },
    },
    fallbackLng: 'vi',
    supportedLngs: ['vi', 'en', 'de'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    ns: ['common', 'pillars', 'programs', 'mind', 'tools'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    returnNull: false,
    returnEmptyString: false,
  });

export default i18n;
