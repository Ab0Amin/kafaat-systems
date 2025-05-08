'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { routes } from './routes';
import { AUTH_STATUS } from './api/auth/auth.types';
import styles from './page.module.scss';

export default function Index() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === AUTH_STATUS.AUHTHENTICATED) {
      router.push(routes.home.path);
    } else if (status === AUTH_STATUS.UNAUTHENTICATED) {
      router.push(routes.login.path);
    }
  }, [status, router]);

  return (
    <Box className={styles.container}>
      <CircularProgress size={40} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Loading...
      </Typography>
    </Box>
  );
}
