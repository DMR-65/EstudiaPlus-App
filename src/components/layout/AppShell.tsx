import { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { DRAWER_WIDTH, Sidebar } from '@/components/layout/Sidebar';

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          ml: { md: `${DRAWER_WIDTH}px` },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header onOpenMenu={() => setMobileOpen(true)} />
        <Container maxWidth="xl" sx={{ py: { xs: 2.5, md: 4 }, px: { xs: 2, md: 4 }, flexGrow: 1 }}>
          <Outlet />
        </Container>
        <Box
          component="footer"
          sx={{ px: { xs: 2, md: 4 }, py: 2, textAlign: 'center' }}
        >
          <Typography variant="caption" color="text.secondary">
            Estudia+ · Datos ficticios de demostración · Guardado local
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
