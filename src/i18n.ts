import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru';
import uz from './locales/uz';

const resources = {
  uz: {
    translation: uz,
  },
  ru: {
    translation: ru,
  },
};

const savedLanguage = localStorage.getItem('lang');
const defaultLanguage = savedLanguage || 'uz';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: ['uz', 'ru'],
    interpolation: {
      escapeValue: false,
    },
    debug: import.meta.env.DEV,
    returnEmptyString: false,
    returnObjects: false,
  })
  .then();

export default i18n;
