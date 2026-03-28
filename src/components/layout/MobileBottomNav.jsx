import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const navItems = [
  { label: 'Dashboard',    icon: <DashboardIcon />,    path: '/' },
  { label: 'Inventory',    icon: <Inventory2Icon />,   path: '/inventory' },
  { label: 'Transactions', icon: <ReceiptLongIcon />,  path: '/transactions' },
  { label: 'Reports',      icon: <AnalyticsIcon />,    path: '/reports' },
];

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active index
  const activeIndex = navItems.findIndex(item => {
    if (item.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.path);
  });

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        borderTop: '1px solid rgba(194,198,212,0.25)',
        backgroundColor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <BottomNavigation
        value={activeIndex}
        onChange={(_, newValue) => navigate(navItems[newValue].path)}
        sx={{
          backgroundColor: 'transparent',
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            color: '#727783',
            minWidth: 0,
            padding: '6px 0',
            '&.Mui-selected': {
              color: '#00488d',
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.65rem',
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            '&.Mui-selected': { fontSize: '0.65rem' },
          },
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={React.cloneElement(item.icon, { sx: { fontSize: 22 } })}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
