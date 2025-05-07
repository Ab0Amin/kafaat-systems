'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Box, Typography, Button, Paper, CircularProgress, Alert, Stack } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import TenantsTable from '../../../components/tenantTable/TenantTable';
import PopupDialog from '../../../components/PopupDialog/PopupDialog';
import { Tenant } from '../../../types/types';
import AutorenewIcon from '@mui/icons-material/Autorenew';
export default function TenantsPage() {
  const { t } = useTranslation('tenant');
  const { t: commonT } = useTranslation('common');
  const { data: session } = useSession();
  const router = useRouter();

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'delete' | 'deactivate' | 'activate'>('delete');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/owner/tenants');
      setTenants(response.data);
    } catch (err) {
      console.error('Error fetching tenants:', err);
      setError('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTenants();
  }, []);

  const openDialog = (tenant: Tenant, type: typeof dialogType) => {
    setSelectedTenant(tenant);
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedTenant) return;
    setActionLoading(true);

    try {
      if (dialogType === 'delete') {
        await axios.delete(`/api/owner/tenants/${selectedTenant.id}/delete`);
        setTenants(tenants.filter(t => t.id !== selectedTenant.id));
      } else {
        const action = dialogType === 'deactivate' ? 'deactivate' : 'activate';
        await axios.put(`/api/owner/tenants/${selectedTenant.id}/${action}`);
        setTenants(
          tenants.map(t =>
            t.id === selectedTenant.id ? { ...t, isActive: dialogType === 'activate' } : t
          )
        );
      }
      setDialogOpen(false);
    } catch (err) {
      console.error(`Error during ${dialogType}:`, err);
      setError(`Failed to ${dialogType} tenant`);
    } finally {
      setActionLoading(false);
    }
  };
  async function handelRefresh() {
    fetchTenants();
  }
  const getDialogContent = () => {
    switch (dialogType) {
      case 'delete':
        return t('confirmDelete');
      case 'deactivate':
        return t('confirmDeactivate');
      case 'activate':
        return t('confirmActivate');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">{t('title')}</Typography>
        <Stack flexDirection={'row'} alignItems={'center'} gap={4}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => router.push('/dashboard/tenants/new')}
          >
            {t('add')}
          </Button>
          <AutorenewIcon onClick={handelRefresh}></AutorenewIcon>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <TenantsTable
            tenants={tenants}
            onEdit={tenant => router.push(`/dashboard/tenants/${tenant.id}`)}
            onDelete={tenant => openDialog(tenant, 'delete')}
            onToggleStatus={tenant =>
              openDialog(tenant, tenant.isActive ? 'deactivate' : 'activate')
            }
          />
        </Paper>
      )}

      <PopupDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirm}
        title={commonT('warning')}
        content={getDialogContent()}
        confirmLabel={commonT(dialogType)}
        cancelLabel={commonT('cancel')}
        loading={actionLoading}
        confirmColor={
          dialogType === 'delete' ? 'error' : dialogType === 'deactivate' ? 'warning' : 'success'
        }
      />
    </Box>
  );
}
