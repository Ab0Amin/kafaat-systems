'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AUTH_STATUS } from './api/auth/auth.types';
import { routes } from './routes';
import { CircularProgress, Box } from '@mui/material';
import styles from './page.module.scss';

export default function HomePage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === AUTH_STATUS.AUHTHENTICATED) {
      router.push(routes.dashboard.path);
    } else if (status === AUTH_STATUS.UNAUTHENTICATED) {
      router.push(routes.login.path);
    }
  }, [router, status]);

  // Show loading while checking authentication status
  return (
    <Box className={styles.loadingContainer}>
      <CircularProgress />
    </Box>
  );
}