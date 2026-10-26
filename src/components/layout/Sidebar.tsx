import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CalendarRange } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { useAppData } from '@/features/app-data/AppDataContext';
import { navigationItems } from '@/components/layout/navigation';

export const DRAWER_WIDTH = 268;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useAppData();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (!isDesktop) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2.5, pt: 2.75, pb: 2.25 }}>
        <Logo />
      </Box>
      <Divider />
      <List
        component="nav"
        aria-label="Navegación principal"
        sx={{ px: 1.5, py: 2, flexGrow: 1 }}
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const selected =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => handleNavigate(item.path)}
              sx={{
                borderRadius: 2.5,
                mb: 0.5,
                py: 1.15,
                color: selected ? 'primary.contrastText' : 'text.secondary',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                },
                '&:hover': {
                  bgcolor: selected ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}>
                <Icon size={20} strokeWidth={2} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: selected ? 700 : 550,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 100%)',
            border: '1px solid #DBEAFE',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <CalendarRange size={17} color="#2563EB" />
            <Typography variant="subtitle2" sx={{ color: '#1E3A8A', fontWeight: 700 }}>
              Año académico {data.student.academicYear}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Tu información se guarda localmente en este dispositivo.
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isDesktop ? 'permanent' : 'temporary'}
      open={isDesktop ? true : mobileOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
