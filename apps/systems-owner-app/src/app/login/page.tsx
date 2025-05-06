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
    } catch (error) {
      setError(t('invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className={styles.loginContainer}>
        <Paper elevation={0} className={styles.paper}>
          <Box className={styles.iconContainer}>
            <LockOutlinedIcon className={styles.icon} />
          </Box>
          <Typography component="h1" variant="h4" className={styles.title}>
            {t('login')}
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            {t('loginSubtitle', 'Enter your credentials to access the systems owner dashboard')}
          </Typography>

          {error && (
            <Alert severity="error" className={styles.alert}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate className={styles.form}>
            <Box className={styles.inputField}>
              <Typography variant="subtitle2" className={styles.inputLabel}>
                {t('email')}
              </Typography>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder', 'Enter your email address')}
                variant="outlined"
                size="medium"
                InputProps={{
                  sx: { borderRadius: '8px' }
                }}
              />
            </Box>
            <Box className={styles.inputField}>
              <Typography variant="subtitle2" className={styles.inputLabel}>
                {t('password')}
              </Typography>
              <TextField
                required
                fullWidth
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder', 'Enter your password')}
                variant="outlined"
                size="medium"
                InputProps={{
                  sx: { borderRadius: '8px' }
                }}
              />
            </Box>
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