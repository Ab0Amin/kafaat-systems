'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import styles from './page.module.scss';
import { routes } from '../routes';
import { AUTH_STATUS } from '../api/auth/auth.types';

interface TenantStats {
  totalTenants: number;
  activeTenants: number;
  inactiveTenants: number;
  tenantsByPlan: Record<string, number>;
}

export default function DashboardPage() {
  const { t } = useTranslation('dashboard');
  const { t: commonT } = useTranslation('common');
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<TenantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === AUTH_STATUS.UNAUTHENTICATED) {
      router.push(routes.login.path);
    }
  }, [status, router]);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/owner/stats`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        setStats(response.data);
      } catch (err: unknown) {
        console.error('Error fetching tenant stats:', err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setError(t('unauthorized'));
          // Redirect to login after unauthorized error
          setTimeout(() => {
            router.push(routes.login.path);
          }, 2000);
        } else {
          setError(commonT('error.failedToLoad'));
        }
      } finally {
        setLoading(false);
      }
    };

    if (session && session.accessToken) {
      fetchStats();
    }
  }, [session, session?.accessToken, t, commonT, router]);

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('welcome')}
      </Typography>

      <Grid container spacing={3} className={styles.statsGrid}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper elevation={3} className={styles.statsCard}>
            <Typography variant="h6" color="primary" gutterBottom>
              {t('stats')}
            </Typography>
            <Typography variant="h3" component="div">
              {stats?.totalTenants || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('totalTenants')}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper elevation={3} className={styles.statsCard}>
            <Typography variant="h6" color="success.main" gutterBottom>
              {t('active')}
            </Typography>
            <Typography variant="h3" component="div">
              {stats?.activeTenants || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('activeTenants')}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper elevation={3} className={styles.statsCard}>
            <Typography variant="h6" color="error" gutterBottom>
              {t('inactive')}
            </Typography>
            <Typography variant="h3" component="div">
              {stats?.inactiveTenants || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('inactiveTenants')}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title={t('tenantsByPlan')} />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {stats?.tenantsByPlan &&
                  Object.entries(stats.tenantsByPlan).map(([plan, count]) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={plan}>
                      <Paper elevation={2} className={styles.planCard}>
                        <Typography variant="h6">{plan}</Typography>
                        <Typography variant="h4">{count}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('tenants')}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
