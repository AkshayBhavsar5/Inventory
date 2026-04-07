import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Box, Typography, Divider, Drawer, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import DiamondIcon from '@mui/icons-material/Diamond';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/' },
  {
    label: 'Inventory',
    icon: <Inventory2Icon fontSize="small" />,
    path: '/inventory',
  },
  {
    label: 'Transactions',
    icon: <ReceiptLongIcon fontSize="small" />,
    path: '/transactions',
  },
  {
    label: 'Reports',
    icon: <AnalyticsIcon fontSize="small" />,
    path: '/reports',
  },
];

const bottomItems = [
  {
    label: 'Support',
    icon: <HelpOutlineIcon fontSize="small" />,
    path: '/support',
  },
];

function SidebarContent({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    console.log('click');
    if (onClose) onClose();
  };
  return (
    <Box
      sx={{
        width: 220,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        py: 3,
      }}
    >
      {/* Brand */}
      <Box className="flex items-center justify-between px-5 mb-8">
        <Box className="flex items-center gap-2">
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00488d, #005fb8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DiamondIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#191c1d',
                lineHeight: 1.1,
              }}
            >
              Emerald Vault
            </Typography>
            <Typography
              sx={{ fontSize: '0.65rem', color: '#424752', fontWeight: 500 }}
            >
              Admin Portal
            </Typography>
          </Box>
        </Box>
        {onClose && (
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: '#727783', '&:hover': { backgroundColor: '#e6e8e9' } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <Box className="flex flex-col gap-1 px-3 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={{ textDecoration: 'none' }}
            onClick={onClose}
          >
            {({ isActive }) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.3,
                  borderRadius: '8px',
                  position: 'relative',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#00488d' : '#424752',
                  fontWeight: isActive ? 600 : 400,
                  boxShadow: isActive
                    ? '0 2px 8px rgba(25,28,29,0.06)'
                    : 'none',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: isActive ? '#ffffff' : '#e6e8e9',
                    color: isActive ? '#00488d' : '#191c1d',
                  },
                  overflow: 'hidden',
                }}
              >
                {isActive && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: '20%',
                      height: '60%',
                      width: 3,
                      borderRadius: '0 2px 2px 0',
                      backgroundColor: '#00488d',
                    }}
                  />
                )}
                <Box sx={{ display: 'flex', color: 'inherit' }}>
                  {item.icon}
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 'inherit',
                    color: 'inherit',
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            )}
          </NavLink>
        ))}
      </Box>

      {/* Bottom items */}
      <Box className="px-3">
        <Divider sx={{ mb: 2, borderColor: 'rgba(194,198,212,0.3)' }} />
        {bottomItems.map((item) => (
          <Box
            key={item.label}
            onClick={() => {
              navigate(item.path);
              onClose?.();
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1.2,
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#424752',
              transition: 'all 0.15s ease',
              '&:hover': { backgroundColor: '#e6e8e9', color: '#191c1d' },
            }}
          >
            {item.icon}
            <Typography sx={{ fontSize: '0.875rem', color: 'inherit' }}>
              {item.label}
            </Typography>
          </Box>
        ))}
        <Box
          onClick={handleLogout}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.2,
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#ba1a1a',
            transition: 'all 0.15s ease',
            '&:hover': { backgroundColor: '#ffdad6' },
          }}
        >
          <LogoutIcon fontSize="small" />
          <Typography
            sx={{ fontSize: '0.875rem', color: 'inherit', fontWeight: 500 }}
          >
            Logout
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function Sidebar({
  isMobile,
  drawerOpen,
  onDrawerOpen,
  onDrawerClose,
}) {
  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={onDrawerClose}
        PaperProps={{
          sx: {
            width: 220,
            backgroundColor: '#f2f4f5',
            border: 'none',
            boxShadow: '4px 0 24px rgba(25,28,29,0.1)',
          },
        }}
      >
        <SidebarContent onClose={onDrawerClose} />
      </Drawer>
    );
  }

  // Desktop — permanent fixed sidebar
  return (
    <Box
      sx={{
        width: 220,
        minHeight: '100vh',
        backgroundColor: '#f2f4f5',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <SidebarContent onClose={null} />
    </Box>
  );
}
