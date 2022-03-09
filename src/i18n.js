import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales/index.js';

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    debug: true,
  });

export default i18n;
