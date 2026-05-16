import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import viCommon from './vi/common.json';
import viPillars from './vi/pillars.json';
import enCommon from './en/common.json';
import enPillars from './en/pillars.json';
import deCommon from './de/common.json';
import dePillars from './de/pillars.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: { common: viCommon, pillars: viPillars },
      en: { common: enCommon, pillars: enPillars },
      de: { common: deCommon, pillars: dePillars },
    },
    fallbackLng: 'vi',
    supportedLngs: ['vi', 'en', 'de'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    ns: ['common', 'pillars'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });

export default i18n;
