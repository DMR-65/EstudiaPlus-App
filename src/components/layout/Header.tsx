import { useState } from 'react';
import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { CalendarDays, LogOut, Menu as MenuIcon, UserRound } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { InitialsAvatar } from '@/components/common/InitialsAvatar';
import { useAuth } from '@/features/auth/AuthContext';
import { useAppData } from '@/features/app-data/AppDataContext';
import { getSectionTitle } from '@/components/layout/navigation';
import { formatCurrentDate } from '@/utils/dates';

interface HeaderProps {
  onOpenMenu: () => void;
}

export function Header({ onOpenMenu }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data } = useAppData();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const menuOpen = Boolean(anchorEl);
  const sectionTitle = getSectionTitle(location.pathname);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login', { replace: true });
  };

  const handleProfile = () => {
    setAnchorEl(null);
    navigate('/perfil');
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.appBar,
        px: { xs: 2, md: 4 },
        py: 1.5,
        bgcolor: 'rgba(248, 250, 252, 0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
          {isMobile && (
            <IconButton onClick={onOpenMenu} aria-label="Abrir menú de navegación" edge="start">
              <MenuIcon size={22} />
            </IconButton>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" component="p" noWrap sx={{ lineHeight: 1.2 }}>
              {sectionTitle}
            </Typography>
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ display: { xs: 'none', sm: 'flex' }, mt: 0.35 }}
            >
              <CalendarDays size={14} color="#64748B" />
              <Typography variant="caption" color="text.secondary">
                {formatCurrentDate()}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
              {data.student.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {data.student.course}
            </Typography>
          </Box>
          <IconButton
            onClick={(event) => setAnchorEl(event.currentTarget)}
            aria-label="Abrir menú de usuario"
            aria-controls={menuOpen ? 'user-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
            sx={{ p: 0.5 }}
          >
            <InitialsAvatar name={data.student.name} size={40} />
          </IconButton>
        </Stack>
      </Stack>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 248, mt: 1 } } }}
      >
        <Box sx={{ px: 2, py: 1.25 }}>
          <Typography variant="subtitle2" noWrap>
            {data.student.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap display="block">
            {data.student.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfile} sx={{ gap: 1.25, py: 1.1 }}>
          <UserRound size={18} />
          Mi perfil
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ gap: 1.25, py: 1.1, color: 'error.main' }}>
          <LogOut size={18} />
          Cerrar sesión
        </MenuItem>
      </Menu>
    </Box>
  );
}
