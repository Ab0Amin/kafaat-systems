import { DefaultSession } from 'next-auth';
import 'next-auth';

export interface Session extends DefaultSession {
  jwtPayload: string;
  username: string;
  user: {
    _id: string;
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
}
// next-auth.d.ts

declare module 'next-auth' {
  interface Session {
    jwtPayload: string;
    accessToken: string;

    username: string;
    user: {
      _id: string;
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    };
  }
}

export enum COOKIE {
  IS_FIRST_TIME_VISITOR = 'is-first-time-visitor',
}

export enum AUTH_STATUS {
  UNAUTHENTICATED = 'unauthenticated',
  AUHTHENTICATED = 'authenticated',
  LOADING = 'loading',
}
