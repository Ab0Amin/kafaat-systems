import { create } from 'zustand';
import { I18nLocale } from '../i18n/i18n';

export interface LocaleState {
  locale: I18nLocale | null;
  setLocale: (locale: I18nLocale) => void;
}

export const useLocaleStore = create<LocaleState>(set => ({
  locale: null,
  setLocale: locale => set({ locale }),
}));
