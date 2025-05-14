'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import axios from 'axios';
import styles from './page.module.scss';
import { routes } from '../routes';

export default function SetPasswordPage() {
  const translationKey = 'auth';
  const { t } = useTranslation(translationKey);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setError(t('invalidToken'));
        return;
      }

      try {
        const result = await axios.post('/api/auth/validate-token', { token });
        console.log(result);

        if (result) {
          setValidToken(true);
        }
      } catch (err) {
        setError(t('expiredOrInvalidToken'));
      }
    };

    checkToken();
  }, [token, t]);

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!token) {
      setError(t('invalidToken'));
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError(t('passwordRequirements'));
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      setLoading(false);
      return;
    }

    try {
      await axios.post(`/api/auth/set-password`, {
        token,
        password,
        confirmPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(routes.login.path);
      }, 3000);
    } catch (error) {
      console.error('Failed to set password:', error);
      setError(t('invalidToken'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      {validToken ? (
        <Box className={styles.container}>
          <Paper elevation={3} className={styles.paper}>
            <Box className={styles.iconContainer}>
              <LockOutlinedIcon className={styles.icon} />
            </Box>
            <Typography component="h1" variant="h5">
              {t('setPasswordTitle')}
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
              {t('setPasswordDescription')}
            </Typography>

            {error && (
              <Alert severity="error" className={styles.alert}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" className={styles.alert}>
                {t('passwordSetSuccess')}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate className={styles.form}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t('password')}
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={!token || success}
                helperText={t('passwordRequirements')}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label={t('confirmPassword')}
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                disabled={!token || success}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={styles.submitButton}
                disabled={loading || !token || success}
              >
                {loading ? <CircularProgress size={24} /> : t('submit')}
              </Button>
            </Box>
          </Paper>
        </Box>
      ) : (
        <>this link has expired</>
      )}
    </Container>
  );
}
