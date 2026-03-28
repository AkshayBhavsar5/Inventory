import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafb' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          marginLeft: '220px',
          p: { xs: 3, md: 4 },
          minHeight: '100vh',
          backgroundColor: '#f8fafb',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
