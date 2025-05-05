'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from './routes';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.push(routes.login.path);
  }, [router]);

  return null;
}
