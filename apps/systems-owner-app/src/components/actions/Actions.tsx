import { IconButton } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

interface Props {
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export default function Actions({ isActive, onEdit, onDelete, onToggleStatus }: Props) {
  return (
    <>
      <IconButton color="primary" onClick={onEdit} size="small">
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton color={isActive ? 'warning' : 'success'} onClick={onToggleStatus} size="small">
        {isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
      </IconButton>
      <IconButton color="error" onClick={onDelete} size="small">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </>
  );
}
