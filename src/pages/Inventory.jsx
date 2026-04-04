import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FilterListIcon from '@mui/icons-material/FilterList';
import InventoryIcon from '@mui/icons-material/Inventory2';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Header from '../components/layout/Header';
import StatCard from '../components/common/StatCard';
import StatusChip from '../components/common/StatusChip';
import ProductModal from '../components/inventory/ProductModal';
import { deleteProduct, setFilters } from '../store/slices/productsSlice';
import { fetchProducts } from '../store/slices/productsSlice';

// Mobile card row — shown instead of table row on small screens
function ProductCard({ p, onEdit, onDelete, onView }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 1px 4px rgba(25,28,29,0.05)',
        mb: 1.5,
      }}
    >
      <Box className="flex items-start justify-between mb-1">
        <Box className="min-w-0 flex-1 mr-2">
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.88rem',
              color: '#191c1d',
              lineHeight: 1.3,
            }}
          >
            {p.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              color: '#727783',
              mt: 0.3,
            }}
          >
            {p.sku}
          </Typography>
        </Box>
        <StatusChip status={p.status} />
      </Box>

      <Box className="flex flex-wrap gap-3 mt-2">
        <Box>
          <Typography
            sx={{
              fontSize: '0.65rem',
              color: '#727783',
              textTransform: 'uppercase',
              letterSpacing: '0.04rem',
              fontWeight: 600,
            }}
          >
            Stock
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.9rem',
              color: p.stock < p.reorderPoint ? '#93000a' : '#191c1d',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {p.stock}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: '0.65rem',
              color: '#727783',
              textTransform: 'uppercase',
              letterSpacing: '0.04rem',
              fontWeight: 600,
            }}
          >
            Price
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '0.88rem',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            ${p.price.toFixed(2)}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: '0.65rem',
              color: '#727783',
              textTransform: 'uppercase',
              letterSpacing: '0.04rem',
              fontWeight: 600,
            }}
          >
            Category
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#424752' }}>
            {p.category}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: '0.65rem',
              color: '#727783',
              textTransform: 'uppercase',
              letterSpacing: '0.04rem',
              fontWeight: 600,
            }}
          >
            Location
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#424752' }}>
            {p.location}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 1.2, borderColor: 'rgba(194,198,212,0.2)' }} />

      <Box className="flex justify-end gap-1">
        <IconButton
          size="small"
          onClick={() => onView(p.sku)}
          sx={{
            color: '#727783',
            '&:hover': { color: '#00488d', backgroundColor: '#d6e4f5' },
          }}
        >
          <OpenInNewIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onEdit(p)}
          sx={{
            color: '#727783',
            '&:hover': { color: '#00488d', backgroundColor: '#d6e4f5' },
          }}
        >
          <EditIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete(p.id, p.name)}
          sx={{
            color: '#727783',
            '&:hover': { color: '#ba1a1a', backgroundColor: '#ffdad6' },
          }}
        >
          <DeleteIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  );
}

export default function Inventory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { items, filters } = useSelector((s) => s.products);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [page, setPage] = useState(0);
  const ROWS = isMobile ? 6 : 8;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const filtered = useMemo(
    () =>
      items.filter((p) => {
        const matchSearch =
          !filters.search ||
          p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.sku.toLowerCase().includes(filters.search.toLowerCase());
        const matchCat =
          filters.category === 'All' || p.category === filters.category;
        const matchStatus =
          filters.status === 'All' || p.status === filters.status;
        return matchSearch && matchCat && matchStatus;
      }),
    [items, filters],
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const paginated = filtered.slice(page * ROWS, page * ROWS + ROWS);

  const handleDelete = (id, name) => {
    dispatch(deleteProduct(id));
    setSnackbar({
      open: true,
      message: `"${name}" removed.`,
      severity: 'info',
    });
  };
  const handleEdit = (p) => {
    setEditProduct(p);
    setModalOpen(true);
  };
  const handleAdd = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const totalValue = items.reduce((s, p) => s + p.stock * p.price, 0);
  const lowStockCount = items.filter(
    (p) => p.status === 'Low Stock' || p.status === 'Critical',
  ).length;
  const healthPct = (
    (items.filter((p) => p.status === 'In Stock').length / items.length) *
    100
  ).toFixed(1);

  return (
    <Box>
      <Header
        title="Inventory"
        subtitle={`${items.length} items · 4 locations`}
      />

      {/* Stats — 2 col on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard
          title="Valuation"
          value={`$${(totalValue / 1000000).toFixed(2)}M`}
          subtitle="All locations"
          trend={1.8}
          accentColor="#a8c8ff"
          icon={<InventoryIcon sx={{ fontSize: 16 }} />}
        />
        <StatCard
          title="Low Stock"
          value={lowStockCount}
          subtitle="Needs attention"
          trend={-2}
          trendLabel="Alert"
          accentColor="#ffb691"
          icon={<WarningAmberIcon sx={{ fontSize: 16 }} />}
        />
        <StatCard
          title="Shipments"
          value="12 Pending"
          subtitle="Expected in 48h"
          trend={0}
          accentColor="#d6e4f5"
          icon={<LocalShippingIcon sx={{ fontSize: 16 }} />}
        />
        <StatCard
          title="Health"
          value={`${healthPct}%`}
          subtitle="vs last month"
          trend={0.4}
          accentColor="#bac8d8"
          icon={<FavoriteIcon sx={{ fontSize: 16 }} />}
        />
      </div>

      {/* Main card */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Toolbar */}
          <Box sx={{ p: { xs: 2, md: 3 }, pb: 2 }}>
            <Box className="flex items-center justify-between mb-3">
              <Typography
                sx={{
                  fontWeight: 700,
                  color: '#191c1d',
                  fontSize: { xs: '0.88rem', md: '0.95rem' },
                }}
              >
                Product Catalogue
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAdd}
              >
                Add
              </Button>
            </Box>
            <Box className="flex flex-wrap gap-2">
              <TextField
                size="small"
                placeholder="Search SKU or name…"
                value={filters.search}
                onChange={(e) =>
                  dispatch(setFilters({ search: e.target.value }))
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 15, color: '#727783' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: '1 1 150px', minWidth: 0 }}
              />
              <TextField
                select
                size="small"
                value={filters.category}
                onChange={(e) =>
                  dispatch(setFilters({ category: e.target.value }))
                }
                sx={{ flex: '1 1 110px', minWidth: 0 }}
              >
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                size="small"
                value={filters.status}
                onChange={(e) =>
                  dispatch(setFilters({ status: e.target.value }))
                }
                sx={{ flex: '1 1 110px', minWidth: 0 }}
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          {/* Mobile: card list | Desktop: table */}
          {isMobile ? (
            <Box sx={{ px: 2, pb: 1 }}>
              {paginated.length === 0 ? (
                <Typography
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    color: '#727783',
                    fontSize: '0.88rem',
                  }}
                >
                  No products match your filters.
                </Typography>
              ) : (
                paginated.map((p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={(sku) => navigate(`/inventory/${sku}`)}
                  />
                ))
              )}
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow>
                    {[
                      'SKU',
                      'Product Name',
                      'Category',
                      'Stock',
                      'Reorder',
                      'Price',
                      'Cost',
                      'Status',
                      'Location',
                      '',
                    ].map((h) => (
                      <TableCell key={h}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        sx={{ textAlign: 'center', py: 5, color: '#727783' }}
                      >
                        No products match your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((p) => (
                      <TableRow
                        key={p.id}
                        sx={{
                          '&:hover': { backgroundColor: '#f2f4f5' },
                          cursor: 'pointer',
                        }}
                      >
                        <TableCell>
                          <Typography
                            sx={{
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              color: '#424752',
                              fontWeight: 500,
                            }}
                          >
                            {p.sku}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.83rem',
                              color: '#191c1d',
                            }}
                          >
                            {p.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{ fontSize: '0.82rem', color: '#424752' }}
                          >
                            {p.category}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              fontVariantNumeric: 'tabular-nums',
                              color:
                                p.stock === 0
                                  ? '#93000a'
                                  : p.stock < p.reorderPoint
                                    ? '#7b3200'
                                    : '#191c1d',
                            }}
                          >
                            {p.stock.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{ fontSize: '0.8rem', color: '#727783' }}
                          >
                            {p.reorderPoint}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.83rem',
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            ${p.price.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: '0.82rem',
                              color: '#424752',
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            ${p.cost.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={p.status} />
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{ fontSize: '0.8rem', color: '#424752' }}
                          >
                            {p.location}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ pr: 2 }}>
                          <Box className="flex gap-0.5">
                            <Tooltip title="View">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/inventory/${p.sku}`)}
                                sx={{
                                  color: '#727783',
                                  '&:hover': {
                                    color: '#00488d',
                                    backgroundColor: '#d6e4f5',
                                  },
                                }}
                              >
                                <OpenInNewIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(p)}
                                sx={{
                                  color: '#727783',
                                  '&:hover': {
                                    color: '#00488d',
                                    backgroundColor: '#d6e4f5',
                                  },
                                }}
                              >
                                <EditIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(p.id, p.name)}
                                sx={{
                                  color: '#727783',
                                  '&:hover': {
                                    color: '#ba1a1a',
                                    backgroundColor: '#ffdad6',
                                  },
                                }}
                              >
                                <DeleteIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            rowsPerPage={ROWS}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPageOptions={[ROWS]}
            sx={{
              borderTop: 'none',
              color: '#424752',
              '& .MuiTablePagination-toolbar': { fontSize: '0.78rem' },
            }}
          />
        </CardContent>
      </Card>

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editProduct={editProduct}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: '10px', fontSize: '0.82rem' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
