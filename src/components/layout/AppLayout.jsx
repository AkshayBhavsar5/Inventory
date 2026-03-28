import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';

export default function AppLayout() {
  const theme     = useTheme();
  const isMobile  = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafb' }}>
      {/* Sidebar — permanent on desktop, drawer on mobile */}
      <Sidebar
        isMobile={isMobile}
        drawerOpen={drawerOpen}
        onDrawerOpen={() => setDrawerOpen(true)}
        onDrawerClose={() => setDrawerOpen(false)}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          marginLeft: isMobile ? 0 : '220px',
          p: { xs: 2, sm: 3, md: 4 },
          pb: { xs: '80px', md: 4 }, // space for mobile bottom nav
          minHeight: '100vh',
          backgroundColor: '#f8fafb',
          maxWidth: '100%',
          overflowX: 'hidden',
        }}
      >
        <Outlet context={{ onMenuOpen: () => setDrawerOpen(true) }} />
      </Box>

      {/* Bottom navigation — mobile only */}
      {isMobile && <MobileBottomNav />}
    </Box>
  );
}
