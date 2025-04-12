import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
import deJSON from './translations/de';
import arJSON from './translations/ar';
import locale from './translations/en';
import esJSON from './translations/es';
import frJSON from './translations/fr';
import trJSON from './translations/tr';
import plJSON from './translations/pl';
import ptBRJSON from './translations/pt_BR';
import { FlagComponent } from 'country-flag-icons/react/1x1';
import { BR, DE, ES, FR, PL, TR, US, SA } from 'country-flag-icons/react/3x2';

const resources = {
  de: { translation: deJSON },
  en: { translation: locale },
  es: { translation: esJSON },
  fr: { translation: frJSON },
  pl: { translation: plJSON },
  // ae: { translation: aeJSON },
  // cn: { translation: zhJSON },
  tr: { translation: trJSON },
  pt_br: { translation: ptBRJSON },
  ar: { translation: arJSON }
};

i18n
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    keySeparator: false,
    lng: 'en',
    fallbackLng: 'en',
    react: {
      useSuspense: true
    },
    interpolation: {
      escapeValue: false
    }
  });

export type SupportedLanguage =
  | 'DE'
  | 'EN'
  | 'FR'
  | 'TR'
  | 'ES'
  | 'PT_BR'
  | 'PL'
  | 'AR';

export const supportedLanguages: {
  code: string;
  label: string;
  Icon: FlagComponent;
}[] = [
  { code: 'en', label: 'English', Icon: US },
  { code: 'fr', label: 'French', Icon: FR },
  { code: 'es', label: 'Spanish', Icon: ES },
  { code: 'de', label: 'German', Icon: DE },
  { code: 'tr', label: 'Turkish', Icon: TR },
  { code: 'pt_br', label: 'Portuguese (Brazil)', Icon: BR },
  { code: 'pl', label: 'Polish', Icon: PL },
  { code: 'ar', label: 'Arabic', Icon: SA }
];
export default i18n;
