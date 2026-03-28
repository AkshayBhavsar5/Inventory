import React from 'react';
import { Box, InputAdornment, TextField, Avatar, Badge, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

export default function Header({ title, subtitle }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 4,
        pt: 1,
      }}
    >
      {/* Page title */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#191c1d', mb: 0.3 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: '#424752', fontSize: '0.82rem' }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Right actions */}
      <Box className="flex items-center gap-3">
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
          sx={{ width: 220 }}
        />
        <IconButton sx={{ backgroundColor: '#f2f4f5', borderRadius: '10px', '&:hover': { backgroundColor: '#e6e8e9' } }}>
          <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 16, height: 16 } }}>
            <NotificationsNoneIcon sx={{ fontSize: 20, color: '#424752' }} />
          </Badge>
        </IconButton>
        <Avatar
          sx={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #00488d, #005fb8)',
            fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
          }}
        >
          AR
        </Avatar>
      </Box>
    </Box>
  );
}
