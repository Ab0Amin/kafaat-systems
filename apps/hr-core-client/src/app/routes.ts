import { signOut } from 'next-auth/react';

export type Routes = {
  [routeName: string]: Route;
};

export function getSchema(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    return parts.length > 1 ? parts[0] : 'default';
  }
  return '';
}

export function getApiUrl(schema: string): string {
  if (schema) {
    return `http://${schema}.${process.env.BE_HOST}:${process.env.BE_PORT}/api`;
  } else {
    return `http://${process.env.BE_HOST}:${process.env.BE_PORT}/api`;
  }
}

export type Route = {
  path: string;
  isNavigationItem?: boolean;
  isProtected?: boolean;
  label?: string;
  action?: (args?: string) => void;
};

export const routes: Routes = {
  index: {
    path: '/',
  },
  error: {
    path: '/error',
  },
  login: {
    path: '/login',
  },
  setPassword: {
    path: '/set-password',
  },
  home: {
    path: '/home',
    isProtected: true,
  },
  logOut: {
    label: 'Log Out',
    path: '/',
    isNavigationItem: true,
    action: () => signOut({ callbackUrl: '/' }),
  },
};