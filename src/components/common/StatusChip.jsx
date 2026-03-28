import React from 'react';
import { Chip } from '@mui/material';

const statusConfig = {
  'In Stock':    { bg: '#d6e4f5', color: '#00488d' },
  'Low Stock':   { bg: '#ffdbcb', color: '#7b3200' },
  'Critical':    { bg: '#ffdad6', color: '#93000a' },
  'Out of Stock':{ bg: '#e1e3e4', color: '#424752' },
  'In Transit':  { bg: '#d6e3ff', color: '#001b3d' },
  'Completed':   { bg: '#d6e4f5', color: '#00488d' },
  'Pending':     { bg: '#ffdbcb', color: '#7b3200' },
  'Purchase':    { bg: '#d6e3ff', color: '#001b3d' },
  'Sale':        { bg: '#d6e4f5', color: '#00488d' },
  'Adjustment':  { bg: '#e1e3e4', color: '#424752' },
};

export default function StatusChip({ status }) {
  const config = statusConfig[status] || { bg: '#e1e3e4', color: '#424752' };
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: config.bg,
        color: config.color,
        fontWeight: 600,
        fontSize: '0.72rem',
        borderRadius: '6px',
        height: 22,
      }}
    />
  );
}
