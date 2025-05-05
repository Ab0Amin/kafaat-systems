import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

export interface CustomResourceKey {
  [key: string]: unknown;
}
export interface CustomResourceLanguage {
  [namespace: string]: CustomResourceKey;
}
export interface SupportedLanguages {
  name: string;
  language_code: string;
}

export const TRANSLATIONS_STORAGE_KEY = 'translations';

export const supportedLngs: SupportedLanguages[] = [
  { name: 'English', language_code: 'en' },
  { name: 'Arabic', language_code: 'ar' },
];

export const defaultLang = 'en';

export async function initTranslations() {
  const i18nInstance = createInstance()
    .use(initReactI18next)
    .use(resourcesToBackend((lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`)));

  await i18nInstance.init({
    lng: defaultLang,
    fallbackLng: defaultLang,
    supportedLngs: supportedLngs.map(l => l.language_code),

    defaultNS: 'common',
    fallbackNS: 'common',
    ns: ['common', 'login', 'dashboard'],
  });

  return {
    i18n: i18nInstance,
    supportedLngs,
    lng: i18nInstance.language,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  };
}

export type I18nLocale = Awaited<ReturnType<typeof initTranslations>>;

export * from './use-locales';
