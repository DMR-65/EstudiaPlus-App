import type { FormEventHandler, ReactNode } from 'react';
import { useId } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface FormDialogProps {
  open: boolean;
  title: string;
  subtitle?: string;
  submitLabel: string;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md';
}

export function FormDialog({
  open,
  title,
  subtitle,
  submitLabel,
  onClose,
  onSubmit,
  children,
  maxWidth = 'sm',
}: FormDialogProps) {
  const titleId = useId();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      fullScreen={isMobile}
      aria-labelledby={titleId}
    >
      <form onSubmit={onSubmit} noValidate>
        <DialogTitle id={titleId} sx={{ pb: subtitle ? 1 : 2 }}>
          {title}
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2.5 }}>
          {children}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
