import { createI18nClient } from 'next-intl/client';
import { locales } from './config';

export const { useLocale, useTranslations, useMessages } = createI18nClient({
  locales,
});