import LogoutIcon from '@mui/icons-material/Logout';

import { createElement } from 'react';
import { signOut } from 'next-auth/react';

export type Routes = {
  [routeName: string]: Route;
};

export type Route = {
  path: string;
  isNavigationItem?: boolean;
  isProtected?: boolean;
  label?: string;
  action?: (args?: any) => void;
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

  dashboard: {
    path: '/dashboard',
    isProtected: true,
  },
  logOut: {
    label: 'Log Out',
    path: '/',
    isNavigationItem: true,
    action: () => signOut({ callbackUrl: '/' }),
  },
};
