// src/i18n/i18n.ts

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

export const namespaces = ['common', 'auth', 'hr'];

export const localeDirections: Record<string, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
};