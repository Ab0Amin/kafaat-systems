'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import axios, { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

interface TenantFormData {
  id: number;
  name: string;
  domain: string;
  schema_name: string;
  isActive: boolean;
  plan: string;
  maxUsers: number;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditTenantPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation('tenants');
  const { t: commonT } = useTranslation('common');
  const router = useRouter();
  const { id } = params;

  const [formData, setFormData] = useState<TenantFormData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const plans = [
    { value: 'starter', label: 'Starter' },
    { value: 'premium', label: 'Premium' },
    { value: 'enterprise', label: 'Enterprise' },
  ];

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/owner/tenants/${id}`);
        setFormData(response.data.tenant);
      } catch (err) {
        console.error('Error fetching tenant:', err);
        setFetchError('Failed to load tenant data');
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    if (!formData) return false;

    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.domain) newErrors.domain = 'Domain is required';
    if (!formData.contactEmail) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !formData) return;

    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      await axios.put(`/owner/tenants/${id}`, formData);

      setSubmitSuccess(true);

      // Redirect to tenants list after a short delay
      setTimeout(() => {
        router.push('/dashboard/tenants');
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Failed to update tenant'
          : 'Failed to update tenant';
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/tenants');
  };

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

  if (fetchError) {
    return (
      <Box>
        <Alert severity="error">{fetchError}</Alert>
        <Button
          variant="contained"
          onClick={() => router.push('/dashboard/tenants')}
          sx={{ mt: 2 }}
        >
          {t('list')}
        </Button>
      </Box>
    );
  }

  if (!formData) {
    return (
      <Box>
        <Alert severity="error">Tenant not found</Alert>
        <Button
          variant="contained"
          onClick={() => router.push('/dashboard/tenants')}
          sx={{ mt: 2 }}
        >
          {t('list')}
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('edit')}
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Tenant updated successfully!
          </Alert>
        )}

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{t('title')}</Typography>
                <Chip
                  label={formData.isActive ? t('active') : t('inactive')}
                  color={formData.isActive ? 'success' : 'error'}
                />
              </Box>
            </Grid>

            <Grid>
              <TextField
                fullWidth
                label={t('name')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                disabled={submitting}
                required
              />
            </Grid>

            <Grid>
              <TextField
                fullWidth
                label={t('domain')}
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                error={!!errors.domain}
                helperText={errors.domain}
                disabled={submitting}
                required
              />
            </Grid>

            <Grid>
              <TextField
                fullWidth
                select
                label={t('plan')}
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                disabled={submitting}
              >
                {plans.map(plan => (
                  <MenuItem key={plan.value} value={plan.value}>
                    {plan.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid>
              <TextField
                fullWidth
                type="number"
                label={t('maxUsers')}
                name="maxUsers"
                value={formData.maxUsers}
                onChange={handleChange}
                disabled={submitting}
              />
            </Grid>

            <Grid>
              <TextField
                fullWidth
                label={t('schema')}
                name="schema_name"
                value={formData.schema_name}
                disabled={true}
              />
            </Grid>

            <Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Contact Information</Typography>
            </Grid>

            <Grid>
              <TextField
                fullWidth
                label={t('contactEmail')}
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                error={!!errors.contactEmail}
                helperText={errors.contactEmail}
                disabled={submitting}
                required
              />
            </Grid>

            <Grid>
              <TextField
                fullWidth
                label={t('contactPhone')}
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                disabled={submitting}
              />
            </Grid>

            <Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{ mr: 2 }}
                  disabled={submitting}
                >
                  {commonT('cancel')}
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                  {submitting ? <CircularProgress size={24} /> : commonT('save')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
