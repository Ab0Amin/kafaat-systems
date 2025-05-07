import { Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import { CheckCircle, Block } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Actions from '../actions/Actions';
import { Tenant } from '../../types/types';

interface Props {
  tenants: Tenant[];
  onEdit: (t: Tenant) => void;
  onDelete: (t: Tenant) => void;
  onToggleStatus: (t: Tenant) => void;
}

export default function TenantsTable({ tenants, onEdit, onDelete, onToggleStatus }: Props) {
  const { t } = useTranslation('tenant');

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t('name')}</TableCell>
          <TableCell>{t('domain')}</TableCell>
          <TableCell>{t('plan')}</TableCell>
          <TableCell>{t('status')}</TableCell>
          <TableCell>{t('adminEmail')}</TableCell>
          <TableCell>{t('actions')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tenants.map(tenant => (
          <TableRow key={tenant.id}>
            <TableCell>{tenant.name}</TableCell>
            <TableCell>{tenant.domain}</TableCell>
            <TableCell>{tenant.plan}</TableCell>
            <TableCell>
              <Chip
                label={tenant.isActive ? t('active') : t('inactive')}
                color={tenant.isActive ? 'success' : 'error'}
                size="small"
                icon={tenant.isActive ? <CheckCircle /> : <Block />}
              />
            </TableCell>
            <TableCell>{tenant.contactEmail}</TableCell>
            <TableCell>
              <Actions
                isActive={tenant.isActive}
                onEdit={() => onEdit(tenant)}
                onDelete={() => onDelete(tenant)}
                onToggleStatus={() => onToggleStatus(tenant)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
