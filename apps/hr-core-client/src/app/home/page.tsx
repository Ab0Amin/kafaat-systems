'use client';

import { useSession } from 'next-auth/react';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import styles from './page.module.scss';
import { AUTH_STATUS } from '../api/auth/auth.types';

export default function HomePage() {
  const { t } = useTranslation('hr');
  const { data: session, status } = useSession();

  if (status === AUTH_STATUS.LOADING) {
    return (
      <Box className={styles.loadingContainer}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (status === AUTH_STATUS.UNAUTHENTICATED) {
    return null; // Will be redirected by AppShell
  }

  const userName = session?.user?.name || 'User';

  return (
    <Box className={styles.container}>
      <Paper elevation={1} className={styles.welcomeCard}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('greeting', { name: userName })}
        </Typography>
      </Paper>

      <Grid container spacing={3} className={styles.dashboardGrid}>
        <Grid item xs={12} md={6} lg={4}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Employees
              </Typography>
              <Typography variant="h3" component="p">
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Departments
              </Typography>
              <Typography variant="h3" component="p">
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Positions
              </Typography>
              <Typography variant="h3" component="p">
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}