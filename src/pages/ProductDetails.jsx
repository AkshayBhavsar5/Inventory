import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CategoryIcon from '@mui/icons-material/Category';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { deleteProduct } from '../store/slices/productsSlice';
import ProductModal from '../components/inventory/ProductModal';
import StatusChip from '../components/common/StatusChip';

export default function ProductDetails() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = useSelector((s) =>
    s.products.items.find((p) => p.sku === sku),
  );
  const transactions = useSelector((s) =>
    s.transactions.items.filter((t) => t.sku === sku),
  );

  const [editOpen, setEditOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  if (!product) {
    return (
      <Box className="flex flex-col items-center justify-center min-h-64 gap-4">
        <Typography sx={{ color: '#727783', fontSize: '1.1rem' }}>
          Product not found.
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/inventory')}
          variant="contained"
        >
          Back to Inventory
        </Button>
      </Box>
    );
  }

  const margin =
    product.cost > 0
      ? (((product.price - product.cost) / product.price) * 100).toFixed(1)
      : 0;
  const stockPct = Math.min(
    100,
    (product.stock / (product.reorderPoint * 3)) * 100,
  );
  const totalRevenue = transactions
    .filter((t) => t.type === 'Sale')
    .reduce((s, t) => s + t.total, 0);
  const totalCost = transactions
    .filter((t) => t.type === 'Purchase')
    .reduce((s, t) => s + t.total, 0);

  const handleDelete = () => {
    dispatch(deleteProduct(product.id));
    navigate('/inventory');
  };

  return (
    <Box>
      {/* Back + actions */}
      <Box className="flex items-center justify-between mb-4">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/inventory')}
          sx={{
            color: '#424752',
            fontWeight: 600,
            '&:hover': { backgroundColor: '#f2f4f5' },
          }}
        >
          Back to Inventory
        </Button>
        <Box className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditOpen(true)}
            sx={{
              borderColor: '#a8c8ff',
              color: '#00488d',
              fontWeight: 600,
              '&:hover': { borderColor: '#00488d', backgroundColor: '#d6e4f5' },
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            sx={{
              borderColor: '#ffdad6',
              color: '#ba1a1a',
              fontWeight: 600,
              '&:hover': { borderColor: '#ba1a1a', backgroundColor: '#ffdad6' },
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Hero card */}
      <Card
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #00488d 0%, #005fb8 100%)',
          color: '#fff',
        }}
      >
        <CardContent sx={{ p: 3.5 }}>
          <Box className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <Box>
              <Box className="flex items-center gap-2 mb-1">
                <StatusChip status={product.status} />
                <Typography
                  sx={{
                    fontSize: '0.78rem',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'monospace',
                  }}
                >
                  {product.sku}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '1.6rem',
                  color: '#fff',
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                {product.name}
              </Typography>
              <Box className="flex flex-wrap gap-3 mt-2">
                <Box className="flex items-center gap-1">
                  <CategoryIcon
                    sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}
                  />
                  <Typography
                    sx={{
                      fontSize: '0.82rem',
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {product.category}
                  </Typography>
                </Box>
                <Box className="flex items-center gap-1">
                  <LocationOnIcon
                    sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}
                  />
                  <Typography
                    sx={{
                      fontSize: '0.82rem',
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {product.location}
                  </Typography>
                </Box>
                <Box className="flex items-center gap-1">
                  <Typography
                    sx={{
                      fontSize: '0.78rem',
                      color: 'rgba(255,255,255,0.65)',
                    }}
                  >
                    Last updated: {product.lastUpdated}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography
                sx={{
                  fontSize: '0.72rem',
                  color: 'rgba(255,255,255,0.65)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06rem',
                  fontWeight: 600,
                }}
              >
                Selling Price
              </Typography>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '2.4rem',
                  color: '#fff',
                  lineHeight: 1,
                }}
              >
                ${product.price.toFixed(2)}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.78rem',
                  color: 'rgba(255,255,255,0.65)',
                  mt: 0.3,
                }}
              >
                Cost: ₹{product.cost.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Stock Levels */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box className="flex items-center gap-2 mb-3">
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  backgroundColor: '#d6e4f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <InventoryIcon sx={{ fontSize: 16, color: '#00488d' }} />
              </Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#191c1d' }}
              >
                Stock Levels
              </Typography>
            </Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: '2.2rem',
                color:
                  product.stock < product.reorderPoint ? '#93000a' : '#191c1d',
                lineHeight: 1,
                mb: 0.5,
              }}
            >
              {product.stock.toLocaleString()}
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#727783', mb: 2 }}>
              Units available
            </Typography>
            <LinearProgress
              variant="determinate"
              value={stockPct}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: '#e6e8e9',
                mb: 1,
                '& .MuiLinearProgress-bar': {
                  backgroundColor:
                    stockPct < 30
                      ? '#93000a'
                      : stockPct < 50
                        ? '#7b3200'
                        : '#00488d',
                  borderRadius: 3,
                },
              }}
            />
            <Box className="flex justify-between">
              <Typography sx={{ fontSize: '0.72rem', color: '#727783' }}>
                Reorder at:{' '}
                <strong style={{ color: '#424752' }}>
                  {product.reorderPoint}
                </strong>
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#727783' }}>
                {stockPct.toFixed(0)}% capacity
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Financials */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box className="flex items-center gap-2 mb-3">
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  backgroundColor: '#d6e4f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AttachMoneyIcon sx={{ fontSize: 16, color: '#00488d' }} />
              </Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#191c1d' }}
              >
                Financials
              </Typography>
            </Box>
            {[
              { label: 'Selling Price', value: `₹${product.price.toFixed(2)}` },
              { label: 'Cost Price', value: `₹${product.cost.toFixed(2)}` },
              { label: 'Gross Margin', value: `${margin}%`, highlight: true },
              {
                label: 'Stock Value',
                value: `₹${(product.stock * product.cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
              },
            ].map((f) => (
              <Box
                key={f.label}
                className="flex justify-between items-center py-1.5"
              >
                <Typography sx={{ fontSize: '0.8rem', color: '#727783' }}>
                  {f.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.88rem',
                    fontWeight: f.highlight ? 700 : 600,
                    color: f.highlight ? '#00488d' : '#191c1d',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {f.value}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box className="flex items-center gap-2 mb-3">
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  backgroundColor: '#d6e4f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 16, color: '#00488d' }} />
              </Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#191c1d' }}
              >
                Activity Summary
              </Typography>
            </Box>
            {[
              { label: 'Total Transactions', value: transactions.length },
              {
                label: 'Total Sales',
                value: transactions.filter((t) => t.type === 'Sale').length,
              },
              {
                label: 'Total Purchases',
                value: transactions.filter((t) => t.type === 'Purchase').length,
              },
              {
                label: 'Revenue Generated',
                value: `₹${totalRevenue.toLocaleString()}`,
                highlight: true,
              },
            ].map((f) => (
              <Box
                key={f.label}
                className="flex justify-between items-center py-1.5"
              >
                <Typography sx={{ fontSize: '0.8rem', color: '#727783' }}>
                  {f.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.88rem',
                    fontWeight: f.highlight ? 700 : 600,
                    color: f.highlight ? '#00488d' : '#191c1d',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {f.value}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Transaction History for this product */}
      {transactions.length > 0 && (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, pb: 2 }}>
              <Typography
                sx={{ fontWeight: 700, color: '#191c1d', fontSize: '0.95rem' }}
              >
                Transaction History
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#727783' }}>
                All movements for SKU: {sku}
              </Typography>
            </Box>
            <Box>
              {transactions.map((t, i) => (
                <Box
                  key={t.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 1.5,
                    borderTop:
                      i === 0 ? 'none' : '1px solid rgba(194,198,212,0.15)',
                    '&:hover': { backgroundColor: '#f8fafb' },
                  }}
                >
                  <Box className="flex items-center gap-3">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        backgroundColor:
                          t.type === 'Purchase' ? '#d6e3ff' : '#d6e4f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: t.type === 'Purchase' ? '#001b3d' : '#00488d',
                        }}
                      >
                        {t.type[0]}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          color: '#191c1d',
                        }}
                      >
                        {t.id} — {t.type}
                      </Typography>
                      <Typography
                        sx={{ fontSize: '0.72rem', color: '#727783' }}
                      >
                        {t.date} · Ref: {t.reference} · By: {t.by}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        fontVariantNumeric: 'tabular-nums',
                        color: t.type === 'Sale' ? '#93000a' : '#00488d',
                      }}
                    >
                      {t.type === 'Sale' ? `-${t.qty}` : `+${t.qty}`} units
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.78rem',
                        color: '#424752',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      ₹
                      {t.total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      <ProductModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        editProduct={product}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="info" variant="filled" sx={{ borderRadius: '10px' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
