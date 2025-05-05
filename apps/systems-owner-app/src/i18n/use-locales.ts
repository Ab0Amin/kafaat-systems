'use client';

import { useTranslation } from 'react-i18next';
import { supportedLngs } from './i18n';
import { i18n, TFunction } from 'i18next';

interface UseLocalesResult {
  t: TFunction;
  i18n: i18n;
  ready: boolean;
  currentLang: string;
  allLangs: typeof supportedLngs;
}

export function useLocales(): UseLocalesResult {
  const { t, i18n, ready } = useTranslation();

  const currentLang = i18n.language;
  // const allLangs = i18n.options.supportedLngs ?? [];
  const allLangs = supportedLngs;
  return {
    t,
    i18n,
    ready,
    currentLang,
    allLangs,
  };
}
