import React from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Box, InputAdornment, TextField, Avatar, Badge, IconButton,
  Typography, useMediaQuery, useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuIcon from '@mui/icons-material/Menu';

export default function Header({ title, subtitle }) {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const ctx      = useOutletContext?.() || {};
  const onMenuOpen = ctx.onMenuOpen;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: { xs: 3, md: 4 },
        pt: 1,
        gap: 2,
      }}
    >
      {/* Left: hamburger (mobile) + title */}
      <Box className="flex items-center gap-3 min-w-0">
        {isMobile && (
          <IconButton
            size="small"
            onClick={onMenuOpen}
            sx={{
              flexShrink: 0,
              backgroundColor: '#f2f4f5',
              borderRadius: '10px',
              '&:hover': { backgroundColor: '#e6e8e9' },
            }}
          >
            <MenuIcon sx={{ fontSize: 20, color: '#424752' }} />
          </IconButton>
        )}
        <Box className="min-w-0">
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              fontWeight: 700, color: '#191c1d',
              mb: 0.2, lineHeight: 1.2,
              fontSize: { xs: '1.05rem', sm: '1.25rem', md: '1.4rem' },
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: '#424752', fontSize: { xs: '0.72rem', md: '0.82rem' },
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Right: search (hidden on mobile) + notifications + avatar */}
      <Box className="flex items-center gap-2 flex-shrink-0">
        {!isMobile && (
          <TextField
            size="small"
            placeholder="Quick search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#727783', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 200 }}
          />
        )}

        <IconButton sx={{
          backgroundColor: '#f2f4f5', borderRadius: '10px',
          '&:hover': { backgroundColor: '#e6e8e9' },
          width: 36, height: 36,
        }}>
          <Badge
            badgeContent={3}
            color="error"
            sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 15, height: 15 } }}
          >
            <NotificationsNoneIcon sx={{ fontSize: 18, color: '#424752' }} />
          </Badge>
        </IconButton>

        <Avatar
          sx={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #00488d, #005fb8)',
            fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
          }}
        >
          AR
        </Avatar>
      </Box>
    </Box>
  );
}
