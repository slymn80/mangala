import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import tr from './locales/tr.json';
import kk from './locales/kk.json';
import en from './locales/en.json';
import ru from './locales/ru.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: tr },
      kk: { translation: kk },
      en: { translation: en },
      ru: { translation: ru }
    },
    lng: 'tr',
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
