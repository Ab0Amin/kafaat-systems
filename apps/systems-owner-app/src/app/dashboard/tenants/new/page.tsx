'use client';

import { useState } from 'react';
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
} from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

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

export default function NewTenantPage() {
  const {t} = useTranslation('tenants');
  const {t:commonT} = useTranslation('common');
  const router = useRouter();

  const [formData, setFormData] = useState<TenantFormData>({
    name: '',
    domain: '',
    plan: 'starter',
    maxUsers: 200,
    contactPhone: '',
    admin: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const plans = [
    { value: 'starter', label: 'Starter' },
    { value: 'premium', label: 'Premium' },
    { value: 'enterprise', label: 'Enterprise' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'admin') {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: value,
          },
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.domain) newErrors.domain = 'Domain is required';
    if (!formData.admin.firstName) newErrors['admin.firstName'] = 'Admin first name is required';
    if (!formData.admin.lastName) newErrors['admin.lastName'] = 'Admin last name is required';
    if (!formData.admin.email) {
      newErrors['admin.email'] = 'Admin email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.admin.email)) {
      newErrors['admin.email'] = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      const response = await axios.post('/api/owner/tenants', formData);
      
      setSubmitSuccess(true);
      
      // Redirect to tenants list after a short delay
      setTimeout(() => {
        router.push('/dashboard/tenants');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error creating tenant:', error);
      setSubmitError(error.response?.data?.details || 'Failed to create tenant');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/tenants');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('add')}
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Tenant created successfully!
          </Alert>
        )}
        
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid 
            >
              <Typography variant="h6">{t('title')}</Typography>
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
            
            <Grid >
              <TextField
                fullWidth
                select
                label={t('plan')}
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                disabled={submitting}
              >
                {plans.map((plan) => (
                  <MenuItem key={plan.value} value={plan.value}>
                    {plan.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid >
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
            
            <Grid >
              <TextField
                fullWidth
                label={t('contactPhone')}
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                disabled={submitting}
              />
            </Grid>
            
            <Grid >
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">{t('adminInfo')}</Typography>
            </Grid>
            
            <Grid >
              <TextField
                fullWidth
                label={t('adminFirstName')}
                name="admin.firstName"
                value={formData.admin.firstName}
                onChange={handleChange}
                error={!!errors['admin.firstName']}
                helperText={errors['admin.firstName']}
                disabled={submitting}
                required
              />
            </Grid>
            
            <Grid >
              <TextField
                fullWidth
                label={t('adminLastName')}
                name="admin.lastName"
                value={formData.admin.lastName}
                onChange={handleChange}
                error={!!errors['admin.lastName']}
                helperText={errors['admin.lastName']}
                disabled={submitting}
                required
              />
            </Grid>
            
            <Grid >
              <TextField
                fullWidth
                label={t('adminEmail')}
                name="admin.email"
                type="email"
                value={formData.admin.email}
                onChange={handleChange}
                error={!!errors['admin.email']}
                helperText={errors['admin.email']}
                disabled={submitting}
                required
              />
            </Grid>
            
            <Grid >
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{ mr: 2 }}
                  disabled={submitting}
                >
                  {commonT('cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                >
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