export const defaultLocale = 'en';
export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const localeNames = {
  en: 'English',
  ar: 'العربية',
};

export const localeDirections = {
  en: 'ltr',
  ar: 'rtl',
};