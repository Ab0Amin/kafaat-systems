'use client';
import '../i18n/i18n';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { SnackbarProvider } from 'notistack';
import   '../i18n/i18n.client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { AUTH_STATUS } from './api/auth/auth.types';
import { routes } from './routes';


export default function App({ children }: { children: React.ReactNode }) {
   const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Handle authentication redirection
  useEffect(() => {

    // If user is not authenticated and trying to access a protected route, redirect to login
    if (status === AUTH_STATUS.UNAUTHENTICATED) {
      const currentRoute = Object.values(routes).find(route => route.path === pathname);
      if (currentRoute?.isProtected) {
        router.push(routes.login.path);
      }
    }

    // If user is authenticated and on login page, redirect to dashboard
    if (status === AUTH_STATUS.AUHTHENTICATED && pathname === routes.login.path) {
      router.push(routes.dashboard.path);
    }
  }, [status, pathname, router]);
  console.log('status', status);
  
  if ((status === AUTH_STATUS.LOADING || status === AUTH_STATUS.AUHTHENTICATED) && pathname === routes.login.path) {
    return <>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000} />
      </>;
  }

  return (
    <>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000} />
      <I18nextProvider i18n={i18n}>
        <div>{children}</div>
      </I18nextProvider>
    </>
  );
}