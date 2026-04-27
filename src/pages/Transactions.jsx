import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import Header from '../components/layout/Header';
import StatusChip from '../components/common/StatusChip';
import {
  setNewPurchase,
  setNewSale,
  fetchTransactions,
  createPurchaseAPI,
  createSaleAPI,
} from '../store/slices/transactionsSlice';
import { fetchProducts } from '../store/slices/productsSlice';

function TransactionForm({
  type,
  form,
  onChange,
  products,
  onSubmit,
  onClose,
}) {
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 2, pt: 2.5, px: 3 }}>
        <Box className="flex justify-between items-center">
          <Box>
            <Typography
              sx={{ fontWeight: 700, fontSize: '1rem', color: '#191c1d' }}
            >
              New {type} Entry
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#727783' }}>
              Log a {type.toLowerCase()} transaction
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 5, py: 5 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 0 }}>
            <TextField
              fullWidth
              label="SKU"
              value={form.sku}
              onChange={(e) => onChange({ sku: e.target.value })}
              select
              size="small"
            >
              {products.map((p) => (
                <MenuItem key={p.sku} value={p.sku}>
                  {p.sku}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 0 }}>
            <TextField
              fullWidth
              label="Product Name"
              value={form.productName}
              onChange={(e) => onChange({ productName: e.target.value })}
              size="small"
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(33.333% - 11px)', minWidth: 0 }}>
            <TextField
              fullWidth
              label="Qty"
              type="number"
              value={form.qty}
              onChange={(e) => onChange({ qty: e.target.value })}
              size="small"
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(33.333% - 11px)', minWidth: 0 }}>
            <TextField
              fullWidth
              label="Unit Price (₹)"
              type="number"
              value={form.unitPrice}
              onChange={(e) => onChange({ unitPrice: e.target.value })}
              size="small"
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(33.333% - 11px)', minWidth: 0 }}>
            <TextField
              fullWidth
              label="Ref #"
              value={form.reference}
              onChange={(e) => onChange({ reference: e.target.value })}
              size="small"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: '#424752', fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
          sx={{ px: 3 }}
        >
          Submit {type}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Mobile card for a single transaction
function TxnCard({ t, typeColor, typeText }) {
  return (
    <Box
      sx={{
        p: 1,
        mb: 1.5,
        borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 1px 4px rgba(25,28,29,0.05)',
      }}
    >
      <Box className="flex items-start justify-between mb-1">
        <Box className="min-w-0 flex-1 mr-2">
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#191c1d',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {t.productName}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              color: '#727783',
            }}
          >
            {t.sku}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'inline-block',
            px: 1,
            py: 0.3,
            borderRadius: '6px',
            backgroundColor: typeColor[t.type],
            color: typeText[t.type],
            fontWeight: 700,
            fontSize: '0.7rem',
            flexShrink: 0,
          }}
        >
          {t.type}
        </Box>
      </Box>
      <Box className="flex flex-wrap gap-3 mt-1.5">
        <Box>
          <Typography
            sx={{
              fontSize: '0.62rem',
              color: '#727783',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Qty
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.88rem',
              color: t.type === 'Sale' ? '#93000a' : '#00488d',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {t.type === 'Sale' ? `-${t.qty}` : `+${t.qty}`}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: '0.62rem',
              color: '#727783',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Total
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.88rem',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            ₹
            {t.total?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ||
              '0.00'}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: '0.62rem',
              color: '#727783',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Date
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#424752' }}>
            {t.date}
          </Typography>
        </Box>
      </Box>
      <Box className="flex justify-end  mt-1.5">
        <StatusChip status={t.status} />
      </Box>
    </Box>
  );
}

export default function Transactions() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobilePage, setMobilePage] = useState(0);

  const { items, newPurchase, newSale } = useSelector((s) => s.transactions);
  const products = useSelector((s) => s.products.items);

  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [saleOpen, setSaleOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const mappedItems = useMemo(() => {
    return items.map((t) => {
      const isPurchase = t.type === 'Purchase';
      const isSale = t.type === 'Sale';
      const parsedQty = t.quantity || 0;
      const parsedPrice = t.costPrice || 0;

      return {
        ...t,
        id: t._id || t.id,
        type: isPurchase
          ? 'Purchase'
          : isSale
            ? 'Sale'
            : t.type || 'Adjustment',
        sku: t.productId?.sku,
        productName: t.productId?.name,
        qty: Math.abs(parsedQty),
        unitPrice: parsedPrice,
        total: t.totalAmount || t.total || Math.abs(parsedQty) * parsedPrice,
        date: t.createdAt
          ? new Date(t.createdAt).toLocaleString()
          : t.date || '-',
      };
    });
  }, [items]);

  const MOBILE_PAGE_SIZE = 8;
  const mobilePagedItems = mappedItems.slice(
    mobilePage * MOBILE_PAGE_SIZE,
    (mobilePage + 1) * MOBILE_PAGE_SIZE,
  );
  useEffect(() => {
    // dispatch(fetchProducts());
    dispatch(fetchTransactions());
  }, [dispatch]);

  // const paginated = filtered.slice(page * ROWS, page * ROWS + ROWS);

  const submitPurchase = () => {
    if (!newPurchase.sku || !newPurchase.quantity) return;
    dispatch(
      createPurchaseAPI({
        ...newPurchase,
        quantity: Number(newPurchase.quantity),
        unitPrice: Number(newPurchase.costPrice),
        productId: products.find((p) => p.sku === newPurchase.sku)?._id,
      }),
    );
    setPurchaseOpen(false);
    setSnackbar({
      open: true,
      message: 'Purchase logged!',
      severity: 'success',
    });
  };

  const submitSale = () => {
    if (!newSale.sku || !newSale.qty) return;
    dispatch(
      createSaleAPI({
        ...newSale,
        quantity: Number(newSale.qty),
        unitPrice: Number(newSale.unitPrice),
        productId: products.find((p) => p.sku === newSale.sku)?._id,
      }),
    );
    setSaleOpen(false);
    setSnackbar({ open: true, message: 'Sale recorded!', severity: 'success' });
  };

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
  const columns = useMemo(
    () => [
      {
        field: 'type',
        headerName: 'Type',
        minWidth: 150,
        flex: 1,
        renderCell: (params) => (
          <Box
            sx={{
              px: 1,
              py: 0.2,
              textAlign: 'center',
              borderRadius: '6px',
              backgroundColor: typeColor[params.value],
              color: typeText[params.value],
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            {params.value}
          </Box>
        ),
      },
      { field: 'sku', headerName: 'SKU', minWidth: 120, flex: 1 },
      { field: 'productName', headerName: 'Product', minWidth: 180, flex: 1 },
      { field: 'qty', headerName: 'Qty', minWidth: 90, flex: 1 },
      {
        field: 'unitPrice',
        headerName: 'Unit Price',
        minWidth: 120,
        flex: 1,
        valueFormatter: (v) => `₹${Number(v || 0).toFixed(2)}`,
      },
      {
        field: 'total',
        headerName: 'Total',
        minWidth: 130,
        flex: 1,
        valueFormatter: (v) =>
          `₹${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      },
      { field: 'date', headerName: 'Date', minWidth: 180 },
    ],
    [typeColor, typeText],
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
        title="Transactions"
        subtitle="Log and monitor inventory movements."
      />

      {/* Stats */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <StatCard
          title="Sales Revenue"
          value={`₹${(totalSales / 1000).toFixed(1)}K`}
          subtitle="Completed sales"
          trend={4.2}
          accentColor="#a8c8ff"
          icon={<ReceiptLongIcon sx={{ fontSize: 16 }} />}
        />
        <StatCard
          title="Total Purchases"
          value={`₹${(totalPurchases / 1000).toFixed(1)}K`}
          subtitle="Purchase orders"
          trend={-1.1}
          accentColor="#ffb691"
          icon={<AddIcon sx={{ fontSize: 16 }} />}
        />
        <StatCard
          title="Units Out"
          value={`-${totalUnitsOut}`}
          subtitle="Units sold"
          trend={-3.2}
          trendLabel="Net Change"
          accentColor="#bac8d8"
          icon={<TrendingDownIcon sx={{ fontSize: 16 }} />}
        />
      </div> */}

      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Toolbar */}
          <Box sx={{ p: { xs: 2, md: 3 }, pb: 2 }}>
            <Box className="flex flex-col gap-3 " sx={{ marginBottom: '10px' }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: '#191c1d',
                  fontSize: { xs: '0.88rem', md: '0.95rem' },
                }}
              >
                Transaction History
              </Typography>
              <Box className="flex  gap-4  ">
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => setPurchaseOpen(true)}
                  sx={{
                    width: '100%',
                    padding: '20px',
                    borderColor: '#a8c8ff',
                    color: '#00488d',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    '&:hover': {
                      borderColor: '#00488d',
                      backgroundColor: '#d6e4f5',
                    },
                  }}
                >
                  + Purchase
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={() => setSaleOpen(true)}
                  sx={{
                    fontSize: '0.75rem',
                    width: '100%',
                    padding: '20px',
                  }}
                >
                  + Sale
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Mobile cards | Desktop table */}
          {isMobile ? (
            <Box sx={{ p: 2 }}>
              {mobilePagedItems.map((t) => (
                <TxnCard
                  key={t.id}
                  t={t}
                  typeColor={typeColor}
                  typeText={typeText}
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
              rows={mappedItems}
              columns={columns}
              getRowId={(row) => row.id}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 8, page: 0 } },
              }}
              disableRowSelectionOnClick
            />
          )}
        </CardContent>
      </Card>

      {purchaseOpen && (
        <TransactionForm
          type="Purchase"
          form={newPurchase}
          products={products}
          onChange={(v) => dispatch(setNewPurchase(v))}
          onSubmit={submitPurchase}
          onClose={() => setPurchaseOpen(false)}
        />
      )}
      {saleOpen && (
        <TransactionForm
          type="Sale"
          form={newSale}
          products={products}
          onChange={(v) => dispatch(setNewSale(v))}
          onSubmit={submitSale}
          onClose={() => setSaleOpen(false)}
        />
      )}

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
