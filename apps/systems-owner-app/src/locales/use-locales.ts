'use client';

import { useLocaleStore } from '../app/stores';
import { I18nLocale } from './i18n';

export function useLocales() {
  const locale: I18nLocale = useLocaleStore((state: any) => state.locale);
  const payload = {
    t: undefined,
    allLangs: [],
    currentLang: '',
    i18n: null,
  };
  // const { i18n, t, lng, supportedLngs } = locale;
  // const currentLang = lng;
  // const allLangs = supportedLngs;
  return {
    ...payload,
    ...locale,
  };
}
