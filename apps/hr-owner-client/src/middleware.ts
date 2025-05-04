import { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './app/i18n/config';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return token?.role === 'owner';
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export default function middleware(req: NextRequest) {
  const publicPatterns = ['/login', '/api/auth(.*)'];
  const isPublicPage = publicPatterns.some((pattern) => {
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(req.nextUrl.pathname);
  });

  if (isPublicPage) {
    return intlMiddleware(req);
  }

  return authMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};