'use client';

import './global.scss';
import '../locales/i18n';
import { I18nextProvider } from 'react-i18next';
import { useLocaleStore } from './stores';
import { useEffect, useState } from 'react';
import { i18n } from 'i18next';
import { useSuspenseQuery } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { fetchTranslations } from './app.query';
import { storage } from 'src/utils/storage.util';
import { CustomResourceLanguage, TRANSLATIONS_STORAGE_KEY } from '../locales/i18n';
import { useSession } from 'next-auth/react';
import { AUTH_STATUS } from './api/auth/auth.types';

export let TRANSLATIONS: CustomResourceLanguage | null = {};

export default function App({ children }: { children: React.ReactNode }) {
  const { data } = useSuspenseQuery({
    queryKey: ['fetchTranslations'],
    queryFn: () => fetchTranslations(),
    refetchOnWindowFocus: false,
    //enabled: status === 'authenticated' && !!(data?.user as User)?._id,
  });
  const setLocale = useLocaleStore((state: any) => state.setLocale);
  const locale = useLocaleStore((state: any) => state.locale);
  const [i18n, setI18n] = useState<i18n>();
  const { status } = useSession();

  useEffect(() => {
    if (data && !locale) {
      setLocale(data);
    } else if (locale) {
      const { i18n, resources, lng } = locale;
      setI18n(i18n);

      const translations = resources[lng] as CustomResourceLanguage;
      storage.set(TRANSLATIONS_STORAGE_KEY, translations);
      TRANSLATIONS = storage.get(TRANSLATIONS_STORAGE_KEY);
    }
  }, [data, locale, setLocale]);

  return (
    <>
      <SnackbarProvider />
      {i18n && (
        <I18nextProvider i18n={i18n}>
          {status === AUTH_STATUS.AUHTHENTICATED && <div>{children}</div>}
          {status === AUTH_STATUS.UNAUTHENTICATED && <> {children}</>}
        </I18nextProvider>
      )}
    </>
  );
}
