import { I18nLocale } from '../locales/i18n';
import { create } from 'zustand';

export interface LocaleState {
  locale: I18nLocale;
}

export const useLocaleStore = create(set => ({
  locale: null,
  setLocale: (locale: I18nLocale) => set((state: LocaleState) => ({ locale })),
}));
