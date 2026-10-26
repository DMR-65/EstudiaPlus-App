import { Box, Stack, Typography } from '@mui/material';
import { GraduationCap } from 'lucide-react';
import { APP_NAME } from '@/utils/constants';

interface LogoProps {
  compact?: boolean;
  light?: boolean;
  size?: number;
}

export function Logo({ compact = false, light = false, size = 40 }: LogoProps) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: `${Math.round(size * 0.3)}px`,
          display: 'grid',
          placeItems: 'center',
          color: '#FFFFFF',
          background: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)',
          boxShadow: '0 8px 18px rgba(37, 99, 235, 0.25)',
          flexShrink: 0,
        }}
      >
        <GraduationCap size={Math.round(size * 0.58)} strokeWidth={2.2} />
      </Box>
      {!compact && (
        <Typography
          variant="h6"
          sx={{
            color: light ? '#FFFFFF' : 'text.primary',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            fontSize: size > 40 ? '1.5rem' : '1.25rem',
          }}
        >
          {APP_NAME}
        </Typography>
      )}
    </Stack>
  );
}
