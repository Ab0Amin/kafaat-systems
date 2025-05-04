'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';
import axios from 'axios';

interface TenantStats {
  totalTenants: number;
  activeTenants: number;
  inactiveTenants: number;
  tenantsByPlan: Record<string, number>;
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { data: session } = useSession();
  const [stats, setStats] = useState<TenantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/owner/stats', {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching tenant stats:', err);
        setError('Failed to load tenant statistics');
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchStats();
    }
  }, [session]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
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

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              {t('stats')}
            </Typography>
            <Typography variant="h3" component="div">
              {stats?.totalTenants || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Tenants
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography variant="h6" color="success.main" gutterBottom>
              Active
            </Typography>
            <Typography variant="h3" component="div">
              {stats?.activeTenants || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Tenants
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              Inactive
            </Typography>
            <Typography variant="h3" component="div">
              {stats?.inactiveTenants || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Inactive Tenants
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Tenants by Plan" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {stats?.tenantsByPlan &&
                  Object.entries(stats.tenantsByPlan).map(([plan, count]) => (
                    <Grid item xs={12} sm={6} md={4} key={plan}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="h6">{plan}</Typography>
                        <Typography variant="h4">{count}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tenants
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