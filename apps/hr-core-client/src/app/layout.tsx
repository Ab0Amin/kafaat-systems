'use client';

import './global.css';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import { useLocales } from '../i18n/use-locales';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { AuthProvider } from '../components/providers/AuthProvider';
import AppShell from '../components/app-shell/AppShell';
import '../i18n/i18n.client';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { currentLang, currentDirection } = useLocales();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = currentDirection;
      document.documentElement.lang = currentLang;
    }
  }, [currentLang, currentDirection]);

  return (
    <html lang={currentLang} dir={currentDirection}>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
