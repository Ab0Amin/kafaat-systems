'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import CryptoJS from 'crypto-js';
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
import { getSchema, routes } from '../routes';
import { useFormik } from 'formik';
import * as Yup from 'yup';
export default function LoginPage() {
  const translationKey = 'auth';
  const { t } = useTranslation(translationKey);
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setloading] = useState(false);
  let subdomain = getSchema();
  let loginFromMain = false;

  useEffect(() => {
    const secret = process.env.NEXT_PUBLIC_ENCRYPTION_KEY?.toString() || 'secretkey';
    const encryptedEmail = params.get('email');
    const encryptedPassword = params.get('password');
    if (encryptedEmail && encryptedPassword) {
      setloading(true);
      const bytesPassword = CryptoJS.AES.decrypt(encryptedPassword, secret);
      const password = bytesPassword.toString(CryptoJS.enc.Utf8);

      const bytes = CryptoJS.AES.decrypt(encryptedEmail, secret);
      const email = bytes.toString(CryptoJS.enc.Utf8);
      console.log(email);
      console.log(password);

      async function LoginWithData() {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
          subdomain,
        });
        if (result?.error) {
          setError(t('invalidCredentials'));
          return setloading(false);
        } else {
          router.push(routes.home.path);
          return setloading(false);
        }
      }
      LoginWithData();
    }
  }, []);
  console.log('test');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email(t('invalidEmail')).required(t('required')),
      password: Yup.string().min(8, t('minPassword')).required(t('required')),
    }),
    onSubmit: async values => {
      setError('');
      const email = values.email;
      const password = values.password;
      let herf = window.location.href;
      if (!subdomain && email) {
        loginFromMain = true;
        subdomain = values.email.split('@')[1].split('.')[0];
        if (subdomain) {
          const hostname = window.location.hostname;
          herf = herf.replace(hostname, subdomain + '.' + hostname);
          const secret = process.env.NEXT_PUBLIC_ENCRYPTION_KEY?.toString() || 'secretkey';

          const encryptedPassword = CryptoJS.AES.encrypt(password, secret).toString();
          const encryptedEmail = CryptoJS.AES.encrypt(email, secret).toString();

          location.assign(
            `${herf}?email=${encodeURIComponent(encryptedEmail)}&password=${encodeURIComponent(
              encryptedPassword
            )}`
          );
        }
      }
      if (!loginFromMain) {
        try {
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
            subdomain,
          });
          if (result?.error) {
            setError(t('invalidCredentials'));
          } else {
            router.push(routes.home.path);
          }
        } catch (error: unknown) {
          setError(t('invalidCredentials'));
          console.error('Login failed:', error);
        }
      }
    },
  });

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
          {loading ? (
            <>
              <CircularProgress size={24} />
            </>
          ) : (
            <Box component="form" onSubmit={formik.handleSubmit} noValidate className={styles.form}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('email')}
                name="email"
                autoComplete="email"
                autoFocus
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
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
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <Button type="submit" fullWidth variant="contained" className={styles.submitButton}>
                {formik.isSubmitting ? <CircularProgress size={24} /> : t('signIn')}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
