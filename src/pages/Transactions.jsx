import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, Button, TextField, MenuItem,
  InputAdornment, Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, TablePagination, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, IconButton, Snackbar, Alert, Divider,
  useMediaQuery, useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Header from '../components/layout/Header';
import StatCard from '../components/common/StatCard';
import StatusChip from '../components/common/StatusChip';
import { addTransaction, setFilters, setNewPurchase, setNewSale, resetNewPurchase, resetNewSale } from '../store/slices/transactionsSlice';
import { updateProduct } from '../store/slices/productsSlice';

const TX_TYPES = ['All', 'Purchase', 'Sale', 'Adjustment'];

function TransactionForm({ type, form, onChange, products, onSubmit, onClose }) {
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, pt: 2.5, px: 3 }}>
        <Box className="flex justify-between items-center">
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#191c1d' }}>New {type} Entry</Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#727783' }}>Log a {type.toLowerCase()} transaction</Typography>
          </Box>
          <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField fullWidth label="SKU" value={form.sku} onChange={e => onChange({ sku: e.target.value })} select size="small">
              {products.map(p => <MenuItem key={p.sku} value={p.sku}>{p.sku}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Product Name" value={form.productName} onChange={e => onChange({ productName: e.target.value })} size="small" />
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth label="Qty" type="number" value={form.qty} onChange={e => onChange({ qty: e.target.value })} size="small" />
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth label="Unit Price ($)" type="number" value={form.unitPrice} onChange={e => onChange({ unitPrice: e.target.value })} size="small" />
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth label="Ref #" value={form.reference} onChange={e => onChange({ reference: e.target.value })} size="small" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: '#424752', fontWeight: 600 }}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={onSubmit} sx={{ px: 3 }}>Submit {type}</Button>
      </DialogActions>
    </Dialog>
  );
}

// Mobile card for a single transaction
function TxnCard({ t, typeColor, typeText }) {
  return (
    <Box sx={{ p: 2, mb: 1.5, borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(25,28,29,0.05)' }}>
      <Box className="flex items-start justify-between mb-1">
        <Box className="min-w-0 flex-1 mr-2">
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#191c1d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.productName}</Typography>
          <Typography sx={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#727783' }}>{t.sku}</Typography>
        </Box>
        <Box sx={{ display: 'inline-block', px: 1, py: 0.3, borderRadius: '6px', backgroundColor: typeColor[t.type], color: typeText[t.type], fontWeight: 700, fontSize: '0.7rem', flexShrink: 0 }}>
          {t.type}
        </Box>
      </Box>
      <Box className="flex flex-wrap gap-3 mt-1.5">
        <Box>
          <Typography sx={{ fontSize: '0.62rem', color: '#727783', textTransform: 'uppercase', fontWeight: 600 }}>Qty</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: t.type === 'Sale' ? '#93000a' : '#00488d', fontVariantNumeric: 'tabular-nums' }}>
            {t.type === 'Sale' ? `-${t.qty}` : `+${t.qty}`}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.62rem', color: '#727783', textTransform: 'uppercase', fontWeight: 600 }}>Total</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', fontVariantNumeric: 'tabular-nums' }}>${t.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.62rem', color: '#727783', textTransform: 'uppercase', fontWeight: 600 }}>Date</Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#424752' }}>{t.date}</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.62rem', color: '#727783', textTransform: 'uppercase', fontWeight: 600 }}>By</Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#424752' }}>{t.by}</Typography>
        </Box>
      </Box>
      <Box className="flex items-center justify-between mt-1.5">
        <Typography sx={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#727783' }}>{t.id} · {t.reference}</Typography>
        <StatusChip status={t.status} />
      </Box>
    </Box>
  );
}

export default function Transactions() {
  const dispatch = useDispatch();
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { items, filters, newPurchase, newSale } = useSelector(s => s.transactions);
  const products = useSelector(s => s.products.items);

  const [page, setPage]             = useState(0);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [saleOpen, setSaleOpen]     = useState(false);
  const [snackbar, setSnackbar]     = useState({ open: false, message: '', severity: 'success' });
  const ROWS = isMobile ? 5 : 8;

  const filtered = useMemo(() => items.filter(t => {
    const matchSearch = !filters.search ||
      t.productName.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.sku.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.id.toLowerCase().includes(filters.search.toLowerCase());
    const matchType = filters.type === 'All' || t.type === filters.type;
    return matchSearch && matchType;
  }), [items, filters]);

  const paginated = filtered.slice(page * ROWS, page * ROWS + ROWS);

  const totalSales     = items.filter(t => t.type === 'Sale').reduce((s, t) => s + t.total, 0);
  const totalPurchases = items.filter(t => t.type === 'Purchase').reduce((s, t) => s + t.total, 0);
  const totalUnitsOut  = items.filter(t => t.type === 'Sale').reduce((s, t) => s + t.qty, 0);

  const submitPurchase = () => {
    if (!newPurchase.sku || !newPurchase.qty) return;
    dispatch(addTransaction({ ...newPurchase, type: 'Purchase', qty: Number(newPurchase.qty), unitPrice: Number(newPurchase.unitPrice), total: Number(newPurchase.qty) * Number(newPurchase.unitPrice), by: 'Admin' }));
    const prod = products.find(p => p.sku === newPurchase.sku);
    if (prod) dispatch(updateProduct({ ...prod, stock: prod.stock + Number(newPurchase.qty) }));
    dispatch(resetNewPurchase());
    setPurchaseOpen(false);
    setSnackbar({ open: true, message: 'Purchase logged!', severity: 'success' });
  };

  const submitSale = () => {
    if (!newSale.sku || !newSale.qty) return;
    dispatch(addTransaction({ ...newSale, type: 'Sale', qty: Number(newSale.qty), unitPrice: Number(newSale.unitPrice), total: Number(newSale.qty) * Number(newSale.unitPrice), by: 'Admin' }));
    const prod = products.find(p => p.sku === newSale.sku);
    if (prod) dispatch(updateProduct({ ...prod, stock: Math.max(0, prod.stock - Number(newSale.qty)) }));
    dispatch(resetNewSale());
    setSaleOpen(false);
    setSnackbar({ open: true, message: 'Sale recorded!', severity: 'success' });
  };

  const typeColor = { Purchase: '#d6e3ff', Sale: '#d6e4f5', Adjustment: '#e1e3e4' };
  const typeText  = { Purchase: '#001b3d', Sale: '#00488d', Adjustment: '#424752' };

  return (
    <Box>
      <Header title="Transactions" subtitle="Log and monitor inventory movements." />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <StatCard title="Sales Revenue"  value={`$${(totalSales / 1000).toFixed(1)}K`}      subtitle="Completed sales"     trend={4.2}  accentColor="#a8c8ff" icon={<ReceiptLongIcon sx={{ fontSize: 16 }} />} />
        <StatCard title="Total Purchases" value={`$${(totalPurchases / 1000).toFixed(1)}K`} subtitle="Purchase orders"      trend={-1.1} accentColor="#ffb691" icon={<AddIcon sx={{ fontSize: 16 }} />} />
        <StatCard title="Units Out"       value={`-${totalUnitsOut}`}                        subtitle="Units sold"           trend={-3.2} trendLabel="Net Change" accentColor="#bac8d8" icon={<TrendingDownIcon sx={{ fontSize: 16 }} />} />
      </div>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Toolbar */}
          <Box sx={{ p: { xs: 2, md: 3 }, pb: 2 }}>
            <Box className="flex items-center justify-between mb-3">
              <Typography sx={{ fontWeight: 700, color: '#191c1d', fontSize: { xs: '0.88rem', md: '0.95rem' } }}>
                Transaction History
              </Typography>
              <Box className="flex gap-2">
                <Button variant="outlined" size="small" onClick={() => setPurchaseOpen(true)}
                  sx={{ borderColor: '#a8c8ff', color: '#00488d', fontWeight: 600, fontSize: '0.75rem', '&:hover': { borderColor: '#00488d', backgroundColor: '#d6e4f5' } }}>
                  + Purchase
                </Button>
                <Button variant="contained" color="primary" size="small" onClick={() => setSaleOpen(true)} sx={{ fontSize: '0.75rem' }}>
                  + Sale
                </Button>
              </Box>
            </Box>
            <Box className="flex flex-wrap gap-2">
              <TextField size="small" placeholder="Search…" value={filters.search}
                onChange={e => dispatch(setFilters({ search: e.target.value }))}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 15, color: '#727783' }} /></InputAdornment> }}
                sx={{ flex: '1 1 140px', minWidth: 0 }} />
              <TextField select size="small" value={filters.type}
                onChange={e => dispatch(setFilters({ type: e.target.value }))} sx={{ flex: '1 1 110px', minWidth: 0 }}>
                {TX_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Box>
          </Box>

          {/* Mobile cards | Desktop table */}
          {isMobile ? (
            <Box sx={{ px: 2, pb: 1 }}>
              {paginated.length === 0 ? (
                <Typography sx={{ textAlign: 'center', py: 4, color: '#727783', fontSize: '0.88rem' }}>No transactions found.</Typography>
              ) : paginated.map(t => <TxnCard key={t.id} t={t} typeColor={typeColor} typeText={typeText} />)}
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 960 }}>
                <TableHead>
                  <TableRow>
                    {['Txn ID', 'Type', 'SKU', 'Product', 'Qty', 'Unit Price', 'Total', 'Date', 'Ref', 'By', 'Status'].map(h => (
                      <TableCell key={h}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow><TableCell colSpan={11} sx={{ textAlign: 'center', py: 5, color: '#727783' }}>No transactions found.</TableCell></TableRow>
                  ) : paginated.map(t => (
                    <TableRow key={t.id} sx={{ '&:hover': { backgroundColor: '#f2f4f5' } }}>
                      <TableCell><Typography sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#424752', fontWeight: 500 }}>{t.id}</Typography></TableCell>
                      <TableCell><Box sx={{ display: 'inline-block', px: 1, py: 0.3, borderRadius: '6px', backgroundColor: typeColor[t.type], color: typeText[t.type], fontWeight: 700, fontSize: '0.7rem' }}>{t.type}</Box></TableCell>
                      <TableCell><Typography sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{t.sku}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#191c1d', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.productName}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontWeight: 700, fontSize: '0.84rem', fontVariantNumeric: 'tabular-nums', color: t.type === 'Sale' ? '#93000a' : t.type === 'Purchase' ? '#00488d' : '#424752' }}>{t.type === 'Sale' ? `-${t.qty}` : `+${t.qty}`}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.82rem', fontVariantNumeric: 'tabular-nums' }}>${t.unitPrice.toFixed(2)}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontWeight: 700, fontSize: '0.84rem', fontVariantNumeric: 'tabular-nums' }}>${t.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.8rem', color: '#424752' }}>{t.date}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#424752' }}>{t.reference}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.8rem', color: '#424752' }}>{t.by}</Typography></TableCell>
                      <TableCell><StatusChip status={t.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <TablePagination component="div" count={filtered.length} page={page} rowsPerPage={ROWS}
            onPageChange={(_, p) => setPage(p)} rowsPerPageOptions={[ROWS]}
            sx={{ borderTop: 'none', color: '#424752', '& .MuiTablePagination-toolbar': { fontSize: '0.78rem' } }} />
        </CardContent>
      </Card>

      {purchaseOpen && <TransactionForm type="Purchase" form={newPurchase} products={products} onChange={v => dispatch(setNewPurchase(v))} onSubmit={submitPurchase} onClose={() => setPurchaseOpen(false)} />}
      {saleOpen     && <TransactionForm type="Sale"     form={newSale}     products={products} onChange={v => dispatch(setNewSale(v))}     onSubmit={submitSale}     onClose={() => setSaleOpen(false)} />}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: '10px', fontSize: '0.82rem' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
