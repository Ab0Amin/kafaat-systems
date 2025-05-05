'use client';
import '../i18n/i18n';

import { I18nextProvider } from 'react-i18next';
import { useLocaleStore } from './stores';
import { useEffect, useState } from 'react';
import { SnackbarProvider } from 'notistack';
import {
  TRANSLATIONS_STORAGE_KEY,
  CustomResourceLanguage,
  initTranslations,
  I18nLocale,
} from '../i18n/i18n';
import { storage } from '../utils/storage.util';
// import { useSession } from 'next-auth/react';
import { AUTH_STATUS } from './api/auth/auth.types';

export let TRANSLATIONS: CustomResourceLanguage | null = {};

export default function App({ children }: { children: React.ReactNode }) {
  const setLocale = useLocaleStore((s) => s.setLocale);
  const locale = useLocaleStore((s) => s.locale) as I18nLocale | null;
  const [i18n, setI18n] = useState<I18nLocale['i18n']>();
//   const { status } = useSession();

  useEffect(() => {
    (async () => {
      if (!locale) {
        const data = await initTranslations();
        setLocale(data);
        setI18n(data.i18n);

        const translations = data.resources[data.lng] as CustomResourceLanguage;
        storage.set(TRANSLATIONS_STORAGE_KEY, translations);
        TRANSLATIONS = translations;
        
      } else {
        setI18n(locale.i18n);
      }
    })();
  }, [locale, setLocale]);

  if (!i18n) return null;

  return (
    <>
      <SnackbarProvider />
      <I18nextProvider i18n={i18n}>
        {/* {status === AUTH_STATUS.AUHTHENTICATED */}
          {/* ? */}
           <div>{children}</div>
          {/* : <>{children}</> */}
        {/* } */}
      </I18nextProvider>
    </>
  );
}
