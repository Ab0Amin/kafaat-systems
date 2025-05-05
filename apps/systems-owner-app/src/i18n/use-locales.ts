'use client';

import { useTranslation } from 'react-i18next';

export function useLocales() {
  const { t, i18n, ready } = useTranslation();

  const currentLang = i18n.language;
  const allLangs = i18n.options.supportedLngs ?? [];

  return {
    t,
    i18n,
    ready,
    currentLang,
    allLangs,
  };
}
