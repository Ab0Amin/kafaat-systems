import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from '@mui/material';

interface PopupDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  confirmLabel: string;
  cancelLabel: string;
  loading?: boolean;
  confirmColor?: 'error' | 'warning' | 'success';
}

export default function PopupDialog({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmLabel,
  cancelLabel,
  loading = false,
  confirmColor = 'error',
}: PopupDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} color={confirmColor} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
