'use client';

import { useTranslation } from 'react-i18next';
import { supportedLngs, localeDirections } from './i18n';

export function useLocales() {
  const { t, i18n, ready } = useTranslation();

  const currentLang = i18n.language;
  const currentDirection = localeDirections[currentLang] || 'ltr';
  const allLangs = supportedLngs;

  return {
    t,
    i18n,
    ready,
    currentLang,
    currentDirection,
    allLangs,
  };
}