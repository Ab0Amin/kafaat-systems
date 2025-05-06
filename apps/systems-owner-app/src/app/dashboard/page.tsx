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
      } catch (err: any) {
        console.error('Error fetching tenant stats:', err);
        if (err.response?.status === 401) {
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
  }, [session?.accessToken, t, commonT, router]);

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
      <Box className={styles.pageHeader}>
        <Typography variant="h4" className={styles.pageTitle}>
          {t('welcome')}
        </Typography>
        <Typography variant="body1" className={styles.pageDescription}>
          {t('dashboardDescription', 'View your tenant statistics and management overview')}
        </Typography>
      </Box>

      <Grid container spacing={3} className={styles.statsGrid}>
        <Grid item xs={12} sm={6} md={4}>
          <Box className={styles.statsCard}>
            <Typography variant="h6" color="primary" className={styles.statsTitle}>
              {t('stats')}
            </Typography>
            <Typography variant="h3" component="div" className={styles.statsValue}>
              {stats?.totalTenants || 0}
            </Typography>
            <Typography variant="body2" className={styles.statsLabel}>
              {t('totalTenants')}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box className={styles.statsCard}>
            <Typography variant="h6" color="success.main" className={styles.statsTitle}>
              {t('active')}
            </Typography>
            <Typography variant="h3" component="div" className={styles.statsValue}>
              {stats?.activeTenants || 0}
            </Typography>
            <Typography variant="body2" className={styles.statsLabel}>
              {t('activeTenants')}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box className={styles.statsCard}>
            <Typography variant="h6" color="error" className={styles.statsTitle}>
              {t('inactive')}
            </Typography>
            <Typography variant="h3" component="div" className={styles.statsValue}>
              {stats?.inactiveTenants || 0}
            </Typography>
            <Typography variant="body2" className={styles.statsLabel}>
              {t('inactiveTenants')}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Card className={styles.card}>
            <Box className={styles.cardHeader}>
              <Typography variant="h6" className={styles.cardTitle}>
                {t('tenantsByPlan')}
              </Typography>
            </Box>
            <Divider />
            <CardContent className={styles.cardContent}>
              <Grid container spacing={3}>
                {stats?.tenantsByPlan &&
                  Object.entries(stats.tenantsByPlan).map(([plan, count]) => (
                    <Grid item xs={6} sm={4} md={3} key={plan}>
                      <Box className={styles.planCard}>
                        <Typography variant="h6" className={styles.planTitle}>{plan}</Typography>
                        <Typography variant="h4" className={styles.planValue}>{count}</Typography>
                        <Typography variant="body2" className={styles.planLabel}>
                          {t('tenants')}
                        </Typography>
                      </Box>
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