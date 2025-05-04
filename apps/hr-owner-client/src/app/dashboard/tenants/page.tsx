'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Tenant {
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

export default function TenantsPage() {
  const t = useTranslations('tenants');
  const commonT = useTranslations('common');
  const { data: session } = useSession();
  const router = useRouter();
  
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/owner/tenants');
        setTenants(response.data.tenants);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Failed to load tenants');
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const handleAddTenant = () => {
    router.push('/dashboard/tenants/new');
  };

  const handleEditTenant = (tenant: Tenant) => {
    router.push(`/dashboard/tenants/${tenant.id}`);
  };

  const handleDeleteClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setDeleteDialogOpen(true);
  };

  const handleDeactivateClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setDeactivateDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTenant) return;
    
    setActionLoading(true);
    try {
      await axios.delete(`/api/owner/tenants/${selectedTenant.id}`);
      setTenants(tenants.filter(t => t.id !== selectedTenant.id));
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting tenant:', err);
      setError('Failed to delete tenant');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivateConfirm = async () => {
    if (!selectedTenant) return;
    
    setActionLoading(true);
    try {
      await axios.post(`/api/owner/tenants/${selectedTenant.id}/deactivate`);
      
      // Update the tenant status in the list
      setTenants(
        tenants.map(t => 
          t.id === selectedTenant.id ? { ...t, isActive: false } : t
        )
      );
      
      setDeactivateDialogOpen(false);
    } catch (err) {
      console.error('Error deactivating tenant:', err);
      setError('Failed to deactivate tenant');
    } finally {
      setActionLoading(false);
    }
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{t('title')}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddTenant}
        >
          {t('add')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>{t('name')}</TableCell>
              <TableCell>{t('domain')}</TableCell>
              <TableCell>{t('plan')}</TableCell>
              <TableCell>{t('status')}</TableCell>
              <TableCell>{t('contactEmail')}</TableCell>
              <TableCell>{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {commonT('noData')}
                </TableCell>
              </TableRow>
            ) : (
              tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>{tenant.name}</TableCell>
                  <TableCell>{tenant.domain}</TableCell>
                  <TableCell>{tenant.plan}</TableCell>
                  <TableCell>
                    <Chip
                      label={tenant.isActive ? t('active') : t('inactive')}
                      color={tenant.isActive ? 'success' : 'error'}
                      size="small"
                      icon={tenant.isActive ? <CheckCircleIcon /> : <BlockIcon />}
                    />
                  </TableCell>
                  <TableCell>{tenant.contactEmail}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditTenant(tenant)}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {tenant.isActive && (
                      <IconButton
                        color="warning"
                        onClick={() => handleDeactivateClick(tenant)}
                        size="small"
                      >
                        <BlockIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(tenant)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>{commonT('warning')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('confirmDelete')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>
            {commonT('cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : commonT('delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <Dialog
        open={deactivateDialogOpen}
        onClose={() => setDeactivateDialogOpen(false)}
      >
        <DialogTitle>{commonT('warning')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('confirmDeactivate')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeactivateDialogOpen(false)} disabled={actionLoading}>
            {commonT('cancel')}
          </Button>
          <Button
            onClick={handleDeactivateConfirm}
            color="warning"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : t('deactivate')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}