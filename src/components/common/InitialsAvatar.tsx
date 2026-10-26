import Avatar from '@mui/material/Avatar';
import type { SxProps, Theme } from '@mui/material/styles';

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

interface InitialsAvatarProps {
  name: string;
  size?: number;
  sx?: SxProps<Theme>;
}

export function InitialsAvatar({ name, size = 40, sx }: InitialsAvatarProps) {
  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: 'primary.main',
        fontWeight: 700,
        fontSize: size * 0.36,
        ...sx,
      }}
    >
      {getInitials(name)}
    </Avatar>
  );
}
