import { signOut } from 'next-auth/react';

export type Routes = {
  [routeName: string]: Route;
};

export function extractSubdomainFromHost(host: string): string {
  if (!host) return '';

  const parts = host.split('.');

  if (parts.length >= 2) {
    return parts[0];
  }

  return '';
}

export function getSchema(): string {
  if (typeof window === 'undefined') return 'default';

  const hostname = window.location.hostname;

  const parts = hostname.split('.');

  if (parts.length >= 2) {
    return parts[0]; // subdomain
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
