'use client';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { SnackbarProvider } from 'notistack';
import   '../i18n/i18n.client';


export default function App({ children }: { children: React.ReactNode }) {
 
  return (
    <>
      <SnackbarProvider />
      <I18nextProvider i18n={i18n}>
           <div>{children}</div>
      </I18nextProvider>
    </>
  );
}
