// File: NewTenantForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import styles from './page.module.scss';

interface TenantFormData {
  name: string;
  domain: string;
  plan: string;
  maxUsers: number;
  contactPhone: string;
  admin: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const plans = [
  { value: 'starter', labelKey: 'plans.starter' },
  { value: 'premium', labelKey: 'plans.premium' },
  { value: 'enterprise', labelKey: 'plans.enterprise' },
];

export default function NewTenantForm() {
  const { t } = useTranslation(['tenant', 'common']);
  const router = useRouter();

  const [formData, setFormData] = useState<TenantFormData>({
    name: '',
    domain: '',
    plan: 'starter',
    maxUsers: 200,
    contactPhone: '',
    admin: { firstName: '', lastName: '', email: '' },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'maxUsers') {
      setFormData({ ...formData, maxUsers: Number(value) });
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.') as [keyof TenantFormData, string];
      setFormData({
        ...formData,
        [parent]: { ...(formData[parent] as Record<string, string>), [child]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = t('errors.nameRequired');
    if (!formData.domain) newErrors.domain = t('errors.domainRequired');
    if (!formData.admin.firstName)
      newErrors['admin.firstName'] = t('errors.adminFirstNameRequired');
    if (!formData.admin.lastName) newErrors['admin.lastName'] = t('errors.adminLastNameRequired');
    if (!formData.admin.email) {
      newErrors['admin.email'] = t('errors.adminEmailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.admin.email)) {
      newErrors['admin.email'] = t('errors.invalidEmail');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);

    if (!validateForm()) return;
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      await axios.post('/api/owner/tenants', formData);
      setSubmitSuccess(true);
      setTimeout(() => router.push('/dashboard/tenants'), 2000);
    } catch (error: any) {
      setSubmitError(error.response?.data?.details || t('errors.createFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.heading}>
        {t('add')}
      </Typography>

      <Paper className={styles.formWrapper}>
        {submitSuccess && (
          <Alert severity="success" className={styles.alert}>
            {t('success.created')}
          </Alert>
        )}
        {submitError && (
          <Alert severity="error" className={styles.alert}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label={t('name')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              className={styles.inputGroup}
            />
            <TextField
              fullWidth
              label={t('domain')}
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              error={!!errors.domain}
              helperText={errors.domain}
              className={styles.inputGroup}
            />
            <TextField
              select
              fullWidth
              label={t('plan')}
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              className={styles.inputGroup}
            >
              {plans.map(p => (
                <MenuItem key={p.value} value={p.value}>
                  {t(p.labelKey)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              type="number"
              label={t('maxUsers')}
              name="maxUsers"
              value={Number(formData.maxUsers)}
              onChange={handleChange}
              className={styles.inputGroup}
            />
            <TextField
              fullWidth
              label={t('contactPhone')}
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className={styles.inputGroup}
            />

            <Divider className={styles.sectionDivider} />
            <Typography variant="h6" className={styles.sectionTitle}>
              {t('adminInfo')}
            </Typography>

            <TextField
              fullWidth
              label={t('adminFirstName')}
              name="admin.firstName"
              value={formData.admin.firstName}
              onChange={handleChange}
              error={!!errors['admin.firstName']}
              helperText={errors['admin.firstName']}
              className={styles.inputGroup}
            />
            <TextField
              fullWidth
              label={t('adminLastName')}
              name="admin.lastName"
              value={formData.admin.lastName}
              onChange={handleChange}
              error={!!errors['admin.lastName']}
              helperText={errors['admin.lastName']}
              className={styles.inputGroup}
            />
            <TextField
              fullWidth
              label={t('adminEmail')}
              name="admin.email"
              value={formData.admin.email}
              onChange={handleChange}
              error={!!errors['admin.email']}
              helperText={errors['admin.email']}
              className={styles.inputGroup}
            />

            <Box className={styles.actions}>
              <Button
                variant="outlined"
                onClick={() => router.push('/dashboard/tenants')}
                disabled={submitting}
              >
                {t('common:cancel')}
              </Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? <CircularProgress size={20} /> : t('common:save')}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
