import { createI18nServer } from 'next-intl/server';
import { locales } from './config';

export const { getLocale, getMessages, getTranslations } = createI18nServer({
  locales,
  defaultLocale: 'en',
  getMessages: async (locale) => {
    return {
      ...await import(`./locales/${locale}/common.json`),
    };
  },
});