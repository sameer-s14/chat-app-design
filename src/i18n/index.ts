import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './en.json';
import { LANGUAGES } from '../constants';
export const i18Next = () =>
    i18n.use(initReactI18next).init({
        // debug: true,
        fallbackLng: LANGUAGES.EN,
        supportedLngs: [LANGUAGES.EN],
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: enTranslation,
            },
        },
    });