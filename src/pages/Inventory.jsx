import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Button, TextField, MenuItem,
  InputAdornment, Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, TablePagination, IconButton, Tooltip, Snackbar, Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Header from '../components/layout/Header';
import StatCard from '../components/common/StatCard';
import StatusChip from '../components/common/StatusChip';
import ProductModal from '../components/inventory/ProductModal';
import { deleteProduct, setFilters, setSelectedProduct } from '../store/slices/productsSlice';
import InventoryIcon from '@mui/icons-material/Inventory2';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FavoriteIcon from '@mui/icons-material/Favorite';

const CATEGORIES = ['All', 'Electronics', 'Audio', 'Displays', 'Peripherals', 'Gaming', 'Smart Home', 'Components'];
const STATUSES   = ['All', 'In Stock', 'Low Stock', 'Critical', 'Out of Stock'];

export default function Inventory() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items, filters } = useSelector(s => s.products);

  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [page, setPage]       = useState(0);
  const [rowsPerPage]         = useState(8);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const filtered = useMemo(() => {
    return items.filter(p => {
      const matchSearch = !filters.search ||
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.sku.toLowerCase().includes(filters.search.toLowerCase());
      const matchCat    = filters.category === 'All' || p.category === filters.category;
      const matchStatus = filters.status === 'All'   || p.status === filters.status;
      return matchSearch && matchCat && matchStatus;
    });
  }, [items, filters]);

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleDelete = (id, name) => {
    dispatch(deleteProduct(id));
    setSnackbar({ open: true, message: `"${name}" removed from inventory.`, severity: 'info' });
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const totalValue     = items.reduce((s, p) => s + p.stock * p.price, 0);
  const lowStockCount  = items.filter(p => p.status === 'Low Stock' || p.status === 'Critical').length;
  const activeShipments = 12;
  const healthPct      = ((items.filter(p => p.status === 'In Stock').length / items.length) * 100).toFixed(1);

  return (
    <Box>
      <Header title="Inventory Shell" subtitle={`Manage and curate ${items.length.toLocaleString()} stock items across 4 locations.`} />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Valuation"    value={`$${(totalValue / 1000000).toFixed(2)}M`}
          subtitle="All locations" trend={1.8} accentColor="#a8c8ff" icon={<InventoryIcon sx={{ fontSize: 18 }} />} />
        <StatCard title="Low Stock Items"    value={lowStockCount}
          subtitle="Requires immediate attention" trend={-2} trendLabel="Alert"
          accentColor="#ffb691" icon={<WarningAmberIcon sx={{ fontSize: 18 }} />} />
        <StatCard title="Active Shipments"   value={`${activeShipments} Pending`}
          subtitle="Expected arrival in 48h" trend={0} accentColor="#d6e4f5"
          icon={<LocalShippingIcon sx={{ fontSize: 18 }} />} />
        <StatCard title="Inventory Health"   value={`${healthPct}%`}
          subtitle="vs last month" trend={0.4} accentColor="#bac8d8"
          icon={<FavoriteIcon sx={{ fontSize: 18 }} />} />
      </div>

      {/* Table card */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Toolbar */}
          <Box className="flex flex-wrap items-center justify-between gap-3 p-4 pb-3">
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#191c1d', fontSize: '0.95rem' }}>
              Product Catalogue
            </Typography>
            <Box className="flex flex-wrap items-center gap-2">
              <TextField
                size="small" placeholder="Search SKU or name…"
                value={filters.search}
                onChange={e => dispatch(setFilters({ search: e.target.value }))}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: '#727783' }} /></InputAdornment> }}
                sx={{ width: 200 }}
              />
              <TextField select size="small" value={filters.category}
                onChange={e => dispatch(setFilters({ category: e.target.value }))}
                sx={{ width: 130 }}
                InputProps={{ startAdornment: <FilterListIcon sx={{ fontSize: 16, color: '#727783', mr: 0.5 }} /> }}
              >
                {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              <TextField select size="small" value={filters.status}
                onChange={e => dispatch(setFilters({ status: e.target.value }))}
                sx={{ width: 130 }}
              >
                {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
              <Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} onClick={handleAdd} sx={{ whiteSpace: 'nowrap' }}>
                Add Product
              </Button>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['SKU', 'Product Name', 'Category', 'Stock', 'Reorder Pt.', 'Price', 'Cost', 'Status', 'Location', ''].map(h => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} sx={{ textAlign: 'center', py: 5, color: '#727783' }}>
                      No products match your filters.
                    </TableCell>
                  </TableRow>
                ) : paginated.map(p => (
                  <TableRow key={p.id} sx={{ '&:hover': { backgroundColor: '#f2f4f5' }, cursor: 'pointer' }}>
                    <TableCell>
                      <Typography sx={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#424752', fontWeight: 500 }}>{p.sku}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.84rem', color: '#191c1d' }}>{p.name}</Typography>
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.82rem', color: '#424752' }}>{p.category}</Typography></TableCell>
                    <TableCell>
                      <Typography sx={{
                        fontWeight: 700, fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums',
                        color: p.stock === 0 ? '#93000a' : p.stock < p.reorderPoint ? '#7b3200' : '#191c1d',
                      }}>{p.stock.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.82rem', color: '#727783' }}>{p.reorderPoint}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontWeight: 600, fontSize: '0.84rem', fontVariantNumeric: 'tabular-nums' }}>${p.price.toFixed(2)}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.82rem', color: '#424752', fontVariantNumeric: 'tabular-nums' }}>${p.cost.toFixed(2)}</Typography></TableCell>
                    <TableCell><StatusChip status={p.status} /></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.8rem', color: '#424752' }}>{p.location}</Typography></TableCell>
                    <TableCell sx={{ pr: 2 }}>
                      <Box className="flex items-center gap-0.5">
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => navigate(`/inventory/${p.sku}`)} sx={{ color: '#727783', '&:hover': { color: '#00488d', backgroundColor: '#d6e4f5' } }}>
                            <OpenInNewIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEdit(p)} sx={{ color: '#727783', '&:hover': { color: '#00488d', backgroundColor: '#d6e4f5' } }}>
                            <EditIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDelete(p.id, p.name)} sx={{ color: '#727783', '&:hover': { color: '#ba1a1a', backgroundColor: '#ffdad6' } }}>
                            <DeleteIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div" count={filtered.length} page={page} rowsPerPage={rowsPerPage}
            onPageChange={(_, p) => setPage(p)} rowsPerPageOptions={[8]}
            sx={{ borderTop: 'none', color: '#424752', '& .MuiTablePagination-toolbar': { fontSize: '0.8rem' } }}
          />
        </CardContent>
      </Card>

      <ProductModal open={modalOpen} onClose={() => setModalOpen(false)} editProduct={editProduct} />

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: '10px', fontSize: '0.82rem' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
