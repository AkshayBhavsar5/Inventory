import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function StatCard({ title, value, subtitle, trend, trendLabel, icon, accentColor = '#a8c8ff', highlight = false }) {
  const isPositive = trend > 0;

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        p: 3,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(25,28,29,0.04)',
        borderTop: `2px solid ${accentColor}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(25,28,29,0.08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Icon top-right */}
      {icon && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 36,
            height: 36,
            borderRadius: '10px',
            backgroundColor: `${accentColor}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor === '#a8c8ff' ? '#00488d' : accentColor,
          }}
        >
          {icon}
        </Box>
      )}

      <Typography
        variant="caption"
        sx={{ color: '#727783', fontSize: '0.72rem', letterSpacing: '0.06rem', textTransform: 'uppercase', fontWeight: 600 }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: highlight ? '2.1rem' : '1.75rem',
          fontWeight: 700,
          color: '#191c1d',
          mt: 1,
          mb: 0.5,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.1,
        }}
      >
        {value}
      </Typography>

      <Box className="flex items-center gap-2 mt-1">
        {subtitle && (
          <Typography variant="body2" sx={{ color: '#727783', fontSize: '0.78rem' }}>
            {subtitle}
          </Typography>
        )}
        {trend !== undefined && (
          <Chip
            icon={isPositive ? <TrendingUpIcon sx={{ fontSize: '14px !important' }} /> : <TrendingDownIcon sx={{ fontSize: '14px !important' }} />}
            label={trendLabel || `${isPositive ? '+' : ''}${trend}%`}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.68rem',
              fontWeight: 600,
              backgroundColor: isPositive ? '#d6e4f5' : '#ffdad6',
              color: isPositive ? '#00488d' : '#ba1a1a',
              '& .MuiChip-icon': { color: 'inherit' },
              borderRadius: '6px',
            }}
          />
        )}
      </Box>
    </Box>
  );
}
