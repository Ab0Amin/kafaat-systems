import { Resource, ResourceLanguage, createInstance, i18n } from 'i18next';
import axios from 'axios';
import { TRANSLATIONS_API_URL } from 'src/config-global';

export interface CustomResourceKey {
  [key: string]: any;
}
export interface CustomResourceLanguage extends ResourceLanguage {
  [namespace: string]: CustomResourceKey;
}
export const TRANSLATIONS_STORAGE_KEY = 'translations';

export interface SupportedLanguages {
  name: string;
  language_code: string;
}
const initI18n = async () => {
  const i18nInstance = createInstance();

  const resources: Resource = await (await axios.get(TRANSLATIONS_API_URL('translations'))).data;
  const languages: ResourceLanguage[] = await (await axios.get(TRANSLATIONS_API_URL('languages'))).data.collection;
  const lng: string = (languages.find((lng) => lng.base_language)?.full_code as string) ?? 'en';
  const supportedLngs: SupportedLanguages[] = languages.map((language) => ({
    name: language.name as string,
    language_code: language.language_code as string,
  }));
  const supportedLngCodes: string[] = supportedLngs.map((language) => language.language_code);

  const nameSpaces: string[] = await (
    await axios.get(TRANSLATIONS_API_URL('namespaces'))
  ).data.collection.map((collection: any) => collection.title);

  await i18nInstance.init({
    lng,
    resources,
    fallbackLng: 'en',
    supportedLngs: supportedLngCodes,
    defaultNS: 'LOGIN',
    fallbackNS: 'LOGIN',
    ns: nameSpaces,
  });

  return {
    i18n: i18nInstance,
    supportedLngs,
    lng,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  };
};

export interface I18nLocale {
  i18n: i18n;
  supportedLngs: SupportedLanguages;
  lng: string;
  resources: Resource;
  t: i18n['t'];
}

export default async function initTranslations() {
  const data = await initI18n();
  return {
    ...data,
  };
}
