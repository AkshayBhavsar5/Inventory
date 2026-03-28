import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, Button, TextField, MenuItem,
  InputAdornment, Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, TablePagination, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, IconButton, Snackbar, Alert, Tabs, Tab, Divider,
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
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#191c1d' }}>
              New {type} Entry
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#727783' }}>
              Log a {type.toLowerCase()} transaction
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField fullWidth label="SKU" value={form.sku} onChange={e => onChange({ sku: e.target.value })}
              select size="small">
              {products.map(p => <MenuItem key={p.sku} value={p.sku}>{p.sku}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Product Name" value={form.productName}
              onChange={e => onChange({ productName: e.target.value })} size="small" />
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth label="Quantity" type="number" value={form.qty}
              onChange={e => onChange({ qty: e.target.value })} size="small" />
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth label="Unit Price ($)" type="number" value={form.unitPrice}
              onChange={e => onChange({ unitPrice: e.target.value })} size="small" />
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth label="Reference #" value={form.reference}
              onChange={e => onChange({ reference: e.target.value })} size="small" />
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

export default function Transactions() {
  const dispatch   = useDispatch();
  const { items, filters, newPurchase, newSale } = useSelector(s => s.transactions);
  const products   = useSelector(s => s.products.items);

  const [page, setPage]           = useState(0);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [saleOpen, setSaleOpen]   = useState(false);
  const [snackbar, setSnackbar]   = useState({ open: false, message: '', severity: 'success' });

  const filtered = useMemo(() => {
    return items.filter(t => {
      const matchSearch = !filters.search ||
        t.productName.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.sku.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.id.toLowerCase().includes(filters.search.toLowerCase());
      const matchType = filters.type === 'All' || t.type === filters.type;
      return matchSearch && matchType;
    });
  }, [items, filters]);

  const paginated = filtered.slice(page * 8, page * 8 + 8);

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
    setSnackbar({ open: true, message: 'Purchase logged successfully!', severity: 'success' });
  };

  const submitSale = () => {
    if (!newSale.sku || !newSale.qty) return;
    dispatch(addTransaction({ ...newSale, type: 'Sale', qty: Number(newSale.qty), unitPrice: Number(newSale.unitPrice), total: Number(newSale.qty) * Number(newSale.unitPrice), by: 'Admin' }));
    const prod = products.find(p => p.sku === newSale.sku);
    if (prod) dispatch(updateProduct({ ...prod, stock: Math.max(0, prod.stock - Number(newSale.qty)) }));
    dispatch(resetNewSale());
    setSaleOpen(false);
    setSnackbar({ open: true, message: 'Sale recorded successfully!', severity: 'success' });
  };

  const typeColor = { Purchase: '#d6e3ff', Sale: '#d6e4f5', Adjustment: '#e1e3e4' };
  const typeText  = { Purchase: '#001b3d', Sale: '#00488d', Adjustment: '#424752' };

  return (
    <Box>
      <Header title="Transactions" subtitle="Log and monitor global inventory movements." />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Sales Revenue" value={`$${(totalSales / 1000).toFixed(1)}K`}
          subtitle="All completed sales" trend={4.2} accentColor="#a8c8ff"
          icon={<ReceiptLongIcon sx={{ fontSize: 18 }} />} />
        <StatCard title="Total Purchases" value={`$${(totalPurchases / 1000).toFixed(1)}K`}
          subtitle="All purchase orders" trend={-1.1} accentColor="#ffb691"
          icon={<AddIcon sx={{ fontSize: 18 }} />} />
        <StatCard title="Net Units Out" value={`-${totalUnitsOut.toLocaleString()}`}
          subtitle="Units sold" trend={-3.2} trendLabel="Net Change"
          accentColor="#bac8d8" icon={<TrendingDownIcon sx={{ fontSize: 18 }} />} />
      </div>

      {/* Table card */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Toolbar */}
          <Box className="flex flex-wrap items-center justify-between gap-3 p-4 pb-3">
            <Typography sx={{ fontWeight: 700, color: '#191c1d', fontSize: '0.95rem' }}>Transaction History</Typography>
            <Box className="flex flex-wrap items-center gap-2">
              <TextField size="small" placeholder="Search transactions…" value={filters.search}
                onChange={e => dispatch(setFilters({ search: e.target.value }))}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: '#727783' }} /></InputAdornment> }}
                sx={{ width: 200 }} />
              <TextField select size="small" value={filters.type}
                onChange={e => dispatch(setFilters({ type: e.target.value }))} sx={{ width: 130 }}>
                {TX_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
              <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={() => setPurchaseOpen(true)}
                sx={{ borderColor: '#a8c8ff', color: '#00488d', fontWeight: 600, '&:hover': { borderColor: '#00488d', backgroundColor: '#d6e4f5' } }}>
                Purchase
              </Button>
              <Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} onClick={() => setSaleOpen(true)}>
                Sale
              </Button>
            </Box>
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Txn ID', 'Type', 'SKU', 'Product', 'Qty', 'Unit Price', 'Total', 'Date', 'Reference', 'By', 'Status'].map(h => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} sx={{ textAlign: 'center', py: 5, color: '#727783' }}>
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : paginated.map(t => (
                  <TableRow key={t.id} sx={{ '&:hover': { backgroundColor: '#f2f4f5' } }}>
                    <TableCell><Typography sx={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#424752', fontWeight: 500 }}>{t.id}</Typography></TableCell>
                    <TableCell>
                      <Box sx={{ display: 'inline-block', px: 1, py: 0.3, borderRadius: '6px', backgroundColor: typeColor[t.type], color: typeText[t.type], fontWeight: 600, fontSize: '0.72rem' }}>
                        {t.type}
                      </Box>
                    </TableCell>
                    <TableCell><Typography sx={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{t.sku}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#191c1d', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.productName}</Typography></TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.84rem', fontVariantNumeric: 'tabular-nums', color: t.type === 'Sale' ? '#93000a' : t.type === 'Purchase' ? '#00488d' : '#424752' }}>
                        {t.type === 'Sale' ? `-${t.qty}` : `+${t.qty}`}
                      </Typography>
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.82rem', fontVariantNumeric: 'tabular-nums' }}>${t.unitPrice.toFixed(2)}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontWeight: 700, fontSize: '0.84rem', fontVariantNumeric: 'tabular-nums' }}>${t.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.8rem', color: '#424752' }}>{t.date}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#424752' }}>{t.reference}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.8rem', color: '#424752' }}>{t.by}</Typography></TableCell>
                    <TableCell><StatusChip status={t.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination component="div" count={filtered.length} page={page} rowsPerPage={8}
            onPageChange={(_, p) => setPage(p)} rowsPerPageOptions={[8]}
            sx={{ borderTop: 'none', color: '#424752' }} />
        </CardContent>
      </Card>

      {purchaseOpen && (
        <TransactionForm type="Purchase" form={newPurchase} products={products}
          onChange={v => dispatch(setNewPurchase(v))} onSubmit={submitPurchase} onClose={() => setPurchaseOpen(false)} />
      )}
      {saleOpen && (
        <TransactionForm type="Sale" form={newSale} products={products}
          onChange={v => dispatch(setNewSale(v))} onSubmit={submitSale} onClose={() => setSaleOpen(false)} />
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: '10px', fontSize: '0.82rem' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
