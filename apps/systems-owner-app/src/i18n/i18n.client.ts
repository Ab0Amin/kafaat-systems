// src/i18n/i18n.client.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { supportedLngs, defaultLang, namespaces, localeDirections } from './i18n';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(resourcesToBackend((lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`)))
    .init({
      lng:
        typeof window !== 'undefined'
          ? localStorage.getItem('i18nextLng') || defaultLang
          : defaultLang,
      fallbackLng: defaultLang,
      supportedLngs: supportedLngs.map(l => l.language_code),
      ns: namespaces,
      defaultNS: 'common',
      fallbackNS: 'common',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

  // if (typeof document !== 'undefined') {
  //   const direction = localeDirections[i18n.language] || 'ltr';
  //   document.documentElement.dir = direction;
  //   document.documentElement.lang = i18n.language;
  // }
}

export default i18n;
