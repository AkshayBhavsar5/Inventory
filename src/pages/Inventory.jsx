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
import { deleteProductAPI, setFilters } from '../store/slices/productsSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import { DataGrid } from '@mui/x-data-grid';

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
            ₹{p.price}
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
        {/* <IconButton
          size="small"
          onClick={() => onView(p.sku)}
          sx={{
            color: '#727783',
            '&:hover': { color: '#00488d', backgroundColor: '#d6e4f5' },
          }}
        >
          <OpenInNewIcon sx={{ fontSize: 16 }} />
        </IconButton> */}
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

  const { products, filters } = useSelector((s) => s.products);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [mobilePage, setMobilePage] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const CATEGORIES = [
    'All',
    'Electronics',
    'Home & Kitchen',
    'Apparel',
    'Accessories',
    'Sports',
  ];

  const mappedItems = useMemo(() => {
    return products.map((p) => ({
      ...p,
      // id: p.id, // required by DataGrid
      sku: p.sku || '-',
      name: p.name || '-',
      category: p.category || '-',
      quantity: Number(p.quantity || 0),
      sellingPrice: Number(p.sellingPrice || 0),
      costPrice: Number(p.costPrice || 0),
      reorderPoint: Number(p.reorderPoint || 0),
      status: p.status || 'In Stock',
      location: p.location || '-',
    }));
  }, [products]);
  const STATUSES = ['All', 'In Stock', 'Low Stock', 'Out of Stock', 'Critical'];
  const rows = useMemo(
    () =>
      products.map((p) => ({
        ...p,
        id: p._id,
        stockQty: Number(p.quantity || 0),
        sellingPriceNum: Number(p.sellingPrice || 0),
        costPriceNum: Number(p.costPrice || 0),
      })),
    [products],
  );
  const columns = useMemo(
    () => [
      // { field: '_id', headerName: 'ID', minWidth: 90, flex: 0.8 ,},
      { field: 'sku', headerName: 'SKU', minWidth: 130, flex: 0.5 },
      { field: 'name', headerName: 'Product Name', minWidth: 180, flex: 1 },
      { field: 'category', headerName: 'Category', minWidth: 140, flex: 1 },
      {
        field: 'stockQty',
        headerName: 'Stock',
        minWidth: 100,
        flex: 0.5,
        renderCell: (params) => {
          const row = params.row;
          const qty = Number(row.stockQty || 0);
          const color =
            qty === 0
              ? '#93000a'
              : qty < Number(row.reorderPoint || 0)
                ? '#7b3200'
                : '#191c1d';
          return (
            <Typography sx={{ fontWeight: 700, color }}>
              {qty.toLocaleString()}
            </Typography>
          );
        },
      },
      {
        field: 'sellingPriceNum',
        headerName: 'Selling Price',
        minWidth: 140,
        valueFormatter: (value) => `₹${Number(value || 0).toFixed(2)}`,
      },
      {
        field: 'costPriceNum',
        headerName: 'Cost Price',
        minWidth: 130,
        valueFormatter: (value) => `₹${Number(value || 0).toFixed(2)}`,
      },
      // {
      //   field: 'status',
      //   headerName: 'Status',
      //   minWidth: 130,
      //   renderCell: (params) => <StatusChip status={params.value} />,
      // },
      {
        field: 'actions',
        headerName: 'Actions',
        minWidth: 140,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box className="flex gap-0.5">
            {/* <IconButton
              size="small"
              onClick={() => navigate(`/inventory/${params.row.sku}`)}
            >
              <OpenInNewIcon sx={{ fontSize: 18 }} />
            </IconButton> */}
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
              <EditIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.id, params.row.name)}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        ),
      },
    ],
    [navigate],
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (id, name) => {
    dispatch(deleteProductAPI(id));
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

  const totalValue = products.reduce(
    (s, p) => s + p.quantity * p.sellingPrice,
    0,
  );
  const lowStockCount = products.filter(
    (p) => p.status === 'Low Stock' || p.status === 'Critical',
  ).length;
  // const healthPct =
  //   items.length > 0
  //     ? (
  //         (items.filter((p) => p.status === 'In Stock').length / items.length) *
  //         100
  //       ).toFixed(1)
  //     : '0.0';
  const typeColor = {
    Purchase: '#d6e3ff',
    Sale: '#d6e4f5',
    Adjustment: '#e1e3e4',
  };
  const typeText = {
    Purchase: '#001b3d',
    Sale: '#00488d',
    Adjustment: '#424752',
  };
  const locationsCount = new Set(products.map((p) => p.location)).size || 0;
  const MOBILE_PAGE_SIZE = 8;
  const mobilePagedItems = mappedItems.slice(
    mobilePage * MOBILE_PAGE_SIZE,
    (mobilePage + 1) * MOBILE_PAGE_SIZE,
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      }}
    >
      <Header
        title="Inventory"
        subtitle={`${products.length} items · ${locationsCount} locations`}
      />

      {/* Stats — 2 col on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4 cursor-pointer">
        <StatCard
          title="Valuation"
          value={`₹${totalValue.toLocaleString()}`}
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
        {/* <StatCard
          title="Shipments"
          value="---" // Removed static "12 Pending"
          subtitle="No pending orders"
          trend={0}
          accentColor="#d6e4f5"
          icon={<LocalShippingIcon sx={{ fontSize: 16 }} />}
        /> */}
        {/* <StatCard
          title="Health"
          value={`${healthPct}%`}
          subtitle="vs last month"
          trend={0.4}
          accentColor="#bac8d8"
          icon={<FavoriteIcon sx={{ fontSize: 16 }} />}
        /> */}
      </div>

      {/* Main card */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Toolbar */}
          <Box
            sx={{
              p: { xs: 2, md: 3 },
              pb: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <Box className="flex items-center justify-between  mb-3">
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
                sx={{ flex: '1 1 150px', minWidth: 0 }}
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
            <Box sx={{ p: 2 }}>
              {mobilePagedItems.map((t) => (
                <ProductCard
                  key={t.id}
                  p={t}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={(sku) => navigate(`/inventory/${sku}`)}
                />
              ))}
              <Box className="flex justify-between items-center mt-2">
                <Button
                  size="small"
                  disabled={mobilePage === 0}
                  onClick={() => setMobilePage((p) => p - 1)}
                  sx={{ fontSize: '0.75rem', color: '#00488d' }}
                >
                  ← Prev
                </Button>
                <Typography sx={{ fontSize: '0.75rem', color: '#727783' }}>
                  {mobilePage * MOBILE_PAGE_SIZE + 1}–
                  {Math.min(
                    (mobilePage + 1) * MOBILE_PAGE_SIZE,
                    mappedItems.length,
                  )}{' '}
                  of {mappedItems.length}
                </Typography>
                <Button
                  size="small"
                  disabled={
                    (mobilePage + 1) * MOBILE_PAGE_SIZE >= mappedItems.length
                  }
                  onClick={() => setMobilePage((p) => p + 1)}
                  sx={{ fontSize: '0.75rem', color: '#00488d' }}
                >
                  Next →
                </Button>
              </Box>
            </Box>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.id}
              pageSizeOptions={[8, 16, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 8, page: 0 } },
              }}
              disableRowSelectionOnClick
            />
          )}
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
