'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useTranslation } from 'react-i18next';
import styles from './page.module.scss';
import { routes } from '../routes';

export default function LoginPage() {
  const translationKey = 'auth';
  const { t } = useTranslation(translationKey);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t('invalidCredentials'));
      } else {
        router.push(routes.dashboard.path);
      }
    } catch (error: unknown) {
      setError(t('invalidCredentials'));
      console.error('Failed to create tenant:', error);

      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className={styles.loginContainer}>
        <Paper elevation={3} className={styles.paper}>
          <Box className={styles.iconContainer}>
            <LockOutlinedIcon className={styles.icon} />
          </Box>
          <Typography component="h1" variant="h5">
            {t('login')}
          </Typography>

          {error && (
            <Alert severity="error" className={styles.alert}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate className={styles.form}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('email')}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('password')}
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : t('signIn')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
