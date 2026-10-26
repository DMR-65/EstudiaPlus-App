import { Box, Stack, Typography } from '@mui/material';
import type { Subject } from '@/types';

interface SubjectLabelProps {
  subject: Subject | undefined;
  size?: 'small' | 'body2';
}

export function SubjectLabel({ subject, size = 'small' }: SubjectLabelProps) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
      <Box
        component="span"
        sx={{
          width: 9,
          height: 9,
          borderRadius: '50%',
          bgcolor: subject?.color ?? 'text.disabled',
          flexShrink: 0,
        }}
      />
      <Typography
        variant="body2"
        color="text.secondary"
        noWrap
        sx={{ fontSize: size === 'small' ? '0.8rem' : undefined }}
      >
        {subject?.name ?? 'Asignatura eliminada'}
      </Typography>
    </Stack>
  );
}
